# Query Cost Comparison

See [overview.md](overview.md) for design context, file characteristics, and link relation discovery.

### Version Information Queries

#### Query: "What .NET versions are currently supported?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` | **5 KB** |
| llms-index | `llms.json` | **5 KB** |
| releases-index | `releases-index.json` | **6 KB** |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.supported) | .version'
# 10.0
# 9.0
# 8.0
```

**llms-index:** The `releases` property provides a direct array `["10.0", "9.0", "8.0"]`—no filtering required:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

curl -s "$LLMS" | jq -r '.releases[]'
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

**Analysis:**

- **Completeness:** ✅ Equal—both return the same list of supported versions.
- **Boolean vs enum:** The hal-index uses `supported: true`, a simple boolean. The releases-index only exposes `support-phase: "active"` (which hal-index also has), requiring knowledge of the enum vocabulary (active, maintenance, eol, preview, go-live).
- **Property naming:** The hal-index uses `select(.supported)` with dot notation. The releases-index requires `select(.["support-phase"] == "active")` with bracket notation and string comparison.
- **Query complexity:** The hal-index query is 30% shorter and more intuitive for someone unfamiliar with the schema.

**Winner:** hal-index (**17% smaller**); llms-index equivalent (direct array, no filtering)

**Note on URL length:** The hal-index currently uses long GitHub raw URLs (91 chars per URL). With equivalent short CDN URLs, the hal-index would be **4.4 KB**—31% smaller than releases-index.

### Target Framework Queries

#### Query: "What Android platform version does each supported .NET version target?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `{version}/target-frameworks.json` per version | **~20 KB** |
| llms-index | `llms.json` → `{version}/target-frameworks.json` per version | **~20 KB** |
| releases-index | N/A | N/A (not available) |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Get target-frameworks.json for each supported version and extract Android TFM
curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.supported) | ._links.self.href' | while read VERSION_HREF; do
  TFM_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["target-frameworks-json"].href')
  curl -s "$TFM_HREF" | jq -r '.frameworks[] | select(.platform == "android") | "\(.tfm) (Android \(.platform_version))"'
done
```

**Output:**

```text
net10.0-android (Android 36.0)
net9.0-android (Android 35.0)
net8.0-android (Android 34.0)
```

**releases-index:** Not available.

**Analysis:**

- **Platform versioning:** Each .NET version targets a specific Android API level. This query reveals the progression: .NET 8 → Android 34, .NET 9 → Android 35, .NET 10 → Android 36.
- **Upgrade planning:** Knowing the platform version helps teams plan SDK requirements when upgrading .NET versions.
- **Discoverability:** The `target-frameworks-json` link makes this data accessible through HAL navigation.

**Winner:** hal-index only; llms-index equivalent

### CVE Queries for Latest Security Patch

#### Query: "What CVEs were fixed in the latest .NET 8.0 security patch?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `8.0/index.json` → `8.0/8.0.21/index.json` | **37 KB** |
| llms-index | `llms.json` | **5 KB** |
| releases-index | `releases-index.json` + `8.0/releases.json` | **1,240 KB** |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Step 1: Get the 8.0 version href
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "8.0") | ._links.self.href')
# https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/8.0/index.json

# Step 2: Get the latest security patch href
PATCH_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["latest-security"].href')
# https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/8.0/8.0.21/index.json

# Step 3: Get the CVE records
curl -s "$PATCH_HREF" | jq -r '.cve_records[]'
# CVE-2025-55247
# CVE-2025-55248
# CVE-2025-55315
```

**llms-index:** The `_embedded.latest_security_month` array provides CVE records directly:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

curl -s "$LLMS" | jq -r '._embedded.latest_security_month[] | select(.release == "8.0") | .cve_records[]'
# CVE-2025-55247
# CVE-2025-55248
# CVE-2025-55315
```

**releases-index:**

```bash
ROOT="https://builds.dotnet.microsoft.com/dotnet/release-metadata/releases-index.json"

# Step 1: Get the 8.0 releases.json URL
RELEASES_URL=$(curl -s "$ROOT" | jq -r '.["releases-index"][] | select(.["channel-version"] == "8.0") | .["releases.json"]')
# https://builds.dotnet.microsoft.com/dotnet/release-metadata/8.0/releases.json

# Step 2: Find latest security release and get CVE IDs
curl -s "$RELEASES_URL" | jq -r '[.releases[] | select(.security == true)] | .[0] | .["cve-list"][] | .["cve-id"]'
# CVE-2025-55247
# CVE-2025-55315
# CVE-2025-55248
```

**Analysis:** Both schemas produce the same CVE IDs. However:

