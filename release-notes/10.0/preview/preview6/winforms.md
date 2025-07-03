# Windows Forms in .NET 10 Preview 6 - Release Notes

Here's a summary of what's new in Windows Forms in this preview release:

- [Windows Forms updates in .NET 10](#windows-forms-updates-in-net-10)
- [New Features and enhancements in .NET 10 Preview 6](#new-features-and-enhancements-in-net-10-preview-6)
- [Fixed Issues in .NET 10 Preview 6](#fixed-issues-in-net-10-preview-6)

## Windows Forms updates in .NET 10

- [What's new in Windows Forms in .NET 10](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/net100) documentation.

## New Features and enhancements in .NET 10 Preview 6

### Dark Mode & Styling

This release brings several improvements to dark mode support in Windows Forms. ListView column headers, StatusStrip, ToolStrip, and buttons with FlatStyle 'Standard' now render correctly in dark mode, including fixes for color issues and regressions introduced in previous versions.

### ScreenCaptureMode API

New APIs have been introduced to exclude forms and controls from screen capture and a renaming of the ScreenCaptureMode API for clarity and consistency.

## Fixed Issues in .NET 10 Preview 6

### Clipboard & Drag/Drop

Clipboard and drag-and-drop functionality have been enhanced with async support and improved reliability. Updates include fixes to drop target methods, investigation and resolution of async clipboard issues, and new capabilities for consuming async drag-and-drop operations.

### Designer & DemoConsole Issues

Numerous improvements and bug fixes have been made to the Designer and DemoConsole application. These include enhanced stability when editing menu items, improved property handling, fixes for control selection and movement, and better support for copy-paste and keyboard shortcuts in the demo environment.

### Infrastructure & Miscellaneous

This release also includes infrastructure updates, code quality improvements, and internal refactoring to enhance maintainability and reliability across the codebase.
