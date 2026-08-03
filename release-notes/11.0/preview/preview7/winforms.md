# Windows Forms in .NET 11 Preview 7 - Release Notes

<!-- Verified against Microsoft.WindowsDesktop.App.Ref@11.0.0-preview.7.26381.103 (dnx dotnet-inspect) and a compile of the samples against SDK 11.0.100-preview.7.26381.103. -->

.NET 11 Preview 7 includes new Windows Forms features & enhancements:

- [Opt in to .NET 11 visual styles](#opt-in-to-net-11-visual-styles)
- [React to system visual settings](#react-to-system-visual-settings)
- [Deferred form reveal](#deferred-form-reveal)
- [Suspend painting during bulk mutations](#suspend-painting-during-bulk-mutations)
- [Toggle-switch appearance for CheckBox](#toggle-switch-appearance-for-checkbox)
- [Configurable TreeView node leading](#configurable-treeview-node-leading)

## Opt in to .NET 11 visual styles

Windows Forms in Preview 7 introduces an application- and control-level opt-in
for a refreshed rendering pipeline. `Application.SetDefaultVisualStylesMode` and
the new `Control.VisualStylesMode` property select between the classic renderer
(`VisualStylesMode.Classic`), visual styles turned off
(`VisualStylesMode.Disabled`), and the modern renderer
(`VisualStylesMode.Net11`). `VisualStylesMode.Latest` always resolves to the
newest mode the runtime supports, and child controls default to
`VisualStylesMode.Inherit` so the setting cascades. In this preview, `Net11`
brings modern adapters for `ComboBox`, `GroupBox`, `CheckBox`, `RadioButton`,
and related buttons. Because switching modes can require different metrics or
handle recreation, `Control.GetVisualStylesModeChangeImpact` reports what the
runtime needs to do, and `EffectiveVisualStylesMode` returns the resolved value
after inheritance
([dotnet/winforms #14809](https://github.com/dotnet/winforms/pull/14809),
[dotnet/winforms #14811](https://github.com/dotnet/winforms/pull/14811)).

```csharp
using System.Windows.Forms;

Application.SetDefaultVisualStylesMode(VisualStylesMode.Net11);

Form form = new()
{
    Text = "Preview 7 visual styles",
    VisualStylesMode = VisualStylesMode.Latest,
};

ComboBox combo = new() { Dock = DockStyle.Top };
combo.Items.AddRange(["One", "Two", "Three"]);
form.Controls.Add(combo);

Application.Run(form);
```

## React to system visual settings

`Application.SystemVisualSettings` exposes the accent color, high-contrast
state, keyboard-cue visibility, client-area animation setting, focus-border
metrics, and text scale factor as a single snapshot, and the new
`Application.SystemVisualSettingsChanged` event fires whenever one of those
categories changes. `SystemVisualSettingsChangedEventArgs.Changed` is a
`SystemVisualSettingsCategories` flags value that indicates exactly which
categories moved, so apps can update only the affected UI instead of rebuilding
theme resources on every notification. Controls can also override
`OnSystemVisualSettingsChanged` to react locally
([dotnet/winforms #14809](https://github.com/dotnet/winforms/pull/14809)).

```csharp
using System.Drawing;
using System.Windows.Forms;

Application.SystemVisualSettingsChanged += (sender, e) =>
{
    if ((e.Changed & SystemVisualSettingsCategories.AccentColor) != 0)
    {
        Color accent = e.NewSettings.AccentColor;
        Console.WriteLine($"Accent color changed to {accent}.");
    }

    if ((e.Changed & SystemVisualSettingsCategories.TextScale) != 0)
    {
        Console.WriteLine($"Text scale is now {e.NewSettings.TextScaleFactor:P0}.");
    }
};
```

## Deferred form reveal

`FormRevealMode` gives applications control over when a form becomes visible
during startup. `FormRevealMode.Deferred` keeps a form hidden until its initial
layout and theming settle, avoiding the brief flash of an unstyled window that
can occur when dark mode or the new visual styles apply after the form is first
shown. `FormRevealMode.Classic` preserves the existing show-immediately
behavior, and `FormRevealMode.Inherit` follows the value set with
`Application.SetDefaultFormRevealMode`.
`Application.IsFormRevealDeferred` reports the resolved state, and
`Form.FormRevealModeChanged` fires when the value changes
([dotnet/winforms #14809](https://github.com/dotnet/winforms/pull/14809)).

```csharp
using System.Windows.Forms;

Application.SetDefaultVisualStylesMode(VisualStylesMode.Net11);
Application.SetDefaultFormRevealMode(FormRevealMode.Deferred);

Form form = new() { Text = "No unstyled flash on startup" };
Application.Run(form);
```

## Suspend painting during bulk mutations

The new `ISupportSuspendPainting` interface and `ControlMutationExtensions.SuspendPainting`
extension method combine `BeginUpdate`/`EndUpdate` and `SuspendLayout`/`ResumeLayout`
into a single `IDisposable` scope. `LayoutSuspendTraversal` chooses whether the
suspension applies to the target only or to the target and its descendants, and
an optional filter lets callers opt individual container children out of the
layout freeze. `ComboBox`, `ListBox`, `ListView`, `RichTextBox`, and `TreeView`
implement the interface and override `BeginSuspendPaintingCore` and
`EndSuspendPaintingCore` so bulk edits avoid flicker without callers having to
juggle multiple paired calls
([dotnet/winforms #14809](https://github.com/dotnet/winforms/pull/14809)).

```csharp
using System.Windows.Forms;

ListBox list = new();
using (list.SuspendPainting(LayoutSuspendTraversal.TargetAndDescendants))
{
    for (int i = 0; i < 10_000; i++)
    {
        list.Items.Add($"Item {i}");
    }
}
```

## Toggle-switch appearance for CheckBox

`Appearance.ToggleSwitch` is a new value for `CheckBox.Appearance` that renders
the control as a switch under `VisualStylesMode.Net11`. Existing `Checked`,
`CheckedChanged`, and data-binding behavior is unchanged, so switching a
`CheckBox` to the new appearance does not require code updates
([dotnet/winforms #14809](https://github.com/dotnet/winforms/pull/14809)).

```csharp
using System.Windows.Forms;

CheckBox toggle = new()
{
    Text = "Enable notifications",
    Appearance = Appearance.ToggleSwitch,
    Checked = true,
};
```

## Configurable TreeView node leading

`TreeView.NodeLeading` sets the extra vertical space around each node as a
multiplier of the node height, letting apps loosen or tighten row density
without owner-drawing. Values are clamped to a sensible range and the
`NodeLeadingChanged` event fires when the property is updated
([dotnet/winforms #14809](https://github.com/dotnet/winforms/pull/14809)).

```csharp
using System.Windows.Forms;

TreeView tree = new()
{
    Dock = DockStyle.Fill,
    NodeLeading = 1.5f,
};
```

## Bug fixes

- **System.Windows.Forms.Control**
  - [Fix SendKeys sequential immediate modifier(^a^c, +a+c, %f%t) parsing regression](https://github.com/dotnet/winforms/pull/14691)
  - [Fix KeyboardToolTipStateMachine KeyNotFoundException when focus changes during tooltip popup event](https://github.com/dotnet/winforms/pull/14731)
- **System.Windows.Forms.ListBox**
  - [Correct IsSynchronized values across ListBox collections](https://github.com/dotnet/winforms/pull/14679)
- **System.Windows.Forms.NumericUpDown**
  - [Fix NumericUpDown button rendering regression when visual styles are disabled](https://github.com/dotnet/winforms/pull/14643)
- **System.Windows.Forms.SplitContainer**
  - [Handle transient GDI+ ExternalException in SplitContainer.RepaintSplitterRect during display-session transition](https://github.com/dotnet/winforms/pull/14565)
- **System.Windows.Forms.ToolStrip**
  - [Fix ToolStrip scroll-down button throwing when scrolling](https://github.com/dotnet/winforms/pull/14537)
  - [Fix indeterminate and checked ToolStripMenuItem icons being hard to see in dark mode](https://github.com/dotnet/winforms/pull/14317)
- **System.Windows.Forms.PropertyGrid**
  - [Fix Property Page button icon changing when LargeButtons is toggled on high DPI](https://github.com/dotnet/winforms/pull/14672)
  - [Fix PropertyGrid.ResetHelpForeColor resetting the back color instead of the fore color](https://github.com/dotnet/winforms/pull/14572)
- **System.Windows.Forms.PrintPreviewControl**
  - [Fix PrintPreviewControl ForeColor rendering incorrectly when set to White](https://github.com/dotnet/winforms/pull/14424)
- **System.Windows.Forms dark mode**
  - [Fix LinkLabel contrast in Dark Mode](https://github.com/dotnet/winforms/pull/14283)
  - [Fix TabControl nested in SplitContainer not matching dark mode](https://github.com/dotnet/winforms/pull/14504)
  - [Fix HelpProvider text being barely visible in dark mode](https://github.com/dotnet/winforms/pull/14338)
  - [Fix ToolTip not switching to dark mode when SystemColorMode.Dark is set](https://github.com/dotnet/winforms/pull/14381)
