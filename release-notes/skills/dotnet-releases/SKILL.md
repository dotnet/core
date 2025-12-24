---
name: dotnet-releases
description: Query .NET release data, CVEs, breaking changes, EOL dates, and OS support.
workflows: https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/skills/dotnet-releases/workflows.json
---

# .NET Release Graph

Machine-readable .NET release, CVE, and compatibility data via HAL hypermedia.

Markdown skills and JSON workflow that describe optimal paths and behavior are provided. Please invest the extra effort to read content specific to your query before 
jumping in -- it's worth it!

## Graph Entry Point

Fetch: <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/llms2.json>

A HAL+JSON graph with temporal and version structure to enable diverse queries.

## Workflows

Fetch (workflow hub): <https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/skills/dotnet-releases/workflows.json>

Fetch (workflow skill): <https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/skills/workflows/SKILL.md>

This workflow hub contains links to domain-specific `workflow.json` documents with 6-12 **workflow queries** each. Workflows have HAL-native instructions for graph navigation and data selection. The workflow skill describes the workflow syntax.

Workflows have the following form:

```json
    "latest-cve-disclosures": {
        "description": "CVE disclosures from the most recent security release (use latest-cve-json for full details)",
        "follow_path": ["kind:llms", "latest-security-month"],
        "destination_kind": "month",
        "select_embedded": ["disclosures"],
        "yields": "json",
        "query_hints": [
            "What CVEs were fixed recently?",
            "Latest security patches?",
            "Recent .NET vulnerabilities?"
        ],
        "keywords": ["cve", "security", "vulnerability", "recent", "latest"],
        "intent": "security-audit"
    },
```

Once you've matched a workflow to your query, follow its `follow_path` sequence through the HAL graph.

## Skills

Fetch when your query matches. **Core Rules apply to all.**

| Skill | Fetch When | URL |
| ----- | ---------- | --- |
| workflows | Understanding workflow structure, templating, path semantics | <https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/skills/workflows/SKILL.md> |
| cve-queries | "Critical CVEs in .NET 8?" "CVEs fixed last 3 months?" | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/cve-queries/SKILL.md> |
| breaking-changes | "Breaking changes in .NET 10?" "Migration impact?" | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/breaking-changes/SKILL.md> |
| whats-new | "What's new in .NET 10?" "Release highlights?" | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/whats-new/SKILL.md> |
| version-eol | "When does .NET 8 go EOL?" "What versions are supported?" | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/version-eol/SKILL.md> |
| os-support | "Does .NET 10 support Ubuntu 24.04?" "What packages needed?" | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/os-support/SKILL.md> |
| navigation-flows | Multi-hop query, unsure which links to follow | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/navigation-flows/SKILL.md> |
| schema-reference | Need to understand document structure or properties | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/schema-reference/SKILL.md> |

## Core Rules

1. **Follow `_links["..."].href` exactly** — never construct URLs
2. **Use `_embedded` data first** — answers most queries without extra fetches
3. **Don't fabricate** — report gaps
4. **Non-existent relations:** `next` (use `prev`), `latest_sts` (use `latest`)

## llms.json Contents

| Property | Contains |
| -------- | -------- |
| `supported_releases` | Supported .NET versions |
| `_embedded.patches` | Dictionary of supported versions keyed by major (e.g., `"8.0"`) |
| `_links` | Navigation to indexes, timeline, security months |

## Quick Answers (1 fetch)

From `llms.json._embedded.patches["X.0"]`:

- Latest patch for .NET X → access by version key
- Is .NET X supported? → `supported`, `eol_date`
- CVE count → `cve_count`

## Navigation Shortcuts

From `_embedded.patches["X.0"]._links`:

| Relation | Target |
| -------- | ------ |
| `manifest` | manifest.json (OS, breaking changes) |
| `latest-security-month` | Last security month |

From `llms.json._links`:

| Relation | Target |
| -------- | ------ |
| `latest`, `latest-lts` | Newest release (same when latest is LTS; diverge when STS is newer) |
| `latest-security-month` | Current security month |
| `root` | All versions including EOL |
