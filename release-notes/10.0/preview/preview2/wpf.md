# WPF in .NET 10 Preview 2 - Release Notes

This release focused on performance and bug fixes. You can find detailed information about the improvements below:

- [Performance Improvements](#performance-improvements)
- [Fluent Style Changes](#fluent-style-changes)
- [Bug Fixes](#bug-fixes)
- [Engineering Health](#engineering-health)

WPF updates in .NET 10:

- [What's new in WPF in .NET 10](https://learn.microsoft.com/dotnet/desktop/wpf/whats-new/net100) documentation

## Performance Improvements

Enhanced performance by replacing data structures and optimizing method operations, including a shift from `PartialList` to `ReadOnlyCollection`, minimizing allocations in UI automation and file dialogs, and speeding up pixel format conversions.

## Fluent Style Changes

Various bug fixes have been addressed in .NET 10 Preview 2, to improve the Fluent UI style support in WPF.

- Default style for `Label`.
- Fixed the animation for `Expander` by adjusting a `KeyTime` value.

## Bug Fixes

Addressed various bug fixes including UI element cursor types, crash issues when bitmap streams are null, build and test step errors, and minor bugs in `BitmapMetadata` and native dependencies. Other fixes include:

- Updated text pointer normalization
- Fixed localization issues for `ScrollViewer` and `ContextMenu`.

## Engineering Health

- Updated and synchronized **MilCodeGen** across multiple WPF components and disabled code analysis for generated code to streamline builds.
- Removed deprecated .NET runtime and unnecessary package references, and conducted style cleanups to address warnings and improve code quality.

 
