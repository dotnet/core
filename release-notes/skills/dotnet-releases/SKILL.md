---
name: dotnet-releases
description: Query .NET release data, CVEs, breaking changes, EOL dates, and OS support.
---

# .NET Release Graph

Machine-readable .NET release, CVE, and compatibility data via HAL hypermedia.

## Entry Point

<https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/llms.json>

## Skills

Fetch when your query matches. **Core Rules apply to all.**

| Skill | Fetch When | URL |
| ----- | ---------- | --- |
| cve-queries | "Critical CVEs in .NET 8?" "CVEs fixed last 3 months?" | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/cve-queries/SKILL.md> |
| breaking-changes | "Breaking changes in .NET 10?" "Migration impact?" | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/breaking-changes/SKILL.md> |
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
| `_embedded.latest_patches[]` | Latest patch per version with EOL, CVE counts |
| `_links` | Navigation to indexes, timeline, security months |

## Quick Answers (1 fetch)

From `llms.json._embedded.latest_patches[]`:

- Latest patch for .NET X → filter by `release`
- Is .NET X supported? → `supported`, `eol_date`
- CVE count → `cve_count`

## Navigation Shortcuts

From `_embedded.latest_patches[]._links`:

| Relation | Target |
| -------- | ------ |
| `release-manifest` | manifest.json (OS, breaking changes) |
| `latest-security` | Last security patch |

From `llms.json._links`:

| Relation | Target |
| -------- | ------ |
| `latest`, `latest-lts` | Newest release (same when latest is LTS; diverge when STS is newer) |
| `latest-security-month` | Current security month |
| `releases-index` | All versions including EOL |
