# .NET MAUI in .NET 10 RC 2 - Release Notes

Here's a summary of what's new in .NET MAUI in this RC 2 release:

- .NET MAUI
  - [Microphone permission](#microphone-permission)
  - [SafeAreaEdges](#safeareaedges)
  - [XAML Source Generation](#xaml-source-generation)
- [.NET for Android](#net-for-android)
  - [Android API 36.1](#android-api-36.1)  
- [.NET for iOS, Mac Catalyst, macOS, tvOS](#net-for-ios-mac-catalyst-macos-tvos)
  - [Xcode 26](#xcode-26)   

## Feature

Feature summary

.NET MAUI updates in .NET 10:

- [What's new in .NET MAUI in .NET 10](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-10) documentation.

## .NET MAUI

This release has been focused on stabilizing the SDK.

### Microphone permission

We have added the Windows implementation for `Permissions.RequestAsync<Permissions.Microphone>()` to request and check access permission for the device microphone.

### SafeAreaEdges

Support for `SafeAreaEdges` has been added to Android for supporting edge-to-edge and managing content relative to keyboard and unsafe areas of the device display.

### XAML Source Generation

This release includes improvements to XAML source generation with notable improvements to debug time view inflation. To enable this in your project add the following to your project file.

```xml
<PropertyGroup>
	<MauiXamlInflator>SourceGen</MauiXamlInflator>
</PropertyGroup>
```

## .NET for Android

This release includes continued integration with multiple .NET runtimes, and several bug fixes.

### Android API 36.1

Android API 36.1 bindings are now available thanks to the contribution and collaboration of the Uno Platform. 

### (Experimental) CoreCLR

We continue to work on enabling Android apps to run on the CoreCLR runtime (instead of Mono). To use it, add the following to your project file for Android builds:

```xml
<!-- Use CoreCLR on Android -->
<PropertyGroup Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'android'">
    <UseMonoRuntime>false</UseMonoRuntime>
</PropertyGroup>
```

Please try this in your applications and report any issues; when filing feedback, state that you are using UseMonoRuntime=false. Expect that application size is currently larger than with Mono and that debugging and some runtime diagnostics are not fully functional yet; these areas are actively being improved. This is an experimental feature and not intended for production use.

A detailed list of Android changes can be found on the [dotnet/android GitHub releases](https://github.com/dotnet/android/releases/).

## .NET for iOS, Mac Catalyst, macOS, tvOS

This release includes continued integration with multiple .NET runtimes, and several bug fixes.

### Xcode 26

Xcode 26 bindings have been updated and are available now for both for targeting .NET 9 and .NET 10 RC2. This is compatible with Xcdoe 26.0 and 26.1.

## Contributors

Thank you contributors! ❤️
