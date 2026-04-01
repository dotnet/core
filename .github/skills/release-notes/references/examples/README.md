# Release Notes Examples

Curated examples from previous .NET release notes, organized by component. Load only the file relevant to the component you're writing.

| File | Component | Styles shown |
|------|-----------|-------------|
| [runtime.md](examples/runtime.md) | JIT, GC, CoreCLR | Benchmark narrative, assembly comparison, metric-heavy prose |
| [aspnetcore.md](examples/aspnetcore.md) | ASP.NET Core, Blazor | Short behavior change, medium workaround, long community feature |
| [csharp.md](examples/csharp.md) | C# language | Code-first with rule bullets |
| [sdk.md](examples/sdk.md) | SDK, CLI, containers | Problem/solution with community attribution |
| [libraries.md](examples/libraries.md) | BCL, System.* APIs | Subheadings, diff blocks, multiple API examples |

## Principles

1. **Length matches importance** — a config option gets 3 sentences; a cryptography overhaul gets subheadings and multiple code blocks
2. **Lead with what changed** — don't bury the lede with background paragraphs
3. **Prefer active voice** — "The JIT now eliminates bounds checks" not "Bounds checks are now eliminated by the JIT." Passive voice is fine occasionally but active is the strong default
3. **Code shows, prose explains** — when there's an API, show it; use prose for the why/when
4. **Attribution is natural** — community contributions get a mention with a GitHub link, not a separate "contributors" section
5. **Diff format for improvements** — when a feature simplifies existing code, `diff` blocks make the improvement immediately visible
6. **Assembly comparisons for JIT work** — before/after `asm` blocks let readers count the instructions eliminated
7. **Progressive benchmarks tell a story** — multiple benchmark tables showing incremental improvement are more compelling than a single number
8. **Ask for what you can't generate** — benchmark data, definitive samples, and domain context come from humans. A placeholder with a request is better than a fabrication
9. **Workarounds are welcome** — if a change might break someone, say so and give the escape hatch
