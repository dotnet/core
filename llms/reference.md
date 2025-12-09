# .NET Release Metadata Graph — Extended Reference

This document provides detailed workflows, schema examples, and operational guidance for AI assistants working with the .NET release metadata graph.

For quick reference, see [llms.txt](https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/llms.txt).

## Entry Points

| Query Type | Entry Point |
|------------|-------------|
| Single-version queries | `https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/index.json` |
| Time-range queries | `https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/timeline/index.json` |

**CRITICAL**: Never construct URLs manually. Always follow `_links["..."].href` values from JSON responses.

Reference:

* [Glossary](https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/llms/glossary.md) — release types, support phases
* [Vocabulary](https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/llms/vocabulary.md) — all properties, link relations, enums

## Common Workflows

| Task | Path |
|------|------|
| Latest release | `index.json` → `_links["latest"].href` |
| Latest LTS | `index.json` → `_links["latest-lts"].href` |
| Version patches | `index.json` → version → `_embedded.releases[]` |
| Security patches | `10.0/index.json` → `_links["latest-security"].href` |
| CVEs for version | `10.0/index.json` → `_embedded.releases[]` where `security: true` |
| CVEs for patch | `10.0/10.0.1/index.json` → `_embedded.disclosures[]` |
| CVEs by month | `timeline/index.json` → year → month → `_embedded.disclosures[]` |
| **CVEs since date** | `timeline/index.json` → year → `latest-security-month` → follow `prev-security` until target date → filter `_embedded.disclosures[]` by `affected_releases` |
| Breaking changes | `10.0/index.json` → `_links["compatibility-json"].href` |
| SDK downloads | `10.0/sdk/index.json` |
| OS support | `10.0/manifest.json` → `_links["supported-os-json"].href` |

## Discovering Resource Schema

HAL resources are self-describing. If you're unsure what's available, inspect the resource:

```bash
# Quick: list available link relations
jq '._links | keys[]'

# Full: discover properties, links, and embedded resources
jq '{
  properties: [to_entries[] | select(.key | startswith("_") | not) | "\(.key) (\(.value | type))"],
  links: [._links | keys[]],
  embedded: [._embedded | keys[]]
}'
```

Example output for a patch index:
```json
{
  "properties": ["kind (string)", "version (string)", "date (string)", "security (boolean)", "cve_count (number)", "cve_records (array)"],
  "links": ["cve-json", "prev", "prev-security", "release-major", "release-month", "self"],
  "embedded": ["disclosures", "sdk_feature_bands", "sdk_release"]
}
```

### Link Relations by Resource Type

**Root index** (`index.json`):
- `latest`, `latest-lts` — jump to current releases
- `timeline-index` — switch to time-based navigation
- `llms-txt` — LLM quick reference

**Major version** (`10.0/index.json`):
- `latest`, `latest-security` — jump to patches
- `compatibility-json` — breaking changes
- `downloads`, `latest-sdk` — SDK information
- `target-frameworks-json` — TFM data

**Patch release** (`10.0/10.0.1/index.json`):
- `prev`, `prev-security` — backward navigation
- `cve-json`, `cve-markdown` — CVE details
- `release-major`, `release-month` — context navigation

**Manifest** (`10.0/manifest.json`):
- `os-packages-json`, `supported-os-json` — OS dependencies
- `*-rendered` suffixes — GitHub HTML views

### Naming Conventions

Link relation names are self-documenting:
- `-json` suffix → machine-readable data file
- `-markdown` suffix → raw markdown source
- `-rendered` suffix → HTML view on GitHub
- `prev-` prefix → backward navigation
- `latest-` prefix → jump to most recent

## Schema Examples

### Releases Index (`index.json`)

