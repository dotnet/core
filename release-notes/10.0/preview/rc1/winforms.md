# WinForms .NET 10 RC1 Release Notes

## Overview

Welcome to the first Release Candidate (RC1) of WinForms for .NET 10! This release brings key improvements in dark mode support and async functionality.

## Key Highlights

- **Dark Mode Now Fully Integrated**: Dark mode is officially out of experimental status and can be used without special configuration. Keep in mind that the dark mode renderer relies on underlying Win32 controls, and while we anticipate improvements, dark mode support will evolve over time. Please refer to our updated docs for the latest scope and details.

- **Clarification on ControlStyles  `ApplyThemingImplicitlyUsage`**: While the `ControlStyles` enum element `ApplyThemingImplicitly`  isn’t new, it now has a more precise application for opting in or out of dark mode themin: It’s crucial to set this enum flag in a derived control in `CreateParams` _before_ calling the base method. Due to the original WinForms design, `CreateParams` runs before derived class constructors, and this order can be a common pitfall if not highlighted. We've updated the docs with this note, and it’s important for developers inheriting controls to follow this guidance, if they want their control to opt in or out implicit theming handling.

## Additional Improvements

- **Renderer and Color Fixes**: We've resolved issues with foreground and background colors for buttons and text boxes in dark mode.

- **Async Enhancements**: `InvokeAsync`, `ShowAsync`, and `ShowDialogAsync` are now stable and out of experimental mode, with optimized allocations and documented behavior for canceled tasks.

- **Improved Form.Show Async State Management**: The async task state now carries a weak reference to the form, enabling responsive UIs when managing multiple windows.
