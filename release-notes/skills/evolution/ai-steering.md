# AI Steering: Making LLMs Aware of Workflows and Skills

This document describes how to guide LLMs toward behavioral and navigation content using `ai_note`, `required_pre_read`, and document structure.

## The steering problem

LLMs navigating a documentation graph need to know:

1. **That guidance exists** — skills and workflows are available
2. **Where to find it** — which files to read
3. **What order to read it** — behavioral context before navigation
4. **How to use it** — the relationship between skills and workflows

Without explicit steering, an LLM might:
- Construct URLs instead of following `_links`
- Navigate without understanding stop criteria or interpretation rules
- Miss workflow shortcuts that would reduce fetch count
- Lack context for filtering or processing results

## Steering vocabulary

| Field | Purpose | Appears in |
|-------|---------|------------|
| `ai_note` | Brief, imperative guidance for LLMs | All index documents |
| `required_pre_read` | URL to read before navigating | Index documents |
| `_links.workflows` | Link to navigation workflows | llms.json, manifests |
| `_links.skill` | Link to behavioral guidance | workflows.json |
| `_workflows` | Inline workflow hints | Any HAL document |

## Routing metadata

Workflows include metadata that helps LLMs match user intent without vector search infrastructure:

| Field | Purpose |
|-------|---------|
| `query_hints` | Sample queries this workflow answers (like synthetic query embeddings) |
| `keywords` | Terms for keyword-style matching |
| `intent` | High-level intent category |
| `not_for` | Queries this workflow should *not* answer (disambiguation) |

```json
{
  "cve-critical-this-month": {
    "description": "Find critical CVEs in the current security month",
    "follow_path": ["kind:llms", "latest-security-month"],
    "query_hints": [
      "What critical CVEs were fixed this month?",
      "Any critical .NET security issues?"
    ],
    "keywords": ["security", "cve", "critical"],
    "intent": "security-audit",
    "not_for": [
      "CVE history over multiple months",
      "All CVEs regardless of severity"
    ]
  }
}
```

The LLM reads `query_hints` and recognizes semantic similarity to user queries. `not_for` helps disambiguate between similar workflows—something vector similarity handles poorly.

## The steering chain

```
llms.json
    │
    ├── ai_note: "Read required_pre_read for behavioral guidance.
    │             Use _links.workflows for navigation paths."
    │
    ├── required_pre_read ──────────────► SKILL.md (behavioral)
    │                                         │
    │                                         └── workflows: ./workflows.json
    │
    └── _links.workflows ──────────────► workflows.json (navigation)
                                              │
                                              ├── ai_note: "Navigation paths.
                                              │             Read required_pre_read
                                              │             for interpretation."
                                              │
                                              └── required_pre_read ──► SKILL.md
```

The chain ensures that regardless of entry point, LLMs are directed toward behavioral context.

## Writing effective `ai_note`

The `ai_note` field is the first thing an LLM sees. It should be:

- **Brief** — one to two sentences
- **Imperative** — tell the LLM what to do
- **Specific** — reference concrete fields and actions

### Root index (`llms.json`)

```json
{
  "ai_note": "Read required_pre_read for behavioral guidance. Use _links.workflows for navigation paths, or inline _workflows for common tasks. Never construct URLs.",
  "required_pre_read": ".../skills/dotnet-releases/SKILL.md"
}
```

Key elements:
- Points to behavioral guidance first
- Mentions workflows as the navigation source
- Includes the critical "never construct URLs" rule

### Skill-specific workflows.json

```json
{
  "ai_note": "Navigation paths for CVE queries. Read required_pre_read for stop criteria, interpretation, and common mistakes.",
  "required_pre_read": "./SKILL.md"
}
```

Key elements:
- States the domain (CVE queries)
- Lists what SKILL.md provides (stop criteria, interpretation, mistakes)
- Uses relative path for co-located SKILL.md

### Root workflows.json

```json
{
  "ai_note": "Navigation workflows for .NET documentation. Skill-specific workflows in _links. Read required_pre_read for behavioral guidance.",
  "required_pre_read": ".../skills/dotnet-releases/SKILL.md"
}
```

Key elements:
- Indicates this is a hub (skill-specific workflows in `_links`)
- Still points to root SKILL.md for behavioral context

## The `required_pre_read` contract

`required_pre_read` is a strong directive: the LLM should fetch and read this document before taking other actions.

### What it should point to

| Document | `required_pre_read` points to |
|----------|-------------------------------|
| `llms.json` | Root SKILL.md |
| Root `workflows.json` | Root SKILL.md |
| Skill `workflows.json` | Co-located SKILL.md (relative path) |

### Why SKILL.md, not workflows.json?

The reading order should be:

1. **Behavioral context** (SKILL.md) — understand how to interpret results
2. **Navigation paths** (workflows.json) — know where to go

