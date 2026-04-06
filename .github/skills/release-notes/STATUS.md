# Release Notes Skill Status

Current state of the release-notes skill split, scoring rubric, and Preview 2/3 evaluation work as of 2026-04-06.

## Branch

- Working branch: `release-notes-agentic-workflow`

## Pipeline shape now

The monolithic release-notes flow has been split into reusable stages:

1. `generate-changes` — produce authoritative `changes.json` from VMR refs
2. `api-diff` / `dotnet-inspect` — verify public API stories and catch reverts
3. `generate-features` — produce scored `features.json`
4. `editorial-scoring` — shared rubric used by generator and reviewer
5. `review-release-notes` — critique the scored shortlist and the draft notes
6. `release-notes` — write the final markdown

## Schema decisions

`features.json` stays schema-compatible with `changes.json`, with optional enrichment fields:

- `score`
- `score_reason`
- `score_breakdown`
- `breaking_changes`

`breaking_changes` is separate from `score`:

- a high score means broad reader value
- `breaking_changes: true` means some users may need to react, even if the item is narrow
- low-score + `breaking_changes: true` should usually become a short end-of-notes callout, not a headline feature section

## Scoring and editorial calibration added

The shared rubric now encodes these rules:

- use the reader-centric `10 / 8 / 6 / 4 / 2 / 0` scale with the **80/20** audience filter
- compare new functionality to familiar tools when that helps readers place it quickly
  - example: `dotnet run -e FOO=BAR` can be framed as Docker-style env-var injection
- score down features with **stacked audience gates**
  - if a user must care about A, then B, then be willing to do C, the audience shrinks at each step
- score down thinly described items with internal-runtime cues like **cDAC**
- if the story depends on a **new public API**, we should be able to identify that API via API diff / `dotnet-inspect`
- if an "existing" feature is not part of the model's normal customer-facing understanding and is not easy to find in Learn docs, default to about a `1`
- bug fixes for obscure, unannounced, or low-demand features should usually stay around `1`
- old, internally filed, low-engagement bugs are evidence of low urgency, not hidden headline value
- several related low-score items can still justify **one grouped writeup**
  - examples: Roslyn **Unsafe evolution** and runtime **`[browser]`** improvements

## Preview 2 comparison result

A fresh Preview 2 run was generated from VMR tags and compared to the human-written notes.

Result:

- roughly **B+**
- strong overlap on the main human-selected items
- useful gaps identified:
  - some human-covered areas were underplayed or missed
  - MAUI and containers sit outside the VMR-driven source path and need separate sourcing
- useful possible omissions surfaced as well, including some Roslyn, NuGet, and MSBuild items

## Preview 3 rerun result

Fresh rerun worktree:

- `/tmp/core-preview3-rerun-79OjKk/release-notes/11.0/preview/preview3/features.json`

Rerun summary:

- `2,275` changes scored
- `5` scored `7+`
- `21` scored `5+`
- `17` flagged `breaking_changes`

Highest-value items in the rerun included:

- `dotnet run -e` environment-variable injection
- runtime-async dropping `RequiresPreviewFeatures`
- System.Text.Json naming/ignore additions
- file-based app `#:include`
- OpenAPI 3.2
- `RegexOptions.AnyNewLine`

Clusters preserved in the rerun:

- runtime-async
- System.Text.Json
- Roslyn Unsafe evolution
- browser / WebCIL / WASM runtime improvements

Notable low-score `breaking_changes` examples:

- EF Core `JsonExists` -> `JsonPathExists`
- EF Core migrations behavior changes
- BackgroundService exception propagation
- Zstandard API move
- certificate-download default changes

## Recommended next step

Review the rerun `features.json` above with `review-release-notes`, then decide whether the current rubric is strong enough to generate markdown directly or needs one more tightening pass.
