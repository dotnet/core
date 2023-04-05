# .NET 8.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET SDK

### [8.0.100-preview.1.23115.2] analyzer CA2009 throws InvalidCastException at runtime could cause a build failure

[CA2009](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca2009): `Do not call ToImmutableCollection on an ImmutableCollection value` analyzer regressed in .NET 8 preview 1, the regression could cause a build failure if:

 - CA2009 severity is set at `warning` level: `dotnet_diagnostic.CA2009.severity = warning` (by default it is `suggestion`)
 - And the AD0001 is at `warning` level (by default it is `warning`)
 - And the .NET 8 preview 1 SDK is being used for build
 - And the project warns as error `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>` 
 - And the projects have a code section that calls `ToImmutableArray()` on an array instance, for example:
 
 ```cs
public ImmutableArray<int>  Method(int [] arr)
{
    return arr.ToImmutableArray();
}
```

Then the build would fail with an error:

```log
error AD0001: Analyzer 'Microsoft.NetCore.Analyzers.ImmutableCollections.DoNotCallToImmutableCollectionOnAnImmutableCollectionValueAnalyzer' threw an exception of type 'System.InvalidCastException' with message 'Unable to cast object of type 'Microsoft.CodeAnalysis.CSharp.Symbols.PublicModel.ArrayTypeSymbol' to type 'Microsoft.CodeAnalysis.INamedTypeSymbol'.
```

**Resolution**

- The regression is [fixed](https://github.com/dotnet/roslyn-analyzers/pull/6476) in .NET 8 preview 2. Could upgrade into .NET 8 preview 2 or above
- Lower the CA2009 analyzer severity to `suggestion` or `none` : `dotnet_diagnostic.CA2009.severity = none`
- Lower the AD0001 diagnostic severity to `suggestion` or `none` : `dotnet_diagnostic.CA2009.severity = suggestion`

## .NET MAUI

For details about known issues, please refer to the individual repositories:

- [.NET MAUI](https://github.com/dotnet/maui/wiki/Known-Issues/)
- [Android](https://github.com/xamarin/xamarin-android/wiki/Known-issues-in-.NET)
- [iOS and macOS](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET8)

## Native AOT Support in .NET

For details about known issues, please reference to [the pinned issue](https://github.com/dotnet/core/issues/8288) in this repo.
