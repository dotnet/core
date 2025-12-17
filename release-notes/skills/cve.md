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

Choose based on query type:

| Query Type | Strategy | Why |
|------------|----------|-----|
| "Last N months" (bounded) | `prev-security` walk | Self-limiting, stops when done |
| "All CVEs in [year]" or multi-year | Year index batch | Parallel fetches for known scope |

### Strategy 1: `prev-security` Walk (Default)

**Use for:** Any "last N months" query, regardless of N

```
llms.json → latest-security-month → prev-security → prev-security... → stop after N months
```

- Self-limiting: you stop when you've collected enough months
- Works for 3 months or 12 months—just walk until done
- No risk of over-fetching

**Example:** "Last 12 months" = start at latest-security-month, walk `prev-security` until you've covered 12 calendar months, stop.

### Strategy 2: Year Index Batch

**Use ONLY for:** "All CVEs in 2024" or "CVEs from 2023-2025" (explicit year scope)

```
llms.json → timeline-index → year index
         → batch fetch month indexes where security: true
```

- Appropriate when query explicitly names years
- Fetch all security months within those years
- NOT for "last N months" queries (use walk instead)

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

Example:

```json
{
  "id": "CVE-2025-55315",
  "title": ".NET Security Feature Bypass Vulnerability",
  "cvss_score": 9.9,
  "cvss_severity": "CRITICAL",
  "affected_releases": ["8.0", "9.0", "10.0"],
  "fixes": [
    { "href": "https://github.com/dotnet/aspnetcore/commit/abc123.diff", "release": "8.0" },
    { "href": "https://github.com/dotnet/aspnetcore/commit/def456.diff", "release": "9.0" }
  ]
}
```

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
| Using year index batch for "last N months" queries | Use `prev-security` walk instead—it self-limits |
| Fetching all security months from year indexes | Year index batch is for explicit year queries ("all of 2024"), not "last 12 months" |
| Fetching `cve.json` for severity/CVSS | Month index `_embedded.disclosures[]` already has this data |
| Constructing month URLs without checking year index | Always check `_embedded.months[]` for `security: true` first |
| Fabricating intermediate month URLs | Trust `prev-security` links—they skip non-security months automatically |
| Fabricating GitHub commit URLs | Use `fixes[].href` from disclosures—already formatted as `.diff` URLs |

## Tips

- `prev-security` links skip non-security months automatically
- Fix commit URLs end in `.diff` — fetch immediately if needed (may be blocked later)
- `cve-json` is only needed for full CVSS vectors, CWE classification, or package version ranges
