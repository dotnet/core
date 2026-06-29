---
name: api-diff
description: >
  Generate before/after .NET public API diff reports for a release milestone with
  `RunApiDiff.ps1`. Pure report generation only; to verify the diff against the
  shipped build (dotnet-inspect, revert detection) use the api-diff-validation skill.
---

# API Diffing

Use this skill to produce the markdown-ready, repo-shaped **API diff reports** for a
release milestone (previous milestone -> current). This skill is pure generation: it
runs the diff tool and writes the reports. Verifying that the diffed APIs actually
shipped, tracing them to PRs, and catching reverts is the separate
[api-diff-validation](../api-diff-validation/SKILL.md) skill.

## Generate the reports with `RunApiDiff.ps1`

Use `release-notes/RunApiDiff.ps1`. See [release-notes/RunApiDiff.md](../../../release-notes/RunApiDiff.md) for the full parameter reference.

## Mapping natural language to parameters

| User says                                             | Parameters                                                                                                             |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| "generate the next API diff"                          | _(none)_                                                                                                               |
| ".NET 10 GA vs .NET 11 Preview 1"                     | `-PreviousMajorMinor 10.0 -CurrentMajorMinor 11.0 -CurrentPrereleaseLabel preview.1`                                   |
| "net9.0-preview6 to net10.0-preview5"                 | `-PreviousMajorMinor 9.0 -PreviousPrereleaseLabel preview.6 -CurrentMajorMinor 10.0 -CurrentPrereleaseLabel preview.5` |
| ".NET 10 RC 2 vs .NET 10 GA"                          | `-PreviousMajorMinor 10.0 -PreviousPrereleaseLabel rc.2 -CurrentMajorMinor 10.0`                                       |
| "10.0.0-preview.7.25380.108 to 10.0.0-rc.1.25451.107" | `-PreviousVersion "10.0.0-preview.7.25380.108" -CurrentVersion "10.0.0-rc.1.25451.107"`                                |

- **GA** or no qualifier -> omit the `PrereleaseLabel` parameter for `RunApiDiff.ps1`; if a downstream api-diff release label is needed, use `ga`
- **Preview N** / **previewN** -> `-PrereleaseLabel preview.N` (for example, `preview.4`, not `preview4`)
- **RC N** / **rcN** -> `-PrereleaseLabel rc.N`
- **Other prerelease labels** (Alpha N, Beta N, ...) -> `-PrereleaseLabel <label>.N` (for example, `alpha.1`, `beta.2`); `RunApiDiff.ps1` accepts any `<label>.N`, treating everything except RC and GA as a plain semantic-version label
- **netX.Y-previewN** (TFM format) -> `-MajorMinor X.Y -PrereleaseLabel preview.N`
- Full NuGet version strings -> use `-PreviousVersion` / `-CurrentVersion` directly
- The "previous" version is always the older version; "current" is the newer one

## Running the script

```powershell
.\release-notes\RunApiDiff.ps1 [mapped parameters]
```

Set an initial wait of at least 300 seconds — the script takes several minutes. After completion, summarize the results: how many diff files were generated and where.
