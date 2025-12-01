# .NET Release Index Queries

This directory contains standard `jq` queries for working with .NET release `index.json` files. The primary purpose of these queries is to stress test the information graph for legitimate usage. They also serve as documentation for the JSON structure.

## Design Philosophy

Queries are designed to be terse and avoid ugly escaping tricks or complicated `jq` features. The schema uses `snake_case` field names to enable clean dot notation.

**Query Grades:**

- ⭐⭐⭐ **Excellent**: Single filter or field access - schema is optimal
- ⭐⭐ **Good**: Multiple filters or basic transformations - acceptable complexity
- ⭐ **Needs Work**: Joins, grouping, or complex logic - schema could be improved

## Index Files

| Index | Path | Description |
|-------|------|-------------|
| Version Index | `/release-notes/index.json` | Master index of all .NET versions |
| Major Version Index | `/release-notes/{version}/index.json` | Patch releases for a version (e.g., 9.0) |
| Patch Index | `/release-notes/{version}/{patch}/index.json` | Details for a specific patch (e.g., 9.0.1) |
| Timeline Index | `/release-notes/timeline/index.json` | Release timeline by year |
| Year Index | `/release-notes/timeline/{year}/index.json` | Months within a year |
| Month Index | `/release-notes/timeline/{year}/{month}/index.json` | Releases and CVEs for a month |
| CVE Details | `/release-notes/timeline/{year}/{month}/cve.json` | Full CVE vulnerability details |

## Query Reference

### Graph Queries (index.json)

| Query | Description |
|-------|-------------|
| `get_all_versions.jq` | List all .NET version numbers |
| `get_supported_versions.jq` | List currently supported versions |
| `get_lts_versions.jq` | List LTS versions |
| `get_sts_versions.jq` | List STS versions |
| `get_eol_versions.jq` | List EOL versions |
| `get_latest_version.jq` | Get the latest version |
| `get_latest_lts.jq` | Get the latest LTS version |
| `check_version_supported.jq` | Check if a version is supported |
| `versions_with_eol_dates.jq` | Versions with EOL dates |
| `active_versions_with_dates.jq` | Active versions with GA/EOL dates |
| `versions_by_support_type.jq` | Markdown table by support type |
| `get_latest_patch.jq` | Latest patch for a version |
| `get_latest_security_patch.jq` | Latest security patch |
| `get_security_patches.jq` | List security patches |
| `get_cves_for_version.jq` | All CVEs for a major version |
| `get_cves_for_patch.jq` | CVEs fixed in a patch |
| `get_cve_details.jq` | Full CVE disclosure details |
| `get_cve_fixes.jq` | Commit URLs for CVE fixes |
| `get_high_severity_cves.jq` | HIGH/CRITICAL severity CVEs |
| `security_patches_table.jq` | Security patches markdown table |
| `get_timeline_years.jq` | List timeline years |
| `get_months_with_cves.jq` | Months with CVE disclosures |
| `get_cves_by_month.jq` | CVE details for a month |
| `get_patches_by_month.jq` | Patches released in a month |
| `get_versions_active_in_year.jq` | Versions active during a year |
| `cves_by_year_table.jq` | CVEs by month markdown table |

### Deep CVE Queries (cve.json)

| Query | Description |
|-------|-------------|
| `get_cve_weakness.jq` | CWE weakness classifications |
| `get_cve_description.jq` | Full descriptions and FAQ |
| `get_cve_version_range.jq` | Vulnerable version ranges |
| `check_version_vulnerable.jq` | Check if version is vulnerable |
| `get_cve_by_product.jq` | CVEs by product (runtime/SDK) |
| `get_cve_by_severity.jq` | CVEs by severity level |
| `get_cve_commits_for_release.jq` | Fix commits for a release |

---

## Version Information

Use with `/release-notes/index.json`

### get_all_versions.jq

```bash
$ jq -r '._embedded.releases[].version' release-notes/index.json
10.0
9.0
8.0
7.0
...
```

**Grade:** ⭐⭐⭐

[📁 get_all_versions.jq](index-graph/get_all_versions.jq)

### get_supported_versions.jq

```bash
$ jq -r '._embedded.releases[] | select(.supported == true) | .version' release-notes/index.json
10.0
9.0
8.0
```

**Grade:** ⭐⭐⭐

