---
name: dotnet-releases
description: Query .NET release data, CVEs, breaking changes, EOL dates, and OS support.
workflows: https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/dotnet-releases/workflows.json
---

# .NET Release Graph

Machine-readable .NET release, CVE, and compatibility data via HAL hypermedia.

Markdown skills and JSON workflows describe optimal paths and behavior. Read content specific to your query before jumping in.

## Graph Entry Point

Fetch: <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/llms.json>

A HAL+JSON graph with temporal and version structure to enable diverse queries.

## Workflows

Fetch: <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/dotnet-releases/workflows.json>

Workflows define navigation paths through the HAL graph. Match your query to a workflow, then follow its `follow_path`:

- `follow_path`: Route as `["kind:llms", "relation", "relation"]`
- `kind:` prefix: Starting document type
- `select_embedded`: Extract from `_embedded` (avoids extra fetches)
- `yields`: Output format (`markdown`, `json`, `html`)

Example:

```json
    "cve-by-version": {
        "description": "CVEs affecting a specific .NET version",
        "follow_path": ["kind:llms", "patches.{version}", "latest-security-disclosures"],
        "destination_kind": "month",
        "select_embedded": ["disclosures"],
        "yields": "json",
        "query_hints": [
            "What CVEs affect .NET 8?",
            "Security issues for .NET 9.0?"
        ],
        "keywords": ["cve", "security", "version", "affects"],
        "intent": "security-audit"
    },
```

Once you've matched a workflow to your query, follow its `follow_path` sequence through the HAL graph.

## Skills

Fetch when your query matches. **Core Rules apply to all.**

| Skill | Fetch When | URL |
| ----- | ---------- | --- |
| cve-queries | CVE severity, CVSS, security history | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/cve-queries/SKILL.md> |
| cve-schema | Extraction from cve.json (CVSS vectors, CWE, packages) | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/cve-schema/SKILL.md> |
| breaking-changes | Breaking changes, migration impact | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/breaking-changes/SKILL.md> |
| whats-new | What's new, release highlights | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/whats-new/SKILL.md> |
| version-eol | EOL dates, support status | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/version-eol/SKILL.md> |
| os-support | OS/distro support, packages | <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/os-support/SKILL.md> |

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

From `llms.json._links` (not version-specific):

- Latest CVE disclosures → `latest-security-disclosures`
- Full CVE details → `latest-cve-json`
- All versions including EOL → `root`

From `llms.json._embedded.patches["X.0"]` (version-specific):

- Latest patch version → `version`
- Is .NET X supported? → `supported`, `support_phase`
- Release type → `release_type` (lts/sts)
- Last security patch → `latest_security_patch`, `latest_security_patch_date`
- SDK version → `sdk_version`
- CVE disclosures for this version → `_links.latest-security-disclosures`

## Navigation Shortcuts

From `_embedded.patches["X.0"]._links`:

| Relation | Target |
| -------- | ------ |
| `major-manifest` | manifest.json (OS, breaking changes, what's new) |
| `latest-security-disclosures` | Security month for this version |

From `llms.json._links`:

| Relation | Target |
| -------- | ------ |
| `latest`, `latest-lts` | Newest release (same when latest is LTS; diverge when STS is newer) |
| `latest-security-disclosures` | Latest security month (CVE queries) |
| `root` | All versions including EOL |
