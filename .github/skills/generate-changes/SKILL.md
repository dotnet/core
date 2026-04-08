---
name: generate-changes
description: >
  Generate `changes.json` for a .NET release milestone by selecting the correct
  VMR base/head refs and running `release-notes generate changes`. Handles
  preview-only multi-branch targeting (`main` vs release branches vs tags) and
  emits the authoritative manifest of what shipped. DO NOT USE FOR: API
  verification/diffs (use api-diff), feature scoring (use generate-features),
  or writing markdown release notes (use release-notes).
---

# Generate `changes.json`

Produce the authoritative `changes.json` input for a preview, RC, or GA release milestone.

This is the **VMR-aware data acquisition stage** of the release notes pipeline:

1. Determine which milestone(s) are active
2. Resolve the correct `--base` and `--head` refs
3. Run `release-notes generate changes`
4. Write `changes.json` into the correct `release-notes/` folder

## When to use

- A new preview, RC, or GA milestone needs fresh shipped-change data
- The user wants to know whether **multiple preview milestones** are active at once
- The release notes branch should be refreshed after the VMR moved forward
- `changes.json` is missing, stale, or suspected to have the wrong ref selection

## Preview-only branch targeting

This is the subtle part, and it mostly matters for **previews**.

Multiple preview milestones can be active simultaneously:

```text
Latest shipped in this repo: Preview 3
VMR main:                    Preview 5
VMR release branch exists:   Preview 4

→ Generate one `changes.json` for Preview 4
→ Generate one `changes.json` for Preview 5
```

For each target milestone `N`:

| Milestone state                         | Base ref    | Head ref           |
| --------------------------------------- | ----------- | ------------------ |
| Tag exists for N                        | Tag for N-1 | Tag for N          |
| Release branch exists for N, no tag yet | Tag for N-1 | Release branch tip |
| Only on `main`                          | Tag for N-1 | `main`             |

**Critical rule:** never use `main` for milestone `N` if `main` has already moved to `N+1`.

## Inputs

The user should provide as much of this as they know:

- **Target release** — e.g. `.NET 11 Preview 4`, `.NET 10 RC 2`, `.NET 10 GA`
- **VMR clone path** — defaults to a local clone of `dotnet/dotnet`
- Optionally, the exact refs if they already know them

If the user does **not** specify the milestone, infer it from:

1. `release-notes/{version}/releases.json` in this repo
2. `eng/Versions.props` on `main` in the VMR
3. Matching preview tags and release branches in the VMR

## Process

### 1. Determine the floor from `releases.json`

Find the latest shipped milestone in this repo. That tells you the lowest in-flight milestone that may need work.

### 2. Inspect the VMR

- Read `eng/Versions.props` on `main` to determine the current prerelease iteration
- List matching VMR tags for finalized milestones
- List matching VMR release branches for stabilizing milestones

Use the [VMR structure reference](../release-notes/references/vmr-structure.md) for naming conventions and branch patterns.

### 3. Resolve `--base` and `--head`

For each active milestone:

- `--base` is the previous shipped milestone tag
- `--head` is the milestone tag, release branch tip, or `main`, depending on what exists

### 4. Generate the file

```bash
release-notes generate changes <vmr-clone-path> \
  --base <previous-release-tag> \
  --head <current-release-ref> \
  --version "<release-version>" \
  --date "<yyyy-mm-dd>" \
  --labels \
  --output release-notes/<major.minor>/<milestone-path>/changes.json
```

Examples:

```bash
# Preview milestone
release-notes generate changes ~/git/dotnet \
  --base v11.0.0-preview.3.26210.100 \
  --head origin/release/11.0.1xx-preview4 \
  --version "11.0.0-preview.4" \
  --labels \
  --output release-notes/11.0/preview/preview4/changes.json

# GA/patch milestone
release-notes generate changes ~/git/dotnet \
  --base v10.0.7 \
  --head v10.0.8 \
  --version "10.0.8" \
  --output release-notes/10.0/10.0.8/changes.json
```

## Output contract

The output file must follow the shared schema documented in [changes-schema.md](../release-notes/references/changes-schema.md):

- top-level `release_version`, `release_date`, `changes`, `commits`
- stable `id` values in `repo@shortcommit` format
- same authoritative source of truth used by later skills

Once `changes.json` exists, the next step is usually `generate-features`.
