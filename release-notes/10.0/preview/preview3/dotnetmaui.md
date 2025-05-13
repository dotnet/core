# .NET MAUI in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new in .NET MAUI, .NET for Android, and .NET for iOS, Mac Catalyst, macOS, and tvOS in this preview release:

- .NET MAUI
  - [API deprecations of `ListView`, `Cell`, and `TableView`](#api-deprecations)
  - [Fullscreen video playback](#fullscreen-video-playback)
  - [Geolocation IsEnabled](#geolocation-isenabled)
  - [WebAuthenticator CancellationToken](#webauthenticator-cancellationtoken)
  - [Performance improvements](#performance-improvements)
- [.NET for Android](#net-for-android)
- [.NET for iOS, Mac Catalyst, macOS, tvOS](#net-for-ios-mac-catalyst-macos-tvos)

.NET MAUI updates in .NET 10:

- [What's new in .NET MAUI in .NET 10](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-10) documentation.

## API deprecations

This release includes deprecations of `ListView`, `Cell`, and `TableView`. These will be removed in a future release.

## Fullscreen video playback

Now on Android you can play videos fullscreen hosted in a `WebView`. The `iframe` should include `allowfullscreen`.

## Geolocation IsEnabled

Use `IsEnabled` to check if the device has geolocation services enabled independently of requesting location details.

## WebAuthenticator CancellationToken

A `CancellationToken` may now be passed to `WebAuthenticator.AuthenticateAsync` enabling you to programmatically cancel authentication.

## Performance improvements

Various incremental improvements are to runtime performance are included in this release.

### PropertyMapper improvement benchmarks

Each control handler maps properties to the core controls via `PropertyMapper`s. A new cache has been implemented, and improvements have been made to the order in which properties are applied, thus avoiding some race conditions and repetitive calls.

> BenchmarkDotNet v0.13.10, macOS 15.3.1 (24D70) [Darwin 24.3.0]
> Apple M3 Pro, 1 CPU, 11 logical and 11 physical cores
> .NET SDK 9.0.102

Before:

| Method                    | Mean      | Error    | StdDev   | Gen0      | Allocated  |
|-------------------------- |----------:|---------:|---------:|----------:|-----------:|
| BenchmarkUpdateProperties | 167.67 ms | 0.584 ms | 0.547 ms | 3333.3333 | 29604261 B |
| BenchmarkUpdateProperty   |  31.65 ms | 0.079 ms | 0.070 ms |         - |       46 B |

After:

| Method                    | Mean     | Error    | StdDev   | Gen0      | Allocated  |
|-------------------------- |---------:|---------:|---------:|----------:|-----------:|
| BenchmarkUpdateProperties | 59.04 ms | 0.294 ms | 0.275 ms | 3666.6667 | 31204122 B |
| BenchmarkUpdateProperty   | 12.39 ms | 0.026 ms | 0.020 ms |         - |       12 B |

### CollectionView improvement benchmarks

Building on previous work, we now eliminated the `MeasureInvalidated` subscription on iOS and enabled the templated cell to respond better to content changes.

|  Branch | Handler | Measure | Arrange |
| ------ | -------- | ------- | ------- |
| `main` | CV1 | 525 | 308 |
| `PR` | CV1 | 221 | 231 |
| `main` | CV2 (no-resize) | 1371 | 347 |
| `PR` | CV2 | 338 | 379 |

[#28225](https://github.com/dotnet/maui/pull/28225)

### FormattedString improvement

`Label` on Windows has been optimized for rendering `FormattedString` resulting in a ~56% improvement.

[See #28073 on GitHub](https://github.com/dotnet/maui/pull/28073)

## .NET for Android

This release was focused on quality improvements, build performance, and experimental runtimes. A detailed list can be found on [dotnet/android GitHub releases](https://github.com/dotnet/android/releases/).

## .NET for iOS, Mac Catalyst, macOS, tvOS

This release includes support for Xcode 16.3 Release Candidate, and is focused on quality improvements. A detailed list can be found on [dotnet/macios GitHub releases](https://github.com/dotnet/macios/releases/) including a list of [Known issues](https://github.com/dotnet/macios/wiki/Known-issues-in-.NET10).

## Community Contributors

We extend a special thanks to our community contributors [@alexyakunin](https://github.com/alexyakunin), [@MartyIX](https://github.com/MartyIX), [@albyrock87](https://github.com/albyrock87), [@filipnavara](https://github.com/filipnavara), [@jadenrogers](https://github.com/jadenrogers), [@redducks100](https://github.com/redducks100), [@marcel-silva](https://github.com/marcel-silva), [@sheiksyedm](https://github.com/sheiksyedm), [@BrayanKhosravian](https://github.com/BrayanKhosravian), [@kubaflo](https://github.com/kubaflo), [@mos379](https://github.com/mos379), [@jkurdek](https://github.com/jkurdek), [@Choza-rajan](https://github.com/Choza-rajan), [@Tamilarasan-Paranthaman](https://github.com/Tamilarasan-Paranthaman), [@anandhan-rajagopal](https://github.com/anandhan-rajagopal), [@NirmalKumarYuvaraj](https://github.com/NirmalKumarYuvaraj), [@Ahamed-Ali](https://github.com/Ahamed-Ali), [@NanthiniMahalingam](https://github.com/NanthiniMahalingam), [@devanathan-vaithiyanathan](https://github.com/devanathan-vaithiyanathan), [@prakashKannanSf3972](https://github.com/prakashKannanSf3972), [@LogishaSelvarajSF4525](https://github.com/LogishaSelvarajSF4525), [@HarishKumarSF4517](https://github.com/HarishKumarSF4517), [@bhavanesh2001](https://github.com/bhavanesh2001), [@TamilarasanSF4853](https://github.com/TamilarasanSF4853), [@SubhikshaSf4851](https://github.com/SubhikshaSf4851), and [@SyedAbdulAzeemSF4852](https://github.com/SyedAbdulAzeemSF4852).
