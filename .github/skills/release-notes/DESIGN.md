# Release Notes System — Design

How the automated release notes system for .NET works, why it's designed this way, and how the pieces connect.

## Problem

.NET ships ~25 component repositories assembled into a single product via the VMR (`dotnet/dotnet`). Release notes need to reflect exactly what ships — not what's planned, not what's in progress, not what was reverted. Historically, release notes are written manually by gathering information from component teams. This is slow, error-prone, and tends to miss features or include things that didn't actually ship.

## Goals

1. **High fidelity** — only document what ships. The VMR `source-manifest.json` is the source of truth for what code is included in a release.
2. **High value** — bias toward features users care about. Not every merged PR is worth a release note.
3. **Never document non-shipping features** — if it's not in the VMR diff, it didn't ship.
4. **Incremental** — drafts improve over time as previews mature and humans provide feedback.
5. **Human-in-the-loop** — humans edit the release notes branch and comment on the PR. The system adapts to their input rather than overwriting it.

## Architecture

The system has three layers, each with a distinct responsibility:

```text
┌─────────────────────────────────────────────────┐
│           Agentic Workflow (cron)                │
│  .github/workflows/release-notes.md             │
│  Orchestration: branch lifecycle, PR mgmt,      │
│  human interaction, scheduling                  │
├─────────────────────────────────────────────────┤
│           AI Agent (editorial)                  │
│  Reads changes.json → writes markdown           │
│  Judgment: which PRs matter, how to describe    │
│  them, code samples, feature grouping           │
├─────────────────────────────────────────────────┤
│           dotnet-release tool (deterministic)   │
│  `dotnet-release generate changes`              │
│  Data: source-manifest diff → GitHub API →      │
│  changes.json                                   │
└─────────────────────────────────────────────────┘
```

### Why three layers?

- **The tool** handles mechanical data collection. It's deterministic — same inputs always produce the same output. It can be tested, debugged, and improved independently.
- **The agent** handles editorial judgment. It decides which PRs are worth writing about and how to describe them. This is inherently fuzzy and benefits from AI.
- **The workflow** handles orchestration. It knows when to run, what branches to manage, how to interact with humans, and how to preserve their edits.

## Layer 1 — The Tool