- **Completeness:** ✅ Equal—both return the CVE identifiers
- **Ergonomics:** The releases-index requires downloading a 1.2 MB file to extract 3 CVE IDs. The hal-index uses a dedicated `latest-security` link, avoiding iteration through all releases.
- **Link syntax:** Counterintuitively, the deeper HAL structure `._links.self.href` is more ergonomic than `.["releases.json"]` because snake_case enables dot notation throughout. The releases-index embeds URLs directly in properties, but kebab-case naming forces bracket notation.
- **Data efficiency:** hal-index is 32x smaller

**Winner:** hal-index (**32x smaller**); llms-index is 7x smaller still (5 KB vs 37 KB)

### High Severity CVEs with Details

#### Query: "What High+ severity CVEs were fixed in the latest .NET 8.0 security patch, with titles?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `8.0/index.json` → `8.0/8.0.21/index.json` | **37 KB** |
| llms-index | `llms.json` → `timeline/2025/10/index.json` | **14 KB** |
| releases-index | `releases-index.json` + `8.0/releases.json` | **1,240 KB** (cannot answer) |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Step 1: Get the 8.0 version href
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "8.0") | ._links.self.href')

# Step 2: Get the latest security patch href
PATCH_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["latest-security"].href')

# Step 3: Filter HIGH+ severity with titles
curl -s "$PATCH_HREF" | jq -r '._embedded.disclosures[] | select(.cvss_severity == "HIGH" or .cvss_severity == "CRITICAL") | "\(.id): \(.title) (\(.cvss_severity))"'
# CVE-2025-55247: .NET Denial of Service Vulnerability (HIGH)
# CVE-2025-55315: .NET Security Feature Bypass Vulnerability (CRITICAL)
```

**llms-index:** Follow the `self` link from `latest_security_month` to get severity details:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

# Get the month index URL for 8.0's latest security month
MONTH_URL=$(curl -s "$LLMS" | jq -r '._embedded.latest_security_month[] | select(.release == "8.0") | ._links.self.href')
curl -s "$MONTH_URL" | jq -r '._embedded.disclosures[] | select(.cvss_severity == "HIGH" or .cvss_severity == "CRITICAL") | "\(.id): \(.title) (\(.cvss_severity))"'
```

**releases-index:**

```bash
ROOT="https://builds.dotnet.microsoft.com/dotnet/release-metadata/releases-index.json"

# Step 1: Get the 8.0 releases.json URL
RELEASES_URL=$(curl -s "$ROOT" | jq -r '.["releases-index"][] | select(.["channel-version"] == "8.0") | .["releases.json"]')

# Step 2: Find latest security release and get CVE IDs (best effort—no severity/title available)
curl -s "$RELEASES_URL" | jq -r '[.releases[] | select(.security == true)] | .[0] | .["cve-list"][] | "\(.["cve-id"]): (severity unknown) (title unknown)"'
# CVE-2025-55247: (severity unknown) (title unknown)
# CVE-2025-55315: (severity unknown) (title unknown)
# CVE-2025-55248: (severity unknown) (title unknown)
```

**Analysis:**

- **Completeness:** ❌ The releases-index only provides CVE IDs and URLs to external CVE databases. It does not include severity scores, CVSS ratings, or vulnerability titles. To get this information, you would need to fetch each CVE URL individually from cve.mitre.org.
- **Ergonomics:** The hal-index embeds full CVE details (`cvss_severity`, `cvss_score`, `title`, `fixes`) directly in the patch index, enabling single-query filtering by severity.

**Winner:** hal-index (releases-index cannot answer this query); llms-index is 2.6x smaller (14 KB vs 37 KB)

### Last 3 Security Releases for a Version

#### Query: "What CVEs were fixed in the last 3 security releases for .NET 8.0?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `8.0/index.json` → 3 patch indexes (via `prev-security`) | **55 KB** |
| llms-index | `llms.json` → 3 month indexes (via `prev-security`) | **32 KB** |
| releases-index | `releases-index.json` + `8.0/releases.json` | **1,240 KB** |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Step 1: Get the 8.0 latest-security patch href
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "8.0") | ._links.self.href')
PATCH_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["latest-security"].href')

# Step 2: Walk back 3 security patches using prev-security links
for i in {1..3}; do
  DATA=$(curl -s "$PATCH_HREF")
  VERSION=$(echo "$DATA" | jq -r '.version')
  MONTH=$(echo "$DATA" | jq -r '.date | split("T")[0] | split("-")[1]')
  echo "$DATA" | jq -r --arg ver "$VERSION" --arg month "$MONTH" \
    '._embedded.disclosures[] | "8.0 | \($month) | \(.affected_products[0]) | \(.id)"'
  PATCH_HREF=$(echo "$DATA" | jq -r '._links["prev-security"].href // empty')
  [ -z "$PATCH_HREF" ] && break
