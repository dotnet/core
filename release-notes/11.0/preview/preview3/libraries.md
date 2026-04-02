# .NET Libraries in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new .NET Libraries features & enhancements:

- [Zstandard APIs Moved to System.IO.Compression](#zstandard-apis-moved-to-systemiocompression)
- [CRC32 Validation for Zip Archives](#crc32-validation-for-zip-archives)
- [FileHandleType and SafeFileHandle.Type](#filehandletype-and-safefilehandletype)
- [SafeFileHandle.CreateAnonymousPipe with Per-End Async](#safefilehandlecreateanonymouspipe-with-per-end-async)
- [RandomAccess Works with Non-Seekable Files](#randomaccess-works-with-non-seekable-files)
- [Overlapped I/O for Process Stdout/Stderr on Windows](#overlapped-io-for-process-stdoutstderr-on-windows)
- [Blittable Color Types: Argb\<T\> and Rgba\<T\>](#blittable-color-types-argbt-and-rgbat)
- [System.Text.Json Improvements](#systemtextjson-improvements)
- [RegexOptions.AnyNewLine](#regexoptionsanynewline)
- [Regex Performance Improvements](#regex-performance-improvements)
- [RuntimeFeature.IsMultithreadingSupported](#runtimefeatureismultithreadingsupported)
- [SVE2 Intrinsics: Match, NoMatch, Non-Temporal Loads/Stores, and Counting](#sve2-intrinsics-match-nomatch-non-temporal-loadsstores-and-counting)
- [Function Pointer Reflection APIs](#function-pointer-reflection-apis)
- [DI: Circular Dependency Detection for Factories](#di-circular-dependency-detection-for-factories)
- [Logging Source Generator: Generic Methods](#logging-source-generator-generic-methods)
- [HttpListener Kernel Response Buffering on Windows](#httplistener-kernel-response-buffering-on-windows)
- [Disable AIA Certificate Downloads for Server Validation](#disable-aia-certificate-downloads-for-server-validation)
- [Nullable Annotations for System.Speech](#nullable-annotations-for-systemspeech)

.NET Libraries updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries) documentation

<!-- API verification notes:
  All APIs verified against Microsoft.NETCore.App.Ref@11.0.0-preview.3.26179.102
  from https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet11/nuget/v3/index.json

  FileHandleType — System.IO.FileHandleType (enum)
    Values: Unknown=0, RegularFile=1, Pipe=2, Socket=3, CharacterDevice=4, Directory=5, SymbolicLink=6, BlockDevice=7
  SafeFileHandle.Type — returns FileHandleType
  SafeFileHandle.CreateAnonymousPipe — void CreateAnonymousPipe(ref SafeFileHandle, ref SafeFileHandle, bool, bool)
  Argb<T> — System.Numerics.Colors.Argb<T> (struct, IEquatable<Argb<T>>)
    Constructors: .ctor(ReadOnlySpan<T>), .ctor(T, T, T, T)
    Properties: A, R, G, B (all T get;set;)
    Methods: CopyTo(Span<T>), ToRgba()
  Rgba<T> — System.Numerics.Colors.Rgba<T> (struct)
  JsonNamingPolicy.PascalCase — verified (static property, no doc yet)
  JsonKnownNamingPolicy.PascalCase — verified (value=6)
  JsonNamingPolicyAttribute — System.Text.Json.Serialization.JsonNamingPolicyAttribute
    Constructor: .ctor(JsonKnownNamingPolicy)
    Property: NamingPolicy (JsonNamingPolicy get;)
  JsonIgnoreAttribute — now applies to types (class/struct/interface)
    Property: Condition (JsonIgnoreCondition)
  RegexOptions.AnyNewLine — verified (value=2048)
  RuntimeFeature.IsMultithreadingSupported — verified (bool property)
  Sve2.Match — 4 overloads (byte, sbyte, short, ushort)
  Sve2.NoMatch — 4 overloads (byte, sbyte, short, ushort)
  Type.MakeFunctionPointerType(Type[]?, bool) — verified
  Type.MakeFunctionPointerSignatureType(Type, Type[]?, bool, Type[]?) — verified
  RandomAccess — behavior change (no new API surface), Read/Write now work with non-seekable handles
  Avx512Bmm — verified (documented in runtime.md)
-->

## Zstandard APIs Moved to System.IO.Compression

The Zstandard compression APIs introduced in Preview 1 have moved from the `System.IO.Compression.Zstandard` assembly into `System.IO.Compression`. The types (`ZstandardStream`, `ZstandardEncoder`, `ZstandardDecoder`, `ZstandardCompressionOptions`) keep the same `System.IO.Compression` namespace but are now part of the core compression assembly. ([dotnet/runtime#124634](https://github.com/dotnet/runtime/pull/124634))

This simplifies packaging — a single assembly reference covers Deflate, GZip, Brotli, and Zstandard — and removes the need for a separate `System.IO.Compression.Zstandard` dependency.

```diff
-<PackageReference Include="System.IO.Compression.Zstandard" />
 <!-- ZstandardStream is now in the same assembly as DeflateStream and BrotliStream -->
```

---

## CRC32 Validation for Zip Archives

`ZipArchive` now validates CRC32 checksums when reading entries. Corrupted entry data throws `InvalidDataException` at read time, catching integrity problems that previously went undetected. No new API is required — the validation is automatic for all `ZipArchive.GetEntry` reads. ([dotnet/runtime#124766](https://github.com/dotnet/runtime/pull/124766))

---

## FileHandleType and SafeFileHandle.Type

A new `FileHandleType` enum and `SafeFileHandle.Type` property let you identify what kind of I/O object a handle refers to — regular file, pipe, socket, character device, directory, symbolic link, or block device. ([dotnet/runtime#124561](https://github.com/dotnet/runtime/pull/124561))

```csharp
using Microsoft.Win32.SafeHandles;
using System.IO;

SafeFileHandle handle = File.OpenHandle("data.txt");
FileHandleType type = handle.Type; // FileHandleType.RegularFile

// Useful for code that receives a handle and needs to branch on its kind
if (handle.Type == FileHandleType.Pipe)
{
    // Non-seekable — use streaming reads
}
```

`FileHandleType` values:

| Value | Meaning |
| --- | --- |
| `Unknown` | Type could not be determined |
| `RegularFile` | Regular file |
| `Pipe` | Pipe or FIFO |
| `Socket` | Socket |
| `CharacterDevice` | Character device (e.g. `/dev/null`) |
| `Directory` | Directory |
| `SymbolicLink` | Symbolic link |
| `BlockDevice` | Block device |

---

## SafeFileHandle.CreateAnonymousPipe with Per-End Async

A new `SafeFileHandle.CreateAnonymousPipe` static method creates anonymous pipe pairs with independent async control for each end. This replaces the lower-level `AnonymousPipeServerStream` constructor for scenarios where you need async read behavior on one end and synchronous writes on the other. ([dotnet/runtime#125220](https://github.com/dotnet/runtime/pull/125220))

```csharp
SafeFileHandle readEnd = null!, writeEnd = null!;
SafeFileHandle.CreateAnonymousPipe(
    ref readEnd, ref writeEnd,
    asyncRead: true,   // read end supports async I/O
    asyncWrite: false); // write end is synchronous

// Use readEnd with FileStream for async reads
await using var reader = new FileStream(readEnd, FileAccess.Read);
// Use writeEnd with FileStream for sync writes
using var writer = new FileStream(writeEnd, FileAccess.Write);
```

On Unix, `asyncRead: true` configures the file descriptor for non-blocking I/O. On Windows, it creates the handle with `FILE_FLAG_OVERLAPPED`.

---

## RandomAccess Works with Non-Seekable Files

`RandomAccess.Read` and `RandomAccess.Write` (and their async variants) now accept non-seekable file handles such as pipes and sockets. Previously, these methods required a seekable handle and threw for pipes. The `offset` parameter is ignored for non-seekable handles — data is read or written at the current position. ([dotnet/runtime#125512](https://github.com/dotnet/runtime/pull/125512))

This makes `RandomAccess` usable as a unified low-level I/O API regardless of the underlying file type.

---

## Overlapped I/O for Process Stdout/Stderr on Windows

On Windows, the parent-side pipe handles for `Process.StandardOutput` and `Process.StandardError` now use overlapped (async) I/O. Previously, these handles were opened synchronously, which blocked thread-pool threads during reads. The change reduces thread-pool pressure when reading output from multiple child processes concurrently. ([dotnet/runtime#125643](https://github.com/dotnet/runtime/pull/125643))

No API changes are required — existing code that reads `process.StandardOutput.ReadToEndAsync()` automatically benefits.

---

## Blittable Color Types: Argb\<T\> and Rgba\<T\>

New generic color structs `Argb<T>` and `Rgba<T>` in `System.Numerics.Colors` provide blittable, interop-friendly color representations. They are useful for graphics pipelines, image processing, and GPU data transfer where memory layout must match a specific pixel format. ([dotnet/runtime#124663](https://github.com/dotnet/runtime/pull/124663))

```csharp
using System.Numerics.Colors;

// ARGB with byte channels (typical 32-bit pixel)
var pixel = new Argb<byte>(alpha: 255, red: 128, green: 64, blue: 32);
Console.WriteLine(pixel.R); // 128

// RGBA with float channels (HDR / linear color)
var hdr = new Rgba<float>(r: 0.5f, g: 0.25f, b: 0.125f, a: 1.0f);

// Convert between layouts
Rgba<byte> rgba = pixel.ToRgba();

// Copy to a span for bulk transfer
Span<byte> buffer = stackalloc byte[4];
pixel.CopyTo(buffer);
```

Both structs implement `IEquatable<T>` and work with any `unmanaged` element type (`byte`, `float`, `Half`, `ushort`, etc.).

---

## System.Text.Json Improvements

### JsonNamingPolicy.PascalCase

A new built-in `PascalCase` naming policy joins `CamelCase`, `SnakeCaseLower`, `SnakeCaseUpper`, `KebabCaseLower`, and `KebabCaseUpper`. It converts `camelCase` and other casing styles to `PascalCase`. ([dotnet/runtime#124644](https://github.com/dotnet/runtime/pull/124644))

```csharp
var options = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.PascalCase
};

// { "FirstName": "Ada" }
string json = JsonSerializer.Serialize(new { firstName = "Ada" }, options);
```

### JsonNamingPolicyAttribute for member-level naming

A new `[JsonNamingPolicy]` attribute applies a naming policy to individual properties or fields, overriding the global `PropertyNamingPolicy` from options. ([dotnet/runtime#124645](https://github.com/dotnet/runtime/pull/124645))

```csharp
using System.Text.Json.Serialization;

public class EventData
{
    // Uses camelCase regardless of global options
    [JsonNamingPolicy(JsonKnownNamingPolicy.CamelCase)]
    public string EventName { get; set; }

    // Follows global naming policy (default)
    public int Count { get; set; }
}
```

### Type-level JsonIgnoreCondition

`[JsonIgnore(Condition = ...)]` can now be applied to classes, structs, and interfaces to set a default ignore condition for all members. Individual members can still override with their own `[JsonIgnore]`. ([dotnet/runtime#124646](https://github.com/dotnet/runtime/pull/124646))

```csharp
// All null properties are omitted by default
[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
public class UserProfile
{
    public string Name { get; set; }
    public string? Bio { get; set; }       // Omitted when null
    public string? Email { get; set; }     // Omitted when null
}
```

### Generic converters on generic types

`[JsonConverter]` now supports open generic converter types on open generic types when their generic arities match. This eliminates the need for a non-generic `JsonConverterFactory` base class to bridge generic type parameters. ([dotnet/runtime#123209](https://github.com/dotnet/runtime/pull/123209))

```csharp
[JsonConverter(typeof(ResultConverter<>))]
public class Result<T>
{
    public T Value { get; set; }
    public bool IsSuccess { get; set; }
}

public class ResultConverter<T> : JsonConverter<Result<T>>
{
    // Automatically used for Result<int>, Result<string>, etc.
    public override Result<T> Read(ref Utf8JsonReader reader,
        Type typeToConvert, JsonSerializerOptions options) { /* ... */ }
    public override void Write(Utf8JsonWriter writer,
        Result<T> value, JsonSerializerOptions options) { /* ... */ }
}
```

### Better exception messages from JsonElement.GetProperty

`KeyNotFoundException` thrown by `JsonElement.GetProperty` now includes the missing property name in the message, making it easier to debug chained lookups like `root.GetProperty("data").GetProperty("items")`. ([dotnet/runtime#124965](https://github.com/dotnet/runtime/pull/124965))

### Source generator: support #pragma warning disable

The System.Text.Json source generator now respects `#pragma warning disable` directives, so you can suppress specific diagnostics on generated serialization code. ([dotnet/runtime#124994](https://github.com/dotnet/runtime/pull/124994))

---

## RegexOptions.AnyNewLine

A new `RegexOptions.AnyNewLine` flag (value `2048`) makes `^`, `$`, and `.` treat all Unicode newline characters as line terminators — `\r`, `\n`, `\r\n`, `\u0085`, `\u2028`, and `\u2029`. Without this flag, only `\n` acts as a line terminator in `Multiline` mode. ([dotnet/runtime#124701](https://github.com/dotnet/runtime/pull/124701))

```csharp
using System.Text.RegularExpressions;

string text = "line1\r\nline2\u0085line3\u2028line4";

// Without AnyNewLine: only \n is a line break for ^ and $
var matches = Regex.Matches(text, @"^line\d$", RegexOptions.Multiline);
// matches: ["line2", "line4"]

// With AnyNewLine: all Unicode line breaks recognized
matches = Regex.Matches(text, @"^line\d$",
    RegexOptions.Multiline | RegexOptions.AnyNewLine);
// matches: ["line1", "line2", "line3", "line4"]
```

This is a compile-time option — it can also be set inline with `(?anl)`:

```csharp
var re = new Regex(@"(?anl)^line\d$", RegexOptions.Multiline);
```

---

## Regex Performance Improvements

Several regex engine optimizations reduce backtracking and improve search throughput:

- **Reduce backtracking for greedy loops followed by subsumed literals** — patterns like `\b\w+n\b` now skip positions that cannot match, reducing wasted backtracking steps. ([dotnet/runtime#125636](https://github.com/dotnet/runtime/pull/125636))
- **Frequency-based leading-strings heuristic** — the engine now uses character frequency analysis to decide when a case-sensitive leading-string search accelerates matching. ([dotnet/runtime#124736](https://github.com/dotnet/runtime/pull/124736))
- **Extract common prefixes from branches** — alternations sharing a common prefix now factor it out, reducing duplicated matching work. ([dotnet/runtime#124881](https://github.com/dotnet/runtime/pull/124881))
- **Fix deep character-class subtraction** — deeply nested character-class subtractions no longer risk `StackOverflowException`. ([dotnet/runtime#124995](https://github.com/dotnet/runtime/pull/124995))

---

## RuntimeFeature.IsMultithreadingSupported

A new `RuntimeFeature.IsMultithreadingSupported` property reports whether the current runtime supports multithreading. This returns `false` on single-threaded WASM and WASI targets and `true` everywhere else. Code can use it to choose between concurrent and sequential algorithms without hardcoding platform checks. ([dotnet/runtime#124603](https://github.com/dotnet/runtime/pull/124603))

```csharp
if (RuntimeFeature.IsMultithreadingSupported)
{
    Parallel.ForEach(items, Process);
}
else
{
    foreach (var item in items) Process(item);
}
```

---

## SVE2 Intrinsics: Match, NoMatch, Non-Temporal Loads/Stores, and Counting

New ARM SVE2 intrinsics in `System.Runtime.Intrinsics.Arm.Sve2`:

| API | Description | PR |
| --- | --- | --- |
| `Match` | Per-element byte/short search within a vector segment | [#125163](https://github.com/dotnet/runtime/pull/125163) |
| `NoMatch` | Inverse of `Match` | [#125163](https://github.com/dotnet/runtime/pull/125163) |
| `GatherVectorNonTemporal*` | Non-temporal gather loads (streaming hint) | [#123890](https://github.com/dotnet/runtime/pull/123890) |
| `ScatterNonTemporal*` | Non-temporal scatter stores (streaming hint) | [#123892](https://github.com/dotnet/runtime/pull/123892) |
| `SaturatingCount*` | Saturating population counts | [#122602](https://github.com/dotnet/runtime/pull/122602) |

Thank you [@ylpoonlg](https://github.com/ylpoonlg) for the non-temporal load/store and counting contributions!

---

## Function Pointer Reflection APIs

Two new methods on `System.Type` let you create function-pointer types at runtime, filling a gap in the reflection API for modern `delegate*` scenarios. ([dotnet/runtime#123819](https://github.com/dotnet/runtime/pull/123819))

Thank you [@teo-tsirpanis](https://github.com/teo-tsirpanis) for this contribution!

```csharp
// Create an unmanaged function pointer type: delegate* unmanaged<int, void>
Type funcPtr = Type.MakeFunctionPointerType(
    parameterTypes: new[] { typeof(int) },
    isUnmanaged: true);

// Create a managed function pointer with custom modifiers
Type sigType = Type.MakeFunctionPointerSignatureType(
    returnType: typeof(void),
    parameterTypes: new[] { typeof(int), typeof(string) },
    isUnmanaged: false,
    callingConventionTypes: null);
```

---

## DI: Circular Dependency Detection for Factories

The dependency injection container now detects circular dependencies in factory-based service registrations at resolution time. Previously, a circular factory graph caused a deadlock or stack overflow. Now it throws a clear `InvalidOperationException` with the cycle path. ([dotnet/runtime#124331](https://github.com/dotnet/runtime/pull/124331))

```csharp
services.AddTransient<IServiceA>(sp => new ServiceA(sp.GetRequiredService<IServiceB>()));
services.AddTransient<IServiceB>(sp => new ServiceB(sp.GetRequiredService<IServiceA>()));

var provider = services.BuildServiceProvider();
provider.GetRequiredService<IServiceA>();
// Throws InvalidOperationException: "A circular dependency was detected..."
```

---

## Logging Source Generator: Generic Methods

`[LoggerMessage]` methods can now be generic. This avoids boxing value-type arguments and enables reusable logging methods across different types. The only restriction is that `allows ref struct` type parameters are not supported. ([dotnet/runtime#124638](https://github.com/dotnet/runtime/pull/124638))

```csharp
public static partial class Log
{
    [LoggerMessage(Level = LogLevel.Information, Message = "Processing {item}")]
    public static partial void ProcessingItem<T>(ILogger logger, T item);
}

// Usage — no boxing for int
Log.ProcessingItem(logger, 42);
Log.ProcessingItem(logger, "hello");
```

---

## HttpListener Kernel Response Buffering on Windows

An opt-in `AppContext` switch enables HTTP.sys kernel-mode response buffering for `HttpListener` on Windows. When enabled, the kernel buffers response data before sending it to the client, which can reduce latency for large responses. ([dotnet/runtime#124720](https://github.com/dotnet/runtime/pull/124720))

Thank you [@martincostello](https://github.com/martincostello) for this contribution!

```csharp
AppContext.SetSwitch(
    "System.Net.HttpListener.EnableKernelResponseBuffering", true);
```

---

## Disable AIA Certificate Downloads for Server Validation

Server-side `SslStream` validation no longer downloads intermediate certificates via Authority Information Access (AIA) by default. This prevents outbound network requests during TLS handshakes, improving both security and latency for server scenarios. Client-side behavior is unchanged. You can override this by configuring a custom `X509ChainPolicy`. ([dotnet/runtime#125049](https://github.com/dotnet/runtime/pull/125049))

---

## Nullable Annotations for System.Speech

`System.Speech` APIs are now fully annotated for nullable reference types. This improves static analysis warnings when using speech recognition and synthesis APIs. ([dotnet/runtime#119564](https://github.com/dotnet/runtime/pull/119564))

Thank you [@Smaug123](https://github.com/Smaug123) for this contribution!

---

<!-- Filtered features:
  - Vectorized Adler32 (dotnet/runtime#124409): internal System.IO.Hashing optimization.
    Not user-visible API change.
  - ZipArchiveEntry preallocation (dotnet/runtime#125260): two-sentence optimization
    for pre-setting FileStreamOptions in extract methods.
  - STJ byref constructors (dotnet/runtime#122950): very niche — support for constructors
    with in/ref/out parameters. Most users will never encounter this.
  - Version JSON deserialization optimization (dotnet/runtime#118207): internal perf for
    parsing Version from JSON. Two sentences.
  - MultipartContent boundary caching (dotnet/runtime#124963): internal perf for HTTP
    multipart content. Two sentences.
  - EncodingTable ConcurrentDictionary (dotnet/runtime#125001): internal thread-safety fix,
    no user-visible change.
  - URI SearchValues usage (dotnet/runtime#124433): internal optimization for Uri parsing.
  - HashSet JIT bounds-check elimination (dotnet/runtime#125893): internal codegen
    improvement, no API change.
  - InlineArray replacements for fixed buffers (dotnet/runtime#125574, #125514): internal
    refactoring away from fixed-size buffers.
  - Remove Windows 7 support code from Net.Security (dotnet/runtime#124555): cleanup only.
  - Socket lock contention reduction (dotnet/runtime#124997): internal Windows optimization.
  - Unsafe evolution attributes (dotnet/runtime#125721): compiler infrastructure, not
    user-facing API.
-->

## Bug Fixes

### System.Collections

- Fixed `IndexOutOfRangeException` in `FrozenHashTable` when creating from very large collections. ([dotnet/runtime#125555](https://github.com/dotnet/runtime/pull/125555))
- Fixed missing upper-bound guard in `List<T>.LastIndexOf` and `FindLastIndex`. ([dotnet/runtime#124161](https://github.com/dotnet/runtime/pull/124161), thank you [@rustamque](https://github.com/rustamque))

### System.Formats.Tar

- Fixed `TarReader` not reading the USTAR prefix field for PAX format entries, causing truncated paths for entries with long names. ([dotnet/runtime#125344](https://github.com/dotnet/runtime/pull/125344))
- Fixed `TarWriter` to use `HardLink` entries for files sharing the same inode. ([dotnet/runtime#123874](https://github.com/dotnet/runtime/pull/123874), thank you [@Tomius](https://github.com/Tomius))
- Fixed reparse points not correctly distinguishing junctions/symlinks from other reparse types. ([dotnet/runtime#124753](https://github.com/dotnet/runtime/pull/124753))

### System.IO

- Fixed `FileInfo` state-changing methods not invalidating cached state. ([dotnet/runtime#124429](https://github.com/dotnet/runtime/pull/124429), thank you [@jgh07](https://github.com/jgh07))
- Fixed operator precedence bug in native `fsync` causing silent errors on macOS SMB shares. ([dotnet/runtime#124725](https://github.com/dotnet/runtime/pull/124725))
- Fixed `CreateSubdirectory` failing for root directories. ([dotnet/runtime#121906](https://github.com/dotnet/runtime/pull/121906), thank you [@Neo-vortex](https://github.com/Neo-vortex))
- Fixed `SafeFileHandle.CanSeek` performance regression. ([dotnet/runtime#125807](https://github.com/dotnet/runtime/pull/125807))

### System.IO.Compression

- Fixed reachable `Debug.Assert` in `SubReadStream.Read` when seeked past end. ([dotnet/runtime#124813](https://github.com/dotnet/runtime/pull/124813))

### System.IO.Pipelines

- Fixed `StreamPipeReader.CopyToAsync` not advancing past buffered data. ([dotnet/runtime#124989](https://github.com/dotnet/runtime/pull/124989))
- Fixed reachable `Debug.Assert` in `StreamPipeReader.AdvanceTo`. ([dotnet/runtime#123810](https://github.com/dotnet/runtime/pull/123810))

### System.IO.Ports

- Fixed interpreting baud rate bitmask as decimal value on serial ports. ([dotnet/runtime#123348](https://github.com/dotnet/runtime/pull/123348), thank you [@rogerbriggen](https://github.com/rogerbriggen))

### System.Net

- Fixed `Uri.GetHashCode` hash/equality contract violation for `file:` URIs. ([dotnet/runtime#124652](https://github.com/dotnet/runtime/pull/124652))
- Fixed `Uri.TryUnescapeDataString` throwing instead of returning `false` with small destination buffers. ([dotnet/runtime#124655](https://github.com/dotnet/runtime/pull/124655))
- Fixed `Ping.RoundtripTime` returning `0` for TTL-expired replies. ([dotnet/runtime#124424](https://github.com/dotnet/runtime/pull/124424), thank you [@laveeshb](https://github.com/laveeshb))
- Fixed `WebProxy` not initializing credentials from URI `UserInfo`. ([dotnet/runtime#125384](https://github.com/dotnet/runtime/pull/125384))
- Fixed `UdpClient.EnableBroadcast` not preventing broadcast sends when set to `false`. ([dotnet/runtime#124482](https://github.com/dotnet/runtime/pull/124482), thank you [@karimsalem1](https://github.com/karimsalem1))
- Fixed memory overwrites in `SystemNative_GetNetworkInterfaces`. ([dotnet/runtime#125022](https://github.com/dotnet/runtime/pull/125022), thank you [@am11](https://github.com/am11))
- Fixed `HttpListener.GetContext()` exception behavior inconsistency across platforms for `Stop`/`Abort`/`Close`. ([dotnet/runtime#123360](https://github.com/dotnet/runtime/pull/123360))

### System.Net.Http

- Fixed `GCHandle` double-free race in `WinHttpRequestState`. ([dotnet/runtime#125293](https://github.com/dotnet/runtime/pull/125293))

### System.Net.Security

- Fixed ALPN protocol list size field type causing boundary errors. ([dotnet/runtime#124590](https://github.com/dotnet/runtime/pull/124590))
- Fixed `ManagedNtlm` on big-endian architectures. ([dotnet/runtime#124598](https://github.com/dotnet/runtime/pull/124598), thank you [@filipnavara](https://github.com/filipnavara)) and follow-up fix for multi-byte wire fields. ([dotnet/runtime#125039](https://github.com/dotnet/runtime/pull/125039))
- Fixed NTLM `ProcessTargetInfo` returning wrong buffer slice when skipping entries. ([dotnet/runtime#125201](https://github.com/dotnet/runtime/pull/125201))
- Improved error handling in OpenSSL initialization code. ([dotnet/runtime#125324](https://github.com/dotnet/runtime/pull/125324))

### System.Net.Sockets

- Fixed `ConnectAsync` not restoring blocking mode after success on Unix. ([dotnet/runtime#124200](https://github.com/dotnet/runtime/pull/124200))

### System.Numerics.Tensors

- Fixed `NRange.GetOffsetAndLength` truncation from `nuint`→`uint` cast. ([dotnet/runtime#124300](https://github.com/dotnet/runtime/pull/124300))
- Fixed stride computation for single-element (length ≤ 1) tensors. ([dotnet/runtime#125403](https://github.com/dotnet/runtime/pull/125403))
- Fixed non-dense `TensorSpan` handling in `SequenceEqual`, `Fill`, `Resize`, `IndexOf`, and `ConcatenateOnDimension`. ([dotnet/runtime#124225](https://github.com/dotnet/runtime/pull/124225))
- Fixed broadcast output shape computation in tensor binary operations. ([dotnet/runtime#125582](https://github.com/dotnet/runtime/pull/125582))

### System.Reflection.Emit

- Fixed encoding of custom modifiers in `PersistedAssemblyBuilder`. ([dotnet/runtime#123925](https://github.com/dotnet/runtime/pull/123925), thank you [@pentp](https://github.com/pentp))

### System.Reflection.Metadata

- Optimized `MetadataBuilder.GetOrAddConstantBlob` to avoid redundant allocations. ([dotnet/runtime#121223](https://github.com/dotnet/runtime/pull/121223), thank you [@DoctorKrolic](https://github.com/DoctorKrolic))

### System.Runtime.InteropServices

- Fixed possible deadlocks on `PosixSignalRegistration` disposal on Windows. ([dotnet/runtime#124893](https://github.com/dotnet/runtime/pull/124893))
- Fixed RCW cache entries not being cleared when releasing wrapper objects. ([dotnet/runtime#125754](https://github.com/dotnet/runtime/pull/125754))

### System.Security

- Fixed `FromBase64Transform.TransformFinalBlock` not consistently resetting state. ([dotnet/runtime#124480](https://github.com/dotnet/runtime/pull/124480))

### System.Text.Json

- Fixed `GetValue<object>()` and `TryGetValue<JsonElement?>` returning incorrect results on `JsonValueOfJsonPrimitive` types. ([dotnet/runtime#125139](https://github.com/dotnet/runtime/pull/125139))

### System.Text.RegularExpressions

- Fixed `BOL` anchor not writing back updated position in `TryFindNextPossibleStartingPosition`. ([dotnet/runtime#125280](https://github.com/dotnet/runtime/pull/125280))
- Fixed inline regex options not being allowed in conditional expression branches. ([dotnet/runtime#124699](https://github.com/dotnet/runtime/pull/124699))

### System.Threading

- Fixed `SingleConsumerUnboundedChannel.WaitToReadAsync` returning an exception instead of `false` when the channel completes. ([dotnet/runtime#125745](https://github.com/dotnet/runtime/pull/125745))

### System.Xml

- Fixed `XmlReader` `ArgumentOutOfRangeException` for malformed UTF-8 in XML documents. ([dotnet/runtime#124428](https://github.com/dotnet/runtime/pull/124428), thank you [@matantsach](https://github.com/matantsach))
- Fixed OOM in `BinHexDecoder`, `Base64Decoder`, and `XmlSchemaValidator` when throwing on large invalid input. ([dotnet/runtime#125930](https://github.com/dotnet/runtime/pull/125930))

---

## Community Contributors

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
