# .NET Libraries in .NET 11 Preview 1 - Release Notes

.NET 11 Preview 1 includes new .NET Libraries features & enhancements:

- [Zstandard Compression Support](#zstandard-compression-support)
- [BFloat16 Floating-Point Type](#bfloat16-floating-point-type)
- [ZipArchiveEntry Improvements](#ziparchiveentry-improvements)
- [FrozenDictionary Collection Expression Support](#frozendictionary-collection-expression-support)
- [TimeZone Improvements](#timezone-improvements)
- [Rune Support Across String, StringBuilder, and TextWriter](#rune-support-across-string-stringbuilder-and-textwriter)
- [MediaTypeMap for MIME Type Lookups](#mediatypemap-for-mime-type-lookups)
- [HMAC and KMAC Verification APIs](#hmac-and-kmac-verification-apis)
- [Hard Link Creation APIs](#hard-link-creation-apis)
- [DivisionRounding for Integer Division Modes](#divisionrounding-for-integer-division-modes)
- [IReadOnlySet Support in System.Text.Json](#ireadonlyset-support-in-systemtextjson)
- [Base64 Parity with Base64Url](#base64-parity-with-base64url)
- [Generic Interlocked.And and Interlocked.Or Methods](#generic-interlockedand-and-interlockedor-methods)
- [Happy Eyeballs Support in Socket.ConnectAsync](#happy-eyeballs-support-in-socketconnectasync)
- [Span-based IDN APIs for IdnMapping](#span-based-idn-apis-for-idnmapping)
- [CancellationToken Overloads for TextWriter](#cancellationtoken-overloads-for-textwriter)
- [Process I/O Improvements](#process-io-improvements)
- [Function Pointer Support in Reflection.Emit](#function-pointer-support-in-reflectionemit)
- [CGM Extension Support in MediaTypeMap](#cgm-extension-support-in-mediatypemap)
- [SOCKS5h Proxy Support in HttpClient](#socks5h-proxy-support-in-httpclient)
- [Performance Improvements](#performance-improvements)

## Zstandard Compression Support

[dotnet/runtime #119575](https://github.com/dotnet/runtime/pull/119575) adds native Zstandard (zstd) compression support to .NET through the new `ZstandardStream` class, `ZstandardEncoder`, and `ZstandardDecoder`.

Zstandard offers significantly faster compression and decompression compared to existing algorithms while maintaining competitive compression ratios. The new APIs include a full set of streaming, one-shot, and dictionary-based compression and decompression capabilities.

Benchmarks from [dotnet/runtime #119575](https://github.com/dotnet/runtime/pull/119575) compare Zstandard against Brotli and Deflate across text (alice29.txt, 148 KB) and binary (TestDocument.pdf, 122 KB) workloads from the [Canterbury Corpus](http://corpus.canterbury.ac.nz/descriptions/) at both Optimal and Fastest compression levels. Zstandard compresses 2–7x faster than Brotli and Deflate at Optimal level, and decompresses 2–14x faster at Fastest level, while achieving comparable compression ratios.

```csharp
// Compress data using ZstandardStream
using var compressStream = new ZstandardStream(outputStream, CompressionMode.Compress);
await inputStream.CopyToAsync(compressStream);

// Decompress data
using var decompressStream = new ZstandardStream(inputStream, CompressionMode.Decompress);
await decompressStream.CopyToAsync(outputStream);
```

Advanced usage with `ZstandardEncoder` and `ZstandardDecoder` provides fine-grained control over compression parameters, including quality level, window size, dictionary-based compression, and checksum appending:

```csharp
// One-shot compression with quality settings
var encoder = new ZstandardEncoder(quality: 5, windowLog: 22);
// ... use encoder.Compress() for incremental compression

// Configure with options
var options = new ZstandardCompressionOptions
{
    Quality = 5,
    WindowLog = 22,
    AppendChecksum = true,
    EnableLongDistanceMatching = true
};
using var stream = new ZstandardStream(outputStream, options);
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

`BFloat16` implements all standard numeric interfaces (`INumber<BFloat16>`, `IFloatingPoint<BFloat16>`, `IBinaryFloatingPointIeee754<BFloat16>`, etc.) and supports conversions to and from `float`, `double`, and `Half`. Supporting APIs are also added across the platform, including `BitConverter`, `BinaryPrimitives`, `BigInteger`, `Complex`, and all `Vector` types (`Vector64`, `Vector128`, `Vector256`, `Vector512`).

```csharp
BFloat16 value = (BFloat16)3.14f;
float asFloat = (float)value;  // Lossless upcast to float

// Use in ML-style computation
BFloat16 a = (BFloat16)1.5f;
BFloat16 b = (BFloat16)2.0f;
BFloat16 result = a * b;  // 3.0

// Binary serialization with BinaryPrimitives
Span<byte> buffer = stackalloc byte[2];
BinaryPrimitives.WriteBFloat16LittleEndian(buffer, value);
BFloat16 read = BinaryPrimitives.ReadBFloat16LittleEndian(buffer);
```

## ZipArchiveEntry Improvements

### Open with FileAccess Parameter

[dotnet/runtime #122032](https://github.com/dotnet/runtime/pull/122032) adds new overloads to `ZipArchiveEntry.Open()` that accept a `FileAccess` parameter, allowing users to specify the desired access mode when opening an entry stream.

When a `ZipArchive` is opened in `ZipArchiveMode.Update`, calling `ZipArchiveEntry.Open()` always returns a read-write stream that loads the entire entry into memory. The new overload lets you open entries in read-only mode for streaming without the memory overhead.

```csharp
using var archive = ZipFile.Open("archive.zip", ZipArchiveMode.Update);
var entry = archive.GetEntry("large-file.dat");

// Read-only: streams compressed data without loading into memory
using var readStream = entry.Open(FileAccess.Read);

// Write-only: replaces entry content entirely
using var writeStream = entry.Open(FileAccess.Write);

// Async overload also available
using var asyncStream = await entry.OpenAsync(FileAccess.Read);
```

### ZipCompressionMethod Property

[dotnet/runtime #95909](https://github.com/dotnet/runtime/issues/95909) exposes the `CompressionMethod` property on `ZipArchiveEntry` and adds the `ZipCompressionMethod` enum. This enables applications to determine the compression algorithm used for each entry without having to compare `CompressedLength` against `Length` as a heuristic.

```csharp
using var archive = ZipFile.Open("archive.zip", ZipArchiveMode.Read);
foreach (var entry in archive.Entries)
{
    if (entry.CompressionMethod == ZipCompressionMethod.Stored)
    {
        Console.WriteLine($"{entry.FullName} is stored without compression");
    }
}
```

## FrozenDictionary Collection Expression Support

[dotnet/runtime #114090](https://github.com/dotnet/runtime/issues/114090) adds the `[CollectionBuilder]` attribute to `FrozenDictionary<TKey, TValue>`, enabling construction from C# [dictionary expressions](https://github.com/dotnet/csharplang/blob/main/proposals/dictionary-expressions.md). This follows the pattern established for `FrozenSet` and `ImmutableDictionary` in earlier releases.

```csharp
// Create a FrozenDictionary using dictionary expression syntax
FrozenDictionary<string, int> lookup = [with(StringComparer.Ordinal), "one":1, "two":2, "three":3];
```

## TimeZone Improvements

[dotnet/runtime #119662](https://github.com/dotnet/runtime/pull/119662) introduces a **per-year cache** for time zone transitions, dramatically improving performance for time conversions. The cache stores all transitions for a given year in UTC format, eliminating repeated rule lookups during conversions.

Benchmarks from [dotnet/runtime #119662](https://github.com/dotnet/runtime/pull/119662) measured seven common time zone operations (`ConvertTimeFromUtc`, `ConvertTimeToUtc`, `DateTimeNow`, `GetUtcOffset`, and three `ConvertTime` variants with different `DateTimeKind` values) on Windows 11 and Linux (WSL) using an 11th Gen Intel Core i7-11700. On Windows, operations are 2.4–3.9x faster (e.g. `ConvertTimeFromUtc` dropped from 48.0 ns to 12.2 ns). On Linux, improvements are even larger at 1.6–4.7x (e.g. `ConvertTimeToUtc` dropped from 63.8 ns to 13.6 ns).

The new caching approach also replaces the legacy rule-based conversion path—which had accumulated many incremental patches over the years—with a simplified lookup, fixing several correctness issues where time zone conversions returned incorrect results (fixes #24839, #24277, #25075, #118915, #114476).

## Rune Support Across String, StringBuilder, and TextWriter

[dotnet/runtime #27912](https://github.com/dotnet/runtime/issues/27912) flows `System.Text.Rune` through many more APIs across `String`, `StringBuilder`, `TextWriter`, `TextInfo`, and `Char`. This long-requested enhancement makes it significantly easier for applications to work with Unicode text correctly, particularly for characters outside the Basic Multilingual Plane that require surrogate pairs when represented as `char`.

### String

New `Rune`-based overloads have been added for searching, replacing, splitting, and trimming:

```csharp
string text = "Hello 🌍 World";
Rune globe = new Rune(0x1F30D); // 🌍

bool contains = text.Contains(globe);                    // true
int index = text.IndexOf(globe);                         // 6
bool starts = text.StartsWith(globe);                    // false
string replaced = text.Replace(globe, new Rune('X'));    // "Hello X World"
string[] parts = text.Split(globe);                      // ["Hello ", " World"]
string trimmed = text.Trim(globe);
```

Additionally, `Char.Equals(char, StringComparison)` and `String.StartsWith(char, StringComparison)` / `String.EndsWith(char, StringComparison)` overloads fill gaps that previously existed only for `string` parameters.

### StringBuilder

`StringBuilder` gains `Rune`-aware methods for appending, inserting, replacing, and enumerating:

```csharp
var sb = new StringBuilder("Hello ");
sb.Append(new Rune(0x1F30D));       // Append 🌍
Rune r = sb.GetRuneAt(6);           // Get the Rune at index 6
sb.Replace(new Rune(0x1F30D), new Rune('X'));

// Enumerate Runes in StringBuilder
foreach (Rune rune in sb.EnumerateRunes())
{
    Console.Write(rune);
}
```

### RunePosition

The new `RunePosition` struct and its `Utf16Enumerator`/`Utf8Enumerator` provide position-aware Rune enumeration over spans, including information about whether a replacement character was substituted for invalid data:

```csharp
ReadOnlySpan<char> text = "Hello 🌍";
foreach (RunePosition pos in RunePosition.EnumerateUtf16(text))
{
    Console.WriteLine($"Rune: {pos.Rune}, Start: {pos.StartIndex}, Length: {pos.Length}");
}
```

### TextWriter and TextInfo

`TextWriter` gains `Write(Rune)`, `WriteAsync(Rune)`, `WriteLine(Rune)`, and `WriteLineAsync(Rune)` methods. `TextInfo` adds `ToLower(Rune)` and `ToUpper(Rune)` for culture-aware casing.

## MediaTypeMap for MIME Type Lookups

[dotnet/runtime #121017](https://github.com/dotnet/runtime/issues/121017) adds `System.Net.Mime.MediaTypeMap`, a built-in API for mapping between file extensions and MIME/media types. Previously, developers had to re-create this mapping themselves or rely on third-party packages. The new API supports all IANA-registered mappings plus common ones from Apache mime.types.

```csharp
using System.Net.Mime;

// Get MIME type from file extension
string? mediaType = MediaTypeMap.GetMediaType(".json");     // "application/json"
string? pngType = MediaTypeMap.GetMediaType("image.png");   // "image/png"

// Get file extension from MIME type
string? ext = MediaTypeMap.GetExtension("application/pdf"); // ".pdf"

// Also works with ReadOnlySpan<char>
ReadOnlySpan<char> path = "/files/document.pdf";
string? type = MediaTypeMap.GetMediaType(path);
```

## HMAC and KMAC Verification APIs

[dotnet/runtime #116028](https://github.com/dotnet/runtime/issues/116028) adds `Verify` methods to all HMAC classes (`HMACSHA256`, `HMACSHA384`, `HMACSHA512`, `HMACSHA1`, `HMACMD5`, `HMACSHA3_256`, `HMACSHA3_384`, `HMACSHA3_512`), all KMAC classes (`Kmac128`, `Kmac256`, `KmacXof128`, `KmacXof256`), `IncrementalHash`, and `CryptographicOperations`.

HMAC values often need to be compared in fixed (constant) time to prevent timing attacks. Previously, this required two steps: computing the HMAC with `HashData`, then comparing with `CryptographicOperations.FixedTimeEquals`. This two-step pattern was error-prone — developers often accidentally used LINQ's `SequenceEqual` or similar non-constant-time comparisons. The new `Verify` methods combine both steps into a single, safe call.

```csharp
// Before: error-prone two-step pattern
byte[] computed = HMACSHA256.HashData(key, data);
bool valid = CryptographicOperations.FixedTimeEquals(computed, expectedHash);

// After: single-step verification (always constant-time)
bool valid = HMACSHA256.Verify(key, data, expectedHash);

// Stream-based and async overloads are also available
bool validStream = await HMACSHA256.VerifyAsync(key, dataStream, expectedHash);

// Algorithm-agnostic verification via CryptographicOperations
bool result = CryptographicOperations.VerifyHmac(
    HashAlgorithmName.SHA256, key, data, expectedHash);
```

## Hard Link Creation APIs

[dotnet/runtime #69030](https://github.com/dotnet/runtime/issues/69030) adds `File.CreateHardLink` and `FileInfo.CreateAsHardLink` for creating hard links. Since .NET 6, `File.CreateSymbolicLink` has been available, but symbolic links typically require administrator privileges on Windows, whereas hard links do not. Hard links point to the same file data on disk (same inode on Unix, same MFT entry on Windows) and cannot span volumes, making them less of a security risk.

```csharp
// Create a hard link from File static method
FileSystemInfo link = File.CreateHardLink("./link.txt", "./original.txt");

// Create a hard link from FileInfo instance
var fileInfo = new FileInfo("./original.txt");
fileInfo.CreateAsHardLink("./link.txt");
```

## DivisionRounding for Integer Division Modes

[dotnet/runtime #93568](https://github.com/dotnet/runtime/issues/93568) adds support for alternative rounding modes in integer division through the new `DivisionRounding` enum and new methods on `IBinaryInteger<T>`: `Divide`, `DivRem`, and `Remainder`.

Most hardware implements truncated division (`/` and `%` in C#), but different languages and problem domains require floored, ceiling, Euclidean, or away-from-zero rounding. While computing any of these is fairly trivial, the most efficient implementation is often non-obvious. These new APIs let developers pick the right mode for their scenario with a well-optimized implementation.

```csharp
// Standard C# division is truncated: -7 / 2 = -3
int truncated = int.Divide(-7, 2, DivisionRounding.Truncate);   // -3

// Floored division: rounds towards -infinity
int floored = int.Divide(-7, 2, DivisionRounding.Floor);        // -4

// Euclidean remainder: always non-negative
int euclideanRem = int.Remainder(-7, 3, DivisionRounding.Euclidean); // 2

// Get both quotient and remainder at once
var (q, r) = int.DivRem(-7, 2, DivisionRounding.Floor);         // q=-4, r=1
```

The `DivisionRounding` enum supports five modes:

| Mode | Description |
|---|---|
| `Truncate` | Towards zero (default C# behavior) |
| `Floor` | Towards negative infinity |
| `Ceiling` | Towards positive infinity |
| `AwayFromZero` | Away from zero |
| `Euclidean` | floor(x / abs(n)) * sign(n) |

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

## Happy Eyeballs Support in Socket.ConnectAsync

[dotnet/runtime #87932](https://github.com/dotnet/runtime/issues/87932) implements [RFC 8305 "Happy Eyeballs"](https://www.rfc-editor.org/rfc/rfc8305) support in `Socket.ConnectAsync` through the new `ConnectAlgorithm` enum. Happy Eyeballs improves connection latency by making A and AAAA DNS requests in parallel and alternating connection attempts between IPv4 and IPv6 addresses.

```csharp
var e = new SocketAsyncEventArgs();
e.RemoteEndPoint = new DnsEndPoint("example.com", 443);

// Use Happy Eyeballs algorithm for faster dual-stack connections
Socket.ConnectAsync(
    SocketType.Stream,
    ProtocolType.Tcp,
    e,
    ConnectAlgorithm.Parallel);
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

## Performance Improvements

### Guid.NewGuid() ~10x Faster on Linux

[dotnet/runtime #123540](https://github.com/dotnet/runtime/pull/123540) speeds up `Guid.NewGuid()` on Linux by switching from `/dev/urandom` reads to the `getrandom()` syscall and by batching and caching GUIDs. The result is a ~10x improvement: from 614.2 ns to 61.16 ns per call. Contributed by community member @reedz.

### BigInteger Toom-Cook Multiplication

[dotnet/runtime #112876](https://github.com/dotnet/runtime/pull/112876) upgrades `BigInteger.Multiply` to use the Toom-Cook 3-way algorithm for large operands, reducing time complexity from O(n^1.58) (Karatsuba) to O(n^1.46). For very large multiplications, this yields measurable improvements — e.g., a multiplication that previously took 750 μs now completes in 690 μs, with the gap widening as digit counts increase. Contributed by community member @kzrnm.

### Vectorized BitIncrement/BitDecrement in TensorPrimitives

[dotnet/runtime #123610](https://github.com/dotnet/runtime/pull/123610) adds SIMD vectorization for `TensorPrimitives.BitIncrement` and `TensorPrimitives.BitDecrement` on `float` and `double`. Previously these operations were scalar-only.

| Type   | Before       | After    | Improvement |
|--------|--------------|----------|-------------|
| float  | 848.3 ns     | 227.8 ns | 3.7x faster |
| double | 1,691.5 ns   | 445.4 ns | 3.8x faster |

### Directory.GetFiles OS-Level Pattern Filtering on Windows

[dotnet/runtime #122947](https://github.com/dotnet/runtime/pull/122947) optimizes `Directory.GetFiles` on Windows by passing safe search patterns directly to `NtQueryDirectoryFile` as a pre-filter hint, enabling the NTFS B-tree to seek efficiently. For patterns like `"A14881*.jpg"` in a directory with 140,000 files but only 4 matches, this reduces the operation from scanning all 140K entries to returning ~4–10 entries. The managed `MatchesPattern` filter still runs afterward to ensure identical behavior.

### BitArray.PopCount

[dotnet/runtime #119804](https://github.com/dotnet/runtime/pull/119804) adds `BitArray.PopCount()`, which returns the number of set bits using hardware-accelerated population count instructions. Contributed by community member @huoyaoyuan.

```csharp
var bits = new BitArray(new[] { true, false, true, true, false });
int count = bits.PopCount(); // 3
```
