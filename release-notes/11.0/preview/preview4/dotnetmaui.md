# .NET MAUI in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 brings `dotnet watch` support to .NET MAUI projects on mobile
platforms, enabling Hot Reload–driven development loops on both Android and iOS.

- [`dotnet watch` for Android](#dotnet-watch-for-android)
- [`dotnet watch` for iOS](#dotnet-watch-for-ios)

## `dotnet watch` for Android

`dotnet watch` now works for Android devices and emulators. After selecting a
target framework and device, `dotnet watch` deploys your app and applies Hot
Reload changes as you edit — no manual rebuild required.

![GIF of `dotnet watch` on Windows for Android](media/net11p4-dotnet-watch-android.gif)

## `dotnet watch` for iOS

Several long-standing issues have been fixed to make `dotnet watch` usable
end-to-end on a `dotnet new maui` project running in the iOS Simulator:

- The Spectre.Console TFM picker no longer appears stuck because two readers
  were both calling `Console.ReadKey()`. Keys now flow through a single
  `PhysicalConsole.KeyPressed` event
  ([dotnet/sdk #53675](https://github.com/dotnet/sdk/pull/53675)).
- Ctrl+C and Ctrl+R no longer surface a spurious `WebSocketException` /
  `ObjectDisposedException` when the WebSocket transport tears down
  ([dotnet/sdk #53648](https://github.com/dotnet/sdk/pull/53648)).
- Hot Reload no longer deadlocks on iOS when `UIKitSynchronizationContext` is
  installed before the startup hook runs
  ([dotnet/sdk #54023](https://github.com/dotnet/sdk/pull/54023)).

![GIF of `dotnet watch` on macOS for iOS](media/net11p4-dotnet-watch-ios.gif)

### Known issue: `dotnet watch` requires `MtouchLink=None` for iOS Simulator

`dotnet watch` does not work for iOS projects unless `<MtouchLink>None</MtouchLink>`
is set in the `.csproj` file
([dotnet/macios #25295](https://github.com/dotnet/macios/issues/25295)). Add the
following to your project file:

```xml
<PropertyGroup>
  <MtouchLink>None</MtouchLink>
</PropertyGroup>
```
