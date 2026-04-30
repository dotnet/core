# .NET Libraries in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 includes new library features and reliability improvements:

- [Process gets a major API expansion](#process-gets-a-major-api-expansion)
- [Span-based Deflate, ZLib, and GZip encoder/decoder APIs](#span-based-deflate-zlib-and-gzip-encoderdecoder-apis)
- [Floating-point hex formatting and parsing](#floating-point-hex-formatting-and-parsing)
- [UTF validation and invalid-subsequence search](#utf-validation-and-invalid-subsequence-search)
- [Rate-limiting fixes for RetryAfter, fractional permits, and ChainedRateLimiter](#rate-limiting-fixes-for-retryafter-fractional-permits-and-chainedratelimiter)
- [System.Text.Json improvements](#systemtextjson-improvements)
- [LINQ tuple overloads for joins](#linq-tuple-overloads-for-joins)
- [Regex source generator and engine fixes](#regex-source-generator-and-engine-fixes)
- [Configuration binding and file-provider improvements](#configuration-binding-and-file-provider-improvements)
- [Built-in OpenTelemetry metrics for MemoryCache](#built-in-opentelemetry-metrics-for-memorycache)
- [Discriminated-union scaffolding in System.Runtime.CompilerServices](#discriminated-union-scaffolding-in-systemruntimecompilerservices)
- [MetadataLoadContext additions](#metadataloadcontext-additions)
- [Console respects the FORCE_COLOR environment variable](#console-respects-the-force_color-environment-variable)
- [TarReader supports GNU sparse format 1.0](#tarreader-supports-gnu-sparse-format-10)
- [TLS handshake hardening and certificate-validation alerts on Linux](#tls-handshake-hardening-and-certificate-validation-alerts-on-linux)
- [HTTP/2 automatic downgrade for Windows authentication](#http2-automatic-downgrade-for-windows-authentication)
- [System.Security.Cryptography.Xml mitigations](#systemsecuritycryptographyxml-mitigations)
- [LDAP filter escaping in System.DirectoryServices.AccountManagement](#ldap-filter-escaping-in-systemdirectoryservicesaccountmanagement)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Libraries updates in .NET 11:

- [What's new in .NET 11 libraries](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries)

## Process gets a major API expansion

`System.Diagnostics.Process` picks up a substantial set of new APIs in Preview 4, covering common scenarios where developers previously had to fall back to manual `Process` plumbing or `P/Invoke`. The work spans process launch, capture, lifetime control, and handle hygiene.

**Run-and-capture helpers.** `Process.Run`, `Process.RunAsync`, `Process.RunAndCaptureText`, and `Process.RunAndCaptureTextAsync` give you one-shot APIs for launching a process and getting its result, without manually wiring up `OutputDataReceived`/`ErrorDataReceived` ([dotnet/runtime #127210](https://github.com/dotnet/runtime/pull/127210)). `Process.ReadAllText` and `Process.ReadAllBytes`, plus their async variants, provide a single-call read of a child process's output ([dotnet/runtime #126807](https://github.com/dotnet/runtime/pull/126807), [dotnet/runtime #126942](https://github.com/dotnet/runtime/pull/126942)). For line-oriented output, a new `ProcessOutputLine` struct flows through `Process.ReadAllLinesAsync` so callers can distinguish stdout from stderr without string parsing ([dotnet/runtime #126987](https://github.com/dotnet/runtime/pull/126987)).

```csharp
using System.Diagnostics;

// One-shot capture: stdout and stderr together, plus exit code.
ProcessResult result = await Process.RunAndCaptureTextAsync(
    new ProcessStartInfo("git", ["status", "--porcelain"]));

Console.WriteLine(result.StandardOutput);
Console.WriteLine($"exit code: {result.ExitCode}");
```

<!-- TODO: verify exact result type name (ProcessResult vs ProcessRunResult) and stdout/stderr property names from PR 127210 -->

**Fire-and-forget launches.** `Process.StartAndForget` starts a child process when you don't intend to wait for or interact with it; the runtime detaches the handle for you ([dotnet/runtime #126078](https://github.com/dotnet/runtime/pull/126078)). `ProcessStartInfo.StartDetached` goes further by detaching from the parent's session/console so the child outlives a terminal exit ([dotnet/runtime #126632](https://github.com/dotnet/runtime/pull/126632)). On Windows, `ProcessStartInfo.KillOnParentExit` requests the inverse — the child is terminated when the parent goes away ([dotnet/runtime #126699](https://github.com/dotnet/runtime/pull/126699)).

**SafeProcessHandle gains lifecycle methods.** `SafeProcessHandle.Start` and a new `ProcessId` property let you launch and identify processes without going through `Process` itself ([dotnet/runtime #126192](https://github.com/dotnet/runtime/pull/126192)). `SafeProcessHandle.Kill` and `Signal` make it possible to terminate or signal by handle ([dotnet/runtime #126313](https://github.com/dotnet/runtime/pull/126313)), and `SafeProcessHandle.WaitForExit*` adds the wait/await side ([dotnet/runtime #127022](https://github.com/dotnet/runtime/pull/127022)).

**Tighter handle control.** `ProcessStartInfo.InheritedHandles` lets you whitelist exactly which OS handles a child process inherits, instead of relying on the all-or-nothing `UseShellExecute = false` default ([dotnet/runtime #126318](https://github.com/dotnet/runtime/pull/126318)). New `StandardInputHandle`/`StandardOutputHandle`/`StandardErrorHandle` `SafeFileHandle` properties on `ProcessStartInfo` let you supply already-open pipes or files for redirection without the framework opening new ones ([dotnet/runtime #125848](https://github.com/dotnet/runtime/pull/125848)).

**Quality of implementation.** On Linux and macOS, `Process` no longer materializes a full `ProcessInfo` snapshot for `ProcessName` or `ToString` lookups, which removes a surprising amount of work from common diagnostics paths ([dotnet/runtime #126449](https://github.com/dotnet/runtime/pull/126449)). The Unix start path also stops allocating intermediate managed strings and arrays for `envp`/`argv`, reducing GC pressure when launching many processes ([dotnet/runtime #126201](https://github.com/dotnet/runtime/pull/126201)). `System.Diagnostics.Process` is now more trim-friendly: remote-machine support is initialized lazily so single-machine apps don't drag it in ([dotnet/runtime #126338](https://github.com/dotnet/runtime/pull/126338)).

Thank you [@tmds](https://github.com/tmds) for the Linux/OSX `Process` optimization!

## Span-based Deflate, ZLib, and GZip encoder/decoder APIs

`System.IO.Compression` now offers `Span<byte>`/`ReadOnlySpan<byte>` encode and decode entry points for the Deflate, ZLib, and GZip formats ([dotnet/runtime #123145](https://github.com/dotnet/runtime/pull/123145)). The new APIs mirror the shape of `BrotliEncoder`/`BrotliDecoder` and the recently-added Zstandard primitives, so you can compress and decompress one-shot or streaming buffers without allocating a `Stream`. This is the missing piece for high-throughput scenarios such as protocol parsers, log shippers, and middleware that already operate on spans.

```csharp
using System.IO.Compression;

ReadOnlySpan<byte> source = File.ReadAllBytes("payload.bin");
Span<byte> destination = new byte[source.Length];

OperationStatus status = ZLibEncoder.Compress(
    source, destination, out int bytesConsumed, out int bytesWritten,
    CompressionLevel.Optimal);
```

<!-- TODO: verify final type names (ZLibEncoder vs ZLibCompressor, GZipEncoder, DeflateEncoder) and exact method signatures from PR 123145 -->

## Floating-point hex formatting and parsing

`double`, `float`, and `Half` can now be formatted and parsed in their hexadecimal IEEE-754 form ([dotnet/runtime #124139](https://github.com/dotnet/runtime/pull/124139)). The hex form preserves every bit of the underlying value, which makes it the right choice for golden-file tests, cross-language interop with C/C++ `printf("%a", ...)`, and any scenario where round-tripping a `double` through decimal text is too lossy.

```csharp
double value = Math.PI;

string hex = value.ToString("X"); // hex form, e.g., "0x1.921FB54442D18p+1"
double round = double.Parse(hex);

Console.WriteLine(round == value); // True — exact round-trip
```

<!-- TODO: verify the exact format specifier used (X vs A) and whether parsing requires NumberStyles.AllowHexSpecifier or similar from PR 124139 -->

## UTF validation and invalid-subsequence search

Two complementary additions land in `System.Text.Unicode` ([dotnet/runtime #120326](https://github.com/dotnet/runtime/pull/120326)). `Utf16.IsValid` answers "is this a well-formed UTF-16 sequence?" without scanning twice, and `Utf8.IndexOfInvalidSubsequence` / `Utf16.IndexOfInvalidSubsequence` return the position of the first ill-formed code-unit sequence (or `-1` for valid input). Together they let parsers, validators, and serializers report precise errors instead of generic "encoding error" messages.

```csharp
using System.Text.Unicode;

ReadOnlySpan<byte> bytes = stackalloc byte[] { 0xC3, 0x28 }; // invalid UTF-8
int badIndex = Utf8.IndexOfInvalidSubsequence(bytes); // 0

ReadOnlySpan<char> chars = "valid \uD83D\uDC4D end"; // 👍 surrogate pair
bool ok = Utf16.IsValid(chars); // True
```

Thank you [@lilinus](https://github.com/lilinus) for this contribution!

## Rate-limiting fixes for RetryAfter, fractional permits, and ChainedRateLimiter

A cluster of `System.Threading.RateLimiting` fixes lands in Preview 4. `FixedWindowRateLimiter` now reports a `RetryAfter` metadata value that points at the next window boundary, so callers and middleware can honor it without guessing ([dotnet/runtime #124478](https://github.com/dotnet/runtime/pull/124478)). `TokenBucketRateLimiter.AttemptAcquire(0)` no longer mishandles partial token refills ([dotnet/runtime #124498](https://github.com/dotnet/runtime/pull/124498)). And `ChainedRateLimiter` now correctly forwards `IdleDuration` and replenishment behavior from the inner limiters instead of treating them as opaque ([dotnet/runtime #126158](https://github.com/dotnet/runtime/pull/126158)).

If you wire `RateLimiter` into ASP.NET Core middleware or HTTP retry policies, the `RetryAfter` change in particular means clients will get a usable `Retry-After` header for free.

```csharp
using System.Threading.RateLimiting;

var limiter = new FixedWindowRateLimiter(new()
{
    PermitLimit = 10,
    Window = TimeSpan.FromSeconds(1),
    QueueLimit = 0,
});

RateLimitLease lease = limiter.AttemptAcquire();
if (!lease.IsAcquired && lease.TryGetMetadata(MetadataName.RetryAfter, out TimeSpan retry))
{
    Console.WriteLine($"Retry after {retry}.");
}
```

Thank you [@asbjornvad](https://github.com/asbjornvad) and [@apoorvdarshan](https://github.com/apoorvdarshan) for these contributions!

## System.Text.Json improvements

`System.Text.Json` continues to fill in long-standing gaps. The serializer now understands F# discriminated unions out of the box, so apps that share types between F# producers and C# consumers no longer need a custom converter for the most common shapes ([dotnet/runtime #125610](https://github.com/dotnet/runtime/pull/125610)). `Utf8JsonWriter.Reset` adds overloads that accept `JsonWriterOptions`, so writer instances can be re-pooled with different options without allocating a new writer ([dotnet/runtime #126578](https://github.com/dotnet/runtime/pull/126578)).

The source generator gets two correctness fixes that the team picked up from Preview 3 feedback. Generic accessor wrappers now carry through type-parameter constraints from the underlying member ([dotnet/runtime #126507](https://github.com/dotnet/runtime/pull/126507)), and the generator now uses `[UnsafeAccessor]` to reach private members instead of falling back to reflection where possible ([dotnet/runtime #124650](https://github.com/dotnet/runtime/pull/124650)). Hot-path `JsonElement.GetByte`/`GetSByte`/`GetInt16`/`GetUInt16` reads use a shared `ThrowHelper`, which keeps the success path free of the exception-construction overhead ([dotnet/runtime #126559](https://github.com/dotnet/runtime/pull/126559)).

```fsharp
type Shape =
    | Circle of radius: float
    | Square of side: float

let json = System.Text.Json.JsonSerializer.Serialize(Circle 1.5)
// {"Case":"Circle","Fields":[1.5]}
```

<!-- TODO: confirm JSON shape used for F# DUs (Case/Fields vs adjacently-tagged) from PR 125610 description -->

Thank you [@prozolic](https://github.com/prozolic) for the `JsonElement` and source-generator fixes!

## LINQ tuple overloads for joins

`Enumerable.Join`, `LeftJoin`, and `RightJoin` add overloads that return `ValueTuple` directly, so you can write a join without naming an anonymous type or projecting twice ([dotnet/runtime #121998](https://github.com/dotnet/runtime/pull/121998)). The shape is identical to the existing key-selector overloads, just with a tuple result instead of a custom selector.

```csharp
using System.Linq;

var orderItems = orders
    .Join(customers, o => o.CustomerId, c => c.Id);
// orderItems is IEnumerable<(Order, Customer)>

var withMissing = orders
    .LeftJoin(customers, o => o.CustomerId, c => c.Id);
// withMissing is IEnumerable<(Order, Customer?)>
```

A separate `GroupJoin` overload returning `IGrouping` was reverted in this preview ([dotnet/runtime #121999](https://github.com/dotnet/runtime/pull/121999) / [dotnet/runtime #126624](https://github.com/dotnet/runtime/pull/126624)) and is not part of Preview 4.

## Regex source generator and engine fixes

Several regex correctness and code-quality items land this preview. The non-backtracking engine no longer takes super-linear time on certain nested-loop patterns and produces correct results for cases that previously diverged ([dotnet/runtime #125457](https://github.com/dotnet/runtime/pull/125457)). The regex compiler and source generator handle `resumeAt` correctly when a conditional appears inside a loop body ([dotnet/runtime #126561](https://github.com/dotnet/runtime/pull/126561)). The source generator escapes `U+2028`/`U+2029` in generated XML doc comments so the resulting compiler output stays well-formed ([dotnet/runtime #126242](https://github.com/dotnet/runtime/pull/126242)). And the SYSLIB1045 code fixer no longer creates duplicate `MyRegex` names when applied across multiple partial declarations of the same class ([dotnet/runtime #124698](https://github.com/dotnet/runtime/pull/124698)).

The regex engine also lowers `MaxUnrollSize` from 16 to 7, which trims generated code without measurable throughput regressions for the patterns the team measured ([dotnet/runtime #126092](https://github.com/dotnet/runtime/pull/126092)), and the reduction stage drops a redundant `Atomic` wrapper from already-atomic shared prefixes ([dotnet/runtime #126114](https://github.com/dotnet/runtime/pull/126114)).

## Configuration binding and file-provider improvements

`Microsoft.Extensions.Configuration` adds `ConfigurationIgnoreAttribute` so models can opt individual properties out of binding declaratively, instead of relying on `BindNonPublicProperties` toggles or custom converters ([dotnet/runtime #126396](https://github.com/dotnet/runtime/pull/126396)).

```csharp
public sealed class AppOptions
{
    public string Endpoint { get; set; } = "";

    [ConfigurationIgnore]
    public string ComputedKey => Endpoint + ":default";
}
```

<!-- TODO: verify attribute namespace (Microsoft.Extensions.Configuration vs ...Binder) from PR 126396 -->

`ConfigurationBinder` now binds an empty array to a constructor parameter instead of throwing ([dotnet/runtime #126470](https://github.com/dotnet/runtime/pull/126470)), and the binder source-generator suppressor only suppresses the calls it actually intercepts ([dotnet/runtime #126878](https://github.com/dotnet/runtime/pull/126878)).

`Microsoft.Extensions.FileProviders` is more forgiving of unusual paths: `PhysicalFilesWatcher` no longer throws when its root directory does not yet exist ([dotnet/runtime #126411](https://github.com/dotnet/runtime/pull/126411)), and `InMemoryDirectoryInfo` resolves `..` and other relative segments consistently with the physical provider ([dotnet/runtime #126320](https://github.com/dotnet/runtime/pull/126320)).

## Built-in OpenTelemetry metrics for MemoryCache

`Microsoft.Extensions.Caching.Memory.MemoryCache` now emits a built-in set of OpenTelemetry-compatible metrics (hits, misses, evictions, current size) without an extra adapter package ([dotnet/runtime #126146](https://github.com/dotnet/runtime/pull/126146)). The instrument names follow the OTel semantic-convention naming alignment that landed in the same preview ([dotnet/runtime #126451](https://github.com/dotnet/runtime/pull/126451)), so dashboards picked up from sample OTel collectors will work without renaming.

A related `System.Diagnostics` addition: `ActivityTraceFlags.RandomTraceId` ([dotnet/runtime #124851](https://github.com/dotnet/runtime/pull/124851)) lets producers signal that the trace ID was generated with sufficient entropy, which is required by the W3C Trace Context Level 2 sampling guidance.

<!-- TODO: confirm exact MemoryCache instrument names emitted by PR 126146 -->

Thank you [@rjmurillo](https://github.com/rjmurillo) and [@Kielek](https://github.com/Kielek) for these contributions!

## Discriminated-union scaffolding in System.Runtime.CompilerServices

> This is a preview feature for .NET 11.

Preview 4 introduces `UnionAttribute` and `IUnion` in `System.Runtime.CompilerServices` ([dotnet/runtime #127001](https://github.com/dotnet/runtime/pull/127001)). These types are the runtime side of the long-running C# discriminated-union design. They are not directly user-facing yet — the C# compiler and source generators are the expected producers — but they ship in the framework so libraries can begin authoring against the surface.

<!-- TODO: link to the C# language-design DU proposal once Preview 4 lang docs are published -->

## MetadataLoadContext additions

`MetadataLoadContext.GetLoadContext(Assembly)` returns the load context that produced a given `Assembly`, mirroring the long-existing API on `AssemblyLoadContext` ([dotnet/runtime #126926](https://github.com/dotnet/runtime/pull/126926)). This closes a gap for tooling that reflects over assemblies in an isolated `MetadataLoadContext` and needs to walk back from an `Assembly` reference to the context that owns it.

```csharp
using System.Reflection;
using System.Reflection.Metadata;

using var mlc = new MetadataLoadContext(new PathAssemblyResolver(paths));
Assembly asm = mlc.LoadFromAssemblyPath(targetPath);

MetadataLoadContext owner = MetadataLoadContext.GetLoadContext(asm)!;
Console.WriteLine(ReferenceEquals(owner, mlc)); // True
```

A small follow-up removes the `[NotNull]` annotation on `MetadataLoadContext.CoreAssembly` because the property is genuinely nullable until a core assembly is loaded ([dotnet/runtime #126142](https://github.com/dotnet/runtime/pull/126142)).

Thank you [@teo-tsirpanis](https://github.com/teo-tsirpanis) for these contributions!

## Console respects the FORCE_COLOR environment variable

.NET console output now honors the [`FORCE_COLOR`](https://force-color.org/) emerging standard alongside the existing `NO_COLOR` support ([dotnet/runtime #124492](https://github.com/dotnet/runtime/pull/124492)). When `FORCE_COLOR` is set, `Console.IsOutputRedirected` no longer suppresses ANSI escape codes — useful when piping `dotnet run` output through `tee`, into a CI log viewer, or through `less -R`.

```bash
FORCE_COLOR=1 dotnet run | tee build.log
```

## TarReader supports GNU sparse format 1.0

`System.Formats.Tar`'s `TarReader` can now read entries that use the GNU sparse format 1.0 (PAX) representation ([dotnet/runtime #125283](https://github.com/dotnet/runtime/pull/125283)). The earlier 0.1 representation was already supported; with 1.0 in place, `TarReader` matches what modern `tar` implementations write by default for sparse files.

## TLS handshake hardening and certificate-validation alerts on Linux

Two `System.Net.Security` items improve TLS reliability. `SslStream` server-side handshake bounds-checks bug fixes in `TlsFrameHelper` close several edge cases that could surface as `IOException` on malformed ClientHello records ([dotnet/runtime #126352](https://github.com/dotnet/runtime/pull/126352)). On Linux, certificate-validation failures now surface as standard TLS alerts to the peer, matching Windows behavior ([dotnet/runtime #115996](https://github.com/dotnet/runtime/pull/115996)). Connecting clients receive an actionable handshake error instead of a connection drop.

## HTTP/2 automatic downgrade for Windows authentication

`HttpClient` automatically downgrades to HTTP/1.1 when a request requires Windows authentication (NTLM/Negotiate) over HTTP/2 ([dotnet/runtime #123827](https://github.com/dotnet/runtime/pull/123827)). The HTTP/2 specification disallows the connection-bound auth schemes that NTLM and Kerberos rely on, so previously these requests would fail. With the downgrade in place, applications targeting mixed-auth environments — common in enterprise intranets — work without explicit `HttpRequestMessage.Version` overrides.

## System.Security.Cryptography.Xml mitigations

Preview 4 applies a set of mitigations to `System.Security.Cryptography.Xml` components ([dotnet/runtime #126957](https://github.com/dotnet/runtime/pull/126957)). The change tightens validation of XML signature and encryption inputs. Applications that consume signed XML from untrusted sources should review the migration guidance in the linked PR; some inputs that previously verified may now be rejected.

<!-- TODO: link to the security advisory or migration doc once published, and call out specific behavior changes (e.g., transform allowlist, reference-URI handling) -->

## LDAP filter escaping in System.DirectoryServices.AccountManagement

`System.DirectoryServices.AccountManagement` now escapes user-supplied values before splicing them into LDAP filters ([dotnet/runtime #126433](https://github.com/dotnet/runtime/pull/126433)). This closes an LDAP-injection vector for code paths that built filter strings from search parameters (`UserPrincipal.FindByIdentity`, `PrincipalSearcher`-style queries). Applications that explicitly supplied pre-escaped values should not see a behavior change; applications that did not now get correct results for inputs containing `*`, `(`, `)`, or `\`.

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Half FP16 ISA acceleration: shipped as PR 122649, then reverted by PR 127042. Not part of Preview 4.
  - GroupJoin tuple overload: shipped as PR 121999, reverted by PR 126624. Not in Preview 4.
  - Box value types implementing IXmlSerializable in XmlSerializer generated IL (PR 117473): correctness fix in serializer-generated IL, no API surface, narrow audience.
  - System.Diagnostics.EventLog NRT annotations (PR 119891): annotation pass with no behavior change.
  - BigInteger nuint limbs rewrite (PR 125799): internal perf rework; user-visible only as a perf delta. Pending benchmark numbers.
  - Dictionary.Remove split inner loops for value-type key (PR 125884): JIT-friendly restructure; perf-only, no API change.
  - SortedSet<T>.TreeSubSet.Clear improvement (PR 126410): perf-only on a niche surface.
  - AsyncEnumerable.ToAsyncEnumerable shortcut for IAsyncEnumerable inputs (PR 126362): single-call shortcut; mostly affects bridges, not consumers.
  - Add Log10 to IBinaryInteger (PR 126065): generic-math gap fill; narrow audience.
  - OverloadResolutionPriority on MemoryMarshal.AsBytes/Cast (PR 126252): API hygiene; readers won't notice unless they use ambiguous overloads.
  - Utf8JsonWriter early init / FrameworkEventSource init (PR 126737): startup optimization, not user-facing.
  - HttpClientBuilder docstring typos (PR 126702), IChangeToken docs clarification (PR 126640): docs-only.
  - Process trimming/MacCatalyst correctness items (PR 126478, PR 126449 follow-ups): rolled into the Process section as a single quality-of-implementation paragraph.
  - SmtpException.GetMessageForStatus distinct messages (PR 126602): small message-quality fix; bug-bucket only.
  - decimal NumberStyles validation fix (PR 126644): bug-bucket; no API change.
  - DirectoryNotFoundException.DirectoryPath property (PR 126428): small API addition with thin description; covered as a one-liner in bug fixes if desired.
-->

## Breaking changes

- `Microsoft.Extensions.Logging` moves several internal types to a new location and ships obsolete compatibility shims in their original namespaces ([dotnet/runtime #127194](https://github.com/dotnet/runtime/pull/127194)). Code that referenced the old types (mostly logging-library authors and source generators) will compile with `[Obsolete]` warnings; migrate to the new locations before the shims are removed in a future release.
- `System.Security.Cryptography.Xml` mitigations may reject signed/encrypted XML inputs that previously verified ([dotnet/runtime #126957](https://github.com/dotnet/runtime/pull/126957)). Review applications that consume signed XML from third parties.
- `System.DirectoryServices.AccountManagement` now escapes LDAP filter values ([dotnet/runtime #126433](https://github.com/dotnet/runtime/pull/126433)). Applications that pre-escaped values should not be affected; applications that double-escaped will now produce different filter strings.
- `ZipArchive` Update mode no longer drops data descriptors when re-saving an archive ([dotnet/runtime #126447](https://github.com/dotnet/runtime/pull/126447)). Tools that compared archive bytes before/after a no-op update will see a different layout.

## Bug fixes

- **System.Buffers**
  - Fixed `ReadOnlySequence.Slice` validation for single-segment sequences ([dotnet/runtime #122828](https://github.com/dotnet/runtime/pull/122828)).
- **System.Collections**
  - Fixed `IndexOf` upper-bound guard in `ImmutableArray` and `ImmutableList` ([dotnet/runtime #124967](https://github.com/dotnet/runtime/pull/124967)). Thank you [@prozolic](https://github.com/prozolic)!
- **System.Globalization / formatting**
  - Fixed `decimal` parsing with certain `NumberStyles` combinations ([dotnet/runtime #126644](https://github.com/dotnet/runtime/pull/126644)). Thank you [@lilinus](https://github.com/lilinus)!
  - Fixed `TimeZoneInfo.ConvertTime` producing wrong results near `DateTime.MinValue`/`MaxValue` ([dotnet/runtime #127009](https://github.com/dotnet/runtime/pull/127009)).
- **System.IO.Compression**
  - Fixed `ZipArchive` Update removing data descriptors ([dotnet/runtime #126447](https://github.com/dotnet/runtime/pull/126447)).
  - Ensured buffer space before reading in `ZstandardStream` decompression ([dotnet/runtime #127105](https://github.com/dotnet/runtime/pull/127105)). Thank you [@pumpkin-bit](https://github.com/pumpkin-bit)!
- **System.Net.Http / WebSockets**
  - Closed a socket leak when a connect failed ([dotnet/runtime #126307](https://github.com/dotnet/runtime/pull/126307)). Thank you [@dovydenkovas](https://github.com/dovydenkovas)!
  - Updated MsQuic to 2.5.7 for `System.Net.Quic` ([dotnet/runtime #126945](https://github.com/dotnet/runtime/pull/126945)).
  - Replaced `Enum.HasFlag` with bitwise operations in WebSocket hot paths ([dotnet/runtime #127137](https://github.com/dotnet/runtime/pull/127137)).
  - Propagated sync-faulted `FlushAsync` exceptions through the WebSocket error path ([dotnet/runtime #127139](https://github.com/dotnet/runtime/pull/127139)). Thank you [@cittaz](https://github.com/cittaz)!
- **System.Net.Mail**
  - `SmtpException.GetMessageForStatus` now produces distinct messages for unknown vs defined-but-unmapped status codes ([dotnet/runtime #126602](https://github.com/dotnet/runtime/pull/126602)).
- **System.Diagnostics.Process**
  - Fixed missing error handling in `SafeFileHandle.Type` on Windows ([dotnet/runtime #126618](https://github.com/dotnet/runtime/pull/126618)).
- **System.Reflection**
  - Removed a duplicate `ProcessorArchitecture.MSIL` branch in `AssemblyNameParser` ([dotnet/runtime #127173](https://github.com/dotnet/runtime/pull/127173)).
- **System.Text.Json**
  - Fixed `JsonException` message property type info in class parameterized constructors ([dotnet/runtime #126575](https://github.com/dotnet/runtime/pull/126575)). Thank you [@XeronOwO](https://github.com/XeronOwO)!
- **System.Xml**
  - Rewrote `ConvertToDecimal` in `XslNumber` to use safe code with `string.Create` ([dotnet/runtime #124794](https://github.com/dotnet/runtime/pull/124794)).

## Community contributors

Thank you contributors! ❤️

- [@AlexRadch](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AAlexRadch)
- [@anthonycanino](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aanthonycanino)
- [@apoorvdarshan](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aapoorvdarshan)
- [@asbjornvad](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aasbjornvad)
- [@bwinsley](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Abwinsley)
- [@cittaz](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Acittaz)
- [@daeghanelkin](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Adaeghanelkin)
- [@dovydenkovas](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Adovydenkovas)
- [@emilwall](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aemilwall)
- [@Kielek](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AKielek)
- [@larkliy](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Alarkliy)
- [@lilinus](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Alilinus)
- [@prozolic](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aprozolic)
- [@pumpkin-bit](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Apumpkin-bit)
- [@RenderMichael](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ARenderMichael)
- [@rjmurillo](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Arjmurillo)
- [@teo-tsirpanis](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ateo-tsirpanis)
- [@tmds](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Atmds)
- [@XeronOwO](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AXeronOwO)
