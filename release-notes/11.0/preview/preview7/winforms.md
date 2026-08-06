# Windows Forms in .NET 11 Preview 7 - Release Notes

<!-- Verified against Microsoft.WindowsDesktop.App.Ref@11.0.0-preview.7.26381.103 (dnx dotnet-inspect) and a compile of the samples against SDK 11.0.100-preview.7.26381.103. -->

.NET 11 Preview 7 includes new Windows Forms features & enhancements:

- [Opt in to .NET 11 visual styles](#opt-in-to-net-11-visual-styles)
- [React to system visual settings](#react-to-system-visual-settings)
- [Deferred form reveal](#deferred-form-reveal)
- [Suspend painting during bulk mutations](#suspend-painting-during-bulk-mutations)

## Opt in to .NET 11 visual styles

Windows Forms in Preview 7 introduces an application- and control-level opt-in for a refreshed rendering pipeline. `Application.SetDefaultVisualStylesMode` and the new `Control.VisualStylesMode` property select between the classic renderer (`VisualStylesMode.Classic`), visual styles turned off entirely — including the legacy XP visual styles (`VisualStylesMode.Disabled`) — and the modern renderer (`VisualStylesMode.Net11`). `VisualStylesMode.Latest` always resolves to the newest mode the runtime supports, and child controls default to `VisualStylesMode.Inherit` so the setting cascades.

In this preview, `Net11` brings modernized rendering adapters for:

* `Button` — the `FlatStyle` property defines the render style used for the context. Windows accent colors are taken into account for some `FlatStyle` values.
* `CheckBox` — the `FlatStyle` property defines the render style for the context.
* `RadioButton` — the `FlatStyle` property defines the render style for the context.
* `GroupBox` — the `FlatStyle` property defines the render style for the context.
* `TextBox` — the `BorderStyle` property controls the rendering here: `FixedSingle` yields the conventional border, `Fixed3D` yields a rounded rectangle. (`Fixed3D` is the value that historically requested the *decorated* border, so under `Net11` it maps to the modern decorated look rather than to the classic sunken 3D edge.) Note that the `Padding` property of `TextBox` is accessible in the Property Grid from .NET 11 on. The `Padding` setting, however, is only applied when the effective `VisualStylesMode` is `Net11` or newer.
* `RichTextBox` — the `BorderStyle` property controls the rendering here as well: `FixedSingle` yields the conventional border, `Fixed3D` yields a rounded rectangle. As with `TextBox`, the `Padding` property of `RichTextBox` is accessible in the Property Grid from .NET 11 on, and is only applied when the effective `VisualStylesMode` is `Net11` or newer.

Note that `Control.VisualStylesMode` is an ambient property. An ambient property is one whose value a control does not necessarily hold itself: as long as it has not been assigned an explicit value, the control asks its parent for the value, and the parent asks *its* parent, until some ancestor supplies a concrete setting. `BackColor`, `ForeColor`, `Font`, and `Cursor` are the classic examples — set the `Font` on a `Form` and every child that has not been given its own `Font` renders with it. The "unset" marker for `VisualStylesMode` is `VisualStylesMode.Inherit`, which is why that is the default for child controls: it means "I have no opinion, ask upwards."

In the case of `VisualStylesMode`, however, the root source of the property setting is *not* the top-level container. It is the static `Application.DefaultVisualStylesMode` property, which you set globally for the whole application lifetime with `Application.SetDefaultVisualStylesMode`. So the resolution walks up the parent chain as usual, but when it runs out of parents — rather than falling back to a hard-coded control default — it falls through to the application-wide setting. This matters in practice for controls that are not (yet) parented, and for forms shown from a library that has no access to your form hierarchy: they still pick up the application's mode.

Because switching modes can require different metrics or handle recreation, `Control.GetVisualStylesModeChangeImpact` reports what the runtime needs to do, and `EffectiveVisualStylesMode` returns the resolved value after inheritance.

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
categories changed, so apps can update only the affected UI instead of rebuilding
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

## Avoid white dark-mode flashes — deferred form revealing

`FormRevealMode` gives applications control over when a form becomes visible during startup. `FormRevealMode.Deferred` keeps a form concealed until its initial layout and theming settle, avoiding the brief flash of an unstyled window that can occur when dark mode or the new visual styles are applied after the form is first shown. `FormRevealMode.Classic` preserves the existing show-immediately behavior, and `FormRevealMode.Inherit` follows the value set with `Application.SetDefaultFormRevealMode`.

`Application.IsFormRevealDeferred` reports the resolved state, and `Form.FormRevealModeChanged` fires when the value changes
([dotnet/winforms #14809](https://github.com/dotnet/winforms/pull/14809)).

```csharp
using System.Windows.Forms;

Application.SetDefaultVisualStylesMode(VisualStylesMode.Net11);
Application.SetDefaultFormRevealMode(FormRevealMode.Deferred);

Form form = new() { Text = "No unstyled flash on startup" };
Application.Run(form);
```

## Suspend painting during bulk control mutations (location, size changes)

The new `ISupportSuspendPainting` interface and the `ControlMutationExtensions.SuspendPainting` extension method combine `BeginUpdate`/`EndUpdate` and `SuspendLayout`/`ResumeLayout` into a single `IDisposable` scope. `LayoutSuspendTraversal` controls whether the suspension applies to the target only, or to the target and all of its descendants.

A simple example of how to use this feature:

```csharp
using System.Windows.Forms;

ListBox list = new();

using (list.SuspendPainting(LayoutSuspendTraversal.Target))
{
    for (int i = 0; i < 10_000; i++)
    {
        list.Items.Add($"Item {i}");
    }
}
```

`SuspendPainting` is an extension method on `Control`, so it is available on every control. It returns a tracking object which is exposed to the outside merely as `IDisposable`. That makes the tracker suitable for automatic disposal once it leaves the scope of the enclosing `using` block. When that happens, `Dispose` on the returned tracker resumes both painting and layout of the control (or controls).

If the target control implements `ISupportSuspendPainting` — as `ComboBox`, `ListBox`, `ListView`, `RichTextBox`, and `TreeView` now do — the extension method dispatches to `BeginSuspendPainting`/`EndSuspendPainting`, which in turn call the protected `BeginSuspendPaintingCore` and `EndSuspendPaintingCore` overrides. Those controls already had an established suspension pattern (`BeginUpdate`/`EndUpdate`), and they now route it through the new interface so bulk edits avoid flicker without callers having to juggle multiple paired calls ([dotnet/winforms #14809](https://github.com/dotnet/winforms/pull/14809)). For all other controls the behavior is new. If you are deriving from a control and want more granular control over what happens when painting suspension begins or ends, implement `ISupportSuspendPainting` and override `BeginSuspendPaintingCore` and `EndSuspendPaintingCore`.

In the past, if you had nested containers, you needed to call `SuspendLayout` for each of the inner containers respectively, as you often see it in `InitializeComponent`:

```csharp
    /// <summary>
    ///  Required method for Designer support - do not modify
    ///  the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {
        components = new System.ComponentModel.Container();
        System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(CustomerEntryView));
     .
     .
     .
        _boldToolStripButton = new ToolStripButton();
        _italicToolStripButton = new ToolStripButton();
        _underlineToolStripButton = new ToolStripButton();
        _iconFactoryComponent = new IconFactoryComponent(components);
        _contentLayoutPanel.SuspendLayout();
        _identityGroupBox.SuspendLayout();
        _identityLayoutPanel.SuspendLayout();
        _contactGroupBox.SuspendLayout();
        _contactLayoutPanel.SuspendLayout();
        _contactPermissionsFlowPanel.SuspendLayout();
        _addressGroupBox.SuspendLayout();
        _addressLayoutPanel.SuspendLayout();
        _cityZipStateLayoutPanel.SuspendLayout();
        _preferencesGroupBox.SuspendLayout();
        _preferencesLayoutPanel.SuspendLayout();
        ((System.ComponentModel.ISupportInitialize)_creditLimitNumericUpDown).BeginInit();
        ((System.ComponentModel.ISupportInitialize)_discountNumericUpDown).BeginInit();
        _accountOptionsFlowPanel.SuspendLayout();
        _notesGroupBox.SuspendLayout();
        _notesToolStrip.SuspendLayout();
        SuspendLayout();
        // 
        // _contentLayoutPanel
        //
        .
        .
        .
   }
```

There are situations where you want nested containers to do exactly that _and_ additionally suppress any paint messages until the final size calculation of every affected control has been completed. This happens, for example, when you have a lot of controls placed in `TableLayoutPanel` containers, have their rows and/or columns set to `AutoSize`, and use `AutoSize` on the controls themselves as well.

Consider, as an example, the following hypothetical scenario: a `Panel` inside a Form hosts changing views for the end user, and those views are represented by user controls. Consider further that each user control's constituent controls are nested `TableLayoutPanel` containers, which in turn hold the actual controls the user is working with. In this sample, the user can change — say — the font size or certain styling aspects of _each_ of the controls, which triggers a cascading re-layout of every cell.

The consequence of _not_ suspending the layout of every one of the nested controls is a layout storm. Every single mutation invalidates the preferred size of the control it touches, which invalidates the preferred size of the cell, which invalidates the row and column, which invalidates the containing `TableLayoutPanel` — and because that panel is itself `AutoSize`d inside another `AutoSize`d panel, the invalidation keeps bubbling up to the form and then measures its way back down again. With _n_ mutated controls in a tree of depth _d_, you don't get one layout pass; you get roughly _n_ full measure/arrange cycles over the entire subtree, each one an O(rows × columns) preferred-size computation at every level. Worse, each of those intermediate results is actually committed to the screen: controls visibly jump to a wrong position, get resized, jump again, and the whole view flickers and "settles" over several hundred milliseconds instead of simply changing. On a dense form this is the difference between an instant switch and a visible, jittering reflow.

This is where `SuspendPainting` gives you a real and convenient advantage — both for performance and for flicker-free reconfiguration of a view:

```csharp
    /// <summary>
    ///  Method applies a new VisualStylesMode <b>inside</b> a
    ///  <c>SuspendPainting</c> scope. The whole target subtree is frozen
    ///  while every control is retargeted, so the user sees a single clean repaint.
    /// </summary>
    private void SetVisualStylesModeWithSuspendPainting(VisualStylesMode visualStylesMode)
    {
        _selectedVisualStylesMode = visualStylesMode;

        using var scope = this.SuspendPainting(LayoutSuspendTraversal.TargetAndDescendants);

        if (_activeView is Control activeView)
        {
            ApplyVisualStylesMode(activeView, visualStylesMode);
        }

        if (_activeView is IFlatStyleScenarioView flatStyleScenario)
        {
            flatStyleScenario.ApplyFlatStyle(_selectedFlatStyle);
        }

        UpdateViewAppearanceMenu();
        _selectionAdorner.SynchronizeBoundsAndRender();
    }
```

A few things are worth pointing out here:

* The scope is opened on `this` — the form — with `LayoutSuspendTraversal.TargetAndDescendants`. That single call replaces the recursive walk you would otherwise have to write yourself to reach every nested `TableLayoutPanel`, `GroupBox`, and `FlowLayoutPanel` in the view. Using `LayoutSuspendTraversal.Target` here would be wrong: the mutations happen deep inside the tree, and the inner containers would still lay out and paint on every change.
* `using var scope = ...` (rather than a `using` block) deliberately extends the suspension to the end of the method. `ApplyVisualStylesMode` walks the control tree and retargets every control, `ApplyFlatStyle` potentially changes the border metrics of each of them, and `SynchronizeBoundsAndRender` repositions the adorner. All three would independently trigger layout and paint. Because they all live inside the same scope, they are coalesced into one measure/arrange pass and one repaint.
* Ordering matters: `_selectedVisualStylesMode` is assigned _before_ the scope is opened, because `UpdateViewAppearanceMenu` reads it back to update the checked states. The menu update is intentionally inside the scope as well — the menu strip is part of the same subtree, and letting it repaint separately would produce exactly the two-stage flash the scope is meant to avoid.
* When `scope` is disposed at the end of the method, layout resumes, the accumulated invalidation is resolved in a single pass, and the freshly computed result is painted once. The user perceives the style change as instantaneous rather than as a cascade.

An optional filter lets callers opt individual container children out of the layout freeze.

## Toggle-switch appearance for CheckBox, RadioButton

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

**IMPORTANT:**

Rendering behavior for Visual Styles and the associated new APIs is not yet final and will continue to change until .NET 11 reaches GA. Based on exploratory testing and customer feedback, controls using non-classic Visual Style settings may occupy more or less space in upcoming .NET 11 releases (RC, GA) than they do in Preview 7. The behavior of the new APIs may likewise change in detail or in specific scenarios.

For this reason — among others — we recommend avoiding pixel-perfect design when adopting these features. Prefer layout-based approaches using `TableLayoutPanel` and `FlowLayoutPanel`, which adapt automatically to changes in control metrics.

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
