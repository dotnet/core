# .NET 7.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations or expected resolution timeframes.

## .NET Runtime

### Unable to debug a Blazor WebAssembly App

It’s not possible to debug a Blazor WebAssembly app using .NET 7 Preview 5 https://github.com/dotnet/runtime/pull/70383

#### Workaround for a Blazor WebAssembly Hosted App:

Copy the following into the server project (`.csproj`) of a `.NET 7 Preview 5` Blazor WebAssembly Hosted App:

```xml
    <ItemGroup>
        <PackageReference Include="Serilog.Extensions.Logging.File" Version="2.0.0" ExcludeAssets="all" GeneratePathProperty="true"/>
    </ItemGroup>
    <Target Name="_CopySerilogDeps" AfterTargets="Build">
        <Copy SourceFiles="$(PkgSerilog_Extensions_Logging_File)\lib\netstandard2.0\Serilog.Extensions.Logging.File.dll"
              DestinationFolder="$(OutputPath)\BlazorDebugProxy"
              SkipUnchangedFiles="true"/>
    </Target>
```

#### Workaround for a Blazor WebAssembly Standalone App:

Copy the following into a `.NET 7 Preview 5` Blazor WebAssembly project (`.csproj`):

```xml
    <ItemGroup>
        <PackageReference Include="Serilog.Extensions.Logging.File" Version="2.0.0" ExcludeAssets="all" GeneratePathProperty="true"/>
    </ItemGroup>
    <Target Name="_CopySerilogDeps" AfterTargets="Build">
        <Copy SourceFiles="$(PkgSerilog_Extensions_Logging_File)\lib\netstandard2.0\Serilog.Extensions.Logging.File.dll"
              DestinationFolder="$(PkgMicrosoft_AspNetCore_Components_WebAssembly_DevServer)\tools\BlazorDebugProxy"
              SkipUnchangedFiles="true"/>
    </Target> 
```
That will copy the missing dependency into the DevServer package and enable Wasm debugging in .NET 7.0 Preview 5 after a single build. This workaround only needs to be run once per package root to repair the DevServer package but should be harmless to leave in as long as the project doesn’t have a different Serilog version requirement.

### Assembly.GetType("System.Net.Http.HttpClientHandler", false, true) does not find some types but finds it when ignoreCase is set to false


When trying to do GetType with ignorecase as true in some cases does not find the type but finds it when ignoreCase is set to false.
This only happens in .NET7 preview 1 and does not happen in .NET 6.
More information and workaround can be found at https://github.com/dotnet/runtime/issues/65013

### Libraries has a non blocking issue in System.Security.Cryptography.
.NET 7 Preview 3 on Linux skips revocation checks for expired certificates, reporting RevocationStatusUnknown when revocation checks were enabled. You can read more about this here: https://github.com/dotnet/runtime/issues/66803

### Libraries has an unpredictable race condition in System.Security.Cryptography in Browser WASM
.NET 7 Preview 5 on Browser WASM has implemented the SHA1, SHA256, SHA384, SHA512 algorithms using the [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) browser-native APIs. A race condition was discovered in System.Security.Cryptography's implementation where the wrong hash value is returned unpredictably. You can read more about this here: https://github.com/dotnet/runtime/issues/69806. This only happens in .NET 7 Preview 5 and has been fixed in the latest code.

## .NET SDK

### [Testhost.exe does not find '7.0.0-preview.6.22324.4' runtime when running tests](https://github.com/dotnet/sdk/issues/26462)
A file-based install of the SDK, dotnet test on a .net 7 project will look in the global location rather than the local location and be unable to find .net 7.

Workaround: Setting DOTNET_ROOT to point to the path to the local dotnet fixes the issue.

### Blazor issues depending on whether you’re using .NET 6 installed by VS or stand-alone install of .NET 7

If your app is targetting Blazor using the .net 7 included in VS, you can target net6.0 but not target net7.0. 

Workaround:

Install the stand-alone SDK for .NET 7.0 Preview 6

### MaxInteger[T]\(System.Collections.Generic.IEnumerable`1[T]\)' violates the constraint of type parameter 'T' exception

We have discovered that AutoMapper library is impacted by a change in .NET 7 Preview 5 and this is tracked by [dotnet-sdk-7.0.100-preview.5.22257.3] MaxInteger[T]\(System.Collections.Generic.IEnumerable`1[T]\)' violates the constraint of type parameter 'T' exception · Issue #3988 · AutoMapper/AutoMapper (github.com). .NET team has submitted a PR to fix the bug in AutoMapper code and is working with AutoMapper library owners to determine options.

### [Unhandled Exception in dotnet format app in .NET 7.0 Preview 5](https://github.com/dotnet/sdk/issues/25879)

dotnet format app that comes with SDK has this exception:
Unhandled exception: System.IO.FileLoadException: Could not load file or assembly 'System.Configuration.ConfigurationManager, Version=6.0.0.0

Workaround:

[Install dotnet-format as a global tool](https://github.com/dotnet/format#how-to-install-development-builds)

`dotnet tool install -g dotnet-format --version "7.*" --add-source https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet7/nuget/v3/index.json`

Then invoke the global tool using `dotnet-format` instead of through the dotnet CLI using `dotnet format`.


### MAUI optional workloads not yet supported in .NET 7

You can continue using 6.0.200 .NET SDK versions until .NET MAUI joins the .NET 7 release. See more information here: https://github.com/dotnet/maui/wiki/.NET-7-and-.NET-MAUI




