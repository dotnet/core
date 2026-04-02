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

## Feature ordering

Order features by **customer impact**:

1. Major new capabilities — especially those with high community reaction counts
2. Meaningful improvements to existing capabilities
3. Smaller additions

Use PR and issue reaction counts as a signal, but apply judgment — a niche feature with 100 reactions may still be less impactful than a broadly useful one with 10.

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
