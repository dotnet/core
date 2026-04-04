# Feature Scoring

Use optional `score` fields in `features.json` to rank which shipped changes are worth turning into release notes, docs, or blog content.

The score is a **decision aid**, not a hard rule. Editorial judgment still matters.

## Recommended scale

Use a consistent numeric scale within each file. The current default is **0-10**, where higher means "more worth documenting."

| Score  | Meaning                                               | Typical surface                 |
| ------ | ----------------------------------------------------- | ------------------------------- |
| `9-10` | Marquee feature with broad appeal or major user value | Blog, docs, and release notes   |
| `7-8`  | Strong externally visible improvement                 | Release notes and possibly docs |
| `4-6`  | Moderate or niche feature                             | Optional release notes mention  |
| `1-3`  | Minor or low-signal change                            | Usually skip                    |
| `0`    | Noise: infra, tests, churn, refactor-only             | Never document                  |

## What increases a score

- **User-visible change** — new public API, CLI switch, behavior change, workflow improvement
- **Breadth of impact** — helps many developers, not just a narrow edge case
- **Clarity** — easy to explain with a short WHY+HOW description
- **Evidence** — supported by API verification, tests, benchmarks, or a clear PR description
- **Documentation need** — developers may need guidance, migration notes, or examples

## What lowers a score

- Test-only or infra-only work
- Mechanical refactors with no user-facing impact
- Churn in dependencies or tooling internals
- Reverts, partial implementations, or APIs that do not appear in the actual build
- Changes too small or obscure to justify external attention

## Good scoring behavior

- Score based on the **shipped outcome**, not the effort involved
- Re-check scores after `api-diff` / `dotnet-inspect` confirms or disproves the public API story
- Prefer a short `score_reason` grounded in evidence over long prose
- It is okay for many entries to have low scores; `changes.json` is comprehensive, `features.json` is selective