[📁 get_supported_versions.jq](index-graph/get_supported_versions.jq)

### get_lts_versions.jq

```bash
$ jq -r '._embedded.releases[] | select(.release_type == "lts") | .version' release-notes/index.json
10.0
8.0
6.0
3.1
...
```

**Grade:** ⭐⭐⭐

[📁 get_lts_versions.jq](index-graph/get_lts_versions.jq)

### get_sts_versions.jq

```bash
$ jq -r '._embedded.releases[] | select(.release_type == "sts") | .version' release-notes/index.json
9.0
7.0
5.0
...
```

**Grade:** ⭐⭐⭐

[📁 get_sts_versions.jq](index-graph/get_sts_versions.jq)

### get_eol_versions.jq

```bash
$ jq -r '._embedded.releases[] | select(.phase == "eol") | .version' release-notes/index.json
7.0
6.0
5.0
...
```

**Grade:** ⭐⭐⭐

[📁 get_eol_versions.jq](index-graph/get_eol_versions.jq)

### get_latest_version.jq

```bash
$ jq -r '.latest' release-notes/index.json
10.0
```

**Grade:** ⭐⭐⭐

[📁 get_latest_version.jq](index-graph/get_latest_version.jq)

### get_latest_lts.jq

```bash
$ jq -r '.latest_lts' release-notes/index.json
10.0
```

**Grade:** ⭐⭐⭐

[📁 get_latest_lts.jq](index-graph/get_latest_lts.jq)

---

## Lifecycle Information

Use with `/release-notes/index.json`

### check_version_supported.jq

```bash
$ jq --arg version "9.0" -r '._embedded.releases[] | select(.version == $version) | {version, supported, phase, eol_date}' release-notes/index.json
{
  "version": "9.0",
  "supported": true,
  "phase": "active",
  "eol_date": "2026-05-12T00:00:00+00:00"
}
```

**Grade:** ⭐⭐⭐

[📁 check_version_supported.jq](index-graph/check_version_supported.jq)

### versions_with_eol_dates.jq

```bash
$ jq -r '._embedded.releases[] | {version, eol_date, supported}' release-notes/index.json
{
  "version": "10.0",
  "eol_date": "2028-11-14T00:00:00+00:00",
  "supported": true
}
...
```

**Grade:** ⭐⭐⭐

[📁 versions_with_eol_dates.jq](index-graph/versions_with_eol_dates.jq)

### active_versions_with_dates.jq

```bash
$ jq -r '._embedded.releases[] | select(.phase == "active") | {version, release_type, ga_date, eol_date}' release-notes/index.json
{
  "version": "10.0",
  "release_type": "lts",
  "ga_date": "2025-11-11T00:00:00+00:00",
  "eol_date": "2028-11-14T00:00:00+00:00"
}
...
```

**Grade:** ⭐⭐⭐

[📁 active_versions_with_dates.jq](index-graph/active_versions_with_dates.jq)

### versions_by_support_type.jq

```bash
$ jq -rf queries/versions_by_support_type.jq release-notes/index.json
| Version | Support Type | Phase | EOL Date |
| ------- | ------------ | ----- | -------- |
| 10.0 | lts | active | 2028-11-14 |
| 9.0 | sts | active | 2026-05-12 |
| 8.0 | lts | active | 2026-11-10 |
...
```

**Grade:** ⭐⭐⭐

[📁 versions_by_support_type.jq](index-graph/versions_by_support_type.jq)

---

## Patch Releases

Use with `/release-notes/{version}/index.json`

### get_latest_patch.jq

```bash
$ jq -r '._embedded.releases[0].version' release-notes/9.0/index.json
9.0.11
```

**Grade:** ⭐⭐⭐

[📁 get_latest_patch.jq](index-graph/get_latest_patch.jq)

### get_latest_security_patch.jq

```bash
$ jq -r '.latest_security' release-notes/9.0/index.json
9.0.10
```

**Grade:** ⭐⭐⭐

[📁 get_latest_security_patch.jq](index-graph/get_latest_security_patch.jq)

### get_security_patches.jq

```bash
$ jq -r '._embedded.releases[] | select(.security == true) | .version' release-notes/9.0/index.json
9.0.10
9.0.6
9.0.5
9.0.4
9.0.3
9.0.1
9.0.0
```

