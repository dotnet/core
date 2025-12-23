# Shared Types

This document describes types that are reused across multiple HAL index schemas in the .NET release notes graph.

## HalLink

Standard HAL+JSON link object used throughout the graph.

```json
{
  "href": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/9.0/index.json",
  "title": ".NET 9.0 Release Index",
  "type": "application/hal+json"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `href` | string | Yes | Absolute URL to the linked resource |
| `title` | string | No | Descriptive title for the linked resource |
| `type` | string | No | MIME type of the linked resource. Omit for HAL+JSON (default). |
| `templated` | boolean | No | Indicates that href is a URI template (RFC 6570) |

### MIME Types

| Type | Usage |
|------|-------|
| `application/hal+json` | Default, used for index documents (can be omitted) |
| `application/json` | Non-index JSON documents (e.g., `cve.json`) |
| `application/markdown` | Markdown documents (e.g., `README.md`) |

## PatchEntry

Embedded patch release summary used in major version indexes and month indexes.

```json
{
  "version": "9.0.10",
  "date": "2025-10-14T00:00:00+00:00",
  "year": "2025",
  "month": "10",
  "security": true,
  "cve_count": 2,
  "support_phase": "active",
  "_links": {
    "self": { "href": "..." },
    "month-shortcut": { "href": "..." }
  },
  "release": "9.0",
  "cve_records": ["CVE-2025-12345", "CVE-2025-12346"],
  "sdk_version": "9.0.400"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Patch version identifier (e.g., "9.0.10") |
| `date` | ISO 8601 | Yes | Release date |
| `year` | string | Yes | Release year (e.g., "2025") for filtering |
| `month` | string | Yes | Release month (e.g., "10") for filtering |
| `security` | boolean | Yes | Whether this release includes security fixes |
| `cve_count` | integer | Yes | Number of CVEs fixed (0 if none) |
| `support_phase` | enum | Yes | Support phase at time of release |
| `_links` | object | Yes | HAL navigation links |
| `release` | string | No | Major version (e.g., "9.0") - included in month-index, omitted in major-version-index |
| `cve_records` | string[] | No | CVE IDs fixed in this release |
| `sdk_version` | string | No | Highest SDK version in this patch |

### Support Phases

| Phase | Description |
|-------|-------------|
| `preview` | Pre-release, not production-ready |
| `go-live` | Release candidate, production-ready with support |
| `active` | Full support with regular servicing |
| `maintenance` | Security fixes only (last 6 months of support) |
| `eol` | End of life, no longer supported |

### Context-Dependent Fields

- In **major-version-index**: `release` is omitted (redundant - all patches belong to same major version)
- In **month-index**: `release` is included (patches may span multiple major versions)

## MajorVersionEntry

Embedded major version summary used in the root releases index.

```json
{
  "version": "9.0",
  "target_framework": "net9.0",
  "release_type": "sts",
  "support_phase": "active",
  "supported": true,
  "ga_date": "2024-11-12T00:00:00+00:00",
  "eol_date": "2026-05-12T00:00:00+00:00",
  "_links": {
    "self": { "href": "..." },
    "latest": { "href": "..." }
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Major version identifier (e.g., "9.0") |
| `target_framework` | string | No | Target framework moniker (e.g., "net9.0") |
| `release_type` | string | No | "lts" or "sts" |
| `support_phase` | string | No | Current support phase |
| `supported` | boolean | No | Whether version is currently supported |
| `security` | boolean | No | Whether latest patch has security fixes |
| `cve_count` | integer | No | Total CVE count for latest patch |
| `ga_date` | ISO 8601 | No | General Availability date |
| `eol_date` | ISO 8601 | No | End of Life date |
| `_links` | object | Yes | HAL navigation links |

### Release Types

| Type | Description | Support Duration |
|------|-------------|------------------|
| `lts` | Long-Term Support | 3 years |
| `sts` | Standard-Term Support | 18 months |

## CveDisclosure

Security vulnerability disclosure summary used in month indexes.

```json
{
  "id": "CVE-2025-12345",
  "title": "ASP.NET Core Security Feature Bypass Vulnerability",
  "_links": {
    "self": { "href": "https://github.com/dotnet/announcements/issues/123" }
  },
  "cvss": 7.5,
  "severity": "high"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CVE identifier (e.g., "CVE-2025-12345") |
| `title` | string | Yes | Title describing the vulnerability |
| `_links` | object | No | Links to CVE resources |
| `fixes` | object[] | No | Commit links that resolve this CVE |
| `cvss` | number | No | CVSS base score |
| `severity` | string | No | Severity level (critical, high, medium, low) |

## SdkBandEntry

SDK feature band entry used in patch detail indexes. Feature bands group SDK releases by the hundreds digit (e.g., 9.0.1xx, 9.0.2xx).

```json
{
  "version": "9.0.307",
  "band": "9.0.3xx",
  "date": "2025-10-14T00:00:00+00:00",
  "label": ".NET SDK 9.0.3xx",
  "support_phase": "active",
  "_links": {
    "downloads": { "href": "..." },
    "month-shortcut": { "href": "..." },
    "patch-shortcut": { "href": "..." }
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Latest SDK version in this band (e.g., "9.0.307") |
| `band` | string | Yes | Feature band identifier (e.g., "9.0.3xx") |
| `date` | ISO 8601 | No | Release date of the latest SDK in this band |
| `label` | string | No | Descriptive label for the band |
| `support_phase` | string | No | Support phase (preview, go-live, active, maintenance, eol) |
| `_links` | object | Yes | HAL navigation links |

### Feature Band Concept

.NET SDK uses a feature band versioning scheme where the hundreds digit indicates the band:
- `9.0.1xx` - First feature band (ships with .NET 9.0 GA)
- `9.0.2xx` - Second feature band (Visual Studio 17.12)
- `9.0.3xx` - Third feature band (Visual Studio 17.13)

Each band may receive independent updates, so a patch release can include multiple SDK versions across different bands.

## MonthSummary

Simplified month entry for year-level summaries.

```json
{
  "month": "10",
  "security": true,
  "_links": {
    "self": { "href": "..." }
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `month` | string | Yes | Month identifier (e.g., "10" for October) |
| `security` | boolean | Yes | Whether any release this month includes security fixes |
| `_links` | object | Yes | HAL navigation links |

## Standard Link Relations

Common link relation names used across indexes:

### Navigation Links

| Relation | Description |
|----------|-------------|
| `self` | Canonical URL of current resource |
| `prev` | Previous item in sequence |
| `next` | Next item in sequence (rarely used due to immutability) |
| `prev-security` | Previous item with security fixes |

### Hierarchy Links

| Relation | Context | Description |
|----------|---------|-------------|
| `root` | All indexes | Back to root releases index |
| `timeline` | Timeline indexes | Back to timeline root |
| `year` | Month indexes | Up to year index |

### Latest Links

| Relation | Context | Description |
|----------|---------|-------------|
| `latest` | Root/Major | Latest stable item |
| `latest-lts` | Root only | Latest Long-Term Support version |
| `latest-security` | Major | Latest patch with security fixes |
| `latest-sdk` | Major | SDK index with feature bands |
| `latest-year` | Timeline | Most recent year |
| `latest-month` | Year | Most recent month |
| `latest-security-month` | Year | Most recent month with CVEs |

### Cross-Graph Links (Shortcuts)

| Relation | Context | Description |
|----------|---------|-------------|
| `month-shortcut` | Patches | Timeline month of this release |
| `major-shortcut` | Patches | Up to major version index |
| `patch-shortcut` | SDK bands | Link to patch index |
| `year-shortcut` | Patches | Timeline year of this release |
| `cve-json` | Security patches | CVE details document |
| `manifest` | Major versions | Reference data (compatibility, TFMs) |

## Naming Conventions

- **Properties**: `snake_case_lower` for jq query ergonomics
- **Link relations**: `kebab-case-lower` following brand/name conventions
- **Titles**: Human-readable, include version numbers for context
