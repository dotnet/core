# changes.json Schema

Reference for the `changes.json` file produced by `dotnet-release generate changes`. One file per release milestone.

Based on the [changes schema proposal](https://gist.github.com/richlander/a2bf9beb6f09cf9ba7ecf80f5b51784e).

## Overview

`changes.json` is a comprehensive, machine-readable manifest of every PR and commit that shipped in a release. It is the companion to the editorial markdown release notes — the JSON tells you **everything that shipped**, the markdown tells you **what matters**.

It also serves as a companion to `cve.json` — both files use the same `commits{}` structure and `repo@shortcommit` key format, enabling cross-file joins.

## File location

```text
release-notes/{major.minor}/preview/{previewN}/changes.json    # previews
release-notes/{major.minor}/{major.minor.patch}/changes.json   # patches
```

## Top-level structure

| Field | Type | Description |
| ----- | ---- | ----------- |
| `release_version` | string | e.g., `"11.0.0-preview.3"` |
| `release_date` | string | ISO 8601, e.g., `"2026-04-08"` |
| `changes` | array | The change entries |
| `commits` | object | Normalized commit metadata, keyed by `repo@shortcommit` |

## Change entry fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | int | GitHub PR number; `0` if no public PR |
| `repo` | string | Short repository name (e.g., `"runtime"`) |
| `product` | string | Product slug from taxonomy (e.g., `"dotnet-runtime"`) |
| `package` | string | NuGet package name when applicable (e.g., `"System.Text.Json"`) |
| `title` | string | PR title; `""` if not available |
| `url` | string | Public GitHub PR URL; `""` if non-public |
| `commit` | string | Key into top-level `commits{}` dict |
| `is_security` | bool | `true` if this is a security change |

Both `product` and `package` may be present. At least one SHOULD be present.

## Commit entry fields (values in `commits{}`)

| Field | Type | Description |
| ----- | ---- | ----------- |
| `repo` | string | Short repository name |
| `branch` | string | Branch the commit landed on |
| `hash` | string | Full 40-character commit hash |
| `org` | string | GitHub organization (e.g., `"dotnet"`) |
| `url` | string | `.diff`-form commit URL |

## Conventions

- **No nulls** — every field is always present. Use `""` for missing strings, `0` for missing integers.
- **Naming** — `snake_case_lower` for JSON fields, `kebab-case-lower` for file names and repo slugs.
- **Public URLs only** — every URL must resolve publicly.
- **Commit URLs use `.diff` form** — for machine consumption.
- **Product slugs** come from the `products.json` taxonomy file (e.g., `dotnet-runtime`, `dotnet-aspnetcore`, `dotnet-sdk`).

## Example

```json
{
  "release_version": "11.0.0-preview.3",
  "release_date": "2026-04-08",
  "changes": [
    {
      "id": 112345,
      "repo": "runtime",
      "product": "dotnet-runtime",
      "package": "System.Text.Json",
      "title": "Add JsonSerializerOptions.Web preset",
      "url": "https://github.com/dotnet/runtime/pull/112345",
      "commit": "runtime@b2d5fa8",
      "is_security": false
    },
    {
      "id": 54321,
      "repo": "aspnetcore",
      "product": "dotnet-aspnetcore",
      "package": "",
      "title": "Add MapStaticAssets middleware",
      "url": "https://github.com/dotnet/aspnetcore/pull/54321",
      "commit": "aspnetcore@f45f3c9",
      "is_security": false
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
    }
  }
}
```

## Querying changes.json

```bash
# All changes
jq -r '.changes[] | .title' changes.json

# Changes by product
jq -r '.changes[] | select(.product == "dotnet-runtime") | .title' changes.json

# Changes affecting a NuGet package
jq -r '.changes[] | select(.package == "System.Text.Json") | .title' changes.json

# Security changes
jq -r '.changes[] | select(.is_security) | .title' changes.json

# Cross-file join with cve.json (shared commit key format)
jq -r '.changes[] | select(.is_security) | .commit' changes.json
# → use these keys to look up CVE IDs in cve.json's cve_commits{}
```

## Relationship to markdown release notes

`changes.json` is the **input** to the editorial process. The markdown release notes are a curated subset:

- `changes.json` has an entry for every PR that shipped
- Markdown only covers features worth calling out
- The agent reads `changes.json` to know what shipped, then decides what to write about
- If a feature isn't in `changes.json`, it must not appear in the markdown
