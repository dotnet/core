# .NET Libraries in .NET 11 Preview 1 - Release Notes

.NET 11 Preview 1 includes new .NET Libraries features & enhancements:

- [Zstandard Compression Support](#zstandard-compression-support)
- [BFloat16 Floating-Point Type](#bfloat16-floating-point-type)
- [TimeZone Performance Improvements](#timezone-performance-improvements)
- [ZipArchiveEntry.Open with FileAccess Parameter](#ziparchiveentryopen-with-fileaccess-parameter)
- [IReadOnlySet Support in System.Text.Json](#ireadonlyset-support-in-systemtextjson)
- [Base64 Parity with Base64Url](#base64-parity-with-base64url)
- [Generic Interlocked.And and Interlocked.Or Methods](#generic-interlockedand-and-interlockedor-methods)
- [Span-based IDN APIs for IdnMapping](#span-based-idn-apis-for-idnmapping)
- [CancellationToken Overloads for TextWriter](#cancellationtoken-overloads-for-textwriter)
- [Process I/O Improvements](#process-io-improvements)
- [Function Pointer Support in Reflection.Emit](#function-pointer-support-in-reflectionemit)
- [CGM Extension Support in MediaTypeMap](#cgm-extension-support-in-mediatypemap)
- [SOCKS5h Proxy Support in HttpClient](#socks5h-proxy-support-in-httpclient)

.NET Libraries updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview) documentation

## Zstandard Compression Support

[dotnet/runtime #119575](https://github.com/dotnet/runtime/pull/119575) adds native Zstandard (zstd) compression support to .NET through the new `ZStandardStream` class, `ZStandardEncoder`, and `ZStandardDecoder`.

Zstandard offers significantly faster compression and decompression compared to existing algorithms while maintaining competitive compression ratios.

Benchmarks from [dotnet/runtime #119575](https://github.com/dotnet/runtime/pull/119575) compare Zstandard against Brotli and Deflate across text (alice29.txt, 148 KB) and binary (TestDocument.pdf, 122 KB) workloads from the [Canterbury Corpus](http://corpus.canterbury.ac.nz/descriptions/) at both Optimal and Fastest compression levels. Zstandard compresses 2–7x faster than Brotli and Deflate at Optimal level, and decompresses 2–14x faster at Fastest level, while achieving comparable compression ratios.

Usage:

```csharp
// Compress data
using var compressStream = new ZStandardStream(outputStream, CompressionMode.Compress);
await inputStream.CopyToAsync(compressStream);

// Decompress data
using var decompressStream = new ZStandardStream(inputStream, CompressionMode.Decompress);
await decompressStream.CopyToAsync(outputStream);
```

### HTTP Automatic Decompression with Zstandard

[dotnet/runtime #123531](https://github.com/dotnet/runtime/pull/123531) adds Zstandard to `DecompressionMethods` for automatic HTTP response decompression.

```csharp
var handler = new HttpClientHandler
{
    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Zstandard
};

using var client = new HttpClient(handler);
// Automatically decompresses zstd-encoded responses
var response = await client.GetAsync("https://example.com");
```

## BFloat16 Floating-Point Type

[dotnet/runtime #98643](https://github.com/dotnet/runtime/pull/98643), contributed by community member @huoyaoyuan, adds `System.Numerics.BFloat16`, a 16-bit floating-point type using the "Brain Floating Point" format widely used in machine learning and AI workloads. BFloat16 uses the same number of exponent bits as `float` (8 bits) but with a reduced significand (7 bits), making it ideal for training and inference scenarios where range matters more than precision.

`BFloat16` implements all standard numeric interfaces (`INumber<BFloat16>`, `IFloatingPoint<BFloat16>`, etc.) and supports conversions to and from `float`, `double`, and `Half`.

```csharp
BFloat16 value = (BFloat16)3.14f;
float asFloat = (float)value;  // Lossless upcast to float

// Use in ML-style computation
BFloat16 a = (BFloat16)1.5f;
BFloat16 b = (BFloat16)2.0f;
BFloat16 result = a * b;  // 3.0
```

## TimeZone Performance Improvements

[dotnet/runtime #119662](https://github.com/dotnet/runtime/pull/119662) introduces a **per-year cache** for time zone transitions, dramatically improving performance for time conversions. The cache stores all transitions for a given year in UTC format, eliminating repeated rule lookups during conversions.

Benchmarks from [dotnet/runtime #119662](https://github.com/dotnet/runtime/pull/119662) measured seven common time zone operations (`ConvertTimeFromUtc`, `ConvertTimeToUtc`, `DateTimeNow`, `GetUtcOffset`, and three `ConvertTime` variants with different `DateTimeKind` values) on Windows 11 and Linux (WSL) using an 11th Gen Intel Core i7-11700. On Windows, operations are 2.4–3.9x faster (e.g. `ConvertTimeFromUtc` dropped from 48.0 ns to 12.2 ns). On Linux, improvements are even larger at 1.6–4.7x (e.g. `ConvertTimeToUtc` dropped from 63.8 ns to 13.6 ns).

This change also fixes several correctness issues with time zone handling (fixes #24839, #24277, #25075, #118915, #114476).

## ZipArchiveEntry.Open with FileAccess Parameter

[dotnet/runtime #122032](https://github.com/dotnet/runtime/pull/122032) adds new overloads to `ZipArchiveEntry.Open()` that accept a `FileAccess` parameter, allowing users to specify the desired access mode when opening an entry stream.

When a `ZipArchive` is opened in `ZipArchiveMode.Update`, calling `ZipArchiveEntry.Open()` always returns a read-write stream by invoking `OpenInUpdateMode()`. This causes the entire entry to be decompressed into memory, even when the caller only intends to read the entry's contents.

```csharp
public Stream Open(FileAccess access);
public Task<Stream> OpenAsync(FileAccess access, CancellationToken cancellationToken = default);
```

Update Mode Details:

- `FileAccess.Read`: Opens a read-only stream over the entry's compressed data without loading it into memory. Useful for streaming reads.
- `FileAccess.Write`: Opens an empty writable stream, discarding any existing entry data. Semantically equivalent to "replace the entry content entirely" (like `FileMode.Create`).
- `FileAccess.ReadWrite`: Same as parameterless `Open()`/`OpenAsync()` - loads existing data into memory and returns a read/write/seekable stream.

## IReadOnlySet Support in System.Text.Json

[dotnet/runtime #120306](https://github.com/dotnet/runtime/pull/120306), contributed by community member @sander1095, adds support for serializing and deserializing `IReadOnlySet<T>` collections in `System.Text.Json`. Previously, only `ISet<T>` and concrete set types like `HashSet<T>` were supported. This aligns the library's handling of `IReadOnlySet<T>` with other collection interfaces like `ISet<T>` and `ICollection<T>`.

```csharp
// Now works - previously threw NotSupportedException
IReadOnlySet<string> tags = new HashSet<string> { "dotnet", "csharp" };
string json = JsonSerializer.Serialize(tags);
IReadOnlySet<string> deserialized = JsonSerializer.Deserialize<IReadOnlySet<string>>(json);
```

## Base64 Parity with Base64Url

[dotnet/runtime #123151](https://github.com/dotnet/runtime/pull/123151) adds UTF-16 encoding/decoding APIs to `System.Buffers.Text.Base64` that previously only existed on `Base64Url`. The `Base64Url` class introduced a much nicer API surface (with `OperationStatus` returns, `EncodeToString`, `DecodeFromChars`, etc.) that standard `Base64` lacked, forcing developers to use the less capable `Convert` class for standard Base64 operations.

```csharp
namespace System.Buffers.Text;

public static partial class Base64
{
    // New APIs matching Base64Url surface
    public static byte[] DecodeFromChars(ReadOnlySpan<char> source);
    public static OperationStatus DecodeFromChars(ReadOnlySpan<char> source, Span<byte> destination,
        out int charsConsumed, out int bytesWritten, bool isFinalBlock = true);
    public static string EncodeToString(ReadOnlySpan<byte> source);
    public static char[] EncodeToChars(ReadOnlySpan<byte> source);
    public static int GetEncodedLength(int bytesLength);
    public static int GetMaxDecodedLength(int base64Length);
    // ... and more
}
```

## Generic Interlocked.And and Interlocked.Or Methods

[dotnet/runtime #120978](https://github.com/dotnet/runtime/pull/120978) adds generic versions of the `And` and `Or` methods to `System.Threading.Interlocked`, enabling atomic bitwise operations on any enum type or integer type.

```csharp
public static class Interlocked
{
    public static T And<T>(ref T location, T value) where T : struct;
    public static T Or<T>(ref T location, T value) where T : struct;
}
```

These methods support all integer primitive types (`byte`, `sbyte`, `short`, `ushort`, `int`, `uint`, `long`, `ulong`, `nint`, `nuint`) and any enum backed by these types.

```csharp
[Flags]
enum FilePermissions { None = 0, Read = 1, Write = 2, Execute = 4 }

FilePermissions permissions = FilePermissions.Read;

// Atomically add Write permission
Interlocked.Or(ref permissions, FilePermissions.Write);

// Atomically remove Execute permission
Interlocked.And(ref permissions, ~FilePermissions.Execute);
```

## Span-based IDN APIs for IdnMapping

[dotnet/runtime #123593](https://github.com/dotnet/runtime/pull/123593) adds span-based APIs to `IdnMapping` for zero-allocation IDN encoding/decoding.

```csharp
namespace System.Globalization
{
    public sealed class IdnMapping
    {
        public bool TryGetAscii(ReadOnlySpan<char> unicode, Span<char> destination, out int charsWritten);
        public bool TryGetUnicode(ReadOnlySpan<char> ascii, Span<char> destination, out int charsWritten);
    }
}
```

```csharp
var mapping = new IdnMapping();
Span<char> buffer = stackalloc char[256];

// Convert Unicode to ASCII (Punycode)
if (mapping.TryGetAscii("münchen.de", buffer, out int charsWritten))
{
    ReadOnlySpan<char> ascii = buffer.Slice(0, charsWritten);
    // ascii contains "xn--mnchen-3ya.de"
}
```

## CancellationToken Overloads for TextWriter

[dotnet/runtime #122127](https://github.com/dotnet/runtime/pull/122127) adds `CancellationToken` overloads to all `WriteAsync` and `WriteLineAsync` methods on `TextWriter`.

```csharp
public abstract class TextWriter
{
    public virtual Task WriteAsync(char value, CancellationToken cancellationToken);
    public virtual Task WriteAsync(string? value, CancellationToken cancellationToken);
    public virtual Task WriteAsync(char[] buffer, int index, int count, CancellationToken cancellationToken);
    public virtual Task WriteAsync(ReadOnlyMemory<char> buffer, CancellationToken cancellationToken);
    public virtual Task WriteLineAsync(CancellationToken cancellationToken);
    public virtual Task WriteLineAsync(char value, CancellationToken cancellationToken);
    public virtual Task WriteLineAsync(string? value, CancellationToken cancellationToken);
    public virtual Task WriteLineAsync(char[] buffer, int index, int count, CancellationToken cancellationToken);
    public virtual Task WriteLineAsync(ReadOnlyMemory<char> buffer, CancellationToken cancellationToken);
}
```

## Process I/O Improvements

### File.OpenNullHandle

[dotnet/runtime #123483](https://github.com/dotnet/runtime/pull/123483) adds `File.OpenNullHandle()` to obtain a handle to the system's null device (`NUL` on Windows, `/dev/null` on Unix). This enables efficient discarding of process output/error streams or providing empty input without the overhead of reading and ignoring data.

```csharp
public static class File
{
    public static SafeFileHandle OpenNullHandle();
}
```

### Standard Handle APIs

[dotnet/runtime #123478](https://github.com/dotnet/runtime/pull/123478) adds APIs for direct access to standard input/output/error handles.

```csharp
public static class Console
{
    public static SafeFileHandle OpenStandardInputHandle();
    public static SafeFileHandle OpenStandardOutputHandle();
    public static SafeFileHandle OpenStandardErrorHandle();
}
```

## Function Pointer Support in Reflection.Emit

Two PRs add support for function pointer types in `System.Reflection.Emit`:

- [dotnet/runtime #119935](https://github.com/dotnet/runtime/pull/119935) adds support for creating and working with function pointer types
- [dotnet/runtime #121128](https://github.com/dotnet/runtime/pull/121128) extends support for references to unmanaged function pointers

These changes enable more advanced interop scenarios when dynamically generating assemblies.

## CGM Extension Support in MediaTypeMap

[dotnet/runtime #122591](https://github.com/dotnet/runtime/pull/122591) adds the `.cgm` (Computer Graphics Metafile, ISO 8632) extension to `MediaTypeMap` with the IANA-registered MIME type `image/cgm`. Applications using `MediaTypeMap` to resolve `.cgm` files will now correctly identify them instead of returning null. CGM is still actively used in technical documentation, engineering, and aviation industry applications.

## SOCKS5h Proxy Support in HttpClient

[dotnet/runtime #123218](https://github.com/dotnet/runtime/pull/123218) adds support for the `socks5h://` proxy scheme in `HttpClient`. Previously, attempts to use this scheme threw `NotSupportedException`.

The `socks5h://` scheme indicates that DNS resolution should be performed by the proxy server rather than locally.

```csharp
using var handler = new SocketsHttpHandler();
handler.Proxy = new WebProxy("socks5h://proxy.example.com:1080");
using HttpClient client = new HttpClient(handler);
var response = await client.GetStringAsync("http://example.com");
```
