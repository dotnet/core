# Schema Reference

*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*

The fundamental building blocks of the .NET release graph. Use this when you need to understand what documents contain, what properties mean, or what link relations are available.

## File Types

| File | Example Path | Contains |
|------|--------------|----------|
| AI index | `llms.json` | Optimized entry point with embedded data and shortcut links |
| Releases index | `index.json` | All major versions with support status, EOL dates |
| Version index | `10.0/index.json` | All patches for a version, links to resources |
| Patch index | `10.0/10.0.1/index.json` | Single patch details, embedded CVE disclosures |
| Manifest | `10.0/manifest.json` | External links (downloads, docs, supported OS) |
| Compatibility | `10.0/compatibility.json` | Breaking changes with impact, actions, doc links |
| Target frameworks | `10.0/target-frameworks.json` | TFMs with platform versions |
| SDK index | `10.0/sdk/index.json` | SDK feature bands with support status and downloads |
| Supported OS | `10.0/supported-os.json` | Supported distros, libc requirements |
| OS packages | `10.0/os-packages.json` | Distro-specific package dependencies |
| Timeline index | `timeline/index.json` | All years |
| Year index | `timeline/2025/index.json` | All months with CVE summaries |
| Month index | `timeline/2025/01/index.json` | Releases that month, embedded CVE disclosures |
| CVE details | `timeline/2025/01/cve.json` | Full CVE data: CVSS vectors, CWE, packages |

Paths are illustrative—always follow `_links["..."].href` to get actual URLs.

## Link Relations

### Navigation

| Relation | Description |
|----------|-------------|
| `self` | Canonical URL for this resource |
| `prev` | Previous resource in sequence (patch, month, year) |
| `prev-security` | Previous security release (skips non-security) |

### Latest Shortcuts

| Relation | Description |
|----------|-------------|
| `latest` | Latest patch or release in context |
| `latest-lts` | Latest Long Term Support version |
| `latest-sdk` | SDK index for this version |
| `latest-security` | Latest security patch |
| `latest-year` | Most recent year index |
| `latest-month` | Most recent month index |
| `latest-security-month` | Most recent security month index |
| `latest-release` | Latest major version index |
| `latest-patch` | Latest patch index for a major version |

### Cross-References

| Relation | Description |
|----------|-------------|
| `release-major` | Parent major version index |
| `release-month` | Timeline month index for this release |
| `releases-index` | Root releases index |
| `timeline-index` | Root timeline index |
| `release-manifest` | Manifest with external resources |

### Data Resources

| Relation | Description |
|----------|-------------|
| `compatibility-json` | Breaking changes data |
| `target-frameworks-json` | TFM data |
| `supported-os-json` | Supported OS data |
| `os-packages-json` | OS package requirements |
| `cve-json` | CVE disclosure details (JSON) |
| `cve-markdown` | CVE disclosure details (Markdown) |
| `release-notes-markdown` | Release notes (Markdown) |

### Rendered Views

| Relation | Description |
|----------|-------------|
| `*-rendered` | GitHub HTML-rendered view (e.g., `cve-markdown-rendered`) |

## Properties

### Version and Identity

| Property | Type | Description |
|----------|------|-------------|
| `kind` | string | Document type (e.g., "releases-index", "patch-version-index") |
| `version` | string | Version number (e.g., "10.0", "8.0.21") |
| `release` | string | Major version (e.g., "10.0") |
| `band` | string | SDK feature band identifier (e.g., "8.0.4xx") |

### Dates

| Property | Type | Description |
|----------|------|-------------|
| `date` | ISO 8601 | Release date |
| `ga_date` | ISO 8601 | General Availability date |
| `eol_date` | ISO 8601 | End of Life date |

### Timeline

| Property | Type | Description |
|----------|------|-------------|
| `year` | string | Calendar year (e.g., "2025") |
| `month` | string | Calendar month, zero-padded (e.g., "01", "10") |
| `latest_year` | string | Most recent year with releases |

### Status

| Property | Type | Description |
|----------|------|-------------|
| `release_type` | enum | `lts` or `sts` |
| `support_phase` | enum | `preview`, `go-live`, `active`, `maintenance`, `eol` |
| `supported` | boolean | Whether the version is currently supported |
| `security` | boolean | Whether this release includes security fixes |

### CVE

| Property | Type | Description |
|----------|------|-------------|
| `cve_count` | integer | Number of CVEs addressed |
| `cve_records` | array | List of CVE identifiers (e.g., ["CVE-2025-55247"]) |

### Latest References

| Property | Type | Description |
|----------|------|-------------|
| `latest` | string | Latest version in this context |
| `latest_lts` | string | Latest LTS version |
| `latest_security` | string | Latest security patch version |

## Glossary

### Release Types

| Value | Definition |
|-------|------------|
| `lts` | Long-Term Support — 3-year support window |
| `sts` | Standard-Term Support — 18-month support window |

Even-numbered releases are LTS (8, 10, 12...). Odd-numbered are STS (9, 11, 13...).

### Support Phases

| Value | Definition |
|-------|------------|
| `preview` | Pre-release for testing; not production-supported |
| `go-live` | Production-supported release candidate before GA |
| `active` | Full support with functional and security updates |
| `maintenance` | Final 6 months; security fixes only |
| `eol` | End of Life — no longer supported |

### CVE Severity Levels

| Value | CVSS Score Range |
|-------|------------------|
| `CRITICAL` | 9.0 - 10.0 |
| `HIGH` | 7.0 - 8.9 |
| `MEDIUM` | 4.0 - 6.9 |
| `LOW` | 0.1 - 3.9 |
| `NONE` | 0.0 |

### Affected Products

| Value | Description |
|-------|-------------|
| `.NET Runtime` | Core runtime |
| `ASP.NET Core` | Web framework runtime |
| `.NET SDK` | Software Development Kit |
| `Windows Desktop` | WPF/WinForms runtime |

## Conventions

- Properties use `snake_case`
- Link relations use `kebab-case`
- `_embedded` contains pre-fetched data
- `_links` contains navigation
- Discover available links: `jq '._links | keys[]'`
