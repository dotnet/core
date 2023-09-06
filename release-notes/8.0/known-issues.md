# .NET 8.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET SDK

### [8.0.100-preview.7] .NET 8 preview 7 SDK is not compatible with Visual Studio 17.6

Please upgrade to 17.7.0 or 17.8-preview1 or use [global.json](https://learn.microsoft.com/dotnet/core/tools/global-json) to pin to the 7.0.400 SDK that is included with 17.6.

```
SDK Resolver Failure: "The SDK resolver "Microsoft.DotNet.MSBuildSdkResolver" failed while attempting to resolve the SDK "Microsoft.Net.Sdk". Exception: "System.IO.FileNotFoundException: Could not find file '...\sdk-manifests\8.0.100-rc.1\microsoft.net.workload.emscripten.current\WorkloadManifest.json'.
File name: '...\sdk-manifests\8.0.100-rc.1\microsoft.net.workload.emscripten.current\WorkloadManifest.json'
```

## .NET MAUI

For details about known issues, please refer to the individual repositories:

- [.NET MAUI](https://github.com/dotnet/maui/wiki/Known-Issues/)
- [Android](https://github.com/xamarin/xamarin-android/wiki/Known-issues-in-.NET)
- [iOS and macOS](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET8)

## Native AOT Support in .NET

For details about known issues, please reference to [the pinned issue](https://github.com/dotnet/core/issues/8288) in this repo.
