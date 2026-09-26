# MSBuild in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 includes new MSBuild features & enhancements:

- [Multithreaded mode progress](#multithreaded-mode-progress)
  - [Typed task parameters: AbsolutePath, FileInfo, DirectoryInfo, ITaskItem\<T\>](#typed-task-parameters-absolutepath-fileinfo-directoryinfo-itaskitemt)
  - [TaskEnvironment injection via task constructors](#taskenvironment-injection-via-task-constructors)
  - [MSBuild Server improvements](#msbuild-server-improvements)
- [Task-host environment sent as a delta](#task-host-environment-sent-as-a-delta)
- [Partial (stop-after-pass) project evaluation](#partial-stop-after-pass-project-evaluation)
- [Faster metadata expansion](#faster-metadata-expansion)
- [Trim/AOT-clean evaluation object model](#trimaot-clean-evaluation-object-model)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

These features continue the .NET 11 work on [multithreaded execution](https://github.com/dotnet/msbuild/blob/main/documentation/specs/multithreading/multithreaded-msbuild.md), MSBuild Server, and evaluation performance introduced in earlier previews.

## Multithreaded mode progress

Preview 6 made MSBuild Server a prerequisite for the experimental `-mt` (`-multithreaded`) build mode, enabling it automatically. Preview 7 hardens the rest of the `-mt` stack: task typing, task construction, task-host transport, and the server itself.

```shell
dotnet build -mt
# or
dotnet msbuild -mt MySolution.sln
```

`-mt` runs a build's projects concurrently inside a single MSBuild process instead of spawning one worker process per node. Each task's execution location still depends on whether it has declared itself thread-safe:

- Tasks annotated `[MSBuildMultiThreadableTask]` are trusted not to mutate global process state — current directory, environment variables — so they run **in-process**, sharing the build process with everything else. They also implement `IMultiThreadableTask` to receive their per-task `TaskEnvironment`, a safe stand-in for the process-level current-directory/environment-variable APIs that stop being reliable once multiple projects build concurrently in the same process. The attribute, not the interface, is what the engine checks to decide in-process eligibility.
- Every other task keeps its existing assumption that it owns the whole process, so it runs isolated in a long-lived **sidecar `TaskHost`** dedicated to its node. Existing tasks keep working unmodified under `-mt`; they're just slower than their thread-safe counterparts because of the added process hop.

`-mt` builds use warm JIT/SDK-resolution state and Server GC to maximize their performance gains, so `-mt` treats [MSBuild Server](#msbuild-server-improvements) as a prerequisite and enables it whenever `MSBUILDUSESERVER` isn't set explicitly; Preview 7 closes the last gap so that still holds even when node reuse is disabled.

This preview rounds out the pieces around that model, each covered in more detail below:

- [Typed task parameters](#typed-task-parameters-absolutepath-fileinfo-directoryinfo-itaskitemt) let in-process tasks bind `AbsolutePath`, `FileInfo`, `DirectoryInfo`, and generic `ITaskItem<T>` parameters, validated against the task's own `TaskEnvironment` instead of process-wide current-directory state.
- [Constructor injection of `TaskEnvironment`](#taskenvironment-injection-via-task-constructors) lets an in-process task compute environment-dependent default values before `Execute()` runs.
- [Task-host communication](#task-host-environment-sent-as-a-delta) got leaner, cutting redundant environment payloads between the engine and sidecar `TaskHost`s.
- NuGet's `RestoreTask` is back on the same task-host routing every other task uses, so restore participates normally under `-mt` and MSBuild Server again — see [Breaking changes](#breaking-changes) if your host relied on the Preview 5 workaround APIs.

Recent runs on the project's [performance dashboard](https://alesprokop.github.io/msbuild/#trends/orchard-core/7d) show what this buys in practice: over the last week, a from-scratch `-t:Rebuild` of OrchardCore's solution averaged 26% faster wall-clock time with `-mt` on Windows (146.2 s → 107.8 s) and 23% faster on Linux (118.8 s → 91.5 s).

### Typed task parameters: AbsolutePath, FileInfo, DirectoryInfo, ITaskItem\<T\>

Multithreaded tasks can now declare parameters and outputs as strongly-typed path values instead of `string` or `ITaskItem` ([dotnet/msbuild #13971](https://github.com/dotnet/msbuild/pull/13971), [dotnet/msbuild #13974](https://github.com/dotnet/msbuild/pull/13974)). The engine validates path values as absolute during binding — using the task's `TaskEnvironment` rather than process-wide current-directory state — which is a prerequisite for correct behavior when tasks run concurrently.

Supported parameter types are `AbsolutePath` (new value type in `Microsoft.Build.Framework`), `System.IO.FileInfo`, `System.IO.DirectoryInfo`, and the new generic `ITaskItem<T>` where `T` is one of those path types or a directly-parsed value type (`string`, `bool`, `char`, numeric primitives, `decimal`, `DateTime`).

```csharp
using Microsoft.Build.Framework;
using Microsoft.Build.Utilities;
using System.IO;

public sealed class HashInputs : Task, IMultiThreadableTask
{
    public TaskEnvironment TaskEnvironment { get; set; } = null!;

    [Required]
    public AbsolutePath OutputFile { get; set; }

    [Required]
    public ITaskItem<FileInfo>[] Sources { get; set; } = [];

    public override bool Execute()
    {
        foreach (var item in Sources)
        {
            FileInfo file = item.Value;   // typed access, no ItemSpec parsing
            // ...
        }
        return true;
    }
}
```

A Roslyn analyzer package to guide task authors through this migration — flagging patterns like `new AbsolutePath(prop)`, `item.ItemSpec` passed to a path-type constructor, and unbindable or culture-sensitive `ITaskItem<T>` type arguments — is planned for a future release.

### TaskEnvironment injection via task constructors

Multithreaded tasks receive their per-invocation `TaskEnvironment` on the `IMultiThreadableTask.TaskEnvironment` property. The engine assigns that property *after* the constructor runs, so a task that needs the environment to compute default values had no place to do it — field and property initializers can't reference the instance property, and the constructor would only see `null`.

The engine now looks for a public instance constructor that takes a single `TaskEnvironment` parameter and invokes it with the current environment when present, falling back to the parameterless constructor otherwise ([dotnet/msbuild #14315](https://github.com/dotnet/msbuild/pull/14315)). This lets tasks compute environment-dependent default values during construction:

```csharp
// The engine passes the per-invocation TaskEnvironment to this primary constructor.
[MSBuildMultiThreadableTask]
public sealed class ComputeDefaults(TaskEnvironment taskEnvironment) : Task, IMultiThreadableTask
{
    public TaskEnvironment TaskEnvironment { get; set; } = taskEnvironment;

    public DirectoryInfo IntermediateOutputDir { get; } = new(taskEnvironment.GetAbsolutePath("obj").Value);

    public override bool Execute() => true;
}
```

`ComputeDefaults` declares only the `TaskEnvironment`-parameter constructor — a parameterless constructor is not required. When the engine constructs a task outside its normal in-process build path (the out-of-proc task host, or a host that instantiates the task directly), it supplies `TaskEnvironment.Fallback` — a shared, process-backed environment — to that same constructor, so it runs safely everywhere the engine can run the task.

> [!WARNING]
> A task that moves *exclusively* to constructor-injection of `TaskEnvironment` — dropping its parameterless constructor entirely — won't load in older MSBuild hosts, such as SDKs earlier than .NET 11 or Visual Studio versions that ship before the November release. Keep a parameterless constructor alongside the `TaskEnvironment` one until you can require a minimum MSBuild version that supports this pattern.

### MSBuild Server improvements

`-mt` builds lean on MSBuild Server for warm caches and Server GC, so Preview 7 rounds out the server itself:

- **Server GC is available even with `-nr:false`.** MSBuild Server is the only way to get Server GC, which `-mt` builds depend on for performance, so `-mt` now uses the server even when node reuse is disabled. To honor the no-reuse intent, a new short-lived server tears itself down immediately after the build completes ([dotnet/msbuild #14248](https://github.com/dotnet/msbuild/pull/14248)). Non-`-mt` builds still disqualify the server when `-nr:false` is set (unchanged).
- **Structured server-lifecycle logging.** A dedicated `MSBuildServerLifecycleEventArgs` build event reports whether the server was spawned, spawned short-lived, reused, or not used for a given build, along with the server process ID — useful for diagnosing an unexpected cold start or a "why didn't the server engage" question. The event is logged at low importance so it appears in binary logs and at `-v:diag` without changing default console output ([dotnet/msbuild #14156](https://github.com/dotnet/msbuild/pull/14156)).
- **Nested MSBuild processes no longer deadlock.** The coordinator protocol now supports nested grants, so a build spawned by a task that itself invokes MSBuild can run without waiting on the outer coordinator ([dotnet/msbuild #14224](https://github.com/dotnet/msbuild/pull/14224)).
- **Harder client-side error handling.** Unexpected exceptions during the initial server-connection handshake are caught and reported cleanly instead of aborting the client with an unhandled exception ([dotnet/msbuild #14292](https://github.com/dotnet/msbuild/pull/14292)).

## Task-host environment sent as a delta

Sidecar `TaskHost`s previously received the full build process environment (~6 KB) inside every `TaskHostConfiguration` packet and echoed it back inside every `TaskHostTaskComplete`, dominating task-host traffic on large multithreaded builds. Under a negotiated wire format (packet version 5), the environment is now sent in full only once per task-host connection; unchanged environments are represented by a 1-byte marker on both the forward and return paths ([dotnet/msbuild #14126](https://github.com/dotnet/msbuild/pull/14126)). No project-file or task changes are required.

Here's what this looks like for a build of Orchard Core, which had 17,975 external-task-host Task invocations:

| Task-host IPC payload (forward + return) | Baseline | After | Saved |
| --- | ---: | ---: | ---: |
| Build process environment | 122.0 MB | 0.1 MB | ≈122 MB (−99.8%) |

## Partial (stop-after-pass) project evaluation

MSBuild evaluation runs in five passes: properties + imports, item definitions, items, `UsingTask`s, and targets. Callers that only need data from an early pass previously paid for all five. `ProjectInstance` now accepts an opt-in `ProjectEvaluationStage` that stops evaluation after a chosen pass ([dotnet/msbuild #14290](https://github.com/dotnet/msbuild/pull/14290), [dotnet/msbuild #14340](https://github.com/dotnet/msbuild/pull/14340)):

| `ProjectEvaluationStage` | Stops after |
| --- | --- |
| `Properties` | pass 1 (properties + imports) |
| `ItemDefinitions` | pass 2 |
| `Items` | pass 3 |
| `UsingTasks` | pass 4 |
| `Full` (default) | pass 5 (targets) |

Property values are final after pass 1, so a stop-at-`Properties` evaluation returns the same property values as a full evaluation without registering any targets.

```csharp
using Microsoft.Build.Definition;
using Microsoft.Build.Evaluation;
using Microsoft.Build.Execution;

var options = new ProjectOptions { EvaluationStage = ProjectEvaluationStage.Properties };
var project = ProjectInstance.FromFile("MyApp.csproj", options);

Console.WriteLine(project.GetPropertyValue("TargetFramework"));
Console.WriteLine(project.EvaluationStage);   // Properties
Console.WriteLine(project.Targets.Count);     // 0 — targets pass was skipped
```

Partial evaluation is exposed on `ProjectInstance` only. The mutable, cached `Project` type would silently upgrade a partial evaluation to a full one (or hand back stale partial state), so passing a non-`Full` stage to `Project.FromFile`/`FromProjectRootElement`/`FromXmlReader` throws `ArgumentException`.

The MSBuild CLI uses this internally: in .NET 11, `msbuild -getProperty:Foo` (no `-target`) stops after the properties pass, and `msbuild -getItem:Bar` stops after the items pass, skipping the later `UsingTask` and target-registration passes ([dotnet/msbuild #14296](https://github.com/dotnet/msbuild/pull/14296)). Measured on a small solution registering 547 targets on full evaluation, `-getProperty` was ~15% faster and allocated ~22% less, and `-getItem` was ~7% faster and allocated ~10% less — projects with more targets or imports see a bigger win. Set `MSBUILDDISABLEFEATURESFROMVERSION=18.10` to restore the historical full evaluation.

## Faster metadata expansion

Metadata expression expansion (the `%(...)` syntax used everywhere in targets) was implemented with `Regex.Replace` plus a `MatchEvaluator` delegate, allocating on every expansion. The expander now uses a zero-allocation `ref struct` scanner that walks the expression character by character ([dotnet/msbuild #14116](https://github.com/dotnet/msbuild/pull/14116)):

| Benchmark | Baseline | After | Speedup | Allocated (before → after) |
| --- | ---: | ---: | ---: | --- |
| `Metadata_Unqualified` | 413 ns | 124 ns | 3.3× | 624 B → 0 B |
| `Metadata_Qualified` | 496 ns | 208 ns | 2.4× | — |

There is no opt-out; the fast path is on by default in Preview 7.

## Trim/AOT-clean evaluation object model

`Microsoft.Build`'s evaluation object model is now trim- and Native-AOT-capable ([dotnet/msbuild #14064](https://github.com/dotnet/msbuild/pull/14064)); reflection-heavy paths, especially property-function receiver-type discovery, were rewritten to work under trimming without warnings ([dotnet/msbuild #14079](https://github.com/dotnet/msbuild/pull/14079)). Evaluation itself is fully AOT-clean without host cooperation, but open-world reflective paths — loading tasks, SDK resolvers, loggers, or build checks by name — and task execution generally still require closed-world registration, failing observably at run time rather than silently when it's missing.

The `dotnet` CLI is expected to build on this in a future release: [dotnet/sdk #55497](https://github.com/dotnet/sdk/pull/55497) is enabling MSBuild-backed commands (`build`, `publish`, `pack`, `restore`, `clean`, `msbuild`) in a Native AOT-compiled CLI.

## Breaking changes

- **`Project.FromFile` (and `FromProjectRootElement`/`FromXmlReader`) rejects partial evaluation.** Passing `ProjectOptions.EvaluationStage` other than `Full` now throws `ArgumentException` on the mutable `Project` type. Use `ProjectInstance.FromFile` for partial evaluation ([dotnet/msbuild #14340](https://github.com/dotnet/msbuild/pull/14340)).
- **NuGet `RestoreTask` uses normal task-host routing again.** Preview 5's transient-`TaskHost` workaround for NuGet's static singleton state (`PluginManager`, `EnvironmentWrapper`) has been removed; `RestoreTask` now follows the same host routing as every other task under `-mt` and MSBuild Server ([dotnet/msbuild #14297](https://github.com/dotnet/msbuild/pull/14297)). Hosts that relied on `BuildParameters.IsLongLivedHost` / `MarkProcessAsLongLivedHost()` need to remove those calls — those APIs are gone.

## Bug fixes

- **Build engine**
  - [Serialize BuildRequestConfiguration.RequestedTargets to fix solution metaproject MSB4057 in parallel builds](https://github.com/dotnet/msbuild/pull/14223)
  - [Fix FindPublicMethodBySignature matching static methods for instance calls](https://github.com/dotnet/msbuild/pull/14191)
  - [Fix existence cache kind poisoning](https://github.com/dotnet/msbuild/pull/14249)
  - [Fix MSBuild producing different output paths for absolute and relative path inputs](https://github.com/dotnet/msbuild/pull/13752)
- **Tasks & task host**
  - [Fix NET task host MSB4216 handshake failure via child-side salt widening](https://github.com/dotnet/msbuild/pull/14027)
  - [Handle null task type in OutOfProc task host to avoid NullReferenceException](https://github.com/dotnet/msbuild/pull/14007)
  - [Fix WriteLinesToFile rewriting unchanged file when custom encoding is used](https://github.com/dotnet/msbuild/pull/14146)
  - [Refresh copy marker when implementation output changes](https://github.com/dotnet/msbuild/pull/14231)
- **Logging**
  - [Fix EmbedInBinlog items with relative paths from child projects](https://github.com/dotnet/msbuild/pull/13990)
  - [Fix forwarding logger issue](https://github.com/dotnet/msbuild/pull/14396)
- **.NET Framework host**
  - [Remove `FEATURE_LEGACY_GETFULLPATH` and use `Microsoft.IO.Path.GetFullPath` in .NET Framework](https://github.com/dotnet/msbuild/pull/13769)

## Community contributors

Thank you contributors! ❤️

- [@huulinhnguyen-dev](https://github.com/dotnet/msbuild/pulls?q=is%3Apr+is%3Amerged+author%3Ahuulinhnguyen-dev)
- [@teo-tsirpanis](https://github.com/dotnet/msbuild/pulls?q=is%3Apr+is%3Amerged+author%3Ateo-tsirpanis)
