# CVE Queries

*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*

## Quick Rules

1. **Month index `_embedded.disclosures[]` has EVERYTHING**: severity, CVSS score, titles, fix commits. You rarely need `cve.json`.
2. **Choose your strategy by query scope**: `prev-security` walk for recent CVEs, timeline hierarchy for historical analysis (see below).
3. `_embedded.latest_security_month[]` in llms.json has **counts and IDs only** — fetch the month index for details.

## Navigation Flow

```
llms.json
    │
    ├─► _embedded.latest_security_month[] ─► CVE counts, IDs (no severity)
    │
    └─► _links["latest-security-month"]
            │
            ▼
        month/index.json
            │
            ├─► _embedded.disclosures[] ─► severity, titles, fix commits
            │
            ├─► _links["cve-json"] ─► full CVSS vectors, CWE, packages
            │
            └─► _links["prev-security"] ─► previous security month
```

## Navigation Strategies

### Strategy 1: `prev-security` Walk (Recent CVEs)

Best for: Last 1-3 months, sequential certainty

```
llms.json → latest-security-month → prev-security → prev-security...
```

- One fetch per month (sequential)
- Guaranteed to hit only security months
- Simple, follows links exactly

### Strategy 2: Timeline Hierarchy (Historical Analysis)

Best for: 6-12+ months, broad trend analysis

```
llms.json → timeline/index.json
         → [parallel] 2024/index.json + 2025/index.json
         → [parallel] batch fetch cve.json for months with security: true
```

- Batch year indexes in one turn
- Batch multiple cve.json files in one turn
- 3-4 turns total vs N+1 for sequential walk
- Much more token-efficient for broad queries

Use year index `_embedded.months[]` to identify which months have `security: true`, then batch fetch those.

### Strategy 3: Version Hierarchy (Specific .NET Version)

Best for: "What CVEs affect .NET 8?" or version-specific queries

```
llms.json → _embedded.releases["8.0"]._links.self
         → 8.0/index.json → find security patches in _embedded.releases[]
         → [parallel] batch fetch patch index.json + timeline cve.json
```

- Go directly to the version you care about
- Patch indexes show which releases were security updates
- Can parallel fetch patch details and CVE data
- Most efficient when query targets a single .NET version

## Common Queries

### Critical CVEs this month (2 fetches)

1. Fetch `llms.json`
2. Follow `_links["latest-security-month"]` → month index
3. Filter `_embedded.disclosures[]` where `cvss_severity == "CRITICAL"`

### CVE history for .NET X (1 + N fetches)

1. Fetch `llms.json`
2. Follow `_links["latest-security-month"]`
3. Walk `_links["prev-security"]` until target date
4. Filter `_embedded.disclosures[]` by `affected_releases`

### Deep CVE analysis (3 fetches)

1. Fetch month index
2. Follow `_links["cve-json"]` for full details:
   - `cvss_vector` — full CVSS string
   - `cwe` — weakness classification
   - `packages[]` — affected NuGet packages with version ranges

## Disclosure Fields

Each `_embedded.disclosures[]` entry contains:

| Field | Description |
|-------|-------------|
| `id` | CVE identifier (e.g., CVE-2025-55315) |
| `title` | Vulnerability title |
| `cvss_score` | Numeric score (0-10) |
| `cvss_severity` | NONE, LOW, MEDIUM, HIGH, CRITICAL |
| `affected_releases` | Array of .NET versions (e.g., ["8.0", "9.0"]) |
| `fixes[]` | Commit diff URLs per release branch |

## Severity Levels

| Severity | CVSS Range |
|----------|------------|
| CRITICAL | 9.0 - 10.0 |
| HIGH | 7.0 - 8.9 |
| MEDIUM | 4.0 - 6.9 |
| LOW | 0.1 - 3.9 |
| NONE | 0.0 |

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| Using timeline hierarchy for 1-3 month queries | Overkill—use `prev-security` walk instead |
| Fetching `cve.json` for severity/CVSS | Month index `_embedded.disclosures[]` already has this data |
| Constructing month URLs without checking year index | Always check `_embedded.months[]` for `security: true` first |
| Fabricating intermediate month URLs | Trust `prev-security` links—they skip non-security months automatically |

## Tips

- `prev-security` links skip non-security months automatically
- Fix commit URLs end in `.diff` — fetch immediately if needed (may be blocked later)
- `cve-json` is only needed for full CVSS vectors, CWE classification, or package version ranges
