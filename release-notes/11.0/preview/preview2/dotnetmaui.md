# .NET MAUI in .NET 11 Preview 2 - Release Notes

Here's a summary of what's new in .NET MAUI, .NET for Android, and .NET for iOS, Mac Catalyst, macOS, and tvOS in this Preview 2 release:

- .NET MAUI
  - [Map control improvements](#map-control-improvements)
  - [TypedBinding performance improvements](#typedbinding-performance-improvements)
  - [Immutability annotations for Color and Font](#immutability-annotations-for-color-and-font)
  - [VisualStateManager API consistency](#visualstatemanager-api-consistency)
  - [Fix for empty string binding to nullable value types](#fix-for-empty-string-binding-to-nullable-value-types)
- .NET for Android
  - [Fixes and improvements to `dotnet run`](#fixes-and-improvements-to-dotnet-run)
  - [Use response files when calling `r8.jar`](#use-response-files-when-calling-r8jar)
  - [CoreCLR now requires API 24 and higher](#coreclr-on-android-requires-api-24-or-higher)
  - [JNI preload exemption support](#jni-preload-exemption-support)
- .NET for iOS
  - [(Experimental) CoreCLR](#experimental-coreclr)

.NET MAUI updates in .NET 11:

- [What's new in .NET MAUI in .NET 11](https://learn.microsoft.com/dotnet/maui/whats-new/) documentation.

## Map control improvements

Preview 2 brings a significant set of improvements to the Map control, making it more capable and easier to use in XAML.

### XAML TypeConverters for map coordinates

New `TypeConverter` implementations for `Location` and `MapSpan` enable concise XAML syntax for map coordinates, eliminating the need for verbose `x:Arguments` markup. A new `Map.Region` bindable property lets you set the map's initial region declaratively in XAML ([dotnet/maui#33995](https://github.com/dotnet/maui/pull/33995)).

```xaml
<maps:Map x:Name="map" Region="36.9628,-122.0195,0.01,0.01">
    <maps:Map.Pins>
        <maps:Pin Label="Santa Cruz" Location="36.9628,-122.0195" />
    </maps:Map.Pins>
</maps:Map>
```

### MapElement visibility and draw order

All map elements (Polygon, Polyline, Circle) now support `IsVisible` and `ZIndex` properties, enabling visibility toggling and draw-order control without removing elements from the map ([dotnet/maui#33993](https://github.com/dotnet/maui/pull/33993)).

```csharp
polygon.IsVisible = false; // Hide without removing
polygon.ZIndex = 10;       // Control draw order
```

### Map element click events

Circle, Polygon, and Polyline elements now support click events on Android and iOS/Mac Catalyst, enabling interactive map overlays ([dotnet/maui#29101](https://github.com/dotnet/maui/pull/29101)).

```csharp
circle.CircleClicked += (s, e) =>
{
    DisplayAlert("Circle Clicked", "You clicked the circle!", "OK");
};

polygon.PolygonClicked += (s, e) =>
{
    DisplayAlert("Polygon Clicked", "You clicked the polygon!", "OK");
};

polyline.PolylineClicked += (s, e) =>
{
    DisplayAlert("Polyline Clicked", "You clicked the polyline!", "OK");
};
```

## TypedBinding performance improvements

`TypedBinding` and `SourceGeneratedBinding` are now approximately 29% faster with 50% less memory allocation per binding operation. These optimizations include delegate caching, binding mode caching, and skipping unnecessary type conversions ([dotnet/maui#33656](https://github.com/dotnet/maui/pull/33656)).

| Binding type | .NET 10 | .NET 11 Preview 2 | Improvement |
|---|---|---|---|
| TypedBinding | 47.47 ns / 128 B | 32.90 ns / 64 B | 31% faster, 50% less memory |
| SourceGeneratedBinding | 45.45 ns / 128 B | 34.10 ns / 64 B | 25% faster, 50% less memory |

## Immutability annotations for Color and Font

`Color` is now annotated with `[ImmutableObject(true)]` and `Font` is now a `readonly struct`. These changes formalize existing immutability guarantees and enable the XAML Source Generator to make better optimization decisions, such as safely caching instances and generating more efficient code paths ([dotnet/maui#33824](https://github.com/dotnet/maui/pull/33824)).

## VisualStateManager API consistency

`VisualStateManager.GetVisualStateGroups` now returns `VisualStateGroupList` instead of `IList<VisualStateGroup>`, matching the parameter type of `SetVisualStateGroups`. This is a **breaking change** for code explicitly typed to `IList<VisualStateGroup>` ([dotnet/maui#33849](https://github.com/dotnet/maui/pull/33849)).

## Fix for empty string binding to nullable value types

When binding `Entry.Text` to a nullable value type property (e.g., `int?`), clearing the Entry now correctly sets the property to `null` instead of retaining the previous value. This long-standing issue affected two-way bindings to nullable types ([dotnet/maui#33536](https://github.com/dotnet/maui/pull/33536)).

## Fixes and improvements to `dotnet run`

When selecting a device during `dotnet run`, the selection was not properly passed through to all MSBuild steps. ([dotnet/android#10740](https://github.com/dotnet/android/pull/10740))

## Use response files when calling `r8.jar`

Complex Android projects can hit [the maximum command-line length](https://learn.microsoft.com/troubleshoot/windows-client/shell-experience/command-line-string-limitation) on Windows. A "response file" is used now to avoid this problem ([dotnet/android#10716](https://github.com/dotnet/android/pull/10716)).

## CoreCLR on Android requires API 24 or higher

Various crashes can occur on API 21-23 devices when using the CoreCLR runtime, so we have prevented its usage. We are still evaluating if CoreCLR should support older API levels. Mono will continue to support API 21 and up. ([dotnet/android#10753](https://github.com/dotnet/android/pull/10753))

## JNI preload exemption support

[.NET 10](https://github.com/dotnet/android/commit/cba39dcf723b0b0311a050533bd7e2d45facdff5) introduced support for preloading of JNI native libraries at application startup. Applications that need to control native library loading order can now exempt specific libraries from JNI preload. Set `$(AndroidIgnoreAllJniPreload)` to `true` to disable preloading for all JNI libraries, or use the `AndroidNativeLibraryNoJniPreload` item group to exempt individual libraries ([dotnet/android#10787](https://github.com/dotnet/android/pull/10787)).

```XML
<ItemGroup>
  <AndroidNativeLibraryNoJniPreload Include="libMyLibrary.so" />
</ItemGroup>
```

## (Experimental) CoreCLR

Enables iOS apps to run on the CoreCLR runtime (instead of Mono). To use it, add the following to your project file for iOS builds:

```XML
<!-- Use CoreCLR on iOS -->
<PropertyGroup Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'ios'">
    <UseMonoRuntime>false</UseMonoRuntime>
</PropertyGroup>
```

Please try this in your applications and report any issues; when filing feedback, state that you are using UseMonoRuntime=false. Expect that application size is currently larger than with Mono and that debugging and some runtime diagnostics are not fully functional yet; these areas are actively being improved. This is an experimental feature and not intended for production use.

A detailed list of iOS changes can be found on the [dotnet/macios GitHub releases](https://github.com/dotnet/macios/releases/).

## Contributors

Thank you contributors! ❤️

[@grendello](https://github.com/grendello), [@jfversluis](https://github.com/jfversluis), [@jonathanpeppers](https://github.com/jonathanpeppers), [@jonpryor](https://github.com/jonpryor), [@kubaflo](https://github.com/kubaflo), [@mattleibow](https://github.com/mattleibow), [@sbomer](https://github.com/sbomer), [@simonrozsival](https://github.com/simonrozsival), and [@StephaneDelcroix](https://github.com/StephaneDelcroix).
