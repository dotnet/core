# Progress Monitoring

While the script runs, it writes diff files into the output folder. On each polling iteration (alongside `read_powershell`), list new files on disk and mention them to the user as progress updates.

## Determining the output folder

The output path follows the pattern:

```
release-notes/{MajorMinor}/preview/{milestoneFolder}/api-diff/
```

For example, comparing Preview 1 → Preview 2 of .NET 11.0 writes to `release-notes/11.0/preview/preview2/api-diff/`.

You can determine the path from the script's "Creating new diff folder:" message in the output, or construct it from the version parameters.

## How to check for new files

On each poll, run a `Get-ChildItem` on the output folder (recursively, files only) alongside your `read_powershell` call. Compare the file list to what you saw on the previous poll to identify newly created files.

```powershell
Get-ChildItem -Path "release-notes/{version}/preview/{milestone}/api-diff" -Recurse -File -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
```

## What to report

Mention newly appeared files as brief status updates. Group them by SDK subfolder when possible. For example:

> _Microsoft.NETCore.App: 15 diff files generated (System.Runtime.md, System.Collections.md, ...)_
> _Microsoft.AspNetCore.App: 8 diff files generated_

Check for new files each time you call `read_powershell` — make the two calls in parallel. Do not add extra polling rounds just for file checking.
