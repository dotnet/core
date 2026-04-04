# Shared Schema for `changes.json` and `features.json`

Reference for the `changes.json` file produced by `dotnet-release generate changes`, and for the derived `features.json` file used by downstream editorial skills. One file per release milestone.

## Overview

`changes.json` is a comprehensive, machine-readable manifest of every PR and commit that shipped in a release. `features.json` is a scored derivative that keeps the same structure while adding optional enrichment for editorial prioritization.

Both files also serve as companions to `cve.json` — they use the same `commits{}` structure and `repo@shortcommit` key format, enabling cross-file joins.

## File location

```text
release-notes/{major.minor}/preview/{previewN}/changes.json    # previews
release-notes/{major.minor}/{major.minor.patch}/changes.json   # patches
release-notes/{major.minor}/preview/{previewN}/features.json   # previews
release-notes/{major.minor}/{major.minor.patch}/features.json  # patches
```

## Top-level structure

| Field             | Type   | Description                                             |
| ----------------- | ------ | ------------------------------------------------------- |
| `release_version` | string | e.g., `"11.0.0-preview.3"`                              |
| `release_date`    | string | ISO 8601, e.g., `"2026-04-08"`                          |
| `changes`         | array  | The change or feature entries                           |
| `commits`         | object | Normalized commit metadata, keyed by `repo@shortcommit` |

## Change entry fields

| Field               | Type   | Description                                                                        |
| ------------------- | ------ | ---------------------------------------------------------------------------------- |
| `id`                | string | Globally unique identifier — `repo@shortcommit` format (e.g., `"runtime@c5d5be4"`) |
| `repo`              | string | Short repository name (e.g., `"runtime"`)                                          |
| `product`           | string | Product slug (e.g., `"dotnet-runtime"`); absent for infra repos                    |
| `title`             | string | PR title; `""` if not available                                                    |
| `url`               | string | Public GitHub PR URL; `""` if non-public                                           |
| `commit`            | string | Key into top-level `commits{}` dict — the VMR (`dotnet/dotnet`) codeflow commit    |
| `is_security`       | bool   | `true` if this is a security change                                                |
| `local_repo_commit` | string | Key into `commits{}` — the source repo commit (same as `id`)                       |
| `labels`            | array  | PR labels (only present when `--labels` is used)                                   |
| `score`             | number | Optional editorial score; higher means more likely to document                     |
| `score_reason`      | string | Optional short explanation for the score                                           |
| `score_breakdown`   | object | Optional structured scoring details                                                |

The `product` field is derived from the repo-level [component mapping](component-mapping.md). Infra repos like `arcade` and `symreader` have no `product` field. The `repo` field always matches the VMR manifest path.

The `commit` field is the VMR codeflow commit in `dotnet/dotnet` that synced this change. Multiple source PRs typically map to the same VMR commit (codeflow batches changes). The `url` field links to the source-repo PR — together these provide both the product view (commit) and the development view (url).

## Commit entry fields (values in `commits{}`)

| Field    | Type   | Description                            |
| -------- | ------ | -------------------------------------- |
| `repo`   | string | Short repository name                  |
| `branch` | string | Branch the commit landed on            |
| `hash`   | string | Full 40-character commit hash          |
| `org`    | string | GitHub organization (e.g., `"dotnet"`) |
| `url`    | string | `.diff`-form commit URL                |

## Conventions

- **No nulls** — required fields are always present. Optional fields (`product`, `labels`, `local_repo_commit`, `score`, `score_reason`, `score_breakdown`) may be absent. Use `""` for missing strings, `0` for missing integers.
- **Naming** — `snake_case_lower` for JSON fields, `kebab-case-lower` for file names and repo slugs.
- **Public URLs only** — every URL must resolve publicly.
- **Commit URLs use `.diff` form** — for machine consumption.

## Example

```json
{
  "release_version": "11.0.0-preview.3",
  "release_date": "",
  "changes": [
    {
      "id": "runtime@b2d5fa8",
      "repo": "runtime",
      "product": "dotnet-runtime",
      "title": "Add JsonSerializerOptions.Web preset",
      "url": "https://github.com/dotnet/runtime/pull/112345",
      "commit": "dotnet@a1b2c3d",
      "is_security": false,
      "local_repo_commit": "runtime@b2d5fa8",
      "score": 9,
      "score_reason": "Broadly useful new JSON configuration preset"
    },
    {
      "id": "aspnetcore@f45f3c9",
      "repo": "aspnetcore",
      "product": "dotnet-aspnetcore",
      "title": "Add MapStaticAssets middleware",
      "url": "https://github.com/dotnet/aspnetcore/pull/54321",
      "commit": "dotnet@a1b2c3d",
      "is_security": false,
      "local_repo_commit": "aspnetcore@f45f3c9"
    }
  ],
  "commits": {
    "runtime@b2d5fa8": {
      "repo": "runtime",
      "branch": "main",
      "hash": "b2d5fa8ca2f9c2d7e8f1f0a9d3d0f08e31c0ad5f",
      "org": "dotnet",
      "url": "https://github.com/dotnet/runtime/commit/b2d5fa8ca2f9c2d7e8f1f0a9d3d0f08e31c0ad5f.diff"
    },
    "aspnetcore@f45f3c9": {
      "repo": "aspnetcore",
      "branch": "main",
      "hash": "f45f3c916df91e3fb175c85ba4a4f58ec1f77ef0",
      "org": "dotnet",
      "url": "https://github.com/dotnet/aspnetcore/commit/f45f3c916df91e3fb175c85ba4a4f58ec1f77ef0.diff"
    },
    "dotnet@a1b2c3d": {
      "repo": "dotnet",
      "branch": "main",
      "hash": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
      "org": "dotnet",
      "url": "https://github.com/dotnet/dotnet/commit/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0.diff"
    }
  }
}
```

Note that both changes share the same `commit` — they were synced to the VMR in a single codeflow batch. The `local_repo_commit` values differ since each originated from a different source repository.

## Querying `changes.json`

```bash
# All changes
jq -r '.changes[] | .title' changes.json

# Changes by product
jq -r '.changes[] | select(.product == "dotnet-runtime") | .title' changes.json

# Changes by repo
jq -r '.changes[] | select(.repo == "runtime") | .title' changes.json

# Count changes per repo
jq -r '[.changes[] | .repo] | group_by(.) | map({repo: .[0], count: length}) | sort_by(-.count)[]' changes.json

# Security changes
jq -r '.changes[] | select(.is_security) | .title' changes.json

# Cross-file join with cve.json (shared commit key format)
jq -r '.changes[] | select(.is_security) | .local_repo_commit' changes.json
# -> use these keys to look up CVE IDs in cve.json's cve_commits{}
```

## Relationship between the files

`changes.json` is the **source-of-truth input** to the editorial process. `features.json` is an enriched view that usually adds scoring and notes without changing the underlying identity of the shipped changes.

- `changes.json` has an entry for every PR that shipped
- `features.json` usually preserves those entries and adds optional scoring metadata
- Both files can be joined through shared `id` and `commits{}` values

## Relationship to markdown release notes

The markdown release notes are a curated subset informed by these JSON files:

- `changes.json` has an entry for every PR that shipped
- `features.json` helps rank which shipped changes are worth calling out
- Markdown only covers features worth calling out
- The agent reads `changes.json` and/or `features.json` to decide what to write about
- If a feature isn't in `changes.json`, it must not appear in the markdown
