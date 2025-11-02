# SDK in .NET 10 RC 2 - Release Notes

Here's a summary of what's new in SDK in this RC 2 release:

- [Use .NET MSBuild Tasks with .NET Framework MSBuild](#use-net-msbuild-tasks-with-net-framework-msbuild
- [What's new in the .NET Runtime in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation
- (Changelog link to be updated when tag is available)

.NET 10 RC 2:

- [Discussion](https://aka.ms/dotnet/10/rc2)
- [Release notes](README.md)
- [Runtime release notes](runtime.md)
- [Libraries release notes](libraries.md)

## Use .NET MSBuild Tasks with .NET Framework MSBuild

MSBuild is the underlying build system for .NET, driving both build of projects (as seen in commands like
`dotnet build` and `dotnet pack`), as well as acting as a general provider of information about projects
(as seen in commands like `dotnet list package`, and implicitly used by commands like `dotnet run` to
discover how a project wants to be executed).

When running `dotnet` CLI commands, the version of MSBuild that is used is the one that is shipped with the .NET SDK.
However, when using Visual Studio, or invoking MSBuild directly, the version of MSBuild that is used is the one that
is installed with Visual Studio. This has a few important differences, the _most_ important of which is that MSBuild
running in Visual Studio (or through `msbuild.exe`) is a .NET Framework application, while MSBuild running in the
`dotnet` CLI is a .NET application. This means that any MSBuild tasks that are written to run on .NET cannot be used
when building in Visual Studio or when using `msbuild.exe`.

Until this release! Starting with .NET 10, `msbuild.exe` and Visual Studio 2026 will be able to run MSBuild tasks
that are built for .NET. This means that you can now use the same MSBuild tasks when building in Visual Studio or
using `msbuild.exe` as you do when building with the `dotnet` CLI. For most .NET users, this won't change anything,
but for authors of custom MSBuild tasks, this means that you can now write your tasks to target .NET and have them
work everywhere. Our goal with this change is to make it easier to write and share MSBuild tasks, and to allow
task authors to take advantage of the latest features in .NET - in addition to reducing the difficulties around
multi-targeting tasks to support both .NET Framework and .NET, and dealing with versions of .NET Framework dependencies
that are implicitly-available in the MSBuild .NET Framework execution space.

### Configuring .NET Tasks

For Task Authors, opting in to this new behavior should be pretty simple - all it should take is changing
your `UsingTask` declaration to tell MSBuild about your Task.

```xml
<UsingTask TaskName="MyTask"
    AssemblyFile="path\to\MyTask.dll"
    Runtime="NET"                 # This is new!
    TaskFactory="TaskHostFactory" # And so is this!
/>
```

The `Runtime="NET"` and `TaskFactory="TaskHostFactory"` attributes tell the MSBuild engine how to run the Task:

- `Runtime="NET"` tells MSBuild that the Task is built for .NET (as opposed to .NET Framework)
- `TaskFactory="TaskHostFactory"` tells MSBuild to use the `TaskHostFactory` to run the Task, which is an existing capability of MSBuild that allows tasks to be run out-of-process.

### Caveats and performance tuning

The above example is the simplest way to get started using .NET Tasks in MSBuild, but it has some limitations -
because the `TaskHostFactory` always runs tasks out-of-process, our new .NET Task will always run in a separate
process from MSBuild. This means that there is some minor overhead to running the Task because the MSBuild engine
and the Task communicate over inter-process communication (IPC) instead of in-process communication. For most tasks,
this overhead will be negligible, but for tasks that are run many times in a build, or that do quite a lot of
logging, this overhead may be more significant.

With just a bit more work, the Task can be configured to still run in-process when running via `dotnet`:

```xml
<UsingTask TaskName="MyTask"
    AssemblyFile="path\to\MyTask.dll"
    Runtime="NET"
    TaskFactory="TaskHostFactory"
    Condition="$(MSBuildRuntimeType) == 'Full'" # Applies to Visual Studio and msbuild.exe
/>
<UsingTask TaskName="MyTask"
    AssemblyFile="path\to\MyTask.dll"
    Runtime="NET"
    Condition="$(MSBuildRuntimeType) == 'Core'" # Applies to the `dotnet` CLI
/>
```

Thanks to the `Condition` feature of MSBuild, you can load a Task differently depending on whether MSBuild is running in .NET
Framework (Visual Studio or `msbuild.exe`) or .NET (the `dotnet` CLI). In this example, the Task will run out-of-process when
running in Visual Studio or `msbuild.exe`, but will run in-process when running in the `dotnet` CLI. This gives the best
performance when running in the `dotnet` CLI, while still allowing the Task to be used in Visual Studio and `msbuild.exe`.
A [future version](https://github.com/dotnet/msbuild/pull/12642) will simplify this syntax so that only the `Runtime="NET"`
addition is required.

There are also small technical limitations to be aware of when using .NET Tasks in MSBuild - the most notable of which is
that the `Host Object` feature of MSBuild Tasks is [not yet supported](https://github.com/dotnet/msbuild/issues/11510) for .NET
Tasks running out-of-process. This means that if your Task relies on a Host Object, it will not work when running in Visual Studio
or `msbuild.exe`. We are actively working on adding support for Host Objects in future releases.

> [!IMPORTANT]
> Support for `Runtime="NET"` is only available in Visual Studio 2026/MSBuild.exe version 18.0 and above.

Loading a Task declared with `Runtime="NET"` in an earlier version of Visual Studio or MSBuild.exe will result in an error like the following:

```text
System.AggregateException: One or more errors occurred. ---> Microsoft.Build.Exceptions.BuildAbortedException: Build was canceled.
 MSBuild.exe could not be launched as a child node as it could not be found at the location "C:\Program Files\Microsoft Visual Studio\2026\Preview\MSBuild\Current\Bin\amd64\MSBuild.dll". If necessary, specify the correct location in the BuildParameters, or with the MSBUILD_EXE_PATH environment variable.
 at Microsoft.Build.BackEnd.NodeLauncher.StartInternal(String msbuildLocation, String commandLineArgs)
 at Microsoft.Build.BackEnd.NodeLauncher.DisableMSBuildServer(Func`1 func)
 at Microsoft.Build.BackEnd.NodeProviderOutOfProcBase.<>c__DisplayClass14_0.<GetNodes>g__StartNewNode|2(Int32 nodeId)
 at Microsoft.Build.BackEnd.NodeProviderOutOfProcBase.<>c__DisplayClass14_0.<GetNodes>b__0(Int32 nodeId)
```

For this reason, you will likely need two `UsingTask` elements for each Task you want to load:

- one comparing against `MSBuild::VersionGreaterThanOrEquals('$(MSBuildVersion)', '18.0.0')` for environments that support the .NET TaskHost
- one comparing against `MSBuild::VersionLessThan('$(MSBuildVersion)', '18.0.0')` for environments that do not support the .NET TaskHost

If you don't do this UsingTask-based version detection, then you should have some other kind of version-checking that issues
some kind of warning message to a user that they are using an unsupported configuration

### Future work

This is the first step in a longer journey to make MSBuild more flexible and capable.
In future releases, we plan to add additional capabilities to MSBuild to make it easier to write and use .NET Tasks, including:

- Automatically discovering and loading .NET Tasks without needing to specify `Runtime` or `TaskFactory` metadata
- Reducing the performance overhead of IPC between the MSBuild Engine and the Tasks when running out-of-process
- Supporting the `Host Object` feature for .NET Tasks running out-of-process

Task Authors, give this a try and reach out to us with feedback at [dotnet/msbuild](https://github.com/dotnet/msbuild/issues/new).
We're excited to enable a simpler way of working with MSBuild Tasks for everyone (including ourselves)!
