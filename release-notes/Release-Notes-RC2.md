# Release Notes

## RC2 released 5/16/2016

Full details on this release can be read about in this blog post:
** [the blog title](http://someurl) **

Platform support has been expanded for RC2

* RHEL 7.2
* Debian 8.2 (8.2, 8.3, 8.4)+
* Ubuntu 14.04 (16.04 support is coming in RTM)
* OS X 10.11
* Centos 7.1
* Windows 7+ / Server 2012 R2+
* Windows Nano Server TP5

### Dependencies

** << Changes from RC1? >> **

### Introduction of .NET Core API Documentation

* API: http://dotnet.github.io/api/
* Conceptual: http://dotnet.github.io/docs

### Runtime

Most of the Runtime work since RC1 has been focused on performance and reliability improvements. A few highlights include

* [Runtime Configuration](https://github.com/dotnet/cli/blob/rel/1.0.0/Documentation/specs/runtime-configuration-file.md) enhancements
* Server GC on Linux platforms

### JIT

* Port of all JIT changes made for .NET Framework 4.6.1
* SIMD code generation for System.Numerics on all platforms
* Code quality improvements

### BCL

Below is a summary of API changes made since RC1. A complete and detailed listing of APIs changes can be seen [here](https://github.com/dotnet/core/tree/master/release-notes/RC1-RC2_API_diff.md).

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
* System.Security.Cryptography
    * Aes, HMACMD5, HMACSHA1, HMACSHA256, HMACSHA384, HMACSHA512, RSA, RSACryptoServiceProvider
* System.Security.Principal
* System.Security.WindowsPrincipal
* System.ServiceModel

### Serialization

* ISerializatonSurrogateProvider interface now supports applications or libraries that target for either full .NET Framework or .NET Core to use data contract surrogate in DataContractSerializer.
* DataContractJsonSerializer improved compliance with ECMAScript 6 standard in serializing control characters including 0x0008 (BACKSPACE), 0x000C (FORM FEED), 0x000A (LINE FEED), 0x000D (CARRIAGE RETURN), and 0x0009 (HORIZONTAL TABULATION).

Additional details can be found in the [WCF Release Notes](https://github.com/dotnet/wcf/releases/tag/v1.0.0-rc2)

### Network

New for RC2

* System.Net.NetworkInformation
* System.Net.Security.AuthenticatedStream
* System.Net.Security.NegotiateStream
* System.Net.Sockets.NetworkStream

Additions to existing classes

* System.Net.Sockets

### Data

* SqlBulkCopy was added to System.Data.SqlClient for bulk operations.
* Community ask: Interfaces from .Net Desktop were re-introduced to RC2 to allow backward compatibility.
* Community ask: Addition of API to DbDataReader to retrieve the Schema information for the tables being queried. This effort was requested by the community to substitute the GetSchemaTable API which was removed due to absence of DataTable
* MARS support enabled

### Closed issues

The lists of issues closed for this and past releases can be found here:

* [CLR issues](https://github.com/dotnet/coreclr/issues?q=is%3Aissue+no%3Amilestone+is%3Aclosed)
* [BCL issues](https://github.com/dotnet/corefx/issues?q=is%3Aissue+no%3Amilestone+is%3Aclosed)

### Commits for RC2

The lists of commits for this release can be viewed here:

* [CLR commits](https://github.com/dotnet/coreclr/commits/release/1.0.0-rc2)
* [BCL commits](https://github.com/dotnet/corefx/commits/release/1.0.0-rc2)