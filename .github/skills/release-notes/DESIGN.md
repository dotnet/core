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
│           Agentic Workflow (cron)               │
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
| [examples/](references/examples/README.md) | Curated examples by component — short, medium, long-form styles |

These are **goal-oriented**, not procedural. They describe what good release notes look like, not the exact steps to produce them. The agent figures out the HOW.

### Agent responsibilities

- **Triage** — read `changes.json` and identify which PRs are worth writing about. Use the [component mapping](references/component-mapping.md) to route changes from `repo` to the correct output files.
- **Verify** — before writing about any API, use `dotnet-inspect` to confirm it exists with the correct type names, member signatures, and namespaces. See [api-verification.md](references/api-verification.md).
- **Write** — produce markdown release notes for high-value features, following the quality bar. Only use API names, type names, and code samples that have been verified.
- **Respect edits** — diff the PR branch to see what humans have changed and preserve their work
- **Respond** — read PR comments and incorporate human feedback

## Layer 3 — The Agentic Workflow

A [GitHub Agentic Workflow](https://github.github.com/gh-aw/) defined in `.github/workflows/release-notes.md`. It runs on a schedule and manages the full lifecycle. This is a **multi-master live system** — the agent, component teams, and release managers all edit concurrently.

### Multi-milestone discovery

Multiple milestones can be active simultaneously. For example:

```text
Latest shipped:   Preview 3 (in releases.json)
VMR main:         Preview 5 (Versions.props iteration=5)
VMR release/P4:   Preview 4 (release branch exists, no tag yet)

→ Active milestones: Preview 4 (from release branch) AND Preview 5 (from main)
→ Each gets its own branch and PR on dotnet/core
```

The workflow discovers all milestones between `latest_shipped + 1` and `main_iteration`, checks for VMR tags and release branches, and creates a branch+PR for each.

### Head ref selection (per milestone)

Each milestone needs its own base and head ref. This is re-validated every run because refs can change:

| Milestone state | Base ref | Head ref |
| --------------- | -------- | -------- |
| Has VMR tag (finalized) | Tag for N-1 | Tag for N |
| Has release branch (stabilizing) | Tag for N-1 | Release branch tip |
| Only on main (in development) | Tag for N-1 | main |

**Critical**: never use `main` for milestone N if `main` has moved to N+1. Check the iteration in `Versions.props` every run.

### Branch lifecycle on dotnet/core

```text
Branch:  release-notes/11.0-preview4
PR:      [release-notes] .NET 11 Preview 4

Branch:  release-notes/11.0-preview5
PR:      [release-notes] .NET 11 Preview 5
```

Each branch is long-lived — it's created on the first run and updated frequently until the PR is merged (after the preview ships).

### Human interaction model

This is the most delicate part of the system. The branches are shared workspaces:

**Respecting edits:**
- Before writing, diff the branch to identify human commits
- Files humans have edited are partially off-limits — only add new sections, never overwrite their changes
- When a file has mixed agent + human content, be surgical — touch only agent-authored sections

**Responding to comments:**
- Read all PR comments and review threads since the last run
- Classify: actionable feedback, questions, disagreements, resolved
- For actionable items: make the change and confirm
- For questions: answer or escalate
- For disagreements: cross-check `changes.json` and explain findings
- When intent is unclear: ask for clarification via comment
- This is a conversation. Engage, don't ignore.

**Handling conflicts:**
- If a human and the agent both changed the same section, the human's version wins
- If the agent is unsure whether a human edit was intentional, ask via PR comment
- Never force-push or rewrite human commits

### PR lifecycle

| State | Action |
| ----- | ------ |
| No PR for milestone | Create branch, generate content, open draft PR |
| PR exists, source changed | Regenerate `changes.json`, update/add markdown sections |
| PR exists, human edited | Preserve edits, only update untouched sections |
| New tag appeared | Final regen with `--head <tag>`, note finalization |
| Main bumped | Switch earlier milestone's head ref to release branch/tag |
| PR merged | Skip on future runs |
| PR closed | Don't reopen, log and move on |

### Schedule and transitions

- Runs daily (~9am Pacific)
- Previews ship monthly, Feb–Oct (typically patch Tuesday)
- RC1 ~September, RC2 ~October, GA November
- Only does meaningful work when VMR state has changed
- Each run re-validates all refs (tags appear, branches are created, main bumps)

### Safe outputs

The only ways the workflow can modify state:

- `create-pull-request` — create new release notes PRs (max 5, for multiple milestones)
- `push-to-pull-request-branch` — update existing PR branches (max 5)
- `add-comment` — comment on PRs with updates, replies to feedback, questions (max 20)

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

Goal-oriented docs let the agent adapt to unexpected situations (e.g., a component that reorganized its repo structure). A procedural approach would limit the agent to mechanically execute a rigid and brittle pipeline.

### Why one PR per preview?

Each preview is a coherent release milestone with its own set of features. Maintaining one long-lived branch per preview allows:

- Humans to edit the branch directly
- Incremental improvement as the preview matures
- Clear history of how the notes evolved
- Easy review before the preview ships

## Open questions

1. **Conflict resolution heuristics** — when the agent and a human both changed the same section between runs, the human wins. But how granular is "a section"? Need to define this precisely (per-heading? per-file?).
2. **RC/GA milestone naming** — the multi-milestone logic assumes `previewN` naming. RC and GA milestones use different naming (`rc1`, `rc2`, `ga`). The workflow needs to handle the transition gracefully.