```json
{
  "kind": "releases-index",
  "latest": "10.0",
  "latest_lts": "10.0",
  "_links": {
    "self": {
      "href": ".../release-notes/index.json",
      "type": "application/hal+json"
    },
    "latest": {
      "href": ".../release-notes/10.0/index.json",
      "title": "Latest .NET release (.NET 10.0)"
    },
    "latest-lts": {
      "href": ".../release-notes/10.0/index.json",
      "title": "Latest LTS release (.NET 10.0)"
    },
    "timeline-index": {
      "href": ".../release-notes/timeline/index.json"
    }
  },
  "_embedded": {
    "releases": [
      {
        "version": "10.0",
        "release_type": "lts",
        "supported": true,
        "eol_date": "2028-11-14T00:00:00+00:00",
        "_links": {
          "self": {
            "href": ".../release-notes/10.0/index.json",
            "title": ".NET 10.0",
            "type": "application/hal+json"
          }
        }
      }
    ]
  }
}
```

### Major Version Index (`10.0/index.json`)

```json
{
  "kind": "major-version-index",
  "latest": "10.0.1",
  "latest_security": "10.0.1",
  "support_phase": "active",
  "supported": true,
  "release_type": "lts",
  "ga_date": "2025-11-11T00:00:00+00:00",
  "eol_date": "2028-11-14T00:00:00+00:00",
  "_links": {
    "self": { "href": ".../10.0/index.json" },
    "latest": { "href": ".../10.0/10.0.1/index.json" },
    "latest-security": { "href": ".../10.0/10.0.1/index.json" },
    "compatibility-json": { "href": ".../10.0/compatibility.json" },
    "release-manifest": { "href": ".../10.0/manifest.json" },
    "releases-index": { "href": ".../index.json" }
  },
  "_embedded": {
    "releases": [
      {
        "version": "10.0.1",
        "date": "2025-12-09T00:00:00+00:00",
        "security": true,
        "cve_count": 3,
        "support_phase": "active",
        "_links": {
          "self": { "href": ".../10.0/10.0.1/index.json" },
          "release-month": { "href": ".../timeline/2025/12/index.json" }
        }
      }
    ]
  }
}
```

### Patch Index (`10.0/10.0.1/index.json`)

```json
{
  "kind": "patch-version-index",
  "version": "10.0.1",
  "date": "2025-12-09T00:00:00+00:00",
  "security": true,
  "cve_count": 3,
  "support_phase": "active",
  "_links": {
    "self": { "href": ".../10.0/10.0.1/index.json" },
    "prev": { "href": ".../10.0/10.0.0/index.json" },
    "cve-json": { "href": ".../timeline/2025/12/cve.json" },
    "release-month": { "href": ".../timeline/2025/12/index.json" }
  },
  "_embedded": {
    "disclosures": [
      {
        "id": "CVE-2025-12345",
        "title": ".NET Remote Code Execution Vulnerability",
        "cvss_score": 8.1,
        "cvss_severity": "HIGH",
        "disclosure_date": "2025-12-09",
        "affected_releases": ["10.0", "9.0"],
        "affected_products": ["dotnet-runtime"],
        "fixes": [
          {
            "href": "https://github.com/dotnet/runtime/commit/abc123.diff",
            "repo": "dotnet/runtime",
            "branch": "release/10.0",
            "release": "10.0"
          }
        ],
        "_links": {
          "self": { "href": "https://github.com/dotnet/announcements/issues/999" }
        }
      }
    ]
  }
}
```

### Timeline Index (`timeline/index.json`)

```json
{
  "kind": "timeline-index",
  "latest": "10.0",
  "latest_lts": "10.0",
  "latest_year": "2025",
  "_links": {
    "self": { "href": ".../timeline/index.json" },
    "releases-index": { "href": ".../index.json" }
  },
  "_embedded": {
    "years": [
      {
        "year": "2025",
        "releases": ["10.0", "9.0", "8.0"],
        "_links": {
          "self": { "href": ".../timeline/2025/index.json" }
        }
      }
    ]
  }
}
```

### Month Index (`timeline/2025/01/index.json`)

