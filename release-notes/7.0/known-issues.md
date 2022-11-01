# .NET 7.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET Runtime

### Unable to decompress 4GB+ zip archives

It's impossible to decompress large (4GB+ after compression) zip archives that consist of more than one zipped file. There is no known workaround. More information and workaround can be found at: https://github.com/dotnet/runtime/issues/77159. This issue will be fixed in the December servicing release.

### Unable to evaluate expressions in a Blazor WebAssembly App

It isn't possible to evaluate expressions in a Blazor WebAssembly app using .NET 7 RC1 https://github.com/dotnet/runtime/pull/75495

#### Workaround for a Blazor WebAssembly Hosted App:

Copy the following into the server project (`.csproj`) of a `.NET 7 Preview RC1` Blazor WebAssembly Hosted App:

```xml
	<ItemGroup>
		<PackageReference Include="Microsoft.CodeAnalysis.Scripting.Common" Version="3.7.0" ExcludeAssets="all" GeneratePathProperty="true"/>
		<PackageReference Include="Microsoft.CodeAnalysis.CSharp.Scripting" Version="3.7.0" ExcludeAssets="all" GeneratePathProperty="true"/>
	</ItemGroup>
	<Target Name="_CopyCodeAnalysisDeps" AfterTargets="Build">
		<Copy SourceFiles="$(PkgMicrosoft_CodeAnalysis_Scripting_Common)\lib\netstandard2.0\Microsoft.CodeAnalysis.Scripting.dll"
              DestinationFolder="$(OutputPath)\BlazorDebugProxy"
              SkipUnchangedFiles="true"/>
		<Copy SourceFiles="$(PkgMicrosoft_CodeAnalysis_CSharp_Scripting)\lib\netstandard2.0\Microsoft.CodeAnalysis.CSharp.Scripting.dll"
			  DestinationFolder="$(OutputPath)\BlazorDebugProxy"
			  SkipUnchangedFiles="true"/>
	</Target>
```

#### Workaround for a Blazor WebAssembly Standalone App:

Copy the following into a `.NET 7 Preview RC1` Blazor WebAssembly project (`.csproj`):

```xml
	<ItemGroup>
		<PackageReference Include="Microsoft.CodeAnalysis.Scripting.Common" Version="3.7.0" ExcludeAssets="all" GeneratePathProperty="true"/>
		<PackageReference Include="Microsoft.CodeAnalysis.CSharp.Scripting" Version="3.7.0" ExcludeAssets="all" GeneratePathProperty="true"/>
	</ItemGroup>
	<Target Name="_CopyCodeAnalysisDeps" AfterTargets="Build">
		<Copy SourceFiles="$(PkgMicrosoft_CodeAnalysis_Scripting_Common)\lib\netstandard2.0\Microsoft.CodeAnalysis.Scripting.dll"
              DestinationFolder="$(PkgMicrosoft_AspNetCore_Components_WebAssembly_DevServer)\tools\BlazorDebugProxy"
              SkipUnchangedFiles="true"/>
		<Copy SourceFiles="$(PkgMicrosoft_CodeAnalysis_CSharp_Scripting)\lib\netstandard2.0\Microsoft.CodeAnalysis.CSharp.Scripting.dll"
			  DestinationFolder="$(PkgMicrosoft_AspNetCore_Components_WebAssembly_DevServer)\tools\BlazorDebugProxy"
			  SkipUnchangedFiles="true"/>
	</Target>
```

That will copy the missing dependency into the DevServer package and enable evaluation of expression on Wasm debugging in .NET 7.0 Preview RC1 after a single build. This workaround only needs to be run once per package root to repair the DevServer package but should be harmless to leave in.

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

### `dotnet user-jwts` not functional in .NET 7 RC1

The `dotnet user-jwts` command line tool is not functional in .NET 7 RC1 due to an assembly resolution bug.  When running the CLI, you will encounter the following exception.

```
$ dotnet user-jwts create 
Could not load file or assembly 'Microsoft.Extensions.Configuration.Binder, Version=7.0.0.0, Culture=neutral, PublicKeyToken=adb9793829ddae60'. The system cannot find the file specified.
```

To circumvent this issue, you will need to modify the local installation to probe correctly for the `Microsoft.Extensions.Configuration.Binder` assembly

1. Locate the `user-jwts` tool directory in your local SDK installation. This will typically be located in a path as follows:
  - on Linux/macOS:
  ```
  ~/.dotnet/sdk/7.0.100-rc.1.22431.12/DotnetTools/dotnet-user-jwts/7.0.0-rc.1.22427.2/tools/net7.0/any
  ```
  - on Windows:
  ```
  C:\Program Files\ddotnet\sdk\7.0.100-rc.1.22431.12\DotnetTools\dotnet-user-jwts\7.0.0-rc.1.22427.2\tools\net7.0\any
  ```

2. Locate the `dotnet-user-jwts.deps.json` file and make the following modifications:

```diff
{
    "targets": {
        ".NETCoreApp,Version=v7.0": {
            "dotnet-user-jwts/7.0.0-rc.1.22426.10": {
            "dependencies": {
+               "Microsoft.Extensions.Configuration.Binder": "7.0.0-rc.1.22426.10"
            },
+           "Microsoft.Extensions.Configuration.Binder/7.0.0-rc.1.22426.10": {
+               "dependencies": {
+                   "Microsoft.Extensions.Configuration.Abstractions": "7.0.0-rc.1.22426.10"
+               },
+               "runtime": {
+                   "lib/net7.0/Microsoft.Extensions.Configuration.Binder.dll": {
+                       "assemblyVersion": "7.0.0.0",
+                       "fileVersion": "7.0.22.42610"
+               }
+           }
        },
    },
    "libraries": {
+       "Microsoft.Extensions.Configuration.Binder/7.0.0-rc.1.22426.10": {
+           "type": "package",
+           "serviceable": true,
+           "sha512": "",
+           "path": "microsoft.extensions.configuration.binder/7.0.0-rc.1.22426.10",
+           "hashPath": "microsoft.extensions.configuration.binder.7.0.0-rc.1.22426.10.nupkg.sha512"
+       },
    }
}
```

3. Locate the `Microsoft.Extensions.Configuration.Binder` assembly in the directory associated with the `Microsoft.AspNetCore.App` shared runtime. This will typically be located in a path as follows:
  - on Linux/macOS
  ```
  ~/.dotnet/shared/Microsoft.AspNetCore.App/7.0.0-rc.1.22427.2
  ```
  - on Windows
  ```
  C:\Program Files\dotnet\shared\Microsoft.AspNetCore.App\7.0.0-rc.1.22427.2
  ```
  
4. Copy the assembly from Step 3 to the `user-jwts` tool directory from Step 1.
  - on Linux/macOS
  ```
  $ cp ~/.dotnet/shared/Microsoft.AspNetCore.App/7.0.0-rc.1.22427.2/Microsoft.Extensions.Configuration.Binder.dll ~/.dotnet/sdk/7.0.100-rc.1.22431.12/DotnetTools/dotnet-user-jwts/7.0.0-rc.1.22427.2/tools/net7.0/any
  ```
  - on Windows
  ```
  > copy C:\Program Files\dotnet\shared\Microsoft.AspNetCore.App\7.0.0-rc.1.22427.2\C:\Program Files\dotnet\shared\Microsoft.AspNetCore.App\7.0.0-rc.1.22427.2 C:\Program Files\ddotnet\sdk\7.0.100-rc.1.22431.12\DotnetTools\dotnet-user-jwts\7.0.0-rc.1.22427.2\tools\net7.0\any
  ```

5. Note that the install directory for the SDK may not be deleted during uninstall due to applying this workaround, e.g. when updating to 7.0.0-rc.2. If that occurs, delete the directory manually.

This issue will be resolved in .NET 7 RC 2.

## ASP.NET Core

### [7.0] bind get, set, after can't be used in 7.0 Blazor applications
In .NET 7 Preview 7, we've introduced [a new feature for binding values to components](https://devblogs.microsoft.com/dotnet/asp-net-core-updates-in-dotnet-7-preview-7/#blazor-data-binding-get-set-after-modifiers) using the new `bind:get`, `bind:set` and `bind:after` syntax.
As part of a follow-up work to address some issues we've learned about related to that feature, we had to take a two-part fix both in dotnet/aspnetcore and dotnet/razor-compiler repos. Unfortunately, we had an issue with our dependency update process and the razor compiler changes did not make it into the 7.0 build. As a result, when you try to use bind, get, set, after on 7.0 Blazor application, the compiler will emit code against non existing APIs and users will be presented with an error like `Can't convert from EventCallback<T> to Func<T,Task>`.
An update for the compiler is planned as part of the 7.0.1 release that will update the compiler to target the new APIs and make this feature work as expected from them on.



Users that are not relying on bind get, set, after will not be affected by this issue.

## WPF

### NullReferenceException is thrown in the System.Windows.StyleHelper.GetExpression method
An attempt to call the BindingOperations.GetBindingExpression method in .NET 7.0 leads to NullReferenceException (Issue 7205)[https://github.com/dotnet/wpf/issues/7205].
 
Currently no workaround is available. If your application is using the above API, then we recommend you wait for the upcoming servicing release post GA.

