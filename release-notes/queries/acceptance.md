# Acceptance Criteria for .NET Release Metadata Graph

This document defines the acceptance criteria for the hal-index schema design. It establishes a prioritized set of query types, explicit technical assumptions, and quantitative targets that validate the design decisions.

See [overview.md](overview.md) for design context, file characteristics, and link relation discovery.

## Purpose

The hal-index schema exists to serve specific use cases better than the existing releases-index. This document:

1. **Prioritizes query types** — establishes which queries matter most, so design tradeoffs can be evaluated against priorities
2. **Sets quantitative targets** — provides absolute thresholds for data efficiency, with releases-index comparisons as secondary context
3. **Makes assumptions explicit** — surfaces the technical and scenario assumptions underlying the design
4. **Enables principled feedback** — critics must engage with priorities before debating ergonomics

## Consumer Priorities

The schema serves multiple consumers with different needs. Design decisions favor higher-priority consumers when tradeoffs are required.

| Priority | Consumer | Characteristics |
|----------|----------|-----------------|
| 1 | **Cloud-native tooling** | Mission-critical, CDN-cached, requires cache coherency |
| 2 | **Security operations** | Time-sensitive CVE queries, compliance reporting |
| 3 | **Developer tooling** | Upgrade planning, breaking changes, TFM selection |
| 4 | **AI assistants** | LLM consumption via `llms.json`, tolerates more frequent updates |

The hal-index (`index.json` and related files) applies strict rules to enable aggressive CDN caching and cache coherency for Priority 1-3 consumers. The `llms.json` file intentionally relaxes some of these rules to optimize for AI assistant workflows, accepting more frequent updates in exchange for embedded shortcuts.

## Query Categories

Queries are organized by user task, with 2-3 queries per category. CVE analysis has additional depth due to its operational importance.

### Category 1: Patch Currency and Lifecycle

*Task: "What patch should I be running? Is my version still supported?"*

| ID | Query | Target | Fetches |
|----|-------|--------|---------|
| L1 | What is the latest patch for .NET X? | ≤6 KB | 1 |
| L2 | Is .NET X still supported? When does it EOL? | ≤6 KB | 1 |
| L3 | What .NET versions are currently supported? | ≤6 KB | 1 |

**Design validation:**
- Root index contains `supported`, `eol_date` for each version
- `latest` and `latest_lts` properties enable single-field access
- No patch version numbers in root (would require monthly updates)

### Category 2: Security Patch Motivation

*Task: "Should I update? Are there CVEs since I last patched?"*

| ID | Query | Target | Fetches |
|----|-------|--------|---------|
| M1 | Were there any CVEs fixed in the latest security patch for .NET X? | ≤15 KB | 1-2 |
| M2 | What CVEs have been fixed since [date] for versions I use? | ≤60 KB | 1+n |
| M3 | Is there a CRITICAL severity CVE this month? | ≤15 KB | 2 |

**Design validation:**
- `llms.json` embeds `latest_security_month[]` with CVE counts and IDs per version
- `prev-security` links enable efficient backward traversal (skips non-security releases)
- CVE severity embedded in month/patch indexes (no external fetch required)

### Category 3: CVE Deep Analysis

*Task: "I need details about specific vulnerabilities for compliance or remediation."*

| ID | Query | Target | Fetches |
|----|-------|--------|---------|
| C1 | What CVEs were fixed in the latest .NET X security patch, with severity and titles? | ≤40 KB | 2-3 |
| C2 | List all HIGH+ severity CVEs in the last 6 months | ≤60 KB | 1+n |
| C3 | What CVEs were disclosed in [month/year] with full details? | ≤35 KB | 2-3 |
| C4 | Which products/components are affected by CVE-XXXX-XXXXX? | ≤20 KB | 2-3 |
| C5 | What are the fix commits for CVE-XXXX-XXXXX? | ≤20 KB | 2-3 |
| C6 | Is runtime version X.Y.Z vulnerable to any known CVEs? | ≤20 KB | 2-3 |