done
# 8.0 | 10 | dotnet-sdk | CVE-2025-55247
# 8.0 | 10 | dotnet-runtime | CVE-2025-55248
# 8.0 | 10 | dotnet-aspnetcore | CVE-2025-55315
# 8.0 | 06 | dotnet-runtime | CVE-2025-30399
# 8.0 | 04 | dotnet-aspnetcore | CVE-2025-26682
```

**releases-index:**

```bash
ROOT="https://builds.dotnet.microsoft.com/dotnet/release-metadata/releases-index.json"

# Step 1: Get the 8.0 releases.json URL
RELEASES_URL=$(curl -s "$ROOT" | jq -r '.["releases-index"][] | select(.["channel-version"] == "8.0") | .["releases.json"]')

# Step 2: Find security releases and get CVE IDs (no component info available)
curl -s "$RELEASES_URL" | jq -r '
  [.releases[] | select(.security == true)] | .[0:3] | .[] |
  .["release-date"] as $date |
  .["cve-list"][]? | "8.0 | \($date | split("-")[1]) | (unknown) | \(.["cve-id"])"'
# 8.0 | 10 | (unknown) | CVE-2025-55247
# 8.0 | 10 | (unknown) | CVE-2025-55315
# 8.0 | 10 | (unknown) | CVE-2025-55248
# 8.0 | 06 | (unknown) | CVE-2025-30399
# 8.0 | 04 | (unknown) | CVE-2025-26682
```

**Analysis:**

- **Completeness:** ⚠️ Partial—the releases-index returns CVE IDs but lacks `affected_products` (component) information.
- **Ergonomics:** The hal-index uses `prev-security` links to skip non-security patches (SDK-only releases), directly navigating to security releases. The releases-index requires downloading a 1.2 MB file and filtering in memory.
- **Navigation model:** The `prev-security` link enables efficient backward traversal through security history without fetching intermediate non-security releases.

**Winner:** hal-index (**24x smaller**, with component information); llms-index is 1.7x smaller (32 KB vs 55 KB)

### CVE Details for a Month

#### Query: "What CVEs were disclosed in January 2025 with full details?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `timeline/index.json` → `timeline/2025/index.json` → `timeline/2025/01/cve.json` | **30 KB** |
| llms-index | `llms.json` → `timeline/2025/index.json` → `timeline/2025/01/cve.json` | **30 KB** |
| releases-index | All releases.json (13 versions) | **8.2 MB** (cannot answer) |

**hal-index:**

```bash
TIMELINE="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/timeline/index.json"

# Step 1: Get 2025 year href
YEAR_HREF=$(curl -s "$TIMELINE" | jq -r '._embedded.years[] | select(.year == "2025") | ._links.self.href')
# https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/timeline/2025/index.json

# Step 2: Get January cve.json href
CVE_HREF=$(curl -s "$YEAR_HREF" | jq -r '._embedded.months[] | select(.month == "01") | ._links["cve-json"].href')
# https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/timeline/2025/01/cve.json

# Step 3: Get CVE details
curl -s "$CVE_HREF" | jq -r '.disclosures[] | "\(.id): \(.problem)"'
# CVE-2025-21171: .NET Remote Code Execution Vulnerability
# CVE-2025-21172: .NET and Visual Studio Remote Code Execution Vulnerability
# CVE-2025-21176: .NET and Visual Studio Remote Code Execution Vulnerability
# CVE-2025-21173: .NET Elevation of Privilege Vulnerability
```

**releases-index:**

```bash
ROOT="https://builds.dotnet.microsoft.com/dotnet/release-metadata/releases-index.json"

# Must fetch ALL version releases.json files—cannot filter by "currently supported"
# because we need versions that were supported in January 2025, not today
URLS=$(curl -s "$ROOT" | jq -r '.["releases-index"][] | .["releases.json"]')

# Find January 2025 releases and get CVE IDs (no details available)
for URL in $URLS; do
  curl -s "$URL" | jq -r '.releases[] | select(.["release-date"] | startswith("2025-01")) | select(.security == true) | .["cve-list"][]? | "\(.["cve-id"]): (no description available)"'
done | sort -u
# CVE-2025-21171: (no description available)
# CVE-2025-21172: (no description available)
# CVE-2025-21173: (no description available)
# CVE-2025-21176: (no description available)
```

**Analysis:**

- **Completeness:** ❌ The releases-index provides only CVE IDs. The query asks for "full details" including problem descriptions, CVSS scores, affected products, and fix commits—none of which are available.
- **Historical queries:** The releases-index has no way to determine which versions were supported at a given point in time. To reliably find all CVEs for January 2025, you must fetch *every* version's releases.json file (not just currently supported versions), significantly increasing data transfer.
- **Ergonomics:** The hal-index provides a dedicated `cve.json` file per month with complete CVE records. The releases-index requires fetching all version files and provides only minimal data.

**Winner:** hal-index (**256x smaller**, releases-index cannot answer this query); llms-index equivalent

### Security Releases Over the Last 6 Months

#### Query: "What CVEs were fixed in the last 6 security releases across all versions?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `timeline/index.json` → `timeline/2025/index.json` → 6 month indexes (via `prev-security`) | **55 KB** |
| llms-index | `llms.json` → 6 month indexes (via `prev-security`) | **50 KB** |
| releases-index | All version releases.json files | **2.4 MB** |

**hal-index:**

```bash
TIMELINE="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/timeline/index.json"

