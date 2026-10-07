# Libraries in .NET 11 RC 2 - Release Notes

.NET 11 RC 2 adds APIs for incremental CBOR reading, cryptography, validation messages, and HTTP/2 concurrency:

- [Read CBOR incrementally](#read-cbor-incrementally)
- [Experimental composite ML-KEM and HPKE APIs](#experimental-composite-ml-kem-and-hpke-apis)
- [Format DataAnnotations messages with attribute-specific arguments](#format-dataannotations-messages-with-attribute-specific-arguments)
- [Configure initial HTTP/2 concurrency](#configure-initial-http2-concurrency)
- [Breaking changes from .NET 10](#breaking-changes-from-net-10)
- [Changes since RC 1](#changes-since-rc-1)
- [Bug fixes](#bug-fixes)

<!-- APIs verified against Microsoft.NETCore.App.Ref and Microsoft.AspNetCore.App.Ref@11.0.0-rc.2.26475.137. -->

## Read CBOR incrementally

`CborReader` can read a payload delivered in chunks without first copying the entire document into contiguous memory. Construct a reader with `isFinalBlock: false`; `NeedsMoreData` indicates when the next chunk is required. Pass that chunk to `SlideData`, marking the final block when appropriate. Incremental reading requires `CborConformanceMode.Lax`; other conformance modes reject a non-final block ([dotnet/runtime #134374](https://github.com/dotnet/runtime/pull/134374)).

```csharp
ReadOnlyMemory<byte> firstChunk = new byte[] { 0x82, 0x0a };
ReadOnlyMemory<byte> nextChunk = new byte[] { 0x14 };
var reader = new CborReader(firstChunk,
    new CborReaderOptions { ConformanceMode = CborConformanceMode.Lax }, isFinalBlock: false);

reader.ReadStartArray();
int first = reader.ReadInt32(); // 10

if (reader.PeekState() == CborReaderState.NeedsMoreData)
{
    if (reader.BytesRemaining == 0)
        reader.SlideData(nextChunk, isFinalBlock: true);
    else
        throw new Exception("Buffer management omitted from the sample.");
}

int second = reader.ReadInt32(); // 20
reader.ReadEndArray();
```

## Experimental composite ML-KEM and HPKE APIs

`CompositeMLKem` combines post-quantum and classical key encapsulation so both contribute to the shared secret. RC 2 includes a managed implementation for OpenSSL-backed platforms and a Windows implementation using supporting cryptographic providers ([dotnet/runtime #134163](https://github.com/dotnet/runtime/pull/134163), [dotnet/runtime #134164](https://github.com/dotnet/runtime/pull/134164), [dotnet/runtime #134165](https://github.com/dotnet/runtime/pull/134165)). Check `CompositeMLKem.IsAlgorithmSupported` before using an algorithm.

RC 2 also adds certificate accessors. `X509Certificate2.GetCompositeMLKemPublicKey` extracts the public key, but private-key extraction and `CopyWithPrivateKey(CompositeMLKem)` are not implemented for matching certificates and throw `PlatformNotSupportedException`. The public API surface is in place for certificate integration, and the implementations will be added in servicing releases once the underlying platform support is available ([dotnet/runtime #134289](https://github.com/dotnet/runtime/pull/134289)).

Separately, `Hpke` provides Hybrid Public Key Encryption ([dotnet/runtime #134443](https://github.com/dotnet/runtime/pull/134443)). RC 2 implements classical DHKEM suites; ML-KEM and hybrid ML-KEM suites are not yet supported. Check `Hpke.IsSupported` for the selected suite. Both `Hpke` and `CompositeMLKem` are experimental and may change; direct use requires opting in to `SYSLIB5009` and `SYSLIB5006`, respectively.

### Encrypt CMS messages with ML-KEM

`EnvelopedCms` adds ML-KEM encryption and decryption using KEM recipients ([dotnet/runtime #134310](https://github.com/dotnet/runtime/pull/134310)). This uses the managed CMS implementation on non-Windows platforms with ML-KEM support. Windows KEM recipient support and Composite ML-KEM CMS operations are not implemented in RC 2.

## Format DataAnnotations messages with attribute-specific arguments

`ValidationAttribute.FormatMessage` lets a validation host supply a message template while the attribute fills in its own placeholders. This supports localization without duplicating formatting logic for built-in attributes such as `RangeAttribute` ([dotnet/runtime #132853](https://github.com/dotnet/runtime/pull/132853)).

```csharp
using System.ComponentModel.DataAnnotations;

var range = new RangeAttribute(1, 10);
string message = range.FormatMessage("{0} must be between {1} and {2}", "Value");
// Value must be between 1 and 10
```

## Configure initial HTTP/2 concurrency

`SocketsHttpHandler.InitialHttp2MaxConcurrentStreams` limits concurrent streams on each new HTTP/2 connection before the server's SETTINGS frame arrives. Set a lower value when a server's stream limit is known to be below the default of 100, limiting the initial burst on that connection. After receiving SETTINGS, the connection uses the server's advertised limit. The property requires a value of at least 1; an earlier connection's lower advertised limit can further reduce initial concurrency for that host ([dotnet/runtime #132566](https://github.com/dotnet/runtime/pull/132566)).

See the [libraries documentation](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries) for the wider .NET 11 feature set.

## Breaking changes from .NET 10

On iOS and tvOS, RC 2 disables advisory file locking by default to avoid OS termination when an app is suspended while holding a file lock. `FileShare` restrictions are no longer enforced by those locks, including between handles in the same process. Mac Catalyst and other platforms retain their existing defaults. To restore locking, set the runtime configuration property `System.IO.DisableFileLocking` to `false`, or the environment variable `DOTNET_SYSTEM_IO_DISABLEFILELOCKING` to `0` ([dotnet/runtime #134331](https://github.com/dotnet/runtime/pull/134331)). Restoring locking also restores the risk of suspension-related termination.

## Changes since RC 1

### MemoryCache metrics

MemoryCache metrics rename the hit/miss attribute from `dotnet.cache.request.type` to `dotnet.cache.request.result`. Update telemetry filters that use the old name. The `dotnet.cache.estimated_size` metric now has unit `1`, rather than `By`: its values represent application-defined cache size units, not necessarily bytes ([dotnet/runtime #133157](https://github.com/dotnet/runtime/pull/133157)).

### Improved IEEE decimal accuracy

`Decimal32`, `Decimal64`, and `Decimal128` are more accurate for transcendental functions. The most significant fix is for `Decimal128` values near a cancellation point, such as `Asin`/`Acos` near ±1 and logarithms near 1, where RC 1 could lose most or all significant digits. For example, `Decimal128.Acos(1 - 1e-30)` previously had an error of roughly 10²⁴ units in the last place (ULPs); it is now well under one ULP ([dotnet/runtime #133432](https://github.com/dotnet/runtime/issues/133432)).

The change also improves the following:

- Inverse trigonometric and hyperbolic functions, logarithms, `Pow`, and `RootN`, by preserving decimal precision during argument reduction.
- `SinPi`, `CosPi`, `TanPi`, and `SinCosPi`, including exact results such as zero for integer inputs written with alternate decimal representations (for example, `SinPi(1000.000)`).
- `Log(x, base)` for all three types, by rounding only once.
- `Exp2`, `Exp2M1`, and subnormal-result rounding.
- Alternate representations of `1`, such as `Acosh(1.0000000)`, which no longer returns NaN for `Decimal64` and `Decimal128`.

No public APIs were added. Because rounded results intentionally change, code that compares these results against stored values may observe different last digits. The functions are still not guaranteed to be correctly rounded ([dotnet/runtime #133949](https://github.com/dotnet/runtime/pull/133949)).

## Bug fixes

- **System.Collections.Concurrent**
  - [Prevent TryDequeue and TryPeek from reporting an empty ConcurrentQueue during segment growth](https://github.com/dotnet/runtime/pull/132863)
- **System.Text.Json**
  - [Infer derived types through nested closed hierarchies](https://github.com/dotnet/runtime/pull/133004)
  - [Honor JsonNumberHandlingAttribute on C# unions](https://github.com/dotnet/runtime/pull/133951)
  - [Avoid SYSLIB1227 for unions with custom converters](https://github.com/dotnet/runtime/pull/133475)
  - [Fix generated unsafe accessors, including compatibility with updated C# unsafe semantics](https://github.com/dotnet/runtime/pull/133886)
