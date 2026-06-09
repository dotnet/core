# NuGet in .NET 11 Preview 5 - Release Notes

.NET 11 Preview 5 includes the following NuGet client changes:

- [`dotnet nuget why` shows requested and resolved versions](#dotnet-nuget-why-shows-requested-and-resolved-versions)
- [Deterministic pack support is restored](#deterministic-pack-support-is-restored)
- [Package verification shows revocation endpoints](#package-verification-shows-revocation-endpoints)
- [Restore warns about deprecated MonoAndroid package assets](#restore-warns-about-deprecated-monoandroid-package-assets)

## `dotnet nuget why` shows requested and resolved versions

`dotnet nuget why` now prints both the requested version range and the resolved package version for each package node in the dependency graph. Project references no longer show package-style versions, so the graph separates projects from packages more clearly ([NuGet/NuGet.Client #7344](https://github.com/NuGet/NuGet.Client/pull/7344), [NuGet/Home #13752](https://github.com/NuGet/Home/issues/13752), [NuGet/Home #14695](https://github.com/NuGet/Home/issues/14695)).

```console
> dotnet nuget why . Microsoft.Extensions.Configuration
Project 'sample' has the following dependency graph(s) for 'Microsoft.Extensions.Configuration':

  [net11.0]
  └── Microsoft.Extensions.Hosting@10.0.0 (>= 10.0.0)
      └── Microsoft.Extensions.Configuration@10.0.0 (>= 10.0.0)
```

The value after `@` is the resolved version. The value in parentheses is the requested version range.

## Deterministic pack support is restored

NuGet pack support for deterministic package creation is restored. Pack now honors `Deterministic` again and adds `DeterministicTimestamp`, so MSBuild-based pack operations can produce packages with stable package metadata across repeated builds of the same inputs ([NuGet/NuGet.Client #7020](https://github.com/NuGet/NuGet.Client/pull/7020), [NuGet/Home #8601](https://github.com/NuGet/Home/issues/8601)).

```console
> dotnet pack -p:Deterministic=true -p:DeterministicTimestamp=true
```

Both properties default to `true`. Set `DeterministicTimestamp=false` only when a package needs build-time timestamps in the generated `.nupkg`.

Thank you [@omajid](https://github.com/omajid) for this contribution!

## Package verification shows revocation endpoints

Package signature verification now prints the CRL and OCSP URLs that certificate-chain validation may contact when it checks whether a signing or timestamping certificate has been revoked. The additional output appears at normal and detailed verbosity; minimal verbosity is unchanged ([NuGet/NuGet.Client #7343](https://github.com/NuGet/NuGet.Client/pull/7343), [NuGet/Home #14780](https://github.com/NuGet/Home/issues/14780)).

```console
> dotnet nuget verify signed-package.nupkg --verbosity normal
  Issued by: CN=DigiCert Trusted G4 Code Signing RSA4096 SHA384 2021 CA1, O="DigiCert, Inc.", C=US
  CRL URL: http://crl3.digicert.com/DigiCertTrustedG4CodeSigningRSA4096SHA3842021CA1.crl
  CRL URL: http://crl4.digicert.com/DigiCertTrustedG4CodeSigningRSA4096SHA3842021CA1.crl
  OCSP URL: http://ocsp.digicert.com
```

The URLs help diagnose package verification failures in locked-down build environments where outbound certificate revocation checks are controlled by firewall or proxy policy.

## Restore warns about deprecated MonoAndroid package assets

Restore now emits `NU1703` when an Android project targeting `net11.0-android` or later resolves package assets from deprecated `MonoAndroid` folders instead of modern `net6.0-android` or later target framework folders. The check is enabled when `SdkAnalysisLevel` is `11.0.100` or later ([NuGet/NuGet.Client #7229](https://github.com/NuGet/NuGet.Client/pull/7229), [NuGet/Home #14828](https://github.com/NuGet/Home/issues/14828), [dotnet/android #11028](https://github.com/dotnet/android/issues/11028)).

```text
warning NU1703: Package 'Legacy.Android.Package' 1.2.3 uses the deprecated MonoAndroid framework instead of 'net6.0-android' or later. Consider upgrading to a newer version of this package or contacting the package author.
```

Projects that treat warnings as errors should update affected packages or contact package authors for builds that include modern Android target framework assets.

Thank you [@sbomer](https://github.com/sbomer) for this contribution!

## Bug fixes

- **NuGet Audit**
  - NuGet Audit now uses `data.nuget.org` as its audit source and fixes vulnerable-package warning coverage for the NuGet client projects ([NuGet/NuGet.Client #7300](https://github.com/NuGet/NuGet.Client/pull/7300), [NuGet/Home #14865](https://github.com/NuGet/Home/issues/14865)).
- **Restore**
  - Locked-mode restore now validates project references correctly when target aliases and `AssetTargetFallback` are involved ([NuGet/NuGet.Client #7312](https://github.com/NuGet/NuGet.Client/pull/7312), [NuGet/Home #12010](https://github.com/NuGet/Home/issues/12010)).
  - C++/CLI projects that use `AssetTargetFallback` and reference native C++ projects no longer fail restore with `NU1201` because the secondary `native` framework is preserved during project-reference compatibility checks ([NuGet/NuGet.Client #7341](https://github.com/NuGet/NuGet.Client/pull/7341), [NuGet/Home #14876](https://github.com/NuGet/Home/issues/14876)).
  - Restore now attributes invalid `TargetFramework` and package version errors to the project that contains the invalid data in both static graph and non-static graph restore ([NuGet/NuGet.Client #7342](https://github.com/NuGet/NuGet.Client/pull/7342), [NuGet/Home #12470](https://github.com/NuGet/Home/issues/12470)).
  - `NU1601` and `NU1604` warnings now respect framework aliases when multiple aliases target the same TFM ([NuGet/NuGet.Client #7348](https://github.com/NuGet/NuGet.Client/pull/7348), [NuGet/Home #14877](https://github.com/NuGet/Home/issues/14877)).
  - Static graph restore now resolves relative override paths such as `RestoreSources` from the same base path as non-static restore ([NuGet/NuGet.Client #7383](https://github.com/NuGet/NuGet.Client/pull/7383), [NuGet/Home #14904](https://github.com/NuGet/Home/issues/14904)).
  - Target framework version compatibility now distinguishes Windows OS-version TFMs such as `net10.0-windows10.0.17763.1` from the corresponding `.0` revision TFMs ([NuGet/NuGet.Client #7287](https://github.com/NuGet/NuGet.Client/pull/7287), [NuGet/Home #14859](https://github.com/NuGet/Home/issues/14859)).
- **Package pruning**
  - `NU1510` now describes explicitly referenced packages that are automatically available as package-pruning candidates instead of calling them unused ([NuGet/NuGet.Client #7380](https://github.com/NuGet/NuGet.Client/pull/7380)).

