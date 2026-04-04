---
name: generate-features
description: >
  Generate `features.json` from `changes.json` by ranking and annotating shipped
  changes. `features.json` keeps the same schema as `changes.json` and adds
  optional scoring fields so release notes, docs, and blog posts can apply
  different cutoffs. DO NOT USE FOR: regenerating VMR diffs (use
  generate-changes) or writing final markdown (use release-notes).
---

# Generate `features.json`

Create a scored, reusable feature list from `changes.json`.

This is the **triage stage** of the release notes pipeline. It turns the comprehensive manifest of shipped changes into a ranked set of candidates for external communication.

## Purpose

`changes.json` answers **what shipped**.

`features.json` answers **what is worth talking about**, while staying schema-compatible with `changes.json` so the two files can be joined, diffed, and compared easily.

## Schema contract

`features.json` intentionally mirrors `changes.json`:

- same top-level fields: `release_version`, `release_date`, `changes`, `commits`
- same `id`, `repo`, `product`, and commit key structure
- same `commits{}` object so cross-file joins still work

The only additions are **optional enrichment fields** on change entries, such as:

| Field             | Type   | Purpose                                   |
| ----------------- | ------ | ----------------------------------------- |
| `score`           | number | Higher means more likely to be documented |
| `score_reason`    | string | Short explanation of the score            |
| `score_breakdown` | object | Optional per-dimension scoring details    |

This schema is intentionally loose and can grow as the workflow learns what it needs.

## Default scoring guidance

Use a consistent numeric scale within a file. The recommended starting point is **0-10**:

| Score  | Meaning                                       | Typical outcome                                    |
| ------ | --------------------------------------------- | -------------------------------------------------- |
| `9-10` | Marquee, broadly useful, clearly user-visible | Strong candidate for blog, docs, and release notes |
| `7-8`  | Strong release-note feature                   | Usually document in release notes; maybe docs      |
| `4-6`  | Moderate or niche value                       | Mention if space and audience justify it           |
| `1-3`  | Low-signal or narrowly scoped                 | Usually skip in public-facing summaries            |
| `0`    | Infra, tests, refactoring, or pure churn      | Do not document                                    |

See [feature-scoring.md](../release-notes/references/feature-scoring.md) for the heuristics.

## Process

### 1. Start from `changes.json`

Do **not** invent features from memory, roadmaps, or PR titles found elsewhere. Everything in `features.json` must trace back to `changes.json`.

### 2. Score what shipped

Look for signals such as:

- new public APIs or meaningful behavioral changes
- developer productivity wins
- performance work with clear user impact
- compatibility or migration significance
- changes that need docs or samples to be usable

Down-rank or exclude:

- infra and dependency churn
- test-only changes
- internal refactors with no user-facing impact
- reverts and partial work that did not survive into the build

### 3. Use API evidence to refine the score

If a change depends on public APIs, use `api-diff` / `dotnet-inspect` to confirm the API exists in the actual build. Missing or reverted APIs should be scored down or excluded.

### 4. Write `features.json`

The output typically lives next to `changes.json`:

```text
release-notes/{major.minor}/preview/{previewN}/features.json
release-notes/{major.minor}/{major.minor.patch}/features.json
```

Keep the file mechanically friendly:

- preserve the same IDs and commit keys when possible
- make `score` optional, not required
- keep `score_reason` brief and evidence-based

## How downstream skills use it

- **`release-notes`** uses higher-scored entries to draft markdown
- **Docs/blog workflows** can apply their own cutoffs later
- Humans can adjust scoring without changing the source-of-truth shipped data
