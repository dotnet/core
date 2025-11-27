# Schema Metrics Comparison

This document compares the data transfer costs between the new **index-graph** schema and the legacy **releases-index** schema for common query patterns.

## Design Context

The index-graph schema was designed to solve fundamental problems with the releases-index approach:

1. **Cache Coherency** - The releases-index.json references external files (e.g., `9.0/releases.json`) that may have different CDN cache TTLs, leading to inconsistent data when patch versions are updated.

2. **Data Efficiency** - The `releases.json` files contain download URLs and hashes for every binary artifact, making them 30-50x larger than necessary for most queries.

3. **Atomic Consistency** - The index-graph uses HAL `_embedded` to include all referenced data in a single document, ensuring a consistent snapshot per fetch.

See [dotnet/core#10143](https://github.com/dotnet/core/issues/10143) for full design rationale.

## File Characteristics

The tables below show theoretical update frequency based on practice and design, with file sizes measured from actual files.

### Index-Graph Files

| File | Size | Updates/Year | Description |
|------|------|--------------|-------------|
| `index.json` | 11 KB | ~1 | Root index with all major versions |
| `9.0/index.json` | 11 KB | ~12 | All 9.0 patches with CVE references |
| `8.0/index.json` | 18 KB | ~12 | All 8.0 patches with CVE references |
| `10.0/index.json` | 4 KB | ~12 | All 10.0 patches (fewer releases so far) |
| `timeline/index.json` | 8 KB | ~1 | Timeline root (all years) |
| `timeline/2024/index.json` | 14 KB | ~12 | Year index (all months) |
| `timeline/2024/07/index.json` | 11 KB | ~1 | Month index with embedded CVE summaries |
| `timeline/2024/07/cve.json` | 12 KB | ~1 | Full CVE details for a month |

### Releases-Index Files

| File | Size | Updates/Year | Description |
|------|------|--------------|-------------|
| `releases-index.json` | 6 KB | ~12 | Root index (version list only) |
| `9.0/releases.json` | **769 KB** | ~12 | All 9.0 releases with full download metadata |
| `8.0/releases.json` | **1,234 KB** | ~12 | All 8.0 releases with full download metadata |
| `10.0/releases.json` | **440 KB** | ~12 | All 10.0 releases with full download metadata |

### Measurements

Actual git commits in the last 12 months (Nov 2024 - Nov 2025):

| File | Commits | Notes |
|------|---------|-------|
| `releases-index.json` | 29 | Root index (all versions) |
| `9.0/releases.json` | 24 | Includes SDK-only releases, fixes, URL rewrites |
| `8.0/releases.json` | 18 | Includes SDK-only releases, fixes, URL rewrites |

The commit counts are significantly higher than the theoretical ~12/year due to:

- **SDK-only releases**: Additional releases between Patch Tuesdays (e.g., [9.0.308 SDK](https://github.com/dotnet/core/commit/24a83fcc189ecf3c514dc06963ce779dcbf64ad5) released 8 days after November Patch Tuesday)
- **Metadata corrections**: Simple changes like [updating .NET 9's EOL date](https://github.com/dotnet/core/commit/24ff22598de88e3c9681e579aab5fe344cdc21b0) require updating both `releases-index.json` and `9.0/releases.json`
- **Post-release corrections**: `fix hashes`, `sdk array mismatch`
- **Infrastructure changes**: `Update file URLs`, `Rewrite URLs to builds.dotnet`
- **Rollbacks**: `Revert "Switch links..."`

The EOL date example illustrates a key architectural tradeoff: with releases-index, metadata changes to any version require updating the root file. With index-graph, we give up rich information in the root file, but in exchange we can safely propagate useful information to many locations (authored in `9.0/_manifest.json`, generated into `9.0/manifest.json`, `9.0/index.json`, timeline indexes, etc.)—provided it doesn't violate the core rule: **the root `index.json` is never touched for version-specific changes**.

Note that Patch Tuesday releases are batched—a single commit like [November 2025](https://github.com/dotnet/core/commit/484b00682d598f8d11a81607c257c1f0a099b84c) updates `releases-index.json`, `8.0/releases.json`, `9.0/releases.json`, and `10.0/releases.json` together (6,802 lines changed across 30 files). Even with batching, the root file still requires ~30 updates/year.

These massive commits are difficult to review and analyze. Mixing markdown documentation with JSON data files in the same commit makes it hard to distinguish content changes from data updates. The index-graph design separates these concerns—JSON index files are generated automatically, while markdown content is authored separately.

**Operational Risk:** These files are effectively mission-critical live-site APIs, driving hundreds of GBs of downloads monthly. Yet they require ~20-30 manual updates per year each, carrying risk of human error (as the fix commits demonstrate), cache invalidation complexity, and CDN propagation delays.

**Key insight:** The index-graph root file (`index.json`) is updated ~1x/year when a new major version is added. The releases-index root file (`releases-index.json`) is updated ~30x/year. This makes the index-graph root file ideal for aggressive CDN caching, while the releases-index files are constantly-moving targets.

## Query Cost Comparison

### Version Information Queries

Queries like "list supported versions" or "get latest LTS":

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| index-graph | `index.json` | **11 KB** |
| releases-index | `releases-index.json` | **6 KB** |

**Winner:** releases-index (slightly smaller for basic version queries)

### CVE Queries for Single Version

Query: "What CVEs affect .NET 8.0?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| index-graph | `index.json` + `8.0/index.json` | **29 KB** |
| releases-index | `releases-index.json` + `8.0/releases.json` | **1,240 KB** |

**Winner:** index-graph (**43x smaller**)

### CVE Queries Across All Supported Versions

Query: "What CVEs affect any supported .NET version?" (8.0, 9.0, 10.0)

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| index-graph | `index.json` + 3 version indexes | **44 KB** |
| releases-index | `releases-index.json` + 3 releases.json | **2,449 KB** |

**Winner:** index-graph (**56x smaller**)

### CVE Details for a Month

Query: "What CVEs were disclosed in July 2024 with full details?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| index-graph | `index.json` → `timeline/index.json` → `timeline/2024/index.json` → `timeline/2024/07/cve.json` | **45 KB** |
| releases-index | Multiple releases.json + external CVE sources | **2+ MB** (incomplete) |

**Winner:** index-graph (releases-index cannot fully answer this query)

### Security Patches This Year

Query: "List all security patches released in 2024"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| index-graph | `index.json` → `timeline/index.json` → `timeline/2024/index.json` | **33 KB** |
| releases-index | All version releases.json files | **2.4+ MB** |

**Winner:** index-graph (**73x smaller**)

### Critical CVE This Month

Query: "Is there a critical CVE in any supported release this month?" (November 2025)

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| index-graph | `index.json` → `timeline/index.json` → `timeline/2025/index.json` → `timeline/2025/11/index.json` | **34 KB** |
| releases-index | `releases-index.json` + all supported releases.json | **2.4+ MB** (incomplete—no severity data) |

**Winner:** index-graph (releases-index cannot answer this query—CVE severity is not available)

## Query Capability Comparison

| Query Type | index-graph | releases-index |
|------------|-------------|----------------|
| List versions | ✅ | ✅ |
| Version lifecycle (EOL, LTS) | ✅ | ✅ |
| Latest patch per version | ✅ | ✅ (with large file) |
| CVEs per version | ✅ | ✅ (with large file) |
| CVEs per month | ✅ | ❌ |
| CVE details (severity, fixes) | ✅ | ❌ |
| Timeline navigation | ✅ | ❌ |
| SDK-first navigation | ✅ | ❌ |

## Cache Coherency

### releases-index Problem

```
Client cache state:
├── releases-index.json (fetched now)
│   └── "latest-release": "9.0.12"  ← Just updated
└── 9.0/releases.json (fetched 1 hour ago)
    └── releases[0]: "9.0.11"  ← Stale!

Result: Client sees 9.0.12 as latest but can't find its data
```

### index-graph Solution

```
Client cache state:
├── index.json (fetched now)
│   └── _embedded.releases[]: includes 9.0 summary
└── 9.0/index.json (fetched now)
    └── _embedded.releases[0]: "9.0.12" with full data

Result: Each file is a consistent snapshot
```

The HAL `_embedded` pattern ensures that any data referenced within a document is included in that document. There are no "dangling pointers" to data that might not exist in a cached copy of another file.

## Summary

| Metric | index-graph | releases-index |
|--------|-------------|----------------|
| Basic version queries | 11 KB | 6 KB |
| CVE queries (single version) | 22 KB | 775 KB |
| CVE queries (all supported) | 44 KB | 2.4 MB |
| Monthly security summary | 14 KB | N/A |
| Cache coherency | ✅ Atomic | ❌ TTL mismatch risk |
| Query syntax | snake_case (clean) | kebab-case (brackets) |
| CVE details | ✅ Full | ❌ ID + URL only |
| Timeline navigation | ✅ | ❌ |

The index-graph schema is optimized for the queries that matter most to security operations, while maintaining cache coherency across CDN deployments.
