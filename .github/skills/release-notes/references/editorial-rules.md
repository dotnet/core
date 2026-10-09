# Editorial Rules

Tone, attribution, and content guidelines for .NET release notes.

## Tone

- **Positive** — highlight what's new, don't dwell on what was missing
  - ✅ `ProcessExitStatus provides a unified representation of how a process terminated.`
  - ❌ `Previously, there was no way to determine how a process terminated.`
- When context about the prior state is needed, keep it brief — one clause, then pivot to the new capability
- Celebrate important capabilities through concrete developer possibilities. Put benefit-focused narrative in the body, not invented feature branding in headings.
- **Don't editorialize beyond the facts** — state what concretely changed ("enabled by default", "no longer requires opt-in") rather than making claims you can't back up ("ready for production use", "signals maturity"). If a PR removes a preview attribute, say that. Don't interpret it as a promise.
  - ✅ `Runtime-async is now enabled by default for anyone targeting net11.0.`
  - ❌ `This signals that runtime-async is ready for production use.`
- **Prefer concrete deltas over inferred outcomes** — say what changed and, if useful, the direct consequence for a real scenario. Avoid claims about trust, confidence, convenience, or behavior unless the source explicitly supports them.
  - ✅ `Regex recognizes all Unicode newline sequences.`
  - ✅ `Tar extraction now rejects entries that would write outside the destination directory.`
  - ✅ `Tar extraction now rejects path traversal entries, helping applications avoid overwriting files outside the target folder.`
  - ❌ `Compression and archive handling are easier to trust.`
  - ❌ `You can extract archives without worrying about attacks.`
- **Prefer short, direct sentences** — If a sentence has a parenthetical clause (`which...`, `where...`, `that...`) longer than a few words, split it into two sentences. Lead with the news, follow with context. Long sentences are fine when they flow as a single continuous thought (what → why); they're not fine when a subordinate clause interrupts the main verb.
  - ✅ `Runtime-async is now enabled for NativeAOT. This eliminates the state-machine overhead of async/await for ahead-of-time compiled applications.`
  - ❌ `The runtime-async feature, which eliminates the state-machine overhead of async/await, is now enabled for NativeAOT.`
  - ✅ `The JIT now generates ARM64 SM4 and SHA3 instructions directly, enabling hardware-accelerated implementations on capable processors.` (long but flows — one thought)

## Familiar comparisons

- When a feature matches a workflow developers already know from another tool, say so. A short comparison can make the value obvious faster than a longer explanation.
- Use the comparison to **anchor the mental model**, not to claim perfect parity. Say what is similar, then explain the .NET-specific behavior.
- Prefer common tools and workflows the reader is likely to know already (for example Docker, GitHub Actions, shell usage, or package managers). Skip the comparison if it feels forced or more obscure than the feature itself.

  - ✅ `dotnet run -e FOO=BAR` gives you Docker-style CLI environment-variable injection for local app runs, so you can test configuration changes without editing shell state or launch profiles.
  - ❌ `dotnet run` now works just like Docker. (overstates the similarity)

## Entry naming

- Use the **established feature name** when one exists, especially for long-running preview features. If `release-notes/features.json` lists an `official_name`, use that in headings and prose. Treat aliases as match-only metadata, not as the default wording.
  - ✅ `## Unsafe Evolution remains a preview feature in .NET 11`
  - ✅ `## Unsafe Evolution adds clearer diagnostics in Preview 3`
  - ❌ `## Memory Safety v2 adds clearer diagnostics in Preview 3`
  - ❌ `## Unsafe code adds clearer diagnostics and annotations`
- When no established name exists, prefer a **brief description** of what the feature does over the API name alone
  - ✅ `## Support for Zstandard compression`
  - ✅ `## Faster time zone conversions`
  - ❌ `## ZstandardStream`
  - ❌ `## TimeZoneInfo performance`
- Prefer **specific, customer-facing verbs** over generic `gets` phrasing. Name the capability the customer now has: `offers`, `adds`, `supports`, `recognizes`, `enables`, and similar verbs are usually stronger.
  - ✅ `## System.Text.Json offers more control over naming and ignore defaults`
  - ✅ `## Regex recognizes all Unicode newline sequences`
  - ❌ `## System.Text.Json gets more control over naming and ignore defaults`
- Avoid anthropomorphic or club-like transition verbs such as `joins` when a more literal term is available. Prefer `moves to`, `is now in`, `adds support for`, or `supports`.
  - ✅ `## Zstandard moved to System.IO.Compression and ZIP reads validate CRC32`
  - ❌ `## Zstandard joins System.IO.Compression and ZIP reads validate CRC32`
- Keep headings concise — 3–8 words

## Benchmarks

