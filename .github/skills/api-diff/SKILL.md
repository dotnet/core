---
name: api-diff
description: Generate an API comparison report between two .NET versions using the RunApiDiff.ps1 script. Invoke when the user asks to run, create, or generate an API diff.
disable-model-invocation: true
---

# API Diff Generation

This skill interprets the user's request and runs `release-notes/RunApiDiff.ps1` with the appropriate parameters.

## Workflow

### 1. Map the user's intent to script parameters

Read [reference/interpreting-input.md](reference/interpreting-input.md) for version format rules and examples of how to map natural language to script parameters. Read [reference/parameters.md](reference/parameters.md) for the full parameter reference.

By default (when the user doesn't specify versions), RunApiDiff.ps1 auto-infers the next version from existing api-diff folders. Only supply parameters when the user explicitly mentions versions.

### 2. Run the script

Run the constructed command from the repository root. Set an initial wait of at least 300 seconds — the script takes several minutes to download packages and generate diffs. Use `read_powershell` to poll for completion.

```powershell
.\release-notes\RunApiDiff.ps1 [mapped parameters]
```

**Detecting completion:** The API diff tool writes progress bars with ANSI escape sequences to the terminal, which makes output noisy and hard to parse. Do not try to detect completion from the command output. Instead, check whether the PowerShell process has exited — when the shell returns to a prompt or `read_powershell` reports the process has ended, the script is done. The script does not print a final "done" message; it simply exits after generating a README.md in the output folder.

After completion, summarize the results: how many diff files were generated and where.
