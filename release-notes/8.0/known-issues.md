# .NET 8 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET SDK

### [8.0.4xx] `dotnet workload restore` with a workload set configured in the global.json will not work

8.0.4xx doesn't support restoring a workload set listed in a global.json file. See the [documentation](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-workload-sets#use-globaljson-for-the-workload-set-version) for more details on the scenario of pinning a workload version.

**Error**
`Unhandled exception: Microsoft.Build.Exceptions.InvalidProjectFileException: SDK Resolver Failure: "The SDK resolver "Microsoft.DotNet.MSBuildWorkloadSdkResolver" failed while attempting to resolve the SDK "Microsoft.NET.SDK.WorkloadAutoImportPropsLocator".
Exception: "System.IO.FileNotFoundException: Workload version 8.0.401, which was specified in <path>\global.json, was not found. Run "dotnet workload restore" to install this workload version.`

**Workaround**
Run `dotnet workload update` first to get the workload set installed and then run `dotnet workload restore` after to install the required workloads.

## Certificate Issues on macOS 15 ("Sequoia")

### Summary

The `CopyWithPrivateKey` methods that combine a certificate with its associated private key fail on macOS 15 when using in-memory (ephemeral) keys.  This failure is most commonly seen when creating new certificates via `CertificateRequest.CreateSelfSigned` or when loading a certificate and key from a PEM file (or files) with `X509Certificate2.CreateFromPem`, which utilize the affected methods.

Callers of these methods on macOS 15 ("Sequoia") will receive a `CryptographicException`, specifically `Interop+AppleCrypto+AppleCommonCryptoCryptographicException: The specified item is no longer valid. It may have been deleted from the keychain.`  The `dotnet dev-certs https` command relies on `CertificateRequest.CreateSelfSigned` and fails with this error.

This issue is addressed in the upcoming .NET 8.0.10 release, scheduled for release in October 2024.

### Root Cause

macOS 15 uses a different status code to indicate a key is not in a Keychain than prior versions do.

### Workarounds

If you have not already upgraded to macOS 15 from a prior version and use .NET, you are not impacted by this issue.  If you are planning to upgrade to macOS 15, the workaround is to upgrade to .NET 8.0.10 (scheduled for October 2024) prior to upgrading to macOS 15.

Loading a certificate and its associated private key from a PKCS#12/PFX are not affected.  If you are using an application that supports loading a certificate (and associated private key) by either PFX or PEM, converting your PEM contents to PFX - and updating configuration appropriately - may unblock you.
