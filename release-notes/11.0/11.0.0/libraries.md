# Libraries in .NET 11 - Release Notes

The final library updates for .NET 11 include experimental public-key encryption, JSON Lines serialization fixes, and migration guidance for tensor and compression APIs.

For features introduced throughout the release, see [What's new in the .NET 11 libraries](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries).

- [Experimental public-key encryption](#experimental-public-key-encryption)
- [JSON Lines streaming](#json-lines-streaming)
- [Breaking changes from .NET 10](#breaking-changes-from-net-10)
- [Changes for users of earlier release candidates](#changes-for-users-of-earlier-release-candidates)

## Library improvements

### Experimental public-key encryption

A managed implementation of Hybrid Public Key Encryption (HPKE) lets protocols encrypt data for a recipient using the recipient's public key, rather than requiring a previously shared secret. Check `Hpke.IsSupported` for the algorithm suite you intend to use; availability varies by platform and suite ([dotnet/runtime#134442](https://github.com/dotnet/runtime/pull/134442)).

The following example generates a recipient's key, encrypts using only its public key, and decrypts with the recipient's private key:

```csharp
using System.Security.Cryptography;
using System.Text;

var suite = new HpkeSuite(
    HpkeKem.DHKEM_P256_HKDF_SHA256,
    HpkeKdf.HKDF_SHA256,
    HpkeAead.AES_128_GCM);

if (!Hpke.IsSupported(suite))
    throw new PlatformNotSupportedException("The selected HPKE suite is unavailable.");

using var recipient = Hpke.GenerateKey(suite);
using var sender = Hpke.ImportEncapsulationKey(suite, recipient.ExportEncapsulationKey());
sender.Seal("Hello"u8, out byte[] encapsulatedSecret, out byte[] ciphertext);
byte[] plaintext = recipient.Open(encapsulatedSecret, ciphertext);
Console.WriteLine(Encoding.UTF8.GetString(plaintext)); // Hello
```

These APIs are experimental and produce diagnostic `SYSLIB5009`. To run the example while keeping that diagnostic visible, configure it as a warning in your project's `.editorconfig`:

```editorconfig
[*.cs]
dotnet_diagnostic.SYSLIB5009.severity = warning
```

### JSON Lines streaming

`JsonSerializer.SerializeAsyncEnumerable` now streams each JSONL entry instead of buffering the entire entry. This also fixes serialization of entries that contain nested asynchronous enumerables ([dotnet/runtime#134593](https://github.com/dotnet/runtime/pull/134593)).

## Breaking changes from .NET 10

Updating the `System.Numerics.Tensors` package changes shape alignment and rejects unsupported overlapping storage layouts. These changes also apply to the package's supported older target frameworks. Review code that depends on a particular shape or overlapping copy being accepted, and follow the guidance on [tensor shape alignment](https://learn.microsoft.com/dotnet/core/compatibility/core-libraries/11/tensor-shape-alignment) and [tensor storage-layout validation](https://learn.microsoft.com/dotnet/core/compatibility/core-libraries/11/tensor-storage-layout-validation) ([dotnet/runtime#135281](https://github.com/dotnet/runtime/pull/135281)).

Unsupported overlapping copies now throw before writing output. Use separate destination storage or snapshot the source when overlap is unsupported.

See [Breaking changes in .NET 11](https://learn.microsoft.com/dotnet/core/compatibility/11) for the full compatibility guidance.

## Changes for users of earlier release candidates

`ZstandardDictionary.Train` now returns raw dictionary bytes (`byte[]`) instead of a prepared `ZstandardDictionary`. Prepare those bytes with `ZstandardDictionary.Create` so the requested compression quality is used ([dotnet/runtime#135756](https://github.com/dotnet/runtime/pull/135756)).

Given concatenated training samples in `samples` and their individual lengths in `sampleLengths`:

```csharp
byte[] data = ZstandardDictionary.Train(samples, sampleLengths, maxDictionarySize: 4096);
using ZstandardDictionary dictionary = ZstandardDictionary.Create(data, quality: 19);
```

<!-- API signatures and replacement usage verified against the supplied local .NET 11.0.0 build with SDK 11.0.100. Correlation with the final public GA artifact is pending. -->
