<!-- Verified against Microsoft.NETCore.App.Ref@11.0.0-preview.7.26381.103 -->
# .NET Libraries in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 includes new .NET libraries features and improvements:

- [IEEE 754 decimal floating-point types](#ieee-754-decimal-floating-point-types)
- [Generic Complex\<T\>](#generic-complext)
- [HTTP request compression](#http-request-compression)
- [Configurable HTTP connection eviction](#configurable-http-connection-eviction)
- [DNS record resolution APIs](#dns-record-resolution-apis)
- [ZIP archive password support](#zip-archive-password-support)
- [New ZIP creation/extraction options and async helpers](#new-zip-creationextraction-options-and-async-helpers)
- [Ordinal casing APIs](#ordinal-casing-apis)
- [Polymorphism inference for closed type hierarchies in System.Text.Json](#polymorphism-inference-for-closed-type-hierarchies-in-systemtextjson)
- [Asynchronous ChangeToken.OnChange](#asynchronous-changetokenonchange)
- [Options-aware HybridCache factories](#options-aware-hybridcache-factories)
- [Suspended process startup on macOS](#suspended-process-startup-on-macos)
- [Assembly.Location override for AssemblyLoadContext](#assemblylocation-override-for-assemblyloadcontext)
- [Reduced contention in System.IO.Pipelines](#reduced-contention-in-systemiopipelines)
- [Other API additions](#other-api-additions)
- [Breaking changes](#breaking-changes)
- [Bug fixes and performance enhancements](#bug-fixes-and-performance-enhancements)
- [Community contributors](#community-contributors)

.NET Libraries updates in .NET 11:

- [What's new in .NET libraries for .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries)

## IEEE 754 decimal floating-point types

`System.Numerics` gains three IEEE 754-2019 decimal floating-point types — `Decimal32`, `Decimal64`, and `Decimal128` — with 7, 16, and 34 digits of decimal precision, respectively. Unlike `System.Decimal`, these types use the IEEE binary integer decimal (BID) interchange encoding, subject to the underlying ABI. They support generic math through `IDecimalFloatingPointIeee754<TSelf>`, so generic numeric algorithms can use them alongside the existing floating-point types.

The types include parsing, conversions, arithmetic and comparison operators, rounding, fused multiply-add, quantization, and binary and decimal encoding APIs. Basic arithmetic is validated bit-exact against Intel Decimal Floating-Point Math Library test vectors. Higher-level functions such as transcendentals are not exact in .NET 11 but are planned to be made exact in a future version.

Thank you [@RaymondHuy](https://github.com/RaymondHuy) for this contribution! The feature was completed across [dotnet/runtime #100729](https://github.com/dotnet/runtime/pull/100729), [#130508](https://github.com/dotnet/runtime/pull/130508), [#130807](https://github.com/dotnet/runtime/pull/130807), [#130890](https://github.com/dotnet/runtime/pull/130890), [#130956](https://github.com/dotnet/runtime/pull/130956), [#130957](https://github.com/dotnet/runtime/pull/130957), [#131019](https://github.com/dotnet/runtime/pull/131019), and [#131098](https://github.com/dotnet/runtime/pull/131098).

```csharp
using System.Numerics;

// Money-like arithmetic without System.Decimal's fixed range/precision constraints.
Decimal64 price = Decimal64.Parse("19.95");
Decimal64 taxRate = Decimal64.Parse("0.0875");

// Generic math works via IFloatingPoint<T>.
static T RoundToCents<T>(T value) where T : IFloatingPoint<T> =>
    T.Round(value, digits: 2, MidpointRounding.ToEven);

Decimal64 total = RoundToCents(price + price * taxRate);
Console.WriteLine(total); // 21.70

// Full transcendental surface with the standard's preferred exponent semantics.
Decimal128 x = Decimal128.Log(Decimal128.E);        // approximately 1
Decimal128 y = Decimal128.Sqrt(Decimal128.Parse("2")); // 1.414213562373095048801688724209698
```

## Generic Complex\<T\>

`System.Numerics.Complex<T>` is a new generic complex number type that mirrors the full public surface of the existing `Complex` struct across any `T : IFloatingPointIeee754<T>, IMinMaxValue<T>` — so complex arithmetic can now use `float`, `Half`, `BFloat16`, `NFloat`, or the new `Decimal32`, `Decimal64`, and `Decimal128` types instead of only `double` ([dotnet/runtime #130414](https://github.com/dotnet/runtime/pull/130414)). All arithmetic operators (including `T × Complex<T>` and `Complex<T> × T` overloads), the `Abs`/`Conjugate`/`Reciprocal`/`Log`/`Exp`/`Sqrt`/`Pow` math surface, the trigonometric and hyperbolic families, parsing, formatting, and `INumberBase<Complex<T>>` are all implemented. The non-generic `Complex` now delegates most of its implementation to `Complex<double>`, so both types stay in sync — including the C23 Annex G conformance updates for signed zeros, infinities, and NaNs added in [dotnet/runtime #131132](https://github.com/dotnet/runtime/pull/131132).

```csharp
using System.Numerics;

// Complex arithmetic in single precision.
Complex<float> z = new Complex<float>(3f, 4f);
Console.WriteLine(z.GetMagnitude()); // 5
Console.WriteLine(Complex<float>.Sqrt(z));

// Interop with the non-generic Complex.
Complex<double> zd = Complex<double>.CreateSaturating(new Complex(1, 1));
```

## HTTP request compression

`System.Net.Http` gains three `HttpContent` wrappers that compress request bodies on the wire — `GZipCompressedContent`, `BrotliCompressedContent`, and `ZstandardCompressedContent` in the `System.Net.Http` namespace ([dotnet/runtime #130082](https://github.com/dotnet/runtime/pull/130082)). Each wrapper sets the corresponding `Content-Encoding` header, clears `Content-Length`, and streams the compressed bytes as the request is serialized. Two constructors are provided per algorithm: one that takes a `CompressionLevel` for a quick speed/size knob, and one that takes the algorithm's full options type (`ZLibCompressionOptions`, `BrotliCompressionOptions`, or `ZstandardCompressionOptions`) for fine-grained tuning. A follow-up ([dotnet/runtime #130802](https://github.com/dotnet/runtime/pull/130802)) enforces the [RFC 9659 window-size requirement](https://datatracker.ietf.org/doc/html/rfc9659#name-window-size) for `zstd` request bodies. Request compression is opt-in: use it only when you know the server supports the selected content coding, because `HttpClient` does not negotiate request content compression automatically.

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

`SocketsHttpHandler` gains a new experimental `ShouldEvictConnection` callback that lets an application decide, per pooled connection, whether that connection should be retired early ([dotnet/runtime #130102](https://github.com/dotnet/runtime/issues/130102)). The asynchronous callback receives information about the connection (`Age`, `ConnectionId`, `DnsEndPoint`, `RemoteEndPoint`, and negotiated `HttpVersion`) and returns a `bool` indicating whether the connection should be evicted early.

We're also exposing `ConnectionId` properties on `HttpRequestMessage` and `ConnectCallback`/`PlaintextStreamFilter` contexts, which can be used to correlate which connection served a given request ([dotnet/runtime #130108](https://github.com/dotnet/runtime/issues/130108)).
This information can, among other things, be used to inform whether a problematic connection should be evicted.
The ID is the same as what was already exposed via `EventSource` telemetry.

Previously, `PooledConnectionLifetime` was often used to ensure that DNS changes will be picked up by `HttpClient`s. This resulted in healthy connections being unnecessarily recycled even when nothing changed. The sample below uses the new eviction callback to only remove connections if their DNS changed to point at different IPs.

```csharp
using System.Net;

var handler = new SocketsHttpHandler
{
    PooledConnectionLifetime = Timeout.InfiniteTimeSpan,
    ShouldEvictConnection = async (context, ct) =>
    {
        if (context.RemoteEndPoint is IPEndPoint connectionIp)
        {
            var addresses = await Dns.GetHostAddressesAsync(context.DnsEndPoint.Host, connectionIp.AddressFamily, ct);

            // Evict a connection only if its DNS changed to point at different IPs.
            return !addresses.Contains(connectionIp.Address);
        }

        return context.Age > TimeSpan.FromMinutes(10);
    },
};
```

## DNS record resolution APIs

`System.Net.Dns` gains typed record resolution beyond the classic `IPHostEntry`-based lookups. Static `Dns.ResolveAddresses`, `ResolveSrv`, `ResolveMx`, `ResolveTxt`, `ResolveCName`, `ResolvePtr`, and `ResolveNs` (plus `Async` variants) return a `DnsResult<T>` envelope carrying the records, a `DnsResponseCode`, and a `NegativeCacheTtl` value ([dotnet/runtime #129845](https://github.com/dotnet/runtime/pull/129845)). A new `DnsResolver` type — driven by `DnsResolverOptions` — supports instance-based resolution with an optional list of DNS servers, and record types `AddressRecord`, `SrvRecord`, `MxRecord`, `TxtRecord`, `CNameRecord`, `PtrRecord`, and `NsRecord` expose the parsed data. This preview ships the Windows implementation (backed by `DnsQueryEx`); non-Windows platforms currently throw `PlatformNotSupportedException` and will follow in subsequent previews.

```csharp
using System.Net;

DnsResult<SrvRecord> result = await Dns.ResolveSrvAsync("_ldap._tcp.example.com");

if (result.ResponseCode == DnsResponseCode.NoError)
{
    if (result.Records.Count == 0)
    {
        Console.WriteLine("No SRV records returned.");
    }
    else
    {
        foreach (SrvRecord record in result.Records)
        {
            Console.WriteLine($"{record.Target}:{record.Port} pri={record.Priority} wt={record.Weight}");
        }
    }
}
```

## ZIP archive password support

`System.IO.Compression` now reads and writes password-protected ZIP entries ([dotnet/runtime #122093](https://github.com/dotnet/runtime/pull/122093)). `ZipArchiveEntry` gains `Open` and `OpenAsync` overloads that accept a `ReadOnlySpan<char>` password, `ZipArchive.CreateEntry` gains overloads that take a password and a `ZipEncryptionMethod` (`ZipCrypto`, `Aes128`, `Aes192`, `Aes256`), and a new `ZipArchiveEntry.EncryptionMethod` property surfaces the algorithm used by an existing entry.

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

// An incorrect password is rejected with InvalidDataException.
// This exception also occurs when an entry is corrupt or otherwise invalid.
using (var archive = ZipFile.OpenRead("secrets.zip"))
{
    ZipArchiveEntry entry = archive.GetEntry("notes.txt")!;
    try
    {
        using Stream stream = entry.Open("incorrect password");
        _ = new StreamReader(stream).ReadToEnd();
    }
    catch (InvalidDataException)
    {
        Console.WriteLine("Cannot read ZIP entry. The password might be incorrect.");
    }
}
```

## New ZIP creation/extraction options and async helpers

`System.IO.Compression` adds `ZipFileCreationOptions` and `ZipExtractionOptions` to configure bulk ZIP operations ([dotnet/runtime #122093](https://github.com/dotnet/runtime/pull/122093)). The creation options control compression level, entry-name encoding, inclusion of the base directory, and the password and encryption method. The extraction options configure entry-name encoding, overwriting, and the password. `ZipFile.CreateFromDirectory` and `ExtractToDirectory` now accept these options and have asynchronous counterparts. `ZipArchive` and `ZipArchiveEntry` also gain helpers to create entries from files and extract archives or individual entries asynchronously.

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

`System.Text.Json` can now infer polymorphic serialization for C# `closed` type hierarchies without an explicit `[JsonDerivedType]` attribute on the base type ([dotnet/runtime #130808](https://github.com/dotnet/runtime/pull/130808)). Set the new `JsonSerializerOptions.InferClosedTypePolymorphism` property (or the equivalent source-generator option) and the serializer discovers the derived types of a closed hierarchy — including generic specializations — and assigns deterministic discriminators. Explicit `[JsonDerivedType]` registrations still take precedence, and the source generator reports diagnostics for hierarchies it cannot infer safely.

```csharp
using System.Text.Json;

// Requires C# preview (`<LangVersion>preview</LangVersion>`) for `closed`.
var options = new JsonSerializerOptions { InferClosedTypePolymorphism = true };

Shape shape = new Circle(1.5);
string json = JsonSerializer.Serialize(shape, options);
Console.WriteLine(json); // {"$type":"Circle","Radius":1.5}

public closed record Shape;
public sealed record Circle(double Radius) : Shape;
public sealed record Square(double Side) : Shape;
```

## Asynchronous ChangeToken.OnChange

`Microsoft.Extensions.Primitives.ChangeToken.OnChange` gains `Func<Task>` overloads so callers can run asynchronous logic when a token fires without falling back to `async void` or blocking a thread ([dotnet/runtime #129624](https://github.com/dotnet/runtime/pull/129624)). When the async consumer is used, the change token is only re-registered once the returned `Task` completes, so overlapping notifications are coalesced into a single subsequent invocation. Synchronous exceptions still propagate to the code that triggered the token; asynchronous faults are left unobserved (surfaced through `TaskScheduler.UnobservedTaskException`). See the [breaking changes](#breaking-changes) section for the source-level impact on existing `async` lambdas passed to `OnChange`.

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
using System.IO;
using System.Reflection;
using System.Runtime.Loader;

string realInstallDirectory = @"C:\app";

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
  using Microsoft.Extensions.DependencyInjection;
  using Microsoft.Extensions.Logging;

  IServiceProvider services = EmptyServiceProvider.Instance;

  object? logger = services.GetService(typeof(ILogger)); // null
  bool known = ((IServiceProviderIsService)services).IsService(typeof(ILogger)); // false
  ```

  `GetService` returns `null` and the `IsService` queries return `false` for every type. The `GetRequiredService`/`GetRequiredKeyedService` paths still throw `InvalidOperationException`, matching the behavior of a real provider that has no matching registration.

- **`ReadOnlySpan<T>.Min` and `Max`** extension methods return the smallest or largest element of a span, with optional `IComparer<T>` overloads ([dotnet/runtime #128306](https://github.com/dotnet/runtime/pull/128306)). They match the LINQ operators' semantics on an empty span — throwing `InvalidOperationException` for value types and returning `null` for reference types — but avoid the enumerator allocation.

- **`ZipArchiveEntry.VersionMadeBy`** exposes the platform and version fields written by ZIP tools ([dotnet/runtime #130109](https://github.com/dotnet/runtime/pull/130109)).

- **Process startup callbacks** let applications use custom native process-creation APIs while retaining `Process` features such as redirected I/O and exit handling ([dotnet/runtime #128862](https://github.com/dotnet/runtime/pull/128862)). `WindowsProcessStartArguments.Start` and `UnixProcessStartArguments.Start` supply a callback with prepared command-line or argument-vector, environment, and standard-handle data.

- **AVX-VNNI V512 intrinsics** add `AvxVnni.V512` dot-product operations for supporting x86 processors ([dotnet/runtime #128365](https://github.com/dotnet/runtime/pull/128365)). The `MultiplyWideningAndAdd` and saturating variants operate on `Vector512<T>` byte/sbyte and short/short inputs, accumulating into `Vector512<int>`.

- **`INumberBase<TSelf>.TryParsePartial`** adds partial-parse overloads that report characters consumed for `string` and `ReadOnlySpan<char>` inputs, or bytes consumed for `ReadOnlySpan<byte>` ([dotnet/runtime #130789](https://github.com/dotnet/runtime/pull/130789)).

## Breaking changes

- **`Math.Round` and `MathF.Round` round exactly for `digits` overloads.** The multi-digit rounding overloads previously computed `Round(value * 10^digits, mode) / 10^digits`, which could produce the wrong result when `value * 10^digits` was not exactly representable ([dotnet/runtime #130574](https://github.com/dotnet/runtime/pull/130574)). Roughly 5% of random inputs returned an incorrectly rounded result. For example, `Math.Round(655.925, 2, MidpointRounding.AwayFromZero)` now returns `655.92` (correct — `655.925` is stored as `655.924999999999954525…`) instead of `655.93`. Code that depended on the previous, incorrect result will observe a one-ulp change.
- **`Complex<T>` (and `Complex`) conforms to C23 Annex G special-value handling** ([dotnet/runtime #131132](https://github.com/dotnet/runtime/pull/131132)). Because the non-generic `Complex` defers most of its implementation to `Complex<double>`, signed-zero, infinity, and NaN behavior in `Complex` changes to match the standard.
- **`Math.Round` `digits` overloads validate `MidpointRounding` up front.** As part of [dotnet/runtime #130574](https://github.com/dotnet/runtime/pull/130574), out-of-range `MidpointRounding` values now throw immediately instead of being silently coerced.
- **`ChangeToken.OnChange` binds `async` lambdas to the new `Func<Task>` overloads.** Existing code that passes an `async` lambda to `ChangeToken.OnChange` previously bound to the `Action` overload (`async void`); it now binds to the new `Func<Task>` overload and re-registration is deferred until the returned task completes ([dotnet/runtime #129624](https://github.com/dotnet/runtime/pull/129624)). This is a source-only, generally-more-correct change; ambiguous throwing statement lambdas may need an explicit `(Action)` cast.
- **`WindowLog` renamed to `WindowLog2` across compression options.** `BrotliCompressionOptions.WindowLog`, `ZLibCompressionOptions.WindowLog`, `ZstandardCompressionOptions.WindowLog`, and `ZstandardDecompressionOptions.MaxWindowLog` are now `WindowLog2` / `MaxWindowLog2`, and the related `Default`/`Min`/`Max` static properties and `windowLog` parameters are renamed to match ([dotnet/runtime #129977](https://github.com/dotnet/runtime/pull/129977)). No compatibility alias is added. Update call sites when moving from Preview 6.
- **`Process.Run`, `RunAsync`, `RunAndCaptureText`, `RunAndCaptureTextAsync`, and `StartAndForget` accept `IEnumerable<string>?` for `arguments`.** The parameter was previously `IList<string>?` but was only iterated ([dotnet/runtime #130630](https://github.com/dotnet/runtime/pull/130630)). Source-only impact on the new-in-.NET 11 APIs; existing code that passes an array or list is unaffected.
- **`ZipArchive` in `Update` mode returns forward-only streams for compressed parts.** `System.IO.Packaging` and `ZipFile` now stream compressed parts directly from the archive instead of first decompressing them into a seekable `MemoryStream` ([dotnet/runtime #129698](https://github.com/dotnet/runtime/pull/129698)). Streams for compressed parts that haven't been modified in the current session report `CanSeek == false`; `Length` is unchanged. To keep seek-back semantics, copy the returned stream into a `MemoryStream` first.
- **`TensorPrimitives.Clamp` no longer throws when `min > max`.** The scalar path now matches the vectorized path (`Min(Max(x, min), max)`) rather than throwing `ArgumentException` ([dotnet/runtime #130703](https://github.com/dotnet/runtime/pull/130703)). Behavior is consistent across position and vector width.
- **Composite ML-DSA on Windows now uses BCrypt by default.** On Windows Insider builds that support Composite ML-DSA in BCrypt, `System.Security.Cryptography.CompositeMLDsa` switches from its managed implementation to the BCrypt provider ([dotnet/runtime #129612](https://github.com/dotnet/runtime/pull/129612)). Where BCrypt is used, the supported algorithm set is reduced to the four algorithms listed in the CNG documentation; Windows versions without BCrypt Composite ML-DSA support don't expose Composite ML-DSA through this provider.
- **`FileConfigurationSource.OnLoadException` receives I/O errors.** The callback now observes all load failures, including I/O errors, rather than only missing-file and parsing errors ([dotnet/runtime #126093](https://github.com/dotnet/runtime/pull/126093)).

## Bug fixes and performance enhancements

- **System.Numerics**
  - [Fix rounding of BigInteger conversions to floating-point types](https://github.com/dotnet/runtime/pull/130565)
  - [Speed up BigInteger conversions to floating-point types](https://github.com/dotnet/runtime/pull/130721)
  - [Fix decimal to/from floating-point conversions to round correctly](https://github.com/dotnet/runtime/pull/130566)
  - [Fix extra negative sign when a value rounds to zero in a two-section custom format](https://github.com/dotnet/runtime/pull/130558)
  - [Fix Dragon4 shortest formatting for exact powers of two](https://github.com/dotnet/runtime/pull/131131)
  - [Ensure float to BFloat16 conversion keeps NaN as NaN](https://github.com/dotnet/runtime/pull/130583)
- **System.Net**
  - [Reject CR/LF in MailAddress parsing](https://github.com/dotnet/runtime/pull/130175)
  - [Detect CR/LF and URL-encoded CR/LF in FtpWebRequest URI and command parameters](https://github.com/dotnet/runtime/pull/128983)
  - [Escape quotes and backslashes in MailAddress display name when encoding SMTP headers](https://github.com/dotnet/runtime/pull/128979)
  - [System.Net.NameResolution: Fall back to localhost when `localhost.` resolution fails](https://github.com/dotnet/runtime/pull/130504)
  - [Compare CredentialCache prefix path case-sensitively](https://github.com/dotnet/runtime/pull/130636)
  - [Fix CRLF encoding in EightBitStream](https://github.com/dotnet/runtime/pull/130757)
- **System.Net.Security**
  - [Android: Respect platform trust manager in SslStream](https://github.com/dotnet/runtime/pull/124173)
  - [Improve malformed TLS handshake frame detection](https://github.com/dotnet/runtime/pull/130756)
- **System.IO.Compression**
  - [Fix ZstandardStream truncating multi-frame zstd responses to the first frame](https://github.com/dotnet/runtime/pull/129047)
  - [Fix zip Unix permissions](https://github.com/dotnet/runtime/pull/130304)
  - [Configure ZstandardStream decompression with MaxWindowLog=23 per RFC 9659](https://github.com/dotnet/runtime/pull/130024)
  - [Add ZstandardDecompressionOptions for symmetric decoder configuration](https://github.com/dotnet/runtime/pull/129768)
- **System.Text.Json**
  - [JSON: Fix source generator serializing null `byte[]` as empty string](https://github.com/dotnet/runtime/pull/129834)
  - [Percent-encode JSON pointer reference tokens in JsonSchemaExporter $ref values](https://github.com/dotnet/runtime/pull/130164)
  - [Produce deprecated property in JsonSchema for obsolete types](https://github.com/dotnet/runtime/pull/130665)
  - [Re-enable source generator support for inaccessible `[JsonInclude]` members](https://github.com/dotnet/runtime/pull/130163)
  - [Allow empty string identifiers on non-flags enums in JsonStringEnumConverter](https://github.com/dotnet/runtime/pull/128285)
- **System.Diagnostics.Process**
  - [Fix Process.Kill(entireProcessTree: true) when intermediate child has KillOnParentExit](https://github.com/dotnet/runtime/pull/128598)
  - [Allow for Job escape when using KillOnParentExit](https://github.com/dotnet/runtime/pull/130032)
  - [Process.Unix: skip non-executable files during process filename resolution](https://github.com/dotnet/runtime/pull/130281)
- **System.Reflection**
  - [Fix `ParameterInfo.DefaultValue` and enum reflection APIs for nested enums on open generic types](https://github.com/dotnet/runtime/pull/129424)
- **System.Globalization**
  - [Fix "GMT Standard Time" incorrectly interpreted as fixed-offset zone on Android](https://github.com/dotnet/runtime/pull/130340)
- **Microsoft.Extensions.Configuration**
  - [Fix duplicated collection items when a constructor parameter name differs only by case from the property](https://github.com/dotnet/runtime/pull/129775)
  - [Fix config binding generator CS0103 for required/init property with matching ctor param](https://github.com/dotnet/runtime/pull/130483)
- **Microsoft.Extensions.Options**
  - [Skip null elements in `[ValidateEnumeratedItems]` validation](https://github.com/dotnet/runtime/pull/130720)
  - [Escape C# keyword identifiers in OptionsValidator generated code](https://github.com/dotnet/runtime/pull/130415)
- **Microsoft.Extensions.Logging**
  - [Sanitize control/format characters in console logger output across all formatters](https://github.com/dotnet/runtime/pull/128741)
- **System.Security.Cryptography**
  - [Apply a number of mitigations to System.Security.Cryptography.Xml](https://github.com/dotnet/runtime/pull/130705)
  - [Fix blob type in CopyWithPrivateKey for ML-DSA](https://github.com/dotnet/runtime/pull/129839)

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
