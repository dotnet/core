# .NET MAUI in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 includes a broader testing experience, faster and smaller Android
apps, new .NET MAUI controls, asset-processing options, and platform behavior:

- [Mobile and desktop testing with `dotnet test`](#mobile-and-desktop-testing-with-dotnet-test)
- [Faster Android builds](#faster-android-builds)
- [Smaller Android packages](#smaller-android-packages)
- [Faster Android startup with ReadyToRun](#faster-android-startup-with-readytorun)
- [TabbedPage badges](#tabbedpage-badges)
- [Themed splash screens](#themed-splash-screens)
- [Explicit SwipeItem colors](#explicit-swipeitem-colors)
- [Opt-in BlazorWebView static content caching](#opt-in-blazorwebview-static-content-caching)
- [Configurable Resizetizer quality](#configurable-resizetizer-quality)
- [Android system bars can follow .NET MAUI chrome](#android-system-bars-can-follow-net-maui-chrome)
- [Android devices wake before app launch](#android-devices-wake-before-app-launch)
- [FlyoutPage adopts handlers on Apple platforms](#flyoutpage-adopts-handlers-on-apple-platforms)
- [Breaking changes](#breaking-changes)

<!-- TODO: Before publication, confirm that the final public RC1 workload
     manifest selects .NET MAUI package 11.0.0-preview.7.26427.15 or a later build
     from release/11.0.1xx-rc1. The package currently available in the dotnet11
     build feed identifies RC1 branch commit
     a5fbdc1f8df3395c47665b9413fa1f59f109b71c, which contains every change
     documented below. The package still carries a preview.7 version label, so
     this evidence establishes branch/package contents but not final public
     workload promotion. -->

## Mobile and desktop testing with `dotnet test`

.NET 11 extends the familiar `dotnet test` workflow to Android, iOS, macOS, and
Mac Catalyst projects. Tests run in an app process on mobile devices or
simulators and on desktop targets
([dotnet/android #11130](https://github.com/dotnet/android/pull/11130),
[dotnet/macios #25320](https://github.com/dotnet/macios/pull/25320)).

The new MSTest-configured templates are `dotnet new androidtest`,
`dotnet new iostest`, `dotnet new macostest`, and
`dotnet new maccatalysttest`
([Android template](https://github.com/dotnet/android/pull/10862),
[Apple templates](https://github.com/dotnet/macios/pull/25195)). For example,
create and run an Android test project on a connected device or emulator:

```console
dotnet new androidtest -n MyTests
cd MyTests
dotnet test
```

![Running Android tests with dotnet test](media/dotnet-test-android.gif)

You can configure any
[Microsoft.Testing.Platform-supported test framework](https://learn.microsoft.com/dotnet/core/testing/#testing-tools)
instead. For example, configure NUnit:

```csharp
builder.ConfigureTestApplication(testApplication =>
    testApplication.AddNUnit(() => [GetType().Assembly]));
```

Instrumentation-only Android projects can also use `dotnet run` without
declaring an `Activity`. This enables headless on-device harnesses such as
BenchmarkDotNet and forwards arguments after `--` to the instrumentation
process
([dotnet/android #12261](https://github.com/dotnet/android/pull/12261)).

## Faster Android builds

Several Android build-pipeline changes reduce work in clean and incremental
builds. For a Release CoreCLR .NET MAUI sample-content app using trimmable type
maps, an ordinary managed source change improved from 68.32 to 52.31 seconds,
and an Android manifest change improved from 39.74 to 10.97 seconds. Repeated
no-op builds improved from 4.58 seconds to approximately 3.0-3.5 seconds
([dotnet/android #12229](https://github.com/dotnet/android/pull/12229)).

Type-map generation also improved from 3,204 to 792 milliseconds in a clean
CoreCLR .NET MAUI sample-content build
([dotnet/android #12279](https://github.com/dotnet/android/pull/12279)).

## Smaller Android packages

The Android trimmer now removes unused methods from user-defined
`IJavaObject` types while preserving the constructors and overrides that Java
can call. In the tested ARM64 .NET MAUI app, this reduced package size by
664,926 bytes without R8 and 718,174 bytes with R8. A minimal app was unchanged
([dotnet/android #12272](https://github.com/dotnet/android/pull/12272)).

## Faster Android startup with ReadyToRun

CoreCLR Release builds now include most methods from the app assembly in
partial ReadyToRun compilation. The basic .NET MAUI template started 19.8
milliseconds, or 2.4%, faster with a 65,536-byte package-size increase. The
sample-content template started 75.4 milliseconds, or 4.5%, faster with a
266,240-byte increase
([dotnet/android #12248](https://github.com/dotnet/android/pull/12248)).

.NET MAUI apps can also opt into full ReadyToRun compilation:

```xml
<PropertyGroup>
  <MauiEnableFullReadyToRun>true</MauiEnableFullReadyToRun>
</PropertyGroup>
```

Full compilation trades additional package size for startup performance. The
default remains partial ReadyToRun compilation
([dotnet/maui #37094](https://github.com/dotnet/maui/pull/37094),
[dotnet/android #12299](https://github.com/dotnet/android/pull/12299)).

## TabbedPage badges

`TabbedPage` children can display badge text, background color, and text color
through the `TabbedPage.BadgeText`, `TabbedPage.BadgeColor`, and
`TabbedPage.BadgeTextColor` attached properties
([dotnet/maui #37755](https://github.com/dotnet/maui/pull/37755)).

```xaml
<ContentPage
    Title="Inbox"
    TabbedPage.BadgeText="3"
    TabbedPage.BadgeColor="Red"
    TabbedPage.BadgeTextColor="White" />
```

Android, iOS, Mac Catalyst, and Windows support initial values and runtime
updates. On iOS and Mac Catalyst 18 or later, UIKit might render its system
badge colors instead of custom colors even though .NET MAUI uses the supported
per-item APIs.

## Themed splash screens

`MauiSplashScreen` supports separate images, colors, and tint colors for dark
mode. Android generates `night`-qualified resources. iOS, iPadOS, and Mac
Catalyst generate asset-catalog launch resources when the minimum supported OS
version is 14 or later
([dotnet/maui #35710](https://github.com/dotnet/maui/pull/35710)).

```xml
<MauiSplashScreen Include="Resources\Splash\splash.svg"
                  Color="#FFFFFF"
                  DarkFile="Resources\Splash\splash-dark.svg"
                  DarkColor="#000000"
                  DarkTintColor="#FFFFFF"
                  BaseSize="128,128" />
```

Projects without dark-mode metadata retain the existing splash-screen
behavior. Apple targets earlier than version 14 emit a warning and use the
existing fallback.

## Explicit SwipeItem colors

`SwipeItem.IconColor` explicitly tints an icon, and `SwipeItem.TextColor`
controls the label color. Both properties support `AppThemeBinding`
([dotnet/maui #36884](https://github.com/dotnet/maui/pull/36884)).

```xaml
<SwipeItem Text="Delete"
           IconImageSource="delete.svg"
           BackgroundColor="{AppThemeBinding Light=White, Dark=Black}"
           IconColor="{AppThemeBinding Light=Black, Dark=White}"
           TextColor="{AppThemeBinding Light=Black, Dark=White}" />
```

When `IconColor` isn't set, PNG, SVG, and other non-font images retain their
authored colors. Font icons continue to use their configured color and the
existing fallback behavior.

## Opt-in BlazorWebView static content caching

`BlazorWebView.StaticContentCacheControlProvider` can opt local static assets
into caching. Returning `null`, an empty string, or whitespace preserves the
existing `no-store` behavior
([dotnet/maui #35706](https://github.com/dotnet/maui/pull/35706)).

```csharp
blazorWebView.StaticContentCacheControlProvider = request =>
    request.ContentType.StartsWith("image/", StringComparison.Ordinal)
        ? "public, max-age=86400"
        : null;
```

.NET MAUI uses a bounded per-WebView cache on Android, iOS, Mac Catalyst,
Windows, and Tizen. It doesn't cache authenticated, range, non-`GET`, or `no-store`
requests.

Thank you [@Kebechet](https://github.com/Kebechet) for this contribution!

## Configurable Resizetizer quality

The new `ResizeQuality` metadata controls image sampling during Resizetizer
build tasks. `Auto` preserves the existing default, `Best` uses higher-quality
sampling, and `Fastest` uses nearest-neighbor sampling without mipmaps
([dotnet/maui #34559](https://github.com/dotnet/maui/pull/34559)).

```xml
<MauiImage Include="Resources\Images\photo.png" ResizeQuality="Best" />
<MauiImage Include="Resources\Images\pixel-art.png"
           ResizeQuality="Fastest" />
```

The setting applies to raster and SVG images, app icons, and splash assets.

## Android system bars can follow .NET MAUI chrome

Android apps can opt in to matching the status-bar and navigation-bar
backgrounds to the effective colors of `NavigationPage`, Shell, `TabbedPage`,
and modal chrome
([dotnet/maui #35463](https://github.com/dotnet/maui/pull/35463)).

```xml
<PropertyGroup>
  <MauiAndroidSystemBarsUseMauiChrome>true</MauiAndroidSystemBarsUseMauiChrome>
</PropertyGroup>
```

The option changes system-bar backgrounds only. Icon appearance remains under
app or theme control. The default is `false`, which preserves the existing
Android behavior.

## Android devices wake before app launch

When `dotnet run` starts an Android app on a connected device, it now wakes a
sleeping device and dismisses a non-secure keyguard before launching the app
([dotnet/android #12322](https://github.com/dotnet/android/pull/12322)).

## FlyoutPage adopts handlers on Apple platforms

`FlyoutPage` now uses `FlyoutViewHandler` by default on iOS and Mac Catalyst,
completing the Apple-platform handler migration for the primary multi-page
controls. The handler adds custom `FlyoutWidth` support and keeps flyout
subscriptions isolated between multiple page instances
([dotnet/maui #36676](https://github.com/dotnet/maui/pull/36676)).

Apps that depend on a custom `PhoneFlyoutPageRenderer` can register the
renderer explicitly:

```csharp
builder.ConfigureMauiHandlers(handlers =>
{
    handlers.AddHandler<FlyoutPage, MyCustomFlyoutPageRenderer>();
});
```

Thank you
[@Vignesh-SF3580](https://github.com/Vignesh-SF3580)
for this contribution!

## Breaking changes

- Non-font `SwipeItem` icons are no longer automatically recolored white or
  black to contrast with `BackgroundColor`. Set `IconColor` explicitly if an
  app relied on that .NET 10 behavior
  ([dotnet/maui #36884](https://github.com/dotnet/maui/pull/36884)).
- `FlyoutPage` uses `FlyoutViewHandler` instead of
  `PhoneFlyoutPageRenderer` by default on iOS and Mac Catalyst. Apps that
  subclassed or customized the renderer should register their renderer
  explicitly
  ([dotnet/maui #36676](https://github.com/dotnet/maui/pull/36676)).
