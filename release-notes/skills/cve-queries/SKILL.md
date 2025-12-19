---
name: cve-queries
description: CVE queries needing severity, CVSS, affected versions, or security history
---

# CVE Queries

## Stop Criteria

**STOP when you have the month index.** `_embedded.disclosures[]` contains severity, CVSS, titles, and fix commits. Only fetch `cve.json` for full CVSS vectors, CWE, or package version ranges.

## Navigation Flow

```
llms.json
    │
    └─► _links["latest-security-month"]
            │
            ▼
        month/index.json
            │
            ├─► _embedded.disclosures[] ─► severity, titles, fixes
            │
            ├─► _links["cve-json"] ─► full CVSS vectors, CWE
            │
            └─► _links["prev-security"] ─► previous security month
```

## Strategy Selection

"Last N months" = **calendar months**, not security releases. Security months are sparse.

| Query Scope | Strategy |
|-------------|----------|
| 1-3 months | `prev-security` walk from `latest-security-month` |
| 4+ months or explicit year | Year index with date filter |

### `prev-security` Walk (small scope)

```
llms.json → latest-security-month → prev-security → stop when date < cutoff
```

### Year Index (large scope)

```
llms.json → timeline-index → year index(es)
         → FILTER _embedded.months[] to date range + security: true
         → parallel fetch filtered set
```

**Filtering is mandatory.** Calculate cutoff date first. "Last 12 months" from Oct 2025 = Oct 2024 cutoff—exclude Jan-Sep 2024.

### Filtering by Version

Filter `_embedded.disclosures[]` by `affected_releases`:
```javascript
disclosures.filter(d => d.affected_releases.includes("8.0"))
```

Do NOT use version index for CVE queries—timeline path is more efficient.

## Common Queries

### Critical CVEs this month (2 fetches)

1. `llms.json` → `latest-security-month` → month index
2. Filter `_embedded.disclosures[]` where `cvss_severity == "CRITICAL"`

### CVEs in last N months (2-5 fetches)

**1-3 months:** Walk `prev-security` until date < cutoff
**4+ months:** Year index → filter months by date → parallel fetch

## Disclosure Fields

| Field | Description |
|-------|-------------|
| `id` | CVE identifier (CVE-2025-XXXXX) |
| `title` | Vulnerability title |
| `cvss_score` | 0-10 |
| `cvss_severity` | NONE, LOW, MEDIUM, HIGH, CRITICAL |
| `affected_releases` | Array: ["8.0", "9.0"] |
| `fixes[]` | Commit diff URLs (`.diff`) per release |

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| Fetching all `security: true` months | Calculate cutoff date first—exclude months before cutoff |
| Confusing "12 months" with "12 security releases" | Calendar months, not security months |
| Fetching `cve.json` for severity/CVSS | Month index already has this |
| Fabricating month or commit URLs | Use `_links` or `fixes[].href` |

## Tips

- `prev-security` auto-skips non-security months
- Fix URLs end in `.diff`—use directly
- `cve-json` only for CVSS vectors, CWE, or package ranges
