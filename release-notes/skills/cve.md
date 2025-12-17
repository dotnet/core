# CVE Queries

*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*

## Quick Rules

1. **Month index `_embedded.disclosures[]` has EVERYTHING**: severity, CVSS score, titles, fix commits. You rarely need `cve.json`.
2. **Choose your strategy by query scope**: `prev-security` walk for recent CVEs, timeline hierarchy for historical analysis (see below).

## Navigation Flow

```
llms.json
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

Choose based on time range:

| Time Range | Strategy | Why |
|------------|----------|-----|
| 1-3 months | `prev-security` walk | Simple, 2-4 fetches |
| 4+ months or full year | Year index batch | Parallel fetches, fewer turns |

### Strategy 1: `prev-security` Walk

Best for: **1-3 months**

```
llms.json → latest-security-month → prev-security → prev-security...
```

- One fetch per security month (sequential)
- 2-4 total fetches for typical queries
- Simple, follows links exactly

### Strategy 2: Year Index Batch

Best for: **4+ months, full year, or multi-year analysis**

```
llms.json → timeline-index → year index
         → [parallel] batch fetch month indexes where security: true
```

- Fetch year index to see all months with `security: true`
- Batch fetch all relevant month indexes in one turn
- 3 turns total regardless of month count
- Much more efficient for broad queries

Use `_embedded.months[]` to identify which months have `security: true`, then batch fetch those month indexes (or their `cve-json` links if you need CVSS vectors/CWE).

### Filtering by Version

For "CVEs affecting .NET X", use either strategy above and filter `_embedded.disclosures[]` by `affected_releases`:

```javascript
disclosures.filter(d => d.affected_releases.includes("8.0"))
```

Do NOT navigate to the version index (e.g., `8.0/index.json`) for CVE queries—the timeline path with filtering is more efficient.

## Common Queries

### Critical CVEs this month (2 fetches)

1. Fetch `llms.json`
2. Follow `_links["latest-security-month"]` → month index
3. Filter `_embedded.disclosures[]` where `cvss_severity == "CRITICAL"`

### CVEs for .NET X in last N months (2-4 fetches)

1. Fetch `llms.json`
2. Follow `_links["latest-security-month"]` → month index
3. Filter `_embedded.disclosures[]` where `affected_releases` contains "X.0"
4. Walk `_links["prev-security"]` for N months, filtering each
5. For code fixes: use `fixes[].href` directly (already `.diff` URLs)

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
| Using year index batch for 1-3 month queries | Overkill—use `prev-security` walk instead |
| Using `prev-security` walk for 4+ months | Inefficient—use year index batch with parallel fetches |
| Fetching `cve.json` for severity/CVSS | Month index `_embedded.disclosures[]` already has this data |
| Constructing month URLs without checking year index | Always check `_embedded.months[]` for `security: true` first |
| Fabricating intermediate month URLs | Trust `prev-security` links—they skip non-security months automatically |
| Fabricating GitHub commit URLs | Use `fixes[].href` from disclosures—already formatted as `.diff` URLs |

## Tips

- `prev-security` links skip non-security months automatically
- Fix commit URLs end in `.diff` — fetch immediately if needed (may be blocked later)
- `cve-json` is only needed for full CVSS vectors, CWE classification, or package version ranges
