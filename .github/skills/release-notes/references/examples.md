# Release Notes Examples

Good examples of feature descriptions from previous .NET release notes, demonstrating different lengths and approaches. Use these as models — match the length to the importance and complexity of the feature.

The public-facing "What's new in .NET" docs pages are the curated, polished versions. These repo-based release notes have more flexibility — descriptions can be as long as they need to be, as long as they're interesting.

## Short — focused explanation, no code

Best for: behavior changes, configuration options, minor improvements.

### Example: Configure suppressing exception handler diagnostics

> From [.NET 10 Preview 7 — ASP.NET Core](../../release-notes/10.0/preview/preview7/aspnetcore.md)

A new configuration option, a behavior change, and the rationale — all in three sentences. No code needed because the value is in understanding the *why*, not the API shape.

### Example: Container publishing improvements for insecure registries

> From [.NET 9 Preview 7 — SDK](../../release-notes/9.0/preview/preview7/sdk.md)

Problem/solution framing, community attribution (`[@tmds](https://github.com/tmds)`), then a tight bullet list of requirements. Shows how to credit contributors naturally.

## Medium — context plus code sample

Best for: new APIs, language features, things developers will type.

### Example: Extension operators

> From [.NET 10 Preview 7 — C#](../../release-notes/10.0/preview/preview7/csharp.md)

One sentence of context, then a code block showing the new syntax, then bullet rules. The code *is* the feature — showing it immediately is the right call.

### Example: PipeReader support in System.Text.Json

> From [.NET 10 Preview 7 — ASP.NET Core](../../release-notes/10.0/preview/preview7/aspnetcore.md)

A behavioral change that's mostly invisible but has an edge case. Explains what changed, who might be affected, the workaround, and the proper fix. Good template for "most people won't notice, but if you do, here's what to do."

## Long — deep-dive with multiple sections

Best for: major features, security capabilities, things users have been asking for.

### Example: Array Enumeration De-Abstraction

> From [.NET 10 Preview 2 — Runtime](../../release-notes/10.0/preview/preview2/runtime.md)

A progressive JIT optimization story told through three benchmark tables. Starts with a simple case (transparent type), escalates to a harder case (opaque type behind interface), and walks through each optimization layer (inlining, PGO, guarded devirtualization, conditional escape analysis). Each benchmark shows measurable improvement. The narrative structure — problem, partial solution, harder problem, better solution — keeps the reader engaged.

### Example: Improved Code Generation for Struct Arguments

> From [.NET 10 Preview 6 — Runtime](../../release-notes/10.0/preview/preview6/runtime.md)

Before/after assembly comparison showing a concrete codegen improvement. Starts with C# code, shows the current optimal case, introduces the pathological case with assembly output, then shows the fix. Three `asm` blocks tell the whole story — the reader can literally count the instructions eliminated.

### Example: JIT Loop Optimizations

> From [.NET 9 Preview 1 — Runtime](../../release-notes/9.0/preview/preview1/runtime.md)

No code at all — just crisp prose with percentages. Explains three optimization categories (hoisting, cloning, alignment) with one-paragraph descriptions and measured improvement rates. Good template for infrastructure improvements where the value is breadth of impact rather than a single dramatic before/after.

### Example: Post-Quantum Cryptography Updates

> From [.NET 10 Preview 7 — Libraries](../../release-notes/10.0/preview/preview7/libraries.md)

Subheadings (ML-DSA, Composite ML-DSA), diff-style before/after code, multiple API examples. The diff format (`-` old / `+` new) is especially effective for showing simplification.

### Example: OpenIdConnectHandler support for Pushed Authorization Requests (PAR)

> From [.NET 9 Preview 7 — ASP.NET Core](../../release-notes/9.0/preview/preview7/aspnetcore.md)

Community contribution with extensive quoted motivation from the contributor. The block quote explains *why* this matters (security, compliance, standards). Then practical: default behavior, how to disable, how to require. Good template for features with regulatory or security significance.

## Principles these examples demonstrate

1. **Length matches importance** — a config option gets 3 sentences; a cryptography overhaul gets subheadings and multiple code blocks
2. **Lead with what changed** — don't bury the lede with background paragraphs
3. **Code shows, prose explains** — when there's an API, show it; use prose for the why/when
4. **Attribution is natural** — community contributions get a mention with a GitHub link, not a separate "contributors" section
5. **Diff format for improvements** — when a feature simplifies existing code, `diff` blocks make the improvement immediately visible
6. **Assembly comparisons for JIT work** — before/after `asm` blocks let readers count the instructions eliminated
7. **Progressive benchmarks tell a story** — multiple benchmark tables showing incremental improvement are more compelling than a single number
8. **Ask for what you can't generate** — benchmark data, definitive samples, and domain context come from humans. A placeholder with a request is better than a fabrication
9. **Workarounds are welcome** — if a change might break someone, say so and give the escape hatch
