# Libraries Examples

## Post-Quantum Cryptography Updates

### ML-DSA

The `System.Security.Cryptography.MLDsa` class gained ease-of-use updates in this release, allowing some common code patterns to be simplified:

```diff
private static byte[] SignData(string privateKeyPath, ReadOnlySpan<byte> data)
{
    using (MLDsa signingKey = MLDsa.ImportFromPem(File.ReadAllBytes(privateKeyPath)))
    {
-       byte[] signature = new byte[signingKey.Algorithm.SignatureSizeInBytes];
-       signingKey.SignData(data, signature);
+       return signingKey.SignData(data);
-       return signature;
    }
}
```

Additionally, this release added support for HashML-DSA, which we call "PreHash" to help distinguish it from "pure" ML-DSA. As the underlying specification interacts with the Object Identifier (OID) value, the SignPreHash and VerifyPreHash methods on this `[Experimental]` type take the dotted-decimal OID as a string. This may evolve as more scenarios using HashML-DSA become well-defined.

```csharp
private static byte[] SignPreHashSha3_256(MLDsa signingKey, ReadOnlySpan<byte> data)
{
    const string Sha3_256Oid = "2.16.840.1.101.3.4.2.8";
    return signingKey.SignPreHash(SHA3_256.HashData(data), Sha3_256Oid);
}
```

### Composite ML-DSA

This release also introduces new types to support ietf-lamps-pq-composite-sigs (currently at draft 7), and an implementation of the primitive methods for RSA variants.

```csharp
var algorithm = CompositeMLDsaAlgorithm.MLDsa65WithRSA4096Pss;
using var privateKey = CompositeMLDsa.GenerateKey(algorithm);

byte[] data = [42];
byte[] signature = privateKey.SignData(data);

using var publicKey = CompositeMLDsa.ImportCompositeMLDsaPublicKey(
    algorithm, privateKey.ExportCompositeMLDsaPublicKey());
Console.WriteLine(publicKey.VerifyData(data, signature)); // True

signature[0] ^= 1; // Tamper with signature
Console.WriteLine(publicKey.VerifyData(data, signature)); // False
```

---
Source: [.NET 10 Preview 7 — Libraries](../../../../release-notes/10.0/preview/preview7/libraries.md)
Commentary: Long — subheadings organize related-but-distinct features. Uses `diff` blocks for API simplification and complete runnable scenarios for new APIs.
Why it works: The `diff` block immediately shows the simplification (red lines removed, green line added). The Composite ML-DSA sample is a complete scenario (generate → sign → verify → tamper → verify-fails).
---
