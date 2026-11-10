# Windows Forms in .NET 11 - Release Notes

The final Windows Forms updates for .NET 11 focus on quality and stability.

For features introduced throughout the release, see [What's new in Windows Forms for .NET 11](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/net110).

## Breaking changes and migration

Before upgrading an existing app, review [Breaking changes in .NET 11](https://learn.microsoft.com/dotnet/core/compatibility/11).

## Bug fixes

### Accessibility

- [Correct the accessibility notification check in Control.AccessibilityNotifyClients](https://github.com/dotnet/winforms/pull/15222)

### Clipboard

- [Fix a clipboard format-dictionary race that can cause operations to fail or hang](https://github.com/dotnet/winforms/pull/15329)
