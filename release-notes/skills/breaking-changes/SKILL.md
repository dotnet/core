---
name: breaking-changes
description: Compatibility queries, breaking changes, migration guidance, and TFMs
workflows: https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/breaking-changes/workflows.json
---

# Breaking Changes Queries

All breaking changes use manifest → compatibility. Fetch workflows.json for navigation paths with `next_workflow` transitions.

## Stop Criteria

| Need | Stop At | Has |
|------|---------|-----|
| Count, categories, impact levels | compatibility.json | `breaks[]` with full metadata |
| Migration steps, code samples | documentation URL | Follow `breaks[].references[type="documentation"]` |

## One Rule

Follow `_links` only. Never construct compatibility.json URLs. Use `impact == "high"` filter for critical review.
