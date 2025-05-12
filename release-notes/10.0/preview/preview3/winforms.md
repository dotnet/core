# Windows Forms in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new in Windows Forms in this preview release:

- [Bug Fixes](#bug-fixes)
- [Engineering Health](#engineering-health)

## Windows Forms updates in .NET 10

- [What's new in Windows Forms in .NET 10](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/net100) documentation.
- [Issues List for Windows Forms in .NET 10 Preview 3](https://github.com/dotnet/winforms/issues?q=is%3Aissue%20milestone%3A%2210.0%20Preview3%22%20)

## Bug Fixes

Addressed various bug fixes including:

- Fixing a regression relating to colors in the `DrawListViewColumnEditorEventArgs`
- Addressing an issue where NVDA screen reader did not render a focus rectangle when reading a the contnet of a property in the `PropertyGrid` control.
- Fixing an issue with `ToolStrip` control when using keyboard navigation with multiple `ToolStrip` controls present on the form.

## Engineering Health

- Continued work towards the consolidation of Clipboard code with WPF.
- Updated DemoConsole test application to accurately demonstrate and test usage of types in the `System.Windows.Forms.Design` namespace.
- Removed deprecated .NET runtime and unnecessary package references, and conducted style cleanups to address warnings and improve code quality.
