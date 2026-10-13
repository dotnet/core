# Windows Forms in .NET 11 RC 2 - Release Notes

RC 2 refines the visual styles introduced during .NET 11 previews and adds Designer-guiding analyzers for C# and Visual Basic. These notes also consolidate the new .NET 11 APIs described in the [RC 1 overview](https://learn.microsoft.com/en-us/dotnet/desktop/winforms/whats-new/net110), with corrected usage guidance and the changes tracked in [dotnet/winforms#15173](https://github.com/dotnet/winforms/issues/15173).

Unless otherwise noted, the runtime APIs below are available to both C# and Visual Basic applications targeting .NET 11.

## Visual styles and appearance

`Application.SetDefaultVisualStylesMode(VisualStylesMode)` selects the application-wide renderer version, and `Application.DefaultVisualStylesMode` reports that default. `Control.VisualStylesMode` selects a mode for an individual control.

| Mode | Behavior |
|------|----------|
| `Inherit` | Clears the control's local override. The effective mode comes from its parent or, at the top level, its default renderer setting. It is not valid for `Application.SetDefaultVisualStylesMode`. |
| `Classic` | Uses the established WinForms renderer based on version 6 of the common controls library. This does not mean visual styles are disabled. |
| `Disabled` | Disables visual-style rendering, using the older common-controls behavior. |
| `Net11` | Opts in to the .NET 11 rendering and layout improvements that each control supports. |
| `Latest` | Selects the latest stable renderer version supported by the running framework. |

### Ambient behavior and defaults

`Control.VisualStylesMode` is ambient: child controls default to `Inherit`, so the effective setting cascades down the control tree. Unlike `Font` or `BackColor`, the getter reports the requested value, including `Inherit`, rather than the resolved renderer. An explicit value remains a local override even when it initially matches the parent; only assigning `Inherit` clears it.

For compatibility, enabling visual styles alone keeps the application default at `Classic`; when visual styles are not enabled, the application default remains `Disabled`. **Dark mode and renderer version are independent choices: enabling dark mode does not automatically opt an application into `Net11`.** Set `Net11` or `Classic` explicitly to choose the renderer regardless of the application's effective light/dark color mode, subject to the accessibility and control-specific exceptions below.

Call `Application.SetDefaultVisualStylesMode` during startup, before creating windows. It does not itself enable visual styles; use `ApplicationConfiguration.Initialize()` in a standard C# application, or `Application.EnableVisualStyles()` when configuring startup manually. The application default can only be selected once: repeating the same value is allowed, but changing to a different value throws `InvalidOperationException`.

```csharp
using System.Windows.Forms;

ApplicationConfiguration.Initialize();
Application.SetDefaultVisualStylesMode(VisualStylesMode.Net11);

Form form = new() { Text = "Modern visual styles" };

Button classicButton = new()
{
    Text = "Keep classic rendering",
    VisualStylesMode = VisualStylesMode.Classic,
    AutoSize = true,
    Dock = DockStyle.Top
};

form.Controls.Add(classicButton);
Application.Run(form);
```

For control authors, the **protected** `Control.EffectiveVisualStylesMode` property provides the renderer-authoritative mode after inheritance and accessibility constraints. Do not cache it: Windows High Contrast can change while the application is running. High Contrast forces classic rendering for otherwise styled controls; an explicitly disabled mode remains disabled. The protected virtual `Control.DefaultVisualStylesMode` property lets a derived control customize its default.

### RC 2 compatibility changes

`ToolStrip` (including `MenuStrip`) and `DataGridView` use **Classic rendering by default even when Net11 styling is requested**, while their composite layout modernization remains unfinished. This avoids clipping, row-height, padding, border, and hosted-editor regressions. Applications deliberately testing the modern composite renderers can opt back in with these AppContext switches, set before creating the controls:

```csharp
AppContext.SetSwitch("System.Windows.Forms.ToolStripModernRendering", true);
AppContext.SetSwitch("System.Windows.Forms.DataGridViewModernRendering", true);
```

