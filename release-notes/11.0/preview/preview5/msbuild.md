# MSBuild in .NET 11 Preview 5 - Release Notes

.NET 11 Preview 5 includes new MSBuild features & enhancements:

- [Multithreaded builds can be enabled from the environment](#multithreaded-builds-can-be-enabled-from-the-environment)
- [MSBuild evaluation and item filtering are faster](#msbuild-evaluation-and-item-filtering-are-faster)
- [Binary log replay handles older logs](#binary-log-replay-handles-older-logs)
- [MSBuild runs on Haiku](#msbuild-runs-on-haiku)

These features continue the .NET 11 work on [Multithreaded execution](https://github.com/dotnet/msbuild/blob/main/documentation/specs/multithreading/multithreaded-msbuild.md), logging, and evaluation performance.

## Multithreaded builds can be enabled from the environment

MSBuild now supports `MSBUILDFORCEMULTITHREADED=1`, an environment-variable equivalent of the `-multiThreaded` / `-mt` command-line switch ([dotnet/msbuild #13662](https://github.com/dotnet/msbuild/pull/13662)). This helps CI systems, IDEs, and wrapper scripts opt in to multithreaded builds when they cannot easily add a command-line switch.

```shell
set MSBUILDFORCEMULTITHREADED=1
dotnet build MySolution.sln
```

Preview 5 also moves more in-box tasks onto the multithreaded execution model. These tasks now use the task environment for project-relative paths instead of relying on process-wide current-directory state:

- `AssignProjectConfiguration` ([dotnet/msbuild #13615](https://github.com/dotnet/msbuild/pull/13615))
- `GetAssemblyIdentity` ([dotnet/msbuild #13588](https://github.com/dotnet/msbuild/pull/13588))
- `GetInstalledSDKLocations` ([dotnet/msbuild #13564](https://github.com/dotnet/msbuild/pull/13564))
- Manifest tasks, including `GenerateApplicationManifest`, `GenerateDeploymentManifest`, `ResolveManifestFiles`, `AddToWin32Manifest`, `UpdateManifest`, and `CreateManifestResourceName` ([dotnet/msbuild #13177](https://github.com/dotnet/msbuild/pull/13177))
- `ResolveAssemblyReference` ([dotnet/msbuild #13319](https://github.com/dotnet/msbuild/pull/13319))

Multithreaded builds at this point should be completely compatible - meaning they should build the same way and produce the same outputs as multi-process builds today - but we continue to expect them to be slower than multiprocess builds due to increased usage of processes for Task isolation, which requires more communication overhead. We expect this gap to narrow as we continue to enlighten built-in Tasks.

## MSBuild evaluation and item filtering are faster

MSBuild's escaping helpers now allocate less and run faster in evaluation-heavy workloads ([dotnet/msbuild #13426](https://github.com/dotnet/msbuild/pull/13426)). `EscapingUtilities.Escape` and `EscapingUtilities.UnescapeAll` are used throughout property and item evaluation. In the PR benchmarks on .NET 10.0, `Escape_NoSpecialChars` improved from `17.96 ns` to `5.37 ns`, `Escape_FewSpecialChars` improved from `191.8 ns` to `84.9 ns`, and `UnescapeAll_InvalidEscapeSequences` dropped its allocation from `48 B` to `0 B`.

Item filtering also returns to linear behavior for large item sets with many batched removes ([dotnet/msbuild #13688](https://github.com/dotnet/msbuild/pull/13688)). This fixes a regression seen in QtMsBuild C++ projects where builds with tens of thousands of items could spend hours in `Lookup.GetItems`. The result construction path is back to `O(N + A + M)` instead of `O((N + A) x M)` for the affected pattern.

## Binary log replay handles older logs

Command-line binary log replay now replays older MSBuild logs instead of rejecting them completely when the log version is lower than the current tool version ([dotnet/msbuild #13608](https://github.com/dotnet/msbuild/pull/13608)). MSBuild skips entries it cannot understand and prints the version warning after replay, so older `.binlog` files still provide the events that are compatible with the current replay engine.

```shell
dotnet msbuild -bl:build.binlog MyProject.csproj
dotnet msbuild build.binlog
```

## MSBuild runs on Haiku

MSBuild now recognizes Haiku as a Unix-like operating system ([dotnet/msbuild #13607](https://github.com/dotnet/msbuild/pull/13607)). This lets MSBuild choose the same shared Unix paths as Linux and macOS, such as invoking `.sh` scripts instead of `.cmd` scripts when it runs on Haiku.

Thank you [@trungnt2910](https://github.com/trungnt2910) for this contribution!

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Terminal Logger task input logging: fixed a major performance trap but fits better as a bug fix because it restores expected logger overhead instead of adding a new user workflow.
  - SkipNonexistentTargets through metaprojects: important correctness fix for specialized project-reference dispatch, but not broad enough for a feature section.
  - RestoreTask transient TaskHost routing: important server and multithreaded-mode reliability fix, but it is an implementation detail of task isolation.
  - UsingTask Runtime="NET" default architecture: prevents x86 .NET Framework hosts from looking for an unshipped x86 .NET task host, but it is a narrow compatibility fix.
  - Haiku support: included despite narrow platform scope because it is a clear platform enablement change and a community contribution.
-->

## Bug fixes

- **Build engine**
  - `BuildManager.ShutdownAllNodes()` now finds AppHost-launched worker nodes, so `dotnet build-server shutdown` can clean up `MSBuild.exe` nodes started by a `dotnet`-hosted build ([dotnet/msbuild #13511](https://github.com/dotnet/msbuild/pull/13511)).
  - MSBuild no longer uses WMI to scan command lines while identifying worker processes on Windows, removing latency on machines with many `dotnet` processes ([dotnet/msbuild #13610](https://github.com/dotnet/msbuild/pull/13610)).
- **Logging**
  - Terminal Logger no longer opts in to task input logging that it does not consume, avoiding serialization of large task parameter payloads on every task invocation ([dotnet/msbuild #13686](https://github.com/dotnet/msbuild/pull/13686)).
  - MSBuild prints the existing auto-response-file warning before `MSB1008` when switches from `MSBuild.rsp` or `Directory.Build.rsp` cause multiple projects to be specified ([dotnet/msbuild #13675](https://github.com/dotnet/msbuild/pull/13675)).
- **Project references**
  - `SkipNonexistentTargets="true"` now propagates through generated metaprojects, so project-reference builds do not fail with `MSB4057` when the underlying project lacks the optional target ([dotnet/msbuild #13650](https://github.com/dotnet/msbuild/pull/13650)).
- **Tasks**
  - `WriteLinesToFile` transactional overwrites now handle parallel writers that create the destination between the replace check and move operation ([dotnet/msbuild #13477](https://github.com/dotnet/msbuild/pull/13477)).
  - The `Copy` task now retries `ERROR_ACCESS_DENIED` on non-Windows instead of treating it as a Windows-style read-only-file failure ([dotnet/msbuild #13479](https://github.com/dotnet/msbuild/pull/13479)).
  - `UsingTask Runtime="NET"` without an explicit `Architecture` now defaults to the OS architecture, matching the `dotnet` host MSBuild launches for .NET task hosts ([dotnet/msbuild #13741](https://github.com/dotnet/msbuild/pull/13741)).
  - `RestoreTask` now runs in a transient TaskHost when MSBuild server or multithreaded mode would otherwise let NuGet static state leak across invocations ([dotnet/msbuild #13660](https://github.com/dotnet/msbuild/pull/13660)).

## Community contributors

Thank you contributors! ❤️

- [@trungnt2910](https://github.com/dotnet/msbuild/pulls?q=is%3Apr+is%3Amerged+author%3Atrungnt2910)
