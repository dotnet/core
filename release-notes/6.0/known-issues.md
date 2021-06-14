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
1. Missing Workload Manifests in Visual Studio 17 preview 1

`dotnet workload install` will error with workload not found when using the .NET SDK CLI installed with Visual Studio preview 1.  To work around this, please install the stand-alone SDK of preview 5 on the same machine.

2. SDK broken when both preview 4 and preview 5 stand-alone SDKs installed on the same machine. Many SDK commands will fail, such as creating, building, or restoring a project. For example:
```
dotnet new console
An item with the same key has already been added. Key: microsoft-android-sdk-full
   at System.Collections.Generic.Dictionary`2.TryInsert(TKey key, TValue value, InsertionBehavior behavior) in
```
The issue is caused because we renamed SDK workload manifests between preview 4 and preview 5, so if both versions are installed the same workloads and workload packs are defined in multiple places, which is not supported.

**Workaround**

Uninstall preview 4

or

Delete all folders under dotnet\sdk-manifests\6.0.100 that have the form Microsoft.NET.Workload.*, EXCEPT for `microsoft.net.workload.mono.toolchain`

3. Workload update from preview 4 not working

The .NET SDK Optional Workloads were renamed between preview 4 and preview 5 and are not compatible. As such, the `dotnet workload update` command won't work for a preview 4 installed workload but should work with preview 5 and onward.

## .NET Runtime
1. Issue in "dnSpy.exe" fpr .NET 6.0 Preview 5 as described in [dotnet/runtime #53014](https://github.com/dotnet/runtime/issues/53014)

A [fix](https://github.com/dotnet/runtime/pull/53574) for this issue will be available in .NET 6.0 Prevew 6

2. Issue in `ReadyToRun` feature for .NET Preview 6.0 Preview 3 as described in [dotnet/runtime #50472](https://github.com/dotnet/runtime/issues/50472)

**Workaround**

You can workaround this issue by setting `COMPlus_ReadyToRun=0` environment variable.


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
