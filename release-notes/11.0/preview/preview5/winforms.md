# Windows Forms in .NET 11 Preview 5 - Release Notes

.NET 11 Preview 5 does not introduce new Windows Forms feature additions. The
notable user-facing changes in this preview are regression fixes for clipboard,
ToolStrip, layout, designer, and dark mode scenarios.

## Bug fixes

- **System.Windows.Forms.Clipboard**
  - `Clipboard.GetText(TextDataFormat.Rtf)` now reads RTF clipboard data that
    doesn't include a null terminator. This fixes valid RTF content copied by
    applications such as PowerPoint returning an empty string
    ([dotnet/winforms #14461](https://github.com/dotnet/winforms/pull/14461)).
- **System.Windows.Forms.ToolStrip**
  - `ToolStrip` controls with `TabStop=true` no longer activate menu handling
    after tab navigation in a way that prevents controls such as `TreeView` from
    receiving arrow keys
    ([dotnet/winforms #14491](https://github.com/dotnet/winforms/pull/14491)).
  - `ToolStripDropDownMenu` scrolling now handles menu boundaries without
    out-of-range scrolling or unintentionally dismissing the dropdown
    ([dotnet/winforms #14490](https://github.com/dotnet/winforms/pull/14490)).
  - `ToolStrip` DPI changes now preserve the previous device DPI during the DPI
    change path, so scaling logic can run when moving controls between displays
    with different DPI settings
    ([dotnet/winforms #14454](https://github.com/dotnet/winforms/pull/14454)).
- **System.Windows.Forms.Layout**
  - `AnchorLayoutV2` now initializes missing anchor metadata when anchored
    controls are replaced during a suspended layout pass
    ([dotnet/winforms #14505](https://github.com/dotnet/winforms/pull/14505)).
- **System.Windows.Forms.Design**
  - Hosted WinForms designers can paste controls through `CommandSet.OnMenuPaste`
    again
    ([dotnet/winforms #14403](https://github.com/dotnet/winforms/pull/14403)).
  - Collection editor captions for custom controls now use the underlying control
    type instead of the generated `ControlProxy<T>` wrapper name
    ([dotnet/winforms #14375](https://github.com/dotnet/winforms/pull/14375)).
- **System.Windows.Forms.PropertyGrid**
  - `PropertyGrid.SelectedTab` now updates correctly when `SelectedObject` is
    assigned
    ([dotnet/winforms #14438](https://github.com/dotnet/winforms/pull/14438)).
- **System.Windows.Forms.ProgressBar**
  - `ProgressBar` now has default foreground and background colors for dark mode
    rendering
    ([dotnet/winforms #14339](https://github.com/dotnet/winforms/pull/14339)).
