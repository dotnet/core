# .NET MAUI in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 lands a coordinated wave of extension points for third-party
platform backends, continues the handler-architecture migration on Apple
platforms, and expands the XAML tooling for AOT and Hot Reload:

- [Third-party platform backend extensibility](#third-party-platform-backend-extensibility)
- [TabbedPage handler architecture on iOS and Mac Catalyst](#tabbedpage-handler-architecture-on-ios-and-mac-catalyst)
- [XAML Incremental Hot Reload (opt-in preview)](#xaml-incremental-hot-reload-opt-in-preview)
- [AOT-safe RelativeSource bindings from the XAML source generator](#aot-safe-relativesource-bindings-from-the-xaml-source-generator)
- [Platform enhancements](#platform-enhancements)
- [Trimming and Community Toolkit cleanup](#trimming-and-community-toolkit-cleanup)
- [.NET for Android](#net-for-android)
- [Apple platforms (.NET for iOS, Mac Catalyst, macOS, tvOS)](#apple-platforms-net-for-ios-mac-catalyst-macos-tvos)
- [Contributors](#contributors)

.NET MAUI updates in .NET 11:

- [What's new in .NET MAUI in .NET 11](https://learn.microsoft.com/dotnet/maui/whats-new/)

## Third-party platform backend extensibility

.NET MAUI's programming model has historically assumed a fixed set of
first-party platform backends (Android, iOS, Mac Catalyst, macOS, Tizen,
Windows). Preview 7 lands a coordinated set of extension points from the
platform-extensibility epic
([dotnet/maui #34099](https://github.com/dotnet/maui/issues/34099)) that let
third-party or community backends — for example a Linux/GTK head — plug into
the same MSBuild, DI, and handler machinery the built-in platforms use,
without patching MAUI itself.

- **XAML `OnPlatform` recognizes GTK, macOS, and WPF.** The `GTK`, `macOS`, and
  `WPF` properties on `OnPlatformExtension` are now public, so the inline
  `{OnPlatform GTK=..., macOS=..., WPF=...}` markup-extension form works for
  external backends. The `OnPlatform<T>` element form remains the route for
  arbitrary platform strings such as `Web`
  ([dotnet/maui #35901](https://github.com/dotnet/maui/pull/35901)).
- **Public `IAlertManager` extension points.**
  `Microsoft.Maui.Controls.Platform.IAlertManager` and
  `IAlertManagerSubscription` are public on `net11.0` so custom platform
  backends can host alerts, action sheets, and prompts. They were originally
  introduced in .NET 10 and reverted to internal for servicing; the interface
  signatures and runtime behavior are unchanged from the .NET 10 shape
  ([dotnet/maui #36633](https://github.com/dotnet/maui/pull/36633)).
- **Custom `BlazorWebView` handlers.**
  `IMauiBlazorWebViewBuilder.UsePlatformHandler<THandler>()` and its factory
  overload let a third-party backend replace the default `BlazorWebViewHandler`
  while keeping every service registered by `AddMauiBlazorWebView()` — JSInterop,
  navigation, static assets, and the rest. Handlers implement the new
  `IBlazorWebViewHandler` capability interface so shared code no longer
  hard-casts to the built-in handler
  ([dotnet/maui #36658](https://github.com/dotnet/maui/pull/36658)).

  ```csharp
  builder.Services
      .AddMauiBlazorWebView()
      .UsePlatformHandler<GtkBlazorWebViewHandler>();
  ```

- **Resizetizer external backends.** A new MSBuild contract —
  `ResizetizerPlatformType`, `MauiProcessedImage`/`MauiProcessedFont`/`MauiProcessedAsset`,
  and `ResizetizerAfter{Image,Font,Asset}ProcessingTargets` — lets an
  out-of-tree backend opt into image, font, and asset processing without
  teaching MAUI about its platform
  ([dotnet/maui #36653](https://github.com/dotnet/maui/pull/36653)).
- **SingleProject neutral-TFM backends.** External backends can register
  through the existing `MauiPlatformSpecificFolder` item and activate for
  either a recognized platform TFM or a plain `net11.0` inner build by opting
  in with a selector property (default `MauiActiveBackend`)
  ([dotnet/maui #36654](https://github.com/dotnet/maui/pull/36654)).

  ```xml
  <PropertyGroup>
    <TargetFrameworks>net11.0-ios;net11.0</TargetFrameworks>
    <MauiActiveBackend Condition=" '$(TargetFramework)' == 'net11.0' ">gtk</MauiActiveBackend>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Platform.Maui.Linux.Gtk4" Version="..." />
  </ItemGroup>
  ```

- **`GestureManager` factory is public.** The `Microsoft.Maui.Controls`
  `GestureManager` exposes a public factory, and the built-in gesture manager
  now skips incompatible handlers instead of throwing, so a third-party backend
  can register its own gesture manager without breaking apps that mix it with
  the built-in handlers
  ([dotnet/maui #36655](https://github.com/dotnet/maui/pull/36655)).

Individually these are small; together they are the difference between a
community backend being a fork and a community backend being a NuGet package.

## TabbedPage handler architecture on iOS and Mac Catalyst

`TabbedPage` on iOS and Mac Catalyst is re-implemented on top of the standard
handler architecture. The monolithic `TabbedRenderer` — a single ~600-line
class that *was* a `UITabBarController` — is replaced by a layered
`TabbedViewHandler` plus a shared `TabBarControllerManager` in
`Microsoft.Maui.Core`
([dotnet/maui #36507](https://github.com/dotnet/maui/pull/36507)). The new
handler is the unconditional default on iOS and Mac Catalyst; the runtime
feature switch and MSBuild opt-in used during development have been removed.
`TabbedRenderer` itself is unchanged and remains in the Compatibility layer as
a manual fallback.

Together with the earlier Android Shell handler work, this continues the
effort to converge every control on the same handler pattern across every
platform. Apps that use `TabbedPage` heavily on iOS or Mac Catalyst are the
primary audience to try this preview against.

## XAML Incremental Hot Reload (opt-in preview)

Preview 7 introduces **XAML Incremental Hot Reload (XIHR)**: a Roslyn source
generator plus a `[MetadataUpdateHandler]` runtime that lets XAML edits update
already-instantiated pages *without rebuilding the app*
([dotnet/maui #34338](https://github.com/dotnet/maui/pull/34338)). When you
edit a XAML file, the generator emits a per-version patch method
(`UpdateComponent`), and the runtime dispatches it against every live instance
of the affected page, advancing each instance through its accumulated patch
chain. The generator handles property changes, child add/remove, structural
reorders, attached properties, markup extensions, bindings, and
`ResourceDictionary` updates.

XIHR is **off by default** in this preview and gated by a runtime feature
switch, so trimmed and AOT production builds pay no cost
([dotnet/maui #36832](https://github.com/dotnet/maui/pull/36832)). To try it in
Debug, opt in per project:

```xml
<PropertyGroup>
  <EnableMauiIncrementalHotReload>true</EnableMauiIncrementalHotReload>
</PropertyGroup>
```

When the switch is off, the existing legacy XAML Hot Reload path is used, so
nothing changes for existing apps.

## AOT-safe RelativeSource bindings from the XAML source generator

The XAML source generator now compiles `{RelativeSource AncestorType=...}`
bindings to a trim-safe `TypedBinding<TAncestor, TProperty>` when the ancestor
type is resolvable at compile time
([dotnet/maui #34408](https://github.com/dotnet/maui/pull/34408), resolving
[dotnet/maui #34056](https://github.com/dotnet/maui/issues/34056)).

```xaml
<ContentPage x:DataType="local:PageViewModel">
    <Label Text="{Binding Title,
                          Source={RelativeSource AncestorType={x:Type local:PageViewModel}}}" />
</ContentPage>
```

Previously the compiler routed every explicit-source binding to the string-based
`Binding(string, ...)` constructor — a `[RequiresUnreferencedCode]` API that
could be trimmed away in AOT Release builds. The generator now recognizes the
ancestor type and emits a compiled binding, using ambient `x:DataType` only for
bindings whose source is genuinely unknown (`Self`, `TemplatedParent`,
unresolved ancestor sources, and `x:Reference`, which continue to fall back to
the runtime path).

A related follow-up silences a false-positive `MAUIG2045` diagnostic that the
new `RelativeSource AncestorType` analyzer produced on unsealed ancestor types
([dotnet/maui #36905](https://github.com/dotnet/maui/pull/36905)).

## Platform enhancements

- **Windows `Border` keyboard tap.** A `Border` with a single-tap,
  primary-button `TapGestureRecognizer` is now keyboard actionable on Windows:
  `ContentPanel.IsTabStop` is set to `true`, and pressing **Enter** or
  **Space** while the `Border` has focus invokes the gesture through
  `SendTapped`. This matches the existing Android keyboard-tap behavior
  ([dotnet/maui #35578](https://github.com/dotnet/maui/pull/35578)).
- **Windows single-instance activation.** MAUI apps on Windows expose an
  `AppInstance` activation lifecycle hook and support redirecting external
  activations to the running instance, which also enables `WebAuthenticator`
  callbacks in single-instance apps
  ([dotnet/maui #36640](https://github.com/dotnet/maui/pull/36640)).
- **Android Material 3 Slider events.** The Material 3 Slider handler
  subscribes to Android's native `Change`, `StartTrackingTouch`, and
  `StopTrackingTouch` events directly instead of relying on a touch-event
  workaround, so `ValueChanged`, `DragStarted`, and `DragCompleted` all fire
  correctly and the floating-label workaround is gone
  ([dotnet/maui #36448](https://github.com/dotnet/maui/pull/36448)).

## Trimming and Community Toolkit cleanup

Preview 7 finishes a set of long-running cleanups that unblock trim-safe apps
and prepare for the .NET 11 Community Toolkit.

- All `InternalsVisibleTo` grants for the .NET MAUI Community Toolkit
  (`CommunityToolkit.Maui`, `.Core`, `.Markup`, and their `.UnitTests`
  assemblies) are removed from `Microsoft.Maui.Core`,
  `Microsoft.Maui.Controls`, `Microsoft.Maui.Controls.Xaml`, and
  `Microsoft.Maui.Essentials` — 22 declarations in total
  ([dotnet/maui #34070](https://github.com/dotnet/maui/pull/34070)). This has
  been attempted twice before and reverted because the toolkit had not yet
  migrated off the internal APIs; making the change in `net11.0` gives the
  toolkit a full release window to migrate.
- The `_MauiFixTrimmerRootAssemblyMetadata` workaround target and the
  corresponding `RootMode="All"` `TrimmerRootAssembly` entries are removed
  from the AOT test templates
  ([dotnet/maui #34519](https://github.com/dotnet/maui/pull/34519)).
- The remaining conversion helpers in `Microsoft.Maui.Controls` are annotated
  for trim safety, so they no longer produce trim/AOT warnings when used from
  a fully trimmed app
  ([dotnet/maui #30875](https://github.com/dotnet/maui/pull/30875)).

## .NET for Android

.NET for Android Preview 7 is dominated by CoreCLR host work and the
trimmable-typemap migration.

The **trimmable typemap is now the default typemap for NativeAOT**
([dotnet/android #12121](https://github.com/dotnet/android/pull/12121)). The
reflection-based `managed` typemap is removed entirely
([dotnet/android #12134](https://github.com/dotnet/android/pull/12134)), so
`_AndroidTypeMapImplementation` now accepts only `llvm-ir` (Mono and CoreCLR)
and `trimmable` (NativeAOT). Under NativeAOT the R8 keep rules are extended
for custom `IJavaObject` types
([dotnet/android #12132](https://github.com/dotnet/android/pull/12132), which
emits a new `XA4212` diagnostic), the trimmable ACW map preserves nested Java
class names
([dotnet/android #12187](https://github.com/dotnet/android/pull/12187)), and
`IGCUserPeer` methods are preserved through R8
([dotnet/android #12100](https://github.com/dotnet/android/pull/12100)).

CoreCLR gains two important assembly-store changes:

- **`dlopen()`-based assembly-store loading.** Instead of parsing the APK ZIP
  central directory and walking the wrapper `.so` ELF section headers by hand,
  the CoreCLR host makes the assembly-store payload a loadable section exposed
  through the exported `_assembly_store` dynamic symbol and asks the platform
  linker to `dlopen`/`dlsym` it. MonoVM is unchanged
  ([dotnet/android #12033](https://github.com/dotnet/android/pull/12033)).
- **On-device decompressed AssemblyStore cache** (opt-in). Setting
  `AndroidEnableAssemblyStoreDecompressionCache=true` on a CoreCLR Release
  build caches Zstd-decompressed assemblies under `codeCacheDir` so subsequent
  launches skip decompression and use file-backed mappings. The cache
  self-heals on checksum failure and rejects corrupted entries
  ([dotnet/android #11967](https://github.com/dotnet/android/pull/11967)).

`AndroidMessageHandler` continues to align with `SocketsHttpHandler`. `HEAD`
requests are preserved across `301`, `302`, and `303` redirects instead of
being coerced to `GET`
([dotnet/android #12102](https://github.com/dotnet/android/pull/12102)), and
disposing an `HttpResponseMessage` while a body read is still parked in okhttp
no longer crashes the process with an *Unbalanced enter/exit*
`IllegalStateException` — the response body's in-flight I/O is aborted first
([dotnet/android #12105](https://github.com/dotnet/android/pull/12105)). This
last fix matters most for gRPC server-streaming, which cancels by disposing
the response.

Finally, a new build-time diagnostic **`XA0132`** flags a missing Fast
Deployment package on device, so an incremental deploy against a device that
no longer has the shared runtime package produces an actionable error instead
of a runtime crash
([dotnet/android #12060](https://github.com/dotnet/android/pull/12060)).

## Apple platforms (.NET for iOS, Mac Catalyst, macOS, tvOS)

The Apple workloads' Preview 7 changes focus on completing the NativeAOT
compilation flow and tightening the MSBuild contract.

- **Skip ILLink completes for NativeAOT.** For .NET 11+ builds, the SDK no
  longer runs a redundant ILLink pass before ILC — ILC now receives the
  fully-prepared assemblies directly. This removes a whole assembly-modification
  step from NativeAOT builds
  ([dotnet/macios #26193](https://github.com/dotnet/macios/pull/26193)).
- **Native registrar generated after ILC for trimmable-static.** With the
  trimmable-static registrar, the generated native registrar code is now
  emitted after ILC has produced its output, so it can see the final trimmed
  managed surface
  ([dotnet/macios #26194](https://github.com/dotnet/macios/pull/26194)).
- **Diagnostic for post-ILC assembly modification.** A new NativeAOT
  build-time warning fires when a post-ILC step modifies a managed assembly —
  a common source of hard-to-diagnose runtime failures on NativeAOT — so
  custom tooling and third-party targets can be caught early
  ([dotnet/macios #26137](https://github.com/dotnet/macios/pull/26137)).
- **Missing Objective-C classes no longer break the link.** When
  `Class.GetHandle` is inlined and the target Objective-C class isn't present
  in the linked binary, MSBuild now emits a warning and lets the app link
  instead of failing the build; this backports to the `release/11.0.1xx-preview7`
  branch as [dotnet/macios #26347](https://github.com/dotnet/macios/pull/26347)
  ([dotnet/macios #26302](https://github.com/dotnet/macios/pull/26302)).
- **Invalid IL fix in generated `CreateObject` proxies for generic types.**
  The tooling that generates `CreateObject` proxies could emit invalid IL for
  generic types, breaking some binding scenarios; the generator now emits
  correct IL
  ([dotnet/macios #26100](https://github.com/dotnet/macios/pull/26100)).
- **`EnableCrashReport` MSBuild property.** A new
  `<EnableCrashReport>true</EnableCrashReport>` MSBuild property enables the
  .NET crash-report writer for iOS, Mac Catalyst, macOS, and tvOS apps
  ([dotnet/macios #26134](https://github.com/dotnet/macios/pull/26134)).
- **`rgen` UI namespace cache scoped per-compilation** eliminates a source of
  Roslyn generator flakiness for apps that reference UIKit / AppKit
  ([dotnet/macios #26187](https://github.com/dotnet/macios/pull/26187)).

See the full Preview 7 changelog for the complete list:
<https://github.com/dotnet/macios/compare/release/11.0.1xx-preview6...release/11.0.1xx-preview7>

## Contributors

Thank you contributors! ❤️

- [@baaaaif](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Abaaaaif)
- [@BagavathiPerumal](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ABagavathiPerumal)
- [@devanathan-vaithiyanathan](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Adevanathan-vaithiyanathan)
- [@Dhivya-SF4094](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ADhivya-SF4094)
- [@HarishKumarSF4517](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AHarishKumarSF4517)
- [@HarishwaranVijayakumar](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AHarishwaranVijayakumar)
- [@IlGalvo](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AIlGalvo)
- [@jpd21122012](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Ajpd21122012)
- [@KarthikRajaKalaimani](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AKarthikRajaKalaimani)
- [@kevin68](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Akevin68)
- [@LogishaSelvarajSF4525](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ALogishaSelvarajSF4525)
- [@NafeelaNazhir](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ANafeelaNazhir)
- [@NirmalKumarYuvaraj](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ANirmalKumarYuvaraj)
- [@pictos](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Apictos)
- [@prakashKannanSf3972](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AprakashKannanSf3972)
- [@praveenkumarkarunanithi](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3Apraveenkumarkarunanithi)
- [@Shalini-Ashokan](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AShalini-Ashokan)
- [@SubhikshaSf4851](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ASubhikshaSf4851)
- [@SyedAbdulAzeemSF4852](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ASyedAbdulAzeemSF4852)
- [@Tamilarasan-Paranthaman](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ATamilarasan-Paranthaman)
- [@TamilarasanSF4853](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3ATamilarasanSF4853)
- [@Vignesh-SF3580](https://github.com/dotnet/maui/pulls?q=is%3Apr+is%3Amerged+author%3AVignesh-SF3580)

<!-- Content derived from merged PRs on release/11.0.1xx-preview7 branches of
     dotnet/maui, dotnet/android, and dotnet/macios in the 2026-07-14 to
     2026-07-31 window. -->
