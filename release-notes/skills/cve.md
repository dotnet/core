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

**Important:** "Last N months" means **calendar months** from today, not "N security releases." Security months are sparse—there may be only 9 security months in a 12-calendar-month window.

Choose based on query scope:

| Query Type | Strategy | Why |
|------------|----------|-----|
| "Last 1-3 months" | `prev-security` walk | Low overhead, few fetches |
| "Last 4+ months" | Year index with date filter | Parallel fetches, fewer round trips |
| "All CVEs in [year]" | Year index batch | Known scope, parallel fetches |

### Strategy 1: `prev-security` Walk

**Use for:** Small scope (1-3 calendar months)

```
llms.json → latest-security-month → prev-security → stop when date < cutoff
```

- Sequential but low overhead for small N
- Stop when month date falls before your cutoff date

### Strategy 2: Year Index with Date Filter

**Use for:** Larger scope (4+ calendar months) or explicit year queries

```
llms.json → timeline-index → year index(es)
         → filter _embedded.months[] by date range AND security: true
         → parallel fetch only the months you need
```

**Critical:** Filter to your date range—don't fetch entire years when only part is needed.

**Example:** "Last 12 months" query, today is Oct 2025:
1. Fetch 2024 and 2025 year indexes
2. Filter to months where `security: true` AND date >= Oct 2024
3. Parallel fetch those month indexes (typically 8-10 fetches in one turn)

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

### CVEs for .NET X in last N months (3-5 fetches)

**For 1-3 months:** Use `prev-security` walk
1. Fetch `llms.json` → follow `latest-security-month`
2. Walk `prev-security` until date < cutoff, filtering by `affected_releases`

**For 4+ months:** Use year index with date filter
1. Fetch `llms.json` → follow `timeline-index` → fetch relevant year index(es)
2. Filter `_embedded.months[]` to date range + `security: true`
3. Parallel fetch those month indexes
4. Filter `_embedded.disclosures[]` where `affected_releases` contains "X.0"
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
| Fetching ALL months from year indexes | Filter by date range first—"last 12 months" doesn't need all of 2024 |
| Confusing "12 months" with "12 security releases" | Calendar months, not security months—filter by date, not count |
| Fetching `cve.json` for severity/CVSS | Month index `_embedded.disclosures[]` already has this data |
| Constructing month URLs without checking year index | Always check `_embedded.months[]` for `security: true` first |
| Fabricating intermediate month URLs | Use `_links` from year index or `prev-security` links |
| Fabricating GitHub commit URLs | Use `fixes[].href` from disclosures—already formatted as `.diff` URLs |

## Tips

- `prev-security` links skip non-security months automatically
- Fix commit URLs end in `.diff` — fetch immediately if needed (may be blocked later)
- `cve-json` is only needed for full CVSS vectors, CWE classification, or package version ranges
