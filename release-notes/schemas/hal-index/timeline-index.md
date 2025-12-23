# Timeline Index

Root entry point for navigating .NET releases by time. Located at `timeline/index.json`.

## Example

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/schemas/v1/dotnet-release-timeline-index.json",
  "kind": "timeline",
  "title": ".NET Release Timeline Index",
  "latest": "10.0",
  "latest_lts": "10.0",
  "latest_year": "2025",
  "_links": {
    "self": { "href": "..." },
    "latest": { "href": "...", "title": "Latest release - .NET 10.0" },
    "latest-lts": { "href": "...", "title": "Latest LTS release - .NET 10.0" },
    "latest-year": { "href": "...", "title": "Latest year - 2025" },
    "root": { "href": "...", "title": ".NET Release Index" }
  },
  "_embedded": {
    "years": [
      {
        "year": "2025",
        "releases": ["10.0", "9.0", "8.0"],
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
| `kind` | string | Yes | Always `"timeline"` |
| `title` | string | Yes | Human-readable title |
| `latest` | string | No | Latest stable major version |
| `latest_lts` | string | No | Latest LTS major version |
| `latest_year` | string | No | Most recent year with releases |
| `_links` | object | Yes | HAL navigation links |
| `_embedded` | object | No | Embedded year entries |

## Links

| Relation | Required | Description |
|----------|----------|-------------|
| `self` | Yes | Canonical URL of this index |
| `latest` | No | Cross-link to latest major version index |
| `latest-lts` | No | Cross-link to latest LTS major version index |
| `latest-year` | No | Link to most recent year index |
| `root` | No | Cross-link to version-based root index |

## Embedded: years

Array of year entry objects:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `year` | string | Yes | Year identifier (e.g., "2025") |
| `releases` | string[] | No | Major versions with releases in this year |
| `_links` | object | Yes | Navigation links (self required) |

## Mutability

**Mutable** - Updated when new years are added (annually).

## Navigation Patterns

### Find years with releases for a specific version

```jq
._embedded.years | map(select(.releases | contains(["9.0"])))
```

### Get releases for a specific year

```jq
._embedded.years | map(select(.year == "2024")) | .[0].releases
```

## Design Notes

- Provides quick overview of entire .NET release history
- `releases` array shows which major versions were active each year
- Cross-links to version-based hierarchy (`latest`, `latest-lts`) enable navigation between timelines
- Entries ordered newest-first by year
