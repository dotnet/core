# .NET MAUI in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 adds cross-platform passkey authentication, opt-in XAML
Incremental Hot Reload, Shell route templates, and faster device development
workflows:

- [Cross-platform passkey authentication](#cross-platform-passkey-authentication)
- [XAML Incremental Hot Reload](#xaml-incremental-hot-reload)
- [Shell route templates](#shell-route-templates)
- [AOT-safe RelativeSource bindings](#aot-safe-relativesource-bindings)
- [Third-party platform backends](#third-party-platform-backends)
- [TabbedPage adopts handlers on Apple platforms](#tabbedpage-adopts-handlers-on-apple-platforms)
- [Platform-specific capabilities](#platform-specific-capabilities)
- [.NET for Android](#net-for-android)
- [Apple platforms (.NET for iOS, Mac Catalyst, macOS, tvOS)](#apple-platforms-net-for-ios-mac-catalyst-macos-tvos)
- [Community contributors](#community-contributors)

## Cross-platform passkey authentication

The new Passkeys Essentials API drives the native passkey UI on Android 14+,
iOS 16+, Mac Catalyst 16+, and Windows 10 version 1903+. Use
`Passkeys.IsSupported` to check availability, `Passkeys.CreateAsync` to
register a credential, and `Passkeys.AssertAsync` to authenticate with an
existing credential
([dotnet/maui #36837](https://github.com/dotnet/maui/pull/36837)).

`IsSupported` checks the platform version, but successful registration also
requires platform trust configuration. Apple apps need Associated Domains,
an Apple App Site Association file, and signing; Android apps need Digital
Asset Links. See the
[Passkeys setup guide](https://github.com/dotnet/maui/blob/release/11.0.1xx-preview7/src/Essentials/samples/README-Passkeys.md)
for the platform prerequisites.

The relying-party server supplies the standard WebAuthn options JSON and
verifies the response JSON returned by MAUI. The API handles the platform
ceremony, but does not perform server-side verification, attestation
validation, or challenge generation.

## XAML Incremental Hot Reload

> XAML Incremental Hot Reload is an opt-in preview feature in .NET 11.

XAML Incremental Hot Reload uses a source generator and a
`MetadataUpdateHandler` to update already-instantiated pages without rebuilding
the app. It supports property changes, child additions and removals, structural
reordering, attached properties, markup extensions, bindings, and
`ResourceDictionary` updates
([dotnet/maui #34338](https://github.com/dotnet/maui/pull/34338)).

The feature is off by default in Preview 7. Enable it for Debug builds with:

```xml
<PropertyGroup Condition="'$(Configuration)' == 'Debug'">
  <EnableMauiIncrementalHotReload>true</EnableMauiIncrementalHotReload>
</PropertyGroup>
```

When the switch is off, MAUI continues to use the existing XAML Hot Reload
path ([dotnet/maui #36832](https://github.com/dotnet/maui/pull/36832)).

## Shell route templates

Shell routes now support path parameters inspired by ASP.NET Core and Blazor
routing. Templates can contain required, optional, defaulted, constrained,
catch-all, and mixed segments. Existing literal routes are unchanged
([dotnet/maui #35110](https://github.com/dotnet/maui/pull/35110)).

```csharp
Routing.RegisterRoute("product/{sku}", typeof(ProductDetailPage));
await Shell.Current.GoToAsync("//products/product/seed-tomato");
```

Values are delivered through the existing `QueryProperty` and
`IQueryAttributable` mechanisms. Template routes currently require absolute
navigation; relative navigation is not yet supported.

## AOT-safe RelativeSource bindings

The XAML source generator now compiles
`{RelativeSource AncestorType=...}` bindings to trim-safe
`TypedBinding<TAncestor, TProperty>` instances when the ancestor type can be
resolved at compile time
([dotnet/maui #34408](https://github.com/dotnet/maui/pull/34408)).

```xaml
<Label Text="{Binding Title,
                      Source={RelativeSource AncestorType={x:Type local:PageViewModel}}}" />
```

This avoids a string-based binding path that relies on reflection and could
lose bound members during trimming in AOT Release builds. `Self`,
`TemplatedParent`, unresolved ancestor sources, and unresolved `x:Reference`
bindings continue to use the runtime binding path. A follow-up also removes a
false-positive `MAUIG2045` warning for unsealed ancestor types
([dotnet/maui #36905](https://github.com/dotnet/maui/pull/36905)).

## Third-party platform backends

Preview 7 adds a coordinated set of extension points for out-of-tree platform
backends. XAML `OnPlatform` recognizes GTK, macOS, and WPF
([dotnet/maui #35901](https://github.com/dotnet/maui/pull/35901)); alert and
gesture services expose public extension points
([dotnet/maui #36633](https://github.com/dotnet/maui/pull/36633),
[dotnet/maui #36655](https://github.com/dotnet/maui/pull/36655)); and
`BlazorWebView` supports replacing its platform handler while retaining the
services registered by `AddMauiBlazorWebView`
([dotnet/maui #36658](https://github.com/dotnet/maui/pull/36658)).

Resizetizer and SingleProject also expose contracts for processing assets and
activating a backend for either a recognized platform TFM or a neutral
`net11.0` inner build
([dotnet/maui #36653](https://github.com/dotnet/maui/pull/36653),
[dotnet/maui #36654](https://github.com/dotnet/maui/pull/36654)). Together,
these APIs let a community backend integrate through a NuGet package instead
of patching MAUI.

## TabbedPage adopts handlers on Apple platforms

`TabbedPage` on iOS and Mac Catalyst now uses the standard handler
architecture. `TabbedViewHandler` and a shared `TabBarControllerManager`
replace the monolithic `TabbedRenderer`
([dotnet/maui #36507](https://github.com/dotnet/maui/pull/36507)).

The handler is the default in Preview 7. `TabbedRenderer` remains available in
the Compatibility layer as a manual fallback, so apps with extensive
`TabbedPage` customizations should test this preview.

## Platform-specific capabilities

- **Status bar appearance** - `Window.StatusBarTheme` controls the icon
  appearance on Android and iOS independently of the app theme. This is useful
  when edge-to-edge content places a light or dark surface behind the status
  bar ([dotnet/maui #34903](https://github.com/dotnet/maui/pull/34903)).
- **Save captured media to the gallery** - `MediaPickerOptions.SaveToGallery`
  can save captured photos and videos to the system gallery on Android, iOS,
  and Mac Catalyst. The option defaults to `false` and is ignored on Windows
  and Tizen
  ([dotnet/maui #34641](https://github.com/dotnet/maui/pull/34641)).
- **Windows single-instance activation** - Windows apps expose an
  `AppInstance` activation lifecycle hook and can redirect external
  activations to the running instance. This also enables `WebAuthenticator`
  callbacks in single-instance apps
  ([dotnet/maui #36640](https://github.com/dotnet/maui/pull/36640)).

Preview 7 also improves keyboard activation for `Border` on Windows
([dotnet/maui #35578](https://github.com/dotnet/maui/pull/35578)) and native
event handling for the Material 3 Slider on Android
([dotnet/maui #36448](https://github.com/dotnet/maui/pull/36448)).

See the [full MAUI compare](https://github.com/dotnet/maui/compare/11.0.0-preview.6.26360.8...release/11.0.1xx-preview7)
for the complete set of changes.

## .NET for Android

Preview 7 streamlines the Android development loop. `FastDeploy2` is now the
default app-install fast deployment strategy and can reduce the healthy warm
incremental path to as few as three serial `adb` operations; the legacy
strategy remains available as a fallback
([dotnet/android #11795](https://github.com/dotnet/android/pull/11795)).
CoreCLR Debug builds also keep typemaps stable across C#-only rebuilds that do
not change Java-callable mappings, avoiding unnecessary native compilation,
APK rebuilding, and signing
([dotnet/android #12260](https://github.com/dotnet/android/pull/12260)).
Managed stack traces under CoreCLR FastDev now include source file and line
information ([dotnet/android #11702](https://github.com/dotnet/android/pull/11702)).

For NativeAOT, the trimmable typemap is now the default and the reflection-based
`managed` implementation has been removed
([dotnet/android #12121](https://github.com/dotnet/android/pull/12121),
[dotnet/android #12134](https://github.com/dotnet/android/pull/12134)).
The trimmable path adds `XA4212` for unsupported custom `IJavaObject` types,
preserves nested Java class names, and keeps `IGCUserPeer` methods through R8
([dotnet/android #12132](https://github.com/dotnet/android/pull/12132),
[dotnet/android #12187](https://github.com/dotnet/android/pull/12187),
[dotnet/android #12100](https://github.com/dotnet/android/pull/12100)).

`AndroidMessageHandler` now preserves `HEAD` requests across `301`, `302`, and
`303` redirects, and safely aborts in-flight body I/O when a response is
disposed. The disposal fix prevents a process crash that particularly affected
gRPC server-streaming cancellation
([dotnet/android #12102](https://github.com/dotnet/android/pull/12102),
[dotnet/android #12105](https://github.com/dotnet/android/pull/12105)).

The `EnableCrashReport` MSBuild property enables the .NET crash-report writer
for CoreCLR and NativeAOT apps
([dotnet/android #12136](https://github.com/dotnet/android/pull/12136)).
The existing `XA0132` diagnostic now reports when the Fast Deployment package
is missing from a device after a forced reinstall, replacing the misleading
`XA0137` deployment diagnostic
([dotnet/android #12060](https://github.com/dotnet/android/pull/12060)).

## Apple platforms (.NET for iOS, Mac Catalyst, macOS, tvOS)

- **App Store Connect symbolication** - IPA builds now include Apple's
  `*.symbols` files by default, enabling automatic crash-report symbolication
  in App Store Connect and Xcode Organizer. Set `IpaIncludeSymbols=false` to
  opt out ([dotnet/macios #26043](https://github.com/dotnet/macios/pull/26043)).
  The `EnableCrashReport` MSBuild property separately enables the .NET
  in-process crash-report writer for CoreCLR apps on iOS, tvOS, and Mac Catalyst
  ([dotnet/macios #26134](https://github.com/dotnet/macios/pull/26134)).
- **Hot Reload on physical devices** - `dotnet watch` now works on physical
  iOS and tvOS devices over USB or Wi-Fi
  ([dotnet/macios #26070](https://github.com/dotnet/macios/pull/26070)).
- **NativeAOT compilation flow** - ILC now receives prepared assemblies
  directly without a redundant ILLink pass, the trimmable-static registrar is
  generated after ILC, and a new warning identifies post-ILC assembly changes
  that can cause runtime failures
  ([dotnet/macios #26193](https://github.com/dotnet/macios/pull/26193),
  [dotnet/macios #26194](https://github.com/dotnet/macios/pull/26194),
  [dotnet/macios #26137](https://github.com/dotnet/macios/pull/26137)).
- **Binding and linking reliability** - fake-protocol binding classes retain
  runtime `Class.GetHandle` lookup instead of causing a hard link error when no
  Objective-C class exists, and generated `CreateObject` proxies for generic
  types no longer contain invalid IL
  ([dotnet/macios #26347](https://github.com/dotnet/macios/pull/26347),
  [dotnet/macios #26100](https://github.com/dotnet/macios/pull/26100)).

See the
[full Apple platforms compare](https://github.com/dotnet/macios/compare/release/11.0.1xx-preview6...release/11.0.1xx-preview7)
for the complete set of changes.

<!-- Filtered features (significant engineering work, but too narrow for release notes):
  - MAUI Community Toolkit and trimming cleanup (#34070, #34519, #30875):
    important migration and trim-safety work, but primarily relevant to Toolkit
    maintainers and internal build hygiene.
  - Avalonia.Controls.Maui template support (#35950): useful for an alternate
    UI-framework integration, but too specialized for the main highlights.
  - IViewScreenshot extensibility (#34350) and binding converter culture support
    (#35821): provider extensibility and incremental binding improvements.
  - Android dlopen-based assembly-store loading and decompression cache (#12033,
    #11967): low-level CoreCLR host work and an opt-in advanced performance path.
  - Apple rgen UI namespace cache (#26187): internal source-generator reliability.
-->

## Community contributors

Thank you contributors! ❤️

- [@baaaaif](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Abaaaaif)
- [@BagavathiPerumal](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ABagavathiPerumal)
- [@devanathan-vaithiyanathan](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Adevanathan-vaithiyanathan)
- [@Dhivya-SF4094](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ADhivya-SF4094)
- [@drasticactions](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Adrasticactions)
- [@durandt](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Adurandt)
- [@HarishKumarSF4517](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AHarishKumarSF4517)
- [@HarishwaranVijayakumar](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AHarishwaranVijayakumar)
- [@IlGalvo](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AIlGalvo)
- [@jeremy-visionaid](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Ajeremy-visionaid)
- [@jpd21122012](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Ajpd21122012)
- [@KarthikRajaKalaimani](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AKarthikRajaKalaimani)
- [@Kebechet](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AKebechet)
- [@kevin68](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Akevin68)
- [@LogishaSelvarajSF4525](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ALogishaSelvarajSF4525)
- [@NafeelaNazhir](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ANafeelaNazhir)
- [@NirmalKumarYuvaraj](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ANirmalKumarYuvaraj)
- [@pictos](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Apictos)
- [@prakashKannanSf3972](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AprakashKannanSf3972)
- [@praveenkumarkarunanithi](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Apraveenkumarkarunanithi)
- [@Shalini-Ashokan](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AShalini-Ashokan)
- [@sheiksyedm](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Asheiksyedm)
- [@SubhikshaSf4851](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ASubhikshaSf4851)
- [@SyedAbdulAzeemSF4852](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ASyedAbdulAzeemSF4852)
- [@Tamilarasan-Paranthaman](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ATamilarasan-Paranthaman)
- [@TamilarasanSF4853](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ATamilarasanSF4853)
- [@Vignesh-SF3580](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AVignesh-SF3580)

<!-- Mobile source ranges:
     dotnet/maui 11.0.0-preview.6.26360.8...release/11.0.1xx-preview7
     dotnet/android release/11.0.1xx-preview6...release/11.0.1xx-preview7
     dotnet/macios release/11.0.1xx-preview6...release/11.0.1xx-preview7
-->
