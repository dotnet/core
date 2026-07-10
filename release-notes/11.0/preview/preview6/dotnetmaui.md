# .NET MAUI in .NET 11 Preview 6 - Release Notes

.NET 11 Preview 6 advances the cross-platform CollectionView and Shell
architecture, removes the legacy Xamarin.Forms compatibility package, and
brings the Apple workloads onto stable Xcode 26.6:

- [CollectionView2 comes to Windows](#collectionview2-comes-to-windows)
- [Handler-based Shell architecture on Android](#handler-based-shell-architecture-on-android)
- [Microsoft.Maui.Controls.Compatibility package removed](#microsoftmauicontrolscompatibility-package-removed)
- [HybridWebView is now AOT-safe](#hybridwebview-is-now-aot-safe)
- [Geolocation gains a minimum-distance filter](#geolocation-gains-a-minimum-distance-filter)
- [Android MediaPicker result recovery](#android-mediapicker-result-recovery)
- [Reliability and platform-fix wave](#reliability-and-platform-fix-wave)
- [.NET for Android](#net-for-android)
- [Apple platforms (.NET for iOS, Mac Catalyst, macOS, tvOS)](#apple-platforms-net-for-ios-mac-catalyst-macos-tvos)
- [Contributors](#contributors)

.NET MAUI updates in .NET 11:

- [What's new in .NET MAUI in .NET 11](https://learn.microsoft.com/dotnet/maui/whats-new/)

## CollectionView2 comes to Windows

The next-generation CollectionView (`CV2`) now has a Windows handler built on
WinUI's `ItemsRepeater`, matching the `CV2` implementations that already exist
on Android, iOS, and Mac Catalyst
([dotnet/maui #34600](https://github.com/dotnet/maui/pull/34600)). The Windows
handler maps `LinearItemsLayout` and `GridItemsLayout` onto `ItemsRepeater`'s
virtualizing layouts and supports headers and footers, empty views, grouping,
selection modes, snapping, incremental loading, and `RefreshView`. This
continues the effort to replace the legacy `ListView`-based CollectionView with
a single modern architecture across every platform.

## Handler-based Shell architecture on Android

Shell on Android is re-implemented on top of standard MAUI handlers, replacing
the legacy renderer classes (`ShellRenderer`, `ShellFlyoutRenderer`,
`ShellItemRenderer`, `ShellSectionRenderer`) with `ShellHandler`,
`ShellItemHandler`, and `ShellSectionHandler`
([dotnet/maui #34758](https://github.com/dotnet/maui/pull/34758)). The new
handlers reuse the same building blocks as the rest of MAUI — `MauiDrawerLayout`
(shared with `FlyoutViewHandler`) and `TabbedViewManager` (shared with
`TabbedPage`) — instead of duplicating drawer, tab, and navigation logic per
renderer. This is an Android-only change; iOS and Mac Catalyst continue to use
the existing Shell renderers in this preview. If your app relies on Shell on
Android, this is a good preview to test against.

## Microsoft.Maui.Controls.Compatibility package removed

The opt-in `Microsoft.Maui.Controls.Compatibility` NuGet package, originally
provided to ease Xamarin.Forms migration, is no longer built or shipped
([dotnet/maui #35870](https://github.com/dotnet/maui/pull/35870)).

This is a breaking change only for projects that **explicitly** reference the
`Microsoft.Maui.Controls.Compatibility` package or rely on the Xamarin.Forms
compatibility renderers it exposed. Those projects need to migrate off the
package before moving to .NET 11. Apps that reference only
`Microsoft.Maui.Controls` are unaffected — the compatibility-named handler and
layout base types those apps depend on remain compiled into
`Microsoft.Maui.Controls.Core`.

## HybridWebView is now AOT-safe

`HybridWebView` JavaScript interop is reworked to use a source generator instead
of reflection, so it no longer produces trim or AOT warnings and works correctly
in fully trimmed and Native AOT apps
([dotnet/maui #35626](https://github.com/dotnet/maui/pull/35626)).

On Android, `HybridWebView` now also filters incoming JavaScript `message` events
by source, so only genuine native messages (delivered through
`WebView.postWebMessage`) raise `HybridWebViewMessageReceived`. Stray
`window.postMessage` callers — for example a nested iframe posting to its parent
— are dropped with a development-time warning instead of being surfaced as native
messages ([dotnet/maui #35717](https://github.com/dotnet/maui/pull/35717)).

## Geolocation gains a minimum-distance filter

`GeolocationListeningRequest` adds a `MinimumDistance` property (in meters) so
foreground location listening only raises updates after the device has moved at
least the specified distance
([dotnet/maui #35784](https://github.com/dotnet/maui/pull/35784)). A value of
`0` keeps the previous behavior of no distance filtering.

```csharp
var request = new GeolocationListeningRequest(GeolocationAccuracy.Best)
{
    MinimumDistance = 10 // meters
};

await Geolocation.StartListeningForegroundAsync(request);
```

## Android MediaPicker result recovery

On Android, the operating system can destroy and recreate your app's process
while the system camera or file picker is in the foreground — a case Android's
own guidance calls out for memory-intensive flows such as photo capture. When
that happened, the original `MediaPicker` task was lost and the captured photo or
video could not be delivered back to the app, making capture unreliable on
affected devices ([dotnet/maui #35455](https://github.com/dotnet/maui/pull/35455)).

Preview 6 adds an opt-in, Android-only recovery surface so apps can retrieve a
result that completed after the process was recreated:

- `MediaPicker.GetRecoveredMediaPickerResultsAsync()`
- `MediaPicker.WaitForRecoveredMediaPickerResultsAsync(CancellationToken)`
- `MediaPicker.ClearRecoveredMediaPickerResultAsync(string id)`

Normal live-process behavior is unchanged: the existing `MediaPicker` and
`IMediaPicker` methods still complete as before when the app stays alive.

## Reliability and platform-fix wave

Preview 6 continues the .NET 11 reliability push with a broad set of
customer-reported fixes across `CollectionView`, `Shell`, Material 3 on Android,
iOS 26, XAML, and Windows. Highlights include:

- **CollectionView** — grid item spacing on the first row and column
  ([dotnet/maui #34527](https://github.com/dotnet/maui/pull/34527)),
  `EmptyView`/`Header` visibility when `ItemsSource` is not set
  ([dotnet/maui #34989](https://github.com/dotnet/maui/pull/34989)), scroll
  position resetting on iOS status-bar tap
  ([dotnet/maui #34687](https://github.com/dotnet/maui/pull/34687)), and
  `ScrollOffset` when `ItemsSource` changes
  ([dotnet/maui #34488](https://github.com/dotnet/maui/pull/34488)).
- **Shell** — flyout items no longer scroll behind the flyout header on iOS
  ([dotnet/maui #34936](https://github.com/dotnet/maui/pull/34936)),
  `OnBackButtonPressed` fires on Android
  ([dotnet/maui #35150](https://github.com/dotnet/maui/pull/35150)), a memory
  leak from `Shell.Items.Clear()` is fixed
  ([dotnet/maui #35031](https://github.com/dotnet/maui/pull/35031)), and tab and
  content badge propagation is corrected
  ([dotnet/maui #35462](https://github.com/dotnet/maui/pull/35462)).
- **Material 3 on Android** — alerts, action sheets, and prompts no longer fall
  back to Material 2 styling when Material 3 is enabled
  ([dotnet/maui #35121](https://github.com/dotnet/maui/pull/35121)), the "More"
  bottom sheet uses theme colors
  ([dotnet/maui #35129](https://github.com/dotnet/maui/pull/35129)), and the
  first tab switch no longer flashes a Material 2 color in the app bar
  ([dotnet/maui #35117](https://github.com/dotnet/maui/pull/35117)).
- **iOS 26** — tap gestures on wrapped `Label` lines
  ([dotnet/maui #34640](https://github.com/dotnet/maui/pull/34640)), `Switch`
  thumb color on theme changes
  ([dotnet/maui #33953](https://github.com/dotnet/maui/pull/33953)), and a
  `StaticResource` Hot Reload crash
  ([dotnet/maui #35020](https://github.com/dotnet/maui/pull/35020)).
- **XAML** — the C# expression source generator no longer emits invalid
  change-notification handlers for static type references such as `Colors.*`,
  `DateTime.*`, and `Math.*`, which previously produced `CS1061` compiler errors
  ([dotnet/maui #35922](https://github.com/dotnet/maui/pull/35922)).
- **Accessibility** — the Windows `Layout` `AutomationPeer` is now public with an
  opt-in screen-reader tree
  ([dotnet/maui #35597](https://github.com/dotnet/maui/pull/35597)), and the
  Narrator no longer announces `ContentView` children twice when a description
  is set ([dotnet/maui #33979](https://github.com/dotnet/maui/pull/33979)).
- **Essentials** — `Geolocation` reports mean-sea-level altitude on Android API
  34+ instead of the WGS84 ellipsoidal value
  ([dotnet/maui #35097](https://github.com/dotnet/maui/pull/35097)), and the
  permissions API is now testable through a new `IPermissions` abstraction and a
  replaceable `Permissions.Current` implementation
  ([dotnet/maui #35987](https://github.com/dotnet/maui/pull/35987)).

See the [full compare](https://github.com/dotnet/maui/compare/11.0.0-preview.5.26304.4...release/11.0.1xx-preview6)
for the complete set of changes.

## .NET for Android

.NET for Android Preview 6 is a foundational release focused on HTTP correctness
and continued trimming work rather than new platform APIs.

`AndroidMessageHandler` is brought in line with the `HttpClient` contract and
`SocketsHttpHandler` behavior:

- Transport and protocol failures now throw `HttpRequestException` instead of the
  legacy `WebException`, with the original `WebException` (and its
  `WebExceptionStatus`) preserved as the `InnerException` for back-compat
  ([dotnet/android #11682](https://github.com/dotnet/android/pull/11682)).
- Cancelling a request now surfaces as an `OperationCanceledException` for both
  response-body reads
  ([dotnet/android #11554](https://github.com/dotnet/android/pull/11554)) and
  request-body uploads
  ([dotnet/android #11683](https://github.com/dotnet/android/pull/11683)),
  matching `SocketsHttpHandler`.

The trimmable typemap and CoreCLR work introduced earlier in .NET 11 continues,
including native registration for the LLVM typemap
([dotnet/android #11805](https://github.com/dotnet/android/pull/11805)) and no
longer serving BCL P/Invokes from the precompiled override on CoreCLR
([dotnet/android #11537](https://github.com/dotnet/android/pull/11537)).

Two build-time diagnostics help catch problems from legacy or third-party
libraries. Class libraries built with the old Xamarin.Android tooling that still
embed `__AndroidEnvironment__` resources now surface warning `XA0149` instead of
silently merging those files into your app
([dotnet/android #11700](https://github.com/dotnet/android/pull/11700)). And a
third-party `.aar` whose `proguard.txt` contains global R8 options that are not
valid in a consumer keep file — such as `-dontoptimize` or `-printmapping` — is
now skipped rather than failing the build or writing output to unexpected paths
([dotnet/android #11709](https://github.com/dotnet/android/pull/11709)).

## Apple platforms (.NET for iOS, Mac Catalyst, macOS, tvOS)

- **Xcode 26.6** is now the supported stable Xcode version for the Apple
  workloads ([dotnet/macios #25853](https://github.com/dotnet/macios/pull/25853)),
  and `mlaunch` was updated to support the Xcode 27 Device Hub for early testing
  ([dotnet/macios #25768](https://github.com/dotnet/macios/pull/25768)).
- **Icon Composer (`.icon`) app icons** are now supported. `.icon` folders
  introduced with macOS 26 Tahoe's Liquid Glass design are recognized as asset
  catalogs, passed to `actool` with `--app-icon`, and work with alternate-icon
  switching ([dotnet/macios #24722](https://github.com/dotnet/macios/pull/24722)).
- **`NSUrlSessionHandler` correctness** — it now follows redirects the same way
  the other .NET HTTP handlers do
  ([dotnet/macios #25529](https://github.com/dotnet/macios/pull/25529)) and
  rejects unsupported authentication methods so requests can fall back to Basic
  auth ([dotnet/macios #25493](https://github.com/dotnet/macios/pull/25493)).
- **MSBuild** — referenced extension projects are now built by default, so app
  extensions no longer need a manual build step
  ([dotnet/macios #25854](https://github.com/dotnet/macios/pull/25854)).

Preview 6 also includes a broad reliability, linker, and packaging pass across
the Apple workloads. See the full Preview 6 changelog for the complete list:
<https://github.com/dotnet/macios/compare/release/11.0.1xx-preview5...release/11.0.1xx-preview6>

## Contributors

Thank you contributors! ❤️

[@AdamEssenmacher](https://github.com/AdamEssenmacher),
[@akoeplinger](https://github.com/akoeplinger),
[@albyrock87](https://github.com/albyrock87),
[@arpitjain099](https://github.com/arpitjain099),
[@BagavathiPerumal](https://github.com/BagavathiPerumal),
[@dalexsoto](https://github.com/dalexsoto),
[@devanathan-vaithiyanathan](https://github.com/devanathan-vaithiyanathan),
[@Dhivya-SF4094](https://github.com/Dhivya-SF4094),
[@HarishKumarSF4517](https://github.com/HarishKumarSF4517),
[@HarishwaranVijayakumar](https://github.com/HarishwaranVijayakumar),
[@JanKrivanek](https://github.com/JanKrivanek),
[@jfversluis](https://github.com/jfversluis),
[@jonathanpeppers](https://github.com/jonathanpeppers),
[@KarthikRajaKalaimani](https://github.com/KarthikRajaKalaimani),
[@KitKeen](https://github.com/KitKeen),
[@kotlarmilos](https://github.com/kotlarmilos),
[@kubaflo](https://github.com/kubaflo),
[@mattleibow](https://github.com/mattleibow),
[@NanthiniMahalingam](https://github.com/NanthiniMahalingam),
[@NirmalKumarYuvaraj](https://github.com/NirmalKumarYuvaraj),
[@praveenkumarkarunanithi](https://github.com/praveenkumarkarunanithi),
[@PureWeen](https://github.com/PureWeen),
[@Qythyx](https://github.com/Qythyx),
[@Redth](https://github.com/Redth),
[@rmarinho](https://github.com/rmarinho),
[@rolfbjarne](https://github.com/rolfbjarne),
[@sbomer](https://github.com/sbomer),
[@Shalini-Ashokan](https://github.com/Shalini-Ashokan),
[@simonrozsival](https://github.com/simonrozsival),
[@StephaneDelcroix](https://github.com/StephaneDelcroix),
[@SubhikshaSf4851](https://github.com/SubhikshaSf4851),
[@SuthiYuvaraj](https://github.com/SuthiYuvaraj),
[@SyedAbdulAzeemSF4852](https://github.com/SyedAbdulAzeemSF4852),
[@T-Gro](https://github.com/T-Gro),
[@Tamilarasan-Paranthaman](https://github.com/Tamilarasan-Paranthaman),
[@TamilarasanSF4853](https://github.com/TamilarasanSF4853),
and [@Vignesh-SF3580](https://github.com/Vignesh-SF3580).
