# .NET Libraries in .NET 11 Preview 5 - Release Notes

.NET 11 Preview 5 includes new library features and reliability improvements:

- [System.Text.Json supports JSON Lines serialization](#systemtextjson-supports-json-lines-serialization)
- [LINQ adds full outer joins](#linq-adds-full-outer-joins)
- [EqualityComparer of T adds key-selector creation](#equalitycomparer-of-t-adds-key-selector-creation)
- [Random adds generic numeric APIs](#random-adds-generic-numeric-apis)
- [StringBuilder can transfer chunks without copying](#stringbuilder-can-transfer-chunks-without-copying)
- [Process line reading and KillOnParentExit expand](#process-line-reading-and-killonparentexit-expand)
- [Reflection exposes nullable underlying types](#reflection-exposes-nullable-underlying-types)
- [Network APIs add video MIME names and QUIC stream priority](#network-apis-add-video-mime-names-and-quic-stream-priority)
- [Cryptography adds X25519 key agreement](#cryptography-adds-x25519-key-agreement)
- [Syndication supports trimmed and Native AOT feed loading](#syndication-supports-trimmed-and-native-aot-feed-loading)
- [Options validation accepts a validator type](#options-validation-accepts-a-validator-type)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Libraries updates in .NET 11:

- [What's new in .NET 11 libraries](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries)

## System.Text.Json supports JSON Lines serialization

`System.Text.Json` can now serialize an `IAsyncEnumerable<T>` as [JSON Lines](https://jsonlines.org/) by using the new `JsonSerializer.SerializeAsyncEnumerable` overloads with `topLevelValues: true` ([dotnet/runtime #127567](https://github.com/dotnet/runtime/pull/127567)). The same method also writes a root-level JSON array by default, matching the existing `DeserializeAsyncEnumerable` shape. JSON Lines output uses `\n` between values and ignores `WriteIndented`, so each item stays on one line for log streams, message feeds, and batch processing.

```csharp
using System.Text;
using System.Text.Json;

static async IAsyncEnumerable<Reading> GetReadings()
{
    yield return new("sensor-1", 21.5);
    yield return new("sensor-2", 22.0);
}

await using var stream = new MemoryStream();
await JsonSerializer.SerializeAsyncEnumerable(
    stream,
    GetReadings(),
    topLevelValues: true);

Console.WriteLine(Encoding.UTF8.GetString(stream.ToArray()));
// {"Id":"sensor-1","Value":21.5}
// {"Id":"sensor-2","Value":22}

public sealed record Reading(string Id, double Value);
```

The overloads support both `Stream` and `PipeWriter`, with either `JsonSerializerOptions` or `JsonTypeInfo<TValue>` metadata.

## LINQ adds full outer joins

LINQ now includes `FullJoin` operators for `Enumerable`, `Queryable`, and `AsyncEnumerable` ([dotnet/runtime #127236](https://github.com/dotnet/runtime/pull/127236)). A full outer join returns matching pairs plus unmatched rows from both input sequences. That gives in-memory queries the same shape developers use in SQL when reconciling two data sets, such as expected vs. observed inventory, configured vs. discovered services, or left and right snapshots.

```csharp
using System.Linq;

Product[] catalog =
[
    new("A100", "Keyboard"),
    new("B200", "Mouse"),
];

Sale[] sales =
[
    new("B200", 4),
    new("C300", 2),
];

var rows = catalog.FullJoin(
    sales,
    product => product.Sku,
    sale => sale.Sku,
    (product, sale) => new
    {
        Sku = product?.Sku ?? sale!.Sku,
        ProductName = product?.Name ?? "(not in catalog)",
        QuantitySold = sale?.Quantity ?? 0,
    });

foreach (var row in rows)
{
    Console.WriteLine($"{row.Sku}: {row.ProductName}, sold {row.QuantitySold}");
}

public sealed record Product(string Sku, string Name);
public sealed record Sale(string Sku, int Quantity);
```

`Queryable.FullJoin` exposes the same operation for query providers, and `AsyncEnumerable.FullJoin` covers async streams.

Preview 5 also adds tuple-returning overloads for `Join`, `LeftJoin`, `RightJoin`, and `GroupJoin` on `Enumerable`, `Queryable`, and `AsyncEnumerable` ([dotnet/runtime #121998](https://github.com/dotnet/runtime/pull/121998)). These let queries return `IEnumerable<(TOuter, TInner)>` (or the nullable-element variants for `LeftJoin`, `RightJoin`, and `FullJoin`) without an explicit result selector, which is convenient when the natural result of a join is a pair.

```csharp
foreach (var (product, sale) in catalog.Join(sales, p => p.Sku, s => s.Sku))
{
    Console.WriteLine($"{product.Sku}: {product.Name}, sold {sale.Quantity}");
}
```

## EqualityComparer of T adds key-selector creation

`EqualityComparer<T>.Create` now has a key-selector overload ([dotnet/runtime #125024](https://github.com/dotnet/runtime/pull/125024)). It builds an equality comparer by projecting each item to a comparison key, with an optional comparer for that key. This is useful when a type should be compared by one property for a specific collection or query, without adding global equality semantics to the type.

```csharp
using System.Collections.Generic;

var users = new HashSet<User>(
    EqualityComparer<User>.Create(
        user => user!.Email,
        StringComparer.OrdinalIgnoreCase));

users.Add(new User("ada@example.com", "Ada"));
users.Add(new User("ADA@example.com", "Ada Lovelace"));

Console.WriteLine(users.Count); // 1

public sealed record User(string Email, string DisplayName);
```

Thank you [@weitzhandler](https://github.com/weitzhandler) for this contribution!

## Random adds generic numeric APIs

`System.Random` adds generic methods for integer and binary floating-point types ([dotnet/runtime #127462](https://github.com/dotnet/runtime/pull/127462)). `NextInteger<T>()`, `NextInteger<T>(T maxValue)`, and `NextInteger<T>(T minValue, T maxValue)` cover integral numeric types. `NextBinaryFloat<T>()` covers binary floating-point types such as `float`, `double`, and `Half`. Generic algorithms can now request random values without branching by numeric type.

```csharp
Random random = Random.Shared;

int small = random.NextInteger<int>(1, 7);          // 1 through 6
long id = random.NextInteger<long>();              // any Int64 value
Half sample = random.NextBinaryFloat<Half>();      // 0.0 <= sample < 1.0
```

The generic overloads complement the existing `Next`, `NextInt64`, `NextSingle`, and `NextDouble` APIs when the numeric type is a type parameter.

## StringBuilder can transfer chunks without copying

`StringBuilder.MoveChunks(StringBuilder)` transfers the internal chunk chain from one builder to a new builder in O(1) time ([dotnet/runtime #127823](https://github.com/dotnet/runtime/pull/127823)). The source builder is drained but remains usable. This gives parsers, generators, and text abstractions a way to hand off accumulated text without first materializing a contiguous `string` or copying every chunk.

The API is also an ownership boundary. The returned builder owns the completed text, while the original builder is empty and can be used for more work. That separation avoids aliasing bugs: the consumer never receives another reference, or alias, to the producer's mutable `StringBuilder`.

```csharp
using System.Text;

StringBuilder scratch = new();
scratch.AppendLine("generated line 1");
scratch.AppendLine("generated line 2");

StringBuilder snapshot = StringBuilder.MoveChunks(scratch);

Console.Write(snapshot.ToString());
Console.WriteLine(scratch.Length); // 0

scratch.Append("ready for reuse");
```

The API is especially useful for components that need an immutable view over completed text while reusing the original builder for more work, such as source generators that produce Roslyn `SourceText`.

## Process line reading and KillOnParentExit expand

The `System.Diagnostics.Process` API expansion from earlier previews continues in Preview 5. `Process.ReadAllLines(TimeSpan? timeout = default)` adds a synchronous way to read interleaved stdout and stderr lines from a started process ([dotnet/runtime #127106](https://github.com/dotnet/runtime/pull/127106)). The method returns `ProcessOutputLine` values, so callers can preserve which stream produced each line without string prefixes or separate reader threads.

```csharp
using System.Diagnostics;

var startInfo = new ProcessStartInfo("dotnet")
{
    RedirectStandardOutput = true,
    RedirectStandardError = true,
};
startInfo.ArgumentList.Add("--info");

using Process process = Process.Start(startInfo)!;
foreach (ProcessOutputLine line in process.ReadAllLines())
{
    Console.ForegroundColor = line.StandardError ? ConsoleColor.Red : ConsoleColor.Gray;
    Console.WriteLine(line.Content);
}

Console.ResetColor();
```

`ProcessStartInfo.KillOnParentExit`, introduced for Windows in Preview 4, now works on Linux and Android by using `prctl(PR_SET_PDEATHSIG)` ([dotnet/runtime #127112](https://github.com/dotnet/runtime/pull/127112)). Apps that start helper processes can request the same parent-lifetime behavior on those platforms.

```csharp
var worker = new ProcessStartInfo("my-helper")
{
    KillOnParentExit = true,
};

Process.Start(worker);
```

## Reflection exposes nullable underlying types

`Type.GetNullableUnderlyingType()` is a new virtual API for discovering the underlying type of `Nullable<T>` directly from a `Type` instance ([dotnet/runtime #126905](https://github.com/dotnet/runtime/pull/126905)). The API lets custom `Type` implementations, including metadata-only reflection models, report nullable information consistently. `Nullable.GetUnderlyingType(Type)` now forwards to the virtual API while preserving its existing compatibility behavior for the open generic `Nullable<>` type definition.

```csharp
Type closed = typeof(int?);
Console.WriteLine(closed.GetNullableUnderlyingType() == typeof(int)); // True

Type open = typeof(Nullable<>);
Type? typeParameter = open.GetNullableUnderlyingType();
Console.WriteLine(typeParameter?.IsGenericParameter); // True

Console.WriteLine(Nullable.GetUnderlyingType(open) is null); // True, for compat
```

Custom `Type` subclasses should override the new virtual member. The base implementation throws `NotSupportedException`, matching other virtual `Type` APIs that derived reflection models are expected to implement.

## Network APIs add video MIME names and QUIC stream priority

`System.Net.Mime.MediaTypeNames` now includes a `Video` class with constants for common video container MIME types: `Mp4`, `Mpeg`, `Ogg`, `QuickTime`, and `WebM` ([dotnet/runtime #127268](https://github.com/dotnet/runtime/pull/127268)). The constants give mail, HTTP, and file-transfer code the same named style already available for application, image, and text media types.

```csharp
using System.Net.Http.Headers;
using System.Net.Mime;

using var content = new ByteArrayContent(File.ReadAllBytes("clip.mp4"));
content.Headers.ContentType = new MediaTypeHeaderValue(MediaTypeNames.Video.Mp4);
```

`System.Net.Quic.QuicStream` also gains a `Priority` property and `DefaultPriority` constant ([dotnet/runtime #127275](https://github.com/dotnet/runtime/pull/127275)). QUIC applications can mark streams with relative priority without dropping down to MsQuic-specific handles. The connection acts like a scheduler for multiple in-flight stream writes: when more than one stream has data queued, priority controls which stream gets sent first. This helps protocols send control, metadata, or interactive streams ahead of bulk-transfer streams.

```csharp
using System.Net.Quic;

QuicStream stream = await connection.OpenOutboundStreamAsync(QuicStreamType.Bidirectional);
stream.Priority = byte.MaxValue; // Higher priority than QuicStream.DefaultPriority.
```

## Cryptography adds X25519 key agreement

`System.Security.Cryptography.X25519DiffieHellman` is a new abstract class that implements X25519 elliptic-curve Diffie-Hellman key agreement ([dotnet/runtime #127248](https://github.com/dotnet/runtime/pull/127248)). X25519 is the key-agreement curve used by TLS 1.3, the Signal Protocol, the Noise Protocol, and many other modern protocols. The class includes platform-specific implementations — `X25519DiffieHellmanCng` on Windows and `X25519DiffieHellmanOpenSsl` on OpenSSL platforms — and supports `GenerateKey`, raw shared-secret derivation, byte and PKCS#8 export/import (including encrypted PKCS#8 and PEM), and `SubjectPublicKeyInfo` export. `X25519DiffieHellman.IsSupported` reports whether the current platform has an implementation.

```csharp
using System.Security.Cryptography;

using X25519DiffieHellman alice = X25519DiffieHellman.GenerateKey();
using X25519DiffieHellman bob = X25519DiffieHellman.GenerateKey();

byte[] alicePublic = alice.ExportPublicKey();
byte[] bobPublic = bob.ExportPublicKey();

byte[] aliceShared = new byte[X25519DiffieHellman.SecretAgreementSizeInBytes];
byte[] bobShared = new byte[X25519DiffieHellman.SecretAgreementSizeInBytes];
alice.DeriveRawSecretAgreement(bobPublic, aliceShared);
bob.DeriveRawSecretAgreement(alicePublic, bobShared);

// aliceShared and bobShared are byte-identical 32-byte secrets.
```

`CryptographicOperations` also adds a `FixedTimeEquals(ReadOnlySpan<byte> source, byte value)` overload for constant-time comparison of a buffer against a single byte ([dotnet/runtime #127826](https://github.com/dotnet/runtime/pull/127826)). This is useful for checking that a buffer is all one value (typically zero) without leaking the answer through a timing side channel.

## Syndication supports trimmed and Native AOT feed loading

`System.ServiceModel.Syndication` now works better in trimmed and Native AOT apps ([dotnet/runtime #114028](https://github.com/dotnet/runtime/pull/114028)). Common RSS and Atom feed-loading code, including `SyndicationFeed.Load`, can publish without the previous false-positive IL2067 trim warning, and Native AOT keeps the formatter metadata needed at runtime.

```csharp
using System.ServiceModel.Syndication;
using System.Xml;

using XmlReader reader = XmlReader.Create("https://example.com/feed.xml");
SyndicationFeed feed = SyndicationFeed.Load(reader);

foreach (SyndicationItem item in feed.Items)
{
    Console.WriteLine(item.Title.Text);
}
```

Thank you [@reflectronic](https://github.com/reflectronic) for this contribution!

## Options validation accepts a validator type

`OptionsBuilder<TOptions>.Validate<TValidateOptions>()` is a new fluent overload that registers an `IValidateOptions<TOptions>` implementation by type ([dotnet/runtime #127264](https://github.com/dotnet/runtime/pull/127264)). Until this preview, callers had to either inline validation logic in a `Validate(...)` lambda or wire the `IValidateOptions<T>` service up themselves. The new overload lets configuration code register a typed validator the same way it registers any other DI service, and the validator is resolved from the DI container so it can take its own constructor dependencies.

```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

services.AddOptions<SmtpSettings>()
    .Configure(s => { /* bind from configuration */ })
    .Validate<SmtpSettingsValidator>();

public sealed class SmtpSettingsValidator : IValidateOptions<SmtpSettings>
{
    public ValidateOptionsResult Validate(string? name, SmtpSettings options) =>
        string.IsNullOrWhiteSpace(options.Host)
            ? ValidateOptionsResult.Fail("Host is required.")
            : ValidateOptionsResult.Success;
}
```

Validation runs the first time `IOptions<TOptions>.Value` is requested and throws `OptionsValidationException` on failure.

## Breaking changes

- Custom `Type` subclasses must override `Type.GetNullableUnderlyingType()` if they support nullable type inspection. The base implementation throws `NotSupportedException` ([dotnet/runtime #126905](https://github.com/dotnet/runtime/pull/126905)).
- The pipe used by the `System.IO.Pipes` shared server has stricter permissions ([dotnet/runtime #127239](https://github.com/dotnet/runtime/pull/127239)). Applications that depend on out-of-process access to that implementation detail should review their assumptions.

## Bug fixes

- **System.Collections**
  - Optimized `ImmutableHashSet<T>.SetEquals` and `ImmutableSortedSet<T>.SetEquals` to avoid unnecessary allocations ([dotnet/runtime #126309](https://github.com/dotnet/runtime/pull/126309), [dotnet/runtime #126549](https://github.com/dotnet/runtime/pull/126549)). Thank you [@aw0lid](https://github.com/aw0lid)!
  - Fixed `ImmutableHashSet<T>.SetEquals` correctness when the two sets use mismatched comparers ([dotnet/runtime #127633](https://github.com/dotnet/runtime/pull/127633)). Thank you [@aw0lid](https://github.com/aw0lid)!
- **System.Diagnostics**
  - Fixed `CounterGroup` timing and allocation behavior for event counters and observable instruments ([dotnet/runtime #127303](https://github.com/dotnet/runtime/pull/127303), [dotnet/runtime #127886](https://github.com/dotnet/runtime/pull/127886), [dotnet/runtime #128039](https://github.com/dotnet/runtime/pull/128039)). Thank you [@unsafePtr](https://github.com/unsafePtr)!
- **System.Formats.Tar / System.IO.Compression**
  - Limited TAR metadata blocks to 1 MB when reading archives ([dotnet/runtime #127602](https://github.com/dotnet/runtime/pull/127602)).
  - Fixed `ArgumentOutOfRangeException` in Deflate64 and guarded `SubReadStream` against overflow ([dotnet/runtime #128071](https://github.com/dotnet/runtime/pull/128071), [dotnet/runtime #128074](https://github.com/dotnet/runtime/pull/128074)).
- **System.Net.Http / WebSockets**
  - Fixed `HttpHeaders.Remove` for well-known header names ([dotnet/runtime #127165](https://github.com/dotnet/runtime/pull/127165)).
  - Fixed a WebSocket close-path single-consumer violation ([dotnet/runtime #127183](https://github.com/dotnet/runtime/pull/127183)). Thank you [@cittaz](https://github.com/cittaz)!
- **System.Numerics**
  - Fixed `BigInteger.LeadingZeroCount`, `PopCount`, `TrailingZeroCount`, `RotateLeft`, and `RotateRight` for platform-independent 32-bit word semantics ([dotnet/runtime #126259](https://github.com/dotnet/runtime/pull/126259)).
  - Fixed `TensorPrimitives.IndexOfMax` ([dotnet/runtime #127454](https://github.com/dotnet/runtime/pull/127454)). Thank you [@lilinus](https://github.com/lilinus)!
- **System.Reflection**
  - Fixed `DispatchProxy` `TypeLoadException` for generic type arguments ([dotnet/runtime #127925](https://github.com/dotnet/runtime/pull/127925)).
  - Fixed `ConstructorInfo.GetGenericArguments()` to return an empty array for non-generic constructors ([dotnet/runtime #128059](https://github.com/dotnet/runtime/pull/128059)).
- **System.Runtime / formatting**
  - Fixed `string.Format` fast-path escaping for composite-format braces ([dotnet/runtime #127819](https://github.com/dotnet/runtime/pull/127819)).
  - Fixed integer overflow in `string.IndexOf` range validation ([dotnet/runtime #128191](https://github.com/dotnet/runtime/pull/128191)). Thank you [@prozolic](https://github.com/prozolic)!
- **System.Text.Json**
  - Fixed string buffer-size calculation in `Utf8JsonWriter.WriteStringValue` ([dotnet/runtime #127047](https://github.com/dotnet/runtime/pull/127047)). Thank you [@prozolic](https://github.com/prozolic)!
  - Fixed scoped `Utf8JsonReader` state so it carries the original position correctly ([dotnet/runtime #127679](https://github.com/dotnet/runtime/pull/127679)). Thank you [@prozolic](https://github.com/prozolic)!

## Community contributors

Thank you contributors! ❤️

- [@89netraM](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3A89netraM)
- [@aw0lid](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aaw0lid)
- [@cittaz](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Acittaz)
- [@CybCorv](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ACybCorv)
- [@kzrnm](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Akzrnm)
- [@lilinus](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Alilinus)
- [@prozolic](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aprozolic)
- [@reflectronic](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Areflectronic)
- [@teo-tsirpanis](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ateo-tsirpanis)
- [@tmds](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Atmds)
- [@unsafePtr](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AunsafePtr)
- [@weitzhandler](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aweitzhandler)
