# Create PRs for .NET Preview Component Files

Use this workflow to create one PR per component release-notes file for a specific .NET Preview milestone.

This flow assumes the preview folder was scaffolded with only the two core files (`${DOTNET_VERSION}.0.0-preview.${PREVIEW_NUMBER}.md` and `README.md`) and the component files do not exist yet.

Supply two inputs when you invoke it:

- DOTNET_VERSION (major only, e.g. 10, 11)
- PREVIEW_NUMBER (1–7)

PR numbers and historical references remain concrete; only version and preview values change per cycle.

## Runtime inputs (provide these when invoking)

Required:

- DOTNET_VERSION (major) – e.g. 10
- PREVIEW_NUMBER – 1 to 7

Derived:

- Milestone Label = `Preview ${PREVIEW_NUMBER}`
- Version Path = `${DOTNET_VERSION}.0`
- Base Branch = `dotnet${DOTNET_VERSION}-p${PREVIEW_NUMBER}`
- Preview Folder = `release-notes/${DOTNET_VERSION}.0/preview/preview${PREVIEW_NUMBER}`
- Working Branch Pattern = `dotnet${DOTNET_VERSION}-p${PREVIEW_NUMBER}-{name-noext}`

Example (not baked in): DOTNET_VERSION=10, PREVIEW_NUMBER=7 ⇒ label `Preview 7`, base branch `dotnet10-p7`, folder `release-notes/10.0/preview/preview7`.

## Process (repeat for each file, one at a time)

1. Create a new branch from the milestone base branch:
   - `git switch -c dotnet${DOTNET_VERSION}-p${PREVIEW_NUMBER}-{name-noext} origin/dotnet${DOTNET_VERSION}-p${PREVIEW_NUMBER}`
1. Create the component file at:
   - `release-notes/${DOTNET_VERSION}.0/preview/preview${PREVIEW_NUMBER}/{name}`
1. Add the base content scaffold below, substituting `<Product/Area>` and `${Milestone Label}`:

```markdown
# <Product/Area> in .NET ${DOTNET_VERSION} ${Milestone Label} - Release Notes

Here's a summary of what's new in <Product/Area> in this ${Milestone Label} release:

- [Feature](#feature)

## Feature

Feature summary
```

1. Run markdown lint for just that file:
   - `npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/${DOTNET_VERSION}.0/preview/preview${PREVIEW_NUMBER}/{name}`
1. Commit:
   - `Add {name} for .NET ${DOTNET_VERSION} ${Milestone Label}`
1. Push the working branch.
1. Create a pull request with title:
   - `Add {name} for .NET ${DOTNET_VERSION} ${Milestone Label}`

   And body:

```text
Please update the release notes here as needed for ${Milestone Label}.

/cc @{assignees}
```

1. Assign the PR to the first person listed for that file:
   - `gh pr edit <PR_NUMBER> --add-assignee <username>`
1. Switch back to `dotnet${DOTNET_VERSION}-p${PREVIEW_NUMBER}` and repeat for the next file.

## Important behavior change from older workflow

- Do not look for or replace existing placeholder text in component files.
- Do not duplicate/copy previous preview component files into this folder.
- In this workflow, each component file is created fresh in its own branch and PR.

## Notes

- All component files for the milestone live under `release-notes/${DOTNET_VERSION}.0/preview/preview${PREVIEW_NUMBER}/`.
- Keep the same file-to-assignee mapping unless explicitly changed.
- Use GitHub CLI for assignee setting; it's more reliable than reviewer assignment for this workflow.
- Ensure trailing newline, consistent heading style, and no stray whitespace.

No need to edit this file between milestones. Provide DOTNET_VERSION and PREVIEW_NUMBER each time; assistant derives the rest.

## Assignment Table (updated using .NET 10 RC 1 assignees)

Use these as default owners unless ownership changes.

| File | Assignee(s) | .NET 10 RC 1 PR |
| ------ | ----------- | --------------- |
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

Files to process one at a time:

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

1. Source: `dotnet${DOTNET_VERSION}-p${PREVIEW_NUMBER}` → Target: `main`
2. Title: `Add release notes for .NET ${DOTNET_VERSION} Preview ${PREVIEW_NUMBER} across various components`
3. Body sections:
   - Intro sentence
   - Bullet list of component PRs (e.g. `- ASP.NET Core: #<PR>`)
   - CC release management (e.g. `@leecow @rbhanda @victorisr`)
4. Match the structure used previously (see Preview 7 consolidation PR #10006) for consistency.

When adapting for another preview, update only the preview number, branch name, and title milestone label.
