# .NET Libraries in .NET 11 Preview 2 - Release Notes

.NET 11 Preview 2 includes new .NET Libraries features & enhancements:

- [New Process APIs](#new-process-apis)
- [Tar archive format selection](#tar-archive-format-selection)
- [Generic GetTypeInfo for System.Text.Json](#generic-gettypeinfo-for-systemtextjson)

.NET Libraries updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview) documentation

## New Process APIs

.NET 11 introduces a new set of process execution APIs designed for simplicity, reliability, and efficiency. This is part of a broader initiative ([dotnet/runtime#123959](https://github.com/dotnet/runtime/issues/123959)) to provide a `ChildProcess` API with built-in support for safe output capture, automatic child process lifetime management, and clean timeout and cancellation handling. Preview 2 includes the first foundational types for this effort.

### ProcessExitStatus

[dotnet/runtime#124264](https://github.com/dotnet/runtime/pull/124264) adds the `ProcessExitStatus` class, which provides a unified representation of how a process terminated — combining the exit code, cancellation status, and termination signal into a single type.

```csharp
namespace System.Diagnostics;

public sealed class ProcessExitStatus
{
    public ProcessExitStatus(int exitCode, bool canceled, PosixSignal? signal = null);

    public int ExitCode { get; }
    public bool Canceled { get; }
    public PosixSignal? Signal { get; }
}
```

### PosixSignal.SIGKILL

[dotnet/runtime#124256](https://github.com/dotnet/runtime/pull/124256) adds `PosixSignal.SIGKILL` to the `PosixSignal` enum, enabling the new process APIs to send and represent SIGKILL signals. SIGKILL cannot be caught or ignored per POSIX semantics — the OS enforces this naturally, throwing appropriate exceptions if registration is attempted. This supports `SafeChildProcessHandle.SendSignal` and `Kill` methods in the upcoming `ChildProcess` API ([dotnet/runtime#123380](https://github.com/dotnet/runtime/issues/123380)).

## Tar Archive Format Selection

[dotnet/runtime#123407](https://github.com/dotnet/runtime/pull/123407), contributed by community member @kasperk81, adds new overloads to `TarFile.CreateFromDirectory` that accept a `TarEntryFormat` parameter. The new overloads support all four tar formats (Pax, Ustar, GNU, V7), giving you direct control over the archive format for compatibility with specific tools and environments.

```csharp
// Create a GNU format tar archive for Linux compatibility
TarFile.CreateFromDirectory("/source/dir", "/dest/archive.tar",
    includeBaseDirectory: true, TarEntryFormat.Gnu);

// Create a Ustar format archive for broader compatibility
TarFile.CreateFromDirectory("/source/dir", outputStream,
    includeBaseDirectory: false, TarEntryFormat.Ustar);

// Async version
await TarFile.CreateFromDirectoryAsync("/source/dir", "/dest/archive.tar",
    includeBaseDirectory: true, TarEntryFormat.Pax, cancellationToken);
```

## Generic GetTypeInfo for System.Text.Json

[dotnet/runtime#123940](https://github.com/dotnet/runtime/pull/123940) adds generic `GetTypeInfo<T>()` and `TryGetTypeInfo<T>()` methods to `JsonSerializerOptions`, providing direct access to strongly-typed `JsonTypeInfo<T>` without manual downcasting.

```csharp
// Generic method returns the right type directly
JsonTypeInfo<MyType> info = options.GetTypeInfo<MyType>();

// TryGetTypeInfo variant for cases where the type may not be supported
if (options.TryGetTypeInfo<MyType>(out JsonTypeInfo<MyType>? typeInfo))
{
    // Use typeInfo
}
```

This is particularly useful when working with source generation, NativeAOT, and polymorphic serialization scenarios where type metadata access is common.