```json
{
  "kind": "month-index",
  "year": "2025",
  "month": "01",
  "security": true,
  "cve_count": 4,
  "cve_records": ["CVE-2025-21171", "CVE-2025-21172", "CVE-2025-21173", "CVE-2025-21176"],
  "_links": {
    "self": { "href": ".../timeline/2025/01/index.json" },
    "prev": { "href": ".../timeline/2024/12/index.json" },
    "prev-security": { "href": ".../timeline/2024/11/index.json" },
    "cve-json": { "href": ".../timeline/2025/01/cve.json" }
  },
  "_embedded": {
    "disclosures": [
      {
        "id": "CVE-2025-21171",
        "title": ".NET Remote Code Execution Vulnerability",
        "cvss_score": 7.5,
        "cvss_severity": "HIGH",
        "affected_releases": ["9.0"],
        "affected_products": ["dotnet-runtime"],
        "fixes": [
          {
            "href": "https://github.com/dotnet/runtime/commit/9da8c6a.diff",
            "repo": "dotnet/runtime",
            "branch": "release/9.0"
          }
        ]
      }
    ]
  }
}
```

### CVE JSON (`timeline/2025/01/cve.json`)

The CVE JSON file provides full details and pre-computed query dictionaries:

```json
{
  "title": "CVE data for January 2025",
  "last_updated": "2025-01-14T00:00:00+00:00",

  "disclosures": [
    {
      "id": "CVE-2025-21171",
      "problem": ".NET Remote Code Execution Vulnerability",
      "description": ["Full vulnerability description..."],
      "cvss": {
        "score": 7.5,
        "severity": "HIGH",
        "vector": "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:H"
      },
      "weakness": "CWE-122",
      "mitigation": ["Upgrade to .NET 9.0.1 or later"]
    }
  ],

  "products": [
    {
      "cve_id": "CVE-2025-21171",
      "name": "dotnet-runtime",
      "fixed": "9.0.1",
      "min_vulnerable": "9.0.0",
      "max_vulnerable": "9.0.0",
      "commits": ["9da8c6a4a6ea03054e776275d3fd5c752897842e"]
    }
  ],

  "packages": [
    {
      "cve_id": "CVE-2025-21172",
      "name": "System.Text.Json",
      "fixed": "9.0.1",
      "min_vulnerable": "9.0.0",
      "max_vulnerable": "9.0.0"
    }
  ],

  "commits": {
    "9da8c6a4a6ea03054e776275d3fd5c752897842e": {
      "repo": "runtime",
      "branch": "release/9.0",
      "url": "https://github.com/dotnet/runtime/commit/9da8c6a4a6ea03054e776275d3fd5c752897842e.diff"
    }
  },

  "product_cves": {
    "dotnet-runtime": ["CVE-2025-21171", "CVE-2025-21172", "CVE-2025-21176"],
    "dotnet-sdk": ["CVE-2025-21173"]
  },

  "package_cves": {
    "System.Text.Json": ["CVE-2025-21172"]
  },

  "release_cves": {
    "8.0": ["CVE-2025-21172", "CVE-2025-21173", "CVE-2025-21176"],
    "9.0": ["CVE-2025-21171", "CVE-2025-21172", "CVE-2025-21173", "CVE-2025-21176"]
  },

  "severity_cves": {
    "CRITICAL": [],
    "HIGH": ["CVE-2025-21171", "CVE-2025-21172", "CVE-2025-21173", "CVE-2025-21176"],
    "MEDIUM": [],
    "LOW": []
  },

  "cve_releases": {
    "CVE-2025-21171": ["9.0"],
    "CVE-2025-21172": ["8.0", "9.0"]
  },

  "cve_commits": {
    "CVE-2025-21171": ["9da8c6a4a6ea03054e776275d3fd5c752897842e"],
    "CVE-2025-21172": ["32d8ea6eecf7f192a75162645390847b14b56dbb", "89ef51c5d8f5239345127a1e282e11036e590c8b"]
  }
}
```

### Compatibility JSON (`10.0/compatibility.json`)