**Design validation:**
- `_embedded.disclosures[]` in patch/month indexes contains severity, title, affected products, fix commits
- `cve.json` provides deep details (CVSS vectors, CWE, version ranges) when needed
- Pre-computed lookup dictionaries in `cve.json` (`product_cves`, `severity_cves`, `package_cves`)

### Category 4: Breaking Changes for Upgrade

*Task: "What will break when I upgrade my app to .NET X?"*

| ID | Query | Target | Fetches |
|----|-------|--------|---------|
| B1 | How many breaking changes are in .NET X by category? | ≤160 KB | 2-3 |
| B2 | What breaking changes affect [category] (e.g., ASP.NET Core, SDK)? | ≤160 KB | 2-3 |
| B3 | Get documentation URLs for breaking changes in [category] | ≤160 KB | 2-3 |

**Design validation:**
- `compatibility.json` linked from major version index (not embedded—large payload, infrequent access)
- Pre-computed rollups: `categories`, `impact_breakdown`, `type_breakdown`
- `references[]` includes `documentation` type for raw markdown URLs (LLM-friendly)

### Category 5: Downloads

*Task: "What do I download?"*

| ID | Query | Target | Fetches |
|----|-------|--------|---------|
| D1 | Where do I download the latest .NET X SDK? | ≤15 KB | 2 |
| D2 | What are the evergreen (aka.ms) download links for .NET X? | ≤15 KB | 2-3 |

**Design validation:**
- `manifest.json` links to `downloads-rendered` (dotnet.microsoft.com)
- `sdk/index.json` provides evergreen `aka.ms` links per feature band

### Category 6: Linux Deployment

*Task: "Is my distro supported? What packages do I need to install?"*

These queries integrate with the local system, using `/etc/os-release` to identify the distro.

| ID | Query | Target | Fetches |
|----|-------|--------|---------|
| X1 | Is my Linux distro supported for .NET X? | ≤20 KB | 2-3 |
| X2 | Generate an `apt-get install` command for .NET X dependencies on my system | ≤35 KB | 3-4 |
| X3 | Is my libc new enough for the latest .NET? | ≤35 KB | 3-4 |
| X4 | Which .NET versions support my OS? | ≤60 KB | 4-6 |

**Example flow for X2:**

```bash
# Step 1: Read local OS info
source /etc/os-release
# ID=ubuntu, VERSION_ID=24.04

# Step 2: Navigate to os-packages.json
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "10.0") | ._links.self.href')
MANIFEST_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["release-manifest"].href')
PACKAGES_HREF=$(curl -s "$MANIFEST_HREF" | jq -r '._links["os-packages-json"].href')

# Step 3: Generate install command for this distro
curl -s "$PACKAGES_HREF" | jq -r --arg distro "$ID" --arg ver "$VERSION_ID" '
  .distributions[] | select(.name | ascii_downcase == $distro) |
  .releases[] | select(.release == $ver) |
  "sudo apt-get install -y " + ([.packages[].name] | join(" "))'
# sudo apt-get install -y libc6 libgcc-s1 ca-certificates libssl3t64 libstdc++6 libicu74 tzdata libgssapi-krb5-2
```

**Example flow for X4:**

```bash
# Step 1: Get local glibc version
GLIBC_VERSION=$(ldd --version 2>&1 | head -1 | grep -oP '\d+\.\d+' | tail -1)
# 2.23 (Ubuntu 16.04)

# Step 2: Check each supported .NET version's libc requirement
for VERSION in 10.0 9.0 8.0; do
  REQUIRED=$(curl -s "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/$VERSION/supported-os.json" | \
    jq -r '.libc[] | select(.name == "glibc") | select(.architectures | index("x64")) | .version')

  if [ "$(printf '%s\n' "$REQUIRED" "$GLIBC_VERSION" | sort -V | head -1)" = "$REQUIRED" ]; then
    echo ".NET $VERSION: ✅ Supported (requires glibc $REQUIRED)"
  else
    echo ".NET $VERSION: ❌ Not supported (requires glibc $REQUIRED)"
  fi
done
# .NET 10.0: ❌ Not supported (requires glibc 2.27)
# .NET 9.0: ✅ Supported (requires glibc 2.23)
# .NET 8.0: ✅ Supported (requires glibc 2.23)
```

