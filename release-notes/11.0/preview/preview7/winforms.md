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
  - `SendKeys` again parses sequences of immediate modifier characters such as
    `^a^c`, `+a+c`, and `%f%t` correctly after a Preview 6 regression
    ([dotnet/winforms #14691](https://github.com/dotnet/winforms/pull/14691)).
  - `KeyboardToolTipStateMachine` no longer throws `KeyNotFoundException` when
    focus changes during a tooltip popup event
    ([dotnet/winforms #14731](https://github.com/dotnet/winforms/pull/14731)).

- **System.Windows.Forms.ListBox**
  - `IsSynchronized` now returns consistent values across `ListBox.ObjectCollection`,
    `SelectedIndexCollection`, and `SelectedObjectCollection`
    ([dotnet/winforms #14679](https://github.com/dotnet/winforms/pull/14679)).

- **System.Windows.Forms.NumericUpDown**
  - The up and down buttons render correctly again when visual styles are
    disabled
    ([dotnet/winforms #14643](https://github.com/dotnet/winforms/pull/14643)).

- **System.Windows.Forms.SplitContainer**
  - `SplitContainer.RepaintSplitterRect` now tolerates the transient GDI+
    `ExternalException` that can occur during display-session transitions
    instead of crashing the app
    ([dotnet/winforms #14565](https://github.com/dotnet/winforms/pull/14565)).

- **System.Windows.Forms.ToolStrip**
  - The overflow scroll-down button no longer throws when scrolling reaches the
    end of an overflow menu
    ([dotnet/winforms #14537](https://github.com/dotnet/winforms/pull/14537)).
  - Indeterminate and checked `ToolStripMenuItem` icons are now clearly visible
    in dark mode on `ContextMenuStrip`, `MenuStrip`, `StatusStrip`, and
    `ToolStrip` drop-down buttons
    ([dotnet/winforms #14317](https://github.com/dotnet/winforms/pull/14317)).

- **System.Windows.Forms.PropertyGrid**
  - The Property Page toolbar button icon no longer changes size after
    `LargeButtons` is toggled on a high-DPI display
    ([dotnet/winforms #14672](https://github.com/dotnet/winforms/pull/14672)).
  - `PropertyGrid.ResetHelpForeColor` now resets the help fore color instead of
    the help back color
    ([dotnet/winforms #14572](https://github.com/dotnet/winforms/pull/14572)).

- **System.Windows.Forms.PrintPreviewControl**
  - `PrintPreviewControl` renders correctly when `ForeColor` is set to white
    ([dotnet/winforms #14424](https://github.com/dotnet/winforms/pull/14424)).

- **System.Windows.Forms dark mode**
  - `LinkLabel` now uses a color with sufficient contrast in dark mode
    ([dotnet/winforms #14283](https://github.com/dotnet/winforms/pull/14283)).
  - A `TabControl` nested inside a `SplitContainer` inside another `TabControl`
    now honors dark mode
    ([dotnet/winforms #14504](https://github.com/dotnet/winforms/pull/14504)).
  - `HelpProvider` text is readable in dark mode
    ([dotnet/winforms #14338](https://github.com/dotnet/winforms/pull/14338)).
  - `ToolTip` follows dark mode after `SystemColorMode.Dark` is enabled
    ([dotnet/winforms #14381](https://github.com/dotnet/winforms/pull/14381)).

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - dotnet/winforms #14767 "Centralize feature prompts by target release" — internal Copilot feature-prompt reorganization; no shipping code.
  - The many "[main] Source code updates from dotnet/dotnet" PRs are VMR back-flow, not standalone features.
-->
