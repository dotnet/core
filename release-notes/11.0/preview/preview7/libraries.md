<!-- Verified against Microsoft.NETCore.App.Ref@11.0.0-preview.7.26381.103 -->
# .NET Libraries in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 includes new .NET libraries features and improvements:

- [IEEE 754 decimal floating-point types](#ieee-754-decimal-floating-point-types)
- [Generic Complex\<T\>](#generic-complext)
- [HTTP request compression](#http-request-compression)
- [Configurable HTTP connection eviction](#configurable-http-connection-eviction)
- [Other HTTP and proxy changes](#other-http-and-proxy-changes)
- [DNS record resolution APIs](#dns-record-resolution-apis)
- [SHA3 and SM4 hardware intrinsics](#sha3-and-sm4-hardware-intrinsics)
- [ZIP archive password support](#zip-archive-password-support)
- [Ordinal casing APIs](#ordinal-casing-apis)
- [Polymorphism inference for closed type hierarchies in System.Text.Json](#polymorphism-inference-for-closed-type-hierarchies-in-systemtextjson)
- [Asynchronous ChangeToken.OnChange](#asynchronous-changetokenonchange)
- [Options-aware HybridCache factories](#options-aware-hybridcache-factories)
- [Suspended process startup on macOS](#suspended-process-startup-on-macos)
- [Assembly.Location override for AssemblyLoadContext](#assemblylocation-override-for-assemblyloadcontext)
- [Reduced contention in System.IO.Pipelines](#reduced-contention-in-systemiopipelines)
- [Other API additions](#other-api-additions)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Libraries updates in .NET 11:

- [What's new in .NET libraries for .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries)

## IEEE 754 decimal floating-point types

`System.Numerics` gains three IEEE 754-2019 decimal floating-point types — `Decimal32`, `Decimal64`, and `Decimal128` — with 7, 16, and 34 digits of decimal precision, respectively. Unlike `System.Decimal` (a 96-bit fixed-precision type), these use the IEEE binary integer decimal (BID) encoding standardized for interchange, and they participate fully in generic math through `IDecimalFloatingPointIeee754<TSelf>`. Preview 7 completes the API surface across a series of PRs by [@RaymondHuy](https://github.com/RaymondHuy) and [@tannergooding](https://github.com/tannergooding): the layout and parsing types ([dotnet/runtime #100729](https://github.com/dotnet/runtime/pull/100729)), arithmetic and comparison operators ([dotnet/runtime #130508](https://github.com/dotnet/runtime/pull/130508)), conversions and `INumberBase<TSelf>` ([dotnet/runtime #130807](https://github.com/dotnet/runtime/pull/130807)), `INumber` and `IFloatingPoint` ([dotnet/runtime #130890](https://github.com/dotnet/runtime/pull/130890)), `Sqrt`/`FusedMultiplyAdd`/`Quantize` and the rest of the exact operations ([dotnet/runtime #130956](https://github.com/dotnet/runtime/pull/130956)), the transcendentals ([dotnet/runtime #131019](https://github.com/dotnet/runtime/pull/131019)), a performance pass ([dotnet/runtime #130957](https://github.com/dotnet/runtime/pull/130957)), and a final alignment with the approved API — `Lerp`, `ReciprocalEstimate`, `EncodeBinary`/`DecodeBinary`, and densely packed decimal `EncodeDecimal`/`DecodeDecimal` — in [dotnet/runtime #131098](https://github.com/dotnet/runtime/pull/131098). Non-trivial arithmetic is ported from the Intel Decimal Floating-Point Math Library reference implementation and validated bit-exact against Intel's own test vectors.

```csharp
using System.Numerics;

// Money-like arithmetic without System.Decimal's fixed range/precision constraints.
Decimal64 price = Decimal64.Parse("19.95");
Decimal64 taxRate = Decimal64.Parse("0.0875");

// Generic math works via IFloatingPointIeee754<TSelf>.
static T RoundToCents<T>(T value) where T : IFloatingPoint<T> =>
    T.Round(value, digits: 2, MidpointRounding.ToEven);

Decimal64 total = RoundToCents(price + price * taxRate);
Console.WriteLine(total); // 21.70

// Full transcendental surface with the standard's preferred exponent semantics.
Decimal128 x = Decimal128.Log(Decimal128.E);        // 1
Decimal128 y = Decimal128.Sqrt(Decimal128.Parse("2")); // 1.414213562373095048801688724209698
```

## Generic Complex\<T\>

`System.Numerics.Complex<T>` is a new generic complex number type that mirrors the full public surface of the existing `Complex` struct across any `T : IFloatingPointIeee754<T>, IMinMaxValue<T>` — so complex arithmetic can now use `float`, `Half`, `BFloat16`, or `NFloat` instead of only `double` ([dotnet/runtime #130414](https://github.com/dotnet/runtime/pull/130414)). All arithmetic operators (including `T × Complex<T>` and `Complex<T> × T` overloads), the `Abs`/`Conjugate`/`Reciprocal`/`Log`/`Exp`/`Sqrt`/`Pow` math surface, the trigonometric and hyperbolic families, parsing, formatting, and `INumberBase<Complex<T>>` are all implemented. The non-generic `Complex` now delegates most of its implementation to `Complex<double>`, so both types stay in sync — including the C23 Annex G conformance updates for signed zeros, infinities, and NaNs added in [dotnet/runtime #131132](https://github.com/dotnet/runtime/pull/131132).

```csharp
using System.Numerics;

// Complex arithmetic in single precision.
Complex<float> z = new Complex<float>(3f, 4f);
Console.WriteLine(z.GetMagnitude()); // 5
Console.WriteLine(Complex<float>.Sqrt(z));

// Interop with the non-generic Complex.
Complex<double> zd = Complex<double>.CreateChecked(new Complex(1, 1));
```

## HTTP request compression

`System.Net.Http` gains three `HttpContent` wrappers that compress request bodies on the wire — `GZipCompressedContent`, `BrotliCompressedContent`, and `ZstandardCompressedContent` in the `System.Net.Http` namespace ([dotnet/runtime #130082](https://github.com/dotnet/runtime/pull/130082)). Each wrapper sets the corresponding `Content-Encoding` header, clears `Content-Length`, and streams the compressed bytes as the request is serialized. Two constructors are provided per algorithm: one that takes a `CompressionLevel` for a quick speed/size knob, and one that takes the algorithm's full options type (`ZLibCompressionOptions`, `BrotliCompressionOptions`, or `ZstandardCompressionOptions`) for fine-grained tuning. A follow-up ([dotnet/runtime #130802](https://github.com/dotnet/runtime/pull/130802)) enforces RFC 9659 compliance for `zstd` request bodies, so `ZstandardCompressedContent` produces content that conforms to the HTTP `zstd` coding.

```csharp
using System.IO.Compression;
using System.Net.Http;

using var client = new HttpClient();

var payload = new StringContent("""{"greeting":"hello"}""");
using var request = new HttpRequestMessage(HttpMethod.Post, "https://example.com/api")
{
    Content = new ZstandardCompressedContent(payload, CompressionLevel.Optimal),
};

using HttpResponseMessage response = await client.SendAsync(request);
```

## Configurable HTTP connection eviction

`SocketsHttpHandler` gains a `ShouldEvictConnection` callback that lets an application decide, per pooled connection, whether that connection should be retired instead of reused ([dotnet/runtime #130476](https://github.com/dotnet/runtime/pull/130476)). The callback receives a `SocketsHttpConnectionEvictionContext` that exposes the pooled connection's `Age`, `ConnectionId`, `DnsEndPoint`, `RemoteEndPoint`, and negotiated `HttpVersion`, and returns a `Task<bool>`. Related APIs expose a stable `ConnectionId` on `SocketsHttpConnectionContext`, `HttpConnectionContext`, and `HttpResponseMessage`, and `HttpRequestMessage` gains a settable `ConnectionId` so callers can pin a request to a specific connection. A follow-up avoids allocations during eviction evaluation ([dotnet/runtime #131142](https://github.com/dotnet/runtime/pull/131142)).

```csharp
using System.Net.Http;

var handler = new SocketsHttpHandler
{
    ShouldEvictConnection = (ctx, cancellationToken) =>
    {
        // Retire long-lived connections early, but keep freshly established ones.
        bool retire = ctx.Age > TimeSpan.FromMinutes(5);
        return Task.FromResult(retire);
    },
};

using var client = new HttpClient(handler);
```

## Other HTTP and proxy changes

Three smaller networking changes ship alongside connection eviction:

- `SocketsHttpHandler` limits the number of pending HTTP/2 `PING` ACKs, mitigating a denial-of-service pattern in which a peer floods a connection with `PING` frames ([dotnet/runtime #130997](https://github.com/dotnet/runtime/pull/130997)).
- H2C (cleartext HTTP/2) connections can now be established through an HTTP `CONNECT` proxy tunnel ([dotnet/runtime #129485](https://github.com/dotnet/runtime/pull/129485)).
- Proxy authentication headers are cleared when failing over between entries in a multi-proxy list, so credentials intended for one proxy are no longer sent to the next ([dotnet/runtime #131080](https://github.com/dotnet/runtime/pull/131080)).

## DNS record resolution APIs

`System.Net.Dns` gains typed record resolution beyond the classic `IPHostEntry`-based lookups. Static `Dns.ResolveAddresses`, `ResolveSrv`, `ResolveMx`, `ResolveTxt`, `ResolveCName`, `ResolvePtr`, and `ResolveNs` (plus `Async` variants) return a `DnsResult<T>` envelope carrying the records, a `DnsResponseCode`, and a `NegativeCacheTtl` value ([dotnet/runtime #129845](https://github.com/dotnet/runtime/pull/129845)). A new `DnsResolver` type — driven by `DnsResolverOptions` — supports instance-based resolution with an optional list of DNS servers, and record types `AddressRecord`, `SrvRecord`, `MxRecord`, `TxtRecord`, `CNameRecord`, `PtrRecord`, and `NsRecord` expose the parsed data. This preview ships the Windows implementation (backed by `DnsQueryEx`); non-Windows platforms currently throw `PlatformNotSupportedException` and will follow in subsequent previews.

```csharp
using System.Net;

DnsResult<SrvRecord> result = await Dns.ResolveSrvAsync("_ldap._tcp.example.com");

if (result.ResponseCode == DnsResponseCode.NoError)
{
    foreach (SrvRecord record in result.Records)
    {
        Console.WriteLine($"{record.Target}:{record.Port} pri={record.Priority} wt={record.Weight}");
    }
}
```

## SHA3 and SM4 hardware intrinsics

Arm64 gains hardware intrinsic surfaces for the SHA3 and SM4 instruction set extensions, both contributed by [@a74nh](https://github.com/a74nh). `System.Runtime.Intrinsics.Arm.Sha3`, `Sha3.Arm64`, `Sm4`, and `Sm4.Arm64` expose the fixed-length intrinsics ([dotnet/runtime #126941](https://github.com/dotnet/runtime/pull/126941), [dotnet/runtime #130039](https://github.com/dotnet/runtime/pull/130039)), and matching SVE2 surfaces (`Sve2.Sha3` and `Sve2.Sm4`) expose the vector-length-agnostic versions. Together these let cryptography and hashing libraries call the SHA3 (`EOR3`, `RAX1`, `XAR`, `BCAX`) and SM4 (`SM4E`, `SM4EKEY`) instructions directly on capable Arm64 processors.

```csharp
using System.Runtime.Intrinsics;
using System.Runtime.Intrinsics.Arm;

if (Sha3.Arm64.IsSupported)
{
    // Three-way XOR in a single instruction on hardware that supports SHA3.
    Vector128<ulong> eor3 = Sha3.Arm64.Xor(a, b, c);
}
```

## ZIP archive password support

`System.IO.Compression` now reads and writes password-protected ZIP entries ([dotnet/runtime #122093](https://github.com/dotnet/runtime/pull/122093)). `ZipArchiveEntry` gains `Open` and `OpenAsync` overloads that accept a `ReadOnlySpan<char>` password, `ZipArchive.CreateEntry` gains overloads that take a password and a `ZipEncryptionMethod` (`ZipCrypto`, `Aes128`, `Aes192`, `Aes256`), and a new `ZipArchiveEntry.EncryptionMethod` property surfaces the algorithm used by an existing entry. A companion change exposes `ZipArchiveEntry.VersionMadeBy` so callers can inspect the platform/version fields written by other tools ([dotnet/runtime #130109](https://github.com/dotnet/runtime/pull/130109)).

```csharp
using System.IO.Compression;

// Create a WinZip AES-256 encrypted entry.
using (var archive = ZipFile.Open("secrets.zip", ZipArchiveMode.Create))
{
    ZipArchiveEntry entry = archive.CreateEntry(
        "notes.txt",
        password: "correct horse battery staple",
        encryptionMethod: ZipEncryptionMethod.Aes256);

    using Stream stream = entry.Open("correct horse battery staple");
    using var writer = new StreamWriter(stream);
    writer.WriteLine("Encrypted contents.");
}

// Read it back.
using (var archive = ZipFile.OpenRead("secrets.zip"))
{
    ZipArchiveEntry entry = archive.GetEntry("notes.txt")!;
    Console.WriteLine(entry.EncryptionMethod); // Aes256
    using Stream stream = entry.Open("correct horse battery staple");
    Console.WriteLine(new StreamReader(stream).ReadToEnd());
}
```

## Ordinal casing APIs

`char`, `string`, `Rune`, and `MemoryExtensions` all gain `ToUpperOrdinal` and `ToLowerOrdinal` variants ([dotnet/runtime #130140](https://github.com/dotnet/runtime/pull/130140)). Ordinal casing uses the same simple one-to-one mapping as `OrdinalIgnoreCase` comparisons — that is, `a.Equals(b, OrdinalIgnoreCase)` if and only if `a.ToUpperOrdinal()` equals `b.ToUpperOrdinal()` ordinally. This gives applications that already compare case-insensitively with ordinal semantics a matching case conversion that doesn't depend on the current culture, sidestepping Turkish-i–style surprises. `string.ToUpperOrdinal()` and `ToLowerOrdinal()` also return the same instance when an all-ASCII string is already in the requested case, avoiding an allocation.

```csharp
// Deterministic, culture-independent upper-casing that pairs with OrdinalIgnoreCase.
string key = userInput.ToUpperOrdinal();
if (registry.Contains(key, StringComparer.Ordinal))
{
    // ...
}

// Also available on ReadOnlySpan<char> without allocating.
Span<char> buffer = stackalloc char[value.Length];
int written = value.AsSpan().ToUpperOrdinal(buffer);
```

## Polymorphism inference for closed type hierarchies in System.Text.Json

`System.Text.Json` can now infer polymorphic serialization for closed type hierarchies without an explicit `[JsonDerivedType]` attribute on the base type ([dotnet/runtime #130808](https://github.com/dotnet/runtime/pull/130808)). Set the new `JsonSerializerOptions.InferClosedTypePolymorphism` property (or the equivalent source-generator option) and the serializer discovers the derived types of a `sealed`, `abstract`, or otherwise closed hierarchy — including generic specializations — and assigns deterministic discriminators. Explicit `[JsonDerivedType]` registrations still take precedence, and the source generator reports diagnostics for hierarchies it cannot infer safely. This pairs naturally with the Preview 6 support for C# union serialization, which also relies on closed hierarchies.

```csharp
using System.Text.Json;
using System.Text.Json.Serialization;

public abstract record Shape;
public sealed record Circle(double Radius) : Shape;
public sealed record Square(double Side) : Shape;

var options = new JsonSerializerOptions { InferClosedTypePolymorphism = true };

Shape shape = new Circle(1.5);
string json = JsonSerializer.Serialize(shape, options);
// {"$type":"Circle","Radius":1.5}
```

## Asynchronous ChangeToken.OnChange

`Microsoft.Extensions.Primitives.ChangeToken.OnChange` gains `Func<Task>` overloads so callers can run asynchronous logic when a token fires without falling back to `async void` or blocking a thread ([dotnet/runtime #129624](https://github.com/dotnet/runtime/pull/129624)). When the async consumer is used, the change token is only re-registered once the returned `Task` completes, so overlapping notifications are coalesced into a single subsequent invocation. Synchronous exceptions still propagate to the code that triggered the token; asynchronous faults are left unobserved (surfaced through `TaskScheduler.UnobservedTaskException`), matching the semantics documented on the approved API. See the [breaking changes](#breaking-changes) section for the source-level impact on existing `async` lambdas passed to `OnChange`.

```csharp
using Microsoft.Extensions.Primitives;

IDisposable subscription = ChangeToken.OnChange(
    () => configuration.GetReloadToken(),
    async () =>
    {
        await ReloadSecretsAsync();
        await NotifyDownstreamAsync();
    });
```

`FileConfigurationProvider` now uses this async overload internally, so file-based configuration reloads no longer run reload work on a fire-and-forget `async void` continuation ([dotnet/runtime #130492](https://github.com/dotnet/runtime/pull/130492)).

## Options-aware HybridCache factories

`Microsoft.Extensions.Caching.Hybrid.HybridCache` adds `GetOrCreateAsync` overloads whose factory callback receives a mutable `HybridCacheEntryContext` in addition to the state and cancellation token ([dotnet/runtime #129048](https://github.com/dotnet/runtime/pull/129048)). The factory can now tune `Expiration`, `LocalCacheExpiration`, `Flags`, and the new `LocalSize` property (`HybridCacheEntryOptions.LocalSize`, used for `MemoryCache.Size`) based on the value it just produced — for example, granting a longer TTL to a large computed result.

```csharp
using Microsoft.Extensions.Caching.Hybrid;

Report report = await cache.GetOrCreateAsync(
    key: $"report:{tenantId}",
    factory: async (context, cancellationToken) =>
    {
        Report result = await BuildReportAsync(tenantId, cancellationToken);

        // Keep expensive reports cached longer, and remember their size for the L1 cache.
        if (result.Items.Count > 10_000)
        {
            context.Expiration = TimeSpan.FromHours(6);
            context.LocalSize = result.Items.Count;
        }

        return result;
    });
```

## Suspended process startup on macOS

Preview 6 introduced `ProcessStartInfo.StartSuspended` and `SafeProcessHandle.Resume()` for Windows. Preview 7 extends both to macOS, backed by `POSIX_SPAWN_START_SUSPENDED` and `SIGCONT` ([dotnet/runtime #129570](https://github.com/dotnet/runtime/pull/129570)). Attaching a debugger, configuring job objects, or writing initialization data to a child process before it runs a single instruction now works the same way across Windows and macOS. `Resume()` no longer prohibits multiple calls, so signals from the OS surface directly as `Win32Exception` instead of being masked by a "can only be called once" check.

```csharp
using System.Diagnostics;
using Microsoft.Win32.SafeHandles;

var startInfo = new ProcessStartInfo("/usr/bin/some-app")
{
    StartSuspended = true, // now supported on macOS in addition to Windows
};

using Process process = Process.Start(startInfo)!;
SafeProcessHandle handle = process.SafeHandle;
// ... configure the child while it is suspended ...
handle.Resume(); // sends SIGCONT on macOS
```

## Assembly.Location override for AssemblyLoadContext

`AssemblyLoadContext.SetAssemblyLocationOverride` is a new static, set-once callback that overrides the value returned by `Assembly.Location` on CoreCLR, Mono, and NativeAOT ([dotnet/runtime #129773](https://github.com/dotnet/runtime/pull/129773)). Thank you [@cdmazom](https://github.com/cdmazom)! The callback receives the assembly and the location the runtime would otherwise report, and returns the location to use instead. Hosts that stage assemblies in temporary directories or bundle them (single-file publishing, embedded resources, virtual file systems) can now report a meaningful location to code that inspects `Assembly.Location` for diagnostics or resource-loading purposes. The set-once semantics prevent later components from silently redirecting an in-flight override.

```csharp
using System.Reflection;
using System.Runtime.Loader;

AssemblyLoadContext.SetAssemblyLocationOverride((assembly, defaultLocation) =>
    assembly.GetName().Name is { } name
        ? Path.Combine(realInstallDirectory, name + ".dll")
        : defaultLocation);
```

## Reduced contention in System.IO.Pipelines

`System.IO.Pipelines` reduces reader/writer contention under high fan-in scenarios ([dotnet/runtime #130884](https://github.com/dotnet/runtime/pull/130884)). Buffer rent/return operations, which don't need to be serialized with pipe state, now run outside the pipe lock; the internal per-pipe segment pool is a FIFO so readers and writers touch different cache lines; the pipe lock is now a `System.Threading.Lock`; and continuations are scheduled on local thread-pool queues to preserve locality. In the ASP.NET Core JSON benchmark reported in the PR, measured on a 56-core machine, max lock contention dropped from 483 to 66 per second, RPS rose from 2,094,374 to 2,148,465, and read throughput rose from 291.61 MB/s to 299.14 MB/s.

## Other API additions

- **`EmptyServiceProvider`** is a shared, allocation-free service provider that resolves nothing ([dotnet/runtime #129578](https://github.com/dotnet/runtime/pull/129578)). Use `EmptyServiceProvider.Instance` where an `IServiceProvider` is required but no services are available — for example in tests, in default constructor arguments, or as a fallback instead of passing `null` and guarding every call site. It implements `IServiceProvider`, `IKeyedServiceProvider`, `IServiceProviderIsService`, and `IServiceProviderIsKeyedService` explicitly, so cast to the interface you need:

  ```csharp
  IServiceProvider services = EmptyServiceProvider.Instance;

  object? logger = services.GetService(typeof(ILogger)); // null
  bool known = ((IServiceProviderIsService)services).IsService(typeof(ILogger)); // false
  ```

  `GetService` returns `null` and the `IsService` queries return `false` for every type. The `GetRequiredService`/`GetRequiredKeyedService` paths still throw `InvalidOperationException`, matching the behavior of a real provider that has no matching registration.

- **`ReadOnlySpan<T>.Min` and `Max`** extension methods return the smallest or largest element of a span, with optional `IComparer<T>` overloads ([dotnet/runtime #128306](https://github.com/dotnet/runtime/pull/128306)). They match the LINQ operators' semantics on an empty span — throwing `InvalidOperationException` for value types and returning `null` for reference types — but avoid the enumerator allocation.

## Breaking changes

- **`Math.Round` and `MathF.Round` round more accurately for `digits` overloads.** The multi-digit rounding overloads previously computed `Round(value * 10^digits, mode) / 10^digits`, which could produce the wrong result when `value * 10^digits` was not exactly representable ([dotnet/runtime #130574](https://github.com/dotnet/runtime/pull/130574)). Roughly 5% of random inputs returned an incorrectly rounded result. For example, `Math.Round(655.925, 2, MidpointRounding.AwayFromZero)` now returns `655.92` (correct — `655.925` is stored as `655.924999999999954525…`) instead of `655.93`. Code that depended on the previous, incorrect result will observe a one-ulp change.
- **`Complex<T>` (and `Complex`) conforms to C23 Annex G special-value handling** ([dotnet/runtime #131132](https://github.com/dotnet/runtime/pull/131132)). Because the non-generic `Complex` defers most of its implementation to `Complex<double>`, signed-zero, infinity, and NaN behavior in `Complex` changes to match the standard.
- **`Math.Round` `digits` overloads validate `MidpointRounding` up front.** As part of [dotnet/runtime #130574](https://github.com/dotnet/runtime/pull/130574), out-of-range `MidpointRounding` values now throw immediately instead of being silently coerced.
- **`ChangeToken.OnChange` binds `async` lambdas to the new `Func<Task>` overloads.** Existing code that passes an `async` lambda to `ChangeToken.OnChange` previously bound to the `Action` overload (`async void`); it now binds to the new `Func<Task>` overload and re-registration is deferred until the returned task completes ([dotnet/runtime #129624](https://github.com/dotnet/runtime/pull/129624)). This is a source-only, generally-more-correct change; ambiguous throwing statement lambdas may need an explicit `(Action)` cast.
- **`WindowLog` renamed to `WindowLog2` across compression options.** `BrotliCompressionOptions.WindowLog`, `ZLibCompressionOptions.WindowLog`, `ZstandardCompressionOptions.WindowLog`, and `ZstandardDecompressionOptions.MaxWindowLog` are now `WindowLog2` / `MaxWindowLog2`, and the related `Default`/`Min`/`Max` static properties and `windowLog` parameters are renamed to match ([dotnet/runtime #129977](https://github.com/dotnet/runtime/pull/129977)). No compatibility alias is added. Update call sites when moving from Preview 6.
- **`Process.Run`, `RunAsync`, `RunAndCaptureText`, `RunAndCaptureTextAsync`, and `StartAndForget` accept `IEnumerable<string>?` for `arguments`.** The parameter was previously `IList<string>?` but was only iterated ([dotnet/runtime #130630](https://github.com/dotnet/runtime/pull/130630)). Source-only impact on the new-in-.NET 11 APIs; existing code that passes an array or list is unaffected.
- **`ZipArchive` in `Update` mode returns forward-only streams for compressed parts.** `System.IO.Packaging` and `ZipFile` now stream compressed parts directly from the archive instead of first decompressing them into a seekable `MemoryStream` ([dotnet/runtime #129698](https://github.com/dotnet/runtime/pull/129698)). Streams for compressed parts that haven't been modified in the current session report `CanSeek == false`; `Length` is unchanged. To keep seek-back semantics, copy the returned stream into a `MemoryStream` first.
- **`TensorPrimitives.Clamp` no longer throws when `min > max`.** The scalar path now matches the vectorized path (`Min(Max(x, min), max)`) rather than throwing `ArgumentException` ([dotnet/runtime #130703](https://github.com/dotnet/runtime/pull/130703)). Behavior is consistent across position and vector width.
- **`INumberBase<TSelf>` partial-parse overloads renamed to `TryParsePartial`.** The `TryParse(..., out TSelf result, out int charsConsumed)` overloads added in earlier .NET 11 previews are now public `TryParsePartial` methods, and the temporary `NumberStyles.AllowTrailingInvalidCharacters` public flag has been withdrawn in favor of an internal sentinel ([dotnet/runtime #130789](https://github.com/dotnet/runtime/pull/130789)).
- **Composite ML-DSA on Windows now uses BCrypt by default.** On Windows Insider builds that support Composite ML-DSA in BCrypt, `System.Security.Cryptography.CompositeMLDsa` switches from its managed implementation to the BCrypt provider ([dotnet/runtime #129612](https://github.com/dotnet/runtime/pull/129612)). Where BCrypt is used, the supported algorithm set is reduced to the four algorithms listed in the CNG documentation; Windows versions without BCrypt Composite ML-DSA support don't expose Composite ML-DSA through this provider.

## Bug fixes

- **System.Numerics**
  - Fixed rounding of `BigInteger` conversions to floating-point types, and sped up the conversion ([dotnet/runtime #130565](https://github.com/dotnet/runtime/pull/130565), [dotnet/runtime #130721](https://github.com/dotnet/runtime/pull/130721)).
  - Fixed `decimal` ↔ floating-point conversions to round correctly ([dotnet/runtime #130566](https://github.com/dotnet/runtime/pull/130566)).
  - Fixed the extra negative sign when a value rounds to zero in a two-section custom format ([dotnet/runtime #130558](https://github.com/dotnet/runtime/pull/130558)).
  - Fixed the Dragon4 shortest formatting for exact powers of two ([dotnet/runtime #131131](https://github.com/dotnet/runtime/pull/131131)).
  - Ensured `float`-to-`BFloat16` conversion preserves NaN ([dotnet/runtime #130583](https://github.com/dotnet/runtime/pull/130583)).
- **System.Net**
  - Rejected CR and LF in `MailAddress` parsing ([dotnet/runtime #130175](https://github.com/dotnet/runtime/pull/130175)).
  - Detected CR/LF and URL-encoded CR/LF in `FtpWebRequest` URIs and command parameters ([dotnet/runtime #128983](https://github.com/dotnet/runtime/pull/128983)).
  - Escaped quotes and backslashes in `MailAddress` display name when encoding SMTP headers ([dotnet/runtime #128979](https://github.com/dotnet/runtime/pull/128979)).
  - Fell back to `localhost` when `localhost.` resolution fails ([dotnet/runtime #130504](https://github.com/dotnet/runtime/pull/130504)).
  - Compared `CredentialCache` prefix path case-sensitively ([dotnet/runtime #130636](https://github.com/dotnet/runtime/pull/130636)).
  - Fixed CRLF encoding in `EightBitStream` ([dotnet/runtime #130757](https://github.com/dotnet/runtime/pull/130757)).
- **System.Net.Security**
  - `SslStream` on Android now consults the platform's `X509TrustManager` (including `network_security_config.xml`) instead of ignoring it — apps that pin certificates on Android will now see the platform's verdict in `RemoteCertificateValidationCallback` ([dotnet/runtime #124173](https://github.com/dotnet/runtime/pull/124173)).
  - Improved malformed TLS handshake frame detection ([dotnet/runtime #130756](https://github.com/dotnet/runtime/pull/130756)).
- **System.IO.Compression**
  - Fixed `ZstandardStream` truncating multi-frame `zstd` responses to the first frame ([dotnet/runtime #129047](https://github.com/dotnet/runtime/pull/129047)). Thank you [@christosk92](https://github.com/christosk92)!
  - Fixed Unix permissions on ZIP entries ([dotnet/runtime #130304](https://github.com/dotnet/runtime/pull/130304)).
  - Configured `ZstandardStream` decompression with `MaxWindowLog2 = 23` per RFC 9659 ([dotnet/runtime #130024](https://github.com/dotnet/runtime/pull/130024)).
  - Added a `ZstandardDecompressionOptions` constructor to `ZstandardStream`/`ZstandardDecoder` so callers can tie decoder lifetime to the stream ([dotnet/runtime #129768](https://github.com/dotnet/runtime/pull/129768)).
- **System.Text.Json**
  - Fixed the source generator serializing `null` `byte[]` as an empty string ([dotnet/runtime #129834](https://github.com/dotnet/runtime/pull/129834)). Thank you [@lezzi](https://github.com/lezzi)!
  - Percent-encode JSON pointer reference tokens in `JsonSchemaExporter` `$ref` values ([dotnet/runtime #130164](https://github.com/dotnet/runtime/pull/130164)).
  - Produced a `deprecated` property in `JsonSchema` for obsolete types ([dotnet/runtime #130665](https://github.com/dotnet/runtime/pull/130665)).
  - Re-enabled source-generator support for inaccessible `[JsonInclude]` members ([dotnet/runtime #130163](https://github.com/dotnet/runtime/pull/130163)).
  - Allowed empty-string identifiers on non-flags enums in `JsonStringEnumConverter` ([dotnet/runtime #128285](https://github.com/dotnet/runtime/pull/128285)).
- **System.Diagnostics.Process**
  - Fixed `Process.Kill(entireProcessTree: true)` when an intermediate child has `KillOnParentExit` ([dotnet/runtime #128598](https://github.com/dotnet/runtime/pull/128598)).
  - Allowed a child process to escape its parent's job when `KillOnParentExit` is set ([dotnet/runtime #130032](https://github.com/dotnet/runtime/pull/130032)).
  - Skipped non-executable files during process filename resolution on Unix ([dotnet/runtime #130281](https://github.com/dotnet/runtime/pull/130281)). Thank you [@tmds](https://github.com/tmds)!
- **System.Reflection**
  - Fixed `ParameterInfo.DefaultValue` and enum reflection APIs for nested enums on open generic types ([dotnet/runtime #129424](https://github.com/dotnet/runtime/pull/129424)).
- **System.Globalization**
  - Fixed `"GMT Standard Time"` being incorrectly interpreted as a fixed-offset zone on Android ([dotnet/runtime #130340](https://github.com/dotnet/runtime/pull/130340)).
- **Microsoft.Extensions.Configuration**
  - Fixed duplicated collection items when a constructor parameter name differs only by case from the property ([dotnet/runtime #129775](https://github.com/dotnet/runtime/pull/129775)).
  - Fixed a configuration binding source-generator `CS0103` for `required`/`init` properties with a matching constructor parameter ([dotnet/runtime #130483](https://github.com/dotnet/runtime/pull/130483)).
- **Microsoft.Extensions.Options**
  - Skipped null elements in `[ValidateEnumeratedItems]` validation ([dotnet/runtime #130720](https://github.com/dotnet/runtime/pull/130720)).
  - Escaped C# keyword identifiers in the `OptionsValidator` generated code ([dotnet/runtime #130415](https://github.com/dotnet/runtime/pull/130415)). Thank you [@UditDewan](https://github.com/UditDewan)!
- **Microsoft.Extensions.Logging**
  - Sanitized control and format characters in console-logger output across all formatters ([dotnet/runtime #128741](https://github.com/dotnet/runtime/pull/128741)).
- **System.Security.Cryptography**
  - Applied a set of mitigations to `System.Security.Cryptography.Xml` ([dotnet/runtime #130705](https://github.com/dotnet/runtime/pull/130705)).
  - Fixed the blob type in `CopyWithPrivateKey` for ML-DSA ([dotnet/runtime #129839](https://github.com/dotnet/runtime/pull/129839)).

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Async profiler V1 TPL instrumentation (#129043, #129801, #130083, #130297, #130299). Deep internals of the ETW/EventPipe async profiler protocol; no user-facing API beyond profiler authors.
  - Modernize System.Text.Json product code (#130976). Internal refactor; no user-facing behavior change.
  - JIT intrinsification of Task/ValueTask factory methods (#129810). Codegen change; runtime.md owns it.
  - Sm4/SHA3 hardware intrinsic implementations on wasm PackedSimd (#129838). Backend enablement — covered generically by the SHA3/SM4 API section.
  - AvxVnni.V512 hardware intrinsics (#128365). Belongs to runtime.md's intrinsics area rather than libraries.
  - Add `NumberStyles` option to stop parsing on invalid character (#130210). Superseded within Preview 7 by `TryParsePartial` (#130789); called out as a breaking change instead.
  - CompositeMLDsa CNG plumbing (#130053). Internal-only in P7; covered by the BCrypt Composite ML-DSA breaking-change note.
  - Add public property for VersionMadeBy — folded into the ZIP archive password section.
  - MemoryExtensions.Min/Max (#128306). Small addition; too narrow to headline, documented as a bullet under "Other API additions".
  - Add IParsable/ISpanParsable to Rune (#129464). Small conformance addition.
  - Rune interfaces are worth mentioning to the community-contributor list only.
  - Reduce unsafe code refactors (#130743, #129626, #130727, #126187). Internal quality; no user-facing change.
  - QUIC MsQuic 2.5 update (#130173). Version bump; behavior improvements are internal.
-->

## Community contributors

Thank you contributors! ❤️

- [@a74nh](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aa74nh)
- [@am11](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aam11)
- [@cdmazom](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Acdmazom)
- [@christosk92](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Achristosk92)
- [@hamarb123](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ahamarb123)
- [@haltandcatchwater](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ahaltandcatchwater)
- [@huoyaoyuan](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ahuoyaoyuan)
- [@lezzi](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Alezzi)
- [@lilinus](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Alilinus)
- [@manandre](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Amanandre)
- [@MichalPetryka](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AMichalPetryka)
- [@prozolic](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aprozolic)
- [@RaymondHuy](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ARaymondHuy)
- [@sami-daniel](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asami-daniel)
- [@sethjackson](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asethjackson)
- [@tmds](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Atmds)
- [@tulior](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Atulior)
- [@UditDewan](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AUditDewan)
