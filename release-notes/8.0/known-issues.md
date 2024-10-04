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

## Windows SDK projections

If you target the Windows 10 OS version target framework (i.e. `net8.0-windows10.0.22000.0`) and run into one of the below compiler errors, **see the [CsWinRT issue](https://github.com/microsoft/CsWinRT/issues/1809) for how to get the fix**. The fix will be available by default in an upcoming .NET SDK update.

### 1. Partial type nested within a non-partial type

If you have a type marked `partial` implementing WinRT mapped interfaces nested within a type that isn't marked `partial`, you may see the below compiler error instead of a diagnostic message with a code fix indicating that the outer type needs to be made `partial`.

```
CS0260 Missing partial modifier on declaration of type '..'; another partial declaration of this type exists
```

### 2. Special characters in assembly name (dashes)

If you have certain special characters in your assembly name (i.e. `-`) and you have WinRT generic instantiation scenarios, you may notice the generated code doesn't compile due to the source generator fails to escape all possible special characters not allowed in identifiers.

```
WinRT.SourceGenerator\Generator.WinRTAotSourceGenerator\WinRTGenericInstantiation.g.cs
WinRT.SourceGenerator\Generator.WinRTAotSourceGenerator\WinRTGlobalVtableLookup.g.cs

error CS0116: A namespace cannot directly contain members such as fields, methods or statements
error CS1514: { expected
error CS1022: Type or namespace definition, or end-of-file expected
error CS0118: 'WinRT.Text' is a namespace but is used like a variable
error CS0103: The name 'GenericHelpers' does not exist in the current context
```