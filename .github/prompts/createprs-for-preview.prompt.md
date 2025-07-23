---
mode: agent
---


Go through each folder in release-notes/10.0/preview7 and one at a time i want you do to the following:

1. create a new branch names **dotnet10-p7-<name>** where <name> is the name of the file without the extension.
2. modify the file in some simple way by adding a new line at the end of the file with the text "Something about the feature" in it.
3. commit the change with the message "Update <name> for preview 7" where <name> is the name of the file without the extension.
4. push the branch to the remote repository.
5. create a pull request with the title "Update <name> for preview 7" and the body "This PR updates the <name> file for preview 7. Please make any additional changes to this based on the new items." where <name> is the name of the file without the extension.
6. go back to the dotnet10-p7 branch and repeat the process for the next file.

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