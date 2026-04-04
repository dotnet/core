---
name: release-notes
description: Generate and maintain .NET release notes from `features.json`. Uses `generate-changes` for authoritative shipped-change data, `generate-features` for scoring/triage, and `api-diff`/`dotnet-inspect` for API verification before writing curated markdown for the final notes.
compatibility: Requires GitHub MCP server or gh CLI for cross-repo queries. Pairs with the generate-changes, generate-features, and api-diff skills.
---

# .NET Release Notes

Generate and maintain release notes for .NET preview, RC, and GA releases.

This skill is the **editorial writing stage** of the pipeline. It turns a scored `features.json` file into the markdown that ships in this repository.

## How it works

1. `generate-changes` diffs `source-manifest.json` between VMR refs to produce `changes.json`
2. `generate-features` reads `changes.json` and emits `features.json` with optional scores
3. `api-diff` / `dotnet-inspect` verifies public APIs and catches missed reverts
4. `release-notes` writes curated markdown using the higher-value entries from `features.json`
5. Output is one PR per release milestone in dotnet/core, maintained incrementally

## Design

- [DESIGN.md](DESIGN.md) — architecture, rationale, and how all the pieces connect

## Reference documents

- [quality-bar.md](references/quality-bar.md) — what good release notes look like
- [vmr-structure.md](references/vmr-structure.md) — VMR branches, tags, source-manifest.json
- [changes-schema.md](references/changes-schema.md) — the shared `changes.json` / `features.json` schema
- [feature-scoring.md](references/feature-scoring.md) — how to score and cut features
- [component-mapping.md](references/component-mapping.md) — components, product slugs, output files
- [format-template.md](references/format-template.md) — markdown document structure
- [editorial-rules.md](references/editorial-rules.md) — tone, attribution, naming
- [api-verification.md](references/api-verification.md) — using dotnet-inspect to verify APIs
- [examples/](references/examples/) — curated examples from previous releases, organized by component. **Read the examples for your component before writing.** The [examples/README.md](references/examples/README.md) lists 12 editorial principles derived from what works and what doesn't in past release notes.
