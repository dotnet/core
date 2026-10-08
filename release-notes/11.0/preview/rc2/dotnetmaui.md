# .NET MAUI in .NET 11 RC 2 - Release Notes

.NET 11 RC 2 adds a C# UI template option, Apple Icon Composer support,
an opt-in Shell handler on Apple platforms, and XAML authoring improvements.
The Android workload adds API 37.2 bindings, JDK 25 support, and changes to
R8, build performance, and package size. Apple workloads require Xcode 27.0.

For the full feature set, see
[What's new in .NET MAUI](https://learn.microsoft.com/dotnet/maui/whats-new/).

- [Create an app with C# UI](#create-an-app-with-c-ui)
- [Use Apple Icon Composer assets](#use-apple-icon-composer-assets)
- [Evaluate the Apple Shell handler](#evaluate-the-apple-shell-handler)
- [XAML authoring and Hot Reload](#xaml-authoring-and-hot-reload)
- [XAML Incremental Hot Reload](#xaml-incremental-hot-reload)
- [.NET for Android](#net-for-android)
- [Apple platforms (.NET for iOS, Mac Catalyst, macOS, tvOS)](#apple-platforms-net-for-ios-mac-catalyst-macos-tvos)
- [Breaking changes from .NET 10](#breaking-changes-from-net-10)
- [Changes since RC 1](#changes-since-rc-1)
- [Contributors](#contributors)

## Create an app with C# UI

```console
dotnet new maui -n MyApp --ui csharp
```

The `maui` template can now generate `App.cs`, `AppShell.cs`, and `MainPage.cs`
without XAML files or an additional C# UI library. XAML remains the default.
The `--sample-content` option remains XAML-only
([dotnet/maui#34864](https://github.com/dotnet/maui/pull/34864)).

The multi-project template also supports an optional Avalonia desktop project:

```console
dotnet new maui-multiproject -n MyApp --avalonia
```

This option adds an Avalonia desktop project to the solution. It does not add
a WebAssembly project
([dotnet/maui#37829](https://github.com/dotnet/maui/pull/37829)).

## Use Apple Icon Composer assets

`MauiIcon` now accepts Apple Icon Composer `.icon` bundles on iOS and
Mac Catalyst. The Apple asset compiler processes the bundle instead of
Resizetizer converting it to raster images
([dotnet/maui#38958](https://github.com/dotnet/maui/pull/38958)).

Replace the existing `MauiIcon` item with platform-specific items. Keep an
SVG or PNG icon for Android and Windows:

```xml
<ItemGroup>
  <MauiIcon Include="Resources\AppIcon\appicon.icon"
            Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'ios' Or $([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'maccatalyst'" />
  <MauiIcon Include="Resources\AppIcon\appicon.svg"
            ForegroundFile="Resources\AppIcon\appiconfg.svg"
            Color="#512BD4"
            Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) != 'ios' And $([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) != 'maccatalyst'" />
</ItemGroup>
```

Use one icon per target platform. MAUI tracks changes to files inside the
`.icon` directory for incremental builds and derives the app icon name from
the directory name. Existing SVG and PNG icon processing is unchanged.

## Evaluate the Apple Shell handler

```xml
<PropertyGroup>
  <UseiOSShellHandler>true</UseiOSShellHandler>
</PropertyGroup>
```

iOS and Mac Catalyst apps can opt in to a handler-based Shell implementation.
It uses the shared navigation, tab-bar, and flyout managers and exposes handler
factory hooks for customization
([dotnet/maui#37034](https://github.com/dotnet/maui/pull/37034)).

The compatibility `ShellRenderer` remains the default. Remove the property or
set it to `false` to continue using the renderer. The property registers the
complete Shell handler hierarchy; no additional manual handler registration
is required.

Thank you [@Vignesh-SF3580](https://github.com/Vignesh-SF3580)
for this contribution!

## XAML authoring and Hot Reload

With source-generated XAML, C# expressions now support type references through
XML namespace prefixes and attached bindable property access. These expressions
are not supported by XamlC or runtime inflation. For example:

```xaml
<ContentPage
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:local="clr-namespace:MyApp.Helpers"
    x:Class="MyApp.MainPage">
    <Grid RowDefinitions="Auto,Auto,Auto">
        <Button x:Name="myButton" Grid.Row="2" />
        <Label Text="{$'Row {myButton.(Grid.Row)}'}" />
    </Grid>
</ContentPage>
```

The generator converts `target.(Type.Property)` to the corresponding attached
property getter. An expression such as `{local:Helper.GetValue()}` can also
resolve a type through its namespace prefix
([dotnet/maui#35007](https://github.com/dotnet/maui/pull/35007)).
RC 2 also fixes generated bindings that assign a struct sub-property and
improves diagnostics for interpolated strings and lambda method groups
([dotnet/maui#35006](https://github.com/dotnet/maui/pull/35006),
[dotnet/maui#35093](https://github.com/dotnet/maui/pull/35093)).
SourceGen also resolves `x:Reference` bindings in lazily created data templates
([dotnet/maui#38093](https://github.com/dotnet/maui/pull/38093)).

### XAML Incremental Hot Reload

> XAML Incremental Hot Reload is a preview feature in .NET 11.

Changing a binding's `StringFormat` now preserves its `x:Reference` source
during source-generated incremental Hot Reload. Classless resource dictionaries
merged through `App.xaml` also propagate resource edits to existing and new
`DynamicResource` consumers
([dotnet/maui#37895](https://github.com/dotnet/maui/pull/37895),
[dotnet/maui#38409](https://github.com/dotnet/maui/pull/38409)).

RC 2 also defers built-in handler activation until a handler is requested
([dotnet/maui#38535](https://github.com/dotnet/maui/pull/38535)).
The release includes control, layout, accessibility, and memory-lifetime
fixes. See the
[full MAUI RC 2 compare](https://github.com/dotnet/maui/compare/484132f9e51f4d1eae72dba038575d6102639730...d32b79928709cf53b671336dabd0caef5a679fc2)
for the complete set of changes.

## .NET for Android

### Android API 37.2 and JDK 25

The Android workload includes API 37.2 bindings. Target
`net11.0-android37.2` to use these APIs
([dotnet/android#12633](https://github.com/dotnet/android/pull/12633),
[dotnet/android#12728](https://github.com/dotnet/android/pull/12728)).

Android projects now support JDK 25 as well as JDK 21. The minimum supported
JDK is 21. Projects that invoke Gradle with JDK 25 need Gradle 9.1 or later
([dotnet/android#12478](https://github.com/dotnet/android/pull/12478)).

### R8 optimization and private-member obfuscation

When R8 is enabled, .NET 11 now defaults `AndroidR8ObfuscationMode` to
`private-members`. R8 optimization is enabled, and private and package-private
Java members can be renamed. Java class names and public and protected member
names remain preserved for managed-to-Java interoperability
([dotnet/android#12668](https://github.com/dotnet/android/pull/12668)).

Use the compatibility setting if your app needs the previous R8 policy:

```xml
<PropertyGroup>
  <AndroidR8ObfuscationMode>disabled</AndroidR8ObfuscationMode>
</PropertyGroup>
```

This setting retains shrinking but disables obfuscation and uses the previous
non-optimizing configuration. RC 2 does not include the experimental
managed-assembly rewriting approach for R8
([dotnet/android#12846](https://github.com/dotnet/android/pull/12846)).

### Incremental builds and smaller packages

Unchanged Release builds using default signing and no extra bundletool
arguments now skip universal APK generation. Custom-keystore signing and
custom bundletool arguments retain the previous always-run behavior.
In the tested CoreCLR MAUI sample-content app with trimmable
type maps, repeated `dotnet build --no-restore` improved from 6.72 to
4.58 seconds, a 31.8% reduction
([dotnet/android#12230](https://github.com/dotnet/android/pull/12230)).

Optimized builds also use a higher Zstandard compression level for the
assembly store. In an `android-arm64` Release build of
`dotnet new maui --sample-content`, the APK decreased from 22,547,511 to
21,494,839 bytes. That is a reduction of 1,052,672 bytes, or 4.67%.
The startup comparison used an Android 16 ARM64 emulator and did not establish
a statistically significant startup change
([dotnet/android#12415](https://github.com/dotnet/android/pull/12415)).

CoreCLR and NativeAOT also use a short, best-effort no-GC region during
startup. It ends after the first managed `Activity.ReportFullyDrawn()` call
or after 10 seconds. Mono behavior is unchanged
([dotnet/android#12782](https://github.com/dotnet/android/pull/12782)).

See the
[full Android RC 2 compare](https://github.com/dotnet/android/compare/b65b55d5357abb23960a999c7c5ffaceb75c4515...801f9ecbab5118b13d21cb52409e507ad4b2feb7)
for the complete set of changes.

## Apple platforms (.NET for iOS, Mac Catalyst, macOS, tvOS)

- **Xcode 27.0** is required. RC 2 includes updated Apple platform bindings
  across UIKit, AppKit, AVFoundation, WebKit, and other frameworks
  ([dotnet/macios#26607](https://github.com/dotnet/macios/pull/26607)).
- **Custom HTTP proxies** are now supported in `NSUrlSessionHandler`.
  Configure `Proxy` with an `IWebProxy`, use proxy credentials, or set
  `UseProxy=false` to bypass the system proxy configuration
  ([dotnet/macios#26021](https://github.com/dotnet/macios/pull/26021)).
- **Info.plist entries from MSBuild** can now be added, overridden, or removed
  with typed `AppManifestEntry` items. Boolean, string, and string-array
  values are supported
  ([dotnet/macios#26240](https://github.com/dotnet/macios/pull/26240)).
- **Dynamic code detection** now reports dynamic code support in CoreCLR
  apps on iOS, tvOS, and Mac Catalyst. This allows libraries such as
  Entity Framework Core to create models at runtime instead of incorrectly
  selecting their NativeAOT code path. See [Changes since RC 1](#changes-since-rc-1)
  for the app-size impact and opt-out
  ([dotnet/macios#26468](https://github.com/dotnet/macios/pull/26468)).

CoreCLR also defaults to the trimmable-static registrar and assembly
preparation, extending the NativeAOT default introduced in RC 1. Untrimmed
simulator builds use the partial registrar
([dotnet/macios#26409](https://github.com/dotnet/macios/pull/26409),
[dotnet/macios#26556](https://github.com/dotnet/macios/pull/26556)).

RC 2 also includes resource processing, incremental build, Hot Reload,
networking, and packaging fixes. See the
[full Apple platforms RC 2 compare](https://github.com/dotnet/macios/compare/36cc717537e7deaf6a8161bd96a977195cacd434...35d8bf5a42cd71edf4e2700b1e45f6c4b65f3fbe)
for the complete set of changes.

## Breaking changes from .NET 10

- **Apple scene lifecycle**: iOS and Mac Catalyst apps built with the
  Xcode 27 SDKs must use the UIKit scene lifecycle. New MAUI templates include a
  `UIApplicationSceneManifest` and a registered `MauiUISceneDelegate`
  subclass. Existing apps must add the corresponding configuration and
  migrate custom lifecycle and launch-option handling to scene callbacks.
  The templates retain a single-window default. Each
  `PerformActionForShortcutItem` lifecycle registration must acknowledge its
  completion callback; observers that do not handle the action should reply
  with `false`
  ([dotnet/maui#38601](https://github.com/dotnet/maui/pull/38601)).
- **Mac Catalyst app minimum**: New MAUI app templates now set
  `SupportedOSPlatformVersion` to `17.0` for Mac Catalyst, the minimum accepted
  by the .NET Mac Catalyst 27 SDK. The MAUI iOS app minimum remains `15.0`
  ([dotnet/maui#38601](https://github.com/dotnet/maui/pull/38601)).
- **Legacy Apple item handlers**: Legacy `CollectionView` and `CarouselView`
  handler APIs on iOS and Mac Catalyst now produce obsolete warnings.
  Migrate custom handlers to the Items2 implementations. The controls
  themselves are not obsolete. Windows legacy CollectionView handler APIs
  remain supported and are not obsolete
  ([dotnet/maui#38049](https://github.com/dotnet/maui/pull/38049),
  [dotnet/maui#38737](https://github.com/dotnet/maui/pull/38737)).
- **R8 defaults**: Apps with R8 enabled now use optimization and private-member
  obfuscation. Test code that finds Java members by name. Set
  `AndroidR8ObfuscationMode=disabled` to restore the previous policy
  ([dotnet/android#12668](https://github.com/dotnet/android/pull/12668)).

## Changes since RC 1

- **Apple CoreCLR dynamic code default**: iOS, tvOS, and Mac Catalyst CoreCLR
  apps now inherit `DynamicCodeSupport=true` from the SDK instead of
  defaulting to `false`. This keeps `System.Reflection.Emit` in trimmed
  output and can increase app size. Apps whose dependencies do not require
  dynamic code can set `DynamicCodeSupport=false`. NativeAOT retains
  `false`
  ([dotnet/macios#26468](https://github.com/dotnet/macios/pull/26468)).
- **Android ReadyToRun requires trimming**: CoreCLR builds with
  `PublishTrimmed=false` now disable ReadyToRun and composite ReadyToRun and
  report warning `XA0119`. Use `PublishTrimmed=true` to use ReadyToRun
  ([dotnet/android#12445](https://github.com/dotnet/android/pull/12445)).
- **Android deprecation diagnostics**: Generated bindings now use API 24 as
  the minimum for platform attribute emission. APIs deprecated at or below
  that level can report ordinary obsolete warnings instead of platform
  obsoletion diagnostics
  ([dotnet/android#12682](https://github.com/dotnet/android/pull/12682)).
- **Apple desktop architecture defaults**: Release builds for macOS and
  Mac Catalyst with `SupportedOSPlatformVersion` set to `27.0` or later
  now default to the host architecture, rather than a universal app, when no
  runtime identifier is specified. Set `RuntimeIdentifiers` explicitly if
  you need both architectures. Earlier deployment targets retain the
  universal default
  ([dotnet/macios#26731](https://github.com/dotnet/macios/pull/26731)).

## Contributors

Thank you contributors!

[@Ahamed-Ali](https://github.com/Ahamed-Ali),
[@albyrock87](https://github.com/albyrock87),
[@baaaaif](https://github.com/baaaaif),
[@BagavathiPerumal](https://github.com/BagavathiPerumal),
[@BrzVlad](https://github.com/BrzVlad),
[@dalexsoto](https://github.com/dalexsoto),
[@devanathan-vaithiyanathan](https://github.com/devanathan-vaithiyanathan),
[@Dhivya-SF4094](https://github.com/Dhivya-SF4094),
[@drasticactions](https://github.com/drasticactions),
[@HarishKumarSF4517](https://github.com/HarishKumarSF4517),
[@HarishwaranVijayakumar](https://github.com/HarishwaranVijayakumar),
[@jfversluis](https://github.com/jfversluis),
[@jonathanpeppers](https://github.com/jonathanpeppers),
[@jonpryor](https://github.com/jonpryor),
[@jpd21122012](https://github.com/jpd21122012),
[@KarthikRajaKalaimani](https://github.com/KarthikRajaKalaimani),
[@Kas-code](https://github.com/Kas-code),
[@kubaflo](https://github.com/kubaflo),
[@LogishaSelvarajSF4525](https://github.com/LogishaSelvarajSF4525),
[@mattleibow](https://github.com/mattleibow),
[@mauroa](https://github.com/mauroa),
[@missymessa](https://github.com/missymessa),
[@mmitche](https://github.com/mmitche),
[@NafeelaNazhir](https://github.com/NafeelaNazhir),
[@NirmalKumarYuvaraj](https://github.com/NirmalKumarYuvaraj),
[@pictos](https://github.com/pictos),
[@prakashKannanSf3972](https://github.com/prakashKannanSf3972),
[@praveenkumarkarunanithi](https://github.com/praveenkumarkarunanithi),
[@PureWeen](https://github.com/PureWeen),
[@Redth](https://github.com/Redth),
[@rmarinho](https://github.com/rmarinho),
[@RoderickIveans](https://github.com/RoderickIveans),
[@rolfbjarne](https://github.com/rolfbjarne),
[@Shalini-Ashokan](https://github.com/Shalini-Ashokan),
[@sheiksyedm](https://github.com/sheiksyedm),
[@simonrozsival](https://github.com/simonrozsival),
[@StephaneDelcroix](https://github.com/StephaneDelcroix),
[@SubhikshaSf4851](https://github.com/SubhikshaSf4851),
[@SuthiYuvaraj](https://github.com/SuthiYuvaraj),
[@SyedAbdulAzeemSF4852](https://github.com/SyedAbdulAzeemSF4852),
[@TamilarasanSF4853](https://github.com/TamilarasanSF4853),
[@Vignesh-SF3580](https://github.com/Vignesh-SF3580), and
[@vitek-karas](https://github.com/vitek-karas)

<!-- Mobile source ranges and RC 2 workload versions:
     dotnet/maui 484132f9e51f4d1eae72dba038575d6102639730...d32b79928709cf53b671336dabd0caef5a679fc2
       Microsoft.NET.Sdk.Maui.Manifest 11.0.0-rc.2.26505.5
     dotnet/android b65b55d5357abb23960a999c7c5ffaceb75c4515...801f9ecbab5118b13d21cb52409e507ad4b2feb7
       Microsoft.Android.Sdk 37.2.0-rc.2.84
     dotnet/macios 36cc717537e7deaf6a8161bd96a977195cacd434...35d8bf5a42cd71edf4e2700b1e45f6c4b65f3fbe
       Apple workload packages 27.0.12211-net11-rc.2
     Mobile workloads are versioned independently of the VMR build in build-metadata.json.
-->
