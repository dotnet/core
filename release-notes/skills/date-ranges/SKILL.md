---
name: date-ranges
description: Date comparisons and range calculations for security/release queries
---

# Date Ranges

Pre-process date queries before graph navigation. Most "since X" or "last N" queries can be answered from embedded data without timeline fetches.

## Date Fields in Graph

### Version Chain (llms.json → major → patch)

| Location | Field | Meaning |
|----------|-------|---------|
| llms.json | `latest_security_patch_date` | Most recent security patch (any version) |
| llms.json._embedded.patches[v] | `latest_security_patch_date` | Most recent security patch for version v |
| major/index.json | `latest_security_patch_date` | Same as above (redundant, authoritative) |
| patch/index.json | `prev_security_patch_date` | Previous security patch before this one |

### Timeline Chain (llms.json → year → month)

| Location | Field | Meaning |
|----------|-------|---------|
| llms.json | `latest_security_patch_date` | Most recent security release date |
| month/index.json | `prev_security_month_date` | Previous security month before this one |

## Decision Logic

### "Has there been a security patch since X?"

```
query_date = parse(X)  // e.g., "November 2025" → 2025-11-01
latest = llms.json._embedded.patches[version].latest_security_patch_date

if query_date >= latest:
    return "No security patch since {X}. Last was {latest}."
else:
    return "Yes, {latest_security_patch} on {latest}."
    // Optionally fetch CVE details if requested
```

**No timeline fetch needed** for this comparison.

### "What security patches in last N months?"

```
today = 2025-12-26
cutoff = today - N months  // e.g., 3 months → 2025-09-26

if cutoff is within current year:
    // Use llms.json → latest-security-disclosures → walk prev-security-month
else:
    // Cross-year: fetch year indexes sequentially
```

### "CVEs between date X and Y?"

```
start = parse(X)
end = parse(Y)
months_span = (end.year - start.year) * 12 + (end.month - start.month)

if months_span <= 3:
    workflow: cve-history.small-range
else:
    workflow: cve-history.large-range
```

## Equivalence Relations

These dates should always match:

| Source A | Source B | Relation |
|----------|----------|----------|
| llms.json.patches[v].latest_security_patch_date | v/index.json.latest_security_patch_date | Equal |
| v/index.json.latest_security_patch | v/{patch}/index.json.version | Points to |
| patch.prev_security_patch_date | timeline month.prev_security_month_date | Equal (same release) |

Use these equivalences to validate data or short-circuit fetches.

## Routing Table

| Query Pattern | Compare To | Fetch? |
|--------------|------------|--------|
| "since {month} {year}" | latest_security_patch_date | Only if query_date < latest |
| "last N months" | Calculate cutoff, compare | Timeline if N > 0 security months |
| "in {year}" | Year index | Year → filter months |
| "between X and Y" | Calculate span | small-range or large-range |
| "latest security patch" | llms.json | No fetch needed |

## Common Mistakes

| Mistake | Why Wrong |
|---------|-----------|
| Fetching timeline to verify "nothing since X" | Just compare X to latest_security_patch_date |
| Walking all months for "last 3 months" | Only security months matter—use prev_security_month |
| Fetching both version and timeline chains | Pick one based on query (version-specific vs time-based) |
