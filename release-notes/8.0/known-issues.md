# .NET 8 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET SDK

### 8.0.2xx SDK is not compatible with 17.8 for some scenarios
Some analyzers and source generators that ship with the SDK took a dependency on a new version of the Roslyn compiler. In Visual Studio and msbuild.exe, .NET projects use the Roslyn version that comes with Visual Studio by default.

**Example error messages**
`Microsoft.CodeAnalysis.Razor.Compiler.SourceGenerators.dll references version '4.9.0.0' of the compiler, which is newer than the currently running version '4.8.0.0'`
`Microsoft.Codeanalysis.CodeStyle.dll references version '4.9.0.0' of the compiler, which is newer than the currently running version '4.8.0.0'`

**Workaround**
1. Use 17.10 which matches the 8.0.2xx SDK
2. Install the 8.0.1xx SDK and use global.json to pin to it if you have multiple SDKs installed
3. Set BuildWithNetFrameworkHostedCompiler=true in your build. This configures the build to use a matching version of the compiler to your SDK version rather than to your VS version so in this case, it'll use a 4.10 version of Roslyn.

## Certificate Issues on macOS 15 ("Sequoia")

### Summary

The `CopyWithPrivateKey` methods that combine a certificate with its associated private key fail on macOS 15 when using in-memory (ephemeral) keys.  This failure is most commonly seen when creating new certificates via `CertificateRequest.CreateSelfSigned` or when loading a certificate and key from a PEM file (or files) with `X509Certificate2.CreateFromPem`, which utilize the affected methods.

Callers of these methods on macOS 15 ("Sequoia") will receive a `CryptographicException`, specifically `Interop+AppleCrypto+AppleCommonCryptoCryptographicException: The specified item is no longer valid. It may have been deleted from the keychain.`  The `dotnet dev-certs https` command relies on `CertificateRequest.CreateSelfSigned` and fails with this error.

This issue is addressed in the upcoming .NET 6.0.34 release, scheduled for release in October 2024.

### Root Cause

macOS 15 uses a different status code to indicate a key is not in a Keychain than prior versions do.

### Workarounds

If you have not already upgraded to macOS 15 from a prior version and use .NET, you are not impacted by this issue.  If you are planning to upgrade to macOS 15, the workaround is to upgrade to .NET 6.0.34 (scheduled for October 2024) prior to upgrading to macOS 15.

Loading a certificate and its associated private key from a PKCS#12/PFX are not affected.  If you are using an application that supports loading a certificate (and associated private key) by either PFX or PEM, converting your PEM contents to PFX - and updating configuration appropriately - may unblock you.