```json
{
  "title": ".NET 10.0 Breaking Changes",
  "version": "10.0",
  "breaking_change_count": 83,
  "last_updated": "2025-12-01T00:00:00+00:00",

  "categories": ["sdk", "core-libraries", "aspnet-core", "cryptography", "extensions", "windows-forms"],

  "impact_breakdown": {
    "high": 12,
    "medium": 45,
    "low": 26
  },

  "type_breakdown": {
    "source-incompatible": 35,
    "binary-incompatible": 18,
    "behavioral": 30
  },

  "breaks": [
    {
      "id": "aspnet-core-10-apidescription-client-deprecated",
      "title": "Microsoft.Extensions.ApiDescription.Client package deprecated",
      "category": "aspnet-core",
      "type": "source-incompatible",
      "version_introduced": "10.0-preview.7",
      "impact": "medium",
      "description": "The Microsoft.Extensions.ApiDescription.Client package has been deprecated...",
      "required_action": "Remove any PackageReference to Microsoft.Extensions.ApiDescription.Client...",
      "affected_apis": ["OpenApiReference", "OpenApiProjectReference", "dotnet openapi"],
      "references": [
        {
          "type": "documentation",
          "url": "https://learn.microsoft.com/dotnet/core/compatibility/aspnet-core/10/apidescription-client-deprecated",
          "title": "Breaking change documentation"
        },
        {
          "type": "documentation-source",
          "url": "https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/aspnet-core/10/apidescription-client-deprecated.md",
          "title": "Documentation source (markdown)"
        },
        {
          "type": "announcement",
          "url": "https://github.com/aspnet/Announcements/issues/518",
          "title": "GitHub announcement"
        }
      ]
    }
  ]
}
```

### Manifest JSON (`10.0/manifest.json`)

```json
{
  "kind": "release-manifest",
  "version": "10.0",
  "title": ".NET 10.0",
  "label": ".NET 10",
  "release_type": "lts",
  "support_phase": "active",
  "supported": true,
  "ga_date": "2025-11-11T00:00:00+00:00",
  "eol_date": "2028-11-14T00:00:00+00:00",
  "_links": {
    "self": { "href": ".../10.0/manifest.json" },
    "whats-new-rendered": {
      "href": "https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview",
      "title": "What's new in .NET 10"
    },
    "downloads-rendered": {
      "href": "https://dotnet.microsoft.com/download/dotnet/10.0",
      "title": "Download .NET 10.0"
    },
    "release-blog-rendered": {
      "href": "https://devblogs.microsoft.com/dotnet/announcing-dotnet-10/",
      "title": ".NET 10 announcement blog"
    },
    "supported-os-json": {
      "href": ".../10.0/supported-os.json",
      "title": "Supported operating systems"
    },
    "supported-os-markdown": {
      "href": ".../10.0/supported-os.md",
      "title": "Supported OS (markdown)"
    },
    "compatibility-rendered": {
      "href": "https://learn.microsoft.com/dotnet/core/compatibility/10.0",
      "title": "Breaking changes in .NET 10"
    },
    "os-packages-json": {
      "href": ".../10.0/os-packages.json",
      "title": "OS package dependencies"
    },
    "releases-json": {
      "href": "https://builds.dotnet.microsoft.com/dotnet/release-metadata/10.0/releases.json",
      "title": "Legacy releases.json (download URLs)"
    }
  }
}
```

## CVE Analysis Workflows

### Version-Centric (for version/patch queries)

1. GET `index.json` → navigate to major version (e.g., `10.0/index.json`)
2. View embedded CVE summaries in `_embedded.releases[]` where `security: true`
3. Find latest security patch: `_links["latest-security"].href`
4. Navigate to patch index → **full details in `_embedded.disclosures[]`**
5. For package-level details or commit diffs: `_links["cve-json"].href`
6. **Always ask**: "Would you like inline diffs for these fixes?"
7. If yes: **Fetch immediately** — use `commits[hash].url` (already `.diff` format)

### Time-Centric (for date-range queries)

**For "CVEs since [date]" queries** (with or without version filter), use `prev-security` to walk backwards:

