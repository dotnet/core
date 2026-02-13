# Interpreting User Input

Map the user's natural language to script parameters. If no versions are mentioned, run with no parameters — the script auto-infers the next version from existing api-diffs.

## Version format rules

| User says | Previous params | Current params |
|---|---|---|
| "generate the next API diff" | *(no params)* | |
| ".NET 10 GA vs .NET 11 Preview 1" | `-PreviousMajorMinor 10.0` | `-CurrentMajorMinor 11.0 -CurrentPrereleaseLabel preview.1` |
| "net9.0-preview6 to net10.0-preview5" | `-PreviousMajorMinor 9.0 -PreviousPrereleaseLabel preview.6` | `-CurrentMajorMinor 10.0 -CurrentPrereleaseLabel preview.5` |
| ".NET 10 RC 2 vs .NET 10 GA" | `-PreviousMajorMinor 10.0 -PreviousPrereleaseLabel rc.2` | `-CurrentMajorMinor 10.0` |
| "10.0.0-preview.7.25380.108 to 10.0.0-rc.1.25451.107" | `-PreviousVersion "10.0.0-preview.7.25380.108"` | `-CurrentVersion "10.0.0-rc.1.25451.107"` |

- "GA" or no qualifier → omit the PrereleaseLabel parameter
- "Preview N" or "previewN" → `-PrereleaseLabel preview.N`
- "RC N" or "rcN" → `-PrereleaseLabel rc.N`
- "netX.Y-previewN" (TFM format) → `-MajorMinor X.Y -PrereleaseLabel preview.N`
- Full NuGet version strings (e.g., "10.0.0-preview.7.25380.108") → use `-PreviousVersion` or `-CurrentVersion` directly
- The "previous" version is always the older/before version and the "current" version is always the newer/after version, regardless of the order the user mentions them
