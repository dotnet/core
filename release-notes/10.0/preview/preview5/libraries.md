# .NET Libraries in .NET 10 Preview 5 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [Post-Quantum Cryptography (PQC)](#post-quantum-cryptography-pqc)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Post-Quantum Cryptography (PQC)

.NET 10 Preview 5 includes support for three new asymmetric algorithms: ML-KEM (FIPS 203), ML-DSA (FIPS 204), and SLH-DSA (FIPS 205).
These new algorithms made us call into question some of the assumptions underlying the `AsymmetricAlgorithm` type,
and we found that there's not much benefit (but some non-trivial drawbacks) to have these algorithm classes continue to derive from it.

Rather than the AsymmetricAlgorithm approach of creating an object then importing a key into it, or generating a fresh key,
these new types all use static methods to clearly generate a fresh key or import a key:

```C#
using System;
using System.IO;
using System.Security.Cryptography;

private static bool ValidateMLDsaSignature(ReadOnlySpan<byte> data, ReadOnlySpan<byte> signature, string publicKeyPath)
{
    string publicKeyPem = File.ReadAllText(publicKeyPath);

    using (MLDsa key = MLDsa.ImportFromPem(publicKeyPem))
    {
        return key.VerifyData(data, signature);
    }
}
```

Rather than setting object properties and having a key materialize, key generation on these new types takes in all of the options it needs.

```C#
using (MLKem key = MLKem.GenerateKey(MLKemAlgorithm.MLKem768))
{
    string publicKeyPem = key.ExportSubjectPublicKeyInfoPem();
    ...
}
```

These algorithms all continue with the pattern of having a static `IsSupported` property to indicate if the algorithm is supported on the current system.

In Preview 5 builds, the PQC algorithms are only available on systems where the system cryptographic libraries are OpenSSL 3.5 (or newer),
Windows CNG support will be coming soon.

These new algorithms are all marked as `[Experimental]` under diagnostic SYSLIB5006 until full development is complete.

- System.Security.Cryptography.MLKem
- System.Security.Cryptography.MLDsa
- System.Security.Cryptography.SlhDsa
