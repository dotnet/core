---
name: dotnet-releases
description: Query .NET release data, CVEs, breaking changes, EOL dates, and OS support.
---

# .NET Release Graph

Machine-readable .NET release, CVE, and compatibility data via HAL hypermedia.

## Entry Point

https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/llms.json

## Core Rules

1. **Follow `_links["..."].href` exactly** — never construct URLs
2. **Use `_embedded` data first** — answers most queries without extra fetches
3. **Don't fabricate** — report gaps

## llms.json Contents

| Property | Contains |
|----------|----------|
| `supported_releases` | Supported .NET versions |
| `_embedded.latest_patches[]` | Latest patch per version with EOL, CVE counts |
| `_links` | Navigation to indexes, timeline, security months |

## Skills

Fetch when your query matches. **Core Rules apply to all.**

| Skill | Fetch When |
|-------|------------|
| cve.md | CVE severity, CVSS, history |
| breaking-changes.md | Compatibility, migration |
| version-eol.md | EOL versions, lifecycle |
| os-support.md | Distros, packages, glibc |
| navigation.md | Multi-hop, unsure which links |
| schema.md | Document structure, properties |

Skills URL base: `https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/`

## Quick Answers (1 fetch)

From `llms.json._embedded.latest_patches[]`:
- Latest patch for .NET X → filter by `release`
- Is .NET X supported? → `supported`, `eol_date`
- CVE count → `cve_count`

## Navigation Shortcuts

From `_embedded.latest_patches[]._links`:

| Relation | Target |
|----------|--------|
| `release-manifest` | manifest.json (OS, breaking changes) |
| `latest-sdk` | SDK index |
| `latest-security` | Last security patch |

From `llms.json._links`:

| Relation | Target |
|----------|--------|
| `latest`, `latest-lts` | Newest release |
| `latest-security-month` | Current security month |
| `releases-index` | All versions including EOL |

**Non-existent relations:** `next` (use `prev`), `latest_sts` (use `latest`)
