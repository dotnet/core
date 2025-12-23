# Month Index

Detailed information for all .NET releases in a specific month. Located at `timeline/{year}/{month}/index.json` (e.g., `timeline/2025/10/index.json`).

## Example

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/schemas/v1/dotnet-release-timeline-index.json",
  "kind": "month",
  "title": ".NET Month Timeline Index - October 2025",
  "year": "2025",
  "month": "10",
  "date": "2025-10-14T00:00:00+00:00",
  "security": true,
  "cve_count": 3,
  "cve_records": ["CVE-2025-55248", "CVE-2025-55315", "CVE-2025-55247"],
  "releases": ["10.0", "9.0", "8.0"],
  "_links": {
    "self": { "href": "..." },
    "prev": { "href": "...", "title": "Previous month - September 2025" },
    "prev-security": { "href": "...", "title": "Previous security month - June 2025" },
    "manifest": { "href": "...", "title": "Manifest - October 2025" },
    "timeline": { "href": "...", "title": ".NET Release Timeline Index" },
    "year": { "href": "...", "title": ".NET Year Timeline Index - 2025" },
    "cve-json": { "href": "...", "title": "CVE records - October 2025", "type": "application/json" }
  },
  "_embedded": {
    "patches": [ ... ],
    "disclosures": [ ... ]
  }
}
```

## Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$schema` | string | No | JSON Schema reference for validation |
| `kind` | string | Yes | Always `"month"` |
| `title` | string | Yes | Human-readable title |
| `year` | string | Yes | Year identifier |
| `month` | string | Yes | Month identifier (e.g., "10") |
| `date` | ISO 8601 | No | Release date (typically Patch Tuesday) |
| `security` | boolean | Yes | Whether any release has security fixes |
| `cve_count` | integer | No | Total unique CVEs disclosed this month |
| `cve_records` | string[] | No | All CVE IDs disclosed this month |
| `releases` | string[] | No | Major versions with releases this month |
| `_links` | object | Yes | HAL navigation links |
| `_embedded` | object | No | Embedded patches and CVE disclosures |

## Links

| Relation | Required | Description |
|----------|----------|-------------|
| `self` | Yes | Canonical URL of this index |
| `prev` | No | Previous month index (backward navigation) |
| `prev-security` | No | Previous month with security releases |
| `manifest` | No | Month-specific manifest |
| `timeline` | No | Back to timeline root |
| `year` | No | Up to year index |
| `cve-json` | No | CVE details document (when security=true) |

## Embedded: patches

Array of `PatchEntry` objects (see [shared-types.md](shared-types.md)).

In month index context, patches include:
- `supported` flag indicating if release was supported at time of release
- `support_phase` reflecting phase at time of release
- `release` field for filtering by major version

```json
{
  "version": "9.0.10",
  "release": "9.0",
  "date": "2025-10-14T00:00:00+00:00",
  "year": "2025",
  "month": "10",
  "security": true,
  "cve_count": 3,
  "cve_records": ["CVE-2025-55248", "CVE-2025-55315", "CVE-2025-55247"],
  "support_phase": "active",
  "supported": true,
  "sdk_version": "9.0.306",
  "_links": { "self": { "href": "..." } }
}
```

## Embedded: disclosures

Array of `CveDisclosure` objects with full CVE details:

```json
{
  "id": "CVE-2025-55248",
  "title": ".NET Information Disclosure Vulnerability",
  "_links": {
    "self": { "href": "https://github.com/dotnet/announcements/issues/372" }
  },
  "fixes": [
    {
      "href": "https://github.com/dotnet/runtime/commit/18e28d767acf...diff",
      "repo": "dotnet/runtime",
      "branch": "release/9.0",
      "title": "Fix commit in runtime (release/9.0)",
      "release": "9.0",
      "min_vulnerable": "9.0.0",
      "max_vulnerable": "9.0.9",
      "fixed": "9.0.10"
    }
  ],
  "cvss_score": 4.8,
  "cvss_severity": "MEDIUM",
  "disclosure_date": "2025-10-14",
  "affected_releases": ["8.0", "9.0"],
  "affected_products": ["dotnet-runtime"],
  "platforms": ["all"]
}
```

### CveDisclosure Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CVE identifier |
| `title` | string | Yes | Vulnerability title |
| `_links` | object | No | Links to CVE resources |
| `fixes` | object[] | No | Fix commits with version ranges |
| `cvss_score` | number | No | CVSS base score |
| `cvss_severity` | string | No | CRITICAL, HIGH, MEDIUM, or LOW |
| `disclosure_date` | string | No | Date CVE was disclosed |
| `affected_releases` | string[] | No | Major versions affected |
| `affected_products` | string[] | No | Products affected (runtime, sdk, aspnetcore) |
| `affected_packages` | string[] | No | NuGet packages affected |
| `platforms` | string[] | No | Platforms affected ("all", "linux", "windows") |

### Fix Commit Fields

| Field | Type | Description |
|-------|------|-------------|
| `href` | string | URL to commit diff |
| `repo` | string | Repository name |
| `branch` | string | Branch name |
| `title` | string | Descriptive title |
| `release` | string | Major version this fix applies to |
| `min_vulnerable` | string | First vulnerable version |
| `max_vulnerable` | string | Last vulnerable version |
| `fixed` | string | First fixed version |

## Mutability

**Immutable** - Month indexes are frozen after release. Uses `prev` and `prev-security` links for backward traversal.

## Navigation Patterns

### Get all patches for a specific major version

```jq
._embedded.patches | map(select(.release == "9.0"))
```

### Find critical CVEs

```jq
._embedded.disclosures | map(select(.cvss_severity == "CRITICAL"))
```

### Walk backwards through security months

Start from year index `latest-security-month`, then follow `prev-security` links.

### Cross to version hierarchy

Follow patch `_links.self` to get full patch details from the version-based index.

## Design Notes

- `supported` is included because month may contain mixed releases (preview + GA patches)
- `disclosures` provides full CVE context including fix commits with version ranges
- `prev-security` enables walking security history across month boundaries
- Cross-year navigation: `prev` may link to December of previous year
- `cve-json` link has explicit `type: application/json` since it's not HAL+JSON
