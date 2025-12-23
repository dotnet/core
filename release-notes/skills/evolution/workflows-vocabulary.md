# `workflows.json` Vocabulary Specification

This document defines the vocabulary for `.NET` documentation workflows designed for LLM consumption.

## Key concepts

### `follow_path` semantics

The `follow_path` array describes a route as a sequence of steps:

- **`kind:{name}`** — Starting document kind (prefix makes it explicit)
- **`{relation}`** — Link relation to follow

| Context | First element | Example |
|---------|---------------|---------|
| External (`workflows.json`) | `kind:` prefix | `["kind:llms", "major-manifest"]` |
| Inline (`_workflows`) | Link relation | `["major-manifest"]` |

**External paths** should include `kind:` prefix for clarity.
**Inline paths** may omit it (starting point is implicit—the current document).

### Templated workflows

Following HAL convention, workflows can use templates directly in `follow_path`:

```json
{
  "whats-new-{component}": {
    "follow_path": ["major-manifest", "whats-new-{component}"],
    "yields": "markdown",
    "destination_kind": "manifest",
    "templated": true
  }
}
```

The `{component}` placeholder in the workflow key matches intent patterns (runtime, sdk, libraries) and flows directly into `follow_path`. The path is always the complete route.

### Selection properties

Selection properties extract data from the destination. They're needed when the path terminates at a document but you want specific parts of it:

| Property | Extracts from | Use case |
|----------|---------------|----------|
| `select_embedded` | `_embedded.{name}` | Extract embedded data (common) |
| `select_property` | Top-level properties | Extract specific fields |
| `select_link` | `_links.{name}` href | Return URL without following (rare) |

## Document structure

workflows.json is a HAL document. Workflows can be distributed across skill-specific files, with a root workflows.json linking to them.

### Root `workflows.json`

```json
{
  "kind": "workflows",
  "title": ".NET Documentation Workflows",
  "schema_version": "1.0",
  "ai_note": "Navigation paths for .NET documentation. For behavioral guidance, read required_pre_read first. Skill-specific workflows in _links.",
  "required_pre_read": ".../skills/dotnet-releases/SKILL.md",
  "_links": {
    "self": { "href": ".../workflows.json" },
    "root": { "href": ".../llms.json" },
    "cve-queries": { 
      "href": ".../skills/cve-queries/workflows.json",
      "title": "CVE query workflows"
    },
    "version-queries": {
      "href": ".../skills/version-queries/workflows.json",
      "title": "Version and release workflows"
    }
  },
  "_embedded": {
    "workflows": {
      "whats-new-runtime": {
        "description": "Runtime improvements for latest release",
        "follow_path": ["kind:llms", "major-manifest", "whats-new-runtime"],
        "yields": "markdown"
      }
    }
  }
}
```

### Skill-specific `workflows.json`

```json
{
  "kind": "workflows",
  "title": "CVE Query Workflows",
  "skill": "cve-queries",
  "ai_note": "Navigation paths for CVE queries. Read required_pre_read for stop criteria, interpretation, and common mistakes.",
  "required_pre_read": "./SKILL.md",
  "_links": {
    "self": { "href": ".../skills/cve-queries/workflows.json" },
    "skill": { "href": ".../skills/cve-queries/SKILL.md" },
    "root-workflows": { "href": ".../workflows.json" }
  },
  "_embedded": {
    "workflows": {
      "cve-critical-this-month": {
        "description": "Find critical CVEs in the current security month",
        "follow_path": ["kind:llms", "latest-security-month"],
        "yields": "json",
        "select_embedded": ["disclosures"]
      },
      "cve-history": {
        "description": "CVE disclosures over a time range",
        "variants": {
          "small-range": { "...": "..." },
          "large-range": { "...": "..." }
        }
      }
    }
  }
}
```

## Document root properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `kind` | string | Yes | Always `"workflows"` |
| `title` | string | Yes | Human-readable title |
| `schema_version` | string | Yes | Semver for the workflow schema (e.g., `"1.0"`) |
| `ai_note` | string | Yes | Brief guidance for LLMs on how to use this document |
| `required_pre_read` | string | Yes | URL/path to SKILL.md for behavioral context |
| `skill` | string | No | Skill name (for skill-specific workflows.json) |
| `_links` | object | Yes | HAL links (self, root, skill-specific workflows) |
| `_embedded` | object | Yes | Contains `workflows` dictionary |

## Workflow definition

Each key in `_embedded.workflows` is a workflow identifier (kebab-case, e.g., `whats-new-runtime`).

