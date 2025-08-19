# Create PRs for .NET 10 release milestones (Preview or RC)

Use this workflow to create one PR per release-notes file for .NET 10 pre-release milestones. It supports both Previews (typically 6 or 7; .NET 10 had 7) and Release Candidates (RC). After the last Preview, the next milestone is RC1.

Fixed settings:

- Version Major: 10
- Version Path: 10.0

Inputs:

- Milestone Kind: `{milestoneKind}` — either `preview` or `rc`
- Milestone Number: `{milestoneNumber}` — integer like `1`, `2`, ... (`7` for the last preview of .NET 10; next is `1` for RC1)

Derived values:

- Release notes folder: `release-notes/10.0/{milestoneKind}/{milestoneKind}{milestoneNumber}` (e.g., `release-notes/10.0/preview/preview7` or `release-notes/10.0/rc/rc1`)
- Branch prefix (short): `{short}` where `{short} = 'p'` when `{milestoneKind} = 'preview'`, otherwise `{short} = 'rc'`
- Base branch for iteration: `dotnet10-{short}{milestoneNumber}` (e.g., `dotnet10-p7` or `dotnet10-rc1`)
- Per-file working branch: `dotnet10-{short}{milestoneNumber}-{name}`
- Milestone label for titles/bodies: `{MilestoneLabel}` — use `Preview {milestoneNumber}` for previews and `RC {milestoneNumber}` for RCs

Process (repeat per file in the milestone folder):

1. From the base branch `dotnet10-{short}{milestoneNumber}`, create a new branch named `dotnet10-{short}{milestoneNumber}-{name}` where `{name}` is the filename without extension.
2. Modify the corresponding file by adding a simple new line at the end with the text: `Something about the feature`.
3. Commit with message: `Update {name} for {MilestoneLabel}`.
4. Push the branch to the remote repository.
5. Create a pull request with:
	- Title: `Update {name} for {MilestoneLabel}`
	- Body: `Please update the release notes here as needed for {MilestoneLabel}.\n\n/cc @{assignees}`
	- Assignees: Assign the PR to the person(s) listed for the file in the table below.
6. Switch back to the base branch `dotnet10-{short}{milestoneNumber}` and repeat for the next file.

Notes:

- Previews usually run 6–7 iterations; after the final Preview, the next milestone is `RC1`.
- Keep the same file-to-assignee mapping unless explicitly changed.

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
