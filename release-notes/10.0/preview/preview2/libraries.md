# .NET Libraries in .NET 10 Preview 2 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [Feature](#feature)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Encryption algorithm can now be specified in PKCS\#12/PFX Export

The new `ExportPkcs12` methods on `X509Certificate2` allow callers to choose what encryption and digest algorithms are used to produce the output.
`Pkcs12ExportPbeParameters.Pkcs12TripleDesSha1` indicates the Windows XP-era de facto standard,
which produces an output supported by almost every library/platform that supports reading PKCS#12/PFX by choosing an older encryption algorithm.
`Pkcs12ExportPbeParameters.Pbes2Aes256Sha256` indicates that AES should be used instead of 3DES (and SHA-2-256 instead of SHA-1),
but the output may not be understood by all readers (sorry, Windows XP).

Callers who want even more control can instead utilize the overload that accepts a `PbeParameters`.

## Feature

This is about the feature
