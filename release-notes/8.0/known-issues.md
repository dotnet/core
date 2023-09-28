# .NET 8.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET SDK

### [8.0.100-preview.7] .NET 8 preview 7 SDK is not compatible with Visual Studio 17.6

Please upgrade to 17.7.0 or 17.8-preview1 or use [global.json](https://learn.microsoft.com/dotnet/core/tools/global-json) to pin to the 7.0.400 SDK that is included with 17.6.

```
SDK Resolver Failure: "The SDK resolver "Microsoft.DotNet.MSBuildSdkResolver" failed while attempting to resolve the SDK "Microsoft.Net.Sdk". Exception: "System.IO.FileNotFoundException: Could not find file '...\sdk-manifests\8.0.100-rc.1\microsoft.net.workload.emscripten.current\WorkloadManifest.json'.
File name: '...\sdk-manifests\8.0.100-rc.1\microsoft.net.workload.emscripten.current\WorkloadManifest.json'
```

### [.NET SDK 8.0.1xx RC2] `dotnet tool restore` may fail with a file access exception when restoring multiple tools

When running `dotnet tool restore` with a tools config which contains multiple .NET tools, the command can fail with an exception similar to the following:

```
Unhandled exception: System.AggregateException: One or more errors occurred. (The process cannot access the file 'C:\Users\Username\AppData\Local\Temp\a75617cf-9767-45ca-aaed-34da2edd223e\project.assets.json' because it is being used by another process.)
 ---> System.IO.IOException: The process cannot access the file 'C:\Users\Username\AppData\Local\Temp\a75617cf-9767-45ca-aaed-34da2edd223e\project.assets.json' because it is being used by another process.
   at Microsoft.Win32.SafeHandles.SafeFileHandle.CreateFile(String fullPath, FileMode mode, FileAccess access, FileShare share, FileOptions options)
   at Microsoft.Win32.SafeHandles.SafeFileHandle.Open(String fullPath, FileMode mode, FileAccess access, FileShare share, FileOptions options, Int64 preallocationSize, Nullable`1 unixCreateMode)
   at System.IO.Strategies.OSFileStreamStrategy..ctor(String path, FileMode mode, FileAccess access, FileShare share, FileOptions options, Int64 preallocationSize, Nullable`1 unixCreateMode)
   at System.IO.Strategies.FileStreamHelpers.ChooseStrategyCore(String path, FileMode mode, FileAccess access, FileShare share, FileOptions options, Int64 preallocationSize, Nullable`1 unixCreateMode)
   at System.IO.FileStream..ctor(String path, FileMode mode, FileAccess access, FileShare share)
   at NuGet.ProjectModel.LockFileFormat.Write(String filePath, LockFile lockFile)
   at Microsoft.DotNet.Cli.ToolPackage.ToolPackageDownloader.CreateAssetFile(PackageId packageId, NuGetVersion version, DirectoryPath packagesRootPath, DirectoryPath assetFileDirectory, String runtimeJsonGraph, String targetFramework) in C:\git\dotnet-sdk-8\src\Cli\dotnet\ToolPackage\ToolPackageDownloader.cs:line 329
   at Microsoft.DotNet.Cli.ToolPackage.ToolPackageDownloader.<>c__DisplayClass8_0.<InstallPackage>b__0() in C:\git\dotnet-sdk-8\src\Cli\dotnet\ToolPackage\ToolPackageDownloader.cs:line 130
   at Microsoft.DotNet.Cli.TransactionalAction.Run[T](Func`1 action, Action commit, Action rollback) in C:\git\dotnet-sdk-8\src\Cli\dotnet\TransactionalAction.cs:line 84
   at Microsoft.DotNet.Cli.ToolPackage.ToolPackageDownloader.InstallPackage(PackageLocation packageLocation, PackageId packageId, VerbosityOptions verbosity, VersionRange versionRange, String targetFramework, Boolean isGlobalTool) in C:\git\dotnet-sdk-8\src\Cli\dotnet\ToolPackage\ToolPackageDownloader.cs:line 80
   at Microsoft.DotNet.Tools.Tool.Restore.ToolRestoreCommand.InstallPackages(ToolManifestPackage package, Nullable`1 configFile) in C:\git\dotnet-sdk-8\src\Cli\dotnet\commands\dotnet-tool\restore\ToolRestoreCommand.cs:line 127
   at Microsoft.DotNet.Tools.Tool.Restore.ToolRestoreCommand.<>c__DisplayClass10_0.<Execute>b__0(ToolManifestPackage package) in C:\git\dotnet-sdk-8\src\Cli\dotnet\commands\dotnet-tool\restore\ToolRestoreCommand.cs:line 96
   at System.Linq.Parallel.SelectQueryOperator`2.SelectQueryOperatorResults.GetElement(Int32 index)
   at System.Linq.Parallel.QueryResults`1.get_Item(Int32 index)
   at System.Linq.Parallel.PartitionedDataSource`1.ListContiguousIndexRangeEnumerator.MoveNext(T& currentElement, Int32& currentKey)
   at System.Linq.Parallel.StopAndGoSpoolingTask`2.SpoolingWork()
   at System.Linq.Parallel.SpoolingTaskBase.Work()
   at System.Linq.Parallel.QueryTask.BaseWork(Object unused)
   at System.Threading.ExecutionContext.RunFromThreadPoolDispatchLoop(Thread threadPoolThread, ExecutionContext executionContext, ContextCallback callback, Object state)
```

**Workarounds**

The error only occurs when there are multiple tools that have not been previously restored.  So to work around the issue, you can remove all but one tool from the `dotnet-tools.json` config file, and run `dotnet tool restore`.  Then add the tools back to the config file one at a time, running `dotnet tool restore` between each one.

If you are using .NET tools in CI where you can't easily modify the tools config file between multiple tool restores, you can create a separate `dotnet-tools.json` config file for each .NET tool in a separate subfolder.  Then run `dotnet tool restore` in each subfolder.


## .NET MAUI

For details about known issues, please refer to the individual repositories:

- [.NET MAUI](https://github.com/dotnet/maui/wiki/Known-Issues/)
- [Android](https://github.com/xamarin/xamarin-android/wiki/Known-issues-in-.NET)
- [iOS and macOS](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET8)

## Native AOT Support in .NET

For details about known issues, please reference to [the pinned issue](https://github.com/dotnet/core/issues/8288) in this repo.
