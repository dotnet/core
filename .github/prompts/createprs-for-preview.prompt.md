# Create PRs for .NET Preview Component Files

Use this prompt to manually scaffold the per-component PR set for a .NET preview milestone, when you cannot or do not want to wait for the `Write Release Notes` agentic workflow to do it.

This is the **manual fallback** for the same branch / PR layout the agent produces. The canonical description of that layout — branch naming, PR titles, default assignees, draft-state rules — lives in the release-notes skill:

- [`.github/skills/release-notes/references/pr-layout.md`](../skills/release-notes/references/pr-layout.md)
- [`.github/skills/release-notes/references/component-mapping.md`](../skills/release-notes/references/component-mapping.md)

Read those first. They are the source of truth for branch suffixes and default assignees and are kept current as components change.

## Inputs

- `DOTNET_VERSION` — major only, e.g. `11`
- `MILESTONE_SLUG` — directory name under `release-notes/{DOTNET_VERSION}.0/preview/` or `release-notes/{DOTNET_VERSION}.0/`, e.g. `preview4`, `rc1`, `ga`
- `MILESTONE_LABEL` — human-readable label, e.g. `Preview 4`, `RC 1`, `GA`

Derived:

- Base branch: `release-notes/{DOTNET_VERSION}.0-{MILESTONE_SLUG}`
- Component branch: `release-notes/{DOTNET_VERSION}.0-{MILESTONE_SLUG}-{branch-suffix}`
- Preview folder: `release-notes/{DOTNET_VERSION}.0/preview/{MILESTONE_SLUG}` (or `release-notes/{DOTNET_VERSION}.0/{MILESTONE_SLUG}` for RC/GA)

## Process

### 1. Create the base branch and seed metadata

```bash
git switch -c release-notes/{DOTNET_VERSION}.0-{MILESTONE_SLUG} origin/main
mkdir -p {preview folder}
```

Seed the base branch with the milestone metadata files before opening the base PR. At minimum:

- `{preview folder}/README.md` — milestone readme (use the previous milestone's `README.md` as a template; update version numbers, links, and dates)
- `{preview folder}/build-metadata.json` — `{ "base": "...", "head": "...", "version": "..." }` describing the VMR refs the milestone covers
- `{preview folder}/changes.json` — generated via `release-notes generate changes` against the VMR (or an empty `{ "changes": [] }` placeholder if the milestone has no shipped content yet)
- `{preview folder}/features.json` — derived from `changes.json` (or an empty `{ "features": [] }` placeholder for a brand-new milestone)

Commit and push the base branch and open a draft PR titled `[release-notes] .NET {DOTNET_VERSION} {MILESTONE_LABEL}` targeting `main`. The body lists the planned component PRs (filled in as they open).

### 2. For each component file

Look up the file's branch suffix and default assignee in [`component-mapping.md`](../skills/release-notes/references/component-mapping.md).

Repeat for each component:

```bash
git switch -c release-notes/{DOTNET_VERSION}.0-{MILESTONE_SLUG}-{branch-suffix} \
  release-notes/{DOTNET_VERSION}.0-{MILESTONE_SLUG}
```

Create the component file at `{preview folder}/{component}.md` using the stub from [`format-template.md`](../skills/release-notes/references/format-template.md).

Lint the file:

```bash
npx markdownlint --config .github/linters/.markdown-lint.yml {preview folder}/{component}.md
```

Commit, push, and open a draft PR titled `[release-notes] {Component name} in .NET {DOTNET_VERSION} {MILESTONE_LABEL}` **targeting the base branch** (not `main`). Body asks the assignee to fill in the release notes.

Assign the PR to the default assignee(s) from `component-mapping.md`:

```bash
gh pr edit <PR_NUMBER> --add-assignee <username>
```

Switch back to the base branch and repeat for the next component.

### 3. Consolidation

There is no separate consolidation PR. As component PRs merge into the base branch, the base PR's diff grows to cover the full milestone. Mark the base PR ready for review and merge to `main` once every component PR is merged or closed.

## Notes

- All component files for the milestone live under `release-notes/{DOTNET_VERSION}.0/preview/{MILESTONE_SLUG}/` (or `release-notes/{DOTNET_VERSION}.0/{MILESTONE_SLUG}/` for RC/GA).
- Each component file is created fresh in its own branch and PR. Do not copy forward placeholder text from previous milestones.
- Use the GitHub CLI for assignee setting; it's more reliable than reviewer assignment for this workflow.
- Ensure trailing newline, consistent heading style, and no stray whitespace.
