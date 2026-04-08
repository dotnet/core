---
name: editorial-scoring
description: >
  Apply the shared reader-centric rubric used to rank candidate features for
  release notes, blog posts, and docs. Use this when you need scoring and cut
  guidance independent of any one output format or task.
---

# Editorial Scoring

Use this skill whenever you need to answer **"How important is this to a reader?"**

This skill is intentionally **rubric-focused, not task-focused**. It does not generate files on its own. Instead, it provides the shared editorial calibration that other skills should reuse:

- `generate-features` — assigns the first-pass scores
- `review-release-notes` — audits and recalibrates those scores
- `release-notes` — uses the resulting cut to decide what gets written up
- future blog/docs workflows — can reuse the same rubric with different thresholds

This is the **canonical home** for the shared scoring scale and 80/20 audience
filter. Other release-notes docs should point back here instead of restating the
rubric in full.

## Core question

Score from the perspective of a developer upgrading to the new release — not from the perspective of the engineer who implemented the feature.

## Reader-centric scale

| Score | Reader reaction                                                                  | What to do with it                                         |
| ----- | -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `10`  | "This is the first feature I'll enable or test."                                 | Lead story                                                 |
| `8+`  | "I'm going to use this when I upgrade."                                          | Strong release-note feature                                |
| `6+`  | "I'm glad I know about this. It will likely come in handy."                      | Good grouped release-note material                         |
| `4+`  | "I can see how someone could use this. I'll look up the docs if I ever need it." | Optional mention, grouping candidate, or short paragraph   |
| `2+`  | "This one is a mystery to me."                                                   | Usually skip unless stronger explanation changes the score |
| `0`   | "This is total gobbledygook — internal .NET engineering work."                   | Cut it from public-facing content                          |

## 80/20 audience filter

Default to features that make sense to roughly **80% of the audience**.

Keep a more specialized feature for the other **20%** only when the remaining 80% can still understand why it matters and react with something like:

> "Not for me, but I'm glad that's there for the people who need it."

This is how foundational but initially niche work can still earn a good score.

## Strong positive signals

- New public APIs with obvious user value
- CLI or workflow improvements developers will notice right away
- Features that are easy to explain by anchoring them to a familiar tool or workflow
- Clear performance, reliability, or usability wins
- Features people have been asking for
- Changes that require docs, migration notes, or examples to use well

## Strong negative signals

- Test-only work
- Build or infrastructure churn
- Refactoring with no user-visible effect
- VMR sync noise, dependency updates, or repo automation
- Product-boundary mismatch — repo-adjacent IDE/editor/design-time tooling work when the notes are for a different product surface
- Highly specialized implementation details that read like internal jargon
- Features that only matter after several stacked conditions are true (for example: uses single-file publish **and** cares deeply about startup **and** is willing to do extra training/tuning)
- PRs with very thin descriptions where the only concrete signal is an internal runtime/tooling term like cDAC
- Existing niche surfaces that are barely documented and are not part of the model's normal customer-facing understanding
- Claimed "new API" features where the actual new public API cannot be identified
- Bug fixes for features that were never really announced or are still obscure to most readers
- Old, low-engagement bugs filed internally that sat for a long time without clear external demand

## Common scoring mistakes

- **Technical novelty bias** — "this is clever" is not the same as "users will care"
- **API inventory mode** — listing everything from an API diff is not release-note curation
- **Effort bias** — a difficult implementation may still score low if the reader value is small
- **Insider-language inflation** — terms like JIT, LSRA, cDAC, intrinsics, or pipeline details can sound impressive but still be a `0-4` unless the value is explained clearly
- **Audience multiplication blindness** — when a feature requires several independent interests or behaviors, multiply those filters together instead of scoring the broadest prerequisite alone
- **Description vacuum optimism** — if the PR does not explain the user scenario, do not fill in the blanks with a generous story
- **Documentation blindness** — if an "existing" feature is not findable in Learn docs and does not show up as a known customer scenario, that is a signal to score it around `1`, not to assume hidden importance
- **Phantom API stories** — if you cannot identify the concrete new public API, do not give API credit based on a vague title alone
- **Promotion by association** — a fix in a glamorous subsystem is still just a `1` if it only patches an unannounced or niche feature
- **Demand inversion** — do not mistake an old internal bug with no reactions for evidence that many users need to hear about the fix
- **Fragmentation bias** — do not dismiss each small related item in isolation when several `2-4` items together form one intelligible reader story, such as a cluster of "Unsafe evolution" changes

## Working thresholds

- **8+** — worthy of its own section
- **6-7** — usually grouped with similar items, sometimes a short standalone section
- **0-5** — bug-fix bucket, one-liner, or cut

Several `3-5` items in the same area can still combine into **one** worthwhile writeup. Keep the individual scores honest, then let the writing stage roll them up into a single themed section.

## Breaking changes are separate from score

Use score for **reader interest/value**, and use `breaking_changes: true` for **reaction/migration significance**.

That means:

- a **low-score breaking change** often still deserves a short end-of-notes callout
- a **high-score breaking change** may deserve both a full feature writeup and a migration note

Do **not** inflate a narrow breaking change to `7+` just to keep it visible.

## Canonical references

- [`../release-notes/references/feature-scoring.md`](../release-notes/references/feature-scoring.md) — detailed scoring guidance
- [`../release-notes/references/quality-bar.md`](../release-notes/references/quality-bar.md) — what good release notes look like
- [`../release-notes/references/examples/README.md`](../release-notes/references/examples/README.md) — editorial examples and why they work
