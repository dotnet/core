# .NET MAUI in .NET 10 Preview 4 - Release Notes

Here's a summary of what's new in .NET MAUI, .NET for Android, and .NET for iOS, Mac Catalyst, macOS, and tvOS in this preview release:

- .NET MAUI
  - [MediaPicker modernization](#mediapicker-modernization)
  - [Nullable Pickers](#nullable-pickers)  
- [.NET for Android](#net-for-android)
- [.NET for iOS, Mac Catalyst, macOS, tvOS](#net-for-ios-mac-catalyst-macos-tvos)

.NET MAUI updates in .NET 10:

- [What's new in .NET MAUI in .NET 10](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-10) documentation.

## MediaPicker Modernization

The Android and iOS implementations of `MediaPicker` for taking and picking photos have been updated to use the latest platform APIs when available thus providing the latest user experience. [#28920](https://github.com/dotnet/maui/pull/28920) [#24027](https://github.com/dotnet/maui/pull/24027)

## Nullable Pickers

Added nullable support to `DatePicker` ([#27921](https://github.com/dotnet/maui/pull/27921)) for `Date`, `MinimumDate`, and `MaximumDate` properties, and to `TimerPicker` ([#27930](https://github.com/dotnet/maui/pull/27930)) for the `Time` property.

## .NET for Android

This release was focused on quality improvements. A detailed list can be found on [dotnet/android GitHub releases](https://github.com/dotnet/android/releases/).

## .NET for iOS, Mac Catalyst, macOS, tvOS

This release was focused on quality improvements. A detailed list can be found on [dotnet/macios GitHub releases](https://github.com/dotnet/macios/releases/) including a list of [Known issues](https://github.com/dotnet/macios/wiki/Known-issues-in-.NET10).
