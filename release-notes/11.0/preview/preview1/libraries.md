# .NET Libraries in .NET 11 Preview 1 - Release Notes

.NET 11 Preview 1 includes new .NET Libraries features & enhancements:

- [Zstandard Compression Support](#zstandard-compression-support)
- [ZipArchiveEntry.Open with FileAccess Parameter](#ziparchiveentry-open-with-fileaccess-parameter)
- [TimeZone Performance Improvements (per-year caching)](#timezone-performance-improvements)
- [Generic Interlocked.And and Interlocked.Or Methods](#generic-interlockedand-and-interlockedor-methods)
- [Span-based IDN APIs for IdnMapping](#span-based-idn-apis-for-idnmapping)
- [File.OpenNullHandle for Efficient I/O Redirection](#fileopennullhandle-for-efficient-io-redirection)
- [Standard Handle APIs for Console](#standard-handle-apis-for-console)
- [CancellationToken Overloads for TextWriter](#cancellationtoken-overloads-for-textwriter)
- [Function Pointer Support in Reflection.Emit](#function-pointer-support-in-reflectionemit)
- [SOCKS5h Proxy Support in HttpClient](#socks5h-proxy-support-in-httpclient)
- [HTTP Automatic Decompression with Zstandard](#http-automatic-decompression-with-zstandard)

.NET Libraries updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview) documentation

## Zstandard Compression Support

[dotnet/runtime #119575](https://github.com/dotnet/runtime/pull/119575) adds native Zstandard (zstd) compression support to .NET through the new `ZStandardStream` class, `ZStandardEncoder`, and `ZStandardDecoder`.

Zstandard offers significantly faster compression and decompression compared to existing algorithms while maintaining competitive compression ratios.

Benchmarks:

| Method     | Level   | File             | Algorithm |   Mean      | Size | Compressed |
|----------- |-------- |----------------- |---------- |------------:|-----:|-----:|
| Compress   | Optimal | alice29.txt      | Brotli    | 2,306.40 μs | 148481 | 54517 |
| Compress   | Optimal | alice29.txt      | Zstandard | 842.743 μs  | 148481 | 54919 |
| Compress   | Optimal | alice29.txt      | Deflate   | 2,421.16 μs | 148481 | 53890 |
| | | | | | | |
| Decompress | Optimal | alice29.txt      | Brotli    |   320.82 μs |
| Decompress | Optimal | alice29.txt      | Zstandard | 139.251 μs  |
| Decompress | Optimal | alice29.txt      | Deflate   |   275.43 μs |
| | | | | | | |
| Compress   | Fastest | TestDocument.pdf | Brotli    |   300.40 μs | 121993 | 117104 |
| Compress   | Fastest | TestDocument.pdf | Zstandard | 137.3 μs    | 121993 | 119405 |
| Compress   | Fastest | TestDocument.pdf | Deflate   |   947.61 μs | 121993 | 121404 |
| | | | | | | |
| Decompress | Fastest | TestDocument.pdf | Brotli    |   233.14 μs |
| Decompress | Fastest | TestDocument.pdf | Zstandard |  17.22 μs   |
| Decompress | Fastest | TestDocument.pdf | Deflate   |   238.81 μs |

Usage:

```csharp
// Compress data
using var compressStream = new ZStandardStream(outputStream, CompressionMode.Compress);
await inputStream.CopyToAsync(compressStream);

// Decompress data  
using var decompressStream = new ZStandardStream(inputStream, CompressionMode.Decompress);
await decompressStream.CopyToAsync(outputStream);
```

## ZipArchiveEntry.Open with FileAccess Parameter

[dotnet/runtime #122032](https://github.com/dotnet/runtime/pull/122032) adds new overloads to `ZipArchiveEntry.Open()` that accept a `FileAccess` parameter, allowing users to specify the desired access mode when opening an entry stream.

When a `ZipArchive` is opened in `ZipArchiveMode.Update`, calling `ZipArchiveEntry.Open()` always returns a read-write stream by invoking `OpenInUpdateMode()`. This causes the entire entry to be decompressed into memory, even when the caller only intends to read the entry's contents.

New APIs:

```csharp
public Stream Open(FileAccess access);
public Task<Stream> OpenAsync(FileAccess access, CancellationToken cancellationToken = default);
```

Update Mode Details:

- `FileAccess.Read`: Opens a read-only stream over the entry's compressed data without loading it into memory. Useful for streaming reads.
- `FileAccess.Write`: Opens an empty writable stream, discarding any existing entry data. Semantically equivalent to "replace the entry content entirely" (like `FileMode.Create`).
- `FileAccess.ReadWrite`: Same as parameterless `Open()`/`OpenAsync()` - loads existing data into memory and returns a read/write/seekable stream.

## TimeZone Performance Improvements

[dotnet/runtime #119662](https://github.com/dotnet/runtime/pull/119662) introduces a **per-year cache** for time zone transitions, dramatically improving performance for time conversions. The cache stores all transitions for a given year in UTC format, eliminating repeated rule lookups during conversions.

### Windows

```
BenchmarkDotNet v0.15.2, Windows 11 (10.0.26100.6584/24H2/2024Update/HudsonValley)
11th Gen Intel Core i7-11700 2.50GHz, 1 CPU, 16 logical and 8 physical cores
```

| Faster                                               | base/diff | Base Median (ns) | Diff Median (ns) |
| ---------------------------------------------------- | ---------:| ----------------:| ----------------:|
| Baseline.Program.ConvertTimeFromUtc                  |      3.93 |            47.97 |            12.21 |
| Baseline.Program.ConvertTimeUsingLocalDateKind       |      3.47 |            66.70 |            19.21 |
| Baseline.Program.ConvertTimeUsingUnspecifiedDateKind |      3.34 |            63.77 |            19.07 |
| Baseline.Program.ConvertTimeToUtc                    |      2.98 |            48.33 |            16.23 |
| Baseline.Program.DateTimeNow                         |      2.81 |            54.57 |            19.42 |
| Baseline.Program.GetUtcOffset                        |      2.48 |            98.64 |            39.83 |
| Baseline.Program.ConvertTimeUsingUtcDateKind         |      2.39 |            19.66 |             8.23 |

### Linux (WSL)

```
BenchmarkDotNet v0.15.2, Linux Ubuntu 25.04 (Plucky Puffin)
11th Gen Intel Core i7-11700 2.50GHz, 1 CPU, 16 logical and 8 physical cores
```

| Faster                                               | base/diff | Base Median (ns) | Diff Median (ns) |
| ---------------------------------------------------- | ---------:| ----------------:| ----------------:|
| Baseline.Program.ConvertTimeToUtc                    |      4.70 |            63.80 |            13.57 |
| Baseline.Program.ConvertTimeUsingLocalDateKind       |      4.25 |            80.09 |            18.84 |
| Baseline.Program.ConvertTimeUsingUnspecifiedDateKind |      4.01 |            79.23 |            19.78 |
| Baseline.Program.ConvertTimeFromUtc                  |      3.54 |            39.34 |            11.12 |
| Baseline.Program.DateTimeNow                         |      3.51 |            50.99 |            14.54 |
| Baseline.Program.GetUtcOffset                        |      2.87 |           100.40 |            34.94 |
| Baseline.Program.ConvertTimeUsingUtcDateKind         |      1.64 |            17.60 |            10.73 |

This change also fixes several correctness issues with time zone handling (fixes #24839, #24277, #25075, #118915, #114476).

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

Example usage:

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

These methods throw on invalid input (consistent with existing APIs) and return `false` only when the destination buffer is too small.

Example usage:

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

## File.OpenNullHandle for Efficient I/O Redirection

[dotnet/runtime #123483](https://github.com/dotnet/runtime/pull/123483) adds `File.OpenNullHandle()` to obtain a handle to the system's null device (`NUL` on Windows, `/dev/null` on Unix). This enables efficient discarding of process output/error streams or providing empty input without the overhead of reading and ignoring data.

```csharp
namespace System.IO
{
    public static class File
    {
        public static SafeFileHandle OpenNullHandle();
    }
}
```

Example usage:

```csharp
// Efficiently discard process output
using var nullHandle = File.OpenNullHandle();
var startInfo = new ProcessStartInfo("myapp.exe")
{
    RedirectStandardOutput = true,
    StandardOutputHandle = nullHandle
};
```

## Standard Handle APIs for Console

[dotnet/runtime #123478](https://github.com/dotnet/runtime/pull/123478) adds APIs for direct access to standard input/output/error handles.

```csharp
namespace System
{
    public static class Console
    {
        public static SafeFileHandle OpenStandardInputHandle();
        public static SafeFileHandle OpenStandardOutputHandle();
        public static SafeFileHandle OpenStandardErrorHandle();
    }
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

## Function Pointer Support in Reflection.Emit

Two PRs add support for function pointer types in `System.Reflection.Emit`:

- [dotnet/runtime #119935](https://github.com/dotnet/runtime/pull/119935) adds support for creating and working with function pointer types
- [dotnet/runtime #121128](https://github.com/dotnet/runtime/pull/121128) extends support for references to unmanaged function pointers

These changes enable more advanced interop scenarios when dynamically generating assemblies.

## SOCKS5h Proxy Support in HttpClient

[dotnet/runtime #123218](https://github.com/dotnet/runtime/pull/123218) adds support for the `socks5h://` proxy scheme in `HttpClient`. Previously, attempts to use this scheme threw `NotSupportedException` with the message "Only the 'http', 'https', 'socks4', 'socks4a' and 'socks5' schemes are allowed for proxies."

The `socks5h://` scheme indicates that DNS resolution should be performed by the proxy server rather than locally.

```csharp
using var handler = new SocketsHttpHandler();
handler.Proxy = new WebProxy("socks5h://username:password@proxy.example.com:1080");
using HttpClient client = new HttpClient(handler);
var response = await client.GetStringAsync("http://example.com");
```

## HTTP Automatic Decompression with Zstandard

[dotnet/runtime #123531](https://github.com/dotnet/runtime/pull/123531) adds Zstandard compression support to `DecompressionMethods` for automatic HTTP response decompression.

```csharp
var handler = new HttpClientHandler
{
    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Zstandard
};

using var client = new HttpClient(handler);
// Automatically decompresses zstd-encoded responses
var response = await client.GetAsync("https://example.com");
```
