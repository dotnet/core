# WPF in .NET 10 Preview 5 - Release Notes

Here's a summary of what's new in WPF in this preview release:

- [XAML Grid Syntax Enhancements](#xaml-grid-syntax-enhancements)
- [Font and Globalization Updates](#font-and-globalization-updates)
- [Fluent Theme Improvements](#fluent-theme-improvements)
- [Performance and Code Quality Improvements](#performance-and-code-quality-improvements)

WPF updates in .NET 10:

- [What's new in WPF in .NET 10](https://learn.microsoft.com/dotnet/desktop/wpf/whats-new/net100) documentation.

## XAML Grid Syntax Enhancements

This release introduces a new shorthand syntax for defining `Grid.RowDefinitions` and `Grid.ColumnDefinitions` in XAML, with full support for XAML Hot Reload.

**Example:**

```xml
<Grid RowDefinitions="Auto,*,Auto" ColumnDefinitions="*, Auto">
    <TextBlock Text="Row 0, Col 0" Grid.Row="0" Grid.Column="0" />
    <TextBlock Text="Row 1, Col 1" Grid.Row="1" Grid.Column="1" />
    <TextBlock Text="Row 2, Col 0" Grid.Row="2" Grid.Column="0" />
</Grid>
```

This shorthand allows you to specify row and column sizes directly in the `RowDefinitions` and `ColumnDefinitions` attributes, making XAML more concise and readable.

## Font and Globalization Updates

The `simsun-extg` font has been added to improve character rendering, especially for East Asian languages.

## Fluent Theme Improvements

Resolved crashes in the Fluent theme related to the `TextBox` control. Enhanced styling for `SelectionBrush` and `Thumb` controls, and improved visual accuracy by correcting the `Expander` arrow direction in right-to-left (RTL) layouts.

## Performance and Code Quality Improvements

This release includes several improvements to performance and code quality:

- Reduced memory allocations by replacing boxed collections such as `ArrayList`, `Hashtable`, and `IList` with more efficient alternatives like arrays and generic collections.
- Optimized internal logic by refining parsing routines and removing unused fields in utilities such as `DpiHelper` and `XamlSchema`.
- Eliminated the static constructor from `KnownColors` to improve runtime performance.
- Removed legacy or unused code, including the `ReflectionHelper` for WinRT.