# Step 1: Get the latest security month href
MONTH_HREF=$(curl -s "$TIMELINE" | jq -r '._embedded.years[0]._links["latest-security-month"].href')

# Step 2: Walk back 6 security months using prev-security links
for i in {1..6}; do
  DATA=$(curl -s "$MONTH_HREF")
  MONTH=$(echo "$DATA" | jq -r '.month')
  echo "$DATA" | jq -r --arg month "$MONTH" \
    '._embedded.disclosures[] | "\(.affected_releases | join(", ")) | \($month) | \(.affected_products[0]) | \(.id)"'
  MONTH_HREF=$(echo "$DATA" | jq -r '._links["prev-security"].href // empty')
  [ -z "$MONTH_HREF" ] && break
done
# 8.0, 9.0 | 10 | dotnet-sdk | CVE-2025-55247
# 8.0, 9.0 | 10 | dotnet-runtime | CVE-2025-55248
# 8.0, 9.0 | 10 | dotnet-aspnetcore | CVE-2025-55315
# 8.0, 9.0 | 06 | dotnet-runtime | CVE-2025-30399
# 8.0, 9.0 | 05 | dotnet-runtime | CVE-2025-26646
# 8.0, 9.0 | 04 | dotnet-aspnetcore | CVE-2025-26682
```

**releases-index:**

```bash
ROOT="https://builds.dotnet.microsoft.com/dotnet/release-metadata/releases-index.json"

# Get all supported version releases.json URLs
URLS=$(curl -s "$ROOT" | jq -r '.["releases-index"][] | select(.["support-phase"] == "active") | .["releases.json"]')

# For each version, find security releases (no component info, duplicates across versions)
for URL in $URLS; do
  curl -s "$URL" | jq -r '
    [.releases[] | select(.security == true)] | .[0:6] | .[] |
    .["release-date"] as $date |
    .["cve-list"][]? | "(unknown) | \($date | split("-")[1]) | (unknown) | \(.["cve-id"])"'
done | sort -u | head -12
# (unknown) | 10 | (unknown) | CVE-2025-55247
# (unknown) | 10 | (unknown) | CVE-2025-55315
# (unknown) | 10 | (unknown) | CVE-2025-55248
# (unknown) | 06 | (unknown) | CVE-2025-30399
# (unknown) | 05 | (unknown) | CVE-2025-26646
# (unknown) | 04 | (unknown) | CVE-2025-26682
```

**Analysis:**

- **Completeness:** ⚠️ Partial—the releases-index lacks `affected_releases` (which major versions) and `affected_products` (component) information.
- **Ergonomics:** The hal-index uses `prev-security` links to jump directly between security months, skipping non-security months entirely. The releases-index requires downloading all version files (2.4+ MB), filtering by security flag, and deduplicating results.
- **Navigation model:** The `prev-security` link on timeline months enables efficient backward traversal through security history. The releases-index has no concept of time-based navigation.

**Winner:** hal-index (**40x smaller**, with version and component information); llms-index is 10% smaller (50 KB vs 55 KB)

### Critical CVE This Month

#### Query: "Is there a critical CVE in any supported release this month?" (October 2025)

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `timeline/index.json` → `timeline/2025/index.json` → `timeline/2025/10/index.json` | **25 KB** |
| llms-index | `llms.json` → `timeline/2025/10/index.json` | **14 KB** |
| releases-index | `releases-index.json` + all supported releases.json | **2.4 MB** (incomplete—no severity data) |

**hal-index:**

```bash
TIMELINE="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/timeline/index.json"

# Step 1: Get 2025 year href
YEAR_HREF=$(curl -s "$TIMELINE" | jq -r '._embedded.years[] | select(.year == "2025") | ._links.self.href')

# Step 2: Get October month href
MONTH_HREF=$(curl -s "$YEAR_HREF" | jq -r '._embedded.months[] | select(.month == "10") | ._links.self.href')

# Step 3: Check for CRITICAL CVEs
curl -s "$MONTH_HREF" | jq -r '._embedded.disclosures // [] | .[] | select(.cvss_severity == "CRITICAL") | "\(.id): \(.title)"'
# CVE-2025-55315: .NET Security Feature Bypass Vulnerability
```

**llms-index:** Uses the `latest-security-month` link to jump directly to October 2025:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

MONTH_URL=$(curl -s "$LLMS" | jq -r '._links["latest-security-month"].href')
curl -s "$MONTH_URL" | jq -r '._embedded.disclosures[] | select(.cvss_severity == "CRITICAL") | "\(.id): \(.title)"'
```

