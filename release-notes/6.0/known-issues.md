# .NET 6.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations or expected resolution timeframes.

## .NET SDK
### Preview 4
1. Workload install for protected install location (eg. c:\program files) will fail

In the future, the .NET SDK will trigger elevation to install missing workloads but today that fails.

```
C:\Users\MPP>dotnet workload install microsoft-macos-sdk-full --skip-manifest-update

Installing pack Microsoft.macOS.Sdk version 11.3.100-preview.5.889...
Workload installation failed, rolling back installed packs...
Rolling back pack Microsoft.macOS.Sdk installation...
Workload installation failed: One or more errors occurred. (Access to the path 'C:\Program Files\dotnet\metadata\temp\microsoft.macos.sdk\11.3.100-preview.5.889' is denied.)
```
**Workaround**
You'll need to elevate your command prompt before running the install command.

### Preview 5
#### 1. Missing Workload Manifests in Visual Studio 17 Preview 1

`dotnet workload install` will error with workload not found when using the .NET SDK CLI installed with Visual Studio preview 1.  To work around this, please install the stand-alone SDK of preview 5 on the same machine.

#### 2. Upgrades from .NET SDK Preview 4 to Preview 5 leave tools in a broken state.  Projects will fail to load in Visual Studio, and many SDK commands will fail, such as creating, building, or restoring a project.

This can manifest in several different ways.  For example, when using the dotnet CLI, you may get an error similar to the following:

```
dotnet new console
An item with the same key has already been added. Key: microsoft-android-sdk-full
   at System.Collections.Generic.Dictionary`2.TryInsert(TKey key, TValue value, InsertionBehavior behavior) in
```

When opening a project in Visual Studio, you may get an error similar to the following:

> The project file cannot be opened. The NuGet-based SDK resolver failed to run because NuGet assemblies could not be located. Check your installation of MSBuild or set the environment variable “MSBUILD_NUGET_PATH” to the folder that contains the required NuGet assemblies. Could not find file ‘C:\Program Files\dotnet\sdk-manifests\6.0.100\Microsoft.NET.Workload.Android\WorkloadManifest.json’.

When opening a project in Visual Studio for Mac, you may get an error similar to the following:

> Unable to find SDK  
> 'Microsoft.NET.SDK.WorkloadAutoImportPropsLocator'  
> SDK not found

The issue is caused because we renamed SDK workload manifests between preview 4 and preview 5.  If both versions of the manifests are installed, they will conflict with each other, leading to the "An item with the same key has already been added" error.

Errors that a WorkloadManifest.json file could not be found may be caused if the `maui-check` tool had previously been run with Preview 4.  The tool would add some additional files to the workload manifest folders, which prevents the folders from being deleted when installing Preview 5.  These manifest folders without a WorkloadManfiest.json file then cause the file not found error.

**Workaround**

In the .NET SDK installation folder, delete all folders under `sdk-manifests\6.0.100` (for example, under `C:\Program Files\dotnet\sdk-manifests\6.0.100`) that have the form Microsoft.NET.Workload.*, **EXCEPT** for `microsoft.net.workload.mono.toolchain`

**Or**

If you want to use .NET MAUI, you can run the latest version of the [maui-check tool](https://github.com/Redth/dotnet-maui-check/blob/main/README.md).  This will delete the outdated manifest folders and set up your environment for .NET MAUI development.

#### 3. Workload update from preview 4 not working

The .NET SDK Optional Workloads were renamed between preview 4 and preview 5 and are not compatible. As such, the `dotnet workload update` command won't work for a preview 4 installed workload but should work with preview 5 and onward.

## .NET Runtime
1. Issue in "dnSpy.exe" fpr .NET 6.0 Preview 5 as described in [dotnet/runtime #53014](https://github.com/dotnet/runtime/issues/53014)

A [fix](https://github.com/dotnet/runtime/pull/53574) for this issue will be available in .NET 6.0 Prevew 6

2. Issue in `ReadyToRun` feature for .NET Preview 6.0 Preview 3 as described in [dotnet/runtime #50472](https://github.com/dotnet/runtime/issues/50472)

**Workaround**

You can workaround this issue by setting `COMPlus_ReadyToRun=0` environment variable.

3. **Microsoft.Extensions.DependencyInjection** .NET 6.0 Preview 5 has a regression related to injecting more than 5 services into an IEnumerable\<T>\, see [dotnet/runtime #54407](https://github.com/dotnet/runtime/issues/54407) for more details.


**Workaround**

If using the generic host, you can disable the `ValidateOnBuild` option:

```C#
Host.CreateDefaultBuilder(args)
    .UseDefaultServiceProvider(o =>
    {
        o.ValidateOnBuild = false;
    });
```

If using the `BuildServiceProvider` container directly, `ValidateOnBuild` is not on by default.


## Windows Forms

* `PropertyGrid` values are rendered at incorrect location.

     The issue is tracked in [dotnet/winforms#4593](https://github.com/dotnet/winforms/issues/4593) and is expected to be fixed in 6.0 Preview3.
     
## ASP.NET Core

**Running Blazor WebAssembly using IIS Express in Development**

As of .NET 6 Preview 1, there is an ongoing issue with running Blazor WebAssembly applications using an IIS Express server during development on Visual Studio. As a workaround, we recommend using Kestrel during development.

**Incremental builds in VS not working for apps with Razor views**

As of .NET 6 Preview 3, changes to Razor views will not be updated during incremental builds. As a workaround, you can:

- Build from the command line
- Configure VS to always call MSBuild when building projects
- Clean and build projects to pick up changes

**JWT Bearer Handler ArgumentOutOfRangeException in UTC+X time zones**

As of .NET 6 Preview 5, when using the JWT Bearer handler in a time zone that is higher than UTC (e.g. Eastern European Time/UTC+2), you may observe an `ArgumentOutOfRangeException` if the JWT token does not contain a `nbf` value (valid from).

Issue is tracked by https://github.com/dotnet/aspnetcore/issues/33634 and will be fixed in .NET 6 Preview 6.

**Workaround**

You can workaround this by always providing a non-zero and non-minimum value for the `notBefore` parameter when using System.IdentityModel.Tokens.Jwt.JwtSecurityToken, or the 'nbf' field if using another JWT library.
