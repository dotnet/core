# WPF in .NET 10 Preview 4 - Release Notes

Here's a summary of what's new in WPF in this preview release:

- [API Enhancements](#api-enhancements)
- [Shared Clipboard Code](#code-cleanup--refactoring)
- [Fluent Theme Bug Fixes and Enhancements](#fluent-theme-bug-fixes-and-enhancements)
- [Performance Improvements](#performance-improvements)
- [Code Cleanup & Refactoring](#code-cleanup--refactoring)
- [Tests and Test Coverage](#tests-and-test-coverage)
- [Known Issues](#known-issues)
- [Breaking changes](#breaking-changes)

WPF updates in .NET 10:

- [What's new in WPF in .NET 10](https://learn.microsoft.com/dotnet/desktop/wpf/whats-new/net100) documentation.

## API Enhancements

In this release, extended `MessageBox` options are available ([#9613](https://github.com/dotnet/wpf/issues/9613)). We would like to thank GitHub user **bstordrup** for his efforts on creating the API proposal and implementing the API.

## Shared Clipboard Code

Aligned the `Clipboard` and `DataObject` code with Winforms and relocated it to a shared codebase in the `System.Windows.Private.Core` namespace within Winforms.

## Fluent Theme Bug Fixes and Enhancements

There were major styling updates in text-based controls : `TextBox`, `DatePicker`, `RichTextBox`, etc. which brings these styles and corresponding resources in parity with WinUI styles and fixes a lot of bugs in the styles. However, this introduced a bug that's covered in the [Known Issues](#known-issues) section.

Fixed other styles including `MenuItem`, `Expander` and `TreeViewItem's` right-to-left layout issues. Common brush resources were added, improving visual consistency across Fluent-styled controls.

## Performance Improvements

Performance was optimized across font rendering, dynamic resources, input composition, trace logging, regex usage, and XAML parsing. Redundant allocations were removed and core internals were streamlined for improved efficiency.

## Code Cleanup & Refactoring

Dead code and unsupported templates were removed, and broad style cleanup addressed IDE warnings and code formatting. Debugging patterns were modernized, and use of legacy constructs like ArrayList was phased out for maintainability.

## Tests and Test Coverage

Tests were added for converters, clipboard operations, and public APIs. This reinforces reliability and validates bug fixes introduced in recent previews. Some flaky tests were fixed.

## Known Issues

### Unexpected crashes in TextBox(es) in Fluent Theme

While using the Fluent themes in WPF, and setting the `ThemeMode` as `System`, the controls based on TextBoxes will not be loaded and would lead to crash in applications with the following error code: `InvalidOperationException: '{DependencyProperty.UnsetValue}' is not a valid value for property 'BorderThickness'`. The following controls are affected:

- TextBox
- RichTextBox
- PasswordBox

**Work Around:**

There is no known workaround for the issue currently, but the newer releases of .NET 10 would have this fixed. Developers are advised to use `Light` or `Dark` modes to work their way around this exception in preview 4.

.NET 10 preview 5 will contain a fix for this issue.

### Crash while using DatePicker control in Fluent Theme

Similar to the issue of crashes while using TextBox based controls, while using `DatePicker` when `ThemeMode` is set to `System` would lead to crash in application with the following error message: `System.Windows.Markup.XamlParseException: 'Provide value on 'System.Windows.Markup.StaticResourceHolder' threw an exception.'`.

**Work Around:**

One can use the `System` theme by loading the fluent.xaml directly in their applications.

Include the following in the App.xaml to restore the previous behavior:

```xml
<Application x:Class="SampleFluentApplication.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:local="clr-namespace:SampleFluentApplication"
             StartupUri="MainWindow.xaml">
    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <ResourceDictionary Source="pack://application:,,,/PresentationFramework.Fluent;component/Themes/Fluent.xaml" />
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Application.Resources>
</Application>
```

We are working on getting this fixed in upcoming releases of .NET 10.

## Breaking changes

Due to our recent efforts in optimizing the performance of dynamic resources, the incorrect initialization of such resources might now lead to crashing applications, given an incorrect type of resource is used. Previously, this would have resulted in an `InvalidOperationException`, which would have been consumed without causing the crash.
