# .NET MAUI in .NET 11 Preview 5 - Release Notes

.NET 11 Preview 5 brings a substantial reliability wave to .NET MAUI alongside
targeted new APIs and Android platform progress:

- [Reliability and platform-fix wave lands in .NET 11](#reliability-and-platform-fix-wave-lands-in-net-11)
- [Animations get CancellationToken-aware overloads](#animations-get-cancellationtoken-aware-overloads)
- [BoxView adds a Fill property with Brush support](#boxview-adds-a-fill-property-with-brush-support)
- [Windows Maps gains a real implementation backed by Azure Maps](#windows-maps-gains-a-real-implementation-backed-by-azure-maps)
- [Material 3 handlers and helpers are now public](#material-3-handlers-and-helpers-are-now-public)
- [Toolbar back button supports an accessibility label](#toolbar-back-button-supports-an-accessibility-label)
- [Android raises its minimum SDK to API 24](#android-raises-its-minimum-sdk-to-api-24)
- [.NET for Android stabilizes API 37](#net-for-android-stabilizes-api-37)
- [.NET for Apple workloads refresh bindings and improve dev-loop builds](#net-for-apple-workloads-refresh-bindings-and-improve-dev-loop-builds)
- [Apple Intelligence APIs ship in Essentials.AI](#apple-intelligence-apis-ship-in-essentialsai)
- [Bug fixes](#bug-fixes)

.NET MAUI updates in .NET 11:

- [What's new in .NET MAUI in .NET 11](https://learn.microsoft.com/dotnet/maui/whats-new/)

## Reliability and platform-fix wave lands in .NET 11

Preview 5 merges a comprehensive reliability rollup into the
`net11.0` branch, bringing dozens of customer-reported fixes across
`CollectionView`, `CarouselView`, `Shell`, gestures, layout, RTL/FlowDirection,
`SearchHandler`, `TabBar`, `Label`, `GraphicsView`, `SwipeView`, `HybridWebView`,
`Entry`, `Editor`, `Picker`, `BoxView`, `ImageButton`, `RadioButton`,
`AppThemeBinding`, navigation lifecycle, and `Setter.TargetName` +
`ControlTemplate` scenarios
([dotnet/maui #34885](https://github.com/dotnet/maui/pull/34885),
[dotnet/maui #35330](https://github.com/dotnet/maui/pull/35330),
[dotnet/maui #35422](https://github.com/dotnet/maui/pull/35422)). Highlights
include:

- `TapGestureRecognizer` reliability on Android, and tap-on-`SwipeView` no
  longer falls through to underlying gesture recognizers.
- `CollectionView` and `CarouselView` fixes for `EmptyView`,
  `HeaderTemplate`/`FooterTemplate`, visual states, looping behavior,
  drag-and-drop into empty groups, and grid item spacing.
- `Shell` fixes for `TabBarIsVisible` runtime toggling, `IconOverride` in
  `BackButtonBehavior`, `SearchHandler` state retention across top tabs, and
  flyout RTL on iOS and Mac Catalyst.
- Layout and rendering fixes for `Label` truncation and wrapping, `BoxView`
  auto-size reset, `FlexLayout` wrap-reverse alignment, gradient brushes on
  `Shape.Stroke`, line drawing precision, `GraphicsView` aspect-ratio
  preservation in `Downsize`, and Android parent-opacity clipping.
- Input fixes for `Entry`/`Editor` `CursorPosition`, RTL placeholders, and
  Windows `Entry` keyboard type handling.

See the [full compare](https://github.com/dotnet/maui/compare/11.0.0-preview.4.26230.3...release/11.0.1xx-preview5)
for the complete set of changes.

## Animations get CancellationToken-aware overloads

A new family of `FadeToAsync`, `RotateToAsync`, `TranslateToAsync`,
`ScaleToAsync`, `LayoutToAsync`, and their `Rel*` / `*X` / `*Y` variants on
`ViewExtensions` accepts a `CancellationToken`, giving you cooperative
cancellation without resorting to `AbortAnimation` lookups by name
([dotnet/maui #33372](https://github.com/dotnet/maui/pull/33372)). The
original `FadeTo`, `RotateTo`, `TranslateTo`, `ScaleTo`, and `LayoutTo`
methods are now `[Obsolete]` in favor of the new `*Async` forms.

```csharp
var cts = new CancellationTokenSource();
cancelButton.Clicked += (_, _) => cts.Cancel();

await myView.FadeToAsync(0, length: 2000, easing: Easing.Linear,
                         cancellationToken: cts.Token);
```

## BoxView adds a Fill property with Brush support

`BoxView` now exposes a `Fill` property that accepts any
`Brush`, including gradients and patterns, instead of only a solid
`BackgroundColor`
([dotnet/maui #31789](https://github.com/dotnet/maui/pull/31789)). This closes a
long-standing request for `BoxView` to participate in the same `Paint`-based
rendering pipeline as the other shape primitives.

```xaml
<BoxView HeightRequest="80" CornerRadius="12">
    <BoxView.Fill>
        <LinearGradientBrush EndPoint="1,0">
            <GradientStop Color="DodgerBlue" Offset="0.0" />
            <GradientStop Color="MediumPurple" Offset="1.0" />
        </LinearGradientBrush>
    </BoxView.Fill>
</BoxView>
```

`BackgroundColor` continues to work for solid fills, but `Fill` is preferred
when you want a brush.

## Windows Maps gains a real implementation backed by Azure Maps

Preview 5 implements the Windows `Map` control against the WinUI
`MapControl` (Windows App SDK 1.8+, backed by Azure Maps), replacing the
previous stub that threw `NotImplementedException` for every operation
([dotnet/maui #34138](https://github.com/dotnet/maui/pull/34138)).
`MoveToRegion`, `MapType` (Street / Satellite / Hybrid), `IsTrafficEnabled`,
`IsScrollEnabled`, `IsZoomEnabled`, and pin add / clear / click are all
supported, with a 300 ms ease animation between camera positions.

A few cross-platform features remain unimplemented on Windows in this preview
because they aren't exposed by WinUI `MapControl`: pin labels and info
windows, polylines / polygons / circles, and `IsShowingUser` are no-ops
rather than throwing.

Apps using the Windows map need an Azure Maps subscription key configured on
the WinUI `MapControl` per the Windows App SDK Maps documentation.

## Material 3 handlers and helpers are now public

The Material 3 Android handler types and their helpers are now part of the
public surface area, so library authors and apps can subclass, decorate, or
replace them without reflecting against internal types
([dotnet/maui #35323](https://github.com/dotnet/maui/pull/35323)). This pairs
with the Material 3 control expansion that landed in Preview 4 and makes
it practical to build reusable Material 3 customizations.

## Toolbar back button supports an accessibility label

A new `BackButtonAccessibilityLabel` attached property on `NavigationPage`
and a new `AccessibilityLabel` bindable property on `Shell.BackButtonBehavior`
let you set a screen-reader label for the navigation bar back button
independently of the visible text
([dotnet/maui #35011](https://github.com/dotnet/maui/pull/35011)). The label
flows through to Android (`ContentDescription`), iOS and Mac Catalyst
(`AccessibilityLabel` on the bar button), and Windows
(`AutomationProperties.Name`).

```xaml
<!-- Shell -->
<Shell.BackButtonBehavior>
    <BackButtonBehavior AccessibilityLabel="Back to orders" />
</Shell.BackButtonBehavior>

<!-- NavigationPage (set on the parent page; applied to the child's back button) -->
<ContentPage NavigationPage.BackButtonAccessibilityLabel="Back to orders" />
```

## Android raises its minimum SDK to API 24

.NET MAUI in .NET 11 now requires Android 7.0 (API 24) as its minimum
supported platform, up from API 23
([dotnet/maui #35452](https://github.com/dotnet/maui/pull/35452)). New
projects pick up this change automatically; existing projects upgrading from
.NET 10 should update `SupportedOSPlatformVersion` in the project file:

```xml
<PropertyGroup>
  <SupportedOSPlatformVersion Condition="$(TargetFramework.Contains('-android'))">24.0</SupportedOSPlatformVersion>
</PropertyGroup>
```

API 24 / Android 7.0 covers more than 95% of active Android devices and
aligns .NET MAUI with the broader Android ecosystem's minimum-API guidance.

## .NET for Android stabilizes API 37

.NET for Android `36.99.0-preview.5.308` graduates API 37 / Android 17 from
preview to **Stable** and defaults .NET 11 projects to target
`net11.0-android37` only
([dotnet/android #11151](https://github.com/dotnet/android/pull/11151),
[dotnet/android #11254](https://github.com/dotnet/android/pull/11254)). You no
longer need `EnablePreviewFeatures` to consume Android 17 APIs.

Preview 5 also adds a new `EnableOnBackInvokedCallback` property to
`ApplicationAttribute`, giving apps a one-line opt-in to Android's predictive
back gesture
([dotnet/android #11307](https://github.com/dotnet/android/pull/11307)):

```csharp
[Application(EnableOnBackInvokedCallback = true)]
public class MyApplication : MauiApplication
{
    public MyApplication(IntPtr handle, JniHandleOwnership ownership)
        : base(handle, ownership) { }

    protected override MauiApp CreateMauiApp() => MauiProgram.CreateMauiApp();
}
```

### 🚨 Minimum API level unified to 24

.NET for Android now uses a single minimum supported API level —
**API 24 (Android 7.0)** — across all runtimes (Mono, CoreCLR, and NativeAOT)
([dotnet/android #11331](https://github.com/dotnet/android/pull/11331)).
Previously the floor differed by runtime; consolidating on API 24 simplifies
the support matrix and lets the workload drop conditional code paths for
older versions. Existing projects with `SupportedOSPlatformVersion` lower
than `24.0` should bump it before upgrading to .NET 11.

### TrimmableTypeMap progresses toward smaller, AOT-friendly apps

A substantial block of `TrimmableTypeMap` work landed this preview, moving
the new trim-friendly typemap from internal scaffolding to a usable runtime
path on both CoreCLR and NativeAOT. Highlights include:

- JNI replacement APIs are recognized by the trimmable typemap
  ([dotnet/android #11270](https://github.com/dotnet/android/pull/11270)).
- `[Export]` and `[ExportField]` callbacks — including dynamic export array
  callbacks — are wired through the trimmable path
  ([dotnet/android #11123](https://github.com/dotnet/android/pull/11123),
  [dotnet/android #11428](https://github.com/dotnet/android/pull/11428)).
- Default package naming switches to `Crc64` with `LowercaseCrc64`
  compatibility for existing apps
  ([dotnet/android #11193](https://github.com/dotnet/android/pull/11193)).
- The trimmable typemap runtime initializes correctly for app startup on
  CoreCLR and NativeAOT
  ([dotnet/android #11252](https://github.com/dotnet/android/pull/11252),
  [dotnet/android #11292](https://github.com/dotnet/android/pull/11292)).
- Open generic JNI construction is rejected with a clear error
  ([dotnet/android #11273](https://github.com/dotnet/android/pull/11273)),
  and `[JniAddNativeMethodRegistrationAttribute]` is refused with `XA4251`
  ([dotnet/android #11274](https://github.com/dotnet/android/pull/11274)).
- ReadyToRun trimmable typemap assemblies are now packaged
  ([dotnet/android #11473](https://github.com/dotnet/android/pull/11473)),
  and base UCO wrappers are reused for inherited overrides
  ([dotnet/android #11466](https://github.com/dotnet/android/pull/11466)).

These changes are foundational for the Android app size and trim quality
improvements landing in subsequent .NET 11 previews.

Other notable .NET for Android changes:

- CoreCLR release APKs no longer ship diagnostic libraries
  ([dotnet/android #11245](https://github.com/dotnet/android/pull/11245)).
- A build-time error now fires when Mono-specific AOT settings are set while
  the project targets CoreCLR
  ([dotnet/android #11246](https://github.com/dotnet/android/pull/11246)).
- The .NET runtime crash reporting path now activates before native signal
  chaining, so crash dumps include managed context more reliably
  ([dotnet/android #11291](https://github.com/dotnet/android/pull/11291)).

## .NET for Apple workloads refresh bindings and improve dev-loop builds

.NET for iOS, Mac Catalyst, macOS, and tvOS Preview 5 refreshes its bindings
against the current Xcode 26.5 SDKs
([dotnet/macios #25394](https://github.com/dotnet/macios/pull/25394)) and
brings several developer-loop improvements
([dotnet/macios compare](https://github.com/dotnet/macios/compare/release/11.0.1xx-preview4...release/11.0.1xx-preview5)):

- Debug builds on device now strip CoreCLR / ReadyToRun framework metadata to
  reduce on-device app size during inner-loop development
  ([dotnet/macios #25360](https://github.com/dotnet/macios/pull/25360)).
- The build supports a partial Xcode-less mode for scenarios where Xcode is
  not installed, simplifying CI configurations that only need to produce
  intermediate outputs
  ([dotnet/macios #25429](https://github.com/dotnet/macios/pull/25429)).
- `sharpie` now emits a helpful error when invoked on x64 macOS rather than
  failing with an opaque message
  ([dotnet/macios #25359](https://github.com/dotnet/macios/pull/25359)).

`dotnet/maui` also removed `IsTrimmable=false` from assemblies that were
already AOT-compatible
([dotnet/maui #34573](https://github.com/dotnet/maui/pull/34573)), and
preserves the default trimming behavior for iOS and Mac Catalyst when using
CoreCLR ([dotnet/maui #35311](https://github.com/dotnet/maui/pull/35311)).

## Apple Intelligence APIs ship in Essentials.AI

The Apple Intelligence integration in `Microsoft.Maui.Essentials.AI` moves
from unshipped to shipped on .NET for iOS, Mac Catalyst, and macOS
([dotnet/maui #34574](https://github.com/dotnet/maui/pull/34574)).
`AppleIntelligenceChatClient` (with `GetResponseAsync` and
`GetStreamingResponseAsync`), `NLEmbeddingGenerator`, and the
`NLEmbeddingExtensions.AsIEmbeddingGenerator` extension are still gated
behind the `MAUIAI0001` experimental attribute, but their surface is now
stable for the .NET 11 release branch.

```csharp
#pragma warning disable MAUIAI0001
var client = new AppleIntelligenceChatClient();
var response = await client.GetResponseAsync(
    "Summarize today's notes",
    cancellationToken: ct);
#pragma warning restore MAUIAI0001
```

## Bug fixes

- **CheckBox** — Templates created with the .NET 11 preview no longer hit
  `TypeLoadException` / `HandlerNotFoundException` during handler resolution
  ([dotnet/maui #35666](https://github.com/dotnet/maui/pull/35666)).
- **Toolbar** — Empty badge text on iOS no longer renders a stray indicator
  dot ([dotnet/maui #35504](https://github.com/dotnet/maui/pull/35504)).
- **Aspire ServiceDefaults template** — OpenTelemetry packages were bumped to
  current versions
  ([dotnet/maui #35333](https://github.com/dotnet/maui/pull/35333)).

## Contributors

Thank you contributors! ❤️

[@Ahamed-Ali](https://github.com/Ahamed-Ali),
[@BagavathiPerumal](https://github.com/BagavathiPerumal),
[@Copilot](https://github.com/Copilot),
[@dalexsoto](https://github.com/dalexsoto),
[@devanathan-vaithiyanathan](https://github.com/devanathan-vaithiyanathan),
[@Dhivya-SF4094](https://github.com/Dhivya-SF4094),
[@filipnavara](https://github.com/filipnavara),
[@HarishwaranVijayakumar](https://github.com/HarishwaranVijayakumar),
[@jeremy-visionaid](https://github.com/jeremy-visionaid),
[@jfversluis](https://github.com/jfversluis),
[@jonathanpeppers](https://github.com/jonathanpeppers),
[@jonpryor](https://github.com/jonpryor),
[@KarthikRajaKalaimani](https://github.com/KarthikRajaKalaimani),
[@kotlarmilos](https://github.com/kotlarmilos),
[@kubaflo](https://github.com/kubaflo),
[@mattleibow](https://github.com/mattleibow),
[@NafeelaNazhir](https://github.com/NafeelaNazhir),
[@NanthiniMahalingam](https://github.com/NanthiniMahalingam),
[@NirmalKumarYuvaraj](https://github.com/NirmalKumarYuvaraj),
[@nivetha-nagalingam](https://github.com/nivetha-nagalingam),
[@prakashKannanSf3972](https://github.com/prakashKannanSf3972),
[@praveenkumarkarunanithi](https://github.com/praveenkumarkarunanithi),
[@PureWeen](https://github.com/PureWeen),
[@Redth](https://github.com/Redth),
[@rmarinho](https://github.com/rmarinho),
[@rolfbjarne](https://github.com/rolfbjarne),
[@sbomer](https://github.com/sbomer),
[@sheiksyedm](https://github.com/sheiksyedm),
[@simonrozsival](https://github.com/simonrozsival),
[@sjordanGSS](https://github.com/sjordanGSS),
[@StephaneDelcroix](https://github.com/StephaneDelcroix),
[@SubhikshaSf4851](https://github.com/SubhikshaSf4851),
[@SuthiYuvaraj](https://github.com/SuthiYuvaraj),
[@SyedAbdulAzeemSF4852](https://github.com/SyedAbdulAzeemSF4852),
[@Tamilarasan-Paranthaman](https://github.com/Tamilarasan-Paranthaman),
[@TamilarasanSF4853](https://github.com/TamilarasanSF4853),
and [@Vignesh-SF3580](https://github.com/Vignesh-SF3580).