An LLM that navigates without behavioral context might:
- Fetch more documents than necessary (missing stop criteria)
- Misinterpret field values (missing interpretation rules)
- Make common mistakes the skill explicitly warns against

`required_pre_read` → SKILL.md ensures behavior comes first.

## Entry points and reading order

LLMs may enter the graph from different points:

### Entry via llms.json (cold start)

```
1. Read llms.json
2. See ai_note → read required_pre_read (SKILL.md)
3. SKILL.md references workflows → fetch if needed
4. Navigate using _links or _workflows
```

### Entry via intent matching (workflow-first)

```
1. LLM matches user intent to a workflow via query_hints/keywords/intent
2. Fetch workflows.json containing that workflow
3. See ai_note → read required_pre_read (SKILL.md)
4. Execute workflow with behavioral context
```

### Entry via SKILL.md (skill-first)

```
1. LLM is directed to read a skill
2. Read SKILL.md
3. See workflows field → fetch workflows.json if navigation needed
4. Navigate using workflows
```

All paths lead to behavioral context before navigation execution.

## Inline `_workflows` as steering

Inline `_workflows` in documents serve as lightweight steering:

```json
{
  "_workflows": {
    "whats-new-{component}": {
      "follow_path": ["major-manifest", "whats-new-{component}"],
      "yields": "markdown",
      "destination_kind": "manifest",
      "templated": true
    }
  }
}
```

Benefits:
- LLM sees common paths immediately (no extra fetch)
- `destination_kind` confirms arrival at expected document type
- `templated: true` enables pattern matching (runtime, sdk, libraries)

Inline workflows complement external `workflows.json`:
- **Inline**: High-value, frequently-used paths (no starting kind needed)
- **External**: Complete catalog with full metadata (includes starting kind)

## Steering across document types

### HAL index documents

```json
{
  "kind": "index",
  "ai_note": "...",
  "required_pre_read": "...",
  "_links": { ... },
  "_workflows": { ... }
}
```

### HAL manifest documents

```json
{
  "kind": "manifest",
  "ai_note": "This manifest describes .NET X.Y. Use _links for detailed content.",
  "_links": {
    "whats-new-runtime": { ... },
    "supported-os": { ... }
  }
}
```

Manifests may have lighter `ai_note` (no `required_pre_read`) if the LLM has already read root guidance.

### SKILL.md documents

```yaml
---
name: cve-queries
description: CVE queries needing severity, CVSS, affected versions
workflows: ./workflows.json
---

# CVE Queries

## Workflows

This skill uses workflows from `workflows.json`. See that file for navigation paths.

## Stop criteria
...
```

SKILL.md steers toward workflows.json for navigation, keeping behavioral and navigation concerns separate.

## Anti-patterns

### Omitting `ai_note`

```json
{
  "kind": "index",
  "_links": { ... }
}
```

Problem: LLM has no guidance on how to use this document.

### `ai_note` too vague

```json
{
  "ai_note": "This is an index of .NET releases."
}
```

Problem: Doesn't tell LLM what to do. No mention of required reading or navigation strategy.

### `required_pre_read` pointing to workflows.json

```json
{
  "ai_note": "Read required_pre_read first.",
  "required_pre_read": ".../workflows.json"
}
```

Problem: Inverts natural order. LLM gets navigation before behavioral context. workflows.json will then point back to SKILL.md, adding a hop.

### Missing `required_pre_read` in workflows.json

```json
{
  "kind": "workflows",
  "ai_note": "Navigation paths for CVE queries.",
  "_embedded": { ... }
}
```

Problem: LLM entering via workflows.json misses behavioral context. Should include `required_pre_read` → SKILL.md.

## Summary

| Principle | Implementation |
|-----------|----------------|
| Tell LLMs guidance exists | `ai_note` in every index document |
| Point to behavioral context | `required_pre_read` → SKILL.md |
| Make navigation discoverable | `_links.workflows` or inline `_workflows` |
| Ensure bidirectional linking | workflows.json → SKILL.md and SKILL.md → workflows.json |
| Behavioral before navigation | `required_pre_read` always points to SKILL.md, not workflows.json |
| Keep `ai_note` actionable | Imperative, brief, specific |

## Recommended `ai_note` templates

### Root llms.json
```
Read required_pre_read for behavioral guidance. Use _links.workflows for navigation paths, or inline _workflows for common tasks. Never construct URLs.
```

### Root workflows.json
```
Navigation workflows for .NET documentation. Skill-specific workflows in _links. Read required_pre_read for behavioral guidance.
```

### Skill workflows.json
```
Navigation paths for [DOMAIN]. Read required_pre_read for stop criteria, interpretation, and common mistakes.
```

### Manifest
```
[PRODUCT] [VERSION] manifest. Use _links for detailed content. Inherits behavioral guidance from root.
```
