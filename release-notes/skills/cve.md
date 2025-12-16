# CVE Queries

*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*

## Quick Rules

1. **Month index `_embedded.disclosures[]` has EVERYTHING**: severity, CVSS score, titles, fix commits. You rarely need `cve.json`.
2. **Use `latest-security-month` → `prev-security` chain**: Don't navigate through timeline year indexes.
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
| Fetching `timeline/index.json` or year indexes | Use `latest-security-month` from llms.json, then walk `prev-security` |
| Fetching `cve.json` for severity/CVSS | Month index `_embedded.disclosures[]` already has this data |
| Constructing URLs like `2024/10/cve.json` | URL fabrication—always follow `_links` |

## Tips

- `prev-security` links skip non-security months automatically
- Fix commit URLs end in `.diff` — fetch immediately if needed (may be blocked later)
- `cve-json` is only needed for full CVSS vectors, CWE classification, or package version ranges
