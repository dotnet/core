# Windows Forms in .NET 11 Preview 6 - Release Notes

<!-- Verified against Microsoft.WindowsDesktop.App.Ref@11.0.0-preview.6.26328.106; API diff showed no public API changes. -->

.NET 11 Preview 6 does not introduce new Windows Forms feature additions. The
notable user-facing change in this preview is a regression fix for
ToolStripDropDown focus handling in SmartTag and dropdown scenarios.

## Bug fixes

- **System.Windows.Forms.ToolStrip**
  - `ToolStripDropDown` now preserves modal menu tracking during focus changes.
    This lets SmartTag and dropdown UI close normally when users switch tab
    pages or otherwise move focus
    ([dotnet/winforms #14606](https://github.com/dotnet/winforms/pull/14606)).
