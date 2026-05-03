---
name: release-notes
description: Generate and maintain .NET release notes from `features.json`. Uses `generate-changes` for authoritative shipped-change data, `generate-features` for scoring/triage, `update-existing-branch` for incremental reruns on populated branches, `editorial-scoring` for the shared rubric, `api-diff`/`dotnet-inspect` for API verification, and a multi-model `review-release-notes` pass for final editorial QA.
compatibility: Requires GitHub MCP server or gh CLI for cross-repo queries. Pairs with the generate-changes, generate-features, update-existing-branch, editorial-scoring, api-diff, and review-release-notes skills. Claude Opus 4.6 is the default workflow model; the preferred final reviewer pair is Claude Opus 4.6 + GPT-5.4 for broader editorial feedback.
---

# .NET Release Notes

Generate and maintain release notes for .NET preview, RC, and GA releases.

This skill is the **editorial writing stage** of the pipeline. It turns a scored `features.json` file into the markdown that ships in this repository.

## How it works

1. `generate-changes` diffs `source-manifest.json` between VMR refs to produce `changes.json`
2. `generate-features` reads `changes.json`, resolves revert/backout relationships, and emits `features.json` with optional scores using the shared `editorial-scoring` rubric
3. `update-existing-branch` handles incremental reruns when a milestone branch already exists, merging deltas instead of restarting from scratch
4. `api-diff` / `dotnet-inspect` verifies public APIs and confirms suspect features still exist in the shipped build
5. `release-notes` writes curated markdown using the higher-value entries from `features.json`
6. `review-release-notes` runs a final multi-model editorial QA pass against the scoring rubric and examples
7. Output is a set of pull requests per release milestone in dotnet/core: a base PR that holds shared metadata (`changes.json`, `features.json`, `README.md`, `build-metadata.json`) and one PR per component file. Each component PR targets the base branch so component teams review and edit their file in isolation. See [`pr-layout.md`](references/pr-layout.md) for the full layout and naming scheme.

## Local testing (no PRs)

To dry-run the skill against a milestone, only create the branch set locally. Don't push the branches or create the PRs.

## Existing-branch reruns

When the milestone branch set already exists and contains drafted markdown, invoke
[`update-existing-branch`](../update-existing-branch/SKILL.md). That shared
skill is the canonical playbook for refreshing `changes.json`, merging the delta
into `features.json`, integrating new material into existing sections, and
handling review comments without clobbering human edits.

## Reference documents

- [quality-bar.md](references/quality-bar.md) — what good release notes look like
- [vmr-structure.md](references/vmr-structure.md) — VMR branches, tags, source-manifest.json
- [pr-layout.md](references/pr-layout.md) — base + per-component branch layout
- [../update-existing-branch/SKILL.md](../update-existing-branch/SKILL.md) — how to refresh a populated milestone branch set incrementally
- [changes-schema.md](references/changes-schema.md) — the shared `changes.json` / `features.json` schema
- [../editorial-scoring/SKILL.md](../editorial-scoring/SKILL.md) — the reusable scoring rubric and cut guidance
- [feature-scoring.md](references/feature-scoring.md) — how to score and cut features
- [component-mapping.md](references/component-mapping.md) — components, product slugs, output files
- [format-template.md](references/format-template.md) — markdown document structure
- [editorial-rules.md](references/editorial-rules.md) — tone, attribution, naming
- [api-verification.md](references/api-verification.md) — using dotnet-inspect to verify APIs
- [examples/](references/examples/) — curated examples from previous releases, organized by component. **Read the examples for your component before writing.** The [examples/README.md](references/examples/README.md) lists 12 editorial principles derived from what works and what doesn't in past release notes.
