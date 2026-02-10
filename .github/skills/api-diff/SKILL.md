---
name: api-diff
description: Generate an API comparison report between two .NET versions using the RunApiDiff.ps1 script. Invoke when the user asks to run, create, or generate an API diff.
disable-model-invocation: true
---

# API Diff Generation

This skill runs `release-notes/RunApiDiff.ps1` to generate API comparison reports between .NET versions.

## Workflow

### 1. Interpret the user's request

Map user input to script parameters. Read [reference/interpreting-input.md](reference/interpreting-input.md) for version format rules, clarification prompts, and examples.

Key points:
- "generate the next API diff" → no params (auto-infers from existing api-diffs)
- "Preview N" → `-PrereleaseLabel preview.N`; "RC N" → `-PrereleaseLabel rc.N`; "GA" → omit PrereleaseLabel
- Full NuGet version strings → use `-PreviousVersion` / `-CurrentVersion` directly

### 2. Construct the command

Build the PowerShell command from the mapped parameters. See [reference/parameters.md](reference/parameters.md) for the full parameter reference.

```powershell
.\release-notes\RunApiDiff.ps1 [mapped parameters]
```

### 3. Run the script

1. Confirm the constructed command with the user before running.
2. Run via PowerShell 7+ (`pwsh`). Set an initial wait of at least 300 seconds.
3. While the script is running, check the output folder for newly created files and mention them to the user as progress updates. Read [reference/progress-monitoring.md](reference/progress-monitoring.md) for disk monitoring instructions.
4. After completion, summarize the results: how many diff files were generated and where.
