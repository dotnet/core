# Categorize Entries by Area, Theme, and Impact

## Feature grouping

Group related features under a **single top-level section** rather than scattering them as separate entries. Features that share a common initiative, theme, or parent issue should appear as subsections (`###`) under one heading (`##`).

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
- **Small improvements**: Single-mapping additions and minor fixes with public API changes should rarely be included

Only Headline, Quality, Performance, and significant API additions go into the release notes. Use judgment — a 2-line dictionary entry addition is less noteworthy than a new numeric type.

The early previews (preview1 through preview5) tend to include more features, and the later previews (preview6, preview7, and rc1) tend to have fewer headline features and more quality improvements and small additions. The RC2 and GA releases typically have fewer changes so quality and performance improvements can be emphasized more.

## Theme continuations

Reference the previous release notes (loaded during [deduplication](dedup-previous-releases.md)) to identify features that build on work from prior previews. When a feature extends earlier work:

- Acknowledge the earlier coverage briefly (e.g., "Building on the Zstandard support introduced in Preview 1...")
- Focus on what's **new** in this preview
- If the feature has evolved substantially, consider whether it warrants a fresh full write-up rather than just an update note

## Multi-faceted PRs

A single PR may span multiple categories — for example, a PR that rewrites an implementation may improve correctness, fix bugs, simplify the codebase, *and* deliver performance gains. Do not reduce such PRs to a single category. When writing the release notes entry, describe the full scope of the improvement. Read the full PR description, not just benchmark tables.

## Team-specific categorization

The team context may provide additional categorization guidance, such as:
- Specific example release notes to follow for style reference
- Additional tiers or groupings specific to the team's domain
- Guidance on how to handle certain types of changes (e.g., API review outcomes)

Follow the team context's guidance when it extends or overrides these common rules.
