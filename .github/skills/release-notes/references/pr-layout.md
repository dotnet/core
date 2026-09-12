# PR Layout

Each release-notes milestone produces a **set of pull requests** instead of one large PR, so each component team reviews its own file in isolation.

## Branch set per milestone

- **Base branch** `release-notes/{version}-{milestone-slug}` (e.g. `release-notes/11.0-preview4`) — holds the shared metadata for the milestone (`README.md`, `changes.json`, `features.json`, `build-metadata.json`). Its PR targets `main`.
- **Component branch** `release-notes/{version}-{milestone-slug}-{file-stem}` (e.g. `release-notes/11.0-preview4-aspnetcore` for `aspnetcore.md`) — holds only that component's `{file-stem}.md`. Its PR targets the base branch.

The set of components and their release notes files is defined in [`component-mapping.md`](component-mapping.md). Components with no noteworthy changes still get a stub PR.

## Invariants

- `changes.json`, `features.json`, `build-metadata.json`, and `README.md` live on the **base branch only**. Component branches never modify them; they rebase or merge from the base branch to pick up refreshed metadata.
- Each `{component}.md` lives on its **matching component branch only**. The agent never edits another component's file from the wrong branch.
- The milestone landing page `{version}.md` (for example, `11.0.0-preview.4.md`) is **not produced by this skill**. The .NET release team generates it through separate artifacts-publishing automation, so the agent leaves it alone on every branch.

## Creating the PRs

Order matters, and two of these steps fail silently.

1. **Push the base branch first.** Component PRs target it, so it must exist on the remote before
   any component PR can be opened. Note that a glob like `release-notes/{version}-{slug}-*` matches
   the component branches but **not** the base branch — verifying with that pattern reports success
   while the base branch is still local-only.
2. **Confirm each component branch's parent is the base branch commit.** When it is, each component
   PR shows a clean one-file diff instead of also restating the shared metadata.
3. **Open the base PR against `main`**, then the component PRs against the base branch.
4. **Verify assignees after creating each PR.** GitHub silently drops assignees who lack access to
   the repo: the API returns success and the PR is created with the assignee missing. Re-read the PR
   and compare against the intended list rather than trusting the exit code.

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
