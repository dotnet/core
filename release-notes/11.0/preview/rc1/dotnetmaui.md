# .NET MAUI in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 includes new .NET MAUI controls, asset-processing options, and
platform behavior:

- [TabbedPage badges](#tabbedpage-badges)
- [Themed splash screens](#themed-splash-screens)
- [Explicit SwipeItem colors](#explicit-swipeitem-colors)
- [Opt-in BlazorWebView static content caching](#opt-in-blazorwebview-static-content-caching)
- [Configurable Resizetizer quality](#configurable-resizetizer-quality)
- [Android system bars can follow MAUI chrome](#android-system-bars-can-follow-maui-chrome)
- [FlyoutPage adopts handlers on Apple platforms](#flyoutpage-adopts-handlers-on-apple-platforms)
- [Breaking changes](#breaking-changes)

<!-- TODO: Before publication, confirm that the final public RC1 workload
     manifest selects MAUI package 11.0.0-preview.7.26427.15 or a later build
     from release/11.0.1xx-rc1. The package currently available in the dotnet11
     build feed identifies RC1 branch commit
     a5fbdc1f8df3395c47665b9413fa1f59f109b71c, which contains every change
     documented below. The package still carries a preview.7 version label, so
     this evidence establishes branch/package contents but not final public
     workload promotion. -->

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
badge colors instead of custom colors even though MAUI uses the supported
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

MAUI uses a bounded per-WebView cache on Android, iOS, Mac Catalyst, Windows,
and Tizen. It doesn't cache authenticated, range, non-`GET`, or `no-store`
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

## Android system bars can follow MAUI chrome

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
