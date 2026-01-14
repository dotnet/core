# .NET 10 Known Issues

You may encounter some known issues, which may include workarounds, mitigations, or expected resolution timeframes. Watch this space for any known issues in .NET 10.0.

## ASP.NET Core Runtime Hosting Bundle upgrade breaks IIS hosting on ARM64 machines

Starting in .NET 10 Preview 2, installing the ASP.NET Core Runtime Hosting Bundle for Windows on ARM64 when a earlier version of the hosting bundle was previously installed breaks IIS hosting. This causes problems for both IIS and IIS express on ARM64 machines after attempting to update the hosting bundle. Fortunately, **you can work around this issue by uninstalling all hosting bundles and reinstalling the .NET 10 Preview 2 hosting bundle.**

See [the GitHub issue](https://github.com/dotnet/aspnetcore/issues/60764) for more details.

## MAUI applications may fail to build in Visual Studio

MAUI applications built in Visual Studio or with `MSBuild.exe` may fail with an error like `C:\Program Files\Microsoft Visual Studio\2022\Enterprise\MSBuild\Current\Bin\amd64\Microsoft.CSharp.CurrentVersion.targets(238,5): error : The application to execute does not exist: 'C:\Program Files\dotnet\sdk\10.0.100-preview.4.25258.110\Roslyn\binfx\csc.dll'`.

### Available Workaround

Add the following to a `Directory.Build.props` file that is imported in all MAUI projects, or directly in each affected MAUI project:

```xml
<PropertyGroup Label="">
  <!-- Work around .NET 10-preview4 MAUI issue.
       Remove when building with .NET SDK 10.0.100-preview.5 or later that
       includes https://github.com/dotnet/roslyn/pull/78402 -->
  <RoslynCompilerType>FrameworkPackage</RoslynCompilerType>
</PropertyGroup>
```

The behavior will be **fixed in the .NET 10 preview 5** release. The workaround should be removed after that release.

## `global.json` is used for test runner selection instead of `dotnet.config`

In .NET 10 versions up to RC1, we supported the use of a `dotnet.config` file, an INI-formatted file that is currently used only to set the test runner to use with `dotnet test`. Setting this is required in order to use the new Microsoft.Testing.Platform. In 10.0.100 RC2 and beyond, the use of this file is removed in favor of the pre-existing `dotnet.config` file.

Instead of using `dotnet.config` to specify a runner:

```ini
[dotnet.test.runner]
name = "Microsoft.Testing.Platform"
```

`global.json` uses the following to specify the same runner:

```json
{
  "test": {
    "runner": "Microsoft.Testing.Platform"
  }
}
```

This change is done in response to user feedback about the relative lack of utility of `dotnet.config` at this time.

## Startup Performance Regression in Fractional CPU Containers

Up to 10% startup performance regression was identified in .NET 10 runtime, particularly affecting scenarios running in containers with fractional CPU allocations. This issue has been observed only on x64 architecture. We are actively investigating and working to resolve the issue in future updates.

## Windows System Path Regression

Updating .NET 10 preview7, RC1, or RC2 to RTM may fail to set the `PATH` environment variable on Windows. To work around this issue, repair the .NET 10 Installation. If earlier, non-native versions like 5.0 are present, it can result in swapping the path entries for x86 and x64.

See [the GitHub issue](https://github.com/dotnet/sdk/issues/51218) for more details.

## Configuration regression when binding `IEnumerable<T>` property to empty array

Applications that use an empty array configuration such as `"IEnumerableProperty": []` and bind it to an uninitialized property of type `IEnumerable<T>`, `IReadOnlyList<T>`, or `IReadOnlyCollection<T>` will encounter an `ArgumentNullException`. This exception can cause the application to crash if it isn’t properly handled.

See [the GitHub issue](https://github.com/dotnet/runtime/issues/121193) for more details. This issue will be fixed in a future servicing release for .NET 10.

### Available Workarounds

Using a concrete `T[]` array instead of `IEnumerable<T>` for the configuration property works around this issue.

## macOS PKG installers missing executable bit on `createdump`

SDK and runtime installers for macOS install a `createdump` binary that lacks the executable bit. This means that scenarios that request a dump (test hang collector, `dotnet-dump collect`, collecting dumps on crash through environment variable, etc.) will fail with an error indicating that `createdump` cannot be executed.

### Available Workaround for createdump

- Add the executable bit to `shared/Microsoft.NETCore.App/10.0.0/createdump` manually using `chmod +x`
- Use another runtime hosting mechanism (self-contained app, use a tarball installation of the runtime/SDK)

## Debian 13 packages work but display TAR header warnings

.NET 10.0 packages for Debian 13 (Trixie) are functional and install successfully. However, during installation, users may see multiple warnings like `W: Unknown TAR header type 120`. These warnings are cosmetic and do not affect the functionality of the installed .NET SDK or runtime. We are actively working to resolve these warnings in a future update.

For installation instructions, see [Install .NET on Debian](https://learn.microsoft.com/dotnet/core/install/linux-debian).

## .NET SDK

### `dotnet --info` output is poorly formatted in some terminal windows

This affects 10.0.102 and should be fixed in 10.0.103. The impact is on Windows using the built in console host (conhost.exe), but the issue does not affect Windows Terminal, or when redirecting output to a file or captured as a child process.

The information is all there but the tabbing of all information from the .NET native host is off.

### `dotnet workload` commands broken on upgrade of package manager SDKs after installing a workload

Installing workloads like wasm-tools depends on manifests in the dotnet/sdk-manifests folder. When we install, we assume those files are there until we remove them but they were installed by the .NET SDK install. When upgrading with a package manager, the files we're using in sdk-manifest get removed and the .NET SDK cannot recover with existing commands. This won't affect installs from zips or tars, Mac PKG installs, or Windows admin installs as the manifests should be left behind for those scenarios.

**Error message:** _Workload manifest microsoft.net.workload.mono.toolchain.net8: 10.0.100/10.0.100 from workload version 10.0.100.1 was not installed. Running "dotnet workload repair" may resolve this._

Impacts 10.0.101 and newer .NET SDK versions.

**Workaround**: `dotnet workload config --update-mode manifests` then `dotnet workload update`. After that you can switch back to workload-set updates or stick with manifest until this is resolved. You may need to delete the dotnet/metadata folder as well.

Alternatively, you can install the previous SDK that included the manifests that are missing, then update, then uninstall that SDK.
