---
name: generate-features
description: >
  Generate `features.json` from `changes.json` by ranking and annotating shipped
  changes. `features.json` keeps the same schema as `changes.json` and adds
  optional scoring fields so release notes, docs, and blog posts can apply
  different cutoffs. Uses the shared `editorial-scoring` rubric. DO NOT USE
  FOR: regenerating VMR diffs (use generate-changes) or writing final markdown
  (use release-notes).
---

# Generate `features.json`

Create a scored, reusable feature list from `changes.json`.

This is the **triage stage** of the release notes pipeline. It turns the comprehensive manifest of shipped changes into a ranked set of candidates for external communication.

Use [`editorial-scoring`](../editorial-scoring/SKILL.md) as the canonical rubric. Do **not** invent a different notion of importance for this step.

## Purpose

`changes.json` answers **what shipped**.

`features.json` answers **what is worth talking about**, while staying schema-compatible with `changes.json` so the two files can be joined, diffed, and compared easily.

## Schema contract

`features.json` intentionally mirrors `changes.json`:

- same top-level fields: `release_version`, `release_date`, `changes`, `commits`
- same `id`, `repo`, `product`, and commit key structure
- same `commits{}` object so cross-file joins still work

The only additions are **optional enrichment fields** on change entries, such as:

- `score` (`number`) — higher means more likely to be documented
- `score_reason` (`string`) — short explanation of the score
- `score_breakdown` (`object`) — optional per-dimension scoring details
- `breaking_changes` (`bool`) — mark changes that users may need to react to, even when they are not headline items

This schema is intentionally loose and can grow as the workflow learns what it needs.

`breaking_changes` is **separate from score**. A change might only be a `3` or `4` on reader interest, but still need to be carried forward as a short migration note because it can affect people upgrading.

## Default scoring guidance

Use a consistent numeric scale within a file. The recommended starting point is **0-10**:

| Score | Reader reaction                                  | Typical outcome                        |
| ----- | ------------------------------------------------ | -------------------------------------- |
| `10`  | "This is the first feature I'll enable or test." | Lead story                             |
| `8+`  | "I'm going to use this when I upgrade."          | Strong release-note feature            |
| `6+`  | "I'm glad I know about this."                    | Good grouped release-note material     |
| `4+`  | "Someone will care; I can look it up later."     | Optional mention or grouping candidate |
| `2+`  | "This is a mystery to me."                       | Usually skip                           |
| `0`   | Internal gobbledygook                            | Never document                         |

See [`editorial-scoring`](../editorial-scoring/SKILL.md) for the shared rubric and [feature-scoring.md](../release-notes/references/feature-scoring.md) for the detailed heuristics.

Apply the **80/20 rule** from that document: prefer features that make sense to most upgraders, and only keep niche items when the broader audience can still appreciate why they matter.

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
- features whose value is obvious to a broad slice of users

If a change is important mainly because users need to adjust to it, set `breaking_changes: true` even if the score stays low. Do **not** inflate the score just to keep the item visible.

If several individually modest changes cluster around one theme, keep that cluster in mind as you score. Do **not** inflate each entry, but do preserve the related items so downstream writing can roll them up into one coherent feature writeup. Title prefixes and labels are often useful clues here, such as a set of `[browser]` runtime changes or multiple "Unsafe evolution" items.

Down-rank or exclude:

- infra and dependency churn
- test-only changes
- internal refactors with no user-facing impact
- reverts and partial work that did not survive into the build
- items that mostly require insider knowledge to understand why they matter

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
- **`release-notes`** can also surface low-scored entries with `breaking_changes: true` as one-line callouts in a breaking-changes section
- **`review-release-notes`** re-checks the scores against editorial examples and trims over-scored items
- **Docs/blog workflows** can apply their own cutoffs later
- Humans can adjust scoring without changing the source-of-truth shipped data
