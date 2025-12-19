# Index Discovery

Query patterns for discovering and navigating the .NET release metadata graph. These patterns demonstrate how HAL's self-describing structure enables exploration without prior documentation.

## 1: List Available Link Relations

**Query:** "What operations are available from this index?"

The `_links` object in any HAL document describes all available navigation paths. This is the fundamental discovery pattern.

**Root index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

curl -s "$ROOT" | jq -r '._links | keys[]'
# latest
# latest-lts
# self
# timeline-index
```

**Version index:**

```bash
curl -s "$ROOT" | jq -r '._embedded.releases[0]._links.self.href' | xargs curl -s | jq -r '._links | keys[]'
# downloads
# latest
# latest-sdk
# latest-security
# manifest
# releases-index
# self
```

**Patch index:**

```bash
curl -s "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/8.0/8.0.21/index.json" | jq -r '._links | keys[]'
# cve-json
# latest-sdk
# manifest
# prev
# prev-security
# release-major
# release-month
# releases-index
# self
```

**Analysis:**

- HAL's `_links` pattern makes APIs self-documenting
- No need to know the schema in advance—just inspect available links
- Naming conventions reveal link types: `-json`, `-markdown`, `-rendered`, `prev-`, `latest-`

---

## 2: Follow Self Links

**Query:** "How do I get the canonical URL for any resource?"

Every HAL resource includes a `self` link with its canonical URL. This enables reliable caching and reference.

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Get self link from root
curl -s "$ROOT" | jq -r '._links.self.href'
# https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json

# Get self link from embedded resource
curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "10.0") | ._links.self.href'
# https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/10.0/index.json
```

**Analysis:**

- `self` links provide canonical URLs for caching
- Embedded resources include their own `self` links for navigation
- Never construct URLs manually—always follow links

---

## 3: Discover Embedded Data

**Query:** "What data is available without additional fetches?"

The `_embedded` object contains data that would otherwise require additional fetches. Inspect it to understand what's available inline.

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# What's embedded in the root index?
curl -s "$ROOT" | jq -r '._embedded | keys[]'
# releases

# What fields are available in each embedded release?
curl -s "$ROOT" | jq -r '._embedded.releases[0] | keys[]'
# _links
# release_type
# supported
# version

# What's embedded in a patch index?
curl -s "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/8.0/8.0.21/index.json" | jq -r '._embedded | keys[]'
# disclosures
# sdk
# sdk_feature_bands
```

**Analysis:**

- `_embedded` provides complete data inline—no dangling references
- Root embeds version summaries; patch indexes embed CVE disclosures, SDK info, and feature bands
- Check `_embedded` first before following links to avoid unnecessary fetches

---

## 4: Navigate Version Hierarchy

**Query:** "How do I traverse from root to patch to CVE details?"

HAL links create a navigable hierarchy. Follow links to drill down or up.

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Root -> Version
VERSION_HREF=$(curl -s "$ROOT" | jq -r '._embedded.releases[] | select(.version == "8.0") | ._links.self.href')
echo "$VERSION_HREF"
# https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/8.0/index.json

# Version -> Latest Security Patch
PATCH_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["latest-security"].href')
echo "$PATCH_HREF"
# https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/8.0/8.0.21/index.json

# Patch -> CVE Details
CVE_HREF=$(curl -s "$PATCH_HREF" | jq -r '._links["cve-json"].href')
echo "$CVE_HREF"
# https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/8.0/8.0.21/cve.json

# Navigate back up: Patch -> Version
curl -s "$PATCH_HREF" | jq -r '._links["release-major"].href'
# https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/8.0/index.json
```

**Analysis:**

- `latest-security` jumps directly to the most recent security patch
- `release-major` navigates back up to the version index
- Bidirectional links enable traversal in any direction

---

## 5: Discover Timeline Navigation

**Query:** "How do I explore CVEs by date rather than version?"

The timeline index provides date-based navigation, complementing version-based navigation.

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"

# Root -> Timeline
TIMELINE_HREF=$(curl -s "$ROOT" | jq -r '._links["timeline-index"].href')
curl -s "$TIMELINE_HREF" | jq -r '._links | keys[]'
# latest
# latest-lts
# latest-year
# releases-index
# self

# Timeline -> Year
YEAR_HREF=$(curl -s "$TIMELINE_HREF" | jq -r '._links["latest-year"].href')
curl -s "$YEAR_HREF" | jq -r '._links | keys[]'
# latest-month
# latest-release
# latest-security-month
# prev
# self
# timeline-index

# Year -> Month
MONTH_HREF=$(curl -s "$YEAR_HREF" | jq -r '._links["latest-security-month"].href')
curl -s "$MONTH_HREF" | jq -r '._links | keys[]'
# cve-json
# manifest
# prev
# prev-security
# self
# timeline-index
# year-index
```

**Analysis:**

- Timeline provides an alternative entry point for date-based queries
- `prev-security` links skip non-security months for efficient traversal
- `latest-security-month` jumps directly to the most recent security content

---

## 6: Discover Documentation Links

**Query:** "What human-readable documentation is available?"

HAL indexes include links to rendered documentation alongside machine-readable data.

```bash
MANIFEST="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/10.0/manifest.json"

# What documentation links are available?
curl -s "$MANIFEST" | jq -r '._links | to_entries[] | select(.key | endswith("-rendered")) | .key'
# compatibility-rendered
# downloads-rendered
# release-blog-rendered
# supported-os-markdown-rendered
# usage-markdown-rendered
# whats-new-rendered

# Get the what's new documentation URL
curl -s "$MANIFEST" | jq -r '._links["whats-new-rendered"].href'
# https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview
```

**Analysis:**

- `-rendered` suffix indicates GitHub blob URLs (HTML view)
- `-markdown` suffix indicates raw markdown source
- Documentation links enable rich context without leaving the graph

---

## 7: Discover Link Naming Conventions

**Query:** "What patterns do link names follow?"

Link relation names follow consistent conventions that reveal their purpose.

| Suffix/Prefix | Meaning | Example |
|---------------|---------|---------|
| `-json` | Machine-readable JSON data | `cve-json`, `releases-json` |
| `-markdown` | Raw markdown source | `release-notes-markdown` |
| `-rendered` | HTML view (GitHub blob) | `release-notes-markdown-rendered` |
| `latest-` | Jump to most recent | `latest-security`, `latest-sdk` |
| `prev-` | Backward navigation | `prev-security`, `prev-year` |

```bash
# Find all "latest-" links in a version index
curl -s "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/10.0/index.json" | jq -r '._links | keys[] | select(startswith("latest-"))'
# latest-sdk
# latest-security

# Find all "-json" links in a manifest
curl -s "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/10.0/manifest.json" | jq -r '._links | keys[] | select(endswith("-json"))'
# os-packages-json
# supported-os-json
```

**Analysis:**

- Consistent naming makes links predictable without documentation
- Prefixes indicate navigation direction or recency
- Suffixes indicate content format
