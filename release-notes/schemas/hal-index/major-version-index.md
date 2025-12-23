# Major Version Index

Index of all patch releases within a major .NET version. Located at `{version}/index.json` (e.g., `10.0/index.json`).

## Example

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/schemas/v1/dotnet-release-version-index.json",
  "kind": "major",
  "title": ".NET Major Release Index - 10.0",
  "target_framework": "net10.0",
  "latest": "10.0.1",
  "latest_security": "10.0.0-rc.2",
  "release_type": "lts",
  "support_phase": "active",
  "supported": true,
  "ga_date": "2025-11-11T00:00:00+00:00",
  "eol_date": "2028-11-14T00:00:00+00:00",
  "_links": {
    "self": { "href": "..." },
    "downloads": { "href": "...", "title": "Downloads - .NET 10.0" },
    "latest": { "href": "...", "title": "Latest patch - 10.0.1" },
    "latest-sdk": { "href": "...", "title": "Latest SDK - .NET 10.0" },
    "latest-security": { "href": "...", "title": "Latest security patch - 10.0.0-rc.2" },
    "manifest": { "href": "...", "title": "Manifest - .NET 10.0" },
    "root": { "href": "...", "title": ".NET Release Index" }
  },
  "_embedded": {
    "patches": [
      {
        "version": "10.0.1",
        "release": "10.0",
        "date": "2025-12-09T00:00:00+00:00",
        "year": "2025",
        "month": "12",
        "security": false,
        "cve_count": 0,
        "support_phase": "active",
        "sdk_version": "10.0.101",
        "_links": {
          "self": { "href": "..." },
          "month-shortcut": { "href": "..." }
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
| `kind` | string | Yes | Always `"major"` |
| `title` | string | Yes | Human-readable title |
| `target_framework` | string | No | Target framework moniker (e.g., "net10.0") |
| `latest` | string | No | Latest patch version |
| `latest_security` | string | No | Latest patch version with security fixes |
| `release_type` | string | No | "lts" or "sts" |
| `support_phase` | string | No | Current support phase |
| `supported` | boolean | No | Whether version is currently supported |
| `ga_date` | ISO 8601 | No | General Availability date |
| `eol_date` | ISO 8601 | No | End of Life date |
| `_links` | object | Yes | HAL navigation links |
| `_embedded` | object | No | Embedded patch entries |

## Links

| Relation | Required | Description |
|----------|----------|-------------|
| `self` | Yes | Canonical URL of this index |
| `latest` | No | Link to latest patch index |
| `latest-security` | No | Link to latest security patch index |
| `latest-sdk` | No | Link to SDK feature band index (8.0+) |
| `manifest` | No | Reference data (compatibility, TFMs, OS support) |
| `downloads` | No | Download links index |
| `root` | No | Back to root releases index |

## Embedded: patches

Array of `PatchEntry` objects (see [shared-types.md](shared-types.md)).

Entries include:
- Patch version, release date, and SDK version
- Security flag and CVE count
- `support_phase` reflecting phase **at time of release**
- Timeline cross-links via `month-shortcut`

## Preview Filtering

Preview releases (versions containing "-preview.") are filtered out once the major version reaches GA. This reduces index size and focuses on production-relevant releases.

**RC releases are preserved** because they have "go-live" support status.

For pre-9.0 releases, filtering is based on directory structure (previews stored in `preview/` subdirectory). For 9.0+, filtering uses explicit phase checking.

## Mutability

**Mutable** - Updated monthly with new patch releases.

## Navigation Patterns

### Find all security patches

```jq
._embedded.patches | map(select(.security == true))
```

### Get patches from a specific month

```jq
._embedded.patches | map(select(.year == "2025" and .month == "10"))
```

### Walk security history

Start from `_links["latest-security"]`, then follow `prev-security` links in each patch index.

## Design Notes

- `support_phase` is synthesized based on release date, not current state
  - Maintenance phase starts 6 months before EOL date
- `supported` is omitted from patch entries (inherited from root)
- `release` field enables filtering when patches from multiple versions are mixed
- Patches ordered newest-first by date, then by version (numeric comparison)
