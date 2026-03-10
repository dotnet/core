# .NET Libraries in .NET 11 Preview 2 - Release Notes

.NET 11 Preview 2 includes new .NET Libraries features & enhancements:

- [Generic GetTypeInfo for System.Text.Json](#generic-gettypeinfo-for-systemtextjson)
- [Tar archive format selection](#tar-archive-format-selection)
- [Matrix4x4.GetDeterminant ~15% faster](#matrix4x4getdeterminant-15-faster)

.NET Libraries updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview) documentation

## Generic GetTypeInfo for System.Text.Json

A common pattern when working with `System.Text.Json` type metadata is to retrieve a `JsonTypeInfo<T>` from `JsonSerializerOptions`, which previously required a manual downcast from the non-generic `GetTypeInfo(Type)` method ([dotnet/runtime#118468](https://github.com/dotnet/runtime/issues/118468)). New generic `GetTypeInfo<T>()` and `TryGetTypeInfo<T>()` methods on `JsonSerializerOptions` eliminate this cast and return strongly-typed metadata directly ([dotnet/runtime#123940](https://github.com/dotnet/runtime/pull/123940)).

```csharp
// Before: manual downcast required
JsonTypeInfo<MyType> info = (JsonTypeInfo<MyType>)options.GetTypeInfo(typeof(MyType));

// After: generic method returns the right type directly
JsonTypeInfo<MyType> info = options.GetTypeInfo<MyType>();

// TryGetTypeInfo variant for cases where the type may not be registered
if (options.TryGetTypeInfo<MyType>(out JsonTypeInfo<MyType>? typeInfo))
{
    // Use typeInfo
}
```

This is particularly useful when working with source generation, NativeAOT, and polymorphic serialization scenarios where type metadata access is common.

## Tar Archive Format Selection

New overloads on `TarFile.CreateFromDirectory` accept a `TarEntryFormat` parameter, giving you direct control over the archive format ([dotnet/runtime#123407](https://github.com/dotnet/runtime/pull/123407)). Previously, `CreateFromDirectory` always produced Pax archives. The new overloads support all four tar formats — Pax, Ustar, GNU, and V7 — for compatibility with specific tools and environments ([dotnet/runtime#121819](https://github.com/dotnet/runtime/issues/121819)).

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

Thank you [@kasperk81](https://github.com/kasperk81) for this contribution!

## Matrix4x4.GetDeterminant ~15% Faster

`Matrix4x4.GetDeterminant` now uses an SSE-vectorized implementation, improving performance by approximately 15% ([dotnet/runtime#123954](https://github.com/dotnet/runtime/pull/123954)).

| Scenario | Before | After | Improvement |
| --- | --- | --- | --- |
| `GetDeterminantBenchmark` | 3.487 ns | 2.971 ns | ~15% faster |

Thank you [@alexcovington](https://github.com/alexcovington) for this contribution!

## Bug fixes

This release includes bug fixes and quality improvements across several areas:

- **System.Collections**
  - Fixed integer overflow in `ImmutableArray` range validation ([dotnet/runtime#124042](https://github.com/dotnet/runtime/pull/124042))
- **System.IO.Compression**
  - Fixed `ZipArchiveEntry.ExtractToFile` preserving files on extraction failure with `overwrite: true` ([dotnet/runtime#123991](https://github.com/dotnet/runtime/pull/123991))
- **System.Linq**
  - Fixed `Append`/`Prepend` `GetCount` overflow to correctly throw `OverflowException` ([dotnet/runtime#123821](https://github.com/dotnet/runtime/pull/123821))
- **System.Net.Http**
  - Fixed authenticated proxy credential handling for proxies that require proactive `Proxy-Authorization` headers ([dotnet/runtime#123328](https://github.com/dotnet/runtime/pull/123328), reported by [@ptarjan](https://github.com/ptarjan))
  - Fixed edge-case non-ASCII host handling in HTTP logic ([dotnet/runtime#123934](https://github.com/dotnet/runtime/pull/123934))
- **System.Numerics**
  - Fixed `Vector2`/`Vector3` `EqualsAny` and related methods returning incorrect results due to hidden padding elements ([dotnet/runtime#123594](https://github.com/dotnet/runtime/pull/123594), [dotnet/runtime#123586](https://github.com/dotnet/runtime/issues/123586))
  - Fixed missing early returns in `TensorPrimitives.Round` causing double-rounding ([dotnet/runtime#124280](https://github.com/dotnet/runtime/pull/124280))
- **System.Reflection**
  - Fixed `MetadataLoadContext` returning internal array types instead of `Type[]` from several methods ([dotnet/runtime#124251](https://github.com/dotnet/runtime/pull/124251), reported by [@smdn](https://github.com/smdn))
- **System.Runtime**
  - Fixed vectorization of `Ascii.Equals` for input lengths 8–15 ([dotnet/runtime#123115](https://github.com/dotnet/runtime/pull/123115))

## Community contributors

Thank you contributors! ❤️

- [@alexcovington](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+merged%3A2026-01-26..2026-02-11+author%3Aalexcovington)
- [@am11](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+merged%3A2026-01-26..2026-02-11+author%3Aam11)
- [@kasperk81](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+merged%3A2026-01-26..2026-02-11+author%3Akasperk81)
- [@pentp](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+merged%3A2026-01-26..2026-02-11+author%3Apentp)
- [@ptarjan](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+merged%3A2026-01-26..2026-02-11+author%3Aptarjan)
