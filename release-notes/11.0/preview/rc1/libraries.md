<!-- Verified against Microsoft.NETCore.App.Ref@11.0.0-rc.1.26427.112 and dotnet/core #10530 -->
# .NET Libraries in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 includes new .NET libraries features and improvements:

- [Signal processes and inspect termination status](#signal-processes-and-inspect-termination-status)
- [Experimental caller-driven TLS sessions](#experimental-caller-driven-tls-sessions)
- [DNS record resolution on Linux](#dns-record-resolution-on-linux)
- [JSON support for new numeric types and binary schemas](#json-support-for-new-numeric-types-and-binary-schemas)
- [Construct BitArray values from spans](#construct-bitarray-values-from-spans)
- [Reuse compression encoders and decoders](#reuse-compression-encoders-and-decoders)
- [TLS channel binding on Unix](#tls-channel-binding-on-unix)
- [Faster authenticated encryption on Apple platforms](#faster-authenticated-encryption-on-apple-platforms)
- [AES Key Wrap support](#aes-key-wrap-support)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Libraries updates in .NET 11:

- [What's new in .NET libraries for .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries)

## Signal processes and inspect termination status

`Process` now exposes process signaling and exit-status APIs directly, without requiring callers to work through `SafeProcessHandle` ([dotnet/runtime #131165](https://github.com/dotnet/runtime/pull/131165)). `Signal` sends a POSIX signal, while the synchronous and asynchronous wait methods return `ProcessExitStatus`, which distinguishes normal exit from signal-based termination.

```csharp
using System.Diagnostics;
using System.Runtime.InteropServices;

using Process process = Process.Start("worker")!;

if (OperatingSystem.IsLinux() || OperatingSystem.IsMacOS())
{
    process.Signal(PosixSignal.SIGTERM);
}

ProcessExitStatus status = await process.WaitForExitStatusAsync();
Console.WriteLine(status);
```

The exact RC 1 API additions are:

```csharp
public bool Signal(PosixSignal signal);
public ProcessExitStatus WaitForExitStatus();
public bool TryWaitForExitStatus(TimeSpan timeout, out ProcessExitStatus? exitStatus);
public Task<ProcessExitStatus> WaitForExitStatusAsync(
    CancellationToken cancellationToken = default);
```

## Experimental caller-driven TLS sessions

> [!WARNING]
> The `TlsContext`, `TlsSession`, `TlsBufferSession`, `TlsSocketSession`, and `TlsOperationStatus` APIs are experimental in .NET 11 and produce diagnostic `SYSLIB5007`.

`System.Net.Security` now offers a caller-driven, non-blocking TLS state machine for advanced transports where the application controls buffers and I/O scheduling ([dotnet/runtime #130366](https://github.com/dotnet/runtime/pull/130366)). `TlsBufferSession` operates over caller-provided spans, while `TlsSocketSession` works with a `SafeSocketHandle`.

Operations such as `Handshake`, `Read`, `Write`, `Shutdown`, and `RequestClientCertificate` return `TlsOperationStatus`. The status reports whether an operation completed, needs more input, needs a larger destination, or requires certificate validation or a new `TlsContext`. Follow-up work clarified session lifetime and socket attachment rules ([dotnet/runtime #131457](https://github.com/dotnet/runtime/pull/131457)).

## DNS record resolution on Linux

The DNS record resolution APIs introduced in Preview 7 now have a Linux implementation ([dotnet/runtime #129846](https://github.com/dotnet/runtime/pull/129846)). `DnsResolver` and the static `Dns.Resolve*` methods can resolve address, SRV, MX, TXT, CNAME, PTR, and NS records on Linux instead of throwing `PlatformNotSupportedException`.

The implementation uses the platform resolver configuration by default and supports the custom DNS server list in `DnsResolverOptions`. The same resolver tests now run across Unix platforms ([dotnet/runtime #132216](https://github.com/dotnet/runtime/pull/132216)).

## JSON support for new numeric types and binary schemas

`System.Text.Json` now includes built-in converters for `BFloat16`, `Decimal32`, `Decimal64`, and `Decimal128` ([dotnet/runtime #131523](https://github.com/dotnet/runtime/pull/131523)). These converters work with reflection-based serialization and source generation, including named floating-point literals when enabled through `JsonNumberHandling`.

```csharp
using System.Numerics;
using System.Text.Json;

Decimal64 value = Decimal64.Parse("19.95");
string json = JsonSerializer.Serialize(value);
Decimal64 roundTripped = JsonSerializer.Deserialize<Decimal64>(json);
```

`JsonSchemaExporter` also identifies the base64 representation used for `byte[]`, `Memory<byte>`, and `ReadOnlyMemory<byte>` ([dotnet/runtime #130881](https://github.com/dotnet/runtime/pull/130881)):

```diff
- { "type": ["string", "null"] }
+ { "type": ["string", "null"], "contentEncoding": "base64" }
```

## Construct BitArray values from spans

`BitArray` now accepts `ReadOnlySpan<bool>`, `ReadOnlySpan<byte>`, and `ReadOnlySpan<int>` ([dotnet/runtime #131500](https://github.com/dotnet/runtime/pull/131500)). Applications can construct bit arrays directly from slices or stack-allocated data without first allocating an array.

```csharp
Span<byte> bytes = stackalloc byte[] { 0b_0000_0011, 0b_1000_0000 };
var bits = new BitArray(bytes);

Console.WriteLine(bits[0]);  // True
Console.WriteLine(bits[1]);  // True
Console.WriteLine(bits[15]); // True
```

In the PR's Windows Arm64 benchmarks, direct span construction was 33–51% faster than the `span.ToArray()` workaround. Allocations were approximately 50% lower for byte and integer inputs and up to 89% lower for Boolean inputs.

Thank you [@joshuajyue](https://github.com/joshuajyue) for this contribution!

## Reuse compression encoders and decoders

The streamless `DeflateEncoder`, `DeflateDecoder`, `ZLibEncoder`, `ZLibDecoder`, `GZipEncoder`, and `GZipDecoder` types now provide a `Reset()` method ([dotnet/runtime #131307](https://github.com/dotnet/runtime/pull/131307)). Resetting returns an instance to its initial state so it can process another independent payload without allocating a replacement encoder or decoder.

## TLS channel binding on Unix

Negotiate authentication servers can now validate TLS channel binding tokens on Unix ([dotnet/runtime #130758](https://github.com/dotnet/runtime/pull/130758)). The managed GSSAPI path passes the channel binding data to `gss_accept_sec_context`, which rejects a mismatch in the same way as the existing Unix client path.

This enables Extended Protection scenarios that bind authentication to the underlying TLS connection. ASP.NET Core's Negotiate authentication uses this support when channel binding is available ([dotnet/aspnetcore #68317](https://github.com/dotnet/aspnetcore/pull/68317)).

## Faster authenticated encryption on Apple platforms

`AesGcm` and `ChaCha20Poly1305` avoid passing empty associated data to CryptoKit, allowing the native implementation to use its empty-AAD fast path ([dotnet/runtime #131630](https://github.com/dotnet/runtime/pull/131630)). On Apple platforms version 26 and later, encryption also skips a copy that was required as a workaround for older Foundation implementations.

On an Apple M1 Ultra running macOS Tahoe 26.6, encrypting a 16-byte payload with empty AAD improved from 2.658 μs to 1.952 μs for `AesGcm`, and from 2.798 μs to 2.135 μs for `ChaCha20Poly1305`. The corresponding decrypt measurements improved from 2.908 μs to 2.548 μs and from 3.213 μs to 2.927 μs.

## AES Key Wrap support

The `Aes` class now supports the unpadded AES Key Wrap algorithm defined by RFC 3394 ([dotnet/runtime #132477](https://github.com/dotnet/runtime/pull/132477)). The new `EncryptKeyWrap`, `DecryptKeyWrap`, `TryDecryptKeyWrap`, and `GetKeyWrapLength` methods complement the padded AES-KWP APIs added earlier in .NET 11.

The APIs provide array-returning and span-based overloads for wrapping cryptographic keys, including scenarios used by JOSE libraries.

<!-- Filtered features (significant engineering work, but too niche for standalone release-note sections):
  - Vectorized Base64 in-place decoding: Useful throughput optimization, but the PR provides no broad end-to-end workload story for RC 1.
  - Experimental HTTP connection-pool partitioning option: Narrow diagnostic/transport tuning surface and experimental behavior better covered with the broader HTTP connection-management work.
-->

## Bug fixes

- **Compression and archives**
  - ZIP readers now reject corrupted or hardened central-directory inconsistencies ([dotnet/runtime #131257](https://github.com/dotnet/runtime/pull/131257), [dotnet/runtime #131738](https://github.com/dotnet/runtime/pull/131738)).
  - Case-sensitive ZIP extraction on Windows and extraction of password-protected archives containing empty files now work correctly ([dotnet/runtime #131202](https://github.com/dotnet/runtime/pull/131202), [dotnet/runtime #132217](https://github.com/dotnet/runtime/pull/132217)).
  - `DeflateEncoder.GetMaxCompressedLength` now returns a sufficiently conservative bound ([dotnet/runtime #132476](https://github.com/dotnet/runtime/pull/132476)).
- **Networking**
  - `NO_PROXY` and `no_proxy` now recognize IPv4 and IPv6 CIDR notation ([dotnet/runtime #131397](https://github.com/dotnet/runtime/pull/131397)).
  - HTTP/2 keep-alive pings are now sent and enforced in scenarios that previously skipped them ([dotnet/runtime #131582](https://github.com/dotnet/runtime/pull/131582)).
  - `NetworkChange` no longer crashes on macOS when its run-loop thread has already exited ([dotnet/runtime #131867](https://github.com/dotnet/runtime/pull/131867)).
  - `SslAuthenticationOptions` no longer disposes an `IntermediateCertificates` collection it doesn't own ([dotnet/runtime #131758](https://github.com/dotnet/runtime/pull/131758)).
- **Processes**
  - Process environment-variable names containing null characters are rejected before process creation ([dotnet/runtime #132214](https://github.com/dotnet/runtime/pull/132214)).
  - Process inspection on FreeBSD no longer throws an unhandled exception when native process information is unavailable ([dotnet/runtime #131534](https://github.com/dotnet/runtime/pull/131534)).
- **Rate limiting**
  - Rejected `SlidingWindowRateLimiter` leases now populate `RetryAfter` metadata based on when enough permits are expected to become available ([dotnet/runtime #131225](https://github.com/dotnet/runtime/pull/131225)).

## Community contributors

Thank you contributors! ❤️

- [@alinpahontu2912](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aalinpahontu2912)
- [@arrowd](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aarrowd)
- [@isaacisland](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aisaacisland)
- [@joshuajyue](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ajoshuajyue)
- [@nwoolls](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Anwoolls)
- [@SapiensAnatis](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ASapiensAnatis)
