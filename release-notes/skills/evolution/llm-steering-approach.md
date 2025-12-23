# LLM Steering for Graph Comprehension

This document describes our approach to guiding LLMs through the .NET release graph using familiar standards and instructive formats.

## Design Principles

1. **Leverage familiarity** — Use formats LLMs already understand from training data
2. **Minimize ambiguity** — Explicit paths over implicit conventions
3. **Progressive disclosure** — Entry points lead to deeper guidance on demand
4. **Separation of concerns** — Navigation paths vs. behavioral interpretation

## The Stack

```
┌─────────────────────────────────────────────────────┐
│  Skills (SKILL.md)                                  │
│  Behavioral guidance: stop criteria, interpretation │
├─────────────────────────────────────────────────────┤
│  Workflows (workflows.json)                         │
│  Navigation paths: follow_path, destination_kind    │
├─────────────────────────────────────────────────────┤
│  HAL (index.json, llms.json, etc.)                  │
│  Hypermedia: _links, _embedded, self-describing     │
└─────────────────────────────────────────────────────┘
```

### HAL: The Foundation

HAL (Hypertext Application Language) is a widely-adopted hypermedia format. LLMs encounter it frequently in training data from REST APIs, making `_links` and `_embedded` patterns immediately recognizable.

Key advantages:
- **Self-describing** — `_links` enumerate available operations without external documentation
- **No URL construction** — Always follow `href` values, never fabricate paths
- **Embedded data** — `_embedded` pre-fetches related resources, reducing round trips

We extend HAL minimally, adding properties like `kind` (document type) and `ai_note` (brief LLM guidance) without breaking compatibility.

### Skills: Behavioral Guidance

Skills are markdown documents (SKILL.md) providing human-readable instruction for LLMs. They follow the emerging [Skills format](https://github.com/anthropics/skills) and answer "how should I think about this data?" rather than "where is the data?"

A skill contains:
- **Stop criteria** — When to stop fetching (e.g., "STOP at compatibility.json")
- **Quick answers** — Fields that answer common questions directly
- **Interpretation rules** — How to filter, compare, or synthesize data
- **Common mistakes** — Anti-patterns to avoid

Skills use YAML frontmatter for machine-readable metadata:

```yaml
---
name: cve-queries
description: CVE queries needing severity, CVSS, affected versions
workflows: https://.../skills/cve-queries/workflows.json
---
```

The `workflows` field creates bidirectional linking between behavioral guidance (SKILL.md) and navigation paths (workflows.json).

### Workflows: Navigation Paths

Workflows are a home-grown format, designed to feel HAL-native while filling a gap neither HAL nor Skills address: explicit multi-hop navigation paths. Unlike HAL (an IETF draft) and Skills (an emerging Anthropic format), workflows are specific to this project—though we've designed them to be portable and familiar to LLMs trained on HAL documents.

Workflows define explicit navigation routes and exist in two forms:

**External workflows** (in workflows.json):
```json
{
  "latest-cve-disclosures": {
    "follow_path": ["kind:llms", "latest-security-month"],
    "destination_kind": "month",
    "select_embedded": ["disclosures"],
    "yields": "json"
  }
}
```

**Inline workflows** (in any HAL document's `_workflows`):
```json
{
  "_workflows": {
    "cve-disclosures": {
      "follow_path": ["latest-security-month"],
      "select_embedded": ["disclosures"]
    }
  }
}
```

The distinction:
- **External** — Authoritative catalog with full metadata (`query_hints`, `keywords`, `intent`)
- **Inline** — Lightweight hints embedded in the document being navigated

Workflows bridge intent to action. The `query_hints` array acts as synthetic embeddings, enabling intent matching without vector infrastructure:

```json
{
  "query_hints": [
    "What CVEs were fixed recently?",
    "Latest security patches?"
  ]
}
```

### Taste Tests and Full Catalogs

The root skill (dotnet-releases) includes representative workflows from each domain as "taste tests," with `_links.self` pointing to the full catalog:

```json
{
  "latest-cve-disclosures": {
    "follow_path": ["kind:llms", "latest-security-month"],
    "destination_kind": "month",
    "_links": {
      "self": {
        "href": ".../cve-queries/workflows.json",
        "title": "Full CVE query catalog"
      }
    }
  }
}
```

This pattern provides immediate utility while advertising deeper capabilities.

## Query Expressions

Workflows use JSONPath for filtering and selection:

```json
{
  "filter": "$.breaks[?(@.impact == 'high')]",
  "select_embedded": ["disclosures"]
}
```

JSONPath advantages:
- **LLM familiarity** — Common in training data from API documentation
- **jq translation** — Direct mapping to `jq` for validation and testing
- **Readable** — Path expressions are more intuitive than programmatic filters

We remain open to alternative JSON query standards (JMESPath, JSON Pointer) if performance evaluation indicates better LLM comprehension or fewer navigation errors.

## Discovery Flow

```
llms.json
    │
    ├─► _links.workflows ─► dotnet-releases/workflows.json
    │                              ├─► inline workflows (taste tests)
    │                              └─► _links to sub-skill catalogs
    │
    └─► required_pre_read ─► dotnet-releases/SKILL.md
                                   ├─► frontmatter.workflows (link)
                                   ├─► Skills table (sub-skill URLs)
                                   └─► Core Rules (behavioral)
```

An LLM entering via `llms.json` can:
1. Follow `_links.workflows` for navigation paths
2. Follow `required_pre_read` for behavioral guidance
3. Use `_embedded` data for immediate answers

## Measuring Success

We evaluate this approach through:
- **Fetch counts** — Fewer fetches for equivalent queries
- **Navigation accuracy** — Correct path selection without backtracking
- **Stop compliance** — Respecting stop criteria (no over-fetching)
- **Answer correctness** — Accurate extraction and synthesis

The query corpus in `queries/metrics/` provides standardized test cases across difficulty levels (Q1-Easy through Q5-Project).
