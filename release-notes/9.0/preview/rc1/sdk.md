# SDK updates in .NET 9 Release Candidate 1

Here's a summary of what's new in the .NET SDK in this release:

* [Workload History](#workload-history)

SDK updates in .NET 9 Release Candidate 1:

* [Release notes](sdk.md)
* [What's new in the .NET Runtime in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Release Candidate 1:

* [Discussion](https://aka.ms/dotnet/9/rc1)
* [Release notes](README.md)
* [Libraries release notes](libraries.md)

## Feature

### Workload History

.NET SDK Workloads are an integral part of key experiences like MAUI and WASM, and in their default configuration can be updated independently as .NET Tooling authors release new versions. In addition, .NET SDK installations done through Visual Studio install a parallel set of versions. Without taking care, the workload installation status of a given .NET SDK install can drift over time, but there hasn't been a way to visualize this drift over time.

To address this, we've added a new `dotnet workload history` command to the .NET SDK. This command will show the history of workload installations or modifications for a given .NET SDK installation, including the versions of the workloads that were installed, and when they were installed. This command will help you understand the drift in workload installations over time, and help you make informed decisions about which workloads versions to set your installation to. Let's see it in action. Think of it like the `git reflog` for workloads.

```shell
> dotnet workload history

Id  Date                         Command       Workloads                                        Global.json Version  Workload Version
-----------------------------------------------------------------------------------------------------------------------------------------------
1   1/1/0001 12:00:00 AM +00:00  InitialState  android, ios, maccatalyst, maui-windows                               9.0.100-manifests.6d3c8f5d
2   9/4/2024 8:15:33 PM -05:00   install       android, aspire, ios, maccatalyst, maui-windows                       9.0.100-rc.1.24453.3
```

Running `dotnet workload history` will print out a table of the history of workload installations or modifications for the current .NET SDK installation. The table will show key information like the date of the installation or modification, the command that was run, the workloads that were installed or modified, and the relevant version(s) for the command.
The most important piece of information is the _id_ - this can be used in the `dotnet workload update` command with the `--from-history` option (for example `dotnet workload update --from-history 3` to return to loose manifest mode) to tell the SDK to return to the state at that version. This can be useful if you want to revert to a previous state for any reason.

In this example, I had an SDK installation with the initial state of the android, ios, maccatalyst, and maui-windows workloads installed. I then ran `dotnet workload install aspire --version 9.0.100-rc.1.24453.3` to install the aspire workload and switch to workload sets mode, and the history command shows that the installation was successful. If I want to return to the previous state for any reason, I can use the _id_ from the history table to do so: `dotnet workload update --from-history 1`.
