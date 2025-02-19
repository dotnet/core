# .NET MAUI in .NET 10 Preview 1 - Release Notes

This release was focused on quality improvements to .NET MAUI, .NET for Android, and .NET for iOS, Mac Catalyst, macOS, and tvOS. You can find detailed information about the improvements below:

- .NET MAUI
  - [GitHub Release Notes](https://aka.ms/maui10p1)
  - [CollectionView enhancements for iOS and Mac Catalyst](#collectionview-enhancements-for-ios-and-mac-catalyst)
- [.NET for Android](#net-for-android)
  - [Android 16 (Baklava) Beta 1](#android-16-baklava-beta-1)
  - [Minimum supported Android API recommendations](#updated-recommended-minimum-supported-android-api)
  - [Building with JDK-21 is now supported](#building-with-jdk-21-is-now-supported)
  - [`dotnet run` support for Androd projects](#support-for-dotnet-run-for-android)
  - [Enable marshal methods by default](#enable-marshal-methods-by-default)
  - [Visual Studio Design-Time Builds no longer invoke `aapt2`](#visual-studio-design-time-builds-no-longer-invoke-aapt2)
- [.NET for iOS, Mac Catalyst, macOS, tvOS](#net-for-ios-mac-catalyst-macos-tvos)
  - [Trimmer warnings enabled by default](#trimmer-warnings-enabled-by-default)
  - [Bundling original resources in libraries](#bundling-original-resources-in-libraries)

.NET MAUI updates in .NET 10:

- [What's new in .NET MAUI in .NET 10](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-10) documentation.

> **Known Issue:** building `net8.0-*` target frameworks with the .NET 10 SDK does not work in Preview 1.

## CollectionView enhancements for iOS and Mac Catalyst

Two new handlers for `CollectionView` and `CarouselView` on iOS and Mac Catalyst that brought performance and stability improvements were available optionally in [.NET 9](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-9?view=net-maui-9.0#collectionview-and-carouselview). In this release they are now on by default. 

You can _opt out_ of these handlers by adding the following code to your `MauiProgram` class if you want to revert back.

```csharp
#if IOS || MACCATALYST
builder.ConfigureMauiHandlers(handlers =>
{
    handlers.AddHandler<Microsoft.Maui.Controls.CollectionView, Microsoft.Maui.Controls.Handlers.Items.CollectionViewHandler>();
    handlers.AddHandler<Microsoft.Maui.Controls.CarouselView, Microsoft.Maui.Controls.Handlers.Items.CarouselViewHandler>();
});
#endif
```

We are excited for you to give these new handlers a try. As a reminder, if you have .NET 9 applications you can try them today with the following code:

```csharp
#if IOS || MACCATALYST
builder.ConfigureMauiHandlers(handlers =>
{
    handlers.AddHandler<Microsoft.Maui.Controls.CollectionView, Microsoft.Maui.Controls.Handlers.Items2.CollectionViewHandler2>();
    handlers.AddHandler<Microsoft.Maui.Controls.CarouselView, Microsoft.Maui.Controls.Handlers.Items2.CarouselViewHandler2>();
});
#endif
```

## .NET for Android

This release was focused on quality improvements. A detailed list can be found on [dotnet/android GitHub releases](https://github.com/dotnet/android/releases/).

### Android 16 (Baklava) Beta 1

Google has released [Beta 1](https://android-developers.googleblog.com/2025/01/first-beta-android16.html) of the Android 16 (API-36) SDK.  Support has been added for using these preview APIs.

To target the Android 16 preview API:
- Use the Android SDK Manager to download the Android 16 (Baklava) Platform
- Update your project's `TargetFramework` to `net10.0-android36`

### Updated Recommended Minimum Supported Android API

The .NET for Android project templates have been updated to specify `24` ("Nougat") as the default `$(SupportedOSPlatformVersion)` instead of `21` ("Lollipop").  This prevents users from hitting "desugaring" runtime crashes when using Java default interface methods.

While API-21 is still supported in .NET 10, we recommend updating existing projects to API-24 in order to avoid unexpected runtime errors.

> Note: See the main [GitHub pull request](https://github.com/dotnet/android/pull/9656) for more information.

### Building with JDK-21 is now supported 

.NET for Android projects can now be built with JDK-21.

### Support for `dotnet run` for Android

.NET for Android projects can now be run using `dotnet run`:

```cli
// Run on the only attached Android physical device
dotnet run -p:AdbTarget=-d

// Run on the only running Android emulator
dotnet run -p:AdbTarget=-e

// Run on the specified Android physical device or emulator
dotnet run -p:AdbTarget="-s emulator-5554"
```

The `AdbTarget` property is passed to the `adb` (Android Debug Bridge) command tool.

> Note: See the [GitHub pull request](https://github.com/dotnet/android/pull/9470) for more information.

### Enable marshal methods by default

A [new way](https://github.com/dotnet/android/pull/7351) of creating the marshal methods needed for Java calling into C# code is now enabled by default. Introduced in .NET 9, we have continued work to stabilize the implementation for .NET 10. This features improves application startup performance.

If you are getting a hang on startup on .NET 10 previews that you didn't see on .NET 9, try disabling marshal methods.  If this fixes the hang, please file an issue letting us know there are still issues with marshal methods.

```xml
<AndroidEnableMarshalMethods>false</AndroidEnableMarshalMethods>
```

### Visual Studio Design-Time Builds no longer invoke `aapt2`

For design-time builds, `aapt2` is no longer invoked; instead, the `.aar` files and underlying Android resources are parsed directly. This reduces the time of a Design-Time Build for some of our unit tests from over 2s to under 600ms.

## .NET for iOS, Mac Catalyst, macOS, tvOS

This release was focused on quality improvements. A details list can be found on [xamarin/xamarin-macios GitHub released](https://github.com/xamarin/xamarin-macios/releases/) including a list of [Known issues](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET10).

### Trimmer warnings enabled by default

In the past we've suppressed trimmer warnings, because the base class library produced trimmer warnings, which meant that it wouldn't be possible for developers to fix all the trimmer warnings.

However, in .NET 9 we believe we fixed all the trimmer warnings from our own code, so now we're ready to for developers to do the same, and thus we're enabling trimmer warnings by default.

This can be disabled, by adding this to the project file:

```xml
<PropertyGroup>
    <SuppressTrimAnalysisWarnings>true</SuppressTrimAnalysisWarnings>
</PropertyGroup>
```

Ref: https://github.com/xamarin/xamarin-macios/issues/21293

### Bundling original resources in libraries

Library projects can have various types of bundle resources (storyboards, xibs, property lists, png images, CoreML models, texture atlases, etc.), and they're bundled into the compiled library as embedded resources.

If any processing can be done (such as compiling storyboards or xibs, or optimizing property lists/png images, etc), this has historically been done before embedding, but this complicates library builds a lot, because this processing:

* Needs to run on a Mac, because compiling xibs/storyboards can only be done on a Mac.
* Needs Apple's toolchain around.
* Makes it impossible to do any decision-making based on the original resources when building the app.

So we've added opt-in support for embedding the original resource in libraries in .NET 9, and making it opt-out in .NET 10.

The default behavior can be changed in the project file like this:

```xml
<PropertyGroup>
    <BundleOriginalResources>false</BundleOriginalResources>
</PropertyGroup>
```

Ref: https://github.com/xamarin/xamarin-macios/issues/19028