**releases-index:**

```bash
ROOT="https://builds.dotnet.microsoft.com/dotnet/release-metadata/releases-index.json"

# Get all supported version releases.json URLs
URLS=$(curl -s "$ROOT" | jq -r '.["releases-index"][] | select(.["support-phase"] == "active") | .["releases.json"]')

# Find October 2025 releases and check for CVEs (cannot determine severity)
for URL in $URLS; do
  curl -s "$URL" | jq -r '
    .releases[] |
    select(.["release-date"] | startswith("2025-10")) |
    select(.security == true) |
    .["cve-list"][]? | "\(.["cve-id"]): (severity unknown)"'
done | sort -u
# CVE-2025-55247: (severity unknown)
# CVE-2025-55248: (severity unknown)
# CVE-2025-55315: (severity unknown)
```

**Analysis:**

- **Completeness:** ❌ The releases-index cannot answer this query. Even if there were CVEs in October, the schema only provides CVE IDs and URLs—no severity information. You would need to fetch each CVE URL from cve.mitre.org and parse the CVSS score.
- **Ergonomics:** The hal-index embeds `cvss_severity` directly in the disclosure records, enabling single-query filtering for CRITICAL vulnerabilities.
- **Use case:** This is a common security operations query ("Do I need to patch urgently?"). The hal-index answers it in 27 KB; the releases-index cannot answer it at all.

**Winner:** hal-index (**89x smaller**, releases-index cannot answer this query); llms-index is 1.8x smaller (14 KB vs 25 KB)

### Critical CVEs Over the Last 6 Months

#### Query: "List all Critical severity CVEs fixed in the last 6 months"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `timeline/index.json` → `timeline/2025/index.json` → 6 month indexes (via `prev-security`) | **55 KB** |
| llms-index | `llms.json` → 6 month indexes (via `prev-security`) | **50 KB** |
| releases-index | All version releases.json files | **2.4 MB** (cannot answer) |

**hal-index:**

```bash
TIMELINE="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/timeline/index.json"

# Step 1: Get the latest security month href
MONTH_HREF=$(curl -s "$TIMELINE" | jq -r '._embedded.years[0]._links["latest-security-month"].href')

# Step 2: Walk back 6 security months, filtering for CRITICAL CVEs
for i in {1..6}; do
  DATA=$(curl -s "$MONTH_HREF")
  YEAR=$(echo "$DATA" | jq -r '.year')
  MONTH=$(echo "$DATA" | jq -r '.month')
  echo "$DATA" | jq -r --arg ym "$YEAR-$MONTH" \
    '._embedded.disclosures[] | select(.cvss_severity == "CRITICAL") | "\($ym) | \(.affected_releases | join(", ")) | \(.id): \(.title)"'
  MONTH_HREF=$(echo "$DATA" | jq -r '._links["prev-security"].href // empty')
  [ -z "$MONTH_HREF" ] && break
done
# 2025-10 | 8.0, 9.0 | CVE-2025-55315: .NET Security Feature Bypass Vulnerability
# 2025-01 | 8.0, 9.0 | CVE-2025-21172: .NET Remote Code Execution Vulnerability
```

**llms-index:** Uses `latest-security-month` link as starting point:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

# Start from the latest security month
MONTH_HREF=$(curl -s "$LLMS" | jq -r '._links["latest-security-month"].href')

# Walk back 6 security months, filtering for CRITICAL CVEs
for i in {1..6}; do
  DATA=$(curl -s "$MONTH_HREF")
  YEAR=$(echo "$DATA" | jq -r '.year')
  MONTH=$(echo "$DATA" | jq -r '.month')
  echo "$DATA" | jq -r --arg ym "$YEAR-$MONTH" \
    '._embedded.disclosures[] | select(.cvss_severity == "CRITICAL") | "\($ym) | \(.affected_releases | join(", ")) | \(.id): \(.title)"'
  MONTH_HREF=$(echo "$DATA" | jq -r '._links["prev-security"].href // empty')
  [ -z "$MONTH_HREF" ] && break
