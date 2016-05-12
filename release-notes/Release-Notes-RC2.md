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

* Performance and Reliability improvements

### JIT

* Port of all JIT changes made for .NET Framework 4.6.1
* SIMD code generation for System.Numerics on all platforms
* Code quality improvements

### BCL

New .NET Core APIs

* System.Drawing
* System.IO.BufferedStream
* System.IO.Packaging

APIs added in RC2 to existing classes and namespaces

* System.Console
* System.Diagnostics.ProcessStartInfo
* System.Environment
* System.Linq
* System.Reflection (this deserves attention)
* System.Runtime.InteropServices
* System.Runtime.InteropServices.RuntimeInformation
* System.Security.Cryptography
    * Aes, HMACMD5, HMACSHA1, HMACSHA256, HMACSHA384, HMACSHA512, RSA, RSACryptoServiceProvider
* System.Security.Principal,
* System.Security.WindowsPrincipal
* System.ServiceModel (related to HTTPS)

### Network

New for RC2

* System.Net.NetworkInformation
* System.Net.Security.AuthenticatedStream
* System.Net.Security.NegotiateStream
* System.Net.Sockets.NetworkStream

Additions to existing classes

* System.Net.Sockets

### Data

* System.Data ** (ping Saurabh Singh <sausing@microsoft.com> - this deserves its own blog post / blog section covering all the changes as a result of community feedback) **
* SqlBulkCopy was added to System.Data.SqlClient for bulk operations.
* Community ask: Interfaces from .Net Desktop were re-introduced to RC2 to allow backward compatibility.
* Community ask: Addition of API to DbDataReader to retrieve the Schema information for the tables being queried. This effort was requested by the community to substitute the GetSchemaTable API which was removed due to absence of DataTable
* MARS support enabled

### List of closed issues

The lists of issues closed for this and past releases can be found here:

* [CLR issues](https://github.com/dotnet/coreclr/issues?q=is%3Aissue+no%3Amilestone+is%3Aclosed)
* [BCL issues](https://github.com/dotnet/corefx/issues?q=is%3Aissue+no%3Amilestone+is%3Aclosed)

### List of commits for RC2

The lists of commits for this release can be viewed here:

* [CLR commits](https://github.com/dotnet/coreclr/commits/release/1.0.0-rc2)
* [BCL commits](https://github.com/dotnet/corefx/commits/release/1.0.0-rc2)