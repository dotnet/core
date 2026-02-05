# What's New in .NET 11 Libraries - Release Notes

This document summarizes new features, performance improvements, and notable changes coming to .NET Libraries in .NET 11.


## Highlights

- **43** new features and APIs
- **9** performance improvements
- **74** total notable changes across **27** areas

## Table of Contents

- [Threading & Time](#threading--time) (3)
- [Networking (HTTP)](#networking-http) (7)
- [Networking](#networking) (7)
- [Other](#other) (5)
- [Hardware Intrinsics](#hardware-intrinsics) (4)
- [File I/O](#file-i/o) (4)
- [Cryptography & Security](#cryptography-&-security) (3)
- [Runtime](#runtime) (3)
- [Memory](#memory) (3)
- [Regular Expressions](#regular-expressions) (2)
- [JSON Serialization](#json-serialization) (2)
- [Compression](#compression) (2)
- [Globalization](#globalization) (2)
- [System.Runtime.InteropServices.JavaScript](#systemruntimeinteropservicesjavascript) (2)
- [Buffers](#buffers) (2)
- [LINQ](#linq) (2)
- [Collections](#collections) (2)
- [System.Formats.Tar](#systemformatstar) (2)
- [Numerics](#numerics) (1)
- [Tensor Primitives](#tensor-primitives) (1)
- [Microsoft.Extensions.Logging](#microsoftextensionslogging) (1)
- [System.Diagnostics](#systemdiagnostics) (1)
- [System.Runtime.InteropServices](#systemruntimeinteropservices) (1)
- [System.Runtime.CompilerServices](#systemruntimecompilerservices) (1)

---

## Networking (HTTP)

### New Features

#### Add DecompressionMethods.Zstandard for HTTP automatic decompression

[PR #123531](https://github.com/dotnet/runtime/pull/123531) by @rzikm with GitHub Copilot

Adds Zstandard compression support to DecompressionMethods for automatic HTTP response decompression, matching the API proposal. Follows the established pattern from Brotli support.

```csharp
var handler = new HttpClientHandler
{
    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Zstandard
};

using var client = new HttpClient(handler);
// Automatically decompresses zstd-encoded responses
var response = await client.GetAsync("https://example.com");
```

#### Add an ASCII check for edge-case non-ASCII hosts that can't be Punycode encoded

[PR #123934](https://github.com/dotnet/runtime/pull/123934) by @MihaZupan

This is an edge-case where some hosts that exceed DNS limits (e.g. contain long labels) can't get Punycode encoded, and their IdnHost may return a non-ASCII value.

#### Add support for socks5h proxy scheme

[PR #123218](https://github.com/dotnet/runtime/pull/123218) by @MihaZupan with GitHub Copilot

HttpClient now accepts socks5h:// proxy URIs. Previously, attempts to use this scheme threw NotSupportedException with message "Only the 'http', 'https', 'socks4', 'socks4a' and 'socks5' schemes are allowed for proxies."

```csharp
using var handler = new SocketsHttpHandler();
handler.Proxy = new WebProxy("socks5h://username:password@proxy.example.com:1080");
using HttpClient client = new HttpClient(handler);
var response = await client.GetStringAsync("http://ifconfig.me/ip");
```

### Improvements

#### [browser] LoopbackServer - make GenericLoopbackServer.CloseWebSocket async

[PR #123327](https://github.com/dotnet/runtime/pull/123327) by @pavelsavara

[browser] LoopbackServer - make GenericLoopbackServer.CloseWebSocket async

#### Avoid temporary List allocation with HTTP/3 trailers

[PR #122677](https://github.com/dotnet/runtime/pull/122677) by @MihaZupan

We can write directly into the final header collection, no need for the List in between.

#### Refactor HTTP/3 server stream handling to consolidate exception handling for stream resets

[PR #122561](https://github.com/dotnet/runtime/pull/122561) by @MihaZupan with GitHub Copilot

>

#### Reduce unsafe code usage in HttpHeaders

[PR #122132](https://github.com/dotnet/runtime/pull/122132) by @GrabYourPitchforks

The usage of GetArrayDataReference in HttpHeaders is unnecessary. Since the JIT can prove that accessing the 0th element of the array will not result in an IndexOutOfBoundsException (see the newarr two lines above the changed code), standard arra

---

## Networking

### New Features

#### Add Uri.UriSchemeData constant

[PR #123147](https://github.com/dotnet/runtime/pull/123147) by @stephentoub with GitHub Copilot

Adds UriSchemeData constant to System.Uri for data: URIs, following the pattern established in .NET 6 for adding scheme constants.

```csharp
namespace System
{
    public partial class Uri
    {
        /// <summary>Specifies that the URI is a data URI.</summary>
        public static readonly string UriSchemeData = "data";
    }
}
```

#### Add null validation for relativeUri in Uri(Uri, Uri) constructor

[PR #123134](https://github.com/dotnet/runtime/pull/123134) by @MihaZupan with GitHub Copilot

The Uri(Uri, Uri) constructor threw NullReferenceException when passed a null relativeUri, instead of ArgumentNullException at parameter validation time.

```csharp
// Before: throws NullReferenceException deep in CreateThisFromUri
// After: throws ArgumentNullException immediately
Uri baseUri = new Uri("http://localhost/");
Uri result = new Uri(baseUri, (Uri)null);  // ArgumentNullException with correct parameter name
```

#### Add support for .cgm (Computer Graphics Metafile) extension to MediaTypeMap

[PR #122591](https://github.com/dotnet/runtime/pull/122591) by @stephentoub with GitHub Copilot

>

### Improvements

#### Deny unmasked frame receive for WebSocket Server

[PR #123485](https://github.com/dotnet/runtime/pull/123485) by @liveans

Increasing RFC-compliance for WebSocket

#### Fix another Uri debug assert

[PR #123075](https://github.com/dotnet/runtime/pull/123075) by @MihaZupan

Overlaps special-cases empty spans as not overlapping even if the pointer appears in the middle.

#### Fix edge-case Uri debug assert failure

[PR #123054](https://github.com/dotnet/runtime/pull/123054) by @MihaZupan

If Compress removes the entire path, and that path was otherwise missing a leading slash, we can get into the case where dest.Length == start after the Compress call.

#### Haiku: Mark unsupported advanced network functions

[PR #121882](https://github.com/dotnet/runtime/pull/121882) by @trungnt2910

Add the UnsupportedOSPlatformAttribute for Haiku to managed network functions in System.Net.NetworkInformation to provide a consistent API on Haiku.

---

## Other

### New Features

#### Add JsonSerializerDefaults.Strict support to JsonSourceGenerationOptionsAttribute constructor

[PR #122899](https://github.com/dotnet/runtime/pull/122899) by @PranavSenthilnathan with GitHub Copilot

>

```csharp
> using System.Text.Json;
> using System.Text.Json.Serialization;
>
> internal static class Reproduction
> {
>     public static void Main()
>     {
>         // Crash at runtime
>         _ = typeof(SourceGenerationContext).GetCustomAttributes(true);
>     }
> }
>
> [JsonSourceGenerationOptions(JsonSerializerDefaults.Strict)]
> [JsonSerializable(typeof(Example))]
> internal partial class SourceGenerationContext : JsonSerializerContext;
>
> internal class Example;
>
```

#### Fix Regex.Escape to not escape vertical tab and add comprehensive tests

[PR #123088](https://github.com/dotnet/runtime/pull/123088) by @stephentoub with GitHub Copilot

main PR https://github.com/dotnet/runtime/pull/120625

#### Add [OverloadResolutionPriority(1)] to MemoryMarshal.AsRef(Span<byte>)

[PR #122330](https://github.com/dotnet/runtime/pull/122330) by @stephentoub with GitHub Copilot

>

```csharp
> ref T AsRef<T>(Span<byte> span)
> ref readonly T AsRef<T>(ReadOnlySpan<byte> span)
>
```

### Performance

#### Fix IndexOfAnyInRange inconsistent behavior with invalid ranges across vectorized/scalar paths

[PR #123365](https://github.com/dotnet/runtime/pull/123365) by @EgorBo with GitHub Copilot

IndexOfAnyInRange and related APIs return inconsistent results for invalid ranges (where highInclusive < lowInclusive) depending on whether hardware intrinsics are enabled. The vectorized path computes highInclusive - lowInclusive, which wraps to a large positive value for unsigned types, causing incorrect matches.

```csharp
ReadOnlySpan<byte> data = [50];
int result = data.IndexOfAnyInRange((byte)200, (byte)100);
// Returns 0 with intrinsics enabled (incorrect)
// Returns -1 with intrinsics disabled (correct)
```

### Improvements

#### Change TypeMapLazyDictionary to use direct cast instead of 'as' operator for RuntimeAssembly

[PR #122885](https://github.com/dotnet/runtime/pull/122885) by @jtschuster with GitHub Copilot

Replaced as RuntimeAssembly with direct cast (RuntimeAssembly?) in TypeMapLazyDictionary.CreateMaps() for both Assembly.Load() and Assembly.GetEntryAssembly() calls.

---

## Hardware Intrinsics

### New Features

#### Sve2: Add ShiftRightLogicalNarrowingSaturate(Even|Odd)

[PR #123888](https://github.com/dotnet/runtime/pull/123888) by @a74nh

Sve2: Add ShiftRightLogicalNarrowingSaturate(Even|Odd)

#### SVE: Add float/double args for mask APIs

[PR #123947](https://github.com/dotnet/runtime/pull/123947) by @a74nh

Everything except for the CreateWhile*() changes

### Improvements

#### Fix SVE2 API for Odd/Even methods

[PR #122173](https://github.com/dotnet/runtime/pull/122173) by @ylpoonlg

Fixes https://github.com/dotnet/runtime/issues/121961.

#### Fix SVE2 API for RotateComplex methods

[PR #122172](https://github.com/dotnet/runtime/pull/122172) by @ylpoonlg

Rename argument names for the following methods:

---

## File I/O

### New Features

#### Add OpenStandardInputHandle, OpenStandardOutputHandle, and OpenStandardErrorHandle APIs

[PR #123478](https://github.com/dotnet/runtime/pull/123478) by @adamsitnik with GitHub Copilot

✨ Let Copilot coding agent [set things up for you](https://github.com/dotnet/runtime/issues/new?title=✨+Set+up+Copilot+instructions&body=Configure%20instructions%20for%20this%20repository%20as%20documented%20in%20%5BBest%20practices%20for%20Copilot%2

#### Add File.OpenNullHandle() for efficient process I/O redirection

[PR #123483](https://github.com/dotnet/runtime/pull/123483) by @adamsitnik with GitHub Copilot

Adds File.OpenNullHandle() API to obtain a handle to the system's null device (NUL on Windows, /dev/null on Unix). This enables efficient discarding of process output/error streams or providing empty input without the overhead of reading and ignoring data.

```csharp
process.StartInfo.RedirectStandardOutput = true;
process.OutputDataReceived += (sender, e) => { }; // Wasteful
process.BeginOutputReadLine();
```

#### Add CancellationToken overloads for TextWriter.WriteAsync and WriteLineAsync

[PR #122127](https://github.com/dotnet/runtime/pull/122127) by @stephentoub with GitHub Copilot

Successfully implemented the approved API proposal for adding CancellationToken overloads to TextWriter. The implementation:

```csharp
> namespace System.IO;
>
> public abstract class TextWriter
> {
>     public Task WriteAsync(string? value, CancellationToken token);
>     public Task WriteLineAsync(CancellationToken token);
>     public Task WriteLineAsync(string? value, CancellationToken token);
> }
>
```

### Performance

#### Optimize Directory.GetFiles by passing safe patterns to NtQueryDirectoryFile

[PR #122947](https://github.com/dotnet/runtime/pull/122947) by @jozkee with GitHub Copilot

On Windows, Directory.GetFiles with search patterns is O(N) instead of O(log N) because .NET Core+ always passes null to NtQueryDirectoryFile's FileName parameter, enumerating all files and filtering in managed code.

---

## Cryptography & Security

### New Features

#### Add AppContext switch for SignedInfo maximum number of references.

[PR #123721](https://github.com/dotnet/runtime/pull/123721) by @vcsjones

By default, the SignedInfo class will process at most 100 references per SignedInfo as a security mitigation. In .NET Framework, this value is configurable by registry. In .NET Core however, this value is hardcoded to 100. For users that are currentl

#### Remove managed implementation from SP800-108 on Windows

[PR #122816](https://github.com/dotnet/runtime/pull/122816) by @vcsjones

It was only used for Windows 7.

### Improvements

#### Fix FromBase64Transform buffer sizing and output buffer handling

[PR #122805](https://github.com/dotnet/runtime/pull/122805) by @stephentoub with GitHub Copilot

>

```csharp
// Before: rents only for new input, ignoring retained bytes
transformBuffer = transformBufferArray = CryptoPool.Rent(inputCount);

// After: rents for total bytes (retained + new input)
transformBuffer = transformBufferArray = CryptoPool.Rent(bytesToTransform);
```

---

## Runtime

### New Features

#### Add side-effect free debugger display to `ValueStringBuilder`.

[PR #122265](https://github.com/dotnet/runtime/pull/122265) by @teo-tsirpanis

Calling ToString() clears the builder, which can cause surprises when debugging.

#### Add fast path to Array.ConstrainedCopy for single-dimensional arrays

[PR #122530](https://github.com/dotnet/runtime/pull/122530) by @jkotas with GitHub Copilot

>

### Performance

#### Fix vectorization of `Ascii.Equals` for lengths 8..15

[PR #123115](https://github.com/dotnet/runtime/pull/123115) by @pentp

In case of WideningLoader it currently uses Vector128<TLeft>.Count (16) as the minimum length, but 8 bytes/chars is the actual minimum.

---

## Memory

### Improvements

#### Fix Base64.DecodeFromUtf8 consuming whitespace in partial final quantum when isFinalBlock=false

[PR #123313](https://github.com/dotnet/runtime/pull/123313) by @MihaZupan with GitHub Copilot

Base64.DecodeFromUtf8() incorrectly consumed whitespace characters when a final quantum (containing padding =) was split by whitespace and isFinalBlock=false. This broke streaming decoders that retry with isFinalBlock=true after receiving more data.

```csharp
// Before: bytesConsumed=2, making recovery impossible
Base64.DecodeFromUtf8("AQ\r\nQ="u8, output, out int consumed, out _, isFinalBlock: false);
// consumed=2, but "Q=" slice is invalid

// After: bytesConsumed=0, allowing retry with full input
Base64.DecodeFromUtf8("AQ\r\nQ="u8, output, out int consumed, out _, isFinalBlock: false);
Base64.DecodeFromUtf8("AQ\r\nQ="u8, output, out _, out _, isFinalBlock: true); // succeeds
```

#### Use existing Base64 helpers for Base64FormattingOptions.InsertLineBreaks

[PR #123403](https://github.com/dotnet/runtime/pull/123403) by @MihaZupan

Use existing Base64 helpers for Base64FormattingOptions.InsertLineBreaks

#### Fix Base64 decoding edge cases with small destinations and whitespace

[PR #123260](https://github.com/dotnet/runtime/pull/123260) by @MihaZupan

From InvalidDataFallback we'll call back into DecodeFrom to try and process more data.

---

## Regular Expressions

### Improvements

#### Port backreference SequenceEquals optimization to RegexCompiler

[PR #123914](https://github.com/dotnet/runtime/pull/123914) by @stephentoub

The regex source generator was using SequenceEqual when comparing case-sensitive backreferences, but the regex compiler wasn't. This just adds in that missing code, as well as some more tests for case-insensitive backreferences.

#### Port alternation switch optimization from source generator to RegexCompiler

[PR #122959](https://github.com/dotnet/runtime/pull/122959) by @stephentoub with GitHub Copilot

<summary>Original prompt</summary>

---

## JSON Serialization

### New Features

#### Add GetTypeInfo<T>() and TryGetTypeInfo<T>() to JsonSerializerOptions

[PR #123940](https://github.com/dotnet/runtime/pull/123940) by @stephentoub with GitHub Copilot

Implements the approved API from API review to add generic overloads of GetTypeInfo that return JsonTypeInfo<T> directly, eliminating the need for manual downcasting.

```csharp
namespace System.Text.Json;

public partial class JsonSerializerOptions
{
    public JsonTypeInfo<T> GetTypeInfo<T>();
    public bool TryGetTypeInfo<T>([NotNullWhen(true)] out JsonTypeInfo<T>? typeInfo);
}
```

### Improvements

#### Fix JsonSerializer.Serialize producing invalid JSON for [JsonExtensionData] with JsonObject

[PR #122838](https://github.com/dotnet/runtime/pull/122838) by @stephentoub with GitHub Copilot

>

```csharp
var mix = new Mix { Id = 1, Extra = new JsonObject { ["nested"] = true } };
JsonSerializer.Serialize(mix);
// Before: {"Id":1,{"nested":true}}  ← invalid JSON
// After:  {"Id":1,"nested":true}    ← correct
```

---

## Compression

### New Features

#### Add ZipArchiveEntry.Open(FileAccess) and OpenAsync(FileAccess, CancellationToken) overloads to ZipArchiveEntry

[PR #122032](https://github.com/dotnet/runtime/pull/122032) by @iremyux

This PR adds new overloads to ZipArchiveEntry.Open() and ZipArchiveEntry.OpenAsync() that accept a FileAccess parameter, allowing users to specify the desired access mode when opening an entry stream.

### Improvements

#### Fix reachable Debug.Assert in InterleavedZipPackagePartStream.Length

[PR #123817](https://github.com/dotnet/runtime/pull/123817) by @stephentoub with GitHub Copilot

<summary>Original prompt</summary>

```csharp
> [Fact]
> public void InterleavedZipPackagePartStream_Length_Assert()
> {
>     using MemoryStream package = new(_partPieceSampleZipPackage);
>
>     using Package zipPackage = Package.Open(package, FileMode.Open, FileAccess.Read);
>     PackagePart partEntry = zipPackage.GetPart(new Uri("/ReadablePartPieceEntry.bin", UriKind.Relative));
>     using Stream stream = partEntry.GetStream(FileMode.Open);
>     Assert.NotEqual(0, stream.Length);
> }
>
```

---

## Globalization

### New Features

#### Add IdnMapping Span-based APIs (TryGetAscii/TryGetUnicode)

[PR #123593](https://github.com/dotnet/runtime/pull/123593) by @stephentoub with GitHub Copilot

Adds span-based APIs to IdnMapping for zero-allocation IDN encoding/decoding:

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

### Improvements

#### Support ICU v78 changes including IDN and Japanese Meiji era start date

[PR #122480](https://github.com/dotnet/runtime/pull/122480) by @tarekgh

ICU has released version 78, which includes changes to IDN handling that caused some of our tests to fail when using the updated library.

---

## System.Runtime.InteropServices.JavaScript

### New Features

#### [browser][coreCLR] HTTP and WS client implementation in JS

[PR #123400](https://github.com/dotnet/runtime/pull/123400) by @pavelsavara

Fixes https://github.com/dotnet/runtime/issues/120216

#### [browser][coreCLR] implement JS interop

[PR #123131](https://github.com/dotnet/runtime/pull/123131) by @pavelsavara

Fixes https://github.com/dotnet/runtime/issues/120703

---

## Buffers

### New Features

#### Add Base64 parity APIs with Base64Url

[PR #123151](https://github.com/dotnet/runtime/pull/123151) by @stephentoub with GitHub Copilot

No security vulnerabilities were detected.

### Improvements

#### Fix Base64{Url} incorrectly handling small destinations when inputs contain whitespace

[PR #123223](https://github.com/dotnet/runtime/pull/123223) by @stephentoub with GitHub Copilot

Base64{Url}.DecodeFromUtf8 and DecodeFromChars incorrectly return DestinationTooSmall when input contains whitespace and destination is small but sufficient for actual data.

```csharp
byte[] input = Encoding.UTF8.GetBytes("  zA==  ");
Base64Url.DecodeFromUtf8(input, new byte[5]); // ✓ writes 1 byte
Base64Url.DecodeFromUtf8(input, new byte[1]); // ✗ was: "Destination is too short"

Base64Url.DecodeFromChars(new string(' ', 8), new byte[1]); // ✗ was: "Destination is too short"
```

---

## LINQ

### New Features

#### Add coalescence optimization for AsyncEnumerable Append/Prepend/Concat operations

[PR #122389](https://github.com/dotnet/runtime/pull/122389) by @stephentoub with GitHub Copilot

In .NET 10 AsyncEnumerable LINQ features are now included into BCL instead of the standalone package System.Linq.Async. Most things work as expected, but in the scenario of Append followed by a SumAsync we are seeing a regression in performance that is not expected (one of the scenarios we have noted down so far in our internal testing).

```csharp
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;

BenchmarkRunner.Run(BenchmarkConverter.TypeToBenchmarks(typeof(AppendTest)));

[MemoryDiagnoser]
[MinColumn, MaxColumn, Q1Column, Q3Column, AllStatisticsColumn]
[JsonExporterAttribute.Full]
public class AppendTest
{
    [Benchmark]
    public async Task<int> AppendInts()
    {
        var enumerable = AsyncEnumerable.Empty<int>();
        for (int i = 0; i < 10000; i++)
            enumerable = enumerable.Append(i);

        return await enumerable.SumAsync();
    }
}
```

#### Add early return in TryGetLast for empty results.

[PR #123306](https://github.com/dotnet/runtime/pull/123306) by @prozolic

This PR adds a fast path in IEnumerableSkipTakeIterator.TryGetLast. When source is an Iterator and GetCount(onlyIfCheap: true) returns a valid count (not -1), check if count <= _minIndexInclusive. In this case, immediately return with found=false.

---

## Collections

### New Features

#### Add cancellation token check to BlockingCollection.TakeFromAny fast path

[PR #122410](https://github.com/dotnet/runtime/pull/122410) by @stephentoub with GitHub Copilot

BlockingCollecction.TakeFromAny do not check state of cancellationToken (3rd argument).

```csharp
var bc1 = new BlockingCollection<int>();
var bc2 = new BlockingCollection<int>();
bc1.Add(1);
bc2.Add(2);

var cts = new CancellationTokenSource();
cts.Cancel();

// Previously: would successfully take item 1 or 2
// Now: throws OperationCanceledException immediately
BlockingCollection<int>.TakeFromAny(new[] { bc1, bc2 }, out int item, cts.Token);
```

### Performance

#### Optimize HashSet.UnionWith to copy data from another HashSet when empty

[PR #122952](https://github.com/dotnet/runtime/pull/122952) by @stephentoub with GitHub Copilot

When UnionWith is called on an empty HashSet<T> with another HashSet<T> that has the same effective comparer, we can use ConstructFrom to copy the internal data structures directly instead of adding each element individually with collision ch

```csharp
// Before: iterates through all elements, computing hash and checking collisions for each
// After: copies internal arrays directly when destination is empty and comparers match
if (Count == 0 && other is HashSet<T> otherAsSet && EffectiveEqualityComparersAreEqual(this, otherAsSet))
{
    ConstructFrom(otherAsSet);
    return;
}
```

---

## System.Formats.Tar

### New Features

#### Add tar tests for >8GB file entries using simulated streams

[PR #123091](https://github.com/dotnet/runtime/pull/123091) by @rzikm with GitHub Copilot

Adds automated tests for tar archives with >8GB file entries using SimulatedDataStream and ConnectedStreams to avoid materializing large data. Previous manual tests required actual disk space and were unsuitable for CI.

#### Add regression tests for TarReader.GetNextEntry after DataStream disposal

[PR #122945](https://github.com/dotnet/runtime/pull/122945) by @stephentoub with GitHub Copilot

>

```csharp
> using (var tarReader = new TarReader(unseekableStream))
> {
>     TarEntry? entry;
>     while ((entry = tarReader.GetNextEntry()) != null)
>     {
>          Stream s = entry.DataStream;
>          s.CopyTo(someOtherStream);
>          s.Dispose();
>     }
> }
>
```

---

## Numerics

### New Features

#### Add SSE implementation to Matrix4x4.GetDeterminant

[PR #123954](https://github.com/dotnet/runtime/pull/123954) by @alexcovington

This PR adds an SSE implementation for Matrix4x4.GetDeterminant. Performance improves by about 15% by vectorizing the operations.

---

## Tensor Primitives

### Performance

#### Vectorize BitIncrement and BitDecrement for float/double in TensorPrimitives

[PR #123610](https://github.com/dotnet/runtime/pull/123610) by @stephentoub with GitHub Copilot

Implements SIMD vectorization for BitIncrement and BitDecrement operations on float and double types in TensorPrimitives. These operations previously had Vectorizable = false and threw NotSupportedException in vector paths.

---

## Microsoft.Extensions.Logging

### Improvements

#### FormattedLogValues - Small optimization for index operator

[PR #122059](https://github.com/dotnet/runtime/pull/122059) by @snakefoot

Resolves #122046 (Removed "expensive" Count-check, since also exists in LogValuesFormatter)

---

## System.Diagnostics

### Improvements

#### [browser][CoreCLR] Trimming feature System.Diagnostics.StackTrace.IsLineNumberSupported

[PR #123429](https://github.com/dotnet/runtime/pull/123429) by @pavelsavara

saves 214KB of uncompressed IL from hello world

---

## System.Runtime.InteropServices

### New Features

#### Add AddRef to callee that caches interface ptr

[PR #122509](https://github.com/dotnet/runtime/pull/122509) by @jtschuster

Callee was missing an AddRef when returning the cached interface pointer. Tests no longer fail on Linux with this change locally.

---

## System.Runtime.CompilerServices

### New Features

#### Adding support for aligning AllocateTypeAssociatedMemory

[PR #122094](https://github.com/dotnet/runtime/pull/122094) by @tannergooding

Adding support for aligning AllocateTypeAssociatedMemory

---


## Threading & Time

### Performance

#### Major TimeZone performance improvement with per-year caching

[PR #119662](https://github.com/dotnet/runtime/pull/119662) by @tarekgh

A significant rewrite of time zone handling introduces a **per-year cache** for time zone transitions, improving performance for time conversions. The cache stores all transitions for a given year in UTC format, eliminating repeated rule lookups during conversions.

**Windows Benchmarks:**
```
BenchmarkDotNet v0.15.2, Windows 11 (10.0.26100.6584/24H2/2024Update/HudsonValley)
11th Gen Intel Core i7-11700 2.50GHz, 1 CPU, 16 logical and 8 physical cores
```

| Method                                | base/diff | Base Median (ns) | Diff Median (ns) |
|---------------------------------------|----------:|-----------------:|-----------------:|
| ConvertTimeFromUtc                    |      3.93 |            47.97 |            12.21 |
| ConvertTimeUsingLocalDateKind         |      3.47 |            66.70 |            19.21 |
| ConvertTimeUsingUnspecifiedDateKind   |      3.34 |            63.77 |            19.07 |
| ConvertTimeToUtc                      |      2.98 |            48.33 |            16.23 |
| DateTimeNow                           |      2.81 |            54.57 |            19.42 |
| GetUtcOffset                          |      2.48 |            98.64 |            39.83 |
| ConvertTimeUsingUtcDateKind           |      2.39 |            19.66 |             8.23 |

**Linux Benchmarks (WSL):**
```
BenchmarkDotNet v0.15.2, Linux Ubuntu 25.04 (Plucky Puffin)
11th Gen Intel Core i7-11700 2.50GHz, 1 CPU, 16 logical and 8 physical cores
```

| Method                                | base/diff | Base Median (ns) | Diff Median (ns) |
|---------------------------------------|----------:|-----------------:|-----------------:|
| ConvertTimeToUtc                      |      4.70 |            63.80 |            13.57 |
| ConvertTimeUsingLocalDateKind         |      4.25 |            80.09 |            18.84 |
| ConvertTimeUsingUnspecifiedDateKind   |      4.01 |            79.23 |            19.78 |
| ConvertTimeFromUtc                    |      3.54 |            39.34 |            11.12 |
| DateTimeNow                           |      3.51 |            50.99 |            14.54 |
| GetUtcOffset                          |      2.87 |           100.40 |            34.94 |
| ConvertTimeUsingUtcDateKind           |      1.64 |            17.60 |            10.73 |

This change also fixes several correctness issues with time zone handling (fixes #24839, #24277, #25075, #118915, #114476).


#### Use QueryUnbiasedInterruptTime for more responsive Windows timer behavior

[PR #122706](https://github.com/dotnet/runtime/pull/122706) by @tannergooding

Windows apps can now achieve higher timer responsiveness (sub-millisecond) when they opt-in to higher precision tick times. Previously, Windows was restricted to 10-16ms (typically 15.5ms) responsiveness and did not respect apps which set higher precision tick times, while Unix systems already used more responsive timers like `CLOCK_MONOTONIC_COARSE` and `CLOCK_UPTIME_RAW`.

This change switches from `GetTickCount64` to `QueryUnbiasedInterruptTime` on Windows, aligning behavior with Unix systems and the OS's own Wait APIs which no longer include sleep/hibernate time in timeout checks.

**Note:** This is a breaking change - timeouts now exclude time spent in sleep/hibernate states on Windows, matching Unix behavior.

#### Lazy-initialize DateTimeFormatInfoScanner.m_dateWords

[PR #123886](https://github.com/dotnet/runtime/pull/123886) by @stephentoub

Reduces memory allocation for cultures that don't have date words by lazy-initializing the scanner's date words collection. Only a subset of cultures have date words, so this avoids unnecessary allocations for the majority of cases.

### Improvements

#### Fix timeout/duration calculations using monotonic time and precise tick accumulation

[PR #123980](https://github.com/dotnet/runtime/pull/123980) by @MihaZupan with GitHub Copilot

Fixed socket timeout calculations that incorrectly used `.Milliseconds` (returns component 0-999) instead of `.TotalMilliseconds`. For a 2.5 second duration, `.Milliseconds` returns `500` while `.TotalMilliseconds` returns `2500.0`. Also switched to monotonic time source to avoid issues with system clock adjustments.

---


## Threading (Additional)

### New Features

#### Add generic And<T> and Or<T> methods to System.Threading.Interlocked

[PR #120978](https://github.com/dotnet/runtime/pull/120978) by @EgorBo with GitHub Copilot

Adds generic `Interlocked.And<T>` and `Interlocked.Or<T>` methods that work with any enum type or integer type, complementing the existing non-generic overloads.

---

## JSON Serialization (Additional)

### New Features

#### Support IReadOnlyDictionary as JsonExtensionData

[PR #120636](https://github.com/dotnet/runtime/pull/120636) by @stephentoub with GitHub Copilot

`[JsonExtensionData]` now supports `IReadOnlyDictionary<string, T>` in addition to the previously supported mutable dictionary types.

---

## Regular Expressions (Additional)

### Performance

#### Optimize regex patterns with both beginning and end anchors for early fail-fast

[PR #120916](https://github.com/dotnet/runtime/pull/120916) by @stephentoub with GitHub Copilot

Regex patterns that have both beginning (`^`) and end (`$`) anchors can now fail-fast earlier when the input length doesn't match the expected pattern length.

---

## Reflection.Emit

### New Features

#### Support function pointer types in System.Reflection.Emit

[PR #119935](https://github.com/dotnet/runtime/pull/119935) by @jgh07

Adds support for creating and working with function pointer types in the Reflection.Emit API.

#### Support references to unmanaged function pointers in Reflection.Emit

[PR #121128](https://github.com/dotnet/runtime/pull/121128) by @jgh07

Extends Reflection.Emit to support references to unmanaged function pointers, enabling more advanced interop scenarios.

---

## Networking (Security) - Additional

### New Features

#### Add missing TlsAlertMessage members

[PR #120260](https://github.com/dotnet/runtime/pull/120260) by @rzikm

Adds missing TLS alert message constants to the `TlsAlertMessage` enum for more complete TLS error handling.

---


## Compression (Additional)

### New Features

#### Implement ZStandard Stream, Encoder, Decoder

[PR #119575](https://github.com/dotnet/runtime/pull/119575) by @rzikm

Full implementation of `ZStandardStream` with encoder and decoder support. This complements the `DecompressionMethods.Zstandard` HTTP support with direct streaming APIs for Zstandard compression/decompression.

#### Add ZipArchiveEntry.Open(FileAccess) overloads

[PR #122032](https://github.com/dotnet/runtime/pull/122032) by @iremyux

New overloads `Open(FileAccess)` and `OpenAsync(FileAccess, CancellationToken)` allow specifying read-only access when opening ZIP entries in Update mode. Previously, opening any entry in Update mode would decompress the entire entry into memory even when only reading was needed.

```csharp
// Before: Always loads entire entry into memory in Update mode
using var stream = entry.Open();

// After: Can open read-only without loading into memory
using var stream = entry.Open(FileAccess.Read);
```

#### Make ZipArchiveEntry.CompressionMethod public

[PR #122045](https://github.com/dotnet/runtime/pull/122045) by @iremyux

Exposes the compression method of ZIP archive entries through a new public `ZipCompressionMethod` enum and `CompressionMethod` property on `ZipArchiveEntry`.

---

