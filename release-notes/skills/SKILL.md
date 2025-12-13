---
name: dotnet-releases
description: Query .NET release data, CVEs, breaking changes, EOL dates, and OS support. Use when answering questions about .NET versions, security vulnerabilities, compatibility, or support status.
---

# .NET Release Graph

Machine-readable .NET release, CVE, and compatibility data via HAL hypermedia.

## Entry Point

https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/llms.json

## Core Rules

1. **Follow `_links["..."].href` exactly** — never construct URLs
2. **Use `_embedded` data first** — it answers most queries without extra fetches
3. **If data is missing, don't fabricate** — report the gap

## What's in llms.json

| Property | Contains |
|----------|----------|
| `_embedded.latest_patches[]` | Current patch for each supported version (8.0, 9.0, 10.0) with EOL dates, support status |
| `_embedded.latest_security_month[]` | CVE counts and IDs (severity requires fetching month index) |
| `_links` | Navigation to version indexes, timeline, releases |

## Skills for Specific Tasks

Fetch these when your query matches:

| Skill | Fetch When | URL |
|-------|------------|-----|
| navigation.md | Multi-hop query and unsure which links to follow | https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/navigation.md |
| cve.md | CVE queries needing severity, CVSS, or history | https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/cve.md |
| breaking-changes.md | Compatibility or migration questions | https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/breaking-changes.md |
| version-eol.md | EOL versions, support lifecycle, or version history | https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/version-eol.md |
| os-support.md | OS packages, distro support, or glibc requirements | https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/os-support.md |

## Quick Answers (1 fetch)

These are answered directly from `llms.json`:

- Latest patch for .NET X → `_embedded.latest_patches[]` filter by `release`
- Is .NET X supported? → `_embedded.latest_patches[]` → `supported`, `eol_date`
- CVE count this month → `_embedded.latest_security_month[]` → `cve_count`

## Navigation Shortcuts

Each `_embedded.latest_patches[]` entry has `_links` for 2-fetch navigation:

- `release-major` → version index (breaking changes, TFMs, OS support)
- `latest-sdk` → SDK index (feature bands, downloads)
- `latest-security` → last security patch for that version
