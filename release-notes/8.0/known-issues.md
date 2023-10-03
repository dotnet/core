# .NET 8.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET SDK

### [8.0.100-rc.2] .NET 8 RC 2 SDK is not compatible with Visual Studio 17.7 or 17.8-preview 2 for Razor projects

You will see errors like the following when building Razor applications in incompatible Visual Studio versions when using .NET 8 RC 2 SDK
```
System.TypeLoadException: Could not load type 'Enumerator' from assembly 'Microsoft.CodeAnalysis, Version=4.8.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35'. 
 C:\Program Files\Microsoft Visual Studio\2022\Preview\MSBuild\Current\Bin\Roslyn\Microsoft.CSharp.Core.targets 84
```
**Workaround** Please upgrade to 17.8-preview3 or use [global.json](https://learn.microsoft.com/dotnet/core/tools/global-json) to pin to the 7.0.400 SDK that is included with 17.7.

### [8.0.100-rc.2] .NET 8 RC 2 SDK will list out 14 warnings when running dotnet new the first time

This should not affect the fucntionality of the template itself but may impact localization of the template help for the Blazor templates.

```
Warning: Failed to read or parse localization file "C:\Program Files\dotnet\templates\8.0.0-rc.2.23476.41\microsoft.dotnet.web.projecttemplates.8.0.8.0.0-rc.2.23476.41.nupkg(/content/BlazorWeb-CSharp/.template.config/localize/templatestrings.cs.json)", it will be skipped from further processing.
```

### [8.0.100-rc.2] .NET 8 RC 2 SDK may fail when restoring multiple local tools in the same action
The .NET tools download experience was changed in .NET 8 RC 2 and the tool restore functionality ended up running in parallel for multiple tools but overwriting the same shared project.assets.json file.
```
The process cannot access the file '/tmp/505bdf97-0de5-4af8-8b26-2b27ae4ab4e5/project.assets.json' because it is being used by another process.
```
**Workaround** Create separate dotnet-tool.json files for each tool and restore them one by one

## .NET MAUI

For details about known issues, please refer to the individual repositories:

- [.NET MAUI](https://github.com/dotnet/maui/wiki/Known-Issues/)
- [Android](https://github.com/xamarin/xamarin-android/wiki/Known-issues-in-.NET)
- [iOS and macOS](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET8)

## Native AOT Support in .NET

For details about known issues, please reference to [the pinned issue](https://github.com/dotnet/core/issues/8288) in this repo.
