# Feature Scoring

Use optional `score` fields in `features.json` to rank which shipped changes are
worth turning into release notes, docs, or blog content.

The score is a **decision aid**, not a hard rule. Editorial judgment still
matters.

Use [`../../editorial-scoring/SKILL.md`](../../editorial-scoring/SKILL.md) as
the **canonical source** for the shared reader-centric scale, thresholds, and
80/20 audience filter. This file adds the more specific heuristics that tend to
matter during .NET release-note triage.

## What increases a score

- **User-visible change** — new public API, CLI switch, behavior change, workflow improvement
- **Breadth of impact** — helps many developers, not just a narrow edge case
- **Clarity** — easy to explain with a short WHY+HOW description
- **Familiar anchor** — easier to understand because it maps to a tool or workflow readers already know
- **Evidence** — supported by API verification, tests, benchmarks, or a clear PR description
- **Documentation need** — developers may need guidance, migration notes, or examples

## What lowers a score

- Test-only or infra-only work
- Mechanical refactors with no user-facing impact
- Churn in dependencies or tooling internals
- Reverts, partial implementations, or APIs that do not appear in the actual build
- Changes too small or obscure to justify external attention
- **Stacked audience gates** — if the reader has to care about A, then B, then be willing to do C, the addressable audience shrinks at each step and the score should usually drop hard
- **Sparse evidence + internal hints** — if the PR barely explains the scenario and drops terms like cDAC, diagnostics plumbing, or runtime internals without a strong end-user story, treat it as near-internal by default
- **Invisible existing surface** — if the change is framed as a simplification or extension of an existing feature, but that feature is not visible in common model knowledge and not easy to find in Learn docs, default to about a `1` unless stronger customer evidence exists
- **No identifiable public API** — if the only apparent story is "there is a new API here" but you cannot point to a concrete new public type/member via API diff or `dotnet-inspect`, default to a `1` unless there is a separately strong behavior or workflow story
- **Bug fix for an unannounced feature** — if the work mostly fixes or rounds out a feature that customers were never really told about, treat it as a bug-fix-level item, often around a `1`
- **Low-demand bug history** — if the backing issue was filed internally, has little or no outside engagement, and sat for a long time, that is a signal the item likely belongs near `1`

## Good scoring behavior

- Score based on the **reader value of the shipped outcome**, not the effort involved
- Ask whether a typical upgrader immediately understands why the feature matters
- Use a short comparison to a familiar tool or workflow when it makes the value legible faster (for example, comparing CLI env-var injection to Docker's `-e` pattern)
- Discount aggressively for **compound niche scenarios**. "Single-file publishers who deeply care about startup and are willing to do training/tuning work" is much smaller than "people who publish single-file apps."
- Aggressively score down items that mostly read like internal plumbing or jargon
- If the strongest concrete clue is an internal term like **cDAC**, assume the feature is for runtime/tooling internals unless there is clear evidence of mainstream developer value
- For an **existing** feature area, ask two quick questions: "Would the model already recognize this as a real customer scenario?" and "Can I find it in Learn docs?" If both answers are effectively no, treat the item as a `1` by default
- For an API-centric entry, name the actual public API. If you cannot identify the new public surface area, do not score it like a real API feature
- Do not promote a **bug fix for an obscure or previously unannounced feature** into a release-note feature just because the subsystem sounds interesting
- Treat **issue provenance and engagement** as demand signals. An old bug filed by an internal architect with zero reactions is evidence of low urgency, not hidden headline value
- Consider **cluster value**, not just single-entry value. Several related `2-4` items can earn one grouped writeup when together they tell a coherent story (for example, a set of "Unsafe evolution" changes or a cluster of `[browser]` runtime improvements)
- Keep niche items only when they still impress or educate the broader audience
- A community contribution can lift a borderline item slightly, but it does **not** turn a niche optimization into a headline feature by itself
- Re-check scores after `api-diff` / `dotnet-inspect` confirms or disproves the public API story
- Prefer a short `score_reason` grounded in evidence over long prose
- It is okay for many entries to have low scores; `changes.json` is comprehensive, `features.json` is selective
