# .NET Release Index Vocabulary

## Key Terms

Core terms for navigation and filtering:

| Term | Description |
|------|-------------|
| `self` | Canonical URL for the current resource |
| `prev` | Previous resource in sequence |
| `prev-security` | Previous security release in sequence |
| `latest` | Most recent version/resource in context |
| `latest-lts` | Most recent Long Term Support version |
| `latest-security` | Most recent security patch |
| `latest-year` | Most recent year with releases |
| `latest-month` | Most recent month with releases |
| `latest-security-month` | Most recent month with security releases |
| `latest-release` | Most recent major version in a time period |
| `supported` | Whether a version is currently receiving updates |
| `security` | Whether a release includes security fixes |

## Root Properties

Top-level properties that appear in index documents:

| Property | Type | Description |
|----------|------|-------------|
| `$schema` | string | JSON Schema reference URL |
| `kind` | string | Document type classifier |
| `title` | string | Human-readable title |
| `description` | string | Human-readable description |
| `version` | string | Version number (e.g., "10.0", "8.0.21") |
| `_links` | object | HAL link collection |
| `_embedded` | object | HAL embedded resources |
| `_metadata` | object | Generation metadata |

## Index Types (kind)

| Value | Description |
|-------|-------------|
| `releases-index` | Root index containing all major .NET versions |
| `major-version-index` | Index for a major version (e.g., 8.0) with all patches |
| `patch-version-index` | Index for a specific patch release (e.g., 8.0.21) |
| `sdk-index` | Index for SDK feature bands within a major version |
| `timeline-index` | Root timeline index across all years |
| `year-index` | Timeline index for a calendar year |
| `month-index` | Timeline index for a calendar month |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `version` | string | Version number (e.g., "10.0", "8.0.21", "8.0.415") |
| `date` | ISO 8601 | Release date |
| `year` | string | Calendar year (e.g., "2025") |
| `month` | string | Calendar month, zero-padded (e.g., "01", "10") |
| `latest` | string | Latest version in this context |
| `latest_lts` | string | Latest Long Term Support version |
| `latest_year` | string | Most recent year with releases |
| `latest_month` | string | Most recent month with releases |
| `latest_security` | string | Latest security patch version |
| `latest_security_month` | string | Most recent month with security releases |
| `latest_release` | string | Latest major version released in a time period |
| `latest_feature_band` | string | Latest SDK feature band (e.g., "8.0.4xx") |
| `release_type` | enum | `lts` or `sts` |
| `support_phase` | enum | `active`, `maintenance`, `eol`, `preview`, `go-live` |
| `supported` | boolean | Whether the version is currently supported |
| `security` | boolean | Whether this release includes security fixes |
| `ga_date` | ISO 8601 | General Availability date |
| `eol_date` | ISO 8601 | End of Life date |
| `cve_count` | integer | Number of CVEs addressed in this release |
| `cve_records` | array | List of CVE identifiers (e.g., ["CVE-2025-55247"]) |
| `sdk_release` | string | Primary SDK version for this runtime release |
| `sdk_feature_bands` | array | All SDK feature band versions for this patch |
| `band` | string | SDK feature band identifier (e.g., "8.0.4xx") |
| `label` | string | Human-readable band label (e.g., ".NET SDK 8.0.4xx") |
| `releases` | array | Major versions with releases in this time period |
| `runtime_patches` | array | Runtime patch versions released in a month |

## Embedded Collections (_embedded)

| Collection | Found In | Description |
|------------|----------|-------------|
| `releases` | releases-index, major-version-index, month-index, year-index | Release records |
| `years` | timeline-index, major-version-index | Year timeline records |
| `months` | year-index | Month timeline records |
| `feature_bands` | sdk-index | SDK feature band records |
| `sdk_release` | patch-version-index | Primary SDK release for a patch |
| `sdk_feature_bands` | patch-version-index | All SDK feature bands for a patch |
| `disclosures` | patch-version-index | CVE disclosure records |

## Link Relations (_links)

| Relation | Description |
|----------|-------------|
| `self` | Canonical URL for this resource |
| `prev` | Previous resource in sequence (patch, month, or year) |
| `prev-security` | Previous security release in sequence |
| `latest` | Latest patch or release in this context |
| `latest-lts` | Latest Long Term Support version |
| `latest-sdk` | SDK index for this version |
| `latest-security` | Latest security patch |
| `latest-year` | Most recent year index |
| `latest-month` | Most recent month index |
| `latest-security-month` | Most recent security month index |
| `latest-release` | Latest major version index |
| `latest-patch` | Latest patch index for a major version |
| `latest-release-json` | Full release information JSON |
| `downloads` | Downloads index for binaries |
| `releases-index` | Root releases index |
| `release-major` | Parent major version index |
| `release-month` | Timeline month index for this release |
| `release-patch` | Patch index for an SDK release |
| `release-json` | Full release information |
| `timeline-index` | Root timeline index |
| `year-index` | Parent year index |
| `compatibility-json` | Breaking changes data |
| `cve-json` | CVE disclosure details (JSON) |
| `cve-markdown` | CVE disclosure details (Markdown) |
| `cve-markdown-rendered` | CVE disclosure details (rendered HTML) |
| `release-notes-markdown` | Release notes (Markdown) |
| `release-notes-markdown-rendered` | Release notes (rendered HTML) |
| `glossary-markdown` | Glossary of terms (Markdown) |
| `glossary-markdown-rendered` | Glossary of terms (rendered HTML) |
| `llms-txt` | LLM quick reference |

## Metadata Properties (_metadata)

| Property | Type | Description |
|----------|------|-------------|
| `schema_version` | string | Schema version (e.g., "1.0") |
| `generated_on` | ISO 8601 | Timestamp when document was generated |
| `generated_by` | string | Generator name (e.g., "VersionIndex", "ShipIndex") |

## CVE Disclosure Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | CVE identifier (e.g., "CVE-2025-55247") |
| `title` | string | Vulnerability title |
| `cvss_score` | number | CVSS v3.1 base score (0.0-10.0) |
| `cvss_severity` | enum | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `disclosure_date` | date | Public disclosure date |
| `affected_releases` | array | Major versions affected (e.g., ["8.0", "9.0"]) |
| `affected_products` | array | Products affected (e.g., ["dotnet-runtime"]) |
| `affected_packages` | array | NuGet packages affected |
| `platforms` | array | Affected platforms (`all`, `linux`, `windows`, etc.) |
| `fixes` | array | Fix commit references |

## Enum Values

### support_phase

| Value | Description |
|-------|-------------|
| `preview` | Pre-release preview, not supported for production |
| `go-live` | Release candidate with go-live support |
| `active` | Fully supported, receiving updates |
| `maintenance` | Receiving only critical security fixes |
| `eol` | End of life, no longer supported |

### release_type

| Value | Description |
|-------|-------------|
| `lts` | Long Term Support - 3 years of support |
| `sts` | Standard Term Support - 18 months of support |

### affected_products

| Value | Description |
|-------|-------------|
| `dotnet-runtime` | .NET Runtime |
| `dotnet-aspnetcore` | ASP.NET Core Runtime |
| `dotnet-sdk` | .NET SDK |
| `dotnet-windowsdesktop` | Windows Desktop Runtime (WPF/WinForms) |
