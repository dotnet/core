---
name: release-notes
description: Generate .NET release notes for a preview, RC, or GA release. Diffs VMR release branches to determine what shipped, traces changes to source repo PRs, and produces formatted markdown for all components. Use when asked to write, update, or draft release notes, a changelog, or a what's new summary for .NET.
compatibility: Requires GitHub MCP server or gh CLI, SQL tool for structured storage, and access to the dotnet/core repository clone.
disable-model-invocation: true
argument-hint: "[version] [preview]"
---

# .NET Release Notes Generator

Generate release notes for a .NET preview, RC, or GA release. This skill produces release notes for **all components** in a single invocation, using the VMR (`dotnet/dotnet`) as the source of truth for what shipped.

## Design principles

- **VMR is source of truth** — the VMR release branch determines what shipped. If code is not on the release branch, it does not get documented.
- **Local clone, branch-focused** — always work from a local VMR clone (`dotnet/dotnet`). Use git commands against actual branches and tags for verification, not GitHub API heuristics.
- **Reverts are inherently handled** — reverted code does not appear in the VMR branch diff, so it never enters the pipeline.
- **Whole product** — one invocation produces release notes for all components (libraries, runtime, ASP.NET Core, SDK, etc.).
- **Team contexts are editorial** — they define formatting, categorization, and content rules, not PR discovery.

## Execution guidelines

- **Do not write intermediate files to disk.** Use the **SQL tool** for structured storage and querying (see [sql-storage.md](references/sql-storage.md) for schema).
- **Do not run linters, formatters, or validators** on the output.
- **Maximize parallel tool calls.** Fetch multiple PR and issue details in a single response.
- **Follow [GitHub tool guidance](references/github-tools.md)** for all GitHub API interactions.

## Process

### Step 1: Collect inputs

Collect inputs **one at a time** — ask a single question, wait for the answer, then ask the next:

1. **Release name** (e.g., ".NET 11 Preview 3"). Parse the major version, prerelease label, and preview number.
2. **Previous release name** (e.g., ".NET 11 Preview 2"). This determines the base VMR reference for comparison.
3. **VMR clone path** — path to local `dotnet/dotnet` clone. Default: `~/git/dotnet`.
4. **Output directory** — path for the release notes files. Default: `release-notes/<version>/preview/<preview>/` (e.g., `release-notes/11.0/preview/preview3/`).

### Step 2: Resolve VMR references

Read [release-branch-mechanics.md](references/release-branch-mechanics.md) to understand the full branch topology and timing across repos.

#### Previous release → VMR tag (from release.json)

Read the **previous preview's `release.json`** in this repo to get the exact runtime build number:

```
release-notes/<MAJOR>.0/preview/<previous-preview>/release.json
→ .release.runtime.version  (e.g., "11.0.0-preview.2.26159.112")
```

Map that version to a VMR tag. Tags come in pairs — runtime and SDK:
- Runtime: `v11.0.0-preview.2.26159.112`
- SDK: `v11.0.100-preview.2.26159.112`

Either tag points to the same commit. Verify it exists in the local clone.

#### Current release → VMR reference

For an **unreleased** preview, find the `release-pr-*` branch in the local clone:

```bash
cd <vmr-clone-path>
git fetch origin --tags --prune
git branch -r | grep "release-pr-<MAJOR>.0.100-<label>"
```

For a **shipped** release, the tag will already exist (same release.json lookup pattern).

If neither a tag nor `release-pr-*` branch exists, use `origin/main`.

#### Compute fork points for commit enumeration

Preview release branches fork from `main` independently — the P2 tag is **not** an ancestor of the P3 reference. For clean commit enumeration, find the fork points on `main`:

```bash
P2_FORK=$(git merge-base origin/main <P2-tag>)
P3_FORK=$(git merge-base origin/main origin/<P3-ref>)
```

Use `$P2_FORK..$P3_FORK` for commit-based PR discovery (new development on main). Use `<P2-tag>..<P3-ref>` for code-level verification (actual content delta). See [release-branch-mechanics.md](references/release-branch-mechanics.md) for why these differ.

