# Create PRs for .NET 10 RC 1

Use this workflow to create one PR per release-notes file for .NET 10 RC 1.

Fixed settings:

- Version Major: 10
- Version Path: 10.0
- Milestone Kind: `rc`
- Milestone Number: `1`

Derived values:

- Release notes folder: `release-notes/10.0/preview/rc1`
- Base branch: `dotnet10-rc1`
- Per-file working branch: `dotnet10-rc1-{name}`
- Milestone label: `RC 1`

Process (repeat per file in the RC1 folder):

1. Create a new branch from the base branch `dotnet10-rc1` with name `dotnet10-rc1-{name}`
1. Modify the corresponding file by replacing any "TBD" placeholder text with: `Something about the feature`.
1. Validate markdown formatting using markdownlint with the repository's settings (`.github/linters/.markdown-lint.yml`).
1. Commit with message: `Update {name} for RC 1`.
1. Push the branch to the remote repository.
1. Create a pull request with:

- Title: `Update {name} for RC 1`
- Body: `Please update the release notes here as needed for RC 1.\n\n/cc @{assignees}`

1. Assign the PR using GitHub CLI: `gh pr edit <PR_NUMBER> --add-assignee <username>` (use the first listed person for files with multiple assignees)
1. Switch back to the base branch `dotnet10-rc1` and repeat for the next file.

Notes:

- All RC 1 release notes are in the `release-notes/10.0/preview/rc1/` directory.
- Keep the same file-to-assignee mapping unless explicitly changed.
- Use GitHub CLI for assignments as it's more reliable than the API: `gh pr edit <PR_NUMBER> --add-assignee <username>`
- For files with multiple assignees, assign to the first listed person only.
- Replace "TBD" placeholders rather than adding content to avoid duplication.
- Run markdownlint validation before committing: The repository uses `.github/linters/.markdown-lint.yml` for linting rules.
- Ensure all markdown files have proper trailing newlines and follow the established formatting standards.

## Assignment Table (based on Preview 7 PRs)

| File | Assignee(s) | Based on Preview 7 PR |
|------|-------------|-----------------------|
| aspnetcore.md | @danroth27 | #10023 |
| containers.md | @lbussell | #9995 |
| csharp.md | @BillWagner @MadsTorgersen @jcouv | #9996 |
| dotnetmaui.md | @davidortinau | #9997 |
| efcore.md | @roji | #9998 |
| fsharp.md | @T-Gro | #9999 |
| libraries.md | @richlander @tarekgh | #10000 |
| runtime.md | @ericstj @kunalspathak @AndyAyersMS | #10001 |
| sdk.md | @baronfel @mariam-abdulla @nohwnd @DamianEdwards | #10002 |
| visualbasic.md | @BillWagner | #10003 |
| winforms.md | @merriemcgaw @KlausLoeffelmann | #10004 |
| wpf.md | @harshit7962 @adegeo | #10005 |

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

After creating all individual component PRs, create a master consolidation PR:

1. Create a PR from `dotnet10-rc1` to `main` with:
   - Title: `Add release notes for .NET 10 RC 1 across various components`
   - Body: Include references to all component PRs and cc the release management team
   - Pattern: Follow the same structure as the Preview 7 master PR (#10006)
