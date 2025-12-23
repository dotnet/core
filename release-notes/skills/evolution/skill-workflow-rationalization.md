# Rationalizing SKILL.md and workflows.json

This document proposes a separation of concerns between SKILL.md (behavioral guidance) and workflows.json (navigation paths), reducing redundancy and improving precision.

## Current state

SKILL.md files currently contain both:

1. **Navigation guidance** — ASCII flow diagrams, strategy selection, path descriptions
2. **Behavioral guidance** — interpretation rules, stop criteria, common mistakes, field semantics

This creates overlap with workflows.json, which is purpose-built for navigation.

## Proposed separation

| Concern | Owner | Format |
|---------|-------|--------|
| "Where to go" | `workflows.json` (HAL) | Structured JSON with `_embedded.workflows`, `_links` |
| "How to think" | `SKILL.md` | Prose with workflow references |

**workflows.json** becomes the authoritative source for navigation paths. It:
- Is a HAL document with `_links` and `_embedded`
- Lives alongside SKILL.md in each skill directory
- Links back to SKILL.md via `required_pre_read`
- Has an `ai_note` explaining its purpose

**SKILL.md** becomes a behavioral contract that references workflows. It:
- Retains interpretation guidelines, stop criteria, field semantics, mistakes, tips
- References workflows.json via frontmatter `workflows` field
- Delegates all navigation to workflows.json

## File organization

```
release-notes/
├── llms.json                              # Root index
├── workflows.json                         # Root workflow hub
└── skills/
    ├── dotnet-releases/
    │   ├── SKILL.md                       # Root behavioral skill
    │   └── workflows.json                 # Root navigation workflows
    └── cve-queries/
        ├── SKILL.md                       # CVE behavioral guidance
        └── workflows.json                 # CVE navigation workflows
```

## The `ai_note` and `required_pre_read` fields

Each workflows.json includes:

```json
{
  "ai_note": "Navigation paths for CVE queries. Read required_pre_read for stop criteria, interpretation, and common mistakes.",
  "required_pre_read": "./SKILL.md"
}
```

This ensures LLMs entering via workflows.json are directed to behavioral context.

SKILL.md frontmatter includes:

```yaml
---
name: cve-queries
description: CVE queries needing severity, CVSS, affected versions
workflows: ./workflows.json
---
```

This creates bidirectional linking between the complementary documents.

## Workflow identifiers

Each workflow is identified by its key in `_embedded.workflows`. SKILL.md references workflows by this key:

```json
{
  "kind": "workflows",
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
      }
    }
  }
}
```

SKILL.md references it:

```markdown
### Finding critical CVEs

Use workflow `cve-critical-this-month`. Filter results where `cvss_severity == "CRITICAL"`.
```

This is consistent with `_links` where the key is the relation name.

## Conditional workflows

The current SKILL.md has strategy selection logic:

```markdown
| Query Scope | Strategy |
|-------------|----------|
| 1-3 months | `prev-security` walk from `latest-security-month` |
| 4+ months or explicit year | Year index with date filter |
```

This becomes structured in workflows.json:

```json
{
  "_embedded": {
    "workflows": {
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
        }
      }
    }
  }
}
```

SKILL.md references this as:

```markdown
### CVE history queries

Use workflow `cve-history`. The workflow has two variants:
- `cve-history.small-range` for 1-3 months (walks `prev-security`)
- `cve-history.large-range` for 4+ months (uses year index)

Calculate the cutoff date first. "Last 12 months" from Oct 2025 = Oct 2024.
```

The conditional logic is structured; the interpretation guidance ("calculate cutoff first") stays in prose.

## Refactored SKILL.md structure

```markdown
---
name: cve-queries
description: CVE queries needing severity, CVSS, affected versions, or security history
workflows: [cve-critical-this-month, cve-history, cve-by-version]
---

# CVE Queries

## Workflows

This skill uses the following workflows from `workflows.json`:

| Workflow | Use when |
|----------|----------|
| `cve-critical-this-month` | Finding critical CVEs in current month |
| `cve-history` | CVE history over a time range (has variants) |
| `cve-by-version` | CVEs affecting a specific .NET version |

## Stop criteria

**STOP when you have the month index.** `_embedded.disclosures[]` contains 
severity, CVSS, titles, and fix commits. Only fetch `cve.json` for full 
CVSS vectors, CWE, or package version ranges.

## Interpretation

### Quick answers from month index

Once you have the month index, answer directly from `_embedded.disclosures[]`:

| Question | Field |
|----------|-------|
| CVE severity? | `cvss_severity` |
| CVSS score? | `cvss_score` |
| Which versions affected? | `affected_releases` |
| Fix commits? | `fixes[].href` |

### Filtering by version

Filter `_embedded.disclosures[]` by `affected_releases`:

```javascript
disclosures.filter(d => d.affected_releases.includes("8.0"))
```

### Time ranges

"Last N months" = **calendar months**, not security releases. Security 
months are sparse. Calculate cutoff date before navigating.

## Disclosure fields

| Field | Description |
|-------|-------------|
| `id` | CVE identifier (CVE-2025-XXXXX) |
| `title` | Vulnerability title |
| `cvss_score` | 0-10 |
| `cvss_severity` | NONE, LOW, MEDIUM, HIGH, CRITICAL |
| `affected_releases` | Array: ["8.0", "9.0"] |
| `fixes[]` | Commit diff URLs (`.diff`) per release |

## Common mistakes

| Mistake | Correction |
|---------|------------|
| Fetching all `security: true` months | Calculate cutoff date first |
| Confusing "12 months" with "12 security releases" | Calendar months ≠ security releases |
| Fetching `cve.json` for severity/CVSS | Month index already has this |
| Fabricating URLs | Always use `_links` or `fixes[].href` |

## Tips

- `prev-security` auto-skips non-security months
- Fix URLs end in `.diff`—use directly
- `cve.json` only for CVSS vectors, CWE, or package ranges
```

