# Editorial Rules

Tone, attribution, and content guidelines for .NET release notes.

## Tone

- **Positive** — highlight what's new, don't dwell on what was missing
  - ✅ `ProcessExitStatus provides a unified representation of how a process terminated.`
  - ❌ `Previously, there was no way to determine how a process terminated.`
- When context about the prior state is needed, keep it brief — one clause, then pivot to the new capability
- **Prefer short, direct sentences** — If a sentence has a parenthetical clause (`which...`, `where...`, `that...`) longer than a few words, split it into two sentences. Lead with the news, follow with context. Long sentences are fine when they flow as a single continuous thought (what → why); they're not fine when a subordinate clause interrupts the main verb.
  - ✅ `Runtime-async is now enabled for NativeAOT. This eliminates the state-machine overhead of async/await for ahead-of-time compiled applications.`
  - ❌ `The runtime-async feature, which eliminates the state-machine overhead of async/await, is now enabled for NativeAOT.`
  - ✅ `The JIT now generates ARM64 SM4 and SHA3 instructions directly, enabling hardware-accelerated implementations on capable processors.` (long but flows — one thought)

## Entry naming

- Prefer a **brief description** of what the feature does over the API name alone
  - ✅ `## Support for Zstandard compression`
  - ✅ `## Faster time zone conversions`
  - ❌ `## ZstandardStream`
  - ❌ `## TimeZoneInfo performance`
- Keep headings concise — 3–8 words

## Benchmarks

- Use **exact data** from PR descriptions — never round, approximate, or paraphrase
- State what was measured and the hardware/workload context
- Include specific before/after measurements when compelling
- Do **not** embed full BenchmarkDotNet tables — summarize in prose

## What to include

- **The 20/80 rule** — at least 20% of readers need to care about a feature. Write so the other 80% understand why those 20% care and why they might, too. A feature that only matters to a narrow audience can still earn its place if the writeup makes the value legible to everyone.
- **The two-sentence test** — if you can only write two sentences about a feature, it's probably an engineering fix, not a feature. Cut it. A community contribution or breaking change can lift a borderline entry, but "fixed an internal bug that happened to be visible" is not a feature.
- **Headlines should convey value** — a heading like "GC regions on macOS" doesn't tell the reader whether this is good or bad. Prefer headings that hint at the benefit: "GC regions enabled on macOS" or "Server GC memory model now available on macOS."

## Feature ordering

Order features using three tiers, applied in order:

1. **Broad interest first** — features most developers will care about go at the top. A new `RegexOptions` value ranks above an ARM64-only instruction set.
2. **Cluster related features** — group related items together even if they differ in importance. All Regex work in one block, all System.Text.Json work in another, all JIT work together. Readers scan by area.
3. **Alphabetical within a cluster** — when features within a cluster have roughly equal weight, alphabetical order makes them scannable.

Use PR and issue reaction counts as a signal for tier 1, but apply judgment — a niche feature with 100 reactions may still rank below a broadly useful one with 10.

## Community attribution

### Inline

When a documented feature was contributed externally:

```markdown
Thank you [@username](https://github.com/username) for this contribution!
```

### Community contributors section

At the bottom of each component's notes, list ALL external contributors — not just those with documented features. Use the `community-contribution` label to identify them.

```markdown
## Community contributors

Thank you contributors! ❤️

- [@username](https://github.com/<owner>/<repo>/pulls?q=is%3Apr+is%3Amerged+author%3Ausername)
```

## Bug fixes section

After features but before community contributors, include a grouped bug fix summary when there are noteworthy fixes:

```markdown
## Bug fixes

- **System.Net.Http**
  - Fixed authenticated proxy credential handling ([dotnet/runtime#123363](https://github.com/dotnet/runtime/issues/123363))
- **System.Collections**
  - Fixed integer overflow in ImmutableArray range validation ([dotnet/runtime#124042](https://github.com/dotnet/runtime/pull/124042))
```

Group by namespace/area. Don't include test-only, CI, or infra fixes.

## Preview-to-preview feedback fixes

Include a bug fix when ALL of these apply:

1. The issue was filed after the previous preview shipped
2. It was reported by someone outside the team
3. A fix shipped in the current preview

Frame positively: "Based on community feedback, X now does Y."