done
```

**releases-index:** Cannot answer—no severity data available.

**Analysis:**

- **Completeness:** ❌ The releases-index only provides CVE IDs and URLs. Severity information requires fetching each CVE from cve.mitre.org individually.
- **Ergonomics:** The hal-index embeds `cvss_severity` in each disclosure, enabling in-query filtering. The `prev-security` chain efficiently skips non-security months.
- **Use case:** Critical for security compliance reporting ("Have we been exposed to any critical vulnerabilities in the past 6 months?").

**Winner:** hal-index (**44x smaller**, releases-index cannot answer this query); llms-index is 10% smaller (50 KB vs 55 KB)

### Critical CVEs for a Specific Version Over Time

#### Query: "List all Critical severity CVEs affecting .NET 8.0 in the last 6 months"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `8.0/index.json` → 3 patch indexes (via `prev-security`) | **55 KB** |
| llms-index | `llms.json` → `8.0/index.json` → 3 patch indexes (via `prev-security`) | **50 KB** |
| releases-index | `releases-index.json` + `8.0/releases.json` | **1,240 KB** (cannot answer) |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Step 1: Get the 8.0 latest-security patch href
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "8.0") | ._links.self.href')
PATCH_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["latest-security"].href')

# Step 2: Walk back security patches, filtering for CRITICAL CVEs
for i in {1..6}; do
  DATA=$(curl -s "$PATCH_HREF")
  VERSION=$(echo "$DATA" | jq -r '.version')
  echo "$DATA" | jq -r --arg ver "$VERSION" \
    '._embedded.disclosures[] | select(.cvss_severity == "CRITICAL") | "\($ver) | \(.id): \(.title)"'
  PATCH_HREF=$(echo "$DATA" | jq -r '._links["prev-security"].href // empty')
  [ -z "$PATCH_HREF" ] && break
done
# 8.0.21 | CVE-2025-55315: .NET Security Feature Bypass Vulnerability
# 8.0.12 | CVE-2025-21172: .NET Remote Code Execution Vulnerability
```

**llms-index:** Uses `_embedded.latest_patches` with `latest-security` link for direct access:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

# Direct jump to 8.0's latest security patch via latest-security link
PATCH_HREF=$(curl -s "$LLMS" | jq -r '._embedded.latest_patches[] | select(.release == "8.0") | ._links["latest-security"].href')

# Walk back security patches for 8.0
for i in {1..6}; do
  DATA=$(curl -s "$PATCH_HREF")
  VERSION=$(echo "$DATA" | jq -r '.version')
  echo "$DATA" | jq -r --arg ver "$VERSION" \
    '._embedded.disclosures[] | select(.cvss_severity == "CRITICAL") | "\($ver) | \(.id): \(.title)"'
  PATCH_HREF=$(echo "$DATA" | jq -r '._links["prev-security"].href // empty')
  [ -z "$PATCH_HREF" ] && break
done
```

**releases-index:** Cannot answer—no severity data available.

**Analysis:**

- **Completeness:** ❌ The releases-index only provides CVE IDs. To filter by severity, you would need to fetch each CVE from cve.mitre.org.
- **Version-specific traversal:** The hal-index `prev-security` links on patch indexes stay within the major version, efficiently walking through 8.0.21 → 8.0.20 → 8.0.19 etc.
- **The `release` property:** Patch entries include a `release` property (e.g., `"release": "8.0"`) that enables filtering by major version. This is what makes `select(.release == "8.0")` work on embedded patch collections like `_embedded.latest_patches[]` or `_embedded.latest_security_month[]`.
- **Use case:** Version-specific security audits ("Is my .NET 8 deployment exposed to any critical vulnerabilities?").

**Winner:** hal-index (**24x smaller**, releases-index cannot answer this query); llms-index is 10% smaller (50 KB vs 55 KB) with direct `latest-security` link

### Breaking Changes Summary

#### Query: "How many breaking changes are there in .NET 10 by category?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `10.0/index.json` → `10.0/compatibility.json` | **151 KB** |
| llms-index | `llms.json` → `10.0/index.json` → `10.0/compatibility.json` | **151 KB** |
| releases-index | N/A | N/A (not available) |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Step 1: Get the 10.0 version href
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "10.0") | ._links.self.href')

# Step 2: Get the compatibility-json href
BC_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["compatibility-json"].href')

# Step 3: Count breaking changes by category
curl -s "$BC_HREF" | jq -r '[.breaks[].category] | group_by(.) | map({category: .[0], count: length}) | sort_by(-.count) | .[] | "\(.category): \(.count)"'
# sdk: 23
# core-libraries: 16
# aspnet-core: 9
# cryptography: 8
# extensions: 6
# windows-forms: 6
# interop: 3
# networking: 3
# reflection: 2
# serialization: 2
# wpf: 2
# containers: 1
# globalization: 1
# install-tool: 1
```

**releases-index:** Not available.

**Analysis:**

- **Completeness:** ❌ The releases-index does not include breaking changes data. The hal-index provides full breaking changes with category, impact level, required actions, and references.
- **Ergonomics:** The hal-index uses discoverable HAL links (`._links["compatibility-json"]`) to navigate to breaking changes data, enabling filtering and prioritization.

**Winner:** hal-index only; llms-index equivalent

### Breaking Changes by Category

