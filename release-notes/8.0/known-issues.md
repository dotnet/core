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

### [8.0.100-rc.2] .NET 8 RC 2 SDK will disply 14 warnings when running dotnet new the first time or during any future template installation

This should not affect the fucntionality of the template itself but may impact localization of the template help for the Blazor templates.

```
Warning: Failed to read or parse localization file "C:\Program Files\dotnet\templates\8.0.0-rc.2.23476.41\microsoft.dotnet.web.projecttemplates.8.0.8.0.0-rc.2.23476.41.nupkg(/content/BlazorWeb-CSharp/.template.config/localize/templatestrings.cs.json)", it will be skipped from further processing.
```

### [8.0.100-rc.2] `dotnet tool restore` may fail with a file access exception when restoring multiple tools
When running `dotnet tool restore` with a tools config which contains multiple .NET tools, the command can fail with an exception similar to the following:

```
Unhandled exception: System.AggregateException: One or more errors occurred. (The process cannot access the file 'C:\Users\Username\AppData\Local\Temp\a75617cf-9767-45ca-aaed-34da2edd223e\project.assets.json' because it is being used by another process.)
When running `dotnet tool restore` with a tools config which contains multiple .NET tools, the command can fail with an exception similar to the following:
 ---> System.IO.IOException: The process cannot access the file 'C:\Users\Username\AppData\Local\Temp\a75617cf-9767-45ca-aaed-34da2edd223e\project.assets.json' because it is being used by another process.
```
**Workarounds**

The error only occurs when there are multiple tools that have not been previously restored.  So to work around the issue, you can remove all but one tool from the `dotnet-tools.json` config file, and run `dotnet tool restore`.  Then add the tools back to the config file one at a time, running `dotnet tool restore` between each one.

If you are using .NET tools in CI where you can't easily modify the tools config file between multiple tool restores, you can create a separate `dotnet-tools.json` config file for each .NET tool in a separate subfolder.  Then run `dotnet tool restore` in each subfolder.

### ## [8.0.100-rc.2] `dotnet tool restore` will always install the latest version of a specific tool

If a version or version range is used to specify a version of a tool, tool restore will still install the latest version available. There is no workaround and a fix is expected for GA.

## .NET MAUI

For details about known issues, please refer to the individual repositories:

- [.NET MAUI](https://github.com/dotnet/maui/wiki/Known-Issues/)
- [Android](https://github.com/xamarin/xamarin-android/wiki/Known-issues-in-.NET)
- [iOS and macOS](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET8)

## Native AOT Support in .NET

For details about known issues, please reference to [the pinned issue](https://github.com/dotnet/core/issues/8288) in this repo.

## WPF [ 8.0.100-preview.6.] `dotnet build` will fail for WPF projects having `IntermediateOutputPath` redirected or `IncludePackageReferencesDuringMarkupCompilation` set to false
When building XAML files, you may encounter an error like

```
S:\FxWpf\obj\net472\MainWindow.g.cs(57,21): error CS1504: Source file 'MainWindow.xaml' could not be opened -- Could not find file. [S:\FxWpf\FxWpf\FxWpf_mrhd1mq3_wpftmp.csproj]
```

Where the error arises from a `*_wpftmp.csproj` project, is `CS1504`, and references a `.xaml` file.

Available Workarounds:
Any of these should work; select the best option for your case.
- set `IncludePackageReferencesDuringMarkupCompilation` to `true` in the `.csproj` or an imported file.
- set `EmbedUntrackedSources` to `false` in the `.csproj` or an imported file.
- Use the default `IntermediateOutputPath` in .NET Framework 4.x-targeting projects.
Detailed discussion [here](https://github.com/dotnet/sdk/issues/34438)