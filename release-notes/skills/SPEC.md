# Skills Specification

A design specification for LLM-steering skills. Based on [Anthropic Skills](https://github.com/anthropics/skills).

## Philosophy

Skills augment well-designed schemas and workflows with targeted guidance for specific tasks. They are **not** a replacement for good API design—they're a complement to it.

**Core tension:** Skills that are too prescriptive straight-jacket LLMs and prevent optimal behavior when better approaches exist. Skills that are too loose provide no value. The goal is to guide without constraining.

## Design Principles

### 1. Schema First, Skills Second

Skills assume a well-designed underlying system (HAL hypermedia, REST APIs, structured data). They teach navigation and interpretation—not the fundamentals of the domain.

**Good:** "Follow `_links` to navigate; use `_embedded` data first"
**Bad:** Encoding all possible data paths directly in the skill

### 2. Skills as Maps for Intentional Complexity

Well-designed graphs optimize for common queries, not universal discoverability. This creates inherent tension:

- **Flat graphs** make everything easy to find but bloat entry points and slow common queries
- **Deep graphs** optimize hot paths but bury less-common data

Skills resolve this tension by providing maps to harder-to-find data without restructuring the graph itself.

**Example:** `compatibility.json` is intentionally 2-3 hops deep because:
- Breaking change queries are less frequent than version/CVE queries
- Embedding it would bloat `llms.json` for the 80% of queries that don't need it
- The skill provides the navigation path when it's needed

This is a feature, not a bug. Skills document the optimal path through intentional complexity rather than demanding the graph be flattened.

### 3. Progressive Disclosure

Start minimal. Load additional context only when needed.

```
Entry point (SKILL.md)
    │
    ├─► Embedded data answers most queries (no skill fetch needed)
    │
    └─► Task-specific skill fetched only when query matches trigger
```

Skills should explicitly state when they're needed and when they're not.

### 4. Negative Constraints Are First-Class

LLMs often learn better from "don't do X" than "do Y" for common failure modes. Every skill should document:

- **Common mistakes** — What LLMs typically get wrong
- **Non-existent relations** — Links that seem logical but don't exist
- **Stop criteria** — When to stop navigating

### 5. Explicit Stop Conditions

Over-navigation is a common failure mode. Skills must include explicit stop criteria:

```markdown
## Stop Criteria

**STOP immediately when you have the JSON file.** The answer is in that file—do not fetch anything else.
```

### 6. Composability Through Inheritance

Skills inherit base rules rather than duplicating them:

```markdown
*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*
```

This ensures consistency and reduces maintenance burden.

### 7. Visual Navigation Maps

ASCII flow diagrams are highly effective for LLM comprehension:

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► _links["release-manifest"]
            │
            ▼
        manifest.json ─► DONE
```

Standardize this format across all skills.

## Skill Structure

### Required Elements

Every skill must include:

| Element | Purpose |
|---------|---------|
| YAML frontmatter | `name`, `description` for indexing |
| Inheritance statement | Reference to parent rules |
| Navigation flow | ASCII diagram showing the path |
| Common queries | Concrete examples with fetch counts |
| Stop criteria | When to stop navigating |
| Common mistakes | What LLMs get wrong |

### Optional Elements

| Element | When to Include |
|---------|-----------------|
| Schema details | When document structure isn't obvious |
| Glossary | When domain terms need definition |
| Tips | When there are non-obvious optimizations |

### Template

```markdown
# [Task] Queries

*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*

## Stop Criteria

[Explicit conditions for when to stop]

## Navigation Flow

```
[ASCII diagram]
```

## Common Queries

### [Query type] (N fetches)

1. [Step]
2. [Step]
3. [Step]

## [Document] Structure

[Schema details if needed]

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| [Mistake] | [Explanation] |

## Tips

- [Non-obvious optimization]
```

## Content Guidelines

### Brevity

Skills are included in LLM context. Every token counts.

- Use tables over prose where possible
- Use ASCII diagrams over verbose descriptions
- Eliminate redundancy—reference parent skills, don't duplicate

### Specificity

Vague guidance produces vague behavior.

**Bad:** "Be careful when navigating"
**Good:** "STOP immediately when you have the JSON file"

**Bad:** "Consider the date range"
**Good:** "Calculate your cutoff date first. 'Last 12 months' from Oct 2025 means Oct 2024 cutoff"

### Actionability

Every statement should be actionable. If it can't be acted on, remove it.

**Bad:** "The schema is well-designed"
**Good:** "Filter `_embedded.months[]` to date range + `security: true` before fetching"

## Separation of Concerns

Skills should have minimal overlap. Each skill owns a specific task domain:

| Skill | Owns | Does NOT Own |
|-------|------|--------------|
| cve.md | CVE queries, severity, CVSS | Version support status |
| version-eol.md | Support lifecycle, EOL dates | CVE details |
| os-support.md | Distro support, packages | Breaking changes |
| breaking-changes.md | Compatibility, migration | OS requirements |
| navigation.md | Multi-hop patterns | Task-specific logic |
| schema.md | Document structure, properties | Navigation patterns |

When queries span domains, the skill should reference (not duplicate) the relevant peer skill.

## Size Constraints

### Anthropic Guidance

The [Anthropic Skills Spec](https://github.com/anthropics/skills) provides no explicit size guidance. Anthropic's production document skills range widely:

| Skill | Size | Notes |
|-------|------|-------|
| pdf | 7KB | Production |
| docx | 10KB | Production |
| xlsx | 11KB | Production |
| pptx | 26KB | Production |
| Example skills | 1.5-20KB | Demos |

### Why Our Constraints Are Tighter

Anthropic skills are typically loaded once at conversation start. Our skills are **fetched dynamically mid-query** via URL, adding latency and context per fetch. This architectural difference justifies tighter budgets.

### Tiered Size Budgets

| Tier | Skills | Budget | Rationale |
|------|--------|--------|-----------|
| **Hot path** | SKILL.md | < 3KB | Always loaded with entry point |
| **Frequent** | cve.md, navigation.md | < 4KB | Common queries, fetched often |
| **Task-specific** | os-support.md, breaking-changes.md, version-eol.md, schema.md | < 5KB | Fetched only when needed |

### Quality vs. Size

Prefer quality over arbitrary size limits. A 4.5KB skill with essential JSON examples is better than a 3KB skill that causes hallucinations. The tiers above are guidelines, not hard rules.

### Embedded Data Budget

**`_embedded` target:** Sufficient to answer 80% of queries without additional fetches

The entry point JSON should embed enough data that most queries don't require skill fetches at all.

## Testing Methodology

### Test Categories

1. **Navigation accuracy** — Does the LLM follow the correct path?
2. **Fetch efficiency** — Does it minimize round trips?
3. **Stop compliance** — Does it stop when instructed?
4. **Hallucination rate** — Does it fabricate URLs or data?
5. **Edge case handling** — Does it report gaps rather than inventing answers?

### Test Structure

Each skill should have a test suite covering:

```
tests/
  [skill-name]/
    queries.md        # Test queries with expected behavior
    expected/         # Expected outputs or navigation paths
    edge-cases.md     # Boundary conditions and failure modes
```

### Evaluation Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Correct navigation | > 95% | Path matches expected |
| Fetch efficiency | ≤ expected + 1 | Count fetches per query |
| Zero hallucination | 100% | No fabricated URLs |
| Stop compliance | > 95% | Stops at correct point |

### Cross-Model Testing

Skills must be tested across multiple LLMs to ensure robustness:

- Different models interpret instructions differently
- Skill should work without model-specific tuning
- Document any model-specific failure modes discovered

## Query Boundedness

Some queries are inherently harder for LLMs to bound correctly, regardless of skill quality.

### Bounded vs. Unbounded Queries

| Query Type | Example | LLM Behavior |
|------------|---------|--------------|
| **Bounded (works well)** | "All critical CVEs in 2025" | Clear scope, efficient navigation |
| **Unbounded (problematic)** | "CVEs in the last 12 months" | Over-fetches despite date math |
| **Pseudo-bounded (still problematic)** | "12 months starting Dec 2025, ending Dec 2024" | Explicit dates ignored; "12 months" triggers unbounded behavior |

### Why This Happens

Relative time expressions ("last N months", "past year") activate an unbounded mental model even when:
- Dates are explicitly provided
- Skills document correct filtering strategy
- The LLM articulates the correct approach before executing

The phrase "12 months" appears to override explicit date bounds in the same prompt.

### Implications for Skill Design

1. **Document which query patterns work well** — Skills should explicitly note that year-based queries are more efficient than relative-time queries
2. **Don't assume skills can fix this** — Some over-fetching is inherent to how LLMs process temporal language
3. **Design graphs for bounded queries** — Optimize navigation for "all X in [year]" over "X in last N months"

### Implications for Graph Design

Consider providing pre-aggregated views for common bounded queries:

```
timeline/
  2025/
    index.json          # All months
    cve-summary.json    # All CVEs in 2025 (pre-aggregated)
```

This lets bounded queries complete in fewer fetches, reducing the penalty for over-fetching on unbounded queries.

### Guidance for Users

Skills can suggest query reformulation, but users should understand:

| Instead of | Use |
|------------|-----|
| "CVEs in the last 12 months" | "CVEs in 2024 and 2025" |
| "Recent breaking changes" | "Breaking changes in .NET 10" |
| "Security patches since March" | "Security patches in 2025" |

This is a limitation of current LLMs, not a skill authoring failure.

## Anti-Patterns

### Skills That Straight-Jacket

**Symptom:** Skill prescribes exact steps for every scenario
**Problem:** LLM can't adapt when a better approach exists
**Solution:** Provide guidance and constraints, not rigid scripts

### Skills That Duplicate Schema

**Symptom:** Skill repeats information available in the data itself
**Problem:** Maintenance burden, drift between skill and data
**Solution:** Teach navigation to the data, not the data itself

### Skills That Over-Specify

**Symptom:** Skill covers edge cases that rarely occur
**Problem:** Token waste, cognitive load
**Solution:** Cover 80% of cases well; let LLM reason about edge cases

### Skills Without Stop Conditions

**Symptom:** LLM keeps fetching after it has the answer
**Problem:** Wasted tokens, potential for confusion
**Solution:** Explicit "STOP when..." conditions

### Skills That Assume Perfection

**Symptom:** No guidance for when things go wrong
**Problem:** LLM hallucinates or fails silently
**Solution:** "If data is missing, report the gap—don't fabricate"

## Versioning

Skills are versioned with the data they navigate. When the underlying schema changes:

1. Update affected skills in the same commit
2. Maintain backward compatibility where possible
3. Document breaking changes in skill content itself

URL references should use stable refs (e.g., `refs/heads/release-index`) rather than commit SHAs for maintainability.

## Governance

### Ownership

Each skill should have a clear owner responsible for:

- Accuracy of navigation guidance
- Maintenance as schema evolves
- Test suite completeness

### Review Criteria

Skill changes should be reviewed for:

- [ ] Brevity — Is every statement necessary?
- [ ] Specificity — Are instructions actionable?
- [ ] Stop conditions — Are they explicit?
- [ ] Common mistakes — Are failure modes documented?
- [ ] Test coverage — Are changes tested?

---

*This specification is itself a skill—it should follow the principles it prescribes.*
