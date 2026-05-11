# .NET MAUI in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 brings new XAML authoring capabilities, broader Material 3
adoption on Android, single-project icon improvements, and `dotnet watch`
support for both Android and iOS — alongside a large reliability sweep across
CollectionView, Shell, Maps, and platform-specific controls.

- [`x:Code` directive for inline C# in XAML](#xcode-directive-for-inline-c-in-xaml)
- [Material 3 expands across Android controls](#material-3-expands-across-android-controls)
- [`MonochromeFile` support for Android adaptive icons](#monochromefile-support-for-android-adaptive-icons)
- [Compiled bindings inside `DataTemplate`s](#compiled-bindings-inside-datatemplates)
- [`dotnet watch` for Android](#dotnet-watch-for-android)
- [`dotnet watch` for iOS](#dotnet-watch-for-ios)
- [Bug fixes](#bug-fixes)
- [Contributors](#contributors)

## `x:Code` directive for inline C# in XAML

The XAML compiler now supports an `x:Code` directive that lets you inline a
small block of C# directly inside a XAML file. This makes it easier to keep
view-local glue code next to the markup it serves without creating a code-behind
partial just for a single helper
([dotnet/maui #34715](https://github.com/dotnet/maui/pull/34715)).

## Material 3 expands across Android controls

The Android handlers for several core controls now use Material 3 styling and
behaviors out of the box, bringing them in line with modern Android design and
unlocking the Material 3 theming system:

- `ImageButton` ([dotnet/maui #33649](https://github.com/dotnet/maui/pull/33649))
- `DatePicker` ([dotnet/maui #33651](https://github.com/dotnet/maui/pull/33651))
- `Entry` ([dotnet/maui #33673](https://github.com/dotnet/maui/pull/33673))
- `Slider` ([dotnet/maui #33603](https://github.com/dotnet/maui/pull/33603))

## `MonochromeFile` support for Android adaptive icons

Single-project app icons can now declare a dedicated monochrome layer for
Android themed icons via a new `MonochromeFile` attribute on `MauiIcon`. This
lets your themed icon use a different glyph than the foreground layer, instead
of being a tinted reuse of it
([dotnet/maui #34569](https://github.com/dotnet/maui/pull/34569)).

## Compiled bindings inside `DataTemplate`s

Compiled bindings with explicit sources defined inside a `DataTemplate` now
resolve correctly, fixing a regression that broke `TapGestureRecognizer`
bindings inside `CollectionView` items in .NET 10
([dotnet/maui #34447](https://github.com/dotnet/maui/pull/34447)). The XAML
source generator also now emits diagnostics when an `x:DataType` or binding is
invalid ([dotnet/maui #34078](https://github.com/dotnet/maui/pull/34078)) and
correctly distinguishes static extension classes from `enum` types when
resolving XAML markup ([dotnet/maui #34446](https://github.com/dotnet/maui/pull/34446)).

## `dotnet watch` for Android

`dotnet watch` now works for Android devices and emulators. After selecting a
target framework and device, `dotnet watch` deploys your app and applies Hot
Reload changes as you edit — no manual rebuild required.

![GIF of `dotnet watch` on Windows for Android](media/net11p4-dotnet-watch-android.gif)

## `dotnet watch` for iOS

Several long-standing issues have been fixed to make `dotnet watch` usable
end-to-end on a `dotnet new maui` project running in the iOS Simulator:

- The Spectre.Console TFM picker no longer appears stuck because two readers
  were both calling `Console.ReadKey()`. Keys now flow through a single
  `PhysicalConsole.KeyPressed` event
  ([dotnet/sdk #53675](https://github.com/dotnet/sdk/pull/53675)).
- Ctrl+C and Ctrl+R no longer surface a spurious `WebSocketException` /
  `ObjectDisposedException` when the WebSocket transport tears down
  ([dotnet/sdk #53648](https://github.com/dotnet/sdk/pull/53648)).
- Hot Reload no longer deadlocks on iOS when `UIKitSynchronizationContext` is
  installed before the startup hook runs
  ([dotnet/sdk #54023](https://github.com/dotnet/sdk/pull/54023)).

![GIF of `dotnet watch` on macOS for iOS](media/net11p4-dotnet-watch-ios.gif)

### Known issue: `dotnet watch` requires `MtouchLink=None` for iOS Simulator

`dotnet watch` does not work for iOS projects unless `<MtouchLink>None</MtouchLink>`
is set in the `.csproj` file
([dotnet/macios #25295](https://github.com/dotnet/macios/issues/25295)). Add the
following to your project file:

```xml
<PropertyGroup>
  <MtouchLink>None</MtouchLink>
</PropertyGroup>
```

## Bug fixes

Preview 4 includes a broad reliability pass across the framework. Highlights
grouped by area:

- **CollectionView / CarouselView** — incorrect `FirstVisibleItemIndex` after
  programmatic scroll on iOS, excessive height when `ObservableCollection`
  loads with delay, sizing inside `RefreshView`, footer reuse on grouped
  layouts, `EmptyView` swap stale-holder bug, accessibility "double tap to
  activate" announcement on Android, and `SafeAreaEdges` not being respected.
- **Shell** — `OnNavigatingFrom` reporting the wrong `DestinationPage`, tab
  bar visibility after the first tab becomes invisible, the iOS "More" tab
  not picking up Shell appearance, `InvalidCastException` when using
  `QueryPropertyAttribute` with nullable types, and `GoToAsync` back
  navigation not animating on iOS.
- **Maps** — Android polygon clearing, `MapElements.Clear()` not removing
  native elements on Android, and a `NullReferenceException` when tapping an
  iOS map with no overlays.
- **MediaPicker / Essentials** — picked images getting a stray `_processed`
  suffix on Android, `PickPhotosAsync` returning empty when selecting 4+
  images with `CompressionQuality` set on iOS, and the iOS connectivity
  changed event not firing when toggling Wi-Fi.
- **iOS 26 compatibility** — `NavigationPage` hangs after rapid push/pop,
  `Stepper` not reaching min/max when the increment exceeds the remaining
  range, and `SearchHandler` placeholder text not displaying.
- **Windows** — `CollectionView` NRE when toggling `IsGrouped` to `false`,
  Narrator announcing typed characters for password `Entry`, `DatePicker`
  `CharacterSpacing` ignored, and `TimePicker` rendering a default value when
  bound to `null`.
- **Layout / Drawing** — `LayoutCycleException` from nested `Border`s on
  Windows, `GraphicsView` `dirtyRect` mismatch on density change, and
  `GraphicsView.GetStringSize()` returning inaccurate measurements.

See the full Preview 4 changelog for the complete list:
<https://github.com/dotnet/maui/compare/11.0.0-preview.3.26203.7...release/11.0.1xx-preview4>

## Contributors

Thank you contributors! ❤️

[@Ahamed-Ali](https://github.com/Ahamed-Ali), [@akoeplinger](https://github.com/akoeplinger), [@BagavathiPerumal](https://github.com/BagavathiPerumal), [@CathyZhu0110](https://github.com/CathyZhu0110), [@devanathan-vaithiyanathan](https://github.com/devanathan-vaithiyanathan), [@Dhivya-SF4094](https://github.com/Dhivya-SF4094), [@HarishKumarSF4517](https://github.com/HarishKumarSF4517), [@HarishwaranVijayakumar](https://github.com/HarishwaranVijayakumar), [@ilonatommy](https://github.com/ilonatommy), [@JanKrivanek](https://github.com/JanKrivanek), [@jeremy-visionaid](https://github.com/jeremy-visionaid), [@jfversluis](https://github.com/jfversluis), [@jonathanpeppers](https://github.com/jonathanpeppers), [@jpd21122012](https://github.com/jpd21122012), [@KarthikRajaKalaimani](https://github.com/KarthikRajaKalaimani), [@kubaflo](https://github.com/kubaflo), [@Kyranio](https://github.com/Kyranio), [@maonaoda](https://github.com/maonaoda), [@mattleibow](https://github.com/mattleibow), [@mduchev](https://github.com/mduchev), [@mmitche](https://github.com/mmitche), [@NafeelaNazhir](https://github.com/NafeelaNazhir), [@NanthiniMahalingam](https://github.com/NanthiniMahalingam), [@NirmalKumarYuvaraj](https://github.com/NirmalKumarYuvaraj), [@nivetha-nagalingam](https://github.com/nivetha-nagalingam), [@Oxymoron290](https://github.com/Oxymoron290), [@prakashKannanSf3972](https://github.com/prakashKannanSf3972), [@praveenkumarkarunanithi](https://github.com/praveenkumarkarunanithi), [@PureWeen](https://github.com/PureWeen), [@sbomer](https://github.com/sbomer), [@Shalini-Ashokan](https://github.com/Shalini-Ashokan), [@sheiksyedm](https://github.com/sheiksyedm), [@simonrozsival](https://github.com/simonrozsival), [@StephaneDelcroix](https://github.com/StephaneDelcroix), [@SubhikshaSf4851](https://github.com/SubhikshaSf4851), [@SyedAbdulAzeemSF4852](https://github.com/SyedAbdulAzeemSF4852), [@Tamilarasan-Paranthaman](https://github.com/Tamilarasan-Paranthaman), [@TamilarasanSF4853](https://github.com/TamilarasanSF4853), and [@Vignesh-SF3580](https://github.com/Vignesh-SF3580)
