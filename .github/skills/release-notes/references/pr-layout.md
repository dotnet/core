# PR Layout

Each release-notes milestone produces a **set of pull requests** instead of one large PR, so each component team reviews its own file in isolation.

## Branch set per milestone

- **Base branch** `release-notes/{version}-{milestone-slug}` (e.g. `release-notes/11.0-preview4`) — holds the shared metadata for the milestone (`README.md`, `changes.json`, `features.json`, `build-metadata.json`). Its README preallocates unlinked entries for the expected component files. Its PR targets `main`.
- **Component branch** `release-notes/{version}-{milestone-slug}-{file-stem}` (e.g. `release-notes/11.0-preview4-aspnetcore` for `aspnetcore.md`) — adds that component's `{file-stem}.md` and links only its own entry in `README.md`. Its PR targets the base branch.

The set of components and their release notes files is defined in [`component-mapping.md`](component-mapping.md). Components with no noteworthy changes still get a stub PR.

## Invariants

- `changes.json`, `features.json`, and `build-metadata.json` live on the **base branch only**. The base branch owns the README structure and unlinked component entries; each component branch changes only its own entry when adding the matching file. Component branches merge the base branch to pick up refreshed metadata without overwriting links already merged from other components.
- Each `{component}.md` lives on its **matching component branch only**. The agent never edits another component's file from the wrong branch.
- Never link an entry to a file absent from that branch. Keep unlinked entries for pending component PRs; once all component PRs merge, verify that every expected entry links to its existing file. Retain push and PR link checks throughout.
- The milestone landing page `{version}.md` (for example, `11.0.0-preview.4.md`) is **not produced by this skill**. The .NET release team generates it through separate artifacts-publishing automation, so the agent leaves it alone on every branch.

Publication scope is the component article, its own index link, and explicitly approved companion reports or required media.
Validation alone does not authorize repository fixtures or other experiment artifacts.
Add or change maintained fixtures only when explicitly requested or already agreed in the task scope.
Do not silently delete existing files.
Skill-policy updates belong in a separate documentation PR, not a release-article PR.

## Creating the PRs

Order matters, and two of these steps fail silently.

1. **Push the base branch first.** Component PRs target it, so it must exist on the remote before
   any component PR can be opened. Note that a glob like `release-notes/{version}-{slug}-*` matches
   the component branches but **not** the base branch — verifying with that pattern reports success
   while the base branch is still local-only.
2. **Confirm each component branch starts from the base branch commit.** Each component PR should
   show only its component file, its single README link change, and approved companion material or maintained fixtures;
   it should not restate shared metadata or other components' entries. If the base branch moves,
   merge it into the component branch before updating the entry and verify the diff again.
3. **Open the base PR against `main`**, then the component PRs against the base branch.
4. **Verify assignees after creating each PR.** GitHub silently drops assignees who lack access to
   the repo: the API returns success and the PR is created with the assignee missing. Re-read the PR
   and compare against the intended list rather than trusting the exit code.
5. **Check links on both the base and component branches.** The base README must have no links
   to pending files; a component branch must add its link and file together. If adjacent README
   edits conflict as owners merge, retain all previously merged links and add only the current
   component's link.

### Updating and reporting

- Update an existing PR's head branch only. Preserve its draft state and base unless explicitly authorized otherwise.
- Use ordinary commits and non-force pushes. Do not amend commits or publish directly to the target branch or `main`.
- Leave promotion and merging to the authorized owner. Do not merge as part of a documentation edit.
- Report the actual branch and commit SHA. Distinguish local, committed, pushed, and merged state.
- Report whole-PR file counts and additions/deletions against the base, not only the latest patch.
- Bound research to the requested changes. For prose-only edits, use the smallest existing Markdown and reference checks, not code builds.

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
