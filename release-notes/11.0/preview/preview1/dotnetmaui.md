# .NET MAUI in .NET 11 Preview 1 - Release Notes

Here's a summary of what's new in .NET MAUI, .NET for Android, and .NET for iOS, Mac Catalyst, macOS, and tvOS in this preview release:

- .NET MAUI
  - [XAML Source Generation by Default](#xaml-source-generation-by-default)
- .NET for Android
  - [CoreCLR by Default](#coreclr-by-default)
  - [dotnet run enhancements](#dotnet-run-enhancements)

.NET MAUI updates in .NET 11:

- [What's new in .NET MAUI in .NET 11](https://learn.microsoft.com/dotnet/maui/whats-new/) documentation.

## XAML source generation by default

XAML source generation is now the default in .NET 11 for all .NET MAUI applications. This provides faster build times, debug performance, and release runtime performance. Debug build app behavior is consistent with release build app behavior.

To temporarily revert to XAMLC, add this to you project file.

```xml
<PropertyGroup>
    <!-- Other properties like TargetFrameworks, etc. -->
    <MauiXamlInflator>XamlC</MauiXamlInflator>
</PropertyGroup>
```

## CoreCLR by default

CoreCLR is now the default runtime for Android `Release` builds. This should improve compatibility with the rest of .NET as well as shorter startup times, with a reasonable increase to application size.

We are always working to improve performance and app size, but please file issues with stability or concerns by filing [issues on GitHub](https://github.com/dotnet/android/issues).

If you would like to opt out of CoreCLR, and use the Mono runtime instead, you can still do so via:

```xml
<PropertyGroup>
  <UseMonoRuntime>true</UseMonoRuntime>
</ProperyGroup>
```

## `dotnet run` enhancements

We have enhanced the .NET CLI with [Spectre.Console](https://spectreconsole.net/) to *prompt* when a selection is needed for `dotnet run`.

So, for multi-targeted projects like .NET MAUI, it will:

- Prompt for a `$(TargetFramework)`
- Prompt for a device, emulator, simulator if there are more than one.

Console output of your application should appear directly in the terminal, and Ctrl+C will terminate the application.

![GIF of `dotnet run` selections on Windows for Android](./media/dotnet-run-android-preview1.gif)

![GIF of `dotnet run` selections on macOS for iOS](./media/dotnet-run-ios-preview1.gif)

## Contributors

Thank you contributors! ❤️

[@Ahamed-Ali](https://github.com/Ahamed-Ali), [@akoeplinger](https://github.com/akoeplinger), [@albyrock87](https://github.com/albyrock87), [@CathyZhu0110](https://github.com/CathyZhu0110), [@csigs](https://github.com/csigs), [@davidnguyen-tech](https://github.com/davidnguyen-tech), [@davidortinau](https://github.com/davidortinau), [@HarishKumarSF4517](https://github.com/HarishKumarSF4517), [@jfversluis](https://github.com/jfversluis), [@kotlarmilos](https://github.com/kotlarmilos), [@kubaflo](https://github.com/kubaflo), [@mattleibow](https://github.com/mattleibow), [@NirmalKumarYuvaraj](https://github.com/NirmalKumarYuvaraj), [@PureWeen](https://github.com/PureWeen), [@rmarinho](https://github.com/rmarinho), [@sheiksyedm](https://github.com/sheiksyedm), [@StephaneDelcroix](https://github.com/StephaneDelcroix), [@SubhikshaSf4851](https://github.com/SubhikshaSf4851), and [@TamilarasanSF4853](https://github.com/TamilarasanSF4853).
