# Libraries in .NET 11 RC 2 - Release Notes

.NET 11 RC 2 adds incremental data-processing and experimental cryptography APIs:

- [Read CBOR incrementally](#read-cbor-incrementally)
- [Experimental composite ML-KEM and HPKE APIs](#experimental-composite-ml-kem-and-hpke-apis)
- [Format DataAnnotations messages with attribute-specific arguments](#format-dataannotations-messages-with-attribute-specific-arguments)

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

`CompositeMLKem` combines post-quantum and classical key encapsulation so both must contribute to the shared secret. RC 2 includes managed and Windows implementations and certificate integration ([dotnet/runtime #134163](https://github.com/dotnet/runtime/pull/134163), [dotnet/runtime #134164](https://github.com/dotnet/runtime/pull/134164), [dotnet/runtime #134165](https://github.com/dotnet/runtime/pull/134165), [dotnet/runtime #134289](https://github.com/dotnet/runtime/pull/134289)). Use `CompositeMLKem.IsAlgorithmSupported` to check the selected algorithm.

Separately, `Hpke` provides Hybrid Public Key Encryption for applications working on post-quantum transition scenarios ([dotnet/runtime #134443](https://github.com/dotnet/runtime/pull/134443)). The RC 2 implementation does not cover every platform integration; check `Hpke.IsSupported` for the selected suite. Both APIs are experimental, require explicit opt-in to their compiler diagnostics for direct use, and may change. The [maintained fixture](../../samples/libraries/README.md) verifies encapsulation/decapsulation and seal/open round trips without suppressing those diagnostics.

See the [libraries documentation](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries) for the wider .NET 11 feature set.

## Format DataAnnotations messages with attribute-specific arguments

`ValidationAttribute.FormatMessage` lets a validation host supply a message template while the attribute fills in its own placeholders. This supports localization without duplicating formatting logic for built-in attributes such as `RangeAttribute` ([dotnet/runtime #132853](https://github.com/dotnet/runtime/pull/132853)).

```csharp
var range = new RangeAttribute(1, 10);
string message = range.FormatMessage("{0} must be between {1} and {2}", "Value");
// Value must be between 1 and 10
```
