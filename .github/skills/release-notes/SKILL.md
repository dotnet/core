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
3. **Output directory** — path for the release notes files. Default: `release-notes/<version>/preview/<preview>/` (e.g., `release-notes/11.0/preview/preview3/`).

After collecting inputs, locate the VMR references for comparison:

1. **Find the previous release tag** — list tags on `dotnet/dotnet` matching `v<MAJOR>.0*` and find the tag for the previous release (e.g., `v11.0.100-preview.2.26159.112`).
2. **Find the current release reference** — look for a `release-pr-*` branch or tag for the current release. If neither exists, use `main` as the head reference.
3. **Derive the date range** — from the VMR diff commits, the earliest and latest commit dates define the natural date range. Use this for source repo PR searches instead of asking the user for Code Complete dates.

### Step 2: VMR diff

**[Diff the VMR release branches](references/vmr-diff.md)** — compare the previous and current VMR release branches to identify all code changes that shipped in this release. Group changes by component using the [component mapping](references/component-mapping.md).

This step produces:
- A list of components with changes (and an estimate of change magnitude)
- Components with no meaningful changes (these get minimal stub release notes)

### Step 3: Trace to source repos

**[Trace VMR changes to source repo PRs](references/trace-to-source.md)** — for each component with VMR changes, find the source repo PRs that introduced those changes. Uses both VMR commit analysis and source repo PR searches, but only includes PRs confirmed present in the VMR.

### Step 4: Enrich

**[Fetch PR and issue details](references/enrich-prs.md)** — for each candidate PR, fetch the full body, linked issues, reaction counts, and Copilot summaries. Collect reviewer data for the suggestion step.

### Step 5: Deduplicate

**[Check against prior release notes](references/dedup-previous-releases.md)** — for each component, verify that candidate features are not already covered in an earlier preview's release notes. **Retain prior release notes in context** for theme continuation detection during authoring.

### Step 6: Author

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

### Step 7: Validate code samples

**[Validate code samples](references/validate-samples.md)** — extract every code sample from the authored release notes, scaffold file-based .NET console apps, and verify each compiles and runs. Fix any failing samples with user confirmation.

### Step 8: Suggest reviewers and finalize

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