#### Query: "What are the core-libraries breaking changes in .NET 10?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `10.0/index.json` → `10.0/compatibility.json` | **151 KB** |
| llms-index | `llms.json` → `10.0/index.json` → `10.0/compatibility.json` | **151 KB** |
| releases-index | N/A | N/A (not available) |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Step 1: Get the 10.0 version href
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "10.0") | ._links.self.href')

# Step 2: Get the compatibility-json href
BC_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["compatibility-json"].href')

# Step 3: Filter by category
curl -s "$BC_HREF" | jq -r --arg cat "core-libraries" '.breaks[] | select(.category == $cat) | .title'
# ActivitySource.CreateActivity and ActivitySource.StartActivity behavior changes
# System.Linq.AsyncEnumerable in .NET 10
# BufferedStream.WriteByte no longer performs implicit flush
# C# 14 overload resolution with span parameters
# Default trace context propagator updated to W3C standard
# 'DynamicallyAccessedMembers' annotation removed from 'DefaultValueAttribute' ctor
# DriveInfo.DriveFormat returns Linux filesystem types
# FilePatternMatch.Stem changed to non-nullable
# Consistent shift behavior in generic math
# Specifying explicit struct Size disallowed with InlineArray
# LDAP DirectoryControl parsing is now more stringent
# MacCatalyst version normalization
# .NET 10 obsoletions with custom IDs
# .NET runtime no longer provides default termination signal handler
# Arm64 SVE nonfaulting loads require mask parameter
# GnuTarEntry and PaxTarEntry exclude atime and ctime by default
```

**releases-index:** Not available.

**Analysis:**

- **Completeness:** ❌ The releases-index does not include breaking changes data.
- **Ergonomics:** The hal-index enables filtering breaking changes by category, impact level, or affected component, helping developers prioritize migration work.

**Winner:** hal-index only; llms-index equivalent

### Breaking Changes Documentation URLs

#### Query: "Get the raw markdown URLs for core-libraries breaking changes (for LLM context)"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `10.0/index.json` → `10.0/compatibility.json` | **151 KB** |
| llms-index | `llms.json` → `10.0/index.json` → `10.0/compatibility.json` | **151 KB** |
| releases-index | N/A | N/A (not available) |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Step 1: Get the 10.0 version href
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "10.0") | ._links.self.href')

# Step 2: Get the compatibility-json href
BC_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["compatibility-json"].href')

# Step 3: Get raw markdown URLs for core-libraries breaking changes
curl -s "$BC_HREF" | jq -r --arg cat "core-libraries" '.breaks[] | select(.category == $cat) | .references[]? | select(.type == "documentation") | .url'
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/activity-sampling.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/asyncenumerable.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/bufferedstream-writebyte-flush.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/csharp-overload-resolution.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/default-trace-context-propagator.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/defaultvalueattribute-dynamically-accessed-members.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/driveinfo-driveformat-linux.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/filepatternmatch-stem-nonnullable.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/generic-math.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/inlinearray-explicit-size-disallowed.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/ldap-directorycontrol-parsing.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/maccatalyst-version-normalization.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/obsolete-apis.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/sigterm-signal-handler.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/sve-nonfaulting-loads-mask-parameter.md
# https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/core-libraries/10.0/tar-atime-ctime-default.md
```

**releases-index:** Not available.

**Analysis:**

- **Completeness:** ❌ The releases-index does not include breaking changes data.
- **Ergonomics:** These raw markdown URLs can be fetched and fed directly to an LLM for analysis or migration assistance. Breaking changes include multiple reference types; `documentation` provides raw markdown content.

**Winner:** hal-index only; llms-index equivalent

### OS Package Dependencies

#### Query: "Generate an apt-get install command for .NET 10 dependencies on Ubuntu 24.04"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `10.0/index.json` → `10.0/manifest.json` → `10.0/os-packages.json` | **29 KB** |
| llms-index | `llms.json` → `10.0/index.json` → `10.0/manifest.json` → `10.0/os-packages.json` | **29 KB** |
| releases-index | N/A | N/A (not available) |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Navigate to .NET 10, then manifest.json, then os-packages.json
MAJOR_URL=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "10.0") | ._links.self.href')
MANIFEST_URL=$(curl -s "$MAJOR_URL" | jq -r '._links["release-manifest"].href')
PACKAGES_URL=$(curl -s "$MANIFEST_URL" | jq -r '._links["os-packages-json"].href')

# Generate install command for Ubuntu 24.04
curl -s "$PACKAGES_URL" | jq -r '
  .distributions[] | select(.name == "Ubuntu") |
  .releases[] | select(.release == "24.04") |
  "sudo apt-get update && sudo apt-get install -y " + ([.packages[].name] | join(" "))
