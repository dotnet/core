# Windows Forms in .NET 11 RC 2 - Release Notes

RC 2 refines the visual styles introduced during .NET 11 previews.

## Changes since the previous preview

- **Composite controls:** `VisualStylesMode.Net11` no longer enables the new styling for composite controls such as `ToolStrip` and `DataGridView` while their layout modernization remains unfinished. Apps testing the new appearance in RC 1 should expect these controls to retain their previous styles in RC 2 ([dotnet/winforms #15033](https://github.com/dotnet/winforms/pull/15033), [dotnet/winforms #15114](https://github.com/dotnet/winforms/pull/15114)).

## Bug fixes

- **Visual styles:** Check boxes and radio buttons respect explicit background colors, and text in `TextBox` and `ComboBox` controls is no longer clipped at the bottom ([dotnet/winforms #15101](https://github.com/dotnet/winforms/pull/15101), [dotnet/winforms #15106](https://github.com/dotnet/winforms/pull/15106)).
