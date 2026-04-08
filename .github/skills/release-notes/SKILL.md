---
name: release-notes
description: Generate and maintain .NET release notes from `features.json`. Uses `generate-changes` for authoritative shipped-change data, `generate-features` for scoring/triage, `editorial-scoring` for the shared rubric, `api-diff`/`dotnet-inspect` for API verification, and a multi-model `review-release-notes` pass for final editorial QA.
compatibility: Requires GitHub MCP server or gh CLI for cross-repo queries. Pairs with the generate-changes, generate-features, editorial-scoring, api-diff, and review-release-notes skills. Claude Opus 4.6 is the default workflow model; the preferred final reviewer pair is Claude Opus 4.6 + GPT-5.4 for broader editorial feedback.
---

# .NET Release Notes

Generate and maintain release notes for .NET preview, RC, and GA releases.

This skill is the **editorial writing stage** of the pipeline. It turns a scored `features.json` file into the markdown that ships in this repository.

## How it works

1. `generate-changes` diffs `source-manifest.json` between VMR refs to produce `changes.json`
2. `generate-features` reads `changes.json`, resolves revert/backout relationships, and emits `features.json` with optional scores using the shared `editorial-scoring` rubric
3. `api-diff` / `dotnet-inspect` verifies public APIs and confirms suspect features still exist in the shipped build
4. `release-notes` writes curated markdown using the higher-value entries from `features.json`
5. `review-release-notes` runs a final multi-model editorial QA pass against the scoring rubric and examples
6. Output is one PR per release milestone in dotnet/core, maintained incrementally

## Behavior on an existing PR branch

When the milestone branch already exists and contains drafted markdown, treat that
branch as the **working baseline**, not as a blank slate.

- read the existing markdown, recent human commits, and unresolved review comments first
- preserve human edits and reviewer-driven rewrites
- prefer surgical updates over whole-file rewrites
- only regenerate or replace an entire file when it is still clearly agent-authored and untouched by humans
- push follow-up changes to the existing milestone branch/PR instead of creating a replacement PR

## Reference documents

- [quality-bar.md](references/quality-bar.md) — what good release notes look like
- [vmr-structure.md](references/vmr-structure.md) — VMR branches, tags, source-manifest.json
- [changes-schema.md](references/changes-schema.md) — the shared `changes.json` / `features.json` schema
- [../editorial-scoring/SKILL.md](../editorial-scoring/SKILL.md) — the reusable scoring rubric and cut guidance
- [feature-scoring.md](references/feature-scoring.md) — how to score and cut features
- [component-mapping.md](references/component-mapping.md) — components, product slugs, output files
- [format-template.md](references/format-template.md) — markdown document structure
- [editorial-rules.md](references/editorial-rules.md) — tone, attribution, naming
- [api-verification.md](references/api-verification.md) — using dotnet-inspect to verify APIs
- [examples/](references/examples/) — curated examples from previous releases, organized by component. **Read the examples for your component before writing.** The [examples/README.md](references/examples/README.md) lists 12 editorial principles derived from what works and what doesn't in past release notes.
