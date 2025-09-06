# Libraries in .NET 10 RC 1 - Release Notes

The following .NET 10 RC 1 release notes describe new features and changes in
this release.

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

## What's new features

Something about the feature
