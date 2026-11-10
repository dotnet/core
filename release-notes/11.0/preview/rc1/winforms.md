# Windows Forms in .NET 11 RC 1 - Release Notes

<!-- Verified against changes.json, features.json, and the final System.Windows.Forms public API changes in dotnet/winforms #14892. -->

.NET 11 RC 1 includes new Windows Forms features & enhancements:

- [Manage kiosk-style experiences](#manage-kiosk-style-experiences)
- [Modern visual styles stabilize for RC 1](#modern-visual-styles-stabilize-for-rc-1)

## Manage kiosk-style experiences

The new `KioskModeManager` component manages common full-screen application
behavior. It can preserve and restore a form's window state, keep the form
topmost while full screen, prevent display and system sleep, hide the pointer
after a period of inactivity, and handle keyboard entry and exit. The component
accepts a `ContainerControl`, so it can be placed on a `Form` or a `UserControl`
in the designer and resolve the containing form at run time
([dotnet/winforms #14892](https://github.com/dotnet/winforms/pull/14892)).

```csharp
using System.Windows.Forms;

ApplicationConfiguration.Initialize();

Form form = new()
{
    Text = "Kiosk",
};

using KioskModeManager kioskMode = new()
{
    ContainerControl = form,
    ToggleFullScreenKeys = Keys.F11,
    EscapeExitsFullScreen = true,
    TopMostInFullScreen = true,
    AlwaysOn = true,
    MousePointerAutoHideDelay = 3_000,
    FullScreen = true,
};

Application.Run(form);
```

`FullScreen` can also be data-bound, and `FullScreenChanged` reports transitions
between full-screen and restored states. `ToggleFullScreen()` switches between
the two states directly.

## Modern visual styles stabilize for RC 1

RC 1 consolidates the .NET 11 visual styles work introduced in Preview 7 and
aligns control rendering and layout with the finalized RC contracts
([dotnet/winforms #14809](https://github.com/dotnet/winforms/pull/14809)).
The stabilization includes:

- Correct disabled colors, drop-down button colors, and text layout for modern
  `ComboBox` controls
  ([dotnet/winforms #14843](https://github.com/dotnet/winforms/pull/14843),
  [dotnet/winforms #14861](https://github.com/dotnet/winforms/pull/14861),
  [dotnet/winforms #14874](https://github.com/dotnet/winforms/pull/14874)).
- Correct design-time rendering for `ComboBox` controls using
  `FlatStyle.System`
  ([dotnet/winforms #14852](https://github.com/dotnet/winforms/pull/14852)).
- Correct transparent backgrounds for toggle-switch `CheckBox` and
  `RadioButton` controls
  ([dotnet/winforms #14813](https://github.com/dotnet/winforms/pull/14813)).

## Breaking changes

- The preview-only `TreeView.NodeLeading` property,
  `TreeView.NodeLeadingChanged` event, and protected
  `TreeView.OnNodeLeadingChanged(EventArgs)` method have been removed. Apps
  compiled against .NET 11 previews must remove uses of these APIs before
  moving to RC 1. Use `TreeView.ItemHeight` when an explicit node height is
  required
  ([dotnet/winforms #14892](https://github.com/dotnet/winforms/pull/14892)).
- Animated `PictureBox` frame callbacks now stop when the control has no
  window handle, before evaluating `InvokeRequired`. This avoids intermittent
  window-handle creation failures when a handle is created or destroyed while
  an animation callback is running, and changes the callback lifecycle in that
  narrow timing window
  ([dotnet/winforms #14826](https://github.com/dotnet/winforms/pull/14826)).

## Bug fixes

- **Dark mode**
  - Preserved a form's dark title bar when right-to-left changes recreate its
    handle
    ([dotnet/winforms #14742](https://github.com/dotnet/winforms/pull/14742)).
  - Rendered `ErrorProvider` tooltips with dark colors
    ([dotnet/winforms #14888](https://github.com/dotnet/winforms/pull/14888)).
  - Enabled dark mouse-hover tooltips for `TreeView` and `ListView`
    ([dotnet/winforms #14889](https://github.com/dotnet/winforms/pull/14889)).
- **Clipboard**
  - Restored automatic format conversion for clipboard reads, including
    correct Unicode text conversion
    ([dotnet/winforms #14893](https://github.com/dotnet/winforms/pull/14893)).
- **Controls**
  - Rendered the vertical scroll bar on right-to-left multiline `TextBox`
    controls
    ([dotnet/winforms #14820](https://github.com/dotnet/winforms/pull/14820)).
  - Avoided an exception when `TaskDialog` receives an unexpected button ID
    from the native dialog
    ([dotnet/winforms #14842](https://github.com/dotnet/winforms/pull/14842)).
  - Displayed a blank preview instead of a black page after assigning an empty
    `PrintDocument` to `PrintPreviewControl`
    ([dotnet/winforms #14857](https://github.com/dotnet/winforms/pull/14857)).
- **Drawing and high DPI**
  - Corrected `ControlPaint.Light` interpolation for system colors
    ([dotnet/winforms #14833](https://github.com/dotnet/winforms/pull/14833)).
  - Corrected `PropertyGrid` icon scaling on a 100% secondary display
    ([dotnet/winforms #14828](https://github.com/dotnet/winforms/pull/14828)).
