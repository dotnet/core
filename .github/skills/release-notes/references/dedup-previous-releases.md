# Deduplicate Against Previous Release Notes

Before authoring content, check that candidate features are not already covered in an earlier preview's release notes for the same major version. This check runs for **every component** that has candidates.

## Load prior release notes

For each component with candidates, load its release notes file from the immediately preceding release within the same major version. For example, when generating Preview 3, load Preview 2's notes for each component.

When generating **Preview 1** for a new major version, check the prior major version's late-cycle notes (RC1, RC2, GA):

```
release-notes/<prev-major>/preview/rc1/<component>.md
release-notes/<prev-major>/preview/rc2/<component>.md
release-notes/<prev-major>/preview/ga/<component>.md
```

These files are in the local repository clone under `release-notes/`.

**Retain the previous release notes in context** — they are needed in the [authoring step](categorize-entries.md) for identifying theme continuations.

## Check for overlap

For each candidate PR, check whether it (or its feature) already appears in prior release notes:

- **PR number references** — search for `#<number>` or the full PR URL
- **Feature names** — search for the API name, type name, or feature title

Remove any PR whose feature is already covered. A PR merged in a prior date range but not included in those release notes may still be included — only exclude PRs whose features were actually written up.

## Flag earlier PRs surviving dedup

If any PRs were removed during dedup, review remaining candidates merged **before** the previous release's Code Complete date. Present these to the user:

> The following PRs were merged before the previous Code Complete date but were **not** found in prior release notes. Confirm whether to include:
>
> - dotnet/runtime#12345 — `Add Foo.Bar overload` (merged 2025-11-15)
> - dotnet/runtime#12400 — `Optimize Baz serialization` (merged 2025-12-03)

If no PRs were removed during dedup, skip this sub-step.

## Handle cross-preview features

Some features span multiple PRs across previews:

- If the new PR is a **substantial extension** (new overloads, new scenarios, significant perf improvement, breaking changes), include it as an update referencing the earlier work. Note the theme continuation for [authoring](categorize-entries.md).
- If the new PR is a **minor follow-up** (bug fix, test addition, doc comment), skip it.
