---
name: workflows
description: Navigation workflows for LLMs traversing the .NET release graph
---

# Workflows

Workflows define navigation paths through the HAL graph. They appear in two forms: external (in `workflows.json`) and inline (in `_workflows`).

They are a HAL-native query scheme that references standard `_links` and `_emdedded` properties. It's solving a similar problem in a similar way as XSLT `match` patterns for HAL readers. Workflows are intended to provide trusted hints to LLMs on the best matched path through a HAL graph.

## Path Semantics

The `follow_path` array describes a route as a sequence of steps:

- **`kind:{name}`** — Starting document kind (prefix makes it explicit)
- **`{relation}`** — Link relation to follow

```text
["kind:llms", "major-manifest", "whats-new-runtime"]
   │            │                │
   │            │                └─ link relation
   │            └─ link relation
   └─ starting document (kind prefix)
```

**External workflows** will include `kind:` prefix for clarity.
**Inline workflows** will omit `kind:` (starting point is implicit—the current document).

## External vs Inline

| Form     | Location                | Start              | Use                   |
|----------|-------------------------|--------------------|-----------------------|
| External | `workflows.json`        | `kind:llms` prefix | Authoritative catalog |
| Inline   | `_workflows` in any doc | Implicit (current) | Lightweight hints     |

### External workflows

```json
{
  "whats-new-runtime": {
    "follow_path": ["kind:llms", "major-manifest", "whats-new-runtime"],
    "yields": "markdown",
    "destination_kind": "manifest"
  }
}
```

### Inline workflows

```json
{
  "_workflows": {
    "latest-cve-disclosures": {
      "follow_path": ["latest-security-month"],
      "select_embedded": ["disclosures"],
      "destination_kind": "month"
    }
  }
}
```

## Templated Workflows

Following HAL convention, workflows can use templates directly in `follow_path`:

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

The `{component}` placeholder in the workflow key matches intent patterns (runtime, sdk, libraries) and flows directly into `follow_path`. The path is always the complete route.

## Selection Properties

Selection properties extract data from the destination. They're needed when the path terminates at a document but you want specific parts of it:

| Property          | Extracts from        | Use case                            |
|-------------------|----------------------|-------------------------------------|
| `select_embedded` | `_embedded.{name}`   | Extract embedded data (common)      |
| `select_property` | Top-level properties | Extract specific fields             |
| `select_link`     | `_links.{name}` href | Return URL without following (rare) |

The prompt determines intent:

- "List the CVEs" → return `select_embedded` data
- "What's new in runtime?" → follow path to content
- "Give me the link" → return href from `select_link`

## Workflow Properties

### Required

| Property      | Type  | Description                               |
|---------------|-------|-------------------------------------------|
| `follow_path` | array | Route to destination (see Path Semantics) |

### Optional

| Property          | Type    | Description                                        |
|-------------------|---------|----------------------------------------------------|
| `yields`          | string  | Output format: `markdown`, `json`, `html`, `index` |
| `destination_kind`| string  | Document `kind` at destination (confirms arrival)  |
| `select_embedded` | array   | Properties to extract from `_embedded`             |
| `select_property` | array   | Top-level properties to extract                    |
| `select_link`     | array   | Link hrefs to return (without following)           |
| `templated`       | boolean | Path contains `{placeholder}` variables (HAL)      |

### Routing metadata

These help LLMs match user intent without vector search infrastructure:

| Property      | Type   | Description                               |
|---------------|--------|-------------------------------------------|
| `query_hints` | array  | Sample queries this workflow answers      |
| `keywords`    | array  | Terms for keyword-style matching          |
| `intent`      | string | High-level intent category                |
| `not_for`     | array  | Queries this workflow should *not* answer |

## Yields Values

| Value      | Description                              |
|------------|------------------------------------------|
| `markdown` | Markdown document                        |
| `json`     | Structured JSON data                     |
| `html`     | Rendered HTML content                    |
| `index`    | Navigational index for further traversal |

## Common Mistakes

| Mistake                                | Correction                                              |
|----------------------------------------|---------------------------------------------------------|
| Constructing URLs                      | Always follow `_links`—never fabricate hrefs            |
| Ignoring `destination_kind`            | Verify you arrived at the expected document type        |
| Skipping `required_pre_read`           | Read behavioral guidance before executing workflows     |
| Over-fetching beyond the path          | Stop when `follow_path` is exhausted                    |
| Fetching when `select_embedded` exists | Extract from `_embedded` instead of following more links|