- Use source-backed measurements. Preserve exact values when quoting raw results.
- Accurate author-provided summaries can use rounded values for readability. Check them against the source and avoid invented precision.
- Name the metric: allocated bytes, allocation counts, retained heap, peak memory/RSS, CPU time, or elapsed time.
- State the workload, hardware, baseline, and comparison cohort. Distinguish source-built payloads from official SDKs. Identify changed compiler, library, runtime, or packaging inputs.
- Include specific before/after measurements when compelling
- Preserve regressions and limitations. Do not sum unrelated workload deltas or claim universal speedups or future performance.
- Do **not** embed full BenchmarkDotNet tables — summarize in prose

Separate public-library optimizations from compiler, compiler services (FCS), and IDE memory improvements.
FSharp.Core optimizations can benefit compiled applications.
State each audience and adoption path. Group related compiler changes across PRs into coherent categories with representative evidence.

## What to include

- **Shared audience filter** — apply the 80/20 rule from `editorial-scoring`; don't redefine a competing threshold here. Keep narrower items only when the broader audience can still see why they matter.
- **The two-sentence test** — use a thin explanation as a signal to inspect reader value, not an automatic length cutoff. Apply the shared rubric to compact capabilities and author-facing foundations. An internal fix alone does not justify a feature.
- **Headlines should convey value** — preserve established names first. Without an established name, prefer headings that state the capability or benefit. A heading like "GC regions on macOS" doesn't tell the reader whether this is good or bad. Prefer "GC regions enabled on macOS" or "Server GC memory model now available on macOS."
- **Product-boundary rule** — exclude higher-level IDE, editor, or design-time tooling features from product notes unless the release is specifically about that tooling surface. For example, a Razor editor code action should not be presented as an ASP.NET Core feature just because it is adjacent to the web stack.
- **TODO for borderline entries** — when a feature might deserve inclusion but you lack data to justify it (benchmark numbers, real-world impact, user demand), keep the entry but add an HTML `<!-- TODO -->` comment asking for the missing information. This is better than silently including a vague claim or silently cutting something that might matter. The TODO should state what's needed and link to the PR where the data might live.
- **Breaking changes are separate from hype** — a breaking change can be important even when it is not exciting. Keep the score honest; use `breaking_changes: true` to preserve a short callout instead of inflating the item into a headline feature.
- **Clusters can be stronger than the parts** — several related low-score items can justify one section when together they tell a clear story. Keep the individual scores honest, then merge them into one writeup instead of emitting several weak mini-features. Good examples include a group of "Unsafe evolution" changes or multiple runtime entries prefixed with `[browser]`.

## Feature ordering

Follow explicit user priorities first. Otherwise, use these three tiers:

1. **Broad interest first** — features most developers will care about go at the top. A new `RegexOptions` value ranks above an ARM64-only instruction set.
2. **Cluster related features** — group related items together even if they differ in importance. All Regex work in one block, all System.Text.Json work in another, all JIT work together. Readers scan by area.
3. **Alphabetical within a cluster** — when features within a cluster have roughly equal weight, alphabetical order makes them scannable.

Use PR and issue reaction counts as a signal for tier 1, but apply judgment — a niche feature with 100 reactions may still rank below a broadly useful one with 10.

Keep the opening list and body in the same order. Match section length to importance and predecessor articles, not a fixed feature quota.

## Community attribution

### Inline

When a documented feature was contributed externally:

```markdown
Thank you [@username](https://github.com/username) for this contribution!
```

### Community contributors section

At the bottom of each component's notes, list ALL external contributors — not just those with documented features. Any community contributor with **one or more merged PRs** in the milestone should get a mention exactly once in the **Community contributors** section, even if none of their work was promoted into a feature writeup. Use the `community-contribution` label as a strong signal, but do not rely on it exclusively if the merged PR history shows a clear external contribution.

**Vet the list** — the `community-contribution` label is sometimes wrong. Exclude usernames containing `-msft`, `-microsoft`, or other Microsoft suffixes. Also exclude bot/automation accounts such as `Copilot`, `dependabot`, `github-actions`, and any account whose name ends in `[bot]` — these aren't community contributors and their profile URLs often don't resolve (e.g. `https://github.com/Copilot` returns 404). When in doubt about whether someone is a Microsoft employee, leave them out of the community list.

**Scope `dotnet/aspnetcore` links to the milestone.** That repo tags every PR with a release milestone (e.g. `11.0-preview4`), so the contributor link should append `+milestone%3A<slug>` to limit it to this milestone's contributions. Look up the exact slug with `gh pr view <pr> --repo dotnet/aspnetcore --json milestone`. Most other source repos don't apply milestones consistently — for those, omit the filter and link to the author's merged PRs without scope.

```markdown
## Community contributors

Thank you contributors! ❤️

- [@username](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Ausername+milestone%3A<slug>)
- [@username](https://github.com/<other-owner>/<other-repo>/pulls?q=is%3Apr+is%3Amerged+author%3Ausername)
```

## Bug fixes section

After features but before community contributors, include a bug fix summary when there are noteworthy fixes.

Group the fixes by namespace or area, with a **flat list of one bullet per fix** under each group. Each bullet is a single markdown link whose target is the PR that made the fix and whose display text is a cleaned-up version of the PR or issue title:

```markdown
## Bug fixes

- **System.Net.Http**
  - [Fix authenticated proxy credential handling](https://github.com/dotnet/runtime/pull/123363)
- **System.Collections**
  - [Fix integer overflow in ImmutableArray range validation](https://github.com/dotnet/runtime/pull/124042)
```

Rules:

- **One fix per bullet.** If a single behavior was fixed by several PRs, give each PR its own bullet rather than bundling links into one sentence.
- **Link to the PR**, not the issue, even when the issue has the better title. Take the wording from whichever reads more clearly and point the link at the PR.
- **Group by namespace or area**, exactly one level deep. Use the namespace where the component has one (`System.Text.Json`), otherwise a feature area (`Blazor`, `JIT / code generation`).
- **No trailing prose.** The bullet is the link and nothing else — no explanation after it, and no `org/repo #number` citation, since the link already carries that.

This overrides the general `org/repo #number` citation style used elsewhere in the notes; that style still applies in feature sections and breaking changes.

Cleaning up the title means making it read as a plain description of the fix:

- Drop branch and process prefixes (`[release/11.0]`, `[main]`, backport markers).
- Drop trailing issue references (`(#12345)`, `Fixes #123`).
- Expand cryptic shorthand into words a reader outside the team would recognize.
- Keep it a single line. If the title is unintelligible without context, rewrite it as a short description of the fix rather than pasting the raw title.

Don't include test-only, CI, or infra fixes.

## Preview-to-preview feedback fixes

Include a bug fix when ALL of these apply:

1. The issue was filed after the previous preview shipped
2. It was reported by someone outside the team
3. A fix shipped in the current preview

Frame positively: "Based on community feedback, X now does Y."

If the fix is for a feature that was never really announced or is still obscure to most readers, do **not** turn that fix into a standalone feature entry. It usually belongs in the bug-fix bucket, and often scores around `1`.

## Preview-to-preview deduplication

Read the published predecessor articles, not only the current draft or PR titles.
Omit unchanged material and unnecessary carry-forward reminders, including preview-status reminders.

When prior previews already documented a feature, don't repeat the same information. But **do** document significant state changes in the current preview. A feature that was introduced as opt-in in P1 and is now enabled by default in P3 is new news — document the change in state, not the feature from scratch.

Ask: "What changed about this feature since the last preview's release notes?" If the answer is meaningful to users (enabled by default, no longer experimental, major perf improvement, new sub-features), write about that. If the answer is just "more PRs landed in the same area," skip it.

Examples:

- ✅ "Runtime-async is now enabled by default for anyone targeting `net11.0`." (state change: opt-in → default)
- ✅ "The Regex source generator now handles alternations 3× faster." (new perf data)
- ❌ Repeating the full explanation of what runtime-async is from P1 (already documented)
- ❌ "More JIT optimizations landed this preview." (no specific news)

## Companion reports and supplied articles

- Keep a useful feature summary when adding a deeper report. Add a concise sibling link that explains the report's value.
- When requested or important, add an inline read-more link in the opening TOC without changing feature order.
- Check supplied article packages for required assets, all references, and provenance before import.
- Copy only the approved article and required media. Follow the existing media layout and retain stable source and citation links.
- Do not run arbitrary supplied generators. Publication approval does not include datasets, generators, READMEs, archives, or experiment scaffolding.
- Report missing methodology or raw-result references while the user can retrieve them. Do not invent evidence URLs.
- If evidence remains missing, obtain explicit publication approval and record the limits. That approval applies only to that report.
- Describe author-provided or source-built measurements accurately. Publication approval alone does not establish independent verification or public reproducibility.

Keep the milestone index navigation-only unless explicitly requested otherwise.
Follow [the index contract](format-template.md#readmemd-index-file), not an inferred prohibition from one observed example.

## Link validation

- Check relative links, heading anchors, images, remote PR/source targets, and redirects.
- If GitHub page checks are blocked, use the authenticated API to establish object existence.
- Do not count ignored targets or HTTP 429 as confirmed availability. Record unavailable checks separately from passed checks.
- After renaming headings or moving or deleting files, update affected references and relative media paths.

## Filtered features

When you cut a feature for failing the 20/80 rule or two-sentence test, record it in an HTML comment block in the output file. This creates a learning record — future runs and human reviewers can see what was considered and why it was excluded.

Place the comment block immediately before the Bug fixes section:

```html
<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Feature name: one-sentence description of the work. Why it was cut.
  - Another feature: description. Reason.
-->
```

Good filter reasons:

- **Internal infrastructure** — "Implementation detail of the Mono → CoreCLR unification. Developers don't target the interpreter."
- **Too narrow** — "Only affects COM interop startup — very narrow audience."
- **Engineering fix, not a feature** — "Two sentences max. No user-visible behavior change beyond a perf number."
- **Provider extensibility** — "Only matters to database provider authors, not EF Core users."

The comment is invisible to readers but preserved in the file for the next person (or agent) who reviews the notes.
