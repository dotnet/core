# RC2 Known Issues

This document lists known issues for *.NET Core 1.0 RC2* and *.NET Core SDK 1.0 Preview 1* which may be encountered during usage. Issues and bugs that are being considered for the final release can be seen in the following GitHub repos.

* [CoreCLR](https://github.com/dotnet/coreclr/issues?q=is%3Aopen+is%3Aissue+milestone%3A1.0.0-rtm)
* [CoreFX](https://github.com/dotnet/corefx/issues?q=is%3Aopen+is%3Aissue+milestone%3A1.0.0-rtm)
* [SDK](https://github.com/dotnet/cli/issues?q=is%3Aopen+is%3Aissue+milestone%3A1.0.0-rtm)

## .NET Core 1.0 SDK Preview 1

All previous versions of .NET Core and any tooling **must be** removed from the machine in order to properly install and use RC2 release. Details and steps to uninstall can be found on the [.NET Core Getting Started](http://go.microsoft.com/fwlink/?LinkID=798687) pages and in the [RC1 to RC2 Upgrade Roadmap](RC1-RC2_Upgrade.md).

https://github.com/dotnet/cli/issues/2833

## .NET Core RC2 Packages and UWP Projects

.NET Core 1.0 RC2 will not work in UWP projects. It is recommended that RC2 packages not be referenced.

## Crypto

Adding certificates to an X509Store on Unix systems may result in an exception similar to System.Security.Cryptography.CryptographicException : Invalid directory permissions.

The directory '/Users/dotnet-bot/.dotnet/corefx/cryptography/x509stores/my' must be readable, writable and executable by the owner. It must not be readable, writable or executable by anyone other than the owner. when the X509Store was not created with a pre-RC2 build of .NET Core, due to an incorrect permissions check on the directory. A one time (per-store) workaround is possible:

* (Optional) Create the directory ahead of program execution. The name of the directory will be the lower-cased version of the storeName parameter under `~/.dotnet/corefx/cryptography/x509stores/`.

```csharp
new X509Store(“ThisIsATest”, StoreLocation.CurrentUser)` => ~/.dotnet/corefx/cryptography/x509stores/thisisatest
```

* Make all of the directories within the x509stores directory have the right permissions: `chmod 700 ~/.dotnet/corefx/cryptography/x509stores/*`

## NegotiateStream

NegotiateStream relies on the gssapi implementation available on the platform on Red Hat Enterprise Linux and CentOS only.

NegotiateStream relies on the gssapi implementation and it uses SPNEGO via the GSS-NTLMSSP on RHEL and CentOS. For other distros individuals need to have a similar package supporting GSS-NTLMSSP to have it working.

https://github.com/dotnet/corefx/issues/8042
