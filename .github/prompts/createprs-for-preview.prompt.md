# Create PRs for Preview

Go through each folder in release-notes/10.0/preview7 and one at a time i want you do to the following:

1. create a new branch names **dotnet10-p7-{name}** where {name} is the name of the file without the extension.
2. modify the file in some simple way by adding a new line at the end of the file with the text "Something about the feature" in it.
3. commit the change with the message "Update {name} for preview 7" where {name} is the name of the file without the extension.
4. push the branch to the remote repository.
5. create a pull request with the title "Update {name} for preview 7" and the body "Please update the release notes here as needed for Preview 7.\n\n/cc @{reviewer}" where {name} is the name of the file without the extension and {reviewer} is assigned based on the assignment table below.
6. go back to the dotnet10-p7 branch and repeat the process for the next file.

## Assignment Table (based on Preview 6 patterns)

| File | Assignee(s) | Based on Preview 6 PR |
|------|-------------|----------------------|
| aspnetcore.md | @danroth27 | #9953 |
| containers.md | @lbussell | #9942 |
| csharp.md | @BillWagner | #9943 |
| dotnetmaui.md | @davidortinau | #10013 |
| efcore.md | @roji | #9945 |
| fsharp.md | @T-Gro | #9946 |
| libraries.md | @richlander @tarekgh | #9952 |
| runtime.md | @ericstj @kunalspathak | #9951 |
| sdk.md | @baronfel @mariam-abdulla @nohwnd | #9949 |
| visualbasic.md | @BillWagner | #9950 |
| winforms.md | @merriemcgaw | #9947 |
| wpf.md | @harshit7962 | #9948 |

Here are the files you need to do this one at a time for:

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