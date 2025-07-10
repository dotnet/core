# .NET MAUI in .NET 10 Preview 6 - Release Notes

Here's a summary of what's new in .NET MAUI, .NET for Android, and .NET for iOS, Mac Catalyst, macOS, and tvOS in this preview release:

- .NET MAUI
  - [MediaPicker Enhancements](#mediapicker-enhancements)
  - [WebView Request Interception](#webview-request-interception)
  - [Control and Layout Fixes](#control-and-layout-fixes)
- [.NET for Android](#net-for-android)
- [.NET for iOS, Mac Catalyst, macOS, tvOS](#net-for-ios-mac-catalyst-macos-tvos)

.NET MAUI updates in .NET 10:

- [What's new in .NET MAUI in .NET 10](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-10) documentation.

## MediaPicker Enhancements

The `MediaPicker` has been extended with support for selecting multiple files and compressing images directly from the API using `MaximumWidth` and `MaximumHeight` parameters.

```csharp
var result = await MediaPicker.PickMultipleAsync(new MediaPickerOptions
{
    MaximumWidth = 1024,
    MaximumHeight = 768
});
```

## WebView Request Interception

You can now intercept and respond to web requests made from `BlazorWebView` and `HybridWebView`. This allows for scenarios such as modifying headers, redirecting requests, or supplying local responses.

```csharp
webView.WebResourceRequested += (s, e) =>
{
    if (e.Uri.ToString().Contains("api/secure"))
    {
        e.Handled = true;
        e.SetResponse(200, "OK", "application/json", GetCustomStream());
    }
};
```

## Control and Layout Fixes

This release includes numerous fixes and improvements to controls and layout behavior:

- `CollectionView`, `CarouselView`, and `SearchBar` now behave more reliably across platforms, with improvements to selection updates, placeholder color updates, and memory management.
- A memory leak in `CarouselViewHandler2` on iOS has been resolved.
- Image resizing and layout adjustments are more accurate and efficient.
- The `Switch` control now uses the native default "on" color when `OnColor` is not set.
- Platform-specific bug fixes on Windows, Android, and iOS improve rendering, gestures, and accessibility behavior.

## .NET for Android

This release includes support for **Android API levels 35 and 36**, along with enhancements to interop performance, binary size reduction, and diagnostics:

- Updated to Android API 36 revision 2.\
  [PR #10168](https://github.com/dotnet/android/pull/10168)
- JNI interop improvements:
  - JNI handles are now wrapped in a control block for GC support in new runtimes.\
    [PR #10179](https://github.com/dotnet/android/pull/10179)
  - Caching of JNI-to-managed type mappings to enhance performance.\
    [PR #10170](https://github.com/dotnet/android/pull/10170)
  - Improved handling of foreign library p/invokes.\
    [PR #10165](https://github.com/dotnet/android/pull/10165)
- Diagnostics and profiling improvements:
  - Introduced `$(EnableDiagnostics)` MSBuild property (aka `$(AndroidEnableProfiler)`) to align with iOS and wasm.\
    [PR #10166](https://github.com/dotnet/android/pull/10166)
- New tests added using `Plugin.Maui.Audio` to validate plugin behavior.\
  [PR #10219](https://github.com/dotnet/android/pull/10219)

A detailed list can be found on the [dotnet/android GitHub releases](https://github.com/dotnet/android/releases/).

## .NET for iOS, Mac Catalyst, macOS, tvOS

This release includes updates to Apple platform SDKs aligned with Xcode 16.4 and introduces improvements to binding generation, build reliability, and runtime behavior. A detailed list can be found on the [dotnet/macios GitHub releases](https://github.com/dotnet/macios/releases/) including a list of [Known issues](https://github.com/dotnet/macios/wiki/Known-issues-in-.NET10).

## Contributors

Thank you contributors! ❤️

[@Ahamed-Ali](https://github.com/Ahamed-Ali), [@albyrock87](https://github.com/albyrock87), [@anandhan-rajagopal](https://github.com/anandhan-rajagopal), [@bhavanesh2001](https://github.com/bhavanesh2001), [@copilot-swe-agent](https://github.com/copilot-swe-agent), [@HarishKumarSF4517](https://github.com/HarishKumarSF4517), [@jfversluis](https://github.com/jfversluis), [@jonathanpeppers](https://github.com/jonathanpeppers), [@jsuarezruiz](https://github.com/jsuarezruiz), [@kubaflo](https://github.com/kubaflo), [@mattleibow](https://github.com/mattleibow), [@noopsRus](https://github.com/noopsRus), [@PureWeen](https://github.com/PureWeen), [@rmarinho](https://github.com/rmarinho), [@simonrozsival](https://github.com/simonrozsival), [@StephaneDelcroix](https://github.com/StephaneDelcroix), [@SubhikshaSf4851](https://github.com/SubhikshaSf4851), [@SyedAbdulAzeemSF4852](https://github.com/SyedAbdulAzeemSF4852), [@Tamilarasan-Paranthaman](https://github.com/Tamilarasan-Paranthaman), [@TamilarasanSF4853](https://github.com/TamilarasanSF4853), [@dalexsoto](https://github.com/dalexsoto), [@rolfbjarne](https://github.com/rolfbjarne), [@mandel-macaque](https://github.com/mandel-macaque), [@mcumming](https://github.com/mcumming), [@jonpryor](https://github.com/jonpryor), [@grendello](https://github.com/grendello),
