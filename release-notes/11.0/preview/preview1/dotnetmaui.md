# .NET MAUI in .NET 11 Preview 1 - Release Notes

Here's a summary of what's new in .NET MAUI in this Preview 1 release:

- [CoreCLR by Default](#coreclr-by-default)
- [dotnet run](#dotnet-run)
- [XAML Source Generation by Default](#xaml-source-generation-by-default)

## CoreCLR by default

CoreCLR is now the default runtime for Android `Release` builds. This should
improve compatibility with the rest of .NET as well as shorter startup
times, with a reasonable increase to application size.

We are always working to improve performance and app size, but please
file issues with stability or concerns by filing
[issues on GitHub](https://github.com/dotnet/android/issues).

If you would like to opt out of CoreCLR, and use the Mono runtime
instead, you can still do so via:

```xml
<PropertyGroup>
  <UseMonoRuntime>true</UseMonoRuntime>
</ProperyGroup>
```

## `dotnet run` enhancements

We have enhanced the .NET CLI with [Spectre.Console](https://spectreconsole.net/) to *prompt* when a selection is needed for `dotnet run`.

So, for multi-targeted projects like .NET MAUI, it will:

* Prompt for a `$(TargetFramework)`
* Prompt for a device, emulator, simulator if there are more than one.

Console output of your application should appear directly in the terminal, and Ctrl+C will terminate the application.

![GIF of `dotnet run` selections on Windows for Android](dotnet-run-android-preview1.gif)

![GIF of `dotnet run` selections on macOS for iOS](dotnet-run-ios-preview1.gif)

## XAML source generation by default

XAML source generation is now the default in .NET 11 for all .NET MAUI applications. This provides faster build times, debug performance, and release runtime performance. Debug build app behavior is consistent with release build app behavior. 

To temporarily revert to XAMLC, add this to you project file.

```xml
<PropertyGroup>
    <!-- Other properties like TargetFrameworks, etc. -->
    <MauiXamlInflator>XamlC</MauiXamlInflator>
</PropertyGroup>
```

.NET MAUI updates in .NET 11:

- [What's new in .NET MAUI](https://learn.microsoft.com/dotnet/maui/whats-new/) documentation.
