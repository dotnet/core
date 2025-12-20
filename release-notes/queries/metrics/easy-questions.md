# Easy Questions (Q1)

Query cost comparison for Q1-Easy category tests from [release-graph-eval](https://github.com/dotnet/release-graph-eval).

See [overview.md](../overview.md) for design context, file characteristics, and link relation discovery.

## T1: Supported .NET Versions

**Query:** "Which .NET versions are currently supported?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` | **5 KB** |
| hal-index | `index.json` | **5 KB** |
| releases-index | `releases-index.json` | **6 KB** |

**llms-index:** The `supported_releases` property provides a direct array—no filtering required:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

curl -s "$LLMS" | jq -r '.supported_releases[]'
# 10.0
# 9.0
# 8.0
```

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.supported) | .version'
# 10.0
# 9.0
# 8.0
```

**releases-index:**

```bash
ROOT="https://builds.dotnet.microsoft.com/dotnet/release-metadata/releases-index.json"

curl -s "$ROOT" | jq -r '.["releases-index"][] | select(.["support-phase"] == "active") | .["channel-version"]'
# 10.0
# 9.0
# 8.0
```

**Winner:** llms-index

- Direct array access, no filtering required
- Equivalent size to hal-index (5 KB)
- 17% smaller than releases-index

**Analysis:**

- **Completeness:** ✅ Equal—all three return the same list of supported versions.
- **Zero-fetch for LLMs:** The llms-index `supported_releases` array can be answered directly from embedded data without any jq filtering—ideal for AI assistants that have already fetched llms.json as their entry point.
- **Query complexity:** llms-index requires no `select()` filter; hal-index uses boolean filter; releases-index requires enum comparison with bracket notation.

---

## T2: Latest .NET 10 Patch Details

**Query:** "What's the latest patch for .NET 10, when was it released, and was it a security release?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` | **5 KB** |
| hal-index | `index.json` → `10.0/index.json` | **14 KB** |
| releases-index | `releases-index.json` | **6 KB** |

**llms-index:** The `_embedded.latest_patches` array contains all details inline:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

curl -s "$LLMS" | jq -r '._embedded.latest_patches[] | select(.release == "10.0") | "\(.version) | \(.date | split("T")[0]) | security: \(.security)"'
# 10.0.1 | 2025-12-09 | security: false
```

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Step 1: Get the 10.0 version href
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "10.0") | ._links.self.href')

# Step 2: Get latest patch details from version index
curl -s "$VERSION_HREF" | jq -r '._embedded.releases[0] | "\(.version) | \(.date | split("T")[0]) | security: \(.security)"'
# 10.0.1 | 2025-12-09 | security: false
```

**releases-index:** The root index includes `latest-release`, `latest-release-date`, and `security` inline:

```bash
ROOT="https://builds.dotnet.microsoft.com/dotnet/release-metadata/releases-index.json"

curl -s "$ROOT" | jq -r '.["releases-index"][] | select(.["channel-version"] == "10.0") | "\(.["latest-release"]) | \(.["latest-release-date"]) | security: \(.security)"'
# 10.0.1 | 2025-12-09 | security: false
```

**Winner:** llms-index (17% smaller than releases-index)

- llms-index and releases-index can answer from their root index file
- hal-index requires an additional fetch to the version index
- llms-index provides additional metadata (CVE count, navigation links) in the same payload

**Analysis:**

- **Completeness:** ✅ Equal—all three return the same version, date, and security status.
- **Single-fetch answers:** Both llms-index and releases-index embed latest patch info in their root; hal-index requires navigating to the version index.
- **Additional metadata:** llms-index `_embedded.latest_patches` includes SDK version, CVE count, EOL date, and `latest-security` link; releases-index includes SDK version and EOL date; hal-index root only has version summaries.

---

## T3: Security Patches Since Date

**Query:** "I last updated my .NET 8 installation in November 2025. Has there been a security patch since then? Which CVEs did the last security patch resolve?"

This query has two parts:
1. **Date check:** Has there been a security patch since November 2025?
2. **CVE details:** What CVEs were fixed in the last security patch?

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index (date check) | `llms.json` | **5 KB** |
| llms-index (with CVEs) | `llms.json` → `8.0/8.0.21/index.json` | **14 KB** |
| hal-index | `index.json` → `8.0/index.json` → `8.0/8.0.21/index.json` | **34 KB** |
| releases-index | `releases-index.json` → `8.0/releases.json` | **1,269 KB** |

**llms-index:** The `_embedded.latest_patches` array includes `latest_security_date` for immediate date comparison:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

# Part 1: Date check - answerable from llms.json alone
curl -s "$LLMS" | jq -r '._embedded.latest_patches[] | select(.release == "8.0") |
  "Latest security: \(.latest_security) (\(.latest_security_date)) | After Nov 2025? \(.latest_security_date > "2025-11")"'
# Latest security: 8.0.21 (2025-10-14) | After Nov 2025? false

# Part 2: Get CVE IDs (requires one additional fetch)
PATCH_DATA=$(curl -s "$LLMS" | jq '._embedded.latest_patches[] | select(.release == "8.0")')
SECURITY_HREF=$(echo "$PATCH_DATA" | jq -r '._links["latest-security"].href')
curl -s "$SECURITY_HREF" | jq -r '.cve_records[]'
# CVE-2025-55247
# CVE-2025-55248
# CVE-2025-55315
```

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Step 1: Get the 8.0 version href
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "8.0") | ._links.self.href')

# Step 2: Get latest-security link (version index doesn't embed security date)
VERSION_DATA=$(curl -s "$VERSION_HREF")
SECURITY_HREF=$(echo "$VERSION_DATA" | jq -r '._links["latest-security"].href')

# Step 3: Get date and CVEs from security patch
curl -s "$SECURITY_HREF" | jq -r '"Latest security: \(.version) (\(.date | split("T")[0])) | After Nov 2025? \(.date > "2025-11") | CVEs: \(.cve_records | join(", "))"'
# Latest security: 8.0.21 (2025-10-14) | After Nov 2025? false | CVEs: CVE-2025-55247, CVE-2025-55248, CVE-2025-55315
```

**releases-index:**

```bash
ROOT="https://builds.dotnet.microsoft.com/dotnet/release-metadata/releases-index.json"

# Step 1: Get the 8.0 releases.json URL
RELEASES_URL=$(curl -s "$ROOT" | jq -r '.["releases-index"][] | select(.["channel-version"] == "8.0") | .["releases.json"]')

# Step 2: Find latest security release and check date
curl -s "$RELEASES_URL" | jq -r '
  [.releases[] | select(.security == true)][0] |
  "Latest security: \(.["release-version"]) (\(.["release-date"])) | After Nov 2025? \(.["release-date"] > "2025-11") | CVEs: \([.["cve-list"][]?["cve-id"]] | join(", "))"'
# Latest security: 8.0.21 (2025-10-14) | After Nov 2025? false | CVEs: CVE-2025-55247, CVE-2025-55315, CVE-2025-55248
```

**Winner:** llms-index

- **Date check only:** 5 KB (zero additional fetches) — `latest_security_date` embedded in root
- **With CVE IDs:** 14 KB (**91x smaller** than releases-index, **2.4x smaller** than hal-index)

**Analysis:**

- **Completeness:** ✅ Equal—all three identify 8.0.21 as the latest security patch with the same CVE list.
- **Date comparison:** llms-index embeds `latest_security_date` directly, answering "has there been a security patch since X?" without any navigation. hal-index and releases-index require fetching additional files to get the security patch date.
- **CVE access:** Both llms-index and hal-index require one additional fetch to get CVE IDs; releases-index includes CVE IDs inline but requires downloading 1.2 MB.
- **Two-part queries:** The llms-index design allows partial answers (date check) before committing to additional fetches (CVE details).
