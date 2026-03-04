---
name: api-diff
description: Generate an API comparison report between two .NET versions using the RunApiDiff.ps1 script. Invoke when the user asks to run, create, or generate an API diff.
disable-model-invocation: true
---

# API Diff Generation

Map the user's request to parameters for `release-notes/RunApiDiff.ps1` and run it. See [release-notes/RunApiDiff.md](../../../release-notes/RunApiDiff.md) for the full parameter reference.

When no versions are mentioned, run with no parameters — the script auto-infers versions.

## Mapping natural language to parameters

| User says | Parameters |
|---|---|
| "generate the next API diff" | *(none)* |
| ".NET 10 GA vs .NET 11 Preview 1" | `-PreviousMajorMinor 10.0 -CurrentMajorMinor 11.0 -CurrentPrereleaseLabel preview.1` |
| "net9.0-preview6 to net10.0-preview5" | `-PreviousMajorMinor 9.0 -PreviousPrereleaseLabel preview.6 -CurrentMajorMinor 10.0 -CurrentPrereleaseLabel preview.5` |
| ".NET 10 RC 2 vs .NET 10 GA" | `-PreviousMajorMinor 10.0 -PreviousPrereleaseLabel rc.2 -CurrentMajorMinor 10.0` |
| "10.0.0-preview.7.25380.108 to 10.0.0-rc.1.25451.107" | `-PreviousVersion "10.0.0-preview.7.25380.108" -CurrentVersion "10.0.0-rc.1.25451.107"` |

- **GA** or no qualifier → omit the PrereleaseLabel parameter
- **Preview N** / **previewN** → `-PrereleaseLabel preview.N`
- **RC N** / **rcN** → `-PrereleaseLabel rc.N`
- **netX.Y-previewN** (TFM format) → `-MajorMinor X.Y -PrereleaseLabel preview.N`
- Full NuGet version strings → use `-PreviousVersion` / `-CurrentVersion` directly
- The "previous" version is always the older version; "current" is the newer one

## Running the script

```powershell
.\release-notes\RunApiDiff.ps1 [mapped parameters]
```

Set an initial wait of at least 300 seconds — the script takes several minutes. Use `read_powershell` to poll for completion. The script does not print a final "done" message; it exits after generating a README.md in the output folder. After completion, summarize the results: how many diff files were generated and where.