'
# sudo apt-get update && sudo apt-get install -y libc6 libgcc-s1 ca-certificates libssl3t64 libstdc++6 libicu74 tzdata libgssapi-krb5-2
```

**releases-index:**

```bash
# Not available - releases-index does not include OS package dependency information
```

**Analysis:**

- **Completeness:** ❌ The releases-index does not include OS package dependency information.
- **Ergonomics:** The hal-index `os-packages.json` includes distribution-specific package names, install commands, and version requirements. Package names vary by distribution (e.g., `libssl3t64` on Ubuntu 24.04 vs `libssl3` on Debian 12 vs `openssl-libs` on RHEL).
- **Use case:** Essential for container builds, CI/CD pipelines, and deployment scripts that need to install .NET runtime dependencies on minimal base images.

**Winner:** hal-index only; llms-index equivalent

## Query Capability Comparison

| Query Type | hal-index | llms-index | releases-index | Ratio |
|------------|-----------|------------|----------------|-------|
| List versions | ✅ | ✅ (direct array) | ✅ | 17% smaller |
| Version lifecycle (EOL, LTS) | ✅ | ✅ | ✅ | 17% smaller |
| Latest patch per version | ✅ | ✅ (embedded) | ✅ | 32x smaller |
| CVEs per version | ✅ | ✅ (embedded) | ✅ | 32x smaller |
| CVEs per month | ✅ | ✅ | ❌ | — |
| CVE details (severity, fixes) | ✅ | ✅ | ❌ | — |
| Timeline navigation | ✅ | ✅ | ❌ | — |
| Security history navigation (`prev-security`) | ✅ | ✅ | ❌ | — |
| SDK-first navigation | ✅ | ✅ | ❌ | — |
| Target frameworks (TFMs, platform versions) | ✅ | ✅ | ❌ | hal-index only |
| Breaking changes by category | ✅ | ✅ | ❌ | hal-index only |
| OS package dependencies | ✅ | ✅ | ❌ | hal-index only |

The llms-index provides all hal-index capabilities plus embedded shortcuts for common AI queries. However, it is updated more frequently (~12+/year vs ~1/year for hal-index root) and is not intended for mission-critical workflows.

## Cache Coherency

### releases-index Problem

```text
Client cache state:
├── releases-index.json (fetched now)
│   └── "latest-release": "9.0.12"  ← Just updated
└── 9.0/releases.json (fetched 1 hour ago)
    └── releases[0]: "9.0.11"  ← Stale!

Result: Client sees 9.0.12 as latest but can't find its data
```

### hal-index Solution

```text
Client cache state:
├── index.json (fetched now)
│   └── _embedded.releases[]: includes 9.0 summary
└── 9.0/index.json (fetched now)
    └── _embedded.releases[0]: "9.0.12" with full data

Result: Each file is a consistent snapshot
```

The HAL `_embedded` pattern ensures that any data referenced within a document is included in that document. There are no "dangling pointers" to data that might not exist in a cached copy of another file.

## Summary

| Metric | hal-index | llms-index | releases-index |
|--------|-----------|------------|----------------|
| Basic version queries | 5 KB | 5 KB | 6 KB |
| CVE queries (latest security patch) | 37 KB | 5 KB | 1,240 KB |
| Last 3 security releases (version) | 55 KB | 32 KB | 1,240 KB |
| Last 6 security months (timeline) | 55 KB | 50 KB | 2.4 MB |
| Critical CVE this month | 25 KB | 14 KB | 2.4 MB |
| Cache coherency | ✅ Atomic | ✅ Atomic | ❌ TTL mismatch risk |
| Query syntax | snake_case (dot notation) | snake_case | kebab-case (bracket notation) |
| Link traversal | `._links.self.href` | `._links.self.href` | `.["releases.json"]` |
| Boolean filters | `supported`, `security` | `supported`, `security` | `support-phase == "active"` |
| CVE details | ✅ Full | ✅ Full | ❌ ID + URL only |
| Timeline navigation | ✅ | ✅ | ❌ |
| Update frequency | ~1/year (root) | ~12+/year | ~30/year |
| Mission-critical | ✅ | ❌ | ✅ |

The hal-index schema is optimized for the queries that matter most to security operations, while maintaining cache coherency across CDN deployments. The use of boolean properties (`supported`) instead of enum comparisons (`support-phase == "active"`) reduces query complexity and eliminates the need to know the vocabulary of valid enum values. Counterintuitively, the deeper HAL link structure (`._links.self.href`) is more ergonomic than flat URL properties (`.["releases.json"]`) because consistent snake_case naming enables dot notation throughout the query path.

The llms-index provides additional efficiency for AI workloads by embedding common query results directly. It is not suitable for mission-critical cloud-native scenarios due to its higher update frequency, but offers significant fetch savings for interactive AI assistants (e.g., 7x smaller for "CVEs per version" queries).
