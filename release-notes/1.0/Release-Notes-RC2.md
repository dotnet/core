# Release Notes

## RC2 released 5/16/2016

Details on this release can be read about on
[the .NET Blog](https://devblogs.microsoft.com/dotnet/announcing-net-core-rc2/) and if you haven't already discovered the updated [.NET Portal](https://go.microsoft.com/fwlink/?LinkID=798306), make that your next destination for getting started with .NET Core.

Before installing RC2, please have a look at the [RC1 to RC2 Upgrade Roadmap](RC1-RC2_Upgrade.md). All previous versions of .NET Core and any tooling **must be** removed from the machine in order to properly install and use RC2 release.

There are a few issues to be aware of, which are described in the [.NET Core Known Issues](Known-Issues-RC2.md) document.

### RC2 Platform Support

* Red Hat Enterprise Linux 7.2
* Debian 8.2+
* Ubuntu 14.04 (16.04 support is coming in RTM)
* Mac OS X 10.11
* CentOS 7.1+
* Windows 7+ / Server 2012 R2+
* Windows Nano Server TP5

A little style note for the rest of this document - any references to 'Unix' encompasses Linux distros detailed above and OS X.

### Dependencies

| Library             | Function                                                         | Mode          |Debian/Ubuntu  | CentOS/RHEL   | OS X                  |
| ------------------- | ---------------------------------------------------------------- | ------------- | ------------- | ------------- | --------------------- |
| libc, librt         | I/O, process management, time, etc.                              | Runtime       | glibc         | glibc         | Part of OS            |
| libunwind           | call chain determination for exception handling and stack traces | Runtime       | libunwind8    | libunwind     | Part of OS            |
| gettext             | resource strings                                                 | Development   | gettext       | gettext       | n/a                   |
| libicu              | globalization                                                    | Runtime       | libicu52      | libicu        | Part of OS            |
| libuuid             | guid generation                                                  | Runtime       | libuuid1      | libuuid       | Part of OS            |
| libcurl             | HTTP                                                             | Runtime       | libcurl3      | libcurl       | Part of OS            |
| libssl & libcrypto  | cryptography                                                     | Runtime       | libssl1.0.0   | openssl-libs  | Openssl from homebrew |
| libz                | deflate and gzip                                                 | Runtime       | zlib1g        |zlib           | Part of OS            |
| liblttng            | runtime tracing                                                  | Diagnostic    | liblttng-ust0 | liblttng-ust0 | n/a                   |

### Introduction of .NET Core API Documentation

* API: https://learn.microsoft.com/dotnet/api/
* Conceptual: https://learn.microsoft.com/dotnet/

### Runtime

Most of the Runtime work since RC1 has been focused on performance and reliability improvements. A few highlights include:

* [Runtime Configuration](https://github.com/dotnet/cli/blob/rel/1.0.0/Documentation/specs/runtime-configuration-file.md) enhancements
* Server GC on Unix platforms

### JIT

* Port of all JIT changes made for .NET Framework 4.6.1
* SIMD code generation for System.Numerics on all platforms
* Code quality improvements

### BCL

Below is a summary of API changes made since RC1. A complete and detailed listing of API changes can be seen in the [RC1 to RC2 API Diff](RC1-RC2_API_diff.md).

New .NET Core APIs

* System.Drawing
* System.IO.BufferedStream
* System.IO.Packaging

APIs added in RC2 to existing classes and namespaces

* System.Console
* System.Diagnostics.ProcessStartInfo
* System.Environment
* System.Linq
* System.Reflection
* System.Runtime.InteropServices
* System.Runtime.InteropServices.RuntimeInformation
* System.Security.Cryptography (additional Crypto details in the next section)
* System.Security.Principal
* System.Security.WindowsPrincipal
* System.ServiceModel

### Cryptography

* RSA.Create() was added to support platform-agnostic operations
* TripleDES (3DES) was added (it existed, but threw NotImplementedException, in RC1)
* Reference Assemblies: HMACMD5 was missing in RC1, added it
* Reference Assemblies: Refactored ECDSA into a higher version to allow net46-compatible references for all cryptography packages
* Unix: X509Chain.ChainStatus and X509Chain.ChainElementStatus now report all chain errors, not just the first one
* Unix: Finish X509Certificates support
    * Implement GetCertContentType
    * Constructors and properties for all X509Extension classes behave as on Windows
    * Add support for X509ContentType.Pkcs7 for X509Certificate2Collection.Export
    * Add support for X509Chain.ChainPolicy.VerificationFlags for error suppression
    * Breaking change: X509Certificate2.FriendlyName and X509Certificate2.Archived setters throw PlatformNotSupportedException
* Unix: The CA cert bundle read into the machine Root CA store now also supports the one unified file format
* Unix: Default RSA keysize is 2048. This matches Windows .NET Core, but not Windows .NET Framework (1024-bit default)
* OS X: Minimum version of OpenSSL bumped from 0.9.8 to the 1.0.0 family
    * The on-box libcrypto.0.9.8.dylib has gone out of security-fix support, libcrypto.1.0.0.dylib must be installed via homebrew
* Windows: An ECDSA PFX created with OpenSSL can now be successfully used
* Windows: RSA public and private keys with unusual sizes (e.g. 1032-bit) work now

### Serialization

* ISerializatonSurrogateProvider interface now supports applications or libraries that target for either full .NET Framework or .NET Core to use data contract surrogate in DataContractSerializer.
* DataContractJsonSerializer improved compliance with ECMAScript 6 standard in serializing control characters including 0x0008 (BACKSPACE), 0x000C (FORM FEED), 0x000A (LINE FEED), 0x000D (CARRIAGE RETURN), and 0x0009 (HORIZONTAL TABULATION).

### Network

* Implemented Async pattern for WinHttpHandler
* Bug fixes and Stabilization

New for RC2

* System.Net.NetworkInformation
* System.Net.Security.AuthenticatedStream
* System.Net.Security.NegotiateStream
* System.Net.Sockets.NetworkStream

Additions to existing classes

* System.Net.Sockets
* Unix: SslStream host matching supports IDNA
* Unix: SslStream supports client authentication certificates

### Data

* SqlBulkCopy was added to System.Data.SqlClient for bulk operations.
* Community ask: Interfaces from .Net Desktop were re-introduced to RC2 to allow backward compatibility.
* Community ask: Addition of API to DbDataReader to retrieve the Schema information for the tables being queried. This effort was requested by the community to substitute the GetSchemaTable API which was removed due to absence of DataTable
* MARS support enabled

### WCF

Details on work the WCF team has done for RC2 can be found in the [WCF Release Notes](https://github.com/dotnet/wcf/releases/tag/v1.0.0-rc2).

## Closed issues

The lists of issues closed for this and past releases can be found here:

* [CLR issues](https://github.com/dotnet/coreclr/issues?q=is%3Aissue+no%3Amilestone+is%3Aclosed)
* [BCL issues](https://github.com/dotnet/corefx/issues?q=is%3Aissue+no%3Amilestone+is%3Aclosed)

## Commits for RC2

The lists of commits for this release can be viewed here:

* [CLR commits](https://github.com/dotnet/coreclr/commits/v1.0.0-rc2)
* [BCL commits](https://github.com/dotnet/corefx/commits/release/1.0.0-rc2)
