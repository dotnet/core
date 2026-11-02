# PR Layout

Each release-notes milestone produces a **set of pull requests** instead of one large PR, so each component team reviews its own file in isolation.

## Branch set per milestone

- **Base branch** `release-notes/{version}-{milestone-slug}` (e.g. `release-notes/11.0-preview4`) — holds the shared metadata for the milestone (`README.md`, `changes.json`, `features.json`, `build-metadata.json`) and a stub for every expected component file. Its README links to all component files from the start. Its PR targets `main`.
- **Component branch** `release-notes/{version}-{milestone-slug}-{file-stem}` (e.g. `release-notes/11.0-preview4-aspnetcore` for `aspnetcore.md`) — inherits the complete index and stubs, then updates only its own `{file-stem}.md`. It never edits `README.md`. Its PR targets the base branch.

The set of components and their release notes files is defined in [`component-mapping.md`](component-mapping.md). Include every expected file, including out-of-band components. Components with no noteworthy changes still get a component PR that replaces the initial placeholder with the no-noteworthy-changes statement in [`format-template.md`](format-template.md#component-stubs).

## Invariants

- `changes.json`, `features.json`, `build-metadata.json`, and `README.md` are updated on the **base branch only**. Component branches merge the base branch to pick up refreshed metadata and index changes; they never modify these files themselves.
- Every `{component}.md` starts as a stub on the base branch. Substantive edits belong on its **matching component branch only** and reach the base branch through that component PR. Never overwrite drafted or human-edited notes with a stub.
- Validation projects stay in temporary scratch directories outside the checkout. Never include sample source files, projects, validation scripts, fixtures, or supporting assets in the branch set; record validation results in PR descriptions or review comments instead. Code snippets within the release-note Markdown are allowed.
- Create every stub and its README link in the same base-branch commit, before branching for components. Verify that every expected file exists and is linked exactly once, so links resolve even before component PRs merge. Retain push and PR link checks throughout.
- The milestone landing page `{version}.md` (for example, `11.0.0-preview.4.md`) is **not produced by this skill**. The .NET release team generates it through separate artifacts-publishing automation, so the agent leaves it alone on every branch.

## Creating the PRs

Order matters, and two of these steps fail silently.

1. **Initialize and push the base branch first.** Commit all component stubs and the fully linked
   README before creating component branches. Component PRs target the base branch, so it must exist on the remote before
   any component PR can be opened. Note that a glob like `release-notes/{version}-{slug}-*` matches
   the component branches but **not** the base branch — verifying with that pattern reports success
   while the base branch is still local-only.
2. **Confirm each component branch starts from the initialized base branch commit.** Each component
   PR should show only an update to its inherited component file, with no README or shared metadata
   changes. If the base branch moves, merge it into the component branch and verify the diff again.
3. **Open the base PR against `main`**, then the component PRs against the base branch.
4. **Verify assignees after creating each PR.** GitHub silently drops assignees who lack access to
   the repo: the API returns success and the PR is created with the assignee missing. Re-read the PR
   and compare against the intended list rather than trusting the exit code.
5. **Check links on both the base and component branches.** Every index link must resolve to an
   existing component file, even while that file is still a stub. Fix missing files or index links
   on the base branch, never in individual component PRs. Before publication, ensure all initial
   placeholders have been replaced with reviewed notes or the no-noteworthy-changes statement.

### gh pr edit does not work on this repo

`gh pr edit` fails against `dotnet/core` with a Projects (classic) GraphQL deprecation error and
leaves the PR unchanged. This affects the whole command, not just one flag — `--add-assignee`,
`--remove-assignee`, and `--body` / `--body-file` all fail the same way. It exits non-zero, but the
error text is about Projects rather than about what you were trying to change, so it is easy to
mistake for a warning. Use the REST endpoints:

```bash
gh api -X POST   repos/dotnet/core/issues/{number}/assignees -f "assignees[]=<user>"
gh api -X DELETE repos/dotnet/core/issues/{number}/assignees -f "assignees[]=<user>"

# Editing the PR title or body
'{"body": "..."}' | gh api -X PATCH repos/dotnet/core/pulls/{number} --input -
```

## Merge flow

Each component PR merges into the base branch. When all component PRs merge, the base PR's diff is the full milestone — there is no separate consolidation PR.

**The component owner merges their own PR.** Reviewing and approving is not enough — the owner is responsible for merging their component PR into the base branch once it's ready, rather than leaving it for someone else to merge.

## PR title convention

- Base PR: `[release-notes] .NET {version} {milestone-label}` (e.g. `[release-notes] .NET 11 Preview 4`).
- Component PR: `[release-notes] {Component name} in .NET {version} {milestone-label}` (e.g. `[release-notes] ASP.NET Core in .NET 11 Preview 4`).

## Draft state

Open both the base PR and every component PR as **drafts** (`gh pr create --draft`). Component teams promote their PR to ready-for-review once they've vetted the AI-authored content (including any `<!-- TODO -->` placeholders), then merge it into the base branch themselves. The base PR stays a draft until the milestone ships.

When notifying owners that their PRs are open, state that they own the merge, not just the review.
