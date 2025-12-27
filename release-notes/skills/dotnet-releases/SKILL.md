---
name: dotnet-releases
description: Query .NET release data, CVEs, breaking changes, EOL dates, and OS support.
workflows: https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/dotnet-releases/workflows.json
---

# .NET Release Graph

Machine-readable .NET release, CVE, and compatibility data via HAL hypermedia.

## Skill Routing

Pick ONE specialized skill based on your query:

| Query About | Skill |
|-------------|-------|
| CVEs, security, CVSS | [cve-queries](https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/cve-queries/SKILL.md) |
| Breaking changes, migration | [breaking-changes](https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/breaking-changes/SKILL.md) |
| EOL dates, LTS/STS | [version-eol](https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/version-eol/SKILL.md) |

Each skill points to workflows.json which has chained workflows with `next_workflow` transitions.

## Core Rules

1. Follow `_links` exactly — never construct URLs
2. Use `_embedded` data first — most queries need zero extra fetches
3. Match your query to a workflow, then follow its `follow_path`
4. Fetch multiple resources per turn when possible

## Date Queries — Check Before Fetching

### "Since X" / "After X" queries

```
query_date = parse(user's date)  // e.g., "November 2025" → 2025-11
latest = llms.json._embedded.patches[version].latest_security_patch_date

if query_date >= latest:
    Answer: "No security patch since {query_date}. Last was on {latest}."
    Stop — no timeline fetch needed.
```

If query_date < latest, fetch timeline. May cross year boundary — use `prev-year` links.

### "Between X and Y" / "From X to Y" queries

```
start = parse(start_date)  // e.g., "November 2024" → 2024-11
end = parse(end_date)      // e.g., "April 2025" → 2025-04

From year index _embedded.months[], filter BEFORE fetching:
  Only fetch cve-json where month >= start AND month <= end
```

May cross year boundary — follow `prev-year` links, don't fabricate URLs.

### "This month" / "This year" queries

Cannot cross year boundary. Use `latest-year` or `latest-security-disclosures` directly.

## Stop Criteria

| Need | Stop At | Has |
|------|---------|-----|
| Supported versions, patches | llms.json | `_embedded.patches["X.0"]` |
| Reference data (OS, TFM) | manifest.json | links to specialized JSON files |
| Downloads | downloads | component URLs |
