# Interpreting User Input

Users may describe versions in many formats. Map them to script parameters as follows:

| User says | Previous params | Current params |
|---|---|---|
| ".NET 10 GA vs .NET 11 Preview 1" | `-PreviousMajorMinor 10.0` | `-CurrentMajorMinor 11.0 -CurrentPrereleaseLabel preview.1` |
| "net9.0-preview6 to net10.0-preview5" | `-PreviousMajorMinor 9.0 -PreviousPrereleaseLabel preview.6` | `-CurrentMajorMinor 10.0 -CurrentPrereleaseLabel preview.5` |
| ".NET 10 RC 2 vs .NET 10 GA" | `-PreviousMajorMinor 10.0 -PreviousPrereleaseLabel rc.2` | `-CurrentMajorMinor 10.0` |
| "10.0.0-preview.7.25380.108 to 10.0.0-rc.1.25451.107" | `-PreviousVersion "10.0.0-preview.7.25380.108"` | `-CurrentVersion "10.0.0-rc.1.25451.107"` |
| "generate the next API diff" | *(no params — script auto-infers from existing api-diffs)* | |

## Version format rules

- "GA" or no qualifier means a stable release — omit the PrereleaseLabel parameter.
- "Preview N" or "previewN" → `-PrereleaseLabel preview.N` (note the dot separator).
- "RC N" or "rcN" → `-PrereleaseLabel rc.N` (note the dot separator).
- "netX.Y-previewN" (TFM format) → `-MajorMinor X.Y -PrereleaseLabel preview.N`.
- Full NuGet version strings like "10.0.0-preview.7.25380.108" → use `-PreviousVersion` or `-CurrentVersion` directly.
- The "previous" version is always the older/before version and the "current" version is always the newer/after version, regardless of the order the user mentions them.

## Asking for Clarification

If the user's request is ambiguous, ask them interactively:

1. **No versions mentioned**: Ask "How would you like to specify the versions?" with choices:
   - "Auto-infer the next version from existing api-diffs (recommended)"
   - "I'll provide the current version (e.g., 11.0 Preview 1)"
   - "I'll provide both previous and current versions"

2. **Only one version mentioned**: Ask which role it plays — "Is [version] the previous (before) or current (after) version?"

3. **Ambiguous version format**: Ask "What version did you mean?" and offer interpretations. For example, if the user says ".NET 10 Preview", ask which preview number.

## Examples

**User**: "Run an API diff for the next release"
**Action**: Run with no parameters (auto-infers from existing api-diffs):
```powershell
.\release-notes\RunApiDiff.ps1
```

**User**: "Generate an API diff between .NET 10 GA and .NET 11 Preview 1"
**Action**:
```powershell
.\release-notes\RunApiDiff.ps1 -PreviousMajorMinor 10.0 -CurrentMajorMinor 11.0 -CurrentPrereleaseLabel preview.1
```

**User**: "Create an API diff between net8.0-preview6 and net10.0-preview5"
**Action**:
```powershell
.\release-notes\RunApiDiff.ps1 -PreviousMajorMinor 8.0 -PreviousPrereleaseLabel preview.6 -CurrentMajorMinor 10.0 -CurrentPrereleaseLabel preview.5
```

**User**: "Diff 10.0.0-preview.7.25380.108 against 10.0.0-rc.1.25451.107"
**Action**:
```powershell
.\release-notes\RunApiDiff.ps1 -PreviousVersion "10.0.0-preview.7.25380.108" -CurrentVersion "10.0.0-rc.1.25451.107"
```