**Grade:** ⭐⭐⭐

[📁 get_security_patches.jq](index-graph/get_security_patches.jq)

### get_cves_for_version.jq

```bash
$ jq -r '._embedded.cve_records[]' release-notes/9.0/index.json
CVE-2024-43498
CVE-2024-43499
CVE-2025-21171
CVE-2025-21172
...
```

**Grade:** ⭐⭐⭐

[📁 get_cves_for_version.jq](index-graph/get_cves_for_version.jq)

### security_patches_table.jq

```bash
$ jq -rf queries/security_patches_table.jq release-notes/9.0/index.json
| Patch | Date | CVE Count |
| ----- | ---- | --------- |
| 9.0.10 | 2025-10-14 | 3 |
| 9.0.6 | 2025-06-10 | 1 |
| 9.0.5 | 2025-05-13 | 1 |
...
```

**Grade:** ⭐⭐⭐

[📁 security_patches_table.jq](index-graph/security_patches_table.jq)

---

## CVE Details

Use with `/release-notes/{version}/{patch}/index.json` or month index

### get_cves_for_patch.jq

```bash
$ jq -r '._embedded.cve_records[]' release-notes/9.0/9.0.1/index.json
CVE-2025-21171
CVE-2025-21172
CVE-2025-21173
CVE-2025-21176
```

**Grade:** ⭐⭐⭐

[📁 get_cves_for_patch.jq](index-graph/get_cves_for_patch.jq)

### get_cve_details.jq

```bash
$ jq -r '._embedded.disclosures[] | {id, title, cvss_score, cvss_severity, affected_releases}' release-notes/9.0/9.0.1/index.json
{
  "id": "CVE-2025-21171",
  "title": ".NET Remote Code Execution Vulnerability",
  "cvss_score": 7.5,
  "cvss_severity": "HIGH",
  "affected_releases": ["9.0"]
}
...
```

**Grade:** ⭐⭐

**Recommendation:** Object construction is needed to select fields. This is acceptable - full disclosure objects contain many fields and selective projection is appropriate.

[📁 get_cve_details.jq](index-graph/get_cve_details.jq)

### get_cve_fixes.jq

```bash
$ jq -r '._embedded.disclosures[] | {id, fixes: [.fixes[] | {repo, branch, href}]}' release-notes/9.0/9.0.1/index.json
{
  "id": "CVE-2025-21171",
  "fixes": [
    {
      "repo": "dotnet/runtime",
      "branch": "release/9.0",
      "href": "https://github.com/dotnet/runtime/commit/9da8c6a4a6ea03054e776275d3fd5c752897842e.diff"
    }
  ]
}
...
```

**Grade:** ⭐⭐⭐

[📁 get_cve_fixes.jq](index-graph/get_cve_fixes.jq)

### get_high_severity_cves.jq

```bash
$ jq -r '._embedded.disclosures[] | select(.cvss_severity == "HIGH" or .cvss_severity == "CRITICAL") | {id, cvss_score, cvss_severity}' release-notes/9.0/9.0.1/index.json
{
  "id": "CVE-2025-21171",
  "cvss_score": 7.5,
  "cvss_severity": "HIGH"
}
...
```

**Grade:** ⭐⭐⭐

[📁 get_high_severity_cves.jq](index-graph/get_high_severity_cves.jq)

---

## Timeline Navigation

### get_timeline_years.jq

Use with `/release-notes/timeline/index.json`

```bash
$ jq -r '._embedded.years[].year' release-notes/timeline/index.json
2025
2024
2023
2022
...
```

**Grade:** ⭐⭐⭐

[📁 get_timeline_years.jq](index-graph/get_timeline_years.jq)

### get_versions_active_in_year.jq

Use with `/release-notes/timeline/{year}/index.json`

```bash
$ jq -r '._embedded.releases[] | {version, release_type, phase, supported}' release-notes/timeline/2024/index.json
{
  "version": "9.0",
  "release_type": "sts",
  "phase": "active",
  "supported": true
}
...
```

**Grade:** ⭐⭐⭐

[📁 get_versions_active_in_year.jq](index-graph/get_versions_active_in_year.jq)

### get_months_with_cves.jq

Use with `/release-notes/timeline/{year}/index.json`

