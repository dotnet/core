---
name: template
description: Template for skill documents - copy this structure
workflows: https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/{skill-name}/workflows.json
---

<!-- Editor's note: Size budgets
- Baseline skills: < 3KB
- Skills with external schema: < 5KB (need space to document external resources)
-->

# {Skill Name}

## First: {Decision Point}

```text
{Decision tree or routing logic}
```

## Quick Answers

From `{source}`:

- {Question}? → `{property}`
- {Question}? → `{property}`

## Stop Criteria

**{When to stop fetching}**

## Workflows

```json
"{workflow-name}": {
  "description": "{what it does}",
  "follow_path": ["kind:llms", "{relation}", "{relation}"],
  "destination_kind": "{kind}",
  "select_property": ["{prop}"],
  "yields": "json"
}
```

All workflows: <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/{skill-name}/workflows.json>

## {Data Structure} (if applicable)

```json
{
  "field": "description"
}
```

## External Schema (if skill exits the graph)

When workflows navigate to external resources (e.g., `compatibility.json`, `cve.json`), document:

- Key properties and their meanings
- Filtering/grouping strategies
- When to follow nested links vs. stop

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| {mistake} | {explanation} |

## Tips

- {tip}
- {tip}
