# Create PRs for .NET 10 release milestones (Preview, RC, or GA)

Use this workflow to create one PR per release-notes file for .NET 10 milestones. It supports Previews (typically 6 or 7; .NET 10 had 7), Release Candidates (RC), and the GA release. After the last Preview, the next milestone is RC1, followed by GA.

Fixed settings:

- Version Major: 10
- Version Path: 10.0

Inputs:

- Milestone Kind: `{milestoneKind}` — one of `preview`, `rc`, or `ga`
- Milestone Number: `{milestoneNumber}` — required for `preview`/`rc` (e.g., `7`, `1`), omit for `ga`

Derived values:

- Release notes folder (always under the `preview` subfolder):
	- For Preview N: `release-notes/10.0/preview/preview{milestoneNumber}` (e.g., `release-notes/10.0/preview/preview7`)
	- For RC N: `release-notes/10.0/preview/rc{milestoneNumber}` (e.g., `release-notes/10.0/preview/rc1`)
	- For GA: `release-notes/10.0/preview/ga`
- Branch prefix (short): `{short}` mapping — `preview` → `p`, `rc` → `rc`, `ga` → `ga`
- Base branch for iteration:
	- Preview N → `dotnet10-p{milestoneNumber}` (e.g., `dotnet10-p7`)
	- RC N → `dotnet10-rc{milestoneNumber}` (e.g., `dotnet10-rc1`)
	- GA → `dotnet10-ga`
- Per-file working branch:
	- Preview N → `dotnet10-p{milestoneNumber}-{name}`
	- RC N → `dotnet10-rc{milestoneNumber}-{name}`
	- GA → `dotnet10-ga-{name}`
- Milestone label for titles/bodies: `Preview {N}`, `RC {N}`, or `GA`

Process (repeat per file in the milestone folder):

1. Create a new branch from the appropriate base branch (see mapping above):
	- Preview N: base `dotnet10-p{N}`, new branch `dotnet10-p{N}-{name}`
	- RC N: base `dotnet10-rc{N}`, new branch `dotnet10-rc{N}-{name}`
	- GA: base `dotnet10-ga`, new branch `dotnet10-ga-{name}`
2. Modify the corresponding file by adding a simple new line at the end with the text: `Something about the feature`.
3. Commit with message: `Update {name} for {MilestoneLabel}`.
4. Push the branch to the remote repository.
5. Create a pull request with:
	- Title: `Update {name} for {MilestoneLabel}`
	- Body: `Please update the release notes here as needed for {MilestoneLabel}.\n\n/cc @{assignees}`
	- Assignees: Assign the PR to the person(s) listed for the file in the table below.
6. Switch back to the corresponding base branch (e.g., `dotnet10-p{N}`, `dotnet10-rc{N}`, or `dotnet10-ga`) and repeat for the next file.

Notes:

- Previews usually run 6–7 iterations; after the final Preview, the next milestone is `RC1`, followed by `GA`.
- All Preview, RC, and GA release notes live under the `release-notes/10.0/preview/` directory (for example, `.NET 9 RC 1` notes are in `release-notes/9.0/preview/rc1`).
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
