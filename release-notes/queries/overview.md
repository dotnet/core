# Schema Metrics Comparison

This document compares the data transfer costs between the new **hal-index** schema and the legacy **releases-index** schema for common query patterns. The **llms-index** (`llms.json`) is also included as a secondary comparison—it's an AI-optimized entry point that operates by different rules (more frequent updates, embedded shortcuts) and is not intended for mission-critical cloud-native scenarios.

## Design Context

The hal-index schema was designed to solve fundamental problems with the releases-index approach:

1. **Cache Coherency** - The releases-index.json references external files (e.g., `9.0/releases.json`) that may have different CDN cache TTLs, leading to inconsistent data when patch versions are updated.

2. **Data Efficiency** - The `releases.json` files contain download URLs and hashes for every binary artifact, making them 30-50x larger than necessary for most queries.

3. **Atomic Consistency** - The hal-index uses HAL `_embedded` to include all referenced data in a single document, ensuring a consistent snapshot per fetch.

See [dotnet/core#10143](https://github.com/dotnet/core/issues/10143) for full design rationale.

## File Characteristics

The tables below show theoretical update frequency based on practice and design, with file sizes measured from actual files.

### LLMs-Index Files

| File | Size | Updates/Year | Description |
|------|------|--------------|-------------|
| `llms.json` | 5 KB | ~12+ | AI-optimized entry point with embedded patches and CVE summaries |

The `llms.json` file is designed for AI assistants and can be updated frequently without impacting mission-critical workflows. It embeds `latest_patches` with support status and CVE counts that provide direct answers to common queries.

### Hal-Index Files

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