These switches remove the respective classic-rendering fallback; they do not enable visual styles or select `Net11` on their own. See [dotnet/winforms#15033](https://github.com/dotnet/winforms/pull/15033).

`PropertyGrid` also retains Classic rendering for itself and its hosted editors. Its `VisualStylesMode` override always returns `Classic`; assignments are remembered for potential future use but do not change current rendering. The override and its re-exposed `VisualStylesModeChanged` event are hidden from the Properties window and normal IntelliSense.

RC 2 also preserves explicit child overrides when the parent mode changes. Setting `Classic` in the Properties window no longer immediately reverts to `Inherit` or disappears from generated Designer code ([dotnet/winforms#14860](https://github.com/dotnet/winforms/pull/14860), [dotnet/winforms#15019](https://github.com/dotnet/winforms/pull/15019)).

### Rendering, sizing, and control-author hooks

Modern rendering updates supported buttons, check boxes, radio buttons, group boxes, and editable controls. `FlatStyle` and `BorderStyle` still influence supported appearances. Text-box and rich-text-box padding is exposed in the Properties window and applied in modern modes.

RC 2 gives `TextBox`, `MaskedTextBox`, and `RichTextBox` state-specific borders for Rest, Hover, Focused, Disabled, and ReadOnly states. A stronger bottom edge adds elevation, and the focused bottom edge uses the accent color. Border colors are independent of `ForeColor` ([dotnet/winforms#15147](https://github.com/dotnet/winforms/pull/15147)).

Also note, that enabling `VisualStyleMode` with at least `NET11` makes the `Padding` property work for `TextBoxBase` derived controls. `Padding` is therefore now present (and serializable!) in the PropertyGrid/in the WinFormsd Out-of-Proc Designer. This is, however, NOT a binary breaking change, since the Padding property always existed - it was just without any effects (and is still not outside `VisualStylesMode`).  

What's important for layouting your Form and UserControls: Modern chrome can and will change preferred sizes, padding, and layout. Auto-sized and intrinsically sized controls request layout updates automatically, while fixed-size multiline text boxes can have a slightly smaller client area. Prefer `TableLayoutPanel` and `FlowLayoutPanel` over pixel-perfect sizing; see the [layout guidance](https://github.com/dotnet/winforms/blob/main/docs/net11-visualstyles-layout-guidance.md).

Using `VisualStylesMode` with setings >= `NET11` _will_ break pixel-perfect layouts.
That is expected and the nature of the beast - but: You can use Copilot or other AI-based tooling options to refactor pixel-perfect layout approaches into Fluent layouts based on the TableLayoutPanel control. Please also consider to that add new WinForms Skills, which we are actively working on, and whose preview versions you can already [find and use here](https://github.com/dotnet/skills/tree/main/plugins/dotnet-winforms/skills/winforms-expert).

The following APIs support custom controls and the framework's built-in rendering updates:

| API | Purpose |
|-----|---------|
| `Control.VisualStylesModeChanged` | Reports visual-style transitions. |
| `Control.OnVisualStylesModeChanged(EventArgs)` | Raises the event, applies required rendering/layout updates, and notifies inheriting children. Derived implementations should call the base method. |
| `Control.OnParentVisualStylesModeChanged(EventArgs)` | Handles ambient changes arriving from the parent. |
| `Control.GetVisualStylesModeChangeImpact(oldMode, newMode)` | Protected virtual hook that determines the work required for a renderer transition; it is not a public query on an arbitrary control instance. |
| `Control.VisualStylesModeChangeImpact` | Protected enum: `None` requires no work; `Repaint` repaints the client area; `NonClientUpdate` refreshes the frame without changing layout metrics; `Metrics` refreshes preferred sizes and layout; `Recreate` recreates the native handle and refreshes metrics/layout. These are alternatives, not flags. |

New overrides on `ButtonBase`, `CheckBox`, and `RadioButton` handle `OnSystemColorsChanged` and `OnVisualStylesModeChanged`. `CheckBox` and `RadioButton` also override `OnPaint` and `Dispose(bool)` for modern/toggle rendering and resource cleanup. `UpDownBase.OnVisualStylesModeChanged` updates its rendering on mode transitions.

`ComboBox` overrides `OnVisualStylesModeChanged`, `GetVisualStylesModeChangeImpact`, `OnLayout`, `OnPaddingChanged`, `OnSystemVisualSettingsChanged`, and `RescaleConstantsForDpi` to maintain modern edit/list geometry and sizing across style, padding, accessibility, and DPI changes. Crossing its modern/classic boundary can require handle recreation. `GroupBox` overrides `GetVisualStylesModeChangeImpact`, `OnSystemVisualSettingsChanged`, `RescaleConstantsForDpi`, `OnPaintBackground`, and `Dispose(bool)` to refresh caption/content metrics, paint its background consistently, and release cached rendering resources. These are framework integration points, not additional application setup steps.

### Toggle-switch appearance

`Appearance.ToggleSwitch` renders a two-state `CheckBox` or a `RadioButton` as a switch when its effective renderer is `Net11` or later. Existing `Checked`, `CheckedChanged`, data-binding, and radio-button group behavior remain unchanged; this is an appearance option, not a new control.

```csharp
CheckBox toggle = new()
{
    Text = "Enable notifications",
    Appearance = Appearance.ToggleSwitch,
    VisualStylesMode = VisualStylesMode.Net11,
    AutoSize = true,
    Checked = true
};
```

The toggle renderer takes precedence over `FlatStyle.System`. A `CheckBox` with `ThreeState` enabled retains classic check-box behavior. `Classic`, `Disabled`, and High Contrast do not use the modern toggle appearance. RC 2 also fixes wrapping/clipping of long right-to-left toggle labels so they do not overlap the switch.

### Additional appearance APIs

`DataGridViewCellStyle.SortGlyphColor` gets or sets the color of the column-header sort arrow. `Color.Empty` selects an automatically calculated color based on the background for contrast.

`PrintPreviewControl.ForeColor` now has an explicit override. It controls the "no printable content" message and, when explicitly assigned, the previewed page background. Without an explicit assignment, the page fill remains white; it does not recolor the printed document's content.

## React to Windows visual and accessibility settings

`Application.SystemVisualSettings` returns the current **immutable snapshot** of Windows-owned personalization and accessibility settings. Use this property when you only need the current values; applications should honor, not override, these user preferences.

| `SystemVisualSettings` property | Meaning |
|--------------------------------|---------|
| `AccentColor` | The user's current Windows accent color. |
| `TextScaleFactor` | Windows Accessibility text scaling, independent of display DPI; a factor from `1.0` through `2.25`. |
| `HighContrastEnabled` | Whether Windows High Contrast is enabled. Styled controls then use the classic effective renderer so modern chrome does not bypass the High Contrast palette. |
| `ClientAreaAnimationEnabled` | Whether Windows enables client-area animations. Disabling animations completes active client-area animations immediately; re-enabling affects later transitions. |
| `KeyboardCuesVisible` | The system default for keyboard-cue visibility. A window can temporarily override its effective cue state through `WM_UPDATEUISTATE`. |
| `FocusBorderMetrics` | Windows focus-border width and height in pixels. Renderers can use these as a baseline and scale for DPI and text scaling instead of relying on fixed constants. |

### Handle changes on the form or control

**Inside a form, use the inherited instance event `SystemVisualSettingsChanged`, not the static `Application.SystemVisualSettingsChanged` event.** The instance path follows the control's lifetime and needs no unsubscription when the control is disposed. A custom control can instead override `OnSystemVisualSettingsChanged(SystemVisualSettingsChangedEventArgs)` and call the base implementation.

```csharp
using System.Windows.Forms;

public partial class MainForm : Form
{
    public MainForm()
    {
        InitializeComponent();
        SystemVisualSettingsChanged += HandleSystemVisualSettingsChanged;
    }

    private void HandleSystemVisualSettingsChanged(
        object? sender, SystemVisualSettingsChangedEventArgs e)
    {
        if ((e.Changed & SystemVisualSettingsCategories.AccentColor) == 0)
        {
            return;
        }

        Text = $"Accent changed: {e.OldSettings.AccentColor} -> {e.NewSettings.AccentColor}";
        Invalidate();
    }
}
```

`SystemVisualSettingsChangedEventHandler` is the delegate used by both instance and application events, with `object? sender` and `SystemVisualSettingsChangedEventArgs e`. The event arguments expose:

| Member | Meaning |
|--------|---------|
| `OldSettings` | The snapshot before the transition. |
| `NewSettings` | The snapshot after the transition. |
| `Changed` | A `SystemVisualSettingsCategories` flags value identifying the categories that changed. Test the relevant flag before updating UI or rebuilding resources. |

`SystemVisualSettingsCategories` defines `None` (`0`), `AccentColor` (`1`), `TextScale` (`2`), `HighContrast` (`4`), `ClientAreaAnimations` (`8`), `KeyboardCues` (`16`), and `FocusMetrics` (`32`). Several flags can be combined in one transition.

WinForms normalizes Windows setting, accent-color, theme, and system-color notifications into settings transitions. The static `Application.SystemVisualSettingsChanged` event remains available for application-lifetime consumers such as theming engines and services; its sender is `null`. Shorter-lived consumers of that static event must unsubscribe to avoid lifetime leaks.

Instance notifications cascade through parented controls. An unparented control can miss a transition, so query `Application.SystemVisualSettings` when it is parented or creates its handle. High Contrast changes also trigger visual-style processing for controls whose effective renderer changes.

## Deferred form reveal

`FormRevealMode` controls the initial presentation of a top-level form:

| Mode | Behavior |
|------|----------|
| `Inherit` | Clears the form's local override and uses the application-wide default. |
| `Classic` | Shows the form using the existing immediate-presentation behavior; it is never cloaked for deferred reveal. |
| `Deferred` | Temporarily conceals the initial form presentation while its first appearance is prepared, reducing default-background flashes. |

**With the application default left at `Inherit`, effective dark mode uses deferred reveal; effective Classic/light color mode does not.** Here, "deferred reveal" means delaying initial presentation, not hiding the form permanently. Select `Deferred` explicitly to defer in both color modes, or `Classic` explicitly to show immediately in both.

`Form.FormRevealMode` is ambient, but **does not walk a parent-form hierarchy**: deferred reveal is a top-level-window concept. It resolves directly against `Application.DefaultFormRevealMode`, and its getter returns the resolved `Classic` or `Deferred` value, never `Inherit`.

`Application.SetDefaultFormRevealMode(mode)` sets the process-wide default. Unlike the visual-styles setter, it can be called more than once; passing `Inherit` restores dark-mode-based automatic selection. Configure it before creating the UI. `Application.DefaultFormRevealMode` reports the configured value and can return `Inherit`; the **property** `Application.IsFormRevealDeferred` provides the fully resolved Boolean default for newly created top-level forms. An individual form's explicit override can differ from that default.

```csharp
ApplicationConfiguration.Initialize();
Application.SetDefaultFormRevealMode(FormRevealMode.Deferred);

Form mainForm = new() { Text = "Deferred in light and dark mode" };
Application.Run(mainForm);
```

A splash screen that should appear immediately can set its own `FormRevealMode` to `Classic` without changing the process-wide default. `Form.FormRevealModeChanged` reports changes to the form's effective property value, and the protected virtual `Form.OnFormRevealModeChanged(EventArgs)` raises that event.

Deferred reveal applies to top-level forms, not MDI child windows. It reduces initial background flashes; it is not a guarantee that a deep child-control tree or subsequent asynchronous updates will never produce visible changes.

## Visual Basic Application Framework

The Visual Basic Application Framework now exposes both startup settings through `Microsoft.VisualBasic.ApplicationServices`:

| API | Purpose |
|-----|---------|
| `ApplyApplicationDefaultsEventArgs.FormRevealMode` | Read/write property for selecting the default reveal behavior of newly created top-level forms in the `ApplyApplicationDefaults` handler. |
| `ApplyApplicationDefaultsEventArgs.VisualStylesMode` | Read/write property for selecting the application's default renderer in that handler. |
| `WindowsFormsApplicationBase.FormRevealMode` | Protected read/write property for derived application classes to configure the reveal default. |
| `WindowsFormsApplicationBase.VisualStylesMode` | Protected read/write property for derived application classes to configure the renderer version. |

In a framework-enabled VB project, set the event-argument properties in `My Project\ApplicationEvents.vb` rather than configuring the same application-wide settings separately:

```vb
Imports Microsoft.VisualBasic.ApplicationServices
Imports System.Windows.Forms

Namespace My
    Partial Friend Class MyApplication
        Private Sub ApplyDefaults(
            sender As Object, e As ApplyApplicationDefaultsEventArgs
        ) Handles Me.ApplyApplicationDefaults
            e.VisualStylesMode = System.Windows.Forms.VisualStylesMode.Net11
            e.FormRevealMode = System.Windows.Forms.FormRevealMode.Inherit
        End Sub
    End Class
End Namespace
```

The framework applies these values during startup, before showing the splash/main form, and event-handler choices take precedence over the values supplied by the derived application class. Visual styles must still be enabled through the framework's existing setting.

**VB framework compatibility default:** both backing settings initially use `Classic`. In particular, the framework explicitly applies `FormRevealMode.Classic`, rather than leaving the WinForms application default unresolved. Set `e.FormRevealMode = FormRevealMode.Inherit` to get the automatic dark-mode reveal behavior described above, or choose `Deferred` to defer in both color modes. `VisualStylesMode.Inherit` is not valid as an application-wide renderer default.

## Suspend painting and layout during bulk updates

Prefer the `ControlMutationExtensions.SuspendPainting` extension methods for normal application code. Each returns an `IDisposable` scope that pairs painting suspension with automatic resumption and, optionally, suspends layout across a control tree.

| Overload | Behavior |
|----------|----------|
| `target.SuspendPainting()` | Suspends painting on the target only; does not suspend layout. |
| `target.SuspendPainting(LayoutSuspendTraversal)` | Suspends target painting and selects which controls suspend layout. |
| `target.SuspendPainting(Func<Control, bool>)` | Suspends target painting and traverses the target and all descendants, suspending layout on each control for which the predicate returns `true`. Children are visited even if their parent does not match the predicate. |

`LayoutSuspendTraversal.None` leaves layout active; `TargetOnly` suspends layout only on the target; `TargetAndDescendants` suspends layout on the target and every control in its subtree. Traversal selects **layout** suspension, not a separate painting-suspension scope for every child. The traversal and predicate overloads require the target to be a `Control`.

Use a `using` block to define the update boundary:

```csharp
using System.Drawing;
using System.Windows.Forms;

static void UpdateContainer(Control container, Font newFont)
{
    using (container.SuspendPainting(LayoutSuspendTraversal.TargetAndDescendants))
    {
        container.Font = newFont;
        foreach (Control child in container.Controls)
        {
            child.Margin = new Padding(8);
        }
    }
}
```

When the returned object goes out of the `using` scope, `Dispose()` automatically resumes the suspended layout and painting, including when the block exits because of an exception. A `using` declaration works too, with resumption at the end of its containing scope. With `TargetAndDescendants`, this is the recommended way to batch layout updates in nested containers instead of manually pairing `SuspendLayout`/`ResumeLayout` calls on each container.

Acquire the scope **before** setting a property that implicitly causes layout. For example, `Font` is ambient for most child controls: changing a container's font can cascade to descendants, alter preferred sizes, and trigger repeated layout. Suspending the subtree first batches that work, including in nested auto-sized `TableLayoutPanel` and `FlowLayoutPanel` containers.

For selective layout suspension, the predicate overload can target just layout containers:

```csharp
using (container.SuspendPainting(
    control => control is TableLayoutPanel or FlowLayoutPanel))
{
    container.Font = newFont;
}
```

`ISupportSuspendPainting.BeginSuspendPainting()` and `EndSuspendPainting()` are low-level infrastructure reserved for later improvements to how the WinForms Designer generates `InitializeComponent`. They are not the recommended application-facing pattern. `Control` implements the interface explicitly; use the disposable extensions instead of calling the begin/end pair directly.

Custom controls can override the protected `Control.BeginSuspendPaintingCore()` and `EndSuspendPaintingCore()` hooks to integrate their update mechanisms. New overrides on `ComboBox`, `ListBox`, `ListView`, `RichTextBox`, and `TreeView` route suspension through their established control-specific mechanisms rather than creating competing update paths.

## New KioskModeManager component

`KioskModeManager` manages a full-screen or shared-screen experience without requiring custom window-management code. Add it to a form or user control at design time, or create it in code. `ContainerControl` accepts a `Form` or a child container such as `UserControl`; the component resolves the containing form when needed.

| API | Behavior and default |
|-----|----------------------|
| `KioskModeManager()` | Creates the component. Dispose it when its owning UI is finished. |
| `KioskModeManager(IContainer)` | Creates the component and registers it with the supplied component container for ownership/disposal. |
| `ContainerControl` / `ContainerControlChanged` | Selects the container whose containing form is managed and reports changes; default `null`. |
| `FullScreen` / `FullScreenChanged` | Enters/restores full screen and reports transitions; default `false`. The property supports two-way binding. Full screen is borderless and covers the screen bounds, including the taskbar. |
| `ToggleFullScreen()` | Switches between full screen and the saved form state. Border style, window state, bounds, and topmost state are saved and restored. |
| `TopMostInFullScreen` | Makes the form topmost while full screen; default `false`. |
| `ToggleFullScreenKeys` | Keyboard combination for toggling; default `Keys.F11`. Use `Keys.None` to disable it. |
| `EscapeExitsFullScreen` | Exits full screen on unmodified Escape; default `true`. |
| `AlwaysOn` | Requests suppression of ordinary display/system idle sleep; default `false`. Does not override every system policy or configure wake timers, Wake-on-LAN, or voice activation. Windows power-request failures raise `Win32Exception`. |
| `MousePointerAutoHideDelay` | Inactivity delay in milliseconds for hiding the pointer while full screen; default `0` disables hiding. Mouse movement restores it immediately. Negative values are rejected. |
| `Site` | Design-time override that resolves the designer's root container if `ContainerControl` has not been set explicitly; does not overwrite an explicit assignment. |
| `OnContainerControlChanged(EventArgs)` / `OnFullScreenChanged(EventArgs)` | Protected virtual hooks that raise the corresponding events. |
| `Dispose(bool)` | Releases the component's runtime resources and subscriptions. |

Keyboard shortcuts are evaluated only while the managed form or a child has input focus. Keyboard and mouse activity is observed through the application's message queue, not global hooks or system-wide hot keys.

```csharp
using System.Windows.Forms;

ApplicationConfiguration.Initialize();
Form form = new() { Text = "Kiosk" };

using KioskModeManager kiosk = new()
{
    ContainerControl = form,
    TopMostInFullScreen = true,
    ToggleFullScreenKeys = Keys.F11,
    EscapeExitsFullScreen = true,
    AlwaysOn = true,
    MousePointerAutoHideDelay = 3_000,
    FullScreen = true
};

Application.Run(form);
```

**This component is not a security boundary.** It does not guarantee that users cannot interrupt the application, switch applications, or access the operating system. Secure kiosk lockdown must be configured at the Windows/system level by an IT administrator.

Windows 11 offers kiosk setup through **Windows > Settings > Accounts > Other users > Set up a kiosk > Get started**:

The Windows kiosk configuration is separate from `KioskModeManager`. The Settings single-app Assigned Access experience supports eligible UWP applications or Microsoft Edge; it is not a way to select any arbitrary WinForms executable. Administrators should choose the appropriate Windows kiosk/restricted-user configuration for the deployment and Windows edition. See [Configure a single-app kiosk with Assigned Access](https://learn.microsoft.com/en-us/windows/configuration/assigned-access/configure-single-app-kiosk).

## New Designer-guiding analyzers

New C# and Visual Basic analyzers report source structures that cannot round-trip through the WinForms Designer. This is particularly useful when Copilot or another AI/LLM generates or refactors a form or user control: unsupported changes become Roslyn diagnostics immediately, and their messages explain what went wrong and how to correct it. Agents that consume those diagnostics can use this guidance to repair Designer compatibility, including less capable or locally running models.

These rules are introduced for **.NET 11 and later, not .NET Framework (NetFx)**. They are enabled by default with the WinForms analyzers shipped in the Windows Desktop .NET SDK.

Designer rules protect qualifying `.Designer.cs`/`.Designer.vb` partial declarations with `InitializeComponent` and a matching user-code partial. Keep generated initialization explicit and unrolled, and put runtime logic in the user-code file after `InitializeComponent`; merely moving generated initialization into helper methods is not a substitute. Modern syntax remains appropriate in user code. WFO2000 is a general usage warning, not limited to Designer files.

| Rule | Category | Severity | Languages | Trigger and fix |
|------|----------|----------|-----------|-----------------|
| [WFO2000](https://aka.ms/winforms-warnings/wfo2000) | WinForms Usage | Warning | C#, VB | A property getter directly returns a newly constructed reference instance, including arrays/anonymous objects. Cache only when stable identity is intended; for deliberate creation, prefer a factory method if API compatibility permits. Cached/initializer-backed properties and generated code are excluded. |
| [WFO3000](https://aka.ms/winforms-warnings/wfo3000) | WinForms Designer | Error | C#, VB | Unsupported `InitializeComponent` code, such as loops, branching, exception handling, locking, `using`/`Using`, or `await`/`Await`. Keep initialization unrolled; move runtime-only logic to the user partial. C# initialization must be block-bodied. |
| [WFO3001](https://aka.ms/winforms-warnings/wfo3001) | WinForms Designer | Error | C#, VB | Custom properties, nested types, or methods in the Designer partial. Move them to the user partial; standard generated initialization/disposal infrastructure is allowed. |
| [WFO3002](https://aka.ms/winforms-warnings/wfo3002) | WinForms Designer | Warning | C#, VB | Generated fields/component members are misplaced or declared outside the Designer partial. Keep designer-owned declarations after its methods, except the conventional `components` container. Do not move unrelated or inherited fields. |
| [WFO3003](https://aka.ms/winforms-warnings/wfo3003) | WinForms Designer | Error | C#, VB | Event or delegate declarations in the Designer partial. Move declarations to the user-code file. |
| [WFO3004](https://aka.ms/winforms-warnings/wfo3004) | WinForms Designer | Error | C# | Collection expressions in Designer code. Use explicit arrays such as `new Control[] { button1, button2 }` or unrolled supported `Add` calls. |
| [WFO3005](https://aka.ms/winforms-warnings/wfo3005) | WinForms Designer | Warning | C#, VB | `nameof`/`NameOf` in `InitializeComponent`. Serialize the resulting string value instead. |
| [WFO3006](https://aka.ms/winforms-warnings/wfo3006) | WinForms Designer | Error | C#, VB | Conditional expressions (`?:` or three-argument VB `If`) in `InitializeComponent`. Move the condition to user code and serialize a deterministic value. |
| [WFO3007](https://aka.ms/winforms-warnings/wfo3007) | WinForms Designer | Error | C#, VB | Null-coalescing (`??`, `??=`, or two-argument VB `If`) in `InitializeComponent`. Resolve the fallback outside generated code. |
| [WFO3008](https://aka.ms/winforms-warnings/wfo3008) | WinForms Designer | Error | C#, VB | Null-conditional access in `InitializeComponent`. Move null-dependent access to user code. |
| [WFO3009](https://aka.ms/winforms-warnings/wfo3009) | WinForms Designer | Warning | C#, VB | Interpolated strings in `InitializeComponent`. Serialize the resulting string value instead. |
| [WFO3010](https://aka.ms/winforms-warnings/wfo3010) | WinForms Designer | Error | C#, VB | Lambdas/anonymous functions in `InitializeComponent`. Use named handlers in the user partial instead. |
| [WFO3011](https://aka.ms/winforms-warnings/wfo3011) | WinForms Designer | Error | VB | Designer-owned component members lack `WithEvents`. Add it to their declarations and use named handlers with `Handles` in the user partial. The components container and local variables are excluded. |
| [WFO3012](https://aka.ms/winforms-warnings/wfo3012) | WinForms Designer | Error | VB | `AddHandler` in `InitializeComponent` wires a Designer member/root event instead of using the VB Designer event model. Put the corresponding `Handles` clause on the named handler in the user partial and remove the redundant hookup. Supported local-component `AddHandler ... AddressOf` wiring remains valid. |

Errors and warnings have different default severities to protect Designer compatibility. No automatic code fix is supplied for these new rules; the diagnostic text guides the developer or agent.

For rare, intentional exceptions, lower a specific rule's severity in a narrowly scoped `.editorconfig` section:

```ini
[LegacyForm.Designer.cs]
dotnet_diagnostic.WFO3000.severity = warning
dotnet_diagnostic.WFO3005.severity = suggestion
```

Use the corresponding `.Designer.vb` filename for VB. `none` disables an individual rule, but lowering or suppressing a diagnostic does **not** make unsupported code Designer-compatible.

## Bug fixes

The RC 2 tracking issue, [dotnet/winforms#15173](https://github.com/dotnet/winforms/issues/15173), includes the analyzer feature ([dotnet/winforms#15148](https://github.com/dotnet/winforms/pull/15148)), composite-renderer compatibility change, and state-specific editable-control borders described above. The remaining fixes are:

| Area | RC 2 fix |
|------|----------|
| Designer serialization | Setting `VisualStylesMode.Classic` remains an explicit value in the Properties window and generated code instead of reverting to `Inherit` ([dotnet/winforms#15019](https://github.com/dotnet/winforms/pull/15019)). |
| Explicit renderer overrides and button focus | Child overrides survive later parent changes even when the original values matched. Modern button accent/background decisions stay on the modern path, keeping focus rendering consistent ([dotnet/winforms#14860](https://github.com/dotnet/winforms/pull/14860)). |
| Inherited/custom colors | Modern `Button`, `CheckBox`, and `RadioButton` renderers preserve inherited non-default foreground colors and distinguish explicitly customized backgrounds from defaults ([dotnet/winforms#14929](https://github.com/dotnet/winforms/pull/14929)). |
| Explicit check-box/radio-button backgrounds | Net11 rendering honors explicitly assigned `BackColor` in layout and painting ([dotnet/winforms#14865](https://github.com/dotnet/winforms/pull/14865)). |
| Background compositing | Opaque effective check-box/radio-button backgrounds fill with `BackColor`, so a parent `GroupBox` image does not show through. Intentional transparent/translucent backgrounds still composite the parent ([dotnet/winforms#15159](https://github.com/dotnet/winforms/pull/15159)). |
| GroupBox background images | A continuous client-coordinate image spans header and body for Standard, Flat, and Popup styles, with correct overlays and no leakage into child backgrounds or rounded edges ([dotnet/winforms#14910](https://github.com/dotnet/winforms/pull/14910)). |
| RadioButton RTL/high DPI | DPI-scaled glyph padding prevents hover clipping at the right-to-left edge ([dotnet/winforms#14904](https://github.com/dotnet/winforms/pull/14904)). |
| Input sizing, layout, and DPI | Shared Net11 metrics for `TextBoxBase`, `MaskedTextBox`, `ComboBox`, `NumericUpDown`, and `DomainUpDown` reduce oversized single-line controls, prevent descender clipping, align editable combo-box text, normalize dropdown/button proportions, and correct DPI-dependent geometry ([dotnet/winforms#14887](https://github.com/dotnet/winforms/pull/14887)). |
| Editable-control border colors | `TextBoxBase`, `ComboBox`, and `UpDownBase` use stable border-color calculations independent of `ForeColor`, including in dark mode ([dotnet/winforms#14853](https://github.com/dotnet/winforms/pull/14853)). |
| Simple ComboBox | Modern `ComboBoxStyle.Simple` edit/list layout, native borders, rounded frame, separator, clipping, and hit testing are corrected ([dotnet/winforms#14827](https://github.com/dotnet/winforms/pull/14827)). |
| Toggle-switch RTL labels | Switch/text regions are separated so long labels in constrained, non-auto-sized controls wrap or clip without overlapping the switch ([dotnet/winforms#14815](https://github.com/dotnet/winforms/pull/14815)). |
| Shared WPF Clipboard compatibility | The opt-in AppContext switch `Windows.Clipboard.ThrowExceptionsForGetAPIs` restores pre-.NET 10 exception propagation from **WPF** `System.Windows.Clipboard.Get*` APIs rather than returning empty data. This applies to shared OLE, HGLOBAL, IStream, and bitmap retrieval paths; it is not a new WinForms `Clipboard` API ([dotnet/winforms#15035](https://github.com/dotnet/winforms/pull/15035)). |

For WPF applications relying on Clipboard exceptions, set the compatibility switch before reading:

```csharp
AppContext.SetSwitch("Windows.Clipboard.ThrowExceptionsForGetAPIs", true);
```
