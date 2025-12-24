---
name: breaking-changes
description: Compatibility queries, breaking changes, migration guidance, and TFMs
workflows: https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/breaking-changes/workflows.json
---

# Breaking Changes Queries

## First: Which Version?

| Query | Path |
| ----- | ---- |
| Specific version (e.g., ".NET 9") | `patches.{version}` → `major-manifest` → `compatibility` |
| Latest or unspecified | `latest-major` → `manifest` → `compatibility` |

## Quick Answers

From `compatibility.json` (once fetched):

- How many breaking changes? → `breaks.length`
- High-impact changes? → filter `impact == "high"`
- Changes by category? → group by `category`
- Change type? → `type` (behavioral, source-incompatible, binary-source-incompatible)

## Stop Criteria

**STOP when you have `compatibility.json`.** It contains all breaking changes with impact levels and doc links. Only fetch `documentation` URLs if you need migration steps or rationale.

## Workflows

```json
"breaking-changes-all": {
  "follow_path": ["kind:llms", "latest-major", "manifest", "compatibility"],
  "destination_kind": "compatibility",
  "yields": "json"
}
```

```json
"migration-docs-by-category": {
  "follow_path": ["kind:compatibility"],
  "filter": "$.breaks[?(@.category == '{category}')]",
  "select_property": ["references[?(@.type == 'documentation')].url"],
  "yields": "urls"
}
```

**Example:** Get all ASP.NET Core migration docs:

```text
filter: $.breaks[?(@.category == 'aspnet-core')]
→ extract references[type='documentation'].url
→ fetch each for detailed migration steps
```

All workflows: <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/breaking-changes/workflows.json>

## External Schema: compatibility.json

```json
{
  "breaks": [{
    "id": "category-version-short-name",
    "title": "Human-readable title",
    "description": "Brief description",
    "category": "core-libraries | sdk | aspnet-core | ...",
    "type": "behavioral | source-incompatible | binary-source-incompatible",
    "impact": "low | medium | high",
    "affected_apis": ["API1", "API2"],
    "references": [
      { "type": "documentation", "url": "..." },
      { "type": "documentation-html", "url": "..." }
    ]
  }]
}
```

**Impact levels:** `low` (unlikely to affect most apps), `medium` (may require changes), `high` (likely requires migration)

**Categories:** `core-libraries`, `sdk`, `aspnet-core`, `windows-forms`, `wpf`, `cryptography`, `extensions`, `networking`, `serialization`

**When to follow `references`:** Only when `description` and `affected_apis` aren't sufficient for migration guidance.

## Common Mistakes

| Mistake | Why It's Wrong |
| ------- | -------------- |
| Fetching docs for every breaking change | Only fetch `documentation` URLs when you need migration details |
| Constructing `compatibility.json` URLs | Always follow `_links` from manifest.json |
| Looking for breaking changes in patches | Breaking changes are per major version, not per patch |

## Tips

- Group by `category` for migration planning
- Filter by `impact == "high"` for critical review
- Use `references[type="documentation"]` for raw markdown (LLM-friendly)
