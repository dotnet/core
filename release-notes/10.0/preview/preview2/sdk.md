# .NET SDK in .NET 10 Preview 2 - Release Notes

Here's a summary of what's new in the .NET SDK in this preview release:

- [More consistent command order](#more-consistent-command-order)

.NET SDK updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## More consistent command order

Starting in .NET 10, the `dotnet` CLI tool learned a few new aliases for commonly-used but often-forgotten commands. The new commands are:

- `dotnet package add`
- `dotnet package list`
- `dotnet package remove`
- `dotnet reference add`
- `dotnet reference list`
- `dotnet reference remove`

These commands exist in the current versions of the `dotnet` CLI, but they exist in verb-first forms:
`dotnet add package`, `dotnet list package`, `dotnet remove package`, `dotnet add reference`, `dotnet list reference`, and `dotnet remove reference`.
The new aliases are provided to make the commands easier to remember and type.
Over the years, we have heard your feedback that the verb-first forms are not as intuitive as they could be, so we hope that these new aliases will help.
Since the `dotnet` CLI was initially created, noun-first forms have become a general standard for CLI applications of all kinds, so we hope that this change will make the `dotnet` CLI more consistent with other CLI tools you use.

The verb-first forms will continue to work in .NET 10, but we recommend that you start using the noun-first forms to make your scripts and documentation more readable and easier to understand.
