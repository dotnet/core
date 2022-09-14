# .NET 7.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET Runtime

### Unable to debug a Blazor WebAssembly App

It isn't possible to debug a Blazor WebAssembly app using .NET 7 Preview 5 https://github.com/dotnet/runtime/pull/70383

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
This only happens in .NET 7 preview 1 and doesn't happen in .NET 6.
More information and workaround can be found at https://github.com/dotnet/runtime/issues/65013.

### Libraries have a non blocking issue in System.Security.Cryptography.
.NET 7 Preview 3 on Linux skips revocation checks for expired certificates, reporting RevocationStatusUnknown when revocation checks were enabled. You can read more about this here: https://github.com/dotnet/runtime/issues/66803

### Libraries have an unpredictable race condition in System.Security.Cryptography in Browser WASM
.NET 7 Preview 5 on Browser WASM has implemented the SHA1, SHA256, SHA384, SHA512 algorithms using the [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) browser-native APIs. A race condition was discovered in System.Security.Cryptography's implementation where the wrong hash value is returned unpredictably. You can read more about this here: https://github.com/dotnet/runtime/issues/69806. This only happens in .NET 7 Preview 5 and has been fixed in the latest code.

## .NET SDK

### [RC1] dotnet restore --interactive not working for authenticated feeds

The --interactive flag is not working with any dotnet.exe command in RC1. https://github.com/dotnet/sdk/issues/27597

**Workarounds** 
- set `DOTNET_CLI_DO_NOT_USE_MSBUILD_SERVER=1` before running `dotnet`
- `msbuild /t:restore /p:nugetInteractive=true`
- [package source credentials](https://docs.microsoft.com/en-us/nuget/reference/nuget-config-file#packagesourcecredentials)
- Open the project in Visual Studio
