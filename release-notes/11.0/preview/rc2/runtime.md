# Runtime in .NET 11 RC 2 - Release Notes

RC 2 concentrates on reliability fixes for the runtime.

## Changes since the previous preview

- **File locking on iOS and tvOS:** CoreCLR now disables advisory file locking by default on iOS and tvOS, including simulators. In RC 1, a `FileStream` could acquire a lock that caused the OS to terminate an app when it entered the background. Apps relying on RC 1's `FileShare` enforcement can restore locking with `DOTNET_SYSTEM_IO_DISABLEFILELOCKING=0` or the `System.IO.DisableFileLocking` switch set to `false`. Mac Catalyst and other platforms keep their existing defaults ([dotnet/runtime #134331](https://github.com/dotnet/runtime/pull/134331)).

<!-- TODO: Validate the iOS/tvOS default on an RC 2 device or simulator. -->

## Bug fixes

- **Linux:** The .NET 11 RC 1 SDK no longer crashes on RHEL 8 Arm64, and the runtime correctly traverses cgroup v2 memory limits at the hierarchy root ([dotnet/runtime #134148](https://github.com/dotnet/runtime/pull/134148), [dotnet/runtime #133693](https://github.com/dotnet/runtime/pull/133693)).
- **Assembly loading:** Generic virtual dispatch no longer hangs after repeated `AssemblyLoadContext` unloads ([dotnet/runtime #133183](https://github.com/dotnet/runtime/pull/133183)).
- **Collections:** `ConcurrentQueue.TryDequeue` no longer spuriously reports an empty queue while a segment is being frozen ([dotnet/runtime #132863](https://github.com/dotnet/runtime/pull/132863)).
- **Windows:** Garbage collection works correctly on machines with multiple CPU groups ([dotnet/runtime #134216](https://github.com/dotnet/runtime/pull/134216)).
