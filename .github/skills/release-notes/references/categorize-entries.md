# Categorize Entries by Area, Theme, and Impact

## Feature grouping

Group related features under a **single top-level section** rather than scattering them as separate entries. Features sharing a common initiative, theme, or parent issue appear as subsections (`###`) under one heading (`##`).

**Signals that features should be grouped:**

- They reference the same parent issue or initiative
- They are in the same namespace or closely related namespaces
- One feature is a prerequisite for another
- They would be confusing or redundant as separate TOC entries

## Impact tiers

Group PRs into tiers:

- **Headline features**: New namespaces or types, implementations of new industry trends/algorithms, major new API surfaces
- **Quality**: PRs or groups of PRs that improve quality across an area
- **Performance**: PRs with benchmark data showing measurable improvements
- **Significant API additions**: Notable new API surface that unlocks new scenarios or provides meaningful productivity gains
- **Small improvements**: Single-mapping additions and minor fixes with public API changes. Exclude unless the change is to a widely-used type (e.g., `string`, `Span<T>`, `HttpClient`) or resolves a highly-requested issue (10+ reactions). When in doubt, check whether you can write a meaningful code sample — if the only sample is trivially obvious, the entry likely does not warrant coverage
- **Preview feedback fixes**: Bug fixes or behavior changes responding to community feedback on a previous preview. See [editorial-rules.md](editorial-rules.md#preview-to-preview-feedback-fixes) for inclusion criteria. Rank by community signal strength:
  - **50+ combined reactions and comments** → treat as headline-level
  - **10–49** → standard entry in preview feedback section
  - **Under 10** → brief mention unless behavioral change is significant

Only Headline, Quality, Performance, and significant API additions go into the release notes. Use judgment — a 2-line dictionary entry addition is less noteworthy than a new numeric type.

**Before assigning a tier**, check each candidate against the [partial features and building blocks](editorial-rules.md#partial-features-and-building-blocks) heuristics. Features that are independently useful but part of a larger effort should note that context. Features with no standalone value should be folded into a brief mention or omitted.

Early previews (preview1–preview5) tend to include more features. Later previews (preview6, preview7, rc1) have fewer headline features and more quality improvements. RC2 and GA releases emphasize quality and performance.

## Theme continuations

Reference the previous release notes (loaded during [deduplication](dedup-previous-releases.md)) to identify features building on prior preview work:

- Acknowledge earlier coverage briefly (e.g., "Building on the Zstandard support introduced in Preview 1...")
- Focus on what is **new** in this preview
- Consider a fresh full write-up if the feature has evolved substantially

## Multi-faceted PRs

A single PR may span multiple categories. Do not reduce to a single category — describe the full scope. Read the full PR description, not just benchmark tables.

## Team-specific categorization

If a team context file exists for the component, apply its categorization guidance (specific tiers, groupings, or style references) alongside these common rules.
