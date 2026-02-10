# Process Inputs and Validate Readiness

Collect all required inputs from the user and verify that prerequisite data is available before starting the data pipeline.

## Inputs

If `$ARGUMENTS` is provided, use `$0` as the repository. Otherwise ask the user for the **repository** (`owner/repo`, e.g. `dotnet/runtime`).

Collect inputs **one at a time** — ask a single question, wait for the answer, then ask the next. After each response, acknowledge what has been collected so far and ask for the next missing input:

1. **Preview name** (e.g. ".NET 11 Preview 2")
2. **Start date** — ask: *"What was the Code Complete date for the previous release, `<previous preview name>`?"* (ISO 8601). For **Preview 1**, this is the prior major version's RC1 Code Complete date (the vNext fork point); anything already covered in RC1/RC2/GA release notes will be de-duplicated in the [verify scope](verify-1-dedupe.md) step.
3. **End date** — ask: *"What was the Code Complete date for `<this preview name>`? (If it hasn't occurred yet, provide the expected date.)"* (ISO 8601)
4. **Output file** — path for the release notes markdown (default: `release-notes/<version>/preview/<preview>/libraries.md`)

## Early API Diff Check

Before starting the data pipeline, verify that the required API diffs are present in the local repository clone. Check for both:

1. **Current release API diff** — e.g. `release-notes/<version>/preview/<preview>/api-diff/Microsoft.NETCore.App/`
2. **Previous release API diff** — e.g. `release-notes/<version>/preview/<previous-preview>/api-diff/Microsoft.NETCore.App/` (used during [deduplication](verify-1-dedupe.md) and cross-referencing)

If **either** API diff directory is missing or empty:

- **Warn the user immediately**, specifying which diff is missing and the expected path.
- Explain that the API diff significantly improves the quality of the release notes by enabling accurate cross-referencing of new APIs with implementing PRs.
- Ask whether to proceed without it or wait until the API diff is available.

Do not defer this check to the data pipeline — surface the warning as soon as inputs are collected so the user can decide early whether to generate the API diff first.