[`dotnet-release`](https://github.com/richlander/dotnet-release) is a .NET global tool. The `generate changes` command produces `changes.json`:

```bash
dotnet-release generate changes <vmr-clone-path> \
  --base <previous-release-tag> \
  --head <current-release-ref> \
  --version "11.0.0-preview.3" \
  --date "2026-04-08" \
  --labels \
  --output release-notes/11.0/preview/preview3/changes.json
```

### What the tool does

1. **Reads `src/source-manifest.json`** at both refs via local git — this is the VMR bill of materials listing every component repo with its exact commit SHA
2. **Diffs the manifests** to identify which components changed and their commit ranges
3. **Queries GitHub compare API** for each changed component to enumerate merged PRs in the commit range
4. **Maps repos to product slugs** using a built-in taxonomy (e.g., `runtime` → `dotnet-runtime`; infra repos get no product)
5. **Fetches PR labels** when `--labels` is provided (useful for agent categorization)
6. **Cross-references CVEs** when `--cve-repo` is provided (loads `cve.json` from the `release-index` branch)
7. **Outputs `changes.json`** following the [changes schema](references/changes-schema.md)

### What the tool does NOT do

- Editorial judgment (which PRs are important)
- Markdown generation
- Branch management or PR creation

### Source-manifest.json — the key mechanism

The VMR's `src/source-manifest.json` is a JSON bill of materials:

```json
{
  "repositories": [
    {
      "path": "runtime",
      "remoteUri": "https://github.com/dotnet/runtime",
      "commitSha": "d3439749b652966f8283f2d01c972bc8c4dc3ec3"
    }
  ]
}
```

By comparing this file at two release points, the tool gets exact per-component commit ranges. This replaces any need to parse VMR sync commits, trace codeflow PRs, or calculate fork points. One JSON diff gives everything.

Example (Preview 1 → Preview 2): the tool found 1,389 PRs across 21 changed repos.

## Layer 2 — The Agent

The AI agent reads `changes.json` and writes markdown release notes. Its guidance comes from reference documents in `.github/skills/release-notes/references/`:

| Document | Purpose |
| -------- | ------- |
| [quality-bar.md](references/quality-bar.md) | North star — fidelity, value, WHY+HOW |
| [vmr-structure.md](references/vmr-structure.md) | VMR branches, tags, source-manifest.json |
| [changes-schema.md](references/changes-schema.md) | The changes.json schema |
| [component-mapping.md](references/component-mapping.md) | Components → product slugs → output files |
| [format-template.md](references/format-template.md) | Markdown document structure |
| [editorial-rules.md](references/editorial-rules.md) | Tone, attribution, naming |

These are **goal-oriented**, not procedural. They describe what good release notes look like, not the exact steps to produce them. The agent figures out the HOW.

### Agent responsibilities

- **Triage** — read `changes.json` and identify which PRs are worth writing about. Use the [component mapping](references/component-mapping.md) to route changes from `repo` to the correct output files.
- **Write** — produce markdown release notes for high-value features, following the quality bar
- **Verify** — use `dotnet-inspect` against nightly builds when needed to confirm public API changes
- **Respect edits** — diff the PR branch to see what humans have changed and preserve their work
- **Respond** — read PR comments and incorporate human feedback

## Layer 3 — The Agentic Workflow

A [GitHub Agentic Workflow](https://github.github.com/gh-aw/) defined in `.github/workflows/release-notes.md`. It runs on a daily cron schedule and manages the full lifecycle:

### Milestone detection

The workflow determines which milestone needs release notes using three data sources:

1. **`releases.json`** (this repo) — the list of shipped releases. The latest entry tells you the most recently shipped preview and provides the baseline.
2. **`eng/Versions.props`** (VMR `main` branch) — `PreReleaseVersionIteration` tells you which milestone `main` is currently building.
3. **VMR tags** — `v{major}.0.0-preview.{N}.{build}` tags identify the exact commit that shipped each preview, providing the `--base` ref for generating diffs.

The decision is deterministic: if the iteration on `main` is ahead of the latest shipped release, that's the target milestone. If they match, there's nothing new to do.

### PR lifecycle

For the target milestone:

1. **No PR exists** → create branch, run tool, write initial drafts, open draft PR
2. **PR exists, source changed** → regenerate `changes.json`, add/update markdown sections
3. **PR exists, human edited** → preserve human edits, only touch untouched sections
4. **Milestone just shipped** (new tag appeared) → final regeneration with `--head <tag>` for exact shipped content

### Safe outputs

The workflow uses these safe-outputs (the only ways it can modify state):

- `create-pull-request` — create new release notes PRs
- `push-to-pull-request-branch` — update existing PR branches
- `add-comment` — comment on PRs with update summaries

### Schedule

- Previews ship monthly, February through October (typically patch Tuesday)
- RC1 in ~September, RC2 in ~October, GA in November
- The workflow runs daily but only does meaningful work when the VMR state has changed

## Output files

Each release milestone produces these files in `release-notes/{major.minor}/preview/{previewN}/`:

| File | Source | Description |
| ---- | ------ | ----------- |
| `changes.json` | Tool | Every PR that shipped — comprehensive, machine-readable |
| `README.md` | Agent | Index/TOC linking to component files |
| `libraries.md` | Agent | System.\* BCL APIs (from `dotnet/runtime`) |
| `runtime.md` | Agent | CoreCLR, Mono, GC, JIT (from `dotnet/runtime`) |
| `aspnetcore.md` | Agent | ASP.NET Core, Blazor, SignalR |
| `sdk.md` | Agent | CLI, project system, templating |
| `efcore.md` | Agent | Entity Framework Core |
| `csharp.md` | Agent | C# language features |
| `fsharp.md` | Agent | F# language and compiler |
| `winforms.md` | Agent | Windows Forms |
| `wpf.md` | Agent | WPF |
| `msbuild.md` | Agent | MSBuild |
| `nuget.md` | Agent | NuGet client |

Components with no noteworthy changes get a minimal stub file.

## What's out of scope

- **MAUI** (`dotnet/maui`) — not in the VMR, not in `source-manifest.json`
- **Container images** (`dotnet/dotnet-docker`) — not in the VMR
- **Non-dotnet-org repos** — repos under other GitHub orgs (e.g., `microsoft/vstest`) are skipped for now due to SAML token scope. Only `dotnet` org repos are queried. This can be expanded later.
- **Servicing releases** — separate process, handled by existing automation
- **Security advisories** — the tool can cross-reference CVEs but the agent doesn't author security bulletins

## Design decisions

### Why source-manifest.json instead of VMR git log?

The VMR git log contains codeflow sync commits, dependency updates, and merge commits that are noisy and hard to trace back to meaningful PRs. `source-manifest.json` gives clean per-component commit ranges that map directly to GitHub compare API queries.

### Why a separate tool instead of agent-only?

The data collection step (manifest diff → PR enumeration) is mechanical and deterministic. Making it a standalone tool means:

- It can be tested independently
- Output is reproducible (same refs → same `changes.json`)
- The agent gets structured input instead of having to make dozens of API calls itself
- Humans can run it locally to inspect what shipped

### Why goal-oriented reference docs instead of procedural scripts?

The previous iteration had 16 reference documents encoding a rigid 9-step pipeline. It was brittle — any change to the process required updating multiple docs, and the agent followed the steps mechanically without understanding the goals. Goal-oriented docs let the agent adapt to unexpected situations (e.g., a component that reorganized its repo structure).

### Why one PR per preview?

Each preview is a coherent release milestone with its own set of features. Maintaining one long-lived branch per preview allows:

- Humans to edit the branch directly
- Incremental improvement as the preview matures
- Clear history of how the notes evolved
- Easy review before the preview ships

## Open questions

1. **dotnet-inspect in Actions** — the agent needs `dotnet-inspect` to verify public API changes against nightly builds. Availability as a global tool in GitHub Actions runners needs confirmation.
2. **Cross-repo tokens** — the workflow runs in `dotnet/core` but reads from `dotnet/dotnet` and ~20 component repos. The GitHub token scope and any required app permissions need to be configured.
3. **Multiple previews in flight** — can the agent handle updating notes for Preview N while Preview N+1's branch has just appeared? The workflow should handle this gracefully.
