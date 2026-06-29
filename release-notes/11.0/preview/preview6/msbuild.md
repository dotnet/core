# MSBuild in .NET 11 Preview 6 - Release Notes

<!-- Verified against changes.json for .NET 11 Preview 6 (SDK 11.0.100-preview.6.26328.106) -->

.NET 11 Preview 6 includes new MSBuild features & enhancements:

- [Parallel project evaluation](#parallel-project-evaluation)
- [Multithreaded builds auto-engage MSBuild Server](#multithreaded-builds-auto-engage-msbuild-server)
- [Faster out-of-proc node communication](#faster-out-of-proc-node-communication)
- [Expose import tree as MSBuildImportedProject items](#expose-import-tree-as-msbuildimportedproject-items)
- [ProjectReferenceTargets available to all project types](#projectreferencetargets-available-to-all-project-types)
- [Full-graph mode for ProjectGraph construction](#full-graph-mode-for-projectgraph-construction)
- [C# `record` recognized in resource name generation](#c-record-recognized-in-resource-name-generation)
- [Additional multithreaded task migrations](#additional-multithreaded-task-migrations)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

These features continue the .NET 11 work on [Multithreaded execution](https://github.com/dotnet/msbuild/blob/main/documentation/specs/multithreading/multithreaded-msbuild.md), MSBuild Server, static graph builds, and evaluation performance.

## Parallel project evaluation

`ProjectCollection.LoadProject` now supports parallel evaluation ([dotnet/msbuild #12757](https://github.com/dotnet/msbuild/pull/12757)). Previously, a global lock serialized all concurrent `LoadProject` calls. The new implementation uses per-path locks so only loads of the *same* project path are serialized; distinct projects evaluate concurrently.

In benchmarks (200 distinct projects, 16 threads), parallel load median dropped from 1002 ms to 530 ms — a **1.9× speedup**.

```csharp
var collection = new ProjectCollection();
// Multiple threads can now load different projects concurrently
Parallel.ForEach(projectPaths, path =>
{
    collection.LoadProject(path); // per-path lock, not global
});
```

## Multithreaded builds auto-engage MSBuild Server

When you pass `-mt` (multithreaded), MSBuild Server is now automatically engaged without requiring `MSBUILDUSESERVER=1` ([dotnet/msbuild #13758](https://github.com/dotnet/msbuild/pull/13758)). This eliminates per-invocation JIT and SDK-resolution warm-up costs for `-mt` users. Set `MSBUILDUSESERVER=0` to opt out.

Additionally, the MSBuild Server process now runs with Server GC, providing ~10–13% faster builds on large solutions at the cost of ~300 MB additional peak working set ([dotnet/msbuild #14043](https://github.com/dotnet/msbuild/pull/14043)). Server GC is scoped to the server node only; worker nodes and TaskHosts retain Workstation GC.

| Configuration | Median build (233-project solution) |
|---|---|
| Workstation GC | 90.6 s |
| **Server GC** | **81.0 s** |

## Faster out-of-proc node communication

Under change wave 18.9, out-of-proc node pipe buffers default to 1 MB instead of the previous 128 KB ([dotnet/msbuild #14094](https://github.com/dotnet/msbuild/pull/14094)). In multithreaded builds where non-thread-safe tasks run in sidecar TaskHosts, the larger buffer reduces send-side backpressure by ~12×. Override with `MSBUILDNODECONNECTIONBUFFERSIZE` or opt out via `MSBUILDDISABLEFEATURESFROMVERSION=18.9`.

| Pipe buffer | Transport send time |
|---|---|
| 128 KB (old) | 114.2 s |
| **1 MB (new default)** | **9.0 s** |

## Expose import tree as MSBuildImportedProject items

Set `MSBuildProvideImportedProjects` to `true` and MSBuild synthesizes `MSBuildImportedProject` items from the full import closure during `ProjectInstance` construction ([dotnet/msbuild #13681](https://github.com/dotnet/msbuild/pull/13681)). Each item's identity is the imported file path, with `ImportingProjectPath` and `Sdk` metadata. Projects that do not set the property pay zero cost.

```xml
<PropertyGroup>
  <MSBuildProvideImportedProjects>true</MSBuildProvideImportedProjects>
</PropertyGroup>

<Target Name="ShowImports">
  <Message Text="%(MSBuildImportedProject.Identity) imported by %(MSBuildImportedProject.ImportingProjectPath)" />
</Target>
```

## ProjectReferenceTargets available to all project types

The core Build/Clean/Rebuild `ProjectReferenceTargets` protocol moved from `Microsoft.Managed.After.targets` to `Microsoft.Common.CurrentVersion.targets` ([dotnet/msbuild #13427](https://github.com/dotnet/msbuild/pull/13427)). Non-managed projects (C++, custom `.proj` files) that import the common targets now participate in `/graph /isolate` builds without `MSB4252` isolation violations. No project-file changes are required.

## Full-graph mode for ProjectGraph construction

A new `ProjectGraphMode.Full` option loads the entire dependency graph across all target frameworks in a single pass ([dotnet/msbuild #13717](https://github.com/dotnet/msbuild/pull/13717)). In this mode, `SetTargetFramework` metadata is ignored and all outer and inner builds are evaluated, which is useful for package resolution scenarios like NuGet restore.

```csharp
var graph = new ProjectGraph(
    new ProjectGraphOptions
    {
        EntryPoints = [new ProjectGraphEntryPoint("path")],
        Mode = ProjectGraphMode.Full
    });
```

## C# `record` recognized in resource name generation

`CreateCSharpManifestResourceName` now correctly derives the manifest resource name from files whose first top-level type is a `record` ([dotnet/msbuild #13870](https://github.com/dotnet/msbuild/pull/13870)). Previously, `record` was tokenized as a plain identifier, so sibling `.resx` files could produce wrong or missing resource names, breaking embedded resource lookup and satellite-assembly localization.

```csharp
// MyNs/Person.cs — Person.resx now correctly maps to MyNs.Person
namespace MyNs;
public record Person(string Name);
```

## Additional multithreaded task migrations

Preview 6 migrates more in-box tasks to the multithreaded execution model, removing their reliance on process-wide current-directory state:

- `Exec` ([dotnet/msbuild #13661](https://github.com/dotnet/msbuild/pull/13661))
- `FormatUrl` ([dotnet/msbuild #13825](https://github.com/dotnet/msbuild/pull/13825))
- `GenerateBindingRedirects` ([dotnet/msbuild #13771](https://github.com/dotnet/msbuild/pull/13771))
- `GenerateLauncher` ([dotnet/msbuild #13699](https://github.com/dotnet/msbuild/pull/13699))
- `LC` ([dotnet/msbuild #13786](https://github.com/dotnet/msbuild/pull/13786))
- `TlbImp` and `AxImp` ([dotnet/msbuild #13708](https://github.com/dotnet/msbuild/pull/13708))

<!-- Cut candidates:
- #13926 CS8618 suppressor for [Required] task properties — useful for task authors but narrow audience
- #13577 Terminal Logger shows enabled log paths — nice but diagnostic-verbosity-only in most cases
- #13653 MSBuild Coordinator — infrastructure, not user-configurable yet
-->

## Bug fixes

- **Build engine**
  - `ProjectGraph.ExpandDefaultTargets` now deduplicates target lists, preventing exponential graph explosion when duplicate markers appear in `ProjectReferenceTargets` metadata ([dotnet/msbuild #13855](https://github.com/dotnet/msbuild/pull/13855)).
  - `DrainPacketQueue` threads no longer leak in long-lived hosts when an error is swallowed before the exit check ([dotnet/msbuild #14135](https://github.com/dotnet/msbuild/pull/14135)).
  - `AbsolutePath.GetCanonicalForm` no longer consults process-wide current-directory state on Windows for root-relative or drive-relative paths, fixing determinism under multithreaded builds ([dotnet/msbuild #13788](https://github.com/dotnet/msbuild/pull/13788)).
- **Tasks**
  - `ToolTask` EOF pipe timeout increased from 2 s to 30 s, preventing silent output loss on loaded CI machines ([dotnet/msbuild #13767](https://github.com/dotnet/msbuild/pull/13767)).
  - `ToolTask` EOF wait replaced with a `CountdownEvent` to avoid `NotSupportedException` (`MSB4018`) on STA threads, such as `AspNetCompiler` ([dotnet/msbuild #13917](https://github.com/dotnet/msbuild/pull/13917)).
  - `TaskParameterTaskItem.ToString()` now returns the item-spec instead of the .NET type name, fixing task output marshaling under `-mt` ([dotnet/msbuild #14095](https://github.com/dotnet/msbuild/pull/14095)).
  - `ResolveAssemblyReference` metadata dispenser activation no longer fails with `CLR_E_SHIM_RUNTIMELOAD` in hosts that did not enter the CLR via mscoree ([dotnet/msbuild #13899](https://github.com/dotnet/msbuild/pull/13899)).
  - `MSB4216` error message now reports the actual launch path for `Runtime="NET"` task hosts when no app host is present ([dotnet/msbuild #13889](https://github.com/dotnet/msbuild/pull/13889)).
- **Logging**
  - Terminal Logger auto-detection now works correctly under MSBuild Server on Unix, consulting the client's transmitted console capabilities instead of the server node's redirected pipe ([dotnet/msbuild #14077](https://github.com/dotnet/msbuild/pull/14077)).
- **Globbing**
  - Symlink cycle detection no longer uses `String.Contains` for path-prefix checks, which could incorrectly skip files when one directory name was a prefix of another ([dotnet/msbuild #13901](https://github.com/dotnet/msbuild/pull/13901)).
- **Security**
  - Mark-of-the-Web handling now blocks `ResXFileRef` linked resources and typed entries when MotW metadata is present, and clarifies the `MSB3821` warning message ([dotnet/msbuild #14015](https://github.com/dotnet/msbuild/pull/14015)).

## Community contributors

Thank you contributors! ❤️

- [@jnyrup](https://github.com/dotnet/msbuild/pulls?q=is%3Apr+is%3Amerged+author%3Ajnyrup)
- [@pgoslatara](https://github.com/dotnet/msbuild/pulls?q=is%3Apr+is%3Amerged+author%3Apgoslatara)