```bash
$ jq -r '._embedded.months[] | select(.security) | {month, cve_count: (.cve_records | length)}' release-notes/timeline/2024/index.json
{
  "month": "10",
  "cve_count": 4
}
{
  "month": "08",
  "cve_count": 2
}
...
```

**Grade:** ⭐⭐⭐

[📁 get_months_with_cves.jq](index-graph/get_months_with_cves.jq)

### get_cves_by_month.jq

Use with `/release-notes/timeline/{year}/{month}/index.json`

```bash
$ jq -r '._embedded.disclosures[] | {id, title, cvss_severity, affected_releases}' release-notes/timeline/2024/07/index.json
{
  "id": "CVE-2024-30105",
  "title": ".NET Denial of Service Vulnerability",
  "cvss_severity": "HIGH",
  "affected_releases": ["8.0"]
}
...
```

**Grade:** ⭐⭐

**Recommendation:** Same as `get_cve_details.jq` - object construction for field selection is acceptable.

[📁 get_cves_by_month.jq](index-graph/get_cves_by_month.jq)

### get_patches_by_month.jq

Use with `/release-notes/timeline/{year}/{month}/index.json`

```bash
$ jq -r '._embedded.releases[] | {version, runtime: .runtime_patches, sdk: .sdk_patches}' release-notes/timeline/2025/01/index.json
{
  "version": "9.0",
  "runtime": ["9.0.1"],
  "sdk": ["9.0.102"]
}
{
  "version": "8.0",
  "runtime": ["8.0.12"],
  "sdk": ["8.0.405", "8.0.308", "8.0.112"]
}
```

**Grade:** ⭐⭐⭐

[📁 get_patches_by_month.jq](index-graph/get_patches_by_month.jq)

### cves_by_year_table.jq

Use with `/release-notes/timeline/{year}/index.json`

```bash
$ jq -rf queries/cves_by_year_table.jq release-notes/timeline/2024/index.json
| Month | CVE Count | CVEs |
| ----- | --------- | ---- |
| 10 | 4 | CVE-2024-43483, CVE-2024-43484, CVE-2024-43485, CVE-2024-38229 |
| 08 | 2 | CVE-2024-38167, CVE-2024-38168 |
| 07 | 4 | CVE-2024-30105, CVE-2024-35264, CVE-2024-38081, CVE-2024-38095 |
...
```

**Grade:** ⭐⭐⭐

[📁 cves_by_year_table.jq](index-graph/cves_by_year_table.jq)

---

## Deep CVE Analysis (cve.json)

The month `index.json` embeds CVE summaries, but `cve.json` contains complete vulnerability information including CWE weakness types, version ranges, detailed descriptions, and FAQs. Use these queries when you need full vulnerability details.

Use with `/release-notes/timeline/{year}/{month}/cve.json`

### get_cve_weakness.jq

Get CWE weakness classifications for vulnerabilities:

```bash
$ jq -rf queries/get_cve_weakness.jq release-notes/timeline/2025/01/cve.json
{
  "id": "CVE-2025-21171",
  "problem": ".NET Remote Code Execution Vulnerability",
  "weakness": "CWE-122",
  "cvss_score": 7.5,
  "cvss_severity": "HIGH"
}
{
  "id": "CVE-2025-21172",
  "problem": ".NET and Visual Studio Remote Code Execution Vulnerability",
  "weakness": "CWE-190",
  "cvss_score": 7.5,
  "cvss_severity": "HIGH"
}
...
```

**Grade:** ⭐⭐⭐ (only available in cve.json)

[📁 get_cve_weakness.jq](index-graph/get_cve_weakness.jq)

### check_version_vulnerable.jq

Check if a specific runtime or SDK version is vulnerable:

```bash
$ jq --arg version "8.0.11" -rf queries/check_version_vulnerable.jq release-notes/timeline/2025/01/cve.json
{
  "cve_id": "CVE-2025-21172",
  "product": "dotnet-runtime",
  "vulnerable_range": "8.0.0 - 8.0.11",
  "fixed_in": "8.0.12"
}
{
  "cve_id": "CVE-2025-21176",
  "product": "dotnet-runtime",
  "vulnerable_range": "8.0.0 - 8.0.11",
  "fixed_in": "8.0.12"
}
```

**Grade:** ⭐⭐⭐ (only available in cve.json)

