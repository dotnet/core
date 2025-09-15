# Create PRs for .NET Preview or RC

Use this workflow to create one PR per release-notes file for a specific .NET Preview or RC milestone. You will supply three inputs when you invoke it:

- DOTNET_VERSION (major only, e.g. 10, 11)
- MILESTONE_KIND (`preview` or `rc`)
- MILESTONE_NUMBER (preview: 1–7, rc: 1–2)

PR numbers and historical references remain concrete; only version and milestone values change per cycle.

## Sample Inputs (Example)

Example below uses: DOTNET_VERSION=10, MILESTONE_KIND=rc, MILESTONE_NUMBER=2 (".NET 10 RC 2"). Replace these values when running for a different milestone.

## Runtime Inputs (provide these when invoking)

Required:

- DOTNET_VERSION (major) – e.g. 10
- MILESTONE_KIND – `preview` or `rc`
- MILESTONE_NUMBER – preview: 1–7, rc: 1–2

Derived (logic performed mentally / by assistant at run time):

- Version Path = `${DOTNET_VERSION}.0`
- Milestone Label = if preview → `Preview ${MILESTONE_NUMBER}` else `RC ${MILESTONE_NUMBER}`
- Milestone Prefix = preview → `p${MILESTONE_NUMBER}` ; rc → `rc${MILESTONE_NUMBER}`
- Base Branch = `dotnet${DOTNET_VERSION}-${MilestonePrefix}` (example: `dotnet10-rc2`)
- Working Branch Pattern = `dotnet${DOTNET_VERSION}-${MilestonePrefix}-{name}`
- Release Notes Folder = `release-notes/${DOTNET_VERSION}.0/preview/${MilestonePrefix}` (historical path keeps `preview/rcX` for RC)

Example (NOT to be edited into the file): DOTNET_VERSION=10, MILESTONE_KIND=rc, MILESTONE_NUMBER=2 ⇒ label `RC 2`, prefix `rc2`.

## Process (assistant substitutes variables at execution time)

1. Create a new branch from the base branch: `git switch -c dotnet${DOTNET_VERSION}-${MilestonePrefix}-{name} origin/dotnet${DOTNET_VERSION}-${MilestonePrefix}`
1. Modify the file content:
    - If the file contains a neutral/no-new-features sentence such as:
       * `This ${Milestone Label} release does not contain new` … OR
       * `This RC 2 release does not contain new` …
       replace that ENTIRE sentence block with the following scaffold (customize the product/area name appropriately — keep heading anchors lowercase with hyphens):
       ```markdown
       Here's a summary of what's new in <Product/Area> in this ${Milestone Label} release:

       - [Feature](#feature)

       ## Feature

       Feature summary
       ```
    - Otherwise, insert the above placeholder text directly below the heading.
    - Do NOT append duplicates; always replace in-place.
1. Run markdown lint: `npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/${DOTNET_VERSION}.0/preview/${MilestonePrefix}/{name}`
1. Commit: `Update {name} for ${Milestone Label}`
1. Push the branch
1. Create a pull request with:
   - Title: `Update {name} for ${Milestone Label}`
    - Body (exact format):
       ```
   Please update the release notes here as needed for ${Milestone Label}.

       /cc @{assignees}
       ```
1. Assign the PR (first listed person if multiple): `gh pr edit <PR_NUMBER> --add-assignee <username>`
1. Switch back to `dotnet${DOTNET_VERSION}-${MilestonePrefix}` and continue with the next file.

## Notes

- All milestone release notes live under `release-notes/${DOTNET_VERSION}.0/preview/${MilestonePrefix}/`.
- Keep the same file-to-assignee mapping unless explicitly changed.
- Use GitHub CLI for assignee setting; it's more reliable than reviewer assignment for this workflow.
- Always replace placeholders rather than appending text to avoid duplicates.
- Ensure trailing newline, consistent heading style, and no stray whitespace.
- Optional: for JSON meta changes run `npx prettier --check "release-notes/${DOTNET_VERSION}.0/**/*.json"` (do not auto-fix when only reporting).

No need to edit this file between milestones. Provide DOTNET_VERSION, MILESTONE_KIND, MILESTONE_NUMBER each time; assistant derives the rest. Leave PR number references and assignment history intact unless ownership changes.

## Assignment Table (updated using .NET 10 RC 1 assignees)

The table below reflects the assignee(s) actually used on the most recent component PRs for .NET 10 RC 1 (PRs #10049–#10060). Use these as the current default owners for upcoming milestones unless ownership changes again. Notable change: libraries and runtime primary owners effectively swapped compared to Preview 7 (libraries → @ericstj, runtime → @richlander). Additional previously listed secondary owners were trimmed where they were not present as assignees on the RC 1 PR.

| File | Assignee(s) | .NET 10 RC 1 PR |
|------|-------------|-----------------|
| aspnetcore.md | @danroth27 | #10049 |
| containers.md | @lbussell | #10050 |
| csharp.md | @BillWagner | #10051 |
| dotnetmaui.md | @davidortinau | #10052 |
| efcore.md | @roji | #10053 |
| fsharp.md | @T-Gro | #10054 |
| libraries.md | @ericstj @artl93 | #10055 |
| runtime.md | @richlander | #10056 |
| sdk.md | @baronfel | #10057 |
| visualbasic.md | @BillWagner | #10058 |
| winforms.md | @KlausLoeffelmann @merriemcgaw | #10059 |
| wpf.md | @harshit7962 @adegeo | #10060 |

Here are the files to process one at a time:

- aspnetcore.md
- containers.md
- csharp.md
- dotnetmaui.md
- efcore.md
- fsharp.md
- libraries.md
- runtime.md
- sdk.md
- visualbasic.md
- winforms.md
- wpf.md

## Master Consolidation PR

After all component PRs are opened for the milestone, create a consolidation PR:

1. Source: `dotnet${DOTNET_VERSION}-${MilestonePrefix}` → Target: `main`
1. Title: `Add release notes for .NET ${DOTNET_VERSION} ${Milestone Label} across various components`
1. Body sections:
   - Intro sentence
   - Bullet list of component PRs (e.g. `- ASP.NET Core: #<PR>`)
   - CC release management (e.g. `@leecow @rbhanda @victorisr`)
1. Match the structure used previously (see Preview 7 consolidation PR #10006) for consistency.

When adapting for another milestone, update only the branch name, title milestone label, and intro sentence.