**Design validation:**
- `supported-os.json` lists supported distros with version ranges
- `supported-os.json` includes `libc[]` with minimum version per architecture
- `os-packages.json` provides distro-specific package names (vary by distro: `libssl3t64` on Ubuntu 24.04 vs `openssl-libs` on RHEL)
- Package names are the actual names in distro repos, not generic placeholders
- Supports container Dockerfiles, CI/CD scripts, bare-metal deployment

### Category 7: SDK Feature Bands

*Task: "Which SDK should I use? Is my SDK still supported?"*

| ID | Query | Target | Fetches |
|----|-------|--------|---------|
| S1 | What SDK feature bands are available for .NET X? | ≤10 KB | 2 |
| S2 | Is SDK feature band X.Y.Zxx still supported? | ≤10 KB | 2 |
| S3 | What's the latest SDK in the 9.0.1xx feature band? | ≤10 KB | 2 |

**Design validation:**
- `sdk/index.json` lists all feature bands with `support_phase`
- Each band has `latest` version and links to downloads
- Supports VS-integrated (1xx) vs standalone (3xx) SDK selection

### Category 8: TFM Selection for Upgrade

*Task: "What TFM should I target? How does platform versioning change?"*

| ID | Query | Target | Fetches |
|----|-------|--------|---------|
| T1 | What TFMs does .NET X support? | ≤25 KB | 2-3 |
| T2 | What Android/iOS platform version does .NET X target? | ≤25 KB | 2-3 |
| T3 | How has the Android TFM platform version changed across .NET versions? | ≤60 KB | 4-6 |

**Design validation:**
- `target-frameworks.json` linked from major version index
- TFM entries include `platform_version` for mobile platforms
- Enables cross-version comparison for upgrade planning

### Category 9: Project Health Check (Hybrid)

*Task: "Is my project's .NET environment current, supported, and secure?"*

This category combines local system inspection with graph queries to provide a holistic assessment. It's intended for AI assistants and developer tooling that can read local files and execute commands.

| ID | Query | Target | Fetches |
|----|-------|--------|---------|
| H1 | Is the TFM in my `.csproj` still supported? | ≤10 KB | 1-2 |
| H2 | Are any of my installed SDKs (`dotnet --list-sdks`) EOL or vulnerable? | ≤50 KB | 2-4 |
| H3 | Are any of my installed runtimes (`dotnet --list-runtimes`) EOL or vulnerable? | ≤50 KB | 2-4 |
| H4 | Are any `Microsoft.*` or `System.*` packages in my project affected by CVEs in the last 12 months? | ≤120 KB | 6-12 |

**Example flow for H1:**

```bash
# Step 1: Extract TFM from csproj
TFM=$(grep -oP '(?<=<TargetFramework>)[^<]+' MyProject.csproj)
# net8.0

# Step 2: Parse major version
VERSION=$(echo "$TFM" | grep -oP '\d+\.\d+')
# 8.0

# Step 3: Check support status
curl -s "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json" | \
  jq -r --arg v "$VERSION" '._embedded.releases[] | select(.version == $v) |
    "Version: \(.version), Supported: \(.supported), EOL: \(.eol_date)"'
# Version: 8.0, Supported: true, EOL: 2026-11-10T00:00:00+00:00
```

**Example flow for H4:**

```bash
# Step 1: Extract package references from csproj
PACKAGES=$(grep -oP '(?<=PackageReference Include=")[^"]+' MyProject.csproj | grep -E '^(Microsoft|System)\.')

# Step 2: Walk last 12 security months via prev-security links
# Step 3: For each month, check _embedded.disclosures[].affected_packages against $PACKAGES
# Step 4: Report any matches with CVE ID, severity, and fixed version
```

