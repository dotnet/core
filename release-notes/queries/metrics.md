# Schema Metrics Comparison

This document compares the data transfer costs between the new **hal-index** schema and the legacy **releases-index** schema for common query patterns.

## Design Context

The hal-index schema was designed to solve fundamental problems with the releases-index approach:

1. **Cache Coherency** - The releases-index.json references external files (e.g., `9.0/releases.json`) that may have different CDN cache TTLs, leading to inconsistent data when patch versions are updated.

2. **Data Efficiency** - The `releases.json` files contain download URLs and hashes for every binary artifact, making them 30-50x larger than necessary for most queries.

3. **Atomic Consistency** - The hal-index uses HAL `_embedded` to include all referenced data in a single document, ensuring a consistent snapshot per fetch.

See [dotnet/core#10143](https://github.com/dotnet/core/issues/10143) for full design rationale.

## File Characteristics

The tables below show theoretical update frequency based on practice and design, with file sizes measured from actual files.

### Hal-Graph Files

| File | Size | Updates/Year | Description |
|------|------|--------------|-------------|
| `index.json` | 5 KB | ~1 | Root index with all major versions |
| `10.0/index.json` | 10 KB | ~12 | All 10.0 patches (fewer releases so far) |
| `9.0/index.json` | 20 KB | ~12 | All 9.0 patches with CVE references |
| `8.0/index.json` | 23 KB | ~12 | All 8.0 patches with CVE references |
| `timeline/index.json` | 4 KB | ~1 | Timeline root (all years) |
| `timeline/2025/index.json` | 12 KB | ~12 | Year index (all months) |
| `timeline/2025/10/index.json` | 9 KB | ~1 | Month index with embedded CVE summaries |
| `timeline/2025/01/cve.json` | 14 KB | ~1 | Full CVE details for a month |

### Releases-Index Files

| File | Size | Updates/Year | Description |
|------|------|--------------|-------------|
| `releases-index.json` | 6 KB | ~12 | Root index (version list only) |
| `10.0/releases.json` | **440 KB** | ~12 | All 10.0 releases with full download metadata |
| `9.0/releases.json` | **769 KB** | ~12 | All 9.0 releases with full download metadata |
| `8.0/releases.json` | **1,234 KB** | ~12 | All 8.0 releases with full download metadata |

### Measurements

Actual git commits in the last 12 months (Nov 2024 - Nov 2025):

| File | Commits | Notes |
|------|---------|-------|
| `releases-index.json` | 29 | Root index (all versions) |
| `10.0/releases.json` | 22 | Includes previews/RCs and SDK-only releases |
| `9.0/releases.json` | 24 | Includes SDK-only releases, fixes, URL rewrites |
| `8.0/releases.json` | 18 | Includes SDK-only releases, fixes, URL rewrites |

The commit counts are significantly higher than the theoretical ~12/year due to:

- **SDK-only releases**: Additional releases between Patch Tuesdays (e.g., [9.0.308 SDK](https://github.com/dotnet/core/commit/24a83fcc189ecf3c514dc06963ce779dcbf64ad5) released 8 days after November Patch Tuesday)
- **Metadata corrections**: Simple changes like [updating .NET 9's EOL date](https://github.com/dotnet/core/commit/24ff22598de88e3c9681e579aab5fe344cdc21b0) require updating both `releases-index.json` and `9.0/releases.json`
- **Post-release corrections**: `fix hashes`, `sdk array mismatch`
- **Infrastructure changes**: `Update file URLs`, `Rewrite URLs to builds.dotnet`
- **Rollbacks**: `Revert "Switch links..."`

The EOL date example illustrates a key architectural tradeoff: with releases-index, metadata changes to any version require updating the root file. With hal-index, we give up rich information in the root file, but in exchange we can safely propagate useful information to many locations (authored in `9.0/_manifest.json`, generated into `9.0/manifest.json`, `9.0/index.json`, timeline indexes, etc.)—provided it doesn't violate the core rule: **the root `index.json` is never touched for version-specific changes**.

Note that Patch Tuesday releases are batched—a single commit like [November 2025](https://github.com/dotnet/core/commit/484b00682d598f8d11a81607c257c1f0a099b84c) updates `releases-index.json`, `8.0/releases.json`, `9.0/releases.json`, and `10.0/releases.json` together (6,802 lines changed across 30 files). Even with batching, the root file still requires ~30 updates/year.

These massive commits are difficult to review and analyze. Mixing markdown documentation with JSON data files in the same commit makes it hard to distinguish content changes from data updates. The hal-index design separates these concerns—JSON index files are generated automatically, while markdown content is authored separately.

**Operational Risk:** These files are effectively mission-critical live-site APIs, driving hundreds of GBs of downloads monthly. Yet they require ~20-30 manual updates per year each, carrying risk of human error (as the fix commits demonstrate), cache invalidation complexity, and CDN propagation delays.

**Key insight:** The hal-index root file (`index.json`) is updated ~1x/year when a new major version is added. The releases-index root file (`releases-index.json`) is updated ~30x/year. This makes the hal-index root file ideal for aggressive CDN caching, while the releases-index files are constantly-moving targets.

## Link Relation Discovery

One of HAL's key benefits is self-describing APIs. Clients can discover available operations by inspecting `_links` without documentation.

#### Query: "What operations are available from the root index?"

```bash
curl -s "$ROOT" | jq -r '._links | keys[]'
# latest
# latest-lts
# llms-txt
# self
# timeline-index
```

#### Query: "What operations are available for a major version?"

```bash
curl -s "$ROOT" | jq -r '._embedded.releases[0]._links.self.href' | xargs curl -s | jq -r '._links | keys[]'
# compatibility-json
# downloads
# latest
# latest-release-json
# latest-sdk
# latest-security
# releases-index
# target-frameworks-json
```

#### Query: "What operations are available for a patch release?"

```bash
curl -s "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/8.0/8.0.21/index.json" | jq -r '._links | keys[]'
# cve-json
# cve-markdown
# cve-markdown-rendered
# latest-sdk
# prev
# prev-security
# release-json
# release-major
# release-month
# release-notes-markdown
# release-notes-markdown-rendered
# releases-index
# self
```

#### Query: "What documentation links are available from the manifest?"

```bash
curl -s "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/10.0/manifest.json" | jq -r '._links | keys[]'
# compatibility-rendered
# downloads-rendered
# os-packages-json
# release-blog-rendered
# releases-json
# self
# supported-os-json
# supported-os-markdown
# supported-os-markdown-rendered
# usage-markdown-rendered
# whats-new-rendered
```

The naming convention makes relations self-documenting:
- `-json` suffix: machine-readable data
- `-markdown` suffix: raw markdown source
- `-rendered` suffix: HTML-rendered view (GitHub blob URLs)
- `prev-` prefix: backward navigation
- `latest-` prefix: jump to most recent

## Query Cost Comparison

### Version Information Queries

#### Query: "What .NET versions are currently supported?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` | **5 KB** |
| releases-index | `releases-index.json` | **6 KB** |

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

**Analysis:**

- **Completeness:** ✅ Equal—both return the same list of supported versions.
- **Boolean vs enum:** The hal-index uses `supported: true`, a simple boolean. The releases-index only exposes `support-phase: "active"` (which hal-index also has), requiring knowledge of the enum vocabulary (active, maintenance, eol, preview, go-live).
- **Property naming:** The hal-index uses `select(.supported)` with dot notation. The releases-index requires `select(.["support-phase"] == "active")` with bracket notation and string comparison.
- **Query complexity:** The hal-index query is 30% shorter and more intuitive for someone unfamiliar with the schema.

**Winner:** hal-index (**17% smaller**)

**Note on URL length:** The hal-index currently uses long GitHub raw URLs (91 chars per URL). With equivalent short CDN URLs, the hal-index would be **4.4 KB**—31% smaller than releases-index.

### Target Framework Queries

#### Query: "What Android platform version does each supported .NET version target?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `{version}/target-frameworks.json` per version | **~20 KB** |
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

**Winner:** hal-index only

### CVE Queries for Latest Security Patch

#### Query: "What CVEs were fixed in the latest .NET 8.0 security patch?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `8.0/index.json` → `8.0/8.0.21/index.json` | **37 KB** |
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

**Winner:** hal-index (**32x smaller**)

### High Severity CVEs with Details

#### Query: "What High+ severity CVEs were fixed in the latest .NET 8.0 security patch, with titles?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `8.0/index.json` → `8.0/8.0.21/index.json` | **37 KB** |
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

**Winner:** hal-index (releases-index cannot answer this query—CVE severity and titles are not available)

### Last 3 Security Releases for a Version

#### Query: "What CVEs were fixed in the last 3 security releases for .NET 8.0?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `8.0/index.json` → 3 patch indexes (via `prev-security`) | **55 KB** |
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

**Winner:** hal-index (**24x smaller**, with component information)

### CVE Details for a Month

#### Query: "What CVEs were disclosed in January 2025 with full details?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `timeline/index.json` → `timeline/2025/index.json` → `timeline/2025/01/cve.json` | **30 KB** |
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

**Winner:** hal-index (**256x smaller**, and releases-index cannot answer this query—CVE details are not available)

### Security Releases Over the Last 6 Months

#### Query: "What CVEs were fixed in the last 6 security releases across all versions?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `timeline/index.json` → `timeline/2025/index.json` → 6 month indexes (via `prev-security`) | **55 KB** |
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

**Winner:** hal-index (**40x smaller**, with version and component information)

### Critical CVE This Month

#### Query: "Is there a critical CVE in any supported release this month?" (October 2025)

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `timeline/index.json` → `timeline/2025/index.json` → `timeline/2025/10/index.json` | **25 KB** |
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

**Winner:** hal-index (**89x smaller**, and releases-index cannot answer this query—CVE severity is not available)

### Breaking Changes Summary

#### Query: "How many breaking changes are there in .NET 10 by category?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `10.0/index.json` → `10.0/compatibility.json` | **151 KB** |
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

**Winner:** hal-index only

### Breaking Changes by Category

#### Query: "What are the core-libraries breaking changes in .NET 10?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `10.0/index.json` → `10.0/compatibility.json` | **151 KB** |
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

**Winner:** hal-index only

### Breaking Changes Documentation URLs

#### Query: "Get the raw markdown URLs for core-libraries breaking changes (for LLM context)"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `10.0/index.json` → `10.0/compatibility.json` | **151 KB** |
| releases-index | N/A | N/A (not available) |

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Step 1: Get the 10.0 version href
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "10.0") | ._links.self.href')

# Step 2: Get the compatibility-json href
BC_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["compatibility-json"].href')

# Step 3: Get raw markdown URLs for core-libraries breaking changes
curl -s "$BC_HREF" | jq -r --arg cat "core-libraries" '.breaks[] | select(.category == $cat) | .references[]? | select(.type == "documentation-source") | .url'
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
- **Ergonomics:** These raw markdown URLs can be fetched and fed directly to an LLM for analysis or migration assistance. Breaking changes include multiple reference types; `documentation-source` provides raw markdown content.

**Winner:** hal-index only

### OS Package Dependencies

#### Query: "Generate an apt-get install command for .NET 10 dependencies on Ubuntu 24.04"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| hal-index | `index.json` → `10.0/index.json` → `10.0/manifest.json` → `10.0/os-packages.json` | **29 KB** |
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

**Winner:** hal-index only

## Query Capability Comparison

| Query Type | hal-index | releases-index | Ratio |
|------------|-----------|----------------|-------|
| List versions | ✅ | ✅ | 17% smaller |
| Version lifecycle (EOL, LTS) | ✅ | ✅ | 17% smaller |
| Latest patch per version | ✅ | ✅ | 32x smaller |
| CVEs per version | ✅ | ✅ | 32x smaller |
| CVEs per month | ✅ | ❌ | — |
| CVE details (severity, fixes) | ✅ | ❌ | — |
| Timeline navigation | ✅ | ❌ | — |
| Security history navigation (`prev-security`) | ✅ | ❌ | — |
| SDK-first navigation | ✅ | ❌ | — |
| Target frameworks (TFMs, platform versions) | ✅ | ❌ | hal-index only |
| Breaking changes by category | ✅ | ❌ | hal-index only |
| OS package dependencies | ✅ | ❌ | hal-index only |

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

| Metric | hal-index | releases-index |
|--------|-------------|----------------|
| Basic version queries | 5 KB | 6 KB |
| CVE queries (latest security patch) | 37 KB | 1,240 KB |
| Last 3 security releases (version) | 55 KB | 1,240 KB |
| Last 6 security months (timeline) | 55 KB | 2.4 MB |
| Cache coherency | ✅ Atomic | ❌ TTL mismatch risk |
| Query syntax | snake_case (dot notation) | kebab-case (bracket notation) |
| Link traversal | `._links.self.href` | `.["releases.json"]` |
| Boolean filters | `supported`, `security` | `support-phase == "active"` |
| CVE details | ✅ Full | ❌ ID + URL only |
| Timeline navigation | ✅ | ❌ |

The hal-index schema is optimized for the queries that matter most to security operations, while maintaining cache coherency across CDN deployments. The use of boolean properties (`supported`) instead of enum comparisons (`support-phase == "active"`) reduces query complexity and eliminates the need to know the vocabulary of valid enum values. Counterintuitively, the deeper HAL link structure (`._links.self.href`) is more ergonomic than flat URL properties (`.["releases.json"]`) because consistent snake_case naming enables dot notation throughout the query path.