[📁 check_version_vulnerable.jq](index-graph/check_version_vulnerable.jq)

### get_cve_version_range.jq

Get vulnerable version ranges for all products:

```bash
$ jq -rf queries/get_cve_version_range.jq release-notes/timeline/2025/01/cve.json
{
  "cve_id": "CVE-2025-21172",
  "product": "dotnet-runtime",
  "release": "8.0",
  "min_vulnerable": "8.0.0",
  "max_vulnerable": "8.0.11",
  "fixed": "8.0.12"
}
...
```

**Grade:** ⭐⭐⭐ (only available in cve.json)

[📁 get_cve_version_range.jq](index-graph/get_cve_version_range.jq)

### get_cve_by_product.jq

Get CVEs affecting a specific product:

```bash
$ jq --arg product "dotnet-runtime" -rf queries/get_cve_by_product.jq release-notes/timeline/2025/01/cve.json
[
  "CVE-2025-21171",
  "CVE-2025-21172",
  "CVE-2025-21176"
]
```

**Grade:** ⭐⭐⭐ (pre-indexed lookup in cve.json)

[📁 get_cve_by_product.jq](index-graph/get_cve_by_product.jq)

### get_cve_by_severity.jq

Get CVEs by severity level:

```bash
$ jq --arg severity "HIGH" -rf queries/get_cve_by_severity.jq release-notes/timeline/2025/01/cve.json
[
  "CVE-2025-21171",
  "CVE-2025-21172",
  "CVE-2025-21173",
  "CVE-2025-21176"
]
```

**Grade:** ⭐⭐⭐ (pre-indexed lookup in cve.json)

[📁 get_cve_by_severity.jq](index-graph/get_cve_by_severity.jq)

### get_cve_description.jq

Get full CVE descriptions and FAQ:

```bash
$ jq -rf queries/get_cve_description.jq release-notes/timeline/2025/01/cve.json
{
  "id": "CVE-2025-21171",
  "problem": ".NET Remote Code Execution Vulnerability",
  "description": ["An attacker could exploit this vulnerability..."],
  "faq": [
    {
      "question": "According to the CVSS metric, the attack vector is network (AV:N)...",
      "answer": "This attack requires a victim to perform a specific action..."
    }
  ]
}
...
```

**Grade:** ⭐⭐⭐ (only available in cve.json)

[📁 get_cve_description.jq](index-graph/get_cve_description.jq)

### get_cve_commits_for_release.jq

Get all fix commits for a specific release:

```bash
$ jq --arg release "8.0" -rf queries/get_cve_commits_for_release.jq release-notes/timeline/2025/01/cve.json
{
  "cve_id": "CVE-2025-21172",
  "product": "dotnet-runtime",
  "fixed": "8.0.12",
  "commits": ["89ef51c5d8f5239345127a1e282e11036e590c8b"]
}
...
```

**Grade:** ⭐⭐⭐

[📁 get_cve_commits_for_release.jq](index-graph/get_cve_commits_for_release.jq)

---

## Graph vs cve.json: When to Use Each

The HAL-embedded `_embedded.disclosures` in index files provides quick access to CVE summaries without additional fetches. Use the graph when you need:

- CVE IDs affecting a version or patch
- Basic severity and title information
- Fix commit URLs
- Affected releases list

Fetch `cve.json` when you need:

- CWE weakness classifications
- Vulnerable version ranges (min/max)
- Full problem descriptions
- Microsoft FAQ content
- Product-to-CVE mappings
- Severity-to-CVE indexes
- Acknowledgment credits

**Transfer cost comparison** (January 2025 CVEs):

| Query | Graph Only | Graph + cve.json |
|-------|------------|------------------|
| "List CVE IDs for 8.0.12" | 10 KB | - |
| "Get CVE severity and title" | 10 KB | - |
| "Check if 8.0.11 is vulnerable" | - | 14 KB |
| "Get CWE weakness types" | - | 14 KB |
| "Full CVE details with FAQ" | - | 14 KB |

The graph provides 80% of common CVE queries at 10 KB. The full cve.json (14 KB) is only needed for deep vulnerability analysis.

---

## Related Resources

- [jq Manual](https://jqlang.github.io/jq/manual/)
- [.NET Release Policies](../../release-policies.md)
- [Release Notes Index Schema](../schemas/)
