# Year Index

Index of all months with .NET releases in a specific year. Located at `timeline/{year}/index.json` (e.g., `timeline/2025/index.json`).

## Example

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/schemas/v1/dotnet-release-timeline-index.json",
  "kind": "year",
  "title": ".NET Year Timeline Index - 2025",
  "year": "2025",
  "latest_month": "12",
  "latest_security_month": "10",
  "latest": "10.0",
  "releases": ["10.0", "9.0", "8.0"],
  "_links": {
    "self": { "href": "..." },
    "prev": { "href": "...", "title": "Previous year - 2024" },
    "latest": { "href": "...", "title": "Latest release - .NET 10.0" },
    "latest-month": { "href": "...", "title": "Latest month - December 2025" },
    "latest-security-month": { "href": "...", "title": "Latest security month - October 2025" },
    "timeline": { "href": "...", "title": ".NET Release Timeline Index" }
  },
  "_embedded": {
    "months": [
      {
        "month": "12",
        "security": false,
        "_links": { "self": { "href": "..." } }
      },
      {
        "month": "10",
        "security": true,
        "_links": {
          "self": { "href": "..." },
          "cve-json": { "href": "..." }
        }
      }
    ]
  }
}
```

## Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$schema` | string | No | JSON Schema reference for validation |
| `kind` | string | Yes | Always `"year"` |
| `title` | string | Yes | Human-readable title |
| `year` | string | Yes | Year identifier (e.g., "2025") |
| `latest_month` | string | No | Most recent month with releases |
| `latest_security_month` | string | No | Most recent month with security releases |
| `latest` | string | No | Highest major version with GA in this year |
| `releases` | string[] | No | Major versions with releases this year |
| `_links` | object | Yes | HAL navigation links |
| `_embedded` | object | No | Embedded month summaries |

## Links

| Relation | Required | Description |
|----------|----------|-------------|
| `self` | Yes | Canonical URL of this index |
| `prev` | No | Previous year index (backward navigation) |
| `latest` | No | Cross-link to highest major version index |
| `latest-month` | No | Link to most recent month in this year |
| `latest-security-month` | No | Link to most recent security month |
| `timeline` | No | Back to timeline root index |

## Embedded: months

Array of `MonthSummary` objects (see [shared-types.md](shared-types.md)):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `month` | string | Yes | Month identifier (e.g., "10" for October) |
| `security` | boolean | Yes | Whether any release this month has CVEs |
| `_links` | object | Yes | Navigation links (self, optionally cve-json) |

Security months include a `cve-json` link for quick CVE access.

## Mutability

**Mutable** - Updated monthly within the year with new releases.

## Navigation Patterns

### Find all security months

```jq
._embedded.months | map(select(.security == true))
```

### Walk backwards through years

Start from `timeline-index`, get `latest-year`, then follow `prev` links.

### Get CVEs for a security month

Follow the `cve-json` link in the month entry.

## Design Notes

- `prev` enables backward navigation (no `next` due to immutability pattern)
- `latest` refers to major version, not patch (highest .NET version with GA in the year)
- Month entries are simplified summaries; full details via month index
- Months ordered newest-first (12, 11, 10, ...)
- `cve-json` links only appear on months with `security: true`
