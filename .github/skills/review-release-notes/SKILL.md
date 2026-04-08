---
name: review-release-notes
description: >
  Review `features.json` scores and draft release notes against the editorial
  examples and the shared `editorial-scoring` rubric. Use it to identify
  over-scored, under-scored, or missing features before publishing release
  notes. DO NOT USE FOR: generating `changes.json` or writing the first draft.
---

# Review Release Notes

Audit a scored `features.json` file and its markdown draft from the perspective of the **reader**, not the implementer.

This is the **editorial QA stage** of the pipeline. Its job is to make sure the release notes feel curated, legible, and exciting to the right audience — not like an API inventory.

This skill **reuses the shared rubric** from [`editorial-scoring`](../editorial-scoring/SKILL.md). It critiques the scoring; it does not invent a separate scoring philosophy.

## When to use

- After `generate-features` produced `features.json`
- After `release-notes` drafted the markdown
- When the selection feels too broad, too niche, or too internally focused
- When you want to compare the current draft against the examples and recalibrate the cut

## Inputs

Review these, in order:

1. `changes.json` — the source of truth for what shipped
2. `features.json` — the scored candidate list, if present
3. Draft markdown files (`libraries.md`, `runtime.md`, `sdk.md`, etc.)
4. Editorial examples in `references/examples/`
5. The scoring and quality bar references:
   - `../editorial-scoring/SKILL.md`
   - `references/feature-scoring.md`
   - `references/quality-bar.md`

If `features.json` does not exist yet, infer the current implicit scoring from:

- which features were promoted to headings
- how much space each feature received
- what was grouped into bug-fix buckets or omitted

## Core review questions

Use the shared rubric from [`../editorial-scoring/SKILL.md`](../editorial-scoring/SKILL.md)
rather than inventing a new one here. In particular:

- keep the same reader-centric `10 / 8 / 6 / 4 / 2 / 0` scale
- apply the same 80/20 audience filter
- compare the draft against the examples to see whether it still teaches instead
  of merely enumerating

### Example check

Compare the draft against the component examples:

- Does the length match the importance?
- Are medium-value items grouped instead of getting their own heavyweight sections?
- Are performance stories backed by evidence?
- Does the draft teach, not just enumerate?

## Common failure modes

- **Over-scoring** — too many `4-6` items are promoted to top-level sections
- **Under-explaining** — a real `8+` feature is present but buried or not framed clearly
- **API inventory mode** — the draft starts mirroring `api-diff` instead of telling a user story
- **Technical novelty bias** — clever implementation details outrank practical user value
- **Missed revert** — a promoted feature was later backed out or does not appear in the actual build

## Multi-model review pattern

For the final editorial QA pass, use this skill as a **two-reviewer parallel check** to get broader viewpoint diversity:

Preferred set:

1. **Claude Opus 4.6**
2. **GPT-5.4**

Give both reviewers the same inputs and the same requested output:

- most correct scoring
- most wrong scoring
- important omissions
- cut list

Then synthesize the overlap and disagreements. Treat consensus as a strong signal, but do **not** turn this into a blind vote — fidelity to `changes.json`, the shared `editorial-scoring` rubric, and the repo's editorial rules still wins.

## Reviewer checklist

Do not ask reviewers the vague question "do you like this?" Give them the same
specific checks instead:

1. **Which headings still sound vague, passive, anthropomorphic, or promotional?**
2. **Which sections fail the 80/20 reader-value test and should be cut, grouped, or demoted?**
3. **Which sentences infer feelings or outcomes (`trust`, `confidence`, `easier`, `better`) instead of stating the concrete change?**
4. **Which sections drift into API-inventory mode instead of teaching a user-facing story?**
5. **Which promoted items were later reverted, backed out, or are missing from the actual build/package set? Cite the revert PR or verification gap.**
6. **Which code samples or examples are weak, confusing, or unsupported by the text?**
7. **Which links, issue/PR references, or formatting details still violate house style?**
8. **What is the single highest-value rewrite still needed in the draft?**
9. **Is the wording conventional, or is it inventing non-standard phrasing or terms?**
10. **Are the subject and its adjective or adverb paired in a familiar way?**
11. **Would this phrasing seem normal in release notes for another developer platform?**
12. **If `release-notes/features.json` lists this feature, does the section begin with the standard preview blockquote?**

Ask reviewers to answer with file + heading + issue + suggested rewrite. This
produces actionable review instead of general taste feedback.

## Output

Return a concise review with:

1. **Most correct scoring** — the features that are best prioritized
2. **Most wrong scoring** — over-scored and under-scored items
3. **Important omissions** — items from `changes.json` / `features.json` that should likely be promoted
4. **Cut list** — what to group, compress, demote, or drop first

As a working rule of thumb:

- **8+** — section-worthy
- **6-7** — grouped paragraph or short section
- **0-5** — bug-fix bucket, one-liner, or cut
