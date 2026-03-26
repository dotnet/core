# Verify: Deduplicate Against Previous Release Notes

Before authoring content, check that candidate features have not already been covered in an earlier preview's release notes for the same major version.

## Load prior release notes

Load the team's component file (e.g., `libraries.md`, `aspnetcore.md`) from the immediately preceding release within the same major version. For example, when generating Preview 3, load Preview 2's notes; when generating RC1, load Preview 7's notes.

When generating **Preview 1** release notes for a new major version, there are no prior previews to check. Instead, look back at the prior major version's late-cycle release notes — specifically RC1, RC2, and GA — since features that landed late in the previous release cycle may overlap with early work in the new version. For example, when generating .NET 12 Preview 1 notes, check:

```
release-notes/11.0/preview/rc1/<component>.md
release-notes/11.0/preview/rc2/<component>.md
release-notes/11.0/preview/ga/<component>.md
```

These files are in the local repository clone under `release-notes/<version>/preview/`.

**Retain the previous release notes in context** — they are needed in the [authoring step](categorize-entries.md) for identifying theme continuations.

## Check for overlap

For each candidate PR, check whether it (or its feature) already appears in a prior release's notes by looking for:

- **PR number references** — search for `#<number>` or the full PR URL in prior files
- **Feature names** — search for the API name, type name, or feature title

Remove any PR from the candidate list whose feature is already covered. A PR that was merged in the date range of a prior preview but was not included in that preview's release notes may still be included — only exclude PRs whose features were actually written up.

## Flag earlier PRs that survived dedup

If any PRs were removed during dedup, review the remaining candidate PRs that were merged **before** the previous release's Code Complete date (i.e. PRs whose merge date falls in the earlier portion of the date range). These PRs were not found in the prior release notes but their merge dates suggest they *could* have been covered elsewhere. Present these PRs to the user and ask whether each should be included or excluded. For example:

> The following PRs were merged before the .NET 11 Preview 1 Code Complete date but were **not** found in any prior release notes. They may have been intentionally omitted or covered in a different document. Please confirm whether to include them:
>
> - #12345 — `Add Foo.Bar overload` (merged 2025-11-15)
> - #12400 — `Optimize Baz serialization` (merged 2025-12-03)

If no PRs were removed during dedup (i.e. nothing overlapped with prior notes), skip this sub-step — the earlier merge dates are expected given the date range and do not need user confirmation.

## Handle cross-preview features

Some features span multiple PRs across previews (e.g. a Preview 1 PR adds the core API and a Preview 2 PR extends it). In these cases:

- If the new preview's PR is a **substantial extension** (new overloads, new scenarios, significant perf improvement on top of the original, or breaking changes to the API shape), include it as an update referencing the earlier work. Note the theme continuation for the [authoring step](categorize-entries.md).
- If the new preview's PR is a **minor follow-up** (bug fix, test addition, doc comment), skip it.
