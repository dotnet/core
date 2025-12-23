# Patch Detail Index

Detailed information for a specific patch release. Located at `{version}/{patch}/index.json` (e.g., `9.0/9.0.0/index.json`).

## Example

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/schemas/v1/dotnet-patch-detail-index.json",
  "kind": "patch",
  "title": ".NET Patch Release Index - 9.0.0",
  "version": "9.0.0",
  "date": "2024-12-03T00:00:00+00:00",
  "support_phase": "active",
  "security": true,
  "cve_count": 2,
  "sdk_version": "9.0.101",
  "sdk_feature_bands": ["9.0.101", "9.0.100"],
  "_links": {
    "self": { "href": "..." },
    "prev": { "href": "...", "title": "Previous patch release - 9.0.0-rc.2" },
    "prev-security": { "href": "...", "title": "Previous security patch release - 9.0.0-rc.2" },
    "latest-sdk": { "href": "...", "title": "Latest SDK - .NET 9.0" },
    "manifest": { "href": "...", "title": "Manifest - .NET 9.0" },
    "major-shortcut": { "href": "...", "title": ".NET Major Release Index - 9.0" },
    "month-shortcut": { "href": "...", "title": ".NET Month Timeline Index - December 2024" },
    "root": { "href": "...", "title": ".NET Release Index" }
  },
  "_embedded": {
    "sdk": { ... },
    "sdk_feature_bands": [ ... ]
  }
}
```

## Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$schema` | string | No | JSON Schema reference for validation |
| `kind` | string | Yes | Always `"patch"` |
| `title` | string | Yes | Human-readable title |
| `version` | string | Yes | Patch version identifier |
| `date` | ISO 8601 | No | Release date |
| `support_phase` | string | No | Support phase at time of release |
| `security` | boolean | Yes | Whether this release includes security fixes |
| `cve_count` | integer | Yes | Number of CVEs fixed (0 if none) |
| `cve_records` | string[] | No | CVE IDs fixed in this release |
| `sdk_version` | string | No | Highest SDK version in this patch |
| `sdk_feature_bands` | string[] | No | All SDK feature band versions |
| `_links` | object | Yes | HAL navigation links |
| `_embedded` | object | No | Embedded SDK and CVE details |

## Links

| Relation | Required | Description |
|----------|----------|-------------|
| `self` | Yes | Canonical URL of this index |
| `prev` | No | Previous patch release (chronological) |
| `prev-security` | No | Previous patch with security fixes |
| `latest-sdk` | No | SDK feature band index |
| `manifest` | No | Patch-specific manifest (compatibility, downloads) |
| `major-shortcut` | No | Up to major version index |
| `month-shortcut` | No | Timeline month of this release (shortcut) |
| `root` | No | Back to root releases index |

## Embedded Objects

### sdk

Quick lookup for the highest SDK feature band in this patch.

```json
{
  "version": "9.0.101",
  "band": "9.0.1xx",
  "date": "2024-12-03T00:00:00+00:00",
  "label": ".NET SDK 9.0.1xx",
  "support_phase": "active",
  "_links": {
    "downloads": { "href": "..." },
    "month-shortcut": { "href": "..." },
    "patch-shortcut": { "href": "..." }
  }
}
```

### sdk_feature_bands

Array of `SdkFeatureBandEntry` objects with same shape as `sdk`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Latest SDK version in this band |
| `band` | string | Yes | Feature band identifier (e.g., "9.0.1xx") |
| `date` | ISO 8601 | No | Release date |
| `label` | string | No | Descriptive label |
| `support_phase` | string | No | Support phase |
| `_links` | object | Yes | Navigation links |

### disclosures

Array of `CveDisclosure` objects when `security: true`. See [shared-types.md](shared-types.md).

## Mutability

**Immutable** - Patch indexes are frozen after release. They use `prev` links (not `next`) because future patches don't exist at time of creation.

## Navigation Patterns

### Walk backwards through all patches

```bash
# Start from latest
curl -s "$MAJOR_INDEX" | jq -r '._links.latest.href' | xargs curl -s

# Then follow prev links
```

### Walk backwards through security patches only

Start from `latest-security` in major index, then follow `prev-security` links.

### Cross to timeline view

Follow `month-shortcut` to see what else shipped that month.

## Design Notes

- `prev` and `prev-security` enable backward traversal (immutability pattern)
- `month-shortcut` is a shortcut link for cross-graph navigation
- `sdk` provides quick access to primary SDK without scanning `sdk_feature_bands`
- Feature bands support the SDK hive pattern introduced in .NET 8
