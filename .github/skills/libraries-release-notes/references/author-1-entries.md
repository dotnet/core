# Author: Categorize by Area, Theme, and Impact

## Feature Grouping

Group related features under a **single top-level section** rather than scattering them as separate entries. Features that share a common initiative, theme, or parent issue should appear as subsections (`###`) under one heading (`##`).

For example, if a release includes `ProcessExitStatus`, `PosixSignal.SIGKILL`, `File.OpenNullHandle`, and `Console.OpenStandardInputHandle` — all part of the new process APIs initiative — they belong under one `## New Process APIs` section with subsections for each, not as four separate top-level features.

**Signals that features should be grouped:**
- They reference the same parent issue or initiative (e.g. `dotnet/runtime #123959`)
- They are in the same namespace or closely related namespaces
- One feature is a prerequisite for another (e.g. `SIGKILL` enables `SendSignal`)
- They would be confusing or redundant as separate TOC entries

Group PRs into tiers:
- **Headline features**: New namespaces or types, implementations of new industry trends/algorithms, major new API surfaces
- **Quality**: PRs or groups of PRs that improve quality across an area (recognizing `area-*` labels on the PRs and issues)
- **Performance**: PRs with benchmark data showing measurable improvements
- **API additions**: New methods/overloads on existing types
- **Small improvements**: Single-mapping additions, minor fixes with public API changes
- **Community contributions**: Large PRs labeled as `community-contribution` or collections of such PRs by the same author

**Multi-faceted PRs.** A single PR may span multiple categories — for example, a PR that rewrites an implementation may improve correctness, fix bugs, simplify the codebase, *and* deliver performance gains. Do not reduce such PRs to a single category. When writing the release notes entry, describe the full scope of the improvement. A PR that fixes correctness bugs and improves performance should lead with the quality/reliability story and include performance data as supporting evidence — not be categorized as "Performance" alone. Read the full PR description, not just benchmark tables.

Only Headline, Quality, Performance, and significant API additions go into the release notes. Use judgment — a 2-line dictionary entry addition is less noteworthy than a new numeric type. The early previews (preview1 through preview5) tend to include more features, and the later previews (preview6, preview7, and rc1) tend to have fewer headline features and more quality improvements and small additions. The RC2 and GA releases typically have fewer changes so quality and performance improvements can be emphasized more.

For community contributions, if a community contributor has provided valuable features or quality improvements for popular libraries, give those entries more consideration for mentioning in the release notes.

Some example sets of release notes to use for reference and inspiration:
* `release-notes/11.0/preview/preview1/libraries.md`
* `release-notes/10.0/preview/preview1/libraries.md`
* `release-notes/9.0/preview/rc1/libraries.md`
