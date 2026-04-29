# PR Layout

Each release-notes milestone produces a **set of pull requests** instead of one large PR, so each component team reviews its own file in isolation.

## Branch set per milestone

- **Base branch** `release-notes/{version}-{milestone-slug}` (e.g. `release-notes/11.0-preview4`) — holds the shared metadata for the milestone (`README.md`, `changes.json`, `features.json`, `build-metadata.json`). Its PR targets `main`.
- **Component branch** `release-notes/{version}-{milestone-slug}-{file-stem}` (e.g. `release-notes/11.0-preview4-aspnetcore` for `aspnetcore.md`) — holds only that component's `{file-stem}.md`. Its PR targets the base branch.

The set of components and their release notes files is defined in [`component-mapping.md`](component-mapping.md). Components with no noteworthy changes still get a stub PR.

## Invariants

- `changes.json`, `features.json`, `build-metadata.json`, and `README.md` live on the **base branch only**. Component branches never modify them; they rebase or merge from the base branch to pick up refreshed metadata.
- Each `{component}.md` lives on its **matching component branch only**. The agent never edits another component's file from the wrong branch.

## Merge flow

Each component PR merges into the base branch. When all component PRs merge, the base PR's diff is the full milestone — there is no separate consolidation PR.

## PR title convention

- Base PR: `[release-notes] .NET {version} {milestone-label}` (e.g. `[release-notes] .NET 11 Preview 4`).
- Component PR: `[release-notes] {Component name} in .NET {version} {milestone-label}` (e.g. `[release-notes] ASP.NET Core in .NET 11 Preview 4`).
