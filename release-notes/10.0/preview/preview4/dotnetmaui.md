# .NET MAUI in .NET 10 Preview 4 - Release Notes

Here's a summary of what's new in .NET MAUI, .NET for Android, and .NET for iOS, Mac Catalyst, macOS, and tvOS in this preview release:

- .NET MAUI
  - [MediaPicker modernization](#mediapicker-modernization)
  - [Nullable Pickers](#nullable-pickers)
  - [Known issues](#known-issues)
  - Full list of quality improvements on [dotnet/maui GitHub releases](https://github.com/dotnet/maui/releases/).
- [.NET for Android](#net-for-android)
  - [Use System.IO.Compression for `.apk` creation](#use-systemiocompression-for-apk-creation)
  - [Reduced download size](#reduced-download-size)
- [.NET for iOS, Mac Catalyst, macOS, tvOS](#net-for-ios-mac-catalyst-macos-tvos)

.NET MAUI updates in .NET 10:

- [What's new in .NET MAUI in .NET 10](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-10) documentation.

## MediaPicker Modernization

The Android and iOS implementations of `MediaPicker` for taking and picking photos have been updated to use the latest platform APIs when available thus providing the latest user experience. [#28920](https://github.com/dotnet/maui/pull/28920) [#24027](https://github.com/dotnet/maui/pull/24027)

## Nullable Pickers

Added nullable support to `DatePicker` ([#27921](https://github.com/dotnet/maui/pull/27921)) for `Date`, `MinimumDate`, and `MaximumDate` properties, and to `TimerPicker` ([#27930](https://github.com/dotnet/maui/pull/27930)) for the `Time` property.

## Known Issues

When building from Visual Studio you might need to force the `RoslynCompilerType` to be used by adding this property to your **csproj**. After making this change make sure to restart Visual studio.

```xml
<RoslynCompilerType>FrameworkPackage</RoslynCompilerType>
```

## .NET for Android

- [Use System.IO.Compression for `.apk` creation](#use-systemiocompression-for-apk-creation)
- [Reduced download size](#reduced-download-size)
- Full list of quality improvements on [dotnet/android GitHub releases](https://github.com/dotnet/android/releases/).

### Use System.IO.Compression for `.apk` creation

Historically, [dotnet/android-libzipsharp](https://github.com/dotnet/android-libzipsharp) was used to process ZIP archives and create `.aab` and `.apk` files.

For *command-line* `dotnet build` invocations, we now use [`System.IO.Compression.ZipArchive`](https://learn.microsoft.com/en-us/dotnet/api/system.io.compression.ziparchive?view=net-9.0) to create `.aab` and `.apk` files.  This should result in faster build times.

Builds from within Visual Studio continue to use dotnet/android-libzipsharp, as the .NET Framework version of System.IO.Compression cannot be used.

### Reduced Download Size

Previously, the Android workload installed a copy of `Mono.Android.dll` per architecture, even though the contents of each of these files were identical.

This duplication has been removed, saving nearly 100MB of download size (compressed) and even more when uncompressed on disk.

## .NET for iOS, Mac Catalyst, macOS, tvOS

This release was focused on quality improvements. A detailed list can be found on [dotnet/macios GitHub releases](https://github.com/dotnet/macios/releases/) including a list of [Known issues](https://github.com/dotnet/macios/wiki/Known-issues-in-.NET10).