## What moved where

| Original SKILL.md section | New location |
|---------------------------|--------------|
| Navigation Flow (ASCII diagram) | `workflows.json` → `_embedded.workflows.{name}.path` |
| Strategy Selection table | `workflows.json` → `_embedded.workflows.{name}.variants` |
| Common Queries | `workflows.json` → `query_hints` (routing metadata) |
| Stop Criteria | SKILL.md (behavioral) |
| Quick Answers | SKILL.md (interpretation) |
| Disclosure Fields | SKILL.md (interpretation) |
| Common Mistakes | SKILL.md (behavioral) |
| Tips | SKILL.md (behavioral) |

## Benefits

1. **Precision**: Navigation paths are unambiguous JSON, not ASCII art
2. **Routing metadata**: `query_hints`, `keywords`, `intent`, `not_for` act like synthetic query embeddings—the LLM matches user intent without vector infrastructure
3. **Compactness**: `path: ["latest-security-month"]` vs multi-line diagrams
4. **Composability**: Multiple skills can reference the same workflow via `_links`
5. **Selective loading**: LLM fetches only skill-specific workflows.json it needs
6. **HAL consistency**: Same `_links` / `_embedded` pattern as the rest of the graph
7. **Bidirectional entry**: LLM can start from SKILL.md or workflows.json
8. **Tooling**: Validate that SKILL.md workflow references exist in `_embedded.workflows`
6. **Separation**: Clear ownership—navigation vs. interpretation

## New vocabulary additions

To support this rationalization, `workflows.json` gains:

### Document-level properties

| Property | Type | Description |
|----------|------|-------------|
| `ai_note` | string | Brief guidance for LLMs on how to use this document |
| `required_pre_read` | string | Path to SKILL.md for behavioral context |
| `skill` | string | Skill name (for skill-specific workflows.json) |
| `_links` | object | HAL links (self, skill, root-workflows) |
| `_embedded.workflows` | object | Dictionary of workflow definitions |

### Workflow properties

| Property | Type | Description |
|----------|------|-------------|
| `variants` | object | Dictionary of conditional workflow variants (key = variant name) |
| `variants.{name}.condition` | string | Human-readable condition expression |
| `iterate` | object | For workflows that walk links |
| `iterate.link` | string | Link relation to follow repeatedly |
| `iterate.until` | string | Stop condition |
| `filter` | string | JSONPath or expression to filter results |
| `query_hints` | array | Sample natural language queries (routing, like synthetic query embeddings) |
| `keywords` | array | Terms for keyword-style matching |
| `intent` | string | High-level intent category |
| `not_for` | array | Queries this workflow should *not* be used for (disambiguation) |

### SKILL.md frontmatter additions

| Property | Type | Description |
|----------|------|-------------|
| `workflows` | string | Path to co-located workflows.json |

## Migration path

1. Create root `workflows.json` with HAL structure (`_links`, `_embedded`)
2. For each SKILL.md with navigation content:
   - Create co-located `workflows.json` with `ai_note` and `required_pre_read` → SKILL.md
   - Extract navigation flows → `_embedded.workflows`
   - Add `_links` to self, skill, and root-workflows
   - Update SKILL.md frontmatter with `workflows: ./workflows.json`
   - Replace ASCII diagrams with workflow references (by key)
   - Keep interpretation and behavioral guidance in SKILL.md
3. Add `_links` in root `workflows.json` pointing to each skill's workflows.json
4. Validate: ensure all SKILL.md workflow references exist in `_embedded.workflows`

## Open questions

1. **Condition syntax**: Should `variants.{name}.condition` be a formal expression language or prose? Prose is flexible; expressions are parseable.

2. **Iteration semantics**: Is `iterate.until` sufficient, or do we need `iterate.max_hops` as a safety bound?

3. **Filter syntax**: JSONPath? JMESPath? Prose description? Consider LLM parseability.

4. **Root workflows**: Should high-value cross-cutting workflows live in root `workflows.json`, or should all workflows be skill-local with root just linking to them?
