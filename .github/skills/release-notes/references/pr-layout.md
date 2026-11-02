# PR Layout

Each release-notes milestone produces a **set of pull requests** instead of one large PR, so each component team reviews its own file in isolation.

## Branch set per milestone

- **Base branch** `release-notes/{version}-{milestone-slug}` (e.g. `release-notes/11.0-preview4`) — holds shared metadata (`README.md`, `changes.json`, `features.json`, `build-metadata.json`) and all component stubs, already linked from the README. Its PR targets `main`.
- **Component branch** `release-notes/{version}-{milestone-slug}-{file-stem}` (e.g. `release-notes/11.0-preview4-aspnetcore` for `aspnetcore.md`) — updates only its inherited `{file-stem}.md`. Its PR targets the base branch.

Create a component PR for every expected file in [`component-mapping.md`](component-mapping.md), including components with no noteworthy changes.

## Invariants

- `changes.json`, `features.json`, `build-metadata.json`, and `README.md` are updated on the **base branch only**.
- Edit each `{component}.md` on its **matching component branch only**. Never overwrite drafted or human-edited notes with a stub.
- Keep validation projects outside the checkout; follow [`validate-code-samples`](../../validate-code-samples/SKILL.md).
- The milestone landing page `{version}.md` (for example, `11.0.0-preview.4.md`) is **not produced by this skill**. The .NET release team generates it through separate artifacts-publishing automation, so the agent leaves it alone on every branch.

## Creating the PRs

Order matters, and two of these steps fail silently.

1. **Initialize and push the base branch first.** Commit all component stubs and the fully linked
   README together before creating component branches. The base branch must exist remotely before
   component PRs can be opened. Note that a glob like `release-notes/{version}-{slug}-*` matches
   the component branches but **not** the base branch — verifying with that pattern reports success
   while the base branch is still local-only.
2. **Verify component-only diffs.** Branch from the initialized base and update only the component's
   inherited notes file. If only the stub is ready, commit the [owner-handoff TODO](format-template.md#component-stubs)
   before opening the draft PR. If the base branch moves, merge it into the component branch and verify the diff again.
3. **Open the base PR against `main`**, then the component PRs against the base branch.
4. **Verify assignees after creating each PR.** GitHub silently drops assignees who lack access to
   the repo: the API returns success and the PR is created with the assignee missing. Re-read the PR
   and compare against the intended list rather than trusting the exit code.
5. **Check links and placeholders.** On base and component branches, verify that every expected
   component file exists and is linked exactly once. Before publication, replace every TODO with
   reviewed notes or the no-noteworthy-changes statement from [`format-template.md`](format-template.md#component-stubs).

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
