# MSBuild in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 includes new MSBuild features & enhancements:

- [Partial (stop-after-pass) project evaluation](#partial-stop-after-pass-project-evaluation)
- [Typed task parameters: AbsolutePath, FileInfo, DirectoryInfo, ITaskItem\<T\>](#typed-task-parameters-absolutepath-fileinfo-directoryinfo-itaskitemt)
- [TaskEnvironment injection via task constructors](#taskenvironment-injection-via-task-constructors)
- [Restore skips a redundant evaluation](#restore-skips-a-redundant-evaluation)
- [Faster metadata expansion](#faster-metadata-expansion)
- [Task-host build environment sent as a delta](#task-host-build-environment-sent-as-a-delta)
- [MSBuild Server improvements](#msbuild-server-improvements)
- [Trim/AOT-clean evaluation object model](#trimaot-clean-evaluation-object-model)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

These features continue the .NET 11 work on [multithreaded execution](https://github.com/dotnet/msbuild/blob/main/documentation/specs/multithreading/multithreaded-msbuild.md), MSBuild Server, and evaluation performance introduced in earlier previews.

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

The MSBuild CLI uses this internally: under change wave 18.10, `msbuild -getProperty:Foo` stops after pass 1 and `msbuild -getItem:Bar` stops after pass 3 when no `-target` is specified, skipping `UsingTask` and target registration ([dotnet/msbuild #14296](https://github.com/dotnet/msbuild/pull/14296)). Set `MSBUILDDISABLEFEATURESFROMVERSION=18.10` to restore the historical full evaluation.

## Typed task parameters: AbsolutePath, FileInfo, DirectoryInfo, ITaskItem\<T\>

Multithreaded tasks can now declare parameters and outputs as strongly-typed path values instead of `string` or `ITaskItem` ([dotnet/msbuild #13971](https://github.com/dotnet/msbuild/pull/13971), [dotnet/msbuild #13974](https://github.com/dotnet/msbuild/pull/13974)). The engine validates path values as absolute during binding — using the task's `TaskEnvironment` rather than process-wide current-directory state — which is a prerequisite for correct behavior when tasks run concurrently.

Supported parameter types are `AbsolutePath` (new value type in `Microsoft.Build.Framework`), `System.IO.FileInfo`, `System.IO.DirectoryInfo`, and the new generic `ITaskItem<T>` / `TaskItem<T>` where `T` is one of those path types or a directly-parsed value type (`string`, `bool`, `char`, numeric primitives, `decimal`, `DateTime`).

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

Four Roslyn analyzers ship alongside the engine support to guide task authors during migration:

- `MSBuildTask0006` — flags `new AbsolutePath(prop)` / `new FileInfo(prop)` patterns and offers a code fix that retypes the property ([dotnet/msbuild #13972](https://github.com/dotnet/msbuild/pull/13972)).
- `MSBuildTask0007` — flags `item.ItemSpec` being passed to a path-type constructor and offers a code fix to `ITaskItem<T>` ([dotnet/msbuild #13972](https://github.com/dotnet/msbuild/pull/13972)).
- `MSBuildTask0009` — warns when `ITaskItem<T>` uses a type that is not currently bindable at runtime ([dotnet/msbuild #13973](https://github.com/dotnet/msbuild/pull/13973)).
- `MSBuildTask0010` — errors on `ITaskItem<T>` type arguments parsed through `Convert.ChangeType` (`char`, numeric primitives, `decimal`, `DateTime`) because those conversions use `CultureInfo.InvariantCulture`, which may not match the task's intended culture. Bind as `ITaskItem<string>` and parse explicitly with the intended culture instead ([dotnet/msbuild #13974](https://github.com/dotnet/msbuild/pull/13974)).

The analyzers only fire on multithreaded tasks (classes implementing `IMultiThreadableTask` or annotated with `[MSBuildMultiThreadableTask]`).

## TaskEnvironment injection via task constructors

Multithreaded tasks receive their per-invocation `TaskEnvironment` on the `IMultiThreadableTask.TaskEnvironment` property. The engine assigns that property *after* the constructor runs, so a task that needs the environment to compute default values had no place to do it — field and property initializers can't reference the instance property, and the constructor would only see `null`.

The engine now looks for a public instance constructor that takes a single `TaskEnvironment` parameter and invokes it with the current environment when present, falling back to the parameterless constructor otherwise ([dotnet/msbuild #14315](https://github.com/dotnet/msbuild/pull/14315)). This lets tasks compute environment-dependent default values during construction:

```csharp
public sealed class ComputeDefaults : Task, IMultiThreadableTask
{
    public TaskEnvironment TaskEnvironment { get; set; }

    public DirectoryInfo IntermediateOutputDir { get; set; }

    // The engine passes the per-invocation TaskEnvironment to this constructor.
    public ComputeDefaults(TaskEnvironment env)
    {
        TaskEnvironment = env;
        IntermediateOutputDir = new DirectoryInfo(env.GetAbsolutePath("obj").Value);
    }

    public ComputeDefaults() : this(null!) { }

    public override bool Execute() => true;
}
```

A new analyzer `MSBuildTask0011` fires at `Info` severity on concrete `IMultiThreadableTask` implementations that do not expose a `TaskEnvironment`-parameter constructor, pointing task authors at the recommended pattern ([dotnet/msbuild #14401](https://github.com/dotnet/msbuild/pull/14401)).

## Restore skips a redundant evaluation

NuGet's restore targets re-invoke each project with the global property `ExcludeRestorePackageImports=true`, which MSBuild's initial restore evaluation did not set. The differing global-property set produced a distinct build configuration, forcing every project to be evaluated twice during a single restore.

Under change wave 18.10, `msbuild -restore` (and implicit restore) now sets `ExcludeRestorePackageImports=true` on its own evaluation so NuGet's inner MSBuild call reuses the initial one ([dotnet/msbuild #14274](https://github.com/dotnet/msbuild/pull/14274)). Static-graph restore already had this behavior; regular restore now matches. Set `MSBUILDDISABLEFEATURESFROMVERSION=18.10` to opt out.

The value casing matters: MSBuild compares global-property values case-sensitively, and NuGet passes literal lowercase `true`. MSBuild also passes lowercase `true` so the configurations match and the extra evaluation is dropped.

## Faster metadata expansion

Metadata expression expansion (the `%(...)` syntax used everywhere in targets) was implemented with `Regex.Replace` plus a `MatchEvaluator` delegate, allocating on every expansion. The expander now uses a zero-allocation `ref struct` scanner that walks the expression character by character ([dotnet/msbuild #14116](https://github.com/dotnet/msbuild/pull/14116)):

| Benchmark | Baseline | After | Speedup | Allocated (before → after) |
| --- | ---: | ---: | ---: | --- |
| `Metadata_Unqualified` | 413 ns | 124 ns | 3.3× | 624 B → 0 B |
| `Metadata_Qualified` | 496 ns | 208 ns | 2.4× | — |

There is no opt-out; the fast path is on by default in Preview 7.

## Task-host build environment sent as a delta

Out-of-proc task hosts previously received the full build process environment (~6 KB) inside every `TaskHostConfiguration` packet and echoed it back inside every `TaskHostTaskComplete`. On large multithreaded solution builds that redundancy dominated task-host traffic.

Under a negotiated wire format (packet version 5), the environment is sent in full only once per task-host connection; subsequent packets whose environment is unchanged carry a 1-byte "identical" marker instead, on both the forward and return paths ([dotnet/msbuild #14126](https://github.com/dotnet/msbuild/pull/14126)). No project-file or task changes are required.

## MSBuild Server improvements

Preview 6 auto-engaged MSBuild Server for `-mt` builds. Preview 7 rounds out that work:

- **Server GC is available even with `-nr:false`.** For `-mt`, MSBuild Server is the only way to get Server GC — which `-mt` builds depend on for performance — so `-mt` now uses the server even when node reuse is disabled. To honor the no-reuse intent, a new short-lived server tears itself down immediately after the build completes ([dotnet/msbuild #14248](https://github.com/dotnet/msbuild/pull/14248)). Non-`-mt` builds still disqualify the server when `-nr:false` is set (unchanged).
- **Structured server-lifecycle logging.** A dedicated `MSBuildServerLifecycleEventArgs` build event now reports whether the server was spawned, spawned short-lived, reused, or not used, along with the server process ID. The event is logged at low importance so it appears in binary logs and at `-v:diag` without changing default console output ([dotnet/msbuild #14156](https://github.com/dotnet/msbuild/pull/14156)).
- **Nested MSBuild processes no longer deadlock.** The coordinator protocol now supports nested grants, so a build spawned by a task that itself invokes MSBuild can run without waiting on the outer coordinator ([dotnet/msbuild #14224](https://github.com/dotnet/msbuild/pull/14224)).
- **Harder client-side error handling.** Unexpected exceptions during the initial server-connection handshake are caught and reported cleanly instead of aborting the client with an unhandled exception ([dotnet/msbuild #14292](https://github.com/dotnet/msbuild/pull/14292)).

## Trim/AOT-clean evaluation object model

`Microsoft.Build`'s evaluation object model is now trim- and Native-AOT-capable, so an AOT-compiled host (such as a future AOT `dotnet` CLI) can evaluate and build projects in-process ([dotnet/msbuild #14064](https://github.com/dotnet/msbuild/pull/14064)). Reflection-heavy paths — property functions and their receiver-type discovery, in particular — were rewritten to work under trimming without warnings ([dotnet/msbuild #14079](https://github.com/dotnet/msbuild/pull/14079)).

Open-world reflective paths (loading tasks, SDK resolvers, loggers, or build checks by name) fail observably at run time so a host can fall back to a JIT-based MSBuild instead of failing silently. Task execution in an AOT host requires closed-world registration; evaluation is fully AOT-clean without host cooperation.

## Breaking changes

- **`ExcludeRestorePackageImports=true` is set on restore evaluations.** Under change wave 18.10, `msbuild -restore` now passes `ExcludeRestorePackageImports=true` as a global property on the initial restore evaluation. Custom targets that branched on the absence of that property during restore will observe the new value. Set `MSBUILDDISABLEFEATURESFROMVERSION=18.10` to restore the previous behavior ([dotnet/msbuild #14274](https://github.com/dotnet/msbuild/pull/14274)).
- **`Project.FromFile` (and `FromProjectRootElement`/`FromXmlReader`) rejects partial evaluation.** Passing `ProjectOptions.EvaluationStage` other than `Full` now throws `ArgumentException` on the mutable `Project` type. Use `ProjectInstance.FromFile` for partial evaluation ([dotnet/msbuild #14340](https://github.com/dotnet/msbuild/pull/14340)).
- **NuGet `RestoreTask` uses normal task-host routing again.** Preview 5's transient-`TaskHost` workaround for NuGet's static singleton state (`PluginManager`, `EnvironmentWrapper`) has been removed; `RestoreTask` now follows the same host routing as every other task under `-mt` and MSBuild Server ([dotnet/msbuild #14297](https://github.com/dotnet/msbuild/pull/14297)). Hosts that relied on `BuildParameters.IsLongLivedHost` / `MarkProcessAsLongLivedHost()` need to remove those calls — those APIs are gone.

## Bug fixes

- [Serialize BuildRequestConfiguration.RequestedTargets to fix solution metaproject MSB4057 in parallel builds](https://github.com/dotnet/msbuild/pull/14223)
- [Fix FindPublicMethodBySignature matching static methods for instance calls](https://github.com/dotnet/msbuild/pull/14191)
- [Fix existence cache kind poisoning](https://github.com/dotnet/msbuild/pull/14249)
- [Fix MSBuild producing different output paths for absolute and relative path inputs](https://github.com/dotnet/msbuild/pull/13752)
- [Fix NET task host MSB4216 handshake failure via child-side salt widening](https://github.com/dotnet/msbuild/pull/14027)
- [Handle null task type in OutOfProc task host to avoid NullReferenceException](https://github.com/dotnet/msbuild/pull/14007)
- [Fix WriteLinesToFile rewriting unchanged file when custom encoding is used](https://github.com/dotnet/msbuild/pull/14146)
- [Refresh copy marker when implementation output changes](https://github.com/dotnet/msbuild/pull/14231)
- [Fix EmbedInBinlog items with relative paths from child projects](https://github.com/dotnet/msbuild/pull/13990)
- [Fix forwarding logger issue](https://github.com/dotnet/msbuild/pull/14396)
- [Remove `FEATURE_LEGACY_GETFULLPATH` and use `Microsoft.IO.Path.GetFullPath` in .NET Framework](https://github.com/dotnet/msbuild/pull/13769)

## Community contributors

Thank you contributors! ❤️

- [@huulinhnguyen-dev](https://github.com/dotnet/msbuild/pulls?q=is%3Apr+is%3Amerged+author%3Ahuulinhnguyen-dev)
- [@teo-tsirpanis](https://github.com/dotnet/msbuild/pulls?q=is%3Apr+is%3Amerged+author%3Ateo-tsirpanis)

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - #14139 Don't NGEN MSBuild.Coordinator.exe on x86 — internal shipping detail.
  - #14272 Avoid boxing PropertyDictionary GetEnumerator — micro-optimization, no user surface.
  - #14261 Regression coverage for metadata newline preservation — test-only.
  - #14277 Stop requiring VersionPrefix updates in servicing — internal release process.
  - #14386 Eliminate shared string resource file — internal cleanup.
  - #14361 Refactor bootstrapped build infrastructure — internal.
  - #13978 Add RequestThreadProc context to ETW events — diagnostic, no consumer story.
  - #13886 Update MicrosoftBuildVersion in analyzer template — infra bump.
  - #14209 Build analyzer in source-build — infra.
-->

<!-- Verified against Microsoft.Build 18.10.0-1.26381.103 (SDK 11.0.100-preview.7.26381.103):
  - ProjectEvaluationStage enum, ProjectOptions.EvaluationStage, ProjectInstance.EvaluationStage,
    ProjectInstance.FromFile(string, ProjectOptions) compiled and returned the expected
    stage/property values with 0 targets when EvaluationStage=Properties.
  - dotnet msbuild -getProperty:TargetFramework returned "net11.0" and behaved identically with
    MSBUILDDISABLEFEATURESFROMVERSION=18.10 set.
  - AbsolutePath (Microsoft.Build.Framework), FileInfo/DirectoryInfo task parameters,
    ITaskItem<AbsolutePath>[] properties, IMultiThreadableTask.TaskEnvironment, and a task
    constructor taking (TaskEnvironment) all compiled against
    Microsoft.Build.Utilities.Core 18.10.0-1.26381.103.
-->
