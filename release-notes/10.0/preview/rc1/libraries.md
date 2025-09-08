# Libraries in .NET 10 RC 1 - Release Notes

The following .NET 10 RC 1 release notes describe new features and changes in
this release.

- [Cryptography: ML-DSA External Mu](#cryptography-ml-dsa-external-mu)
- [Cryptography: Post Quantum Cryptography "API Complete"](#cryptography-post-quantum-cryptography-api-complete)
- [UTF-8 Support for hex-string conversion](#utf-8-support-for-hex-string-conversion)
- [Tensor, TensorSpan, and ReadOnlyTensorSpan](#tensor-tensorspan-and-readonlytensorspan)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Cryptography: ML-DSA External Mu

The ML-DSA class now allows signatures to be created and verified from an "external" mu (&#x3BC;) value.

```csharp
namespace System.Security.Cryptography;

public partial class MLDsa
{
    public byte[] SignMu(byte[] externalMu);
    public void SignMu(ReadOnlySpan<byte> externalMu, Span<byte> destination);
    public byte[] SignMu(ReadOnlySpan<byte> externalMu);    
 
    public bool VerifyMu(byte[] externalMu, byte[] signature);
    public bool VerifyMu(ReadOnlySpan<byte> externalMu, ReadOnlySpan<byte> signature);    
 
    protected abstract void SignMuCore(ReadOnlySpan<byte> externalMu, Span<byte> destination);
    protected abstract bool VerifyMuCore(ReadOnlySpan<byte> externalMu, ReadOnlySpan<byte> signature);
}
```

External mu signatures require platform support.
If, as more providers come online, we find that the provider support is fragmented,
we may find it useful to add a capability API (e.g. `public bool SupportsMu { get; }`).
But, for now, we are presenting it as a universally available feature.

## Cryptography: Post Quantum Cryptography "API Complete"

The `MLDsa`, `MLKem`, `SlhDsa`, and `CompositeMLDsa` types (and their associated -Algorithm types) have all been through the API Review process,
compared against each other for local consistency, and had all of the members declared for the RC1 release --
both for the .NET 10 built-in versions and for the downlevel compatibility versions in Microsoft.Bcl.Cryptography.

The `MLKem` type is no longer marked as `[Experimental]`, but a handful of methods on it still are,
because they are based on standards that haven't hit final version/publication.
We expect to similarly move `[Experimental]` from the `MLDsa` type down to a handful of its members for the stable release of .NET 10.
The `SlhDsa` and `CompositeMLDsa` classes, however, will retain their `[Experimental]` decoration.

While we have no active plans to introduce breaking changes beyond the stable release of .NET 10,
the `[Experimental]` attribute is indicating areas where specifications are not complete
or we are still waiting on features in our underlying platform libraries.

## UTF-8 Support for hex-string conversion

The `System.Convert` class exposes additional overloads which provide support for converting a buffer of UTF-8 text to the corresponding bytes and vice-versa. These mirror the existing overloads taking `string` and `ReadOnlySpan<char>`:
```csharp
namespace System;

public static class Convert
{
    public static System.Buffers.OperationStatus FromHexString(ReadOnlySpan<byte> utf8Source, Span<byte> destination, out int bytesConsumed, out int bytesWritten);
    public static byte[] FromHexString(ReadOnlySpan<byte> utf8Source);
    public static bool TryToHexString(ReadOnlySpan<byte> source, Span<byte> utf8Destination, out int bytesWritten);
    public static bool TryToHexStringLower(ReadOnlySpan<byte> source, Span<byte> utf8Destination, out int bytesWritten);
}
```

## Tensor, TensorSpan, and ReadOnlyTensorSpan

We initially previewed the new tensor APIs as part of .NET 9 (see [here](https://github.com/dotnet/core/blob/main/release-notes/9.0/preview/preview5/libraries.md#enhanced-ai-capabilities-with-tensorprimitives-and-tensort)) and are now shipping these APIs as stable in .NET 10

The API surface remains "out of box" and requires referencing the [System.Numerics.Tensors](https://www.nuget.org/packages/System.Numerics.Tensors) NuGet package to be available.

While the overall API surface remains similar to that previewed in .NET 9, several binary breaking changes were made to the types that were annotated with the `[Experimental]` attribute based on feedback from the community and general user experience problems that were identified.

The types are taking advantage of the new C# 14 extension operators feature so that arithmetic operations are available if the underlying `T` in a `Tensor<T>` itself supports the given operation. Support is identified by the `T` implementing the relevant [Generic Math](https://learn.microsoft.com/en-us/dotnet/standard/generics/math) interfaces, such as `IAdditionOperators<TSelf, TOther, TResult>` or `INumber<TSelf>`. For example, `tensor + tensor` is available for a `Tensor<int>`, but is not available for a `Tensor<bool>`.

## API Diff

The full diff for the "in box" .NET Libraries APIs between .NET 10 Preview 7 and .NET 10 RC1 can be found [here](https://github.com/dotnet/core/blob/main/release-notes/10.0/preview/rc1/api-diff/Microsoft.NETCore.App/10.0-rc1.md).
