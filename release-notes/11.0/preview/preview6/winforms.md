# Windows Forms in .NET 11 Preview 6 - Release Notes

<!-- Verified against Microsoft.WindowsDesktop.App.Ref@11.0.0-preview.6.26328.106; API diff showed no public API changes. -->

.NET 11 Preview 6 does not introduce new Windows Forms feature additions.

## Bug fixes

- **System.Windows.Forms.PropertyGrid**
  - `SelectedObjects` now displays typed arrays correctly when `PropertySort` is set to `NoSort`
    ([dotnet/winforms #14190](https://github.com/dotnet/winforms/pull/14190)).
  - `SelectedTab` now changes correctly when a new `SelectedObject` is assigned
    ([dotnet/winforms #14438](https://github.com/dotnet/winforms/pull/14438)).
  - The cursor editor now caches its scaled icon size, preventing GDI resource exhaustion when it is resized
    ([dotnet/winforms #14123](https://github.com/dotnet/winforms/pull/14123)).

- **System.Windows.Forms.ToolStrip**
  - `ToolStripDropDown` now preserves modal menu tracking during focus changes. This lets SmartTag and dropdown UI close normally when users switch tab pages or otherwise move focus
    ([dotnet/winforms #14606](https://github.com/dotnet/winforms/pull/14606)).
  - `ToolStrip` controls now update their layout correctly after a DPI change
    ([dotnet/winforms #14454](https://github.com/dotnet/winforms/pull/14454)).

- **System.Windows.Forms.ProgressBar**
  - `ProgressBar` now applies a default color in Dark Mode to improve visual contrast
    ([dotnet/winforms #14339](https://github.com/dotnet/winforms/pull/14339)).

- **System.Windows.Forms.Clipboard**
  - `GetText(TextDataFormat.Rtf)` now retrieves RTF data that does not include a null-terminating character and restores the previous behavior
    ([dotnet/winforms #14461](https://github.com/dotnet/winforms/pull/14461)).
  - `GetDataObject().GetImage()` now returns bitmap images correctly
    ([dotnet/winforms #14427](https://github.com/dotnet/winforms/pull/14427)).

- **System.Windows.Forms.Control**
  - `AnchorLayoutV2` now initializes deferred anchor information correctly when anchored controls are replaced while layout is suspended
    ([dotnet/winforms #14505](https://github.com/dotnet/winforms/pull/14505)).

- **System.Windows.Forms.CheckBox and System.Windows.Forms.RadioButton**
  - `CheckBox` and `RadioButton` controls now return to their normal appearance when the `Appearance` property is changed in Dark Mode
    ([dotnet/winforms #14194](https://github.com/dotnet/winforms/pull/14194)).

- **System.Windows.Forms.StatusStrip**
  - `StatusStrip` now calculates its default padding and grip width consistently, preventing spring-enabled `ToolStripStatusLabel` controls from disappearing
    ([dotnet/winforms #14068](https://github.com/dotnet/winforms/pull/14068)).