1. GET `timeline/index.json` → `_links["latest-year"]` → `_links["latest-security-month"].href`
2. Follow `prev-security` links until month is before target date
3. Each month has `_embedded.disclosures[]` with severity, title, affected versions, fix commits
4. Filter by `affected_releases` if user specified versions
5. Only fetch `cve.json` for CVSS vectors, CWE, or package version ranges
6. **Always ask**: "Would you like inline diffs for these fixes?"
7. If yes: **Fetch immediately** — firewall or domain restrictions may block later access

The `prev-security` links are pre-computed at publish time and cross year boundaries automatically (e.g., `2025/01` → `2024/11`). Following them is O(security-months), not O(all-months). Once you have the first month, no additional year index fetches are needed.

**Anti-pattern:** Do not fetch multiple year indexes to inspect `_embedded.months[]` and plan which months to fetch. The `prev-security` chain crosses year boundaries automatically — just follow it.

Example traversal for "CVEs since September 2024":

```text
Timeline Index (1)
  → latest-year → 2025/index.json (2)
  → latest-security-month → 2025/10/index.json (3) ✓
  → prev-security → 2025/06 (4) ✓
  → prev-security → 2025/04 (5) ✓
  → prev-security → 2025/01 (6) ✓
  → prev-security → 2024/11 (7) ✓  (crosses year boundary automatically)
  → prev-security → 2024/10 (8) ✓
  → prev-security → 2024/08 (before Sept, STOP)

Total: 8 fetches (2 indexes + 6 security months)
```

**Expected fetch counts** (for self-assessment):

* "Latest patch for .NET X": 2–3 fetches
* "CVEs since [date]": 2 + number of security months in range (Timeline Index + Year Index + months)
* "CVEs for specific patch": 2–3 fetches

If your count significantly exceeds these, you may be navigating inefficiently.

**For specific month queries**, navigate directly:

1. GET `timeline/index.json` → navigate to year → navigate to month
2. View CVEs inline: `_embedded.disclosures[]` has full details

### Diff Retrieval (IMPORTANT)

Always fetch all provided diff URLs immediately when analyzing CVEs. Do not defer.

GitHub commit URLs support multiple formats:
- **`.diff`** — Raw unified diff (best for code analysis)
- **`.patch`** — Git patch with commit message (best for context)
- **(no extension)** — Web view (for humans)

The graph provides `.diff` URLs by default in `commits[hash].url`.

## Breaking Changes Workflow

1. GET `index.json` → navigate to major version
2. Follow `_links["compatibility-json"].href`
3. Use pre-computed rollups for overview:
   - `categories` — list of all categories
   - `impact_breakdown` — count by impact level
   - `type_breakdown` — count by change type
4. Filter `breaks[]` by `category`, `impact`, or `type`
5. For migration guidance: check `required_action` field
6. For raw documentation: filter `references[]` by `type: "documentation-source"`

## CVE JSON Quick Queries

```bash
# Get all CVE IDs
jq -r '.disclosures[].id' cve.json

# CVEs for .NET 9.0
jq -r '.release_cves["9.0"][]' cve.json

# CVEs affecting .NET Runtime product
jq -r '.product_cves["dotnet-runtime"][]' cve.json

# CVEs affecting a specific package
jq -r '.package_cves["System.Text.Json"][]' cve.json

# Commits for specific CVE
jq -r '. as $root | .cve_commits["CVE-2025-21171"][] | $root.commits[.].url' cve.json

# HIGH severity only
jq -r '.severity_cves["HIGH"][]' cve.json

# Full disclosure for a CVE
jq '.disclosures[] | select(.id == "CVE-2025-21171")' cve.json
```

## Breaking Changes Quick Queries

```bash
# Count by category
jq -r '[.breaks[].category] | group_by(.) | map({category: .[0], count: length}) | sort_by(-.count) | .[] | "\(.category): \(.count)"' compatibility.json

# Filter by category
jq -r '.breaks[] | select(.category == "core-libraries") | .title' compatibility.json

# HIGH impact only
jq -r '.breaks[] | select(.impact == "high") | "\(.category): \(.title)"' compatibility.json

# Get documentation source URLs for a category
jq -r '.breaks[] | select(.category == "sdk") | .references[] | select(.type == "documentation-source") | .url' compatibility.json
```

