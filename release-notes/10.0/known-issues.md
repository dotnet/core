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

## `dotnet.config` will be removed in favor of `global.json`

In .NET 10, we introduced `dotnet.config` file that is used to set the test runner and is the way to opt-in using `dotnet test` for Microsoft.Testing.Platform. This is already shipping in RC1, but will be removed in RC2.

The `dotnet.config` used to look like:

```ini
[dotnet.test.runner]
name = "Microsoft.Testing.Platform"
```

With `global.json`, this becomes:

```json
{
  "test": {
    "runner": "Microsoft.Testing.Platform"
  }
}
```

A `global.json` that sets SDK version along with the test runner will look like:

```json
{
  "sdk": {
    "version": "<version>"
  },
  "test": {
    "runner": "Microsoft.Testing.Platform"
  }
}
```

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
