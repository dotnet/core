# .NET MAUI in .NET 10 Preview 7 - Release Notes

Here's a summary of what's new in .NET MAUI in this preview release:

- .NET MAUI
  - [XAML Source Generator](#xaml-source-generator)
  - [MediaPicker EXIF Support](#mediapicker-exif-support)
  - [SafeArea Enhancements](#safearea-enhancements)
  - [Secondary Toolbar Items](#secondary-toolbar-items)
  - [New Control APIs](#new-control-apis)
  - [Deprecated API Removals](#deprecated-api-removals)
- [.NET for Android](#net-for-android)
- [.NET for iOS, Mac Catalyst, macOS, tvOS](#net-for-ios-mac-catalyst-macos-tvos)

.NET MAUI updates in .NET 10:

- [What's new in .NET MAUI in .NET 10](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-10) documentation.

## XAML Source Generator

.NET MAUI now includes a source generator for XAML that improves build performance and enables better tooling support. This generator creates strongly-typed code for your XAML files at compile time, reducing runtime overhead and providing better IntelliSense support.

The source generator decorates generated types with the `[Generated]` attribute for better tooling integration and debugging support.

To enable XAML source generation, opt-in to preview features and then decorate your C# with the `XamlProcessing` directive.

```xml
<PropertyGroup>
  <EnablePreviewFeatures>true</EnablePreviewFeatures>
</PropertyGroup>
```

```csharp
[assembly: XamlProcessing(XamlInflator.SourceGen)]
namespace MyApp;
```

## MediaPicker EXIF Support

The `MediaPicker` now automatically handles EXIF information when working with images:

- **Auto-rotate images**: Images are automatically rotated based on their EXIF orientation data
- **Preserve EXIF information**: Original EXIF metadata is preserved when using MediaPicker

This ensures that images appear correctly oriented regardless of how they were captured or stored on the device.

## SafeArea Enhancements

This release introduces significant improvements to SafeArea management:

- **Enhanced SafeAreaEdges control**: Improved `SafeAreaEdges` property with refined `SafeAreaRegions` enum for precise safe area behavior control
- **iOS SafeArea fixes**: Resolved issues with SafeArea management on iOS, including extra bottom space in ScrollView when using SafeAreaEdges
- **Improved defaults**: Fixed safe area defaults to provide more consistent behavior across platforms

The `SafeAreaEdges` property is available on these controls:

- **Layout**: Base layout class (inherited by `Grid`, `StackLayout`, `AbsoluteLayout`, `FlexLayout`, etc.)
- **ContentView**: Content view container
- **ContentPage**: Main page type
- **Border**: Border control
- **ScrollView**: Scrollable content container

The `SafeAreaRegions` enum provides granular control over safe area behavior:

```csharp
public enum SafeAreaRegions
{
    None = 0,          // Edge-to-edge content (no safe area padding)
    SoftInput = 1,     // Always pad for keyboard/soft input
    Container = 2,     // Flow under keyboard, stay out of bars/notch  
    Default = 4,       // Platform default behavior
    All = int.MaxValue // Obey all safe area insets
}

// Usage examples
<ContentPage SafeAreaEdges="Container">
    <!-- Content flows under keyboard but respects bars/notch -->
</ContentPage>

<ScrollView SafeAreaEdges="None">
    <!-- Edge-to-edge scrolling content -->
</ScrollView>

<Grid SafeAreaEdges="SoftInput">
    <!-- Grid respects keyboard but not other safe areas -->
</Grid>
```

## Secondary Toolbar Items

iOS and macOS now support secondary toolbar items, providing better alignment with platform conventions:

- **Modern iOS pattern**: Uses iOS 13+ APIs with pull-down menu design following iOS Human Interface Guidelines
- **Automatic detection**: Toolbar items with `Order="Secondary"` are automatically grouped into a secondary menu
- **Priority ordering**: Items are ordered within the secondary menu based on their `Priority` property
- **Platform positioning**: Menu appears on the far right (or left when RTL is enabled)
- **Customizable icon**: Developers can override the default ellipsis icon through a protected virtual method

```xml
<ContentPage.ToolbarItems>
    <!-- Primary toolbar items appear directly in the toolbar -->
    <ToolbarItem Text="Save" Order="Primary" Priority="0" />
    <ToolbarItem Text="Edit" Order="Primary" Priority="1" />
    
    <!-- Secondary toolbar items appear in the overflow menu -->
    <ToolbarItem Text="Share" Order="Secondary" Priority="0" />
    <ToolbarItem Text="Delete" Order="Secondary" Priority="1" />
    <ToolbarItem Text="Settings" Order="Secondary" Priority="2" />
</ContentPage.ToolbarItems>
```

The secondary items are grouped into a pull-down menu with the system ellipsis icon (`UIImage.GetSystemImage("ellipsis.circle")`) by default. When the menu is opened and an item's properties change, the menu automatically rebuilds and closes to reflect the updates.

## New Control APIs

Several new APIs have been added to improve control functionality:

- **Picker controls**: New "Open/Close" API for programmatically controlling picker state
- **SearchHandler**: Added API to hide or show the soft keyboard when using SearchHandler
- **Vibration and HapticFeedback**: New `IsSupported` API to check platform support
- **Windows**: Added API to enable/disable minimize and maximize buttons on Windows
- **Shell navigation**: Added `Shell.SetNavBarVisibilityAnimationEnabled` property for controlling navigation bar visibility animations
- **TabbedPageManager**: Made TabbedPageManager public for advanced customization scenarios
- **StackNavigationManager**: Exposed public APIs for StackNavigationManager on Android

## Deprecated API Removals

As part of .NET 10, several deprecated APIs have been removed:

- **Accelerator class**: Removed from Microsoft.Maui.Controls
- **ClickGestureRecognizer**: Removed in favor of `TapGestureRecognizer`
- **Page.IsBusy**: Marked as obsolete
- **Compatibility.Layout**: removed dependency

## Control and Layout Improvements

This release includes numerous fixes and improvements across controls and layouts.

## .NET for Android

This release includes continued integration with multiple .NET runtimes, and several bug fixes:

- Add `$(EnableDiagnostics)` cross-platform MSBuild property, to align with iOS and WASM.
- Fixe an issue with `=` symbol in Android environment variables.
- Fixed an issue where certain Java libraries were not redistributed in NuGet packages.
- Add support for API 36 in various Visual Studio dropdowns & menus.
- Changes to the "Java GC Bridge" to support multiple runtimes.

A detailed list can be found on the [dotnet/android GitHub releases](https://github.com/dotnet/android/releases/).

## .NET for iOS, Mac Catalyst, macOS, tvOS

This release includes Xcode 26 Beta 4 support for targeting .NET 9. We will include builds for .NET 10 in a subsequent release. To use these new bindings, target `net9.0-ios26` and/or `net9.0-maccatalyst26` and include `<NoWarn>$(NoWarn);XCODE_26_0_PREVIEW</NoWarn>` in your project file.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0-ios26</TargetFramework>
    <NoWarn>$(NoWarn);XCODE_26_0_PREVIEW</NoWarn>
    <!-- rest of your configuration -->
  </PropertyGroup>
</Project>
```

> **Note** A current issues exists with `Shell` that prevents it from rendering on iOS 26. Other page types work.

Also in this release are significant improvements to binding generation, runtime performance, and API coverage:

- **New Binding Generator (RGen)**:
  - Enhanced source generator for better binding performance and maintainability
  - Added support for nested classes, categories, and constructors
  - Improved async method generation with proper Task-based patterns
  - Better memory management and semantic model usage
  - Support for strong dictionary properties and weak delegate patterns

- **Runtime and Interop Improvements**:
  - Reworked `NSObject` data storage to fix a crash
  - Enhanced P/Invoke handling and native library integration

- **API and Framework Updates**:
  - Fixed `CoreLocation` availability for macOS monitoring features
  - Enhanced `CoreText` font manager constants generation
  - Updated `StoreKit` by unmarking `AppStore` class as experimental
  - Fixed `CoreMedia` format description extensions and related APIs
  - Improved `Network` framework P/Invoke calls

- **Build and Tooling Enhancements**:
  - Better xcframework processing with improved diagnostics
  - Enhanced resource duplication detection
  - Better xml documentation generation for interfaces and protocols

- **Platform-Specific Fixes**:
  - Fixed `CVOpenGLESTexture` and `CVOpenGLESTextureCache` build integration
  - Resolved `AVFoundation` enum value locations
  - Enhanced `CoreImage` format convenience enum generation

A detailed list can be found on the [dotnet/macios GitHub releases](https://github.com/dotnet/macios/releases/) including a list of [Known issues](https://github.com/dotnet/macios/wiki/Known-issues-in-.NET10).

## Contributors

Thank you contributors! ❤️

[@Aguilex](https://github.com/Aguilex), [@Ahamed-Ali](https://github.com/Ahamed-Ali), [@albyrock87](https://github.com/albyrock87), [@anandhan-rajagopal](https://github.com/anandhan-rajagopal), [@bhavanesh2001](https://github.com/bhavanesh2001), [@Copilot](https://github.com/copilot-swe-agent), [@csigs](https://github.com/csigs), [@dotnet-bot](https://github.com/dotnet-bot), [@dotnet-maestro](https://github.com/dotnet-maestro), [@emaf](https://github.com/emaf), [@framinosona](https://github.com/framinosona), [@github-actions](https://github.com/github-actions), [@grendello](https://github.com/grendello), [@HarishKumarSF4517](https://github.com/HarishKumarSF4517), [@jfversluis](https://github.com/jfversluis), [@jonathanpeppers](https://github.com/jonathanpeppers), [@jonpryor](https://github.com/jonpryor), [@jsuarezruiz](https://github.com/jsuarezruiz), [@kubaflo](https://github.com/kubaflo), [@LogishaSelvarajSF4525](https://github.com/LogishaSelvarajSF4525), [@mandel-macaque](https://github.com/mandel-macaque), [@mattleibow](https://github.com/mattleibow), [@MichalStrehovsky](https://github.com/MichalStrehovsky), [@morning4coffe-dev](https://github.com/morning4coffe-dev), [@NafeelaNazhir](https://github.com/NafeelaNazhir), [@NanthiniMahalingam](https://github.com/NanthiniMahalingam), [@NirmalKumarYuvaraj](https://github.com/NirmalKumarYuvaraj), [@nivetha-nagalingam](https://github.com/nivetha-nagalingam), [@pictos](https://github.com/pictos), [@praveenkumarkarunanithi](https://github.com/praveenkumarkarunanithi), [@PureWeen](https://github.com/PureWeen), [@rmarinho](https://github.com/rmarinho), [@rolfbjarne](https://github.com/rolfbjarne), [@sheiksyedm](https://github.com/sheiksyedm), [@simonrozsival](https://github.com/simonrozsival), [@StephaneDelcroix](https://github.com/StephaneDelcroix), [@SyedAbdulAzeemSF4852](https://github.com/SyedAbdulAzeemSF4852), [@Tamilarasan-Paranthaman](https://github.com/Tamilarasan-Paranthaman), [@TamilarasanSF4853](https://github.com/TamilarasanSF4853), [@Vignesh-SF3580](https://github.com/Vignesh-SF3580), [@VitalyKnyazev](https://github.com/VitalyKnyazev), [@vs-mobiletools-engineering-service2](https://github.com/vs-mobiletools-engineering-service2)