## HAL Links Reference (`_links`)

### Navigation

| Link | Purpose |
|------|---------|
| `self` | Current document |
| `prev` | Previous in sequence (patches, months, years) |
| `prev-security` | Previous security release in sequence |

### Version Navigation

| Link | Purpose |
|------|---------|
| `latest` | Most recent release |
| `latest-lts` | Most recent LTS release |
| `latest-security` | Most recent security patch |
| `latest-patch` | Latest patch for a major version |
| `releases-index` | Root releases index |

### Timeline Navigation

| Link | Purpose |
|------|---------|
| `timeline-index` | Root timeline index |
| `year-index` | Parent year index |
| `latest-year` | Most recent year index |
| `latest-month` | Most recent month index |
| `latest-security-month` | Most recent month with security releases |
| `release-month` | Timeline month for a patch |

### Cross-Links

| Link | Purpose |
|------|---------|
| `releases-index` | From timeline to releases |
| `release-major` | Parent major version index |
| `release-patch` | Patch index for an SDK release |

### Resources

| Link | Purpose |
|------|---------|
| `compatibility-json` | Breaking changes data |
| `release-manifest` | External resource links |
| `cve-json` | Full CVE details |
| `supported-os-json` | OS support matrix |
| `downloads` | Downloads index for binaries |
| `release-json` | Full release information |
| `release-notes-markdown` | Release notes (Markdown) |

### Link Properties

- **`href`** — URL (always follow this, never construct)
- **`path`** — Relative path within repo
- **`title`** — Human-readable description
- **`type`** — Media type (`application/hal+json`, `application/json`)

## Key Properties Reference

Properties that appear frequently across index types:

### Filtering

| Property | Type | Purpose |
|----------|------|---------|
| `supported` | boolean | Version is currently receiving updates |
| `security` | boolean | Release includes security fixes |
| `release_type` | enum | `lts` or `sts` |
| `support_phase` | enum | `active`, `maintenance`, `eol`, `preview`, `go-live` |

### Versioning

| Property | Type | Purpose |
|----------|------|---------|
| `latest` | string | Latest version in context |
| `latest_lts` | string | Latest LTS version |
| `latest_security` | string | Latest security patch version |
| `latest_release` | string | Latest major version in time period |

### Dates

| Property | Type | Purpose |
|----------|------|---------|
| `date` | ISO 8601 | Release date |
| `ga_date` | ISO 8601 | General Availability date |
| `eol_date` | ISO 8601 | End of Life date |

### CVE

| Property | Type | Purpose |
|----------|------|---------|
| `cve_count` | integer | Number of CVEs in release |
| `cve_records` | array | CVE identifiers (e.g., `["CVE-2025-21172"]`) |

## Response Templates

**Opening**:

```text
"Here's what I found in .NET release notes..."
```

**CVE follow-up** (mandatory):

```text
[After listing CVEs]
"Would you like inline diffs for these fixes?"
```

**Diff analysis**:

```text
"Here are the commit URLs (diff format, ready for analysis):
- https://github.com/dotnet/runtime/commit/abc123.diff
Note: Change '.diff' to '.patch' for commit message, or remove for web view"
```

**Breaking changes follow-up**:

```text
[After listing breaking changes]
"Would you like the raw documentation markdown for migration guidance?"
```

## Error Handling

- **404 on JSON**: Resource may not exist for that version
- **Malformed JSON**: Skip resource, continue with workflow
- **GitHub access denied**: Provide URL to user for manual paste
- **Missing fields**: Check existence before accessing; schema evolves

## Performance Tips

- Follow HAL `_links["..."].href` values — never construct URLs
- Embedded data (`_embedded`) often has what you need without additional requests
- Use query dictionaries in `cve.json` instead of iterating arrays
- Use rollup fields in `compatibility.json` (`impact_breakdown`, etc.) for summaries
- Files are CDN-optimized and cache-friendly
