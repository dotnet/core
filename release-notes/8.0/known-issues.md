# .NET 8.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET SDK

### [8.0.100-preview.1.23115.2] analyzer CA2009 throws InvalidCastException at runtime causing build failure

This regression introduced .NET 8 preview 1 for CA2009 `Do not call ToImmutableCollection on an ImmutableCollection value` analyzer. It is [fixed](https://github.com/dotnet/roslyn-analyzers/pull/6476) in preview 2. 

**Resolution**

- Please upgrade into .NET 8 preview 2 or above if possible
- Disable the analyzer in .editorconfig: `dotnet_diagnostic.CA2009.severity = none` 

## .NET MAUI

For details about known issues, please refer to the individual repositories:

* [.NET MAUI](https://github.com/dotnet/maui/wiki/Known-Issues/)
* [Android](https://github.com/xamarin/xamarin-android/wiki/Known-issues-in-.NET)
* [iOS and macOS](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET8)