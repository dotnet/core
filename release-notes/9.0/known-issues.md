# .NET 9 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET WPF

### 1. Usage of incorrect types as DynamicResource
In earlier previews (or .NET 8 and before), applications that attempted to use a `DynamicResource` with incorrect types, and referenced the same from a library, would silently fail by swallowing the exception. However, with the introduction of DynamicResource optimization [here](https://github.com/dotnet/wpf/pull/5610), this behavior has changed.
The same implementation will now result in a `XamlParseException` being thrown, potentially causing the application to crash.

The crash might look something like this:
```cs
PresentationFramework.dll!System.Windows.Markup.XamlReader.RewrapException(System.Exception e, System.Xaml.IXamlLineInfo lineInfo, System.Uri baseUri)
PresentationFramework.dll!System.Windows.Markup.WpfXamlLoader.Load(System.Xaml.XamlReader xamlReader, System.Xaml.IXamlObjectWriterFactory writerFactory, bool skipJournaledProperties, object rootObject, System.Xaml.XamlObjectWriterSettings settings, System.Uri baseUri)
PresentationFramework.dll!System.Windows.Markup.WpfXamlLoader.LoadBaml(System.Xaml.XamlReader xamlReader, bool skipJournaledProperties, object rootObject, System.Xaml.Permissions.XamlAccessLevel accessLevel, System.Uri baseUri)
PresentationFramework.dll!System.Windows.Markup.XamlReader.LoadBaml(System.IO.Stream stream, System.Windows.Markup.ParserContext parserContext, object parent, bool closeStream)
PresentationFramework.dll!System.Windows.Application.LoadComponent(object component, System.Uri resourceLocator)
```

### Mitigation
Developers can prevent this crash by updating the resource with the correct value types. However, for those who need to maintain the previous behavior, an **opt-out switch** is being provided in the .NET 9 RC1 release. This switch allows applications to revert to the unoptimized `DynamicResource` usage.


### 2. Incorrect rendering of applications launched with dark theme
Applications using library-based themes might encounter incorrect rendering of the dark theme due to the implementation of the `Fluent` theme. This could result in incorrect resource settings for windows, such as background and accent colors, which may appear transparent.

### Available Workaround
This issue occurs only when starting the application with the dark theme enabled. To ensure correct rendering, the resources can be reloaded. This reloading process can be implemented by hooking into a window event, such as `ContentRendered`.

The implementation for the same would look something like this -
```cs
private void ReactiveWindow_ContentRendered(object sender, System.EventArgs e)
{
    var x = Application.Current.Resources;

    Application.Current.Resources = null;

    Application.Current.Resources = x;
}
```

The behavior will be **fixed in .NET 9 RC1** release.

## .NET SDK

### .NET SDK 9.0.100-RC.1 will fail when used with Visual Studio 17.11

There is an incompatible dependency between a file referenced in the SDK and the dependencies that Visual Studio includes.

```terminal
NETSDK1060 Error reading assets file: Error loading lock file '...\obj\project.assets.json' : Could not load file or assembly 'System.Text.Json, Version=8.0.0.4, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51' or one of its dependencies. The system cannot find the file specified.
```

To target .NET 9 from Visual Studio, .NET SDK requires the use of Visual Studio 17.12 Preview 2.0 or higher.

An **upcoming Visual Studio 17.11.x** release will restore support for targeting .NET 8 and lower using .NET SDK 9.0.100. A [workaround that can be temporarily checked into affected repositories](https://github.com/dotnet/sdk/issues/43339#issuecomment-2344233994) is available.

## Certificate Issues on macOS 15 ("Sequoia")

### Summary

The `CopyWithPrivateKey` methods that combine a certificate with its associated private key fail on macOS 15 when using in-memory (ephemeral) keys.  This failure is most commonly seen when creating new certificates via `CertificateRequest.CreateSelfSigned` or when loading a certificate and key from a PEM file (or files) with `X509Certificate2.CreateFromPem`, which utilize the affected methods.

Callers of these methods on macOS 15 ("Sequoia") will receive a `CryptographicException`, specifically `Interop+AppleCrypto+AppleCommonCryptoCryptographicException: The specified item is no longer valid. It may have been deleted from the keychain.`  The `dotnet dev-certs https` command relies on `CertificateRequest.CreateSelfSigned` and fails with this error.

## Certificate Issues on macOS 15 ("Sequoia")

### Summary

The `CopyWithPrivateKey` methods that combine a certificate with its associated private key fail on macOS 15 when using in-memory (ephemeral) keys.  This failure is most commonly seen when creating new certificates via `CertificateRequest.CreateSelfSigned` or when loading a certificate and key from a PEM file (or files) with `X509Certificate2.CreateFromPem`, which utilize the affected methods.

Callers of these methods on macOS 15 ("Sequoia") will receive a `CryptographicException`, specifically `Interop+AppleCrypto+AppleCommonCryptoCryptographicException: The specified item is no longer valid. It may have been deleted from the keychain.`  The `dotnet dev-certs https` command relies on `CertificateRequest.CreateSelfSigned` and fails with this error.

This issue is addressed in the upcoming .NET 9.0.0-rc2 release, scheduled for release in October 2024.

### Root Cause

macOS 15 uses a different status code to indicate a key is not in a Keychain than prior versions do.

### Workarounds

If you have not already upgraded to macOS 15 from a prior version and use .NET, you are not impacted by this issue.  If you are planning to upgrade to macOS 15, the workaround is to upgrade to .NET 9.0.0-rc2 (scheduled for October 2024) prior to upgrading to macOS 15.

Loading a certificate and its associated private key from a PKCS#12/PFX are not affected.  If you are using an application that supports loading a certificate (and associated private key) by either PFX or PEM, converting your PEM contents to PFX - and updating configuration appropriately - may unblock you.
