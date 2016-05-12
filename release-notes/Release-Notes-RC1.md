# Release Notes

## RC1 released 11/18/2015

Full details on this release can be read about in this blog post:
[Announcing .NET Core and ASP.NET 5 RC](http://aka.ms/netcorerc)

Supported platforms for this release are Ubuntu 14.04 LTS, OS X 10.10, and Windows 7+.

### Dependencies
.NET Core RC1 on Linux and OSX take dependencies on the following libraries:
* libc, librt: I/O, process management, time, etc.
* libunwind: call chain determination for exception handling and stack traces
* gettext: resource strings
* libicu: globalization
* liblttng: runtime tracing
* libuuid: guid generation
* libcurl: HTTP
* libssl & libcrypto: cryptography
* libz: deflate and gzip
* procfs & Core Foundation / Services: process and networking information on Linux and OSX

### Compilation
* Support csc compiler on .NET Core on Linux and OSX
* Support vbc compiler on .NET Core on Linux and OSX

### Runtime
* GC/thread suspension for Linux and OSX
* Integration of exception handling with debugger and crash dumps
* Support for LLDB and SOS on Linux
* RyuJIT ported to Linux and OSX, including JIT and crossgen
* RyuJIT implements calling convention for structs passing on Linux and OSX
* Runtime performance improvements
* Native eventing support via LTTNG for Linux
* Added 2800 Windows tests

### BCL
* More complete `System.Globalization` support on Linux and OSX
* IDNA2008 support for internationalized domain names
* X509 certificate support
* `System.Security.Cryptography.EcDSA` class is supported on all platforms
* CryptographicException contains both the numeric code (via the HResult property) and
  the message instead of the code only on Windows and the message only on Unix
* System.IO 260 character (MAX_PATH) length limit removed on all OS (.NET Core only)
  
### Network
* `System.Net.Http`, `System.Net.Primitives`, `System.Net.NameResolution`, and
  `System.Net.Sockets` implement most features
* `System.Net.Sockets` has new Task Parallel Library methods, and removed Begin/End pattern
  methods for consistency with other .NET Core APIs
* `System.Net.Http.WinHttpHandler` updated to be fully asynchronous and scalable
* `System.Net.NetworkInformation` available on all platforms
* Basic support for `System.Net.Security.SslStream`: `SslStream` is enabled for Unix;
  `AuthenticateAsServer` works with an RSA certificate, and `AuthenticateAsClient` works
  without requiring a client authentication certificate
* `System.Net.Security.SslStream` supports ECDSA certificates, and IP address `SubjectAltNames`
  are supported for host matching

### Data
* `System.Data.SqlClient` available on all platforms (MARS not yet supported)

### List of issues closed
The lists of issues closed for this and past releases can be found here:
* [CLR issues](https://github.com/dotnet/coreclr/issues?q=is%3Aissue+no%3Amilestone+is%3Aclosed)
* [BCL issues](https://github.com/dotnet/corefx/issues?q=is%3Aissue+no%3Amilestone+is%3Aclosed)

### List of commits
The lists of commits for this release can be viewed here:
* [CLR commits](https://github.com/dotnet/coreclr/commits/release/1.0.0-rc1)
* [BCL commits](https://github.com/dotnet/corefx/commits/release/1.0.0-rc1)
