# .NET 8 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET SDK

### [8.0.4xx] `dotnet workload restore` with a workload set configured in the global.json will not work

8.0.4xx doesn't support restoring a workload set listed in a global.json file. See the [documentation](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-workload-sets#use-globaljson-for-the-workload-set-version) for more details on the scenario of pinning a workload version.

**Error**
`Unhandled exception: Microsoft.Build.Exceptions.InvalidProjectFileException: SDK Resolver Failure: "The SDK resolver "Microsoft.DotNet.MSBuildWorkloadSdkResolver" failed while attempting to resolve the SDK "Microsoft.NET.SDK.WorkloadAutoImportPropsLocator". 
Exception: "System.IO.FileNotFoundException: Workload version 8.0.401, which was specified in <path>\global.json, was not found. Run "dotnet workload restore" to install this workload version.`

**Workaround**
Run `dotnet workload update` first to get the workload set instaleld and then run `dotnet workload restore` after to install the required workloads.
