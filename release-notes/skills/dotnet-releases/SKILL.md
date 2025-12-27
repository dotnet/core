---
name: dotnet-releases
description: Query .NET release data, CVEs, breaking changes, EOL dates, and OS support.
workflows: https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/dotnet-releases/workflows.json
---

# .NET Release Graph

Machine-readable .NET release, CVE, and compatibility data via HAL hypermedia. This is the general-purpose skill—use specialized skills when your query matches.

## Skill Routing

| Query About | Use Skill |
|-------------|-----------|
| CVEs, security, CVSS | [cve-queries](https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/cve-queries/SKILL.md) |
| Breaking changes, migration | [breaking-changes](https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/breaking-changes/SKILL.md) |
| EOL dates, LTS/STS | [version-eol](https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/version-eol/SKILL.md) |

## Stop Criteria

| Need | Stop At | Has |
|------|---------|-----|
| Supported versions, patches | llms.json | `_embedded.patches["X.0"]` |
| Reference data (OS, TFM) | manifest.json | links to specialized JSON files |
| Downloads | downloads | component URLs |

## Core Rules

1. Follow `_links` exactly—never construct URLs
2. Use `_embedded` data first—most queries need zero extra fetches
3. Match your query to a workflow, then follow its `follow_path`
