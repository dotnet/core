---
name: schema-reference
description: Document structure, properties, link relations, and glossary
---

# Schema Reference

## Stop Criteria

**This is a reference document.** Use it to understand structure, then navigate the actual graph. Do not fetch during normal queries.

## File Types

| File | Path Pattern | Contains |
|------|--------------|----------|
| AI index | `llms.json` | Entry point with embedded data |
| Releases index | `index.json` | All versions including EOL |
| Version index | `X.0/index.json` | Patches, resources for version |
| Patch index | `X.0/X.0.1/index.json` | Single patch, CVE disclosures |
| Manifest | `X.0/manifest.json` | External links (OS, docs) |
| Compatibility | `X.0/compatibility.json` | Breaking changes |
| SDK index | `X.0/sdk/index.json` | SDK bands, downloads |
| Month index | `timeline/YYYY/MM/index.json` | Releases, CVE disclosures |
| CVE details | `timeline/YYYY/MM/cve.json` | Full CVSS vectors, CWE, packages |

Paths are illustrative—always follow `_links["..."].href`.

## Link Relations

| Relation | Description |
|----------|-------------|
| `self`, `prev`, `prev-security` | Navigation (backward from present) |
| `latest`, `latest-lts` | Newest release; diverge when STS is newer than current LTS |
| `latest-security` | Newest security patch |
| `latest-security-month` | Current security month |
| `major-shortcut`, `manifest` | Cross-references |
| `root`, `timeline-index` | Root indexes |
| `compatibility`, `supported-os`, `os-packages`, `target-frameworks` | Data resources |
| `cve-json` | Full CVE details (CVSS vectors, CWE) |
| `*-rendered` | GitHub HTML views |

## Properties

### Version and Identity

| Property | Type | Description |
|----------|------|-------------|
| `kind` | string | Document type (e.g., "root", "patch-version-index") |
| `version` | string | Version number (e.g., "10.0", "8.0.21") |
| `release` | string | Major version (e.g., "10.0") |
| `band` | string | SDK feature band identifier (e.g., "8.0.4xx") |

### Dates

| Property | Type | Description |
|----------|------|-------------|
| `date` | ISO 8601 | Release date |
| `ga_date` | ISO 8601 | General Availability date |
| `eol_date` | ISO 8601 | End of Life date |

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

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| Fetching schema.md during queries | Reference only—use task-specific skills |
| Confusing `version` vs `release` | `version` is patch (10.0.1), `release` is major (10.0) |
| Using `snake_case` for link relations | Links use `kebab-case`; properties use `snake_case` |

## Conventions

- Properties: `snake_case` | Links: `kebab-case`
- `_embedded`: pre-fetched data | `_links`: navigation
