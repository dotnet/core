# WPF in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new with WPF in this preview release:

- [Performance Improvements](#performance-improvements)
- [Fluent Style Changes](#fluent-style-changes)
- [Bug Fixes](#bug-fixes)
- [Miscellaneous Changes](#miscellaneous-changes)

WPF updates in .NET 10:

- [High-level what's new in WPF with .NET 10.](https://learn.microsoft.com/dotnet/desktop/wpf/whats-new/net100)

## Performance Improvements

Enhanced performance by optimizing cache operations, array handling, and migrating font collection loader to managed code.

## Fluent Style Changes

Introduced new Fluent styles for controls, such as:

- `NavigationWindow`
- `Frame`
- `ToolBar`
- `ResizeGrip`
- `GroupBox`
- `Hyperlink`
- `GridSplitter`
- `Thumb.`

Fixed elevation border brushes for various controls and corrected missing `RecognizesAccessKey` property.

## Bug Fixes

- Addressed several bugs including memory leaks, control behavior anomalies, and property recognition issues.
- Fixed faulty caching of `LinearGradientBrushes` when `RelativeTransform` was being used along with `Absolute` mapping mode.

## Miscellaneous Changes

Code Cleanup and Refactoring

- Conducted extensive code cleanups, including syntax standardization and argument clarity, to improve code readability and maintainability.
- Established code-coverage for WPF, added functionality tests for `Clipboard` and resolved issues with `DependencyProperty` tests.
- Incorporated design-time markup compilation to facilitate smoother development workflows.
