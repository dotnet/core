# C# in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 includes the following C# language and compiler updates:

- [Clearer diagnostic for misplaced `#!` shebang directives](#clearer-diagnostic-for-misplaced--shebang-directives)
- [Opt-in compilation cache for the VBCSCompiler build server](#opt-in-compilation-cache-for-the-vbcscompiler-build-server)

C# updates:

- [What's new in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-14)

## Clearer diagnostic for misplaced `#!` shebang directives

When a `#!` shebang directive appeared anywhere except the start of the file, the compiler reported `CS1040` ("Preprocessor directives must appear as the first non-whitespace character on a line"). That message is misleading — the shebang *is* the first character on its line; the real problem is that it isn't on line 1.

The compiler now reports a dedicated error, `CS9378`, with a message that points directly at the actual rule ([dotnet/roslyn #83112](https://github.com/dotnet/roslyn/pull/83112)).

```csharp
class Foo { }
#!/usr/bin/env dotnet
// error CS9378: '#!' must be the first characters on the first line of the file
```

`CS9378` also covers leading whitespace before `#!` and whitespace between `#` and `!`, which previously surfaced as the same misleading `CS1040`. This makes shebang errors easier to act on when authoring file-based C# apps.

## Opt-in compilation cache for the VBCSCompiler build server

The C#/VB build server (`VBCSCompiler`) now supports an opt-in file-system compilation cache. When a compilation has the same deterministic key as a previous one, the server restores the cached outputs instead of running the full compile and emit pipeline ([dotnet/roslyn #82881](https://github.com/dotnet/roslyn/pull/82881)).

The cache is enabled by setting the `ROSLYN_CACHE_PATH` environment variable, or by passing the `use-global-cache` feature flag through MSBuild. Notes on the current shape:

- The cache key is the existing deterministic compilation key, so cached outputs only replay for byte-identical inputs.
- Cache eviction is not implemented yet — managing the cache directory is the user's responsibility.
- Side effects such as compiler warnings and `/reportanalyzer` output are not cached and will not be replayed from a hit.

This is most useful for CI scenarios that re-build the same projects with stable inputs. Treat it as experimental for this preview.

## Bug fixes

- **C# compiler**
  - Fixed ref safety for collection expressions whose target type is an `IEnumerable<T>` of a `ref struct`, so the compiler now correctly enforces ref-struct lifetime rules in this case ([dotnet/roslyn #82401](https://github.com/dotnet/roslyn/pull/82401)).

## Community contributors

Thank you contributors! ❤️

- [@CyrusNajmabadi](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3ACyrusNajmabadi)
- [@DoctorKrolic](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3ADoctorKrolic)
- [@dusrdev](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3Adusrdev)
- [@Thomas-Shephard](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3AThomas-Shephard)
