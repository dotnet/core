# .NET Libraries in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new library features and reliability improvements:

- [System.Text.Json offers more control over naming and ignore defaults](#systemtextjson-offers-more-control-over-naming-and-ignore-defaults)
- [Zstandard moved to System.IO.Compression and ZIP reads validate CRC32](#zstandard-moved-to-systemiocompression-and-zip-reads-validate-crc32)
- [SafeFileHandle and RandomAccess expand pipe support](#safefilehandle-and-randomaccess-expand-pipe-support)
- [Regex recognizes all Unicode newline sequences](#regex-recognizes-all-unicode-newline-sequences)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Libraries updates in .NET 11:

- [What's new in .NET 11 libraries](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries)

<!-- Verified against Microsoft.NETCore.App.Ref@11.0.0-preview.3.26179.102 -->

## System.Text.Json offers more control over naming and ignore defaults

Preview 3 expands the built-in naming and ignore options in `System.Text.Json`.
`JsonNamingPolicy.PascalCase` adds to the existing camel, snake, and kebab
presets, `[JsonNamingPolicy]` lets you override naming on individual members,
and type-level `[JsonIgnore(Condition = ...)]` lets a model set its default
ignore behavior in one place
([dotnet/runtime #124644](https://github.com/dotnet/runtime/pull/124644),
[dotnet/runtime #124645](https://github.com/dotnet/runtime/pull/124645),
[dotnet/runtime #124646](https://github.com/dotnet/runtime/pull/124646)).

```csharp
using System.Text.Json;
using System.Text.Json.Serialization;

[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
public sealed class EventData
{
    [JsonNamingPolicy(JsonKnownNamingPolicy.CamelCase)]
    public string EventName { get; set; } = "";

    public string? Notes { get; set; }
}

var options = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.PascalCase
};
```

## Zstandard moved to System.IO.Compression and ZIP reads validate CRC32

The Zstandard APIs introduced earlier in .NET 11 now live in
`System.IO.Compression`, so they sit alongside `DeflateStream`, `GZipStream`,
and `BrotliStream`
([dotnet/runtime #124634](https://github.com/dotnet/runtime/pull/124634)).
Preview 3 also adds CRC32 validation when reading ZIP entries, which means
corrupted payloads now fail fast with `InvalidDataException` instead of being
silently accepted
([dotnet/runtime #124766](https://github.com/dotnet/runtime/pull/124766)).
If you used the earlier preview package, remove the separate
`System.IO.Compression.Zstandard` package reference.

```diff
-<PackageReference Include="System.IO.Compression.Zstandard" />
```

## SafeFileHandle and RandomAccess expand pipe support

Preview 3 adds several low-level I/O updates. `SafeFileHandle.Type` reports
whether a handle is a file, pipe, socket, directory, or other OS object
([dotnet/runtime #124561](https://github.com/dotnet/runtime/pull/124561)).
`SafeFileHandle.CreateAnonymousPipe` creates pipe pairs with separate async
behavior for each end
([dotnet/runtime #125220](https://github.com/dotnet/runtime/pull/125220)), and
`RandomAccess.Read` / `Write` now work with non-seekable handles such as pipes
([dotnet/runtime #125512](https://github.com/dotnet/runtime/pull/125512)). On
Windows, `Process` now uses overlapped I/O for redirected stdout/stderr, which
reduces thread-pool blocking in process-heavy apps
([dotnet/runtime #125643](https://github.com/dotnet/runtime/pull/125643)).

```csharp
using Microsoft.Win32.SafeHandles;
using System.IO;

SafeFileHandle.CreateAnonymousPipe(out SafeFileHandle readEnd, out SafeFileHandle writeEnd,
    asyncReads: true, asyncWrites: false);

Console.WriteLine(readEnd.Type); // Pipe
```

## Regex recognizes all Unicode newline sequences

A new `RegexOptions.AnyNewLine` flag makes `^`, `$`, and `.` treat the full set
of Unicode newline characters as line terminators, not just `\n`
([dotnet/runtime #124701](https://github.com/dotnet/runtime/pull/124701)). This
helps when you parse text that may mix Windows, Unix, and Unicode-specific line
endings. Preview 3 also includes optimizer improvements for common regex
patterns.

```csharp
using System.Text.RegularExpressions;

string text = "line1\r\nline2\u0085line3\u2028line4";

var matches = Regex.Matches(
    text,
    @"^line\d$",
    RegexOptions.Multiline | RegexOptions.AnyNewLine);
```

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Function pointer reflection APIs: useful for advanced interop and tooling, but too specialized for most Preview 3 readers.
  - Argb<T> and Rgba<T>: nice graphics primitives, but not broadly relevant enough for a major section.
  - SVE2 and other architecture-specific intrinsics: real work, but a better fit as short grouped mentions than expanded library sections.
-->

## Breaking changes

- `ZipArchive` now validates CRC32 while reading entries. Corrupt or truncated
  archives that previously slipped through may now throw
  `InvalidDataException`
  ([dotnet/runtime #124766](https://github.com/dotnet/runtime/pull/124766)).
- Unhandled `BackgroundService` exceptions now stop the host instead of being
  quietly swallowed
  ([dotnet/runtime #124863](https://github.com/dotnet/runtime/pull/124863)).
- AIA certificate downloads are now disabled by default during server
  client-certificate validation. If you depended on online AIA fetching, review
  your validation setup
  ([dotnet/runtime #125049](https://github.com/dotnet/runtime/pull/125049)).
- `TarWriter` now emits `HardLink` entries when the same hard-linked file is
  archived more than once
  ([dotnet/runtime #123874](https://github.com/dotnet/runtime/pull/123874)).

## Bug fixes

- **Dependency injection**
  - Factory-based circular dependencies now throw a clear
    `InvalidOperationException` instead of failing with a less helpful error
    ([dotnet/runtime #124331](https://github.com/dotnet/runtime/pull/124331)).
- **Logging**
  - The logging source generator now supports generic methods
    ([dotnet/runtime #124638](https://github.com/dotnet/runtime/pull/124638)).
- **Networking**
  - `HttpListener` on Windows can now control HTTP.sys kernel response buffering
    ([dotnet/runtime #124720](https://github.com/dotnet/runtime/pull/124720)).

## Community contributors

Thank you contributors! ❤️

- [@am11](https://github.com/am11)
- [@ArcadeMode](https://github.com/ArcadeMode)
- [@DoctorKrolic](https://github.com/DoctorKrolic)
- [@gwr](https://github.com/gwr)
- [@haltandcatchwater](https://github.com/haltandcatchwater)
- [@jgh07](https://github.com/jgh07)
- [@jonathandavies-arm](https://github.com/jonathandavies-arm)
- [@karimsalem1](https://github.com/karimsalem1)
- [@koszeggy](https://github.com/koszeggy)
- [@kzrnm](https://github.com/kzrnm)
- [@laveeshb](https://github.com/laveeshb)
- [@lolleko](https://github.com/lolleko)
- [@lufen](https://github.com/lufen)
- [@martincostello](https://github.com/martincostello)
- [@matantsach](https://github.com/matantsach)
- [@Neo-vortex](https://github.com/Neo-vortex)
- [@pentp](https://github.com/pentp)
- [@prozolic](https://github.com/prozolic)
- [@RenderMichael](https://github.com/RenderMichael)
- [@rogerbriggen](https://github.com/rogerbriggen)
- [@Ruihan-Yin](https://github.com/Ruihan-Yin)
- [@rustamque](https://github.com/rustamque)
- [@sethjackson](https://github.com/sethjackson)
- [@ShreyaLaxminarayan](https://github.com/ShreyaLaxminarayan)
- [@Smaug123](https://github.com/Smaug123)
- [@teo-tsirpanis](https://github.com/teo-tsirpanis)
- [@tmds](https://github.com/tmds)
- [@Tomius](https://github.com/Tomius)
- [@ylpoonlg](https://github.com/ylpoonlg)
- [@Zurisen](https://github.com/Zurisen)
