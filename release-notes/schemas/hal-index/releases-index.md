# Releases Index

The root entry point for navigating .NET releases by version. Located at `index.json` in the release-notes directory.

## Example

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/schemas/v1/dotnet-release-version-index.json",
  "kind": "root",
  "title": ".NET Release Index",
  "latest": "10.0",
  "latest_lts": "10.0",
  "_links": {
    "self": { "href": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json" },
    "latest": { "href": "...", "title": "Latest release - .NET 10.0" },
    "latest-lts": { "href": "...", "title": "Latest LTS release - .NET 10.0" },
    "timeline": { "href": "...", "title": ".NET Release Timeline Index" }
  },
  "_embedded": {
    "releases": [
      {
        "version": "10.0",
        "release_type": "lts",
        "supported": true,
        "_links": { "self": { "href": "..." } }
      }
    ]
  }
}
```

## Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$schema` | string | No | JSON Schema reference for validation |
| `kind` | string | Yes | Always `"root"` |
| `title` | string | Yes | Human-readable title |
| `latest` | string | No | Latest stable major version (e.g., "10.0") |
| `latest_lts` | string | No | Latest LTS major version |
| `_links` | object | Yes | HAL navigation links |
| `_embedded` | object | No | Embedded major version entries |

## Links

| Relation | Required | Description |
|----------|----------|-------------|
| `self` | Yes | Canonical URL of this index |
| `latest` | No | Link to latest stable major version index |
| `latest-lts` | No | Link to latest LTS major version index |
| `timeline` | No | Cross-link to timeline navigation |

## Embedded: releases

Array of `MajorVersionEntry` objects (see [shared-types.md](shared-types.md)).

In this context, entries are simplified to minimal fields for quick scanning:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Major version identifier |
| `release_type` | string | No | "lts" or "sts" |
| `supported` | boolean | No | Whether version is currently supported |
| `_links` | object | Yes | Navigation links (self required) |

## Mutability

**Mutable** - Updated when new major versions are added (annually).

## Navigation Patterns

### Find all supported versions

```jq
._embedded.releases | map(select(.supported == true))
```

### Find current LTS versions

```jq
._embedded.releases | map(select(.supported == true and .release_type == "lts"))
```

### Get latest release details

Follow `_links.latest.href` to reach the major version index.

## Design Notes

- Entries ordered by version (newest first) using numeric comparison
- Minimal entry shape - full lifecycle details available by following `self` link
- `latest` and `latest_lts` may point to the same version when a new LTS ships
- Timeline cross-link enables time-based navigation from version-based starting point