### Step 3: VMR diff

**[Diff the VMR release references](references/vmr-diff.md)** — using the local clone and fork points, enumerate commits on `main` between releases and classify by component using the [component mapping](references/component-mapping.md).

This step produces:
- A list of components with changes (and an estimate of change magnitude)
- The date range for source repo PR searches (derived from commit timestamps)
- Components with no meaningful changes (these get minimal stub release notes)

### Step 4: Trace to source repos

**[Trace VMR changes to source repo PRs](references/trace-to-source.md)** — for each component with VMR changes, find the source repo PRs that introduced those changes. Uses VMR commit analysis + source repo PR searches, then **verifies each candidate PR's merge commit is reachable from the VMR release branch** using the local clone.

### Step 5: Enrich

**[Fetch PR and issue details](references/enrich-prs.md)** — for each candidate PR, fetch the full body, linked issues, reaction counts, and Copilot summaries. Collect reviewer data for the suggestion step.

### Step 6: Deduplicate

**[Check against prior release notes](references/dedup-previous-releases.md)** — for each component, verify that candidate features are not already covered in an earlier preview's release notes. **Retain prior release notes in context** for theme continuation detection during authoring.

### Step 7: Author

Write release notes for each component that has meaningful changes:

1. **[Categorize entries by impact](references/categorize-entries.md)** — group PRs into impact tiers. Reference prior release notes for theme continuations.
2. **[Apply formatting rules](references/format-template.md)** — follow the standard .NET release notes document structure. Apply team context format overrides when specified.
3. **[Apply editorial rules](references/editorial-rules.md)** — follow attribution, benchmark, naming, and ranking guidelines. Apply team context content rules when specified.

For components with team context files (see table below), load the team context and apply its editorial overrides. Components without team context files use default rules.

| Component | Team context | Notes |
|-----------|-------------|-------|
| Libraries | [team-libraries.md](references/team-libraries.md) | Area-label categorization, API diff review |
| ASP.NET Core | [team-aspnetcore.md](references/team-aspnetcore.md) | Product-area grouping, milestone-based community queries |
| SDK | [team-sdk.md](references/team-sdk.md) | VMR-native changes |

For components with no meaningful changes, produce a minimal stub:

```markdown
# <Component> in .NET <VERSION> <PREVIEW> - Release Notes

There are no new features or improvements in <Component> in this release.
```

### Step 8: Validate code samples

**[Validate code samples](references/validate-samples.md)** — extract every code sample from the authored release notes, scaffold file-based .NET console apps, and verify each compiles and runs. Fix any failing samples with user confirmation.

### Step 9: Suggest reviewers and finalize

**[Suggest reviewers](references/suggest-reviewers.md)** — aggregate PR authors, assignees, mergers, and coauthors into component-grouped reviewer suggestions.

Present the complete draft to the user:

1. List of components with release notes (and components with stubs)
2. Feature list per component with categorization
3. Suggested reviewers grouped by component
4. Any unresolved items (unmatched VMR changes, ambiguous PRs)

Get user confirmation before writing the output files.

## Example usage

**User prompt:**

> Write the release notes for .NET 11 Preview 3.

**Expected output:** Multiple markdown files under `release-notes/11.0/preview/preview3/`:

- `libraries.md` — .NET Libraries features
- `runtime.md` — Runtime improvements
- `aspnetcore.md` — ASP.NET Core features
- `sdk.md` — SDK tooling updates
- `msbuild.md` — MSBuild improvements
- `csharp.md` — C# language features
- (etc. for each component with changes)
- Minimal stubs for components with no changes

Each file follows the format:

```markdown
# <Component> in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new <Component> features & enhancements:

- [Feature Name](#anchor)
...

## Feature Name

<description with why + how + code sample> ([owner/repo#NNNNN](https://github.com/owner/repo/pull/NNNNN)).
```
