# .NET MAUI in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new .NET MAUI, .NET for Android, and .NET for iOS,
Mac Catalyst, macOS, and tvOS improvements:

- [Maps add clustering, styling, and richer interaction APIs](#maps-add-clustering-styling-and-richer-interaction-apis)
- [XAML and styling improvements reduce startup work and speed up iteration](#xaml-and-styling-improvements-reduce-startup-work-and-speed-up-iteration)
- [LongPressGestureRecognizer is now built into .NET MAUI](#longpressgesturerecognizer-is-now-built-into-net-maui)
- [Platform integration adds iOS notification permission support](#platform-integration-adds-ios-notification-permission-support)
- [.NET for Android adds Android 17 / API 37 preview support](#net-for-android-adds-android-17--api-37-preview-support)
- [.NET for Android improves CLI device discovery and deploy flow](#net-for-android-improves-cli-device-discovery-and-deploy-flow)
- [.NET for Apple workloads improve packaging and binding quality](#net-for-apple-workloads-improve-packaging-and-binding-quality)
- [Bug fixes](#bug-fixes)

.NET MAUI updates in .NET 11:

- [What's new in .NET MAUI in .NET 11](https://learn.microsoft.com/dotnet/maui/whats-new/)

## Maps add clustering, styling, and richer interaction APIs

The Map control gets a substantial wave of functionality in Preview 3,
including pin clustering, custom pin icons, custom JSON styling, long-click
handling, click events for circles, polygons, and polylines, overlay visibility
and Z-order control, programmatic info-window control, smoother region changes,
and richer user-location events
([dotnet/maui #29101](https://github.com/dotnet/maui/pull/29101),
[dotnet/maui #33831](https://github.com/dotnet/maui/pull/33831),
[dotnet/maui #33950](https://github.com/dotnet/maui/pull/33950),
[dotnet/maui #33982](https://github.com/dotnet/maui/pull/33982),
[dotnet/maui #33985](https://github.com/dotnet/maui/pull/33985),
[dotnet/maui #33792](https://github.com/dotnet/maui/pull/33792),
[dotnet/maui #33799](https://github.com/dotnet/maui/pull/33799),
[dotnet/maui #33991](https://github.com/dotnet/maui/pull/33991),
[dotnet/maui #33993](https://github.com/dotnet/maui/pull/33993)). These APIs
make it easier to build dense, interactive map experiences without falling back
to platform-specific implementations.

```xaml
<maps:Map IsClusteringEnabled="True"
          MapLongClicked="OnMapLongClicked">
    <maps:Pin Label="Seattle"
              Location="47.6062,-122.3321"
              ClusteringIdentifier="stores"
              ImageSource="store.png" />
</maps:Map>
```

## XAML and styling improvements reduce startup work and speed up iteration

XAML Source Generation now registers `ResourceDictionary` entries as factories
and inflates them on demand instead of materializing every style and brush at
page startup ([dotnet/maui #33826](https://github.com/dotnet/maui/pull/33826)).
Preview 3 also enables implicit XAML namespace declarations by default, adds
explicit APIs to reapply mutated styles and visual states during Hot Reload or
dynamic UI updates, and makes MAUI CSS trimmable when an app does not use
stylesheets, reducing unnecessary app size
([dotnet/maui #33834](https://github.com/dotnet/maui/pull/33834),
[dotnet/maui #34723](https://github.com/dotnet/maui/pull/34723),
[dotnet/maui #33160](https://github.com/dotnet/maui/pull/33160)).

```xaml
<ContentPage.Resources>
    <Style x:Key="PrimaryButtonStyle" TargetType="Button">
        <Setter Property="Padding" Value="12,8" />
    </Style>
</ContentPage.Resources>
```

## LongPressGestureRecognizer is now built into .NET MAUI

.NET MAUI now includes a built-in `LongPressGestureRecognizer` with duration,
movement-threshold, state-change, and command support across platforms
([dotnet/maui #33432](https://github.com/dotnet/maui/pull/33432)). This gives
press-and-hold interactions a first-party API instead of requiring toolkit
behaviors or custom handlers.

```xaml
<Image Source="avatar.png">
    <Image.GestureRecognizers>
        <LongPressGestureRecognizer
            MinimumPressDuration="750"
            Command="{Binding ShowContextMenuCommand}" />
    </Image.GestureRecognizers>
</Image>
```

## Platform integration adds iOS notification permission support

Preview 3 adds an implementation of the `PostNotifications` permission on iOS,
so apps can request notification authorization through the cross-platform
Permissions API instead of dropping to platform-specific code
([dotnet/maui #30132](https://github.com/dotnet/maui/pull/30132)).

```csharp
var status = await Permissions.RequestAsync<Permissions.PostNotifications>();
```

## .NET for Android adds Android 17 / API 37 preview support

.NET for Android Preview 3 aligns with Android 17 / API 37 previews so apps can
start validating against the upcoming platform now. Set
`net11.0-android37` together with `EnablePreviewFeatures` to opt into the new
target framework and platform APIs. This guidance comes from the official
Preview 3 Android release notes:
<https://github.com/dotnet/android/releases/tag/36.99.0-preview.3.10>.

```xml
<PropertyGroup>
  <TargetFramework>net11.0-android37</TargetFramework>
  <EnablePreviewFeatures>true</EnablePreviewFeatures>
</PropertyGroup>
```

## .NET for Android improves CLI device discovery and deploy flow

`dotnet run` can now list available emulators and auto-boot a selected AVD
before deployment, and Preview 3 also adds finer control over JNI native
library preloading when startup order matters
([dotnet/android #10826](https://github.com/dotnet/android/pull/10826),
[dotnet/android #10787](https://github.com/dotnet/android/pull/10787)). These
changes make CLI-first Android development less dependent on IDE-only device
management.

```xml
<PropertyGroup>
  <AndroidIgnoreAllJniPreload>true</AndroidIgnoreAllJniPreload>
</PropertyGroup>
```

## .NET for Apple workloads improve packaging and binding quality

Preview 3 improves Apple workload packaging by filtering static frameworks out
of post-processing so only frameworks that actually ship in the app bundle are
stripped and symbol-processed
([dotnet/macios #24845](https://github.com/dotnet/macios/pull/24845)). The
release branch also includes binding-quality work such as improved nullability
annotations for `NSArray` APIs
([dotnet/macios #24907](https://github.com/dotnet/macios/pull/24907)).

## Bug fixes

- **XAML** - duplicate implicit content assignments now produce clearer
  warnings, and XamlC respects `ObsoleteAttribute` messaging in generated
  diagnostics ([dotnet/maui #32654](https://github.com/dotnet/maui/pull/32654),
  [dotnet/maui #32946](https://github.com/dotnet/maui/pull/32946)).
- **Android** - fixed a GC live-lock issue that could surface during rapid UI
  switching ([dotnet/android #10856](https://github.com/dotnet/android/pull/10856)).
- **Apple packaging** - fixed app bundle post-processing and multi-RID publish
  handling for Apple workloads ([dotnet/macios #24845](https://github.com/dotnet/macios/pull/24845)).

## Contributors

Thank you contributors! ❤️

[@adamzip](https://github.com/adamzip), [@Ahamed-Ali](https://github.com/Ahamed-Ali),
[@csigs](https://github.com/csigs),
[@dalexsoto](https://github.com/dalexsoto), [@davidnguyen-tech](https://github.com/davidnguyen-tech),
[@grendello](https://github.com/grendello), [@Happypig375](https://github.com/Happypig375),
[@IeuanWalker](https://github.com/IeuanWalker), [@jfversluis](https://github.com/jfversluis),
[@jonathanpeppers](https://github.com/jonathanpeppers), [@jonpryor](https://github.com/jonpryor),
[@kotlarmilos](https://github.com/kotlarmilos), [@kubaflo](https://github.com/kubaflo),
[@mattleibow](https://github.com/mattleibow), [@NirmalKumarYuvaraj](https://github.com/NirmalKumarYuvaraj),
[@noiseonwires](https://github.com/noiseonwires), [@PureWeen](https://github.com/PureWeen),
[@rmarinho](https://github.com/rmarinho), [@rolfbjarne](https://github.com/rolfbjarne),
[@sbomer](https://github.com/sbomer), [@sheiksyedm](https://github.com/sheiksyedm),
[@simonrozsival](https://github.com/simonrozsival), and [@StephaneDelcroix](https://github.com/StephaneDelcroix).