**Design validation:**
- Root index provides support status for TFM version check
- `prev-security` chain enables efficient 12-month CVE scan
- `cve.json` contains `package_cves` lookup dictionary for package-level queries
- Combines multiple simpler queries into actionable security assessment

## Technical Assumptions

These assumptions underlie the design. If an assumption is incorrect, the design may need revision.

### A1: CDN caching is critical for production scenarios

**Assumption:** The release metadata files are served via CDN and cache coherency across files with different TTLs causes production issues.

**Evidence:** The releases-index requires updating the root file ~30x/year, making aggressive caching impractical. Version-specific changes (EOL date corrections, metadata fixes) propagate to the root file. See [dotnet/core#9200](https://github.com/dotnet/core/issues/9200), [dotnet/core#10082](https://github.com/dotnet/core/issues/10082).

**Design response:** The hal-index root file updates ~1x/year (only for new major versions). Version-specific metadata is isolated to version files. The `_embedded` pattern ensures each file is a consistent snapshot. Rule: **the root `index.json` is never touched for version-specific changes**.

### A2: Security queries are time-sensitive

**Assumption:** Security operations teams need to assess exposure within hours of Patch Tuesday. "Do I need to patch urgently?" is the most common question.

**Evidence:** Patch Tuesday releases drive file updates. CVE severity determines urgency. Teams need to filter by severity without fetching external data.

**Design response:** CVE details (severity, title, affected versions, fix commits) embedded in index files. `prev-security` links enable efficient traversal. Severity filtering doesn't require external fetches.

### A3: AI assistants are important but secondary

**Assumption:** AI assistants will frequently query this data, but their needs should not compromise cache coherency for mission-critical cloud-native scenarios.

**Evidence:** LLMs benefit from embedded shortcuts and pre-computed results. They tolerate more frequent updates than CDN-cached production tooling.

**Design response:** `llms.json` provides an AI-optimized entry point with embedded shortcuts (`latest_patches[]`, `latest_security_month[]`). It can be updated more frequently (~12+/year) without impacting the hal-index root. The hal-index maintains strict update discipline; `llms.json` trades stability for convenience.

### A4: Breaking changes and TFMs are upgrade-time concerns

**Assumption:** Breaking changes and TFM data are accessed during upgrade planning, not routine operations. They can tolerate larger payloads and more fetches.

**Evidence:** Developers consult breaking changes when planning major version upgrades (1-2x/year per app). TFM selection happens at project creation or upgrade.

**Design response:** `compatibility.json` and `target-frameworks.json` are linked from version index, not embedded. This keeps the version index small for routine queries while providing rich data for upgrade planning.

### A5: snake_case enables better query ergonomics

**Assumption:** Property naming affects query complexity. `snake_case` enables dot notation; `kebab-case` requires bracket notation.

**Evidence:** Compare `.supported` vs `["support-phase"]` in jq. The hal-index query is 30% shorter for equivalent operations.

**Design response:** All hal-index properties use `snake_case`. Link relations use `kebab-case` (HAL convention) but are accessed via `._links["..."].href` regardless.

## Acceptance Testing

### Two Optimal Paths

Each query has two optimal paths reflecting the two consumption modes:

1. **Cloud-native path** — Starts from `index.json` or `timeline/index.json`. This is the primary test validating the overall schema design. These entry points update ~1x/year, enabling aggressive CDN caching.

2. **LLM path** — Starts from `llms.json`. This path must demonstrate measurable improvement over the cloud-native path to justify the existence of `llms.json` (which updates ~12x/year).

For each query, we document both paths. The cloud-native path validates the schema; the LLM path validates the optimization.

### Test Format

```
Query ID: [from tables above]
Query: [natural language]

Cloud-native path:
  Entry point: [index.json | timeline/index.json]
  Navigation:
    1. [file] ([size]) → [action]
    2. [file] ([size]) → [action]
  Fetches: [N]
  Transfer: [X KB]

LLM path:
  Entry point: llms.json
  Navigation:
    1. [file] ([size]) → [action]
    2. [file] ([size]) → [action]
  Fetches: [N]
  Transfer: [X KB]
  Improvement: [savings vs cloud-native, or "none"]
```

### Scoring

**Schema validation (cloud-native path):**
- The documented path *is* the target — it represents the optimal traversal
- Any implementation that exceeds the documented fetch count or transfer size is suboptimal

**LLM optimization validation:**
- `llms.json` must show improvement on at least 50% of Category 1-3 queries
- Improvement means fewer fetches OR significantly less transfer (>30% reduction)
- If `llms.json` shows no improvement for a query, the cloud-native path is preferred

**LLM benchmarking:**
- Full credit: Matches optimal path (correct entry point, correct navigation, no URL construction)
- Partial credit: Correct answer via suboptimal path (extra fetches or wrong entry point)
- Zero credit: Wrong answer, URL construction, or hallucinated data

### Example: L1 — Latest Patch for .NET X

```
Query ID: L1
Query: "What is the latest patch for .NET 9?"

Cloud-native path:
  Entry point: index.json
  Navigation:
    1. index.json (5 KB) → follow _embedded.releases[] where version == "9.0" → ._links.self.href
    2. 9.0/index.json (20 KB) → read .latest field → "9.0.11"
  Fetches: 2
  Transfer: 25 KB

LLM path:
  Entry point: llms.json
  Navigation:
    1. llms.json (5 KB) → filter _embedded.latest_patches[] by release == "9.0" → read .version
  Fetches: 1
  Transfer: 5 KB
  Improvement: 1 fewer fetch, 80% less transfer
```

### Example: M3 — Critical CVE This Month

```
Query ID: M3
Query: "Is there a CRITICAL severity CVE this month?"

Cloud-native path:
  Entry point: timeline/index.json
  Navigation:
    1. timeline/index.json (4 KB) → follow _embedded.years[0]._links["latest-security-month"].href
    2. timeline/2025/10/index.json (9 KB) → filter _embedded.disclosures[] by cvss_severity == "CRITICAL"
  Fetches: 2
  Transfer: 13 KB

LLM path:
  Entry point: llms.json
  Navigation:
    1. llms.json (5 KB) → follow _links["latest-security-month"].href
    2. timeline/2025/10/index.json (9 KB) → filter _embedded.disclosures[] by cvss_severity == "CRITICAL"
  Fetches: 2
  Transfer: 14 KB
  Improvement: none (cloud-native path is 1 KB smaller)
```

### Example: C2 — HIGH+ CVEs Over 6 Months

```
Query ID: C2
Query: "List all HIGH+ severity CVEs in the last 6 months"

Cloud-native path:
  Entry point: timeline/index.json
  Navigation:
    1. timeline/index.json (4 KB) → follow _embedded.years[0]._links["latest-security-month"].href
    2. timeline/2025/10/index.json (9 KB) → filter, then follow _links["prev-security"].href
    3-6. Repeat for 5 more security months (~9 KB each)
  Fetches: 7
  Transfer: ~58 KB

LLM path:
  Entry point: llms.json
  Navigation:
    1. llms.json (5 KB) → follow _links["latest-security-month"].href
    2-6. timeline months via prev-security (~9 KB each)
  Fetches: 6
  Transfer: ~50 KB
  Improvement: 1 fewer fetch, 14% less transfer
```

## Results Summary

These results validate the schema design and demonstrate where each entry point provides value.

### Two Design Points

The schema provides two entry points that represent fundamentally different design philosophies:

| | `index.json` | `llms.json` |
|---|---|---|
| **Design point** | High cacheability / low change | Embedded query results for "now" |
| **Update frequency** | ~1x/year (new major version only) | ~12x/year (each patch Tuesday) |
| **Optimal for** | CDN-cached cloud-native tooling | AI assistants, interactive queries |
| **Failure mode** | Any monthly-changing value destroys cacheability | Missing data forces extra fetches |

Each file fully embraces its design point:

- **`index.json` (4.7 KB)** — Contains only data that changes ~1x/year. No patch versions, no CVE counts, no monthly data. A single monthly-changing field would force CDN TTL down to hours/days, destroying the value prop for all consumers.

- **`llms.json` (7.1 KB)** — Embeds everything an LLM needs for "current state" queries: latest patches, support status, EOL dates, CVE summaries, and navigation links. If an LLM has to make a second fetch for common data, you've paid the 7 KB cost without getting the benefit.

The `llms.json` file embeds two curated arrays:
- `latest_patches[]` — "What's current?" (patch versions, support status, EOL dates, navigation links)
- `latest_security_month[]` — "What's urgent?" (CVE counts, CVE IDs per version)

Each `latest_patches[]` object includes `release-major` and `latest-sdk` links for direct navigation to version-specific resources. These links are stable (keyed by major version, change ~1x/year).

### Category 1: Patch Currency and Lifecycle

| ID | Query | Cloud-native | LLM | Winner | Notes |
|----|-------|--------------|-----|--------|-------|
| L1 | Latest patch for .NET X | 2 fetches, 24.3 KB | 1 fetch, 7.1 KB | LLM | 71% less transfer |
| L2 | Is .NET X supported? EOL? | 1 fetch, 4.7 KB | 1 fetch, 7.1 KB | Cloud | Both answer in 1 fetch |
| L3 | What versions are supported? | 1 fetch, 4.7 KB | 1 fetch, 7.1 KB | Cloud | Both answer in 1 fetch |

*L2/L3: Cloud-native transfers less per query, but LLM path amortizes — a single `llms.json` fetch answers L1, L2, L3, and M1.*

### Category 2: Security Patch Motivation

| ID | Query | Cloud-native | LLM | Winner | LLM Improvement |
|----|-------|--------------|-----|--------|-----------------|
| M1 | CVEs in latest security patch | 3 fetches, 35.9 KB | 1 fetch, 7.1 KB | LLM | 80% less transfer |
| M2 | CVEs since [date] | 5 fetches, 35.9 KB | 4 fetches, 31.2 KB | LLM | 13% less transfer |
| M3 | CRITICAL CVE this month? | 3 fetches, 24.6 KB | 2 fetches, 15.7 KB | LLM | 36% less transfer |

### Category 3: CVE Deep Analysis

| ID | Query | Cloud-native | LLM | Winner | LLM Improvement |
|----|-------|--------------|-----|--------|-----------------|
| C1 | CVEs with severity/titles | 3 fetches, 35.9 KB | 2 fetches, 15.7 KB | LLM | 56% less transfer |
| C2 | HIGH+ CVEs last 6 months | 8 fetches, 54.8 KB | 7 fetches, 45.9 KB | LLM | 16% less transfer |
| C3 | CVEs in [month] with details | 4 fetches, 38.1 KB | 8 fetches, 57.4 KB | Cloud | (historical lookup) |
| C4 | Products affected by CVE | 3 fetches, 24.6 KB | 2 fetches, 15.7 KB | LLM | 36% less transfer |
| C5 | Fix commits for CVE | 3 fetches, 24.6 KB | 2 fetches, 15.7 KB | LLM | 36% less transfer |
| C6 | Is version X vulnerable? | 4 fetches, 43.1 KB | 3 fetches, 34.2 KB | LLM | 21% less transfer |

### Category 4: Breaking Changes

| ID | Query | Cloud-native | LLM | Winner | LLM Improvement |
|----|-------|--------------|-----|--------|-----------------|
| B1 | Breaking changes by category | 3 fetches, 151.1 KB | 2 fetches, 153.6 KB | Cloud | 1 fewer fetch |
| B2 | Breaking changes for [category] | 3 fetches, 151.1 KB | 2 fetches, 153.6 KB | Cloud | 1 fewer fetch |
| B3 | Doc URLs for [category] | 3 fetches, 151.1 KB | 2 fetches, 153.6 KB | Cloud | 1 fewer fetch |

*LLM path uses `release-major` link to skip `index.json`, but `llms.json` is 2.4 KB larger.*

### Category 5: Downloads

| ID | Query | Cloud-native | LLM | Winner | LLM Improvement |
|----|-------|--------------|-----|--------|-----------------|
| D1 | Download latest SDK | 3 fetches, 26.4 KB | 2 fetches, 8.8 KB | LLM | 67% less transfer |
| D2 | Evergreen aka.ms links | 4 fetches, 34.5 KB | 2 fetches, 8.8 KB | LLM | 74% less transfer |

*LLM path uses `latest-sdk` link: llms.json (7.1 KB) → sdk/index.json (1.7 KB)*

### Category 6: Linux Deployment

| ID | Query | Cloud-native | LLM | Winner | LLM Improvement |
|----|-------|--------------|-----|--------|-----------------|
| X1 | Is distro supported? | 3 fetches, 30.1 KB | 2 fetches, 27.9 KB | LLM | 7% less transfer |
| X2 | apt-get install command | 4 fetches, 52.3 KB | 3 fetches, 50.3 KB | LLM | 4% less transfer |
| X3 | Is libc new enough? | 3 fetches, 20.7 KB | 2 fetches, 18.5 KB | LLM | 11% less transfer |
| X4 | Which .NET versions support my OS? | 6 fetches, 64.6 KB | 4 fetches, 46.0 KB | LLM | 29% less transfer |

*LLM path uses `release-major` link to navigate directly to each version's `supported-os.json`.*

### Category 7: SDK Feature Bands

| ID | Query | Cloud-native | LLM | Winner | LLM Improvement |
|----|-------|--------------|-----|--------|-----------------|
| S1 | SDK feature bands for .NET X | 3 fetches, 27.5 KB | 2 fetches, 10.5 KB | LLM | 62% less transfer |
| S2 | Is SDK band supported? | 3 fetches, 27.5 KB | 2 fetches, 10.5 KB | LLM | 62% less transfer |
| S3 | Latest SDK in band | 3 fetches, 27.5 KB | 2 fetches, 10.5 KB | LLM | 62% less transfer |

*LLM path uses `latest-sdk` link: llms.json (7.1 KB) → sdk/index.json (3.4 KB for 9.0)*

### Category 8: TFM Selection

| ID | Query | Cloud-native | LLM | Winner | LLM Improvement |
|----|-------|--------------|-----|--------|-----------------|
| T1 | TFMs for .NET X | 3 fetches, 26.0 KB | 2 fetches, 18.7 KB | LLM | 28% less transfer |
| T2 | Android/iOS platform version | 3 fetches, 26.0 KB | 2 fetches, 18.7 KB | LLM | 28% less transfer |
| T3 | Android TFM progression | 7 fetches, 61.2 KB | 5 fetches, 41.2 KB | LLM | 33% less transfer |

*LLM path uses `release-major` link to navigate directly to each version's `target-frameworks.json`.*

### Category 9: Project Health Check

| ID | Query | Cloud-native | LLM | Winner | Notes |
|----|-------|--------------|-----|--------|-------|
| H1 | Is TFM supported? | 1 fetch, 4.7 KB | 1 fetch, 7.1 KB | Cloud | Both answer in 1 fetch |
| H2 | Are installed SDKs vulnerable? | 2 fetches, 24.1 KB | 2 fetches, 26.6 KB | Cloud | Same fetches, cloud smaller |
| H3 | Are installed runtimes vulnerable? | 2 fetches, 24.1 KB | 2 fetches, 26.6 KB | Cloud | Same fetches, cloud smaller |
| H4 | Package CVEs in last 12 months | 13 fetches, 84.1 KB | 13 fetches, 86.3 KB | Cloud | Same fetches, cloud smaller |

*Health check queries start from a known version (from csproj or `dotnet` CLI), so `index.json` (4.7 KB) is more efficient than `llms.json` (7.1 KB). No discovery needed.*

### Summary

**Schema validation:** All 31 queries are answerable via the cloud-native path with reasonable efficiency (1-13 fetches, 4.7-151 KB).

**LLM optimization validation:** `llms.json` improves 21 of 31 queries (68%) by either embedding data directly or providing navigation shortcuts. The file fully embraces its design point of "embedded query results for now."

**Where `llms.json` wins (21 queries):**
- L1: Latest patch (71% less transfer)
- M1-M3: Security queries (13-80% less transfer)
- C1-C2, C4-C6: CVE analysis (16-56% less transfer)
- D1-D2: Downloads (67-74% less transfer)
- X1-X4: Linux deployment (4-29% less transfer)
- S1-S3: SDK feature bands (62% less transfer)
- T1-T3: TFM selection (28-33% less transfer)

**Where cloud-native wins (10 queries):**
- L2-L3: Support status queries (both answer in 1 fetch, but `index.json` is smaller)
- B1-B3: Breaking changes (LLM saves a fetch but transfers 2.5 KB more)
- C3: Historical CVE lookup (requires timeline traversal)
- H1-H4: Health checks (start from known version, no discovery needed)

**Key insight:** The two entry points serve different purposes and both fully embrace their design points:
- `index.json` wins when you need minimal data that rarely changes, or when you already know your version
- `llms.json` wins when you need current-state answers or version discovery, and amortizes across multiple queries

The 10 cloud-native wins fall into clear categories: root-only queries (L2-L3, H1), historical queries (C3), large payloads where entry point overhead is noise (B1-B3), and known-version queries (H2-H4).

## Comparison Baseline

While primary targets are absolute, comparison to releases-index provides context for improvement magnitude.

| Query Type | hal-index | releases-index | Notes |
|------------|-----------|----------------|-------|
| Supported versions (L3) | 4.6 KB | 6 KB | 23% smaller |
| CVEs for latest patch (M1) | 4.9 KB | 1,240 KB | 253x smaller |
| CVEs for last 6 months (C2) | 43.7 KB | 2,400 KB | 55x smaller |
| Critical CVEs this month (M3) | 13.5 KB | N/A | releases-index lacks severity |
| Breaking changes (B1) | ~160 KB | N/A | releases-index lacks data |
| TFM platform versions (T2) | ~25 KB | N/A | releases-index lacks data |

"N/A" indicates the releases-index cannot answer the query.

## Non-Goals

The following are explicitly not acceptance criteria:

1. **Backward compatibility with releases-index** — This is a parallel schema, not a migration. Tools using releases-index continue to work.

2. **Optimal ergonomics for all queries** — Category 5-9 queries may require more complex navigation. The schema optimizes for Categories 1-3.

3. **Minimal file count** — The design trades more files for smaller files and better cache isolation.

4. **Real-time CVE disclosure** — The schema is designed for Patch Tuesday cadence (~monthly), not real-time updates.

5. **LLM optimization at the expense of cache coherency** — `llms.json` provides AI shortcuts; the hal-index maintains strict discipline.

## Feedback Framework

When evaluating feedback on the design:

1. **Which consumer priority does the feedback serve?** Priority 1-2 feedback deserves more weight than Priority 4.

2. **Which query category does the feedback affect?** Category 1-3 feedback is more impactful than Category 4-5.

3. **Does the feedback challenge an assumption?** If an assumption is wrong, the design may need revision.

4. **Does the feedback propose a different tradeoff?** Tradeoffs are explicit; changing one affects others.

5. **Does the feedback require breaking cache coherency rules?** Such changes require strong justification.

Feedback that optimizes for AI assistants at the expense of cloud-native cache coherency contradicts the design's primary purpose.
