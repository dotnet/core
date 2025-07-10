# Windows Forms in .NET 10 Preview 6 - Release Notes

Here's a summary of what's new in Windows Forms in this preview release:

- [Windows Forms updates in .NET 10](#windows-forms-updates-in-net-10)
- [New Features and enhancements in .NET 10 Preview 6](#new-features-and-enhancements-in-net-10-preview-6)
- [Fixed Issues in .NET 10 Preview 6](#fixed-issues-in-net-10-preview-6)

## Windows Forms updates in .NET 10

- [What's new in Windows Forms in .NET 10](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/net100) documentation.

## New Features and enhancements in .NET 10 Preview 6

### Dark Mode & Styling

This release brings several improvements to dark mode support in Windows Forms.

- `ListView` ColumnHeaders` are rendering correctly in dark mode now.
- All `ToolStrip` based controls (`MenuStrip`, `StatusStrip`) have their dedicated System Darkmode renderes, and do not rely any longer on additional Professional renderers, which make them compatible to certain A11Y requirements.
- All `ButtonBase` derived push-style controls have their dedicated dark mode renderers. Please note that in contrast to the existing docs, which was somewhat unprecise about the auto owner-rendering of using `ButtonRenderers` vs. wrapped Win32 Button controls, `Standard` `FlatStyle` renderers ARE owner drawn (and always were). Only setting the renderers to System actually wraps a `ButtonBase` control around the native Win32 Button and delegates painting/handling down completely. All remaining `FlatStyle` settings are either relying on VisualStyle-based- or entirely owner rendering. Thus, we've introduced a series of dedicated Button dark mode renderers which are also fixing a series of small bugs as well as one prominent bug, where Buttons would be ignoring dark mode background theming in 96 dpi.
- We fixed the base functionality as far as the Win32 allowed for `TabControl`: Horizontal orientation of tabs are rendering the tabs themselves now correctly in dark mode, and the oversized light-gray/white frame around the respective tab area has been mitigated for most scenarios. Note though that vertical tab orientation and different Tab-Button styles are NOT supported in dark mode, and are not at all high on our priority list.
- We fixed an issue with the `ListBox` dark mode, when using check boxes for List items which had been previously rendered with a white background.
- We've fixed a series of cases when both `RadioButton` and `CheckBox` controls had been rendered with a white background of the actual control background.

### ScreenCaptureMode API

New security APIs have been introduced to protect forms containing sensitive information from the usual screen capture approaches. Please see the new `FormScreenCaptureMode` property for the `Form` class, and the `ScreenCaptureMode` settings for more information.

## Fixed Issues in .NET 10 Preview 6

### Clipboard & Drag/Drop

Clipboard and drag-and-drop functionality have been enhanced with async support and improved reliability. Updates include fixes to drop target methods, investigation and resolution of async clipboard issues, and new capabilities for consuming async drag-and-drop operations.

### Designer & DemoConsole Issues

Numerous improvements and bug fixes have been made to the Designer and DemoConsole application. These include enhanced stability when editing menu items, improved property handling, fixes for control selection and movement, and better support for copy-paste and keyboard shortcuts in the demo environment.

### Infrastructure & Miscellaneous

This release also includes infrastructure updates, code quality improvements, and internal refactoring to enhance maintainability and reliability across the codebase.