### Core properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `description` | string | Yes | Brief description of what the workflow accomplishes |
| `follow_path` | array | Yes | `[kind:{name}, ...relations]` — starting document (with `kind:` prefix), then link relations |
| `yields` | string | Yes | Expected output format (see [Yields values](#yields-values)) |

Note: `follow_path` provides the full route. The path itself is the complete definition.

### Routing properties

These properties help LLMs match user intent to workflows. They serve a similar purpose to synthetic queries in vector databases: multiple "entry points" that route to the same destination.

In a vector DB, you register multiple embeddings pointing to the same document—the document itself plus synthetic queries that users might ask. Here, the LLM is the semantic matching engine. It reads these hints and reasons about similarity without embeddings.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `query_hints` | array | No | Sample natural language queries this workflow answers |
| `keywords` | array | No | Terms and phrases for keyword-style matching |
| `intent` | string | No | High-level intent category (e.g., `"security-audit"`, `"version-check"`) |
| `not_for` | array | No | Queries this workflow should *not* be used for (disambiguation) |

#### Example

```json
{
  "cve-critical-this-month": {
    "description": "Find critical CVEs in the current security month",
    "follow_path": ["kind:llms", "latest-security-month"],
    "query_hints": [
      "What critical CVEs were fixed this month?",
      "Any critical .NET security issues?",
      "Recent critical vulnerabilities"
    ],
    "keywords": ["security", "cve", "critical", "current", "vulnerability"],
    "intent": "security-audit",
    "not_for": [
      "CVE history over multiple months",
      "All CVEs regardless of severity"
    ]
  }
}
```

#### Why this works without vectors

| Vector DB | workflows.json |
|-----------|----------------|
| Requires embedding infrastructure | Self-contained JSON |
| Opaque similarity scores | Human-readable hints |
| Needs reindexing on change | Edit JSON, done |
| Works at retrieval time | Works at reasoning time |

The LLM reads `query_hints` and recognizes semantic similarity to user queries. `not_for` helps disambiguate between similar workflows—something vector similarity handles poorly.

### Selection properties

These properties specify *what* to extract; the user's prompt determines *how* to use it:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `select_embedded` | array | No | Properties to extract from `_embedded` |
| `select_link` | array | No | Link relations to follow from `_links` |
| `select_property` | array | No | Top-level properties to extract |
| `destination_kind` | string | No | Document `kind` at destination (confirms arrival) |

### Parameterization

For workflows that can be customized.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `parameters` | object | No | Map of parameter name → parameter definition |

#### Parameter definition

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `description` | string | Yes | What this parameter controls |
| `type` | string | Yes | `"string"`, `"number"`, `"enum"` |
| `required` | boolean | No | Whether the parameter is required (default: `false`) |
| `default` | any | No | Default value if not specified |
| `enum` | array | No | Allowed values if `type` is `"enum"` |
| `path_segment` | integer | No | Index in `follow_path` where this parameter is substituted |

## Yields values

The `yields` property indicates what the LLM will receive at the end of the workflow.

| Value | Description |
|-------|-------------|
| `markdown` | Markdown document (articles, release notes) |
| `json` | Structured JSON data |
| `json-collection` | Array of JSON objects |
| `html` | Rendered HTML content |
| `index` | A navigational index for further traversal |

## Example

### Root workflows.json

```json
{
  "kind": "workflows",
  "title": ".NET Documentation Workflows for LLMs",
  "schema_version": "1.0",
  "ai_note": "Navigation paths for .NET documentation. For behavioral guidance, read required_pre_read first. Skill-specific workflows in _links.",
  "required_pre_read": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/skills/dotnet-releases/SKILL.md",
  "_links": {
    "self": {
      "href": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/workflows.json"
    },
    "root": {
      "href": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"
    },
    "cve-queries": {
      "href": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/skills/cve-queries/workflows.json",
      "title": "CVE query workflows"
    }
  },
  "_embedded": {
    "workflows": {
      "whats-new-runtime": {
        "description": "Runtime JIT, GC, and codegen improvements for the latest .NET release",
        "follow_path": ["kind:llms", "major-manifest", "whats-new-runtime"],
        "yields": "markdown",
        "query_hints": [
          "What's new in the .NET runtime?",
          "Tell me about JIT improvements in .NET 10",
          "What GC changes are in the latest release?"
        ],
        "keywords": ["runtime", "jit", "gc", "performance", "codegen"],
        "intent": "release-discovery"
      }
    }
  }
}
```

### Skill-specific workflows.json

```json
{
  "kind": "workflows",
  "title": "CVE Query Workflows",
  "schema_version": "1.0",
  "skill": "cve-queries",
  "ai_note": "Navigation paths for CVE queries. Read required_pre_read for stop criteria, interpretation, and common mistakes.",
  "required_pre_read": "./SKILL.md",
  "_links": {
    "self": {
      "href": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/skills/cve-queries/workflows.json"
    },
    "skill": {
      "href": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/skills/cve-queries/SKILL.md"
    },
    "root-workflows": {
      "href": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/workflows.json"
    }
  },
  "_embedded": {
    "workflows": {
      "cve-critical-this-month": {
        "description": "Find critical CVEs in the current security month",
        "follow_path": ["kind:llms", "latest-security-month"],
        "yields": "json",
        "select_embedded": ["disclosures"],
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
      },
      "cve-history": {
        "description": "CVE disclosures over a time range",
        "variants": {
          "small-range": {
            "condition": "months <= 3",
            "description": "Walk prev-security links for small ranges",
            "follow_path": ["kind:llms", "latest-security-month"],
            "iterate": {
              "link": "prev-security",
              "until": "date < cutoff"
            },
            "yields": "json-collection"
          },
          "large-range": {
            "condition": "months > 3 OR explicit_year",
            "description": "Use year index for large ranges",
            "follow_path": ["kind:llms", "timeline", "{year}"],
            "filter": "_embedded.months[?date >= cutoff AND security == true]",
            "yields": "json-collection"
          }
        },
        "query_hints": [
          "What CVEs were fixed in the last 6 months?",
          "Show me all 2024 .NET security patches"
        ],
        "keywords": ["security", "cve", "history", "timeline"],
        "intent": "security-audit"
      },
      "supported-os-for-version": {
        "description": "Operating systems supported by a specific .NET version",
        "follow_path": ["kind:llms", "releases", "{version}", "supported-os-json"],
        "yields": "json",
        "parameters": {
          "version": {
            "description": "The .NET version (e.g., '10.0', '9.0', '8.0')",
            "type": "enum",
            "enum": ["10.0", "9.0", "8.0"],
            "required": true,
            "path_segment": 1
          }
        },
        "query_hints": [
          "What operating systems does .NET 10 support?",
          "Can I run .NET 9 on Alpine Linux?",
          "Is .NET 8 supported on Windows Server 2019?"
        ],
        "keywords": ["compatibility", "os", "support", "platform"],
        "intent": "compatibility-check"
      }
    }
  }
}
```

## Inline `_workflows`

When workflows appear inline in documents (e.g., in `llms.json`), the `follow_path` array omits the starting kind (it's implicit—the current document):

```json
"_workflows": {
  "whats-new-{component}": {
    "follow_path": ["major-manifest", "whats-new-{component}"],
    "yields": "markdown",
    "destination_kind": "manifest",
    "templated": true
  }
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `follow_path` | array | Yes | Link relations to traverse (may include `{placeholder}`) |
| `yields` | string | No | Output format |
| `destination_kind` | string | No | Document `kind` at destination (confirms arrival) |
| `select_embedded` | array | No | Properties to extract from `_embedded` |
| `select_property` | array | No | Top-level properties to extract |
| `select_link` | array | No | Link hrefs to return without following (rare) |
| `templated` | boolean | No | Path contains `{placeholder}` variables (HAL convention) |

**Why no `kind:` prefix?** Inline workflows appear inside a document, so the starting point is implicit. The `follow_path` contains only link relations.

**Why `destination_kind` is still useful:** Even with a complete path, `destination_kind` helps the LLM confirm it has arrived at the expected document type.

## Design principles

1. **`follow_path` everywhere**: Both external and inline workflows use `follow_path`. External paths include starting kind; inline paths omit it (implicit).
2. **HAL conventions**: `_links` for navigation, `_embedded.workflows` for content, `templated: true` for URI-style templates.
3. **Skill co-location**: Each skill has both SKILL.md (behavioral) and workflows.json (navigation) in the same directory.
4. **Bidirectional linking**: workflows.json has `required_pre_read` → SKILL.md; SKILL.md has `workflows` → workflows.json.
5. **Distributed with a hub**: Root workflows.json links to skill-specific ones; LLMs can fetch only what they need.
6. **Routing metadata as low-fi vectors**: `query_hints`, `keywords`, `intent`, and `not_for` serve the same purpose as synthetic query embeddings—multiple entry points to the same destination. The LLM is the semantic matching engine.
7. **Schema evolution**: `schema_version` allows non-breaking additions.

## File organization

```
release-notes/
├── llms.json                              # Root index
├── workflows.json                         # Root workflow hub (HAL)
└── skills/
    ├── dotnet-releases/
    │   ├── SKILL.md                       # Root behavioral skill
    │   └── workflows.json                 # Root navigation workflows
    └── cve-queries/
        ├── SKILL.md                       # CVE behavioral guidance
        └── workflows.json                 # CVE navigation workflows
```

## SKILL.md integration

SKILL.md files should include a `workflows` field in frontmatter pointing to co-located workflows.json:

```yaml
---
name: cve-queries
description: CVE queries needing severity, CVSS, affected versions
workflows: ./workflows.json
---
```

The relationship is complementary:
- **workflows.json** → `required_pre_read` points to SKILL.md (always beneficial to read)
- **SKILL.md** → `workflows` points to workflows.json (declarative reference)

An LLM can enter from either direction:
- **Skill-first**: Reading SKILL.md, then consulting workflows.json for paths
- **Workflow-first**: Matching intent to a workflow, then reading SKILL.md for behavioral context
