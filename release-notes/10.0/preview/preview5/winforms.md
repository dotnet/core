# Windows Forms in .NET 10 Preview 5 - Release Notes

Here's a summary of what's new in Windows Forms in this preview release:

- [Bug Fixes](#bug-fixes)
- [Engineering Health](#engineering-health)

## Windows Forms updates in .NET 10

- [What's new in Windows Forms in .NET 10](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/net100) documentation.
- [Issues List for Windows Forms in .NET 10 Preview 5](https://github.com/dotnet/winforms/issues?q=is%3Aissue%20milestone%3A%2210%20Preview5%22%20)

## Bug Fixes

Addressed various bug fixes including:

- Fixing a regression regarding `PrinterSettings.DefaultPageSettings.Color` returning an incorrect value.
- Removing false positives being returned by the WFO1000 Analyzer when analyzing properties of interfaces derived from IComponent.
- Resolving a memory leak in the MSHTML component.
- Addressing an `InvalidOperationException` in the constructor of `ListViewGroupAccessibleObject`

## Engineering Health

- Updated DemoConsole test application to accurately demonstrate and test usage of types in the `System.Windows.Forms.Design` namespace.
- Removed deprecated .NET runtime and unnecessary package references, and conducted style cleanups to address warnings and improve code quality.
