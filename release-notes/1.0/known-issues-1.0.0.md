# 1.0.0 Known Issues

This document lists known issues for *.NET Core 1.0.0* and *.NET Core SDK 1.0.0 Preview 2* which may be encountered during usage.

## .NET Core native prerequisites

See the [.NET Core prequisites document](https://github.com/dotnet/core/blob/master/Documentation/prereqs.md) to understand any installation or setup requirements for you OS which are not handled by the .NET Core 1.0.0 installers.

## NegotiateStream

```NegotiateStream``` relies on the gssapi implementation available on the platform.
* On Linux flavors, the default gssapi implementation provided is [MIT's krb5 library](http://web.mit.edu/kerberos/) which is available on all the linux platforms
* On OS X, the default implementation is heimdal-based GSS.framework

On both Linux and OS X, NegotiateStream uses SPNEGO and relies on the underlying implementation for supporting Kerberos or NTLM as the underlying security protocol.

* On OS X, Gss.framework supports SPNEGO mechanism with Kerberos and NTLM as the security protocols.
* On Linux, mit krb5 library supports SPENGO mechanism and Kerberos as the out of the box security protocol. The implementation can be made to support NTLM too by installing [GSS-NTLMSSP plugin](https://fedorahosted.org/gss-ntlmssp/) or another plugin with similar functionality. The fallback to NTLM is thus dependent on runtime availability of such a plugin.

On RHEL and CENTOS, the plugin GSS-NTLMSSP is available from the package managers. The same is also available on Ubuntu 16. It can be installed on the other flavors of linux.

There's no compile time dependency on this plugin.

## NegotiateStream.Write interop issues on Linux/OS X

There are some combinations of Kerberos/NTLM, SignOnly/EncryptAndSign etc. that cause the ```gss_wrap``` call on Unix client to fail against a Windows server using ```NegotiateStream```. Here are the failing combinations of credentials and protection level passed in ```AuthenticateAsClientAsync```

On Linux:

- Kerberos creds with Sign: Server complains that signature is valid but contents not encrypted
- NTLM creds with EncrypAndSign: Server rejects signature
- NTLM creds with Sign: Server rejects signature

On OS X:

- Kerberos creds with Sign: Server complains that signature is valid but contents not encrypted
- NTLM creds with EncryptAndSign: Server complains about message format
- NTLM creds with Sign: gss_wrap fails on client side

The fix has been pushed to MIT Kerberos source <https://github.com/krb5/krb5/pull/436> which will make the fix available for all unix platforms, starting krb5-1.15. Red Hat reports the fix will be backported to RHEL 7.

<https://github.com/dotnet/corefx/issues/6767>

### Socket.Connect and ConnectAsync instance methods support only one IPAddress

The Socket class provides instance and extension Connect and ConnectAsync methods, each with multiple overloads.  Some of these overloads take an IPAddress, some take an array of IPAddresses, some take a string host name, and others take an EndPoint.  On Linux and on OS X, only some of these methods are functional in this release, due to the capabilities of the underlying platform.  Specifically, any of these overloads that may need to work with multiple addresses will throw a PlatformNotSupportedException; that includes not only the overloads that take an array of IPAddress instances, but also the overloads that take a string host, as well as the overloads that take an EndPoint if a DnsEndPoint is supplied (when the DNS lookup is performed, the host name may end up mapping to multiple addresses).

As a workaround, a new Socket instance may be created for each address to be tried, e.g.
```C#
public static class SocketUtilities
{
    public static async Task<Socket> ConnectAsync(string host, int port)
    {
        IPAddress[] addresses = await Dns.GetHostAddressesAsync(host).ConfigureAwait(false);
        return await ConnectAsync(addresses, port).ConfigureAwait(false);
    }

    public static async Task<Socket> ConnectAsync(IPAddress[] addresses, int port)
    {
        ExceptionDispatchInfo lastException = null;
        foreach (IPAddress address in addresses)
        {
            var socket = new Socket(address.AddressFamily, SocketType.Stream, ProtocolType.Tcp);
            try
            {
                await socket.ConnectAsync(address, port).ConfigureAwait(false);
                return socket;
            }
            catch (Exception exc)
            {
                socket.Dispose();
                lastException = ExceptionDispatchInfo.Capture(exc);
            }
        }

        lastException?.Throw();
        throw new ArgumentOutOfRangeException(nameof(addresses));
    }
}
```

<https://github.com/dotnet/corefx/issues/9235>

## HttpClient handler header parsing strictness on Linux and OS X

HttpClient response header parsing logic on Linux and on OS X fairly strictly follows the RFC.  Certain "invalid" headers, such as with spaces between the header name and the colon, might be accepted by other browsers or even by HttpClient on Windows, but could be rejected when run on Linux or on OS X.

<https://github.com/dotnet/corefx/issues/9240>

## NTFS and FAT not supported on unix

Adding certs to an X509Store fails when the current user's home directory is an NTFS volume on unix.

The user's home directory (or, the directory referenced by $HOME) must be on a standard filesystem (such as ext4) supporting chmod.

## OS X has an external dependency on OpenSSL

.NET Core uses OpenSSL as the provider for cryptographic primitives and the SSL/TLS protocol. While there is a pre-installed version of OpenSSL on OS X 10.11, that version is no longer supported, and is not used by .NET Core.  In order to satisfy the OpenSSL dependency, `libcrypto.1.0.0.dylib` and `libssl.1.0.0.dylib` must be loadable via rpath probing.  One such way of satisfying this requirement is via Homebrew:

```bash
brew install openssl

# without this next step Homebrew will not register a symlink in a standard rpath location,
# so .NET Core will still be unable to find the installed libraries.
brew link --force openssl
```

When this dependency is not met, an application making direct or indirect use of cryptography will get an exception similar to
`System.DllNotFoundException: Unable to load DLL 'System.Security.Cryptography.Native': The specified module could not be found.`.

### A note on producing standalone OS X applications

Since .NET Core loads libcrypto and libssl via rpath probing these libraries can be copied into the working directory of an application before being copied to another machine.  But when trying to use this configuration users should be advised that the Homebrew version of libssl has an absolute path dependency on libcrypto.  The local copy of libssl may need to be modified to search for libcrypto via rpath with the install_name_tool utility.

<https://github.com/dotnet/corefx/issues/9171>


## Debian users may experience unexpected failure when using SSL/TLS

When new Root Certificate Authorities are being created it is not uncommon for the new CA public key to be "cross certified" by an existing Certificate Authority to boostrap the trust relationship into existing environments. For example, the "Baltimore CyberTrust Root" CA was cross-certified by the existing "GTE CyberTrust Global Root" CA. This process is usually considered to make clients more accepting.

Metadata from the server can cause OpenSSL 1.0.1 to consider the cross-certified certificate chain without considering the direct-root chain. Combined with Debian's removal of some older trusted Root Certificate Authorities in the 20141019+deb8u1 version of the ca-certificates package, these certificate chains will be incomplete (and therefore untrusted).

Microsoft has no specific guidance to offer users affected by this configuration state. This is currently tracked as [bug 812488 in the Debian bug system](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=812488).

<https://github.com/dotnet/corefx/issues/9244>

## HttpClient.GetAsync

HttpClient.GetAsync throws an exception, if server response has more than one "WWW-Authenticate: Basic" header with different realm. The following sample illustrates the error.

```csharp
var handler = new HttpClientHandler();
handler.UseDefaultCredentials = false;
handler.Credentials = System.Net.CredentialCache.DefaultCredentials;

handler.AllowAutoRedirect = true;

using (var client = new HttpClient(handler))
{
        client.BaseAddress = new Uri("type you server URI here");
        HttpResponseMessage response = await client.GetAsync("api/values");
}
```

<https://github.com/dotnet/corefx/issues/9124>

## uCRT dependency on Windows

With 1.0 of .NET Core, all applications that target .NET Core and run on Windows have a Universal CRT (UCRT) dependency. This dependency is needed on all non-Windows 10 editions. This especially impacts the self-contained applications, as it means that the machine that they are to be run on needs to have UCRT installed.

If the dependency is not present, applications will fail to run and errors will be thrown.
The UCRT dependency can be installed via Windows Update and as a recommended update it will be installed automatically if the user left the default settings for Windows Update operational.

<https://github.com/dotnet/corefx/issues/9389>

## ULIMIT on OS X

When an app exceeds ULIMIT on OS X and throws an exception, the user will get a bogus error from the CLR instead of a good call stack for the real exception. The workaround is to manually increase ULIMIT.

<https://github.com/dotnet/coreclr/issues/5782>

## Unexpected OutOfMemoryException on unix

App on unix can throw OutOfMemoryException when there is still enough memory available in case the number of memory mappings it has made exceeds the `/proc/sys/vm/max_map_count`.

Set the `/proc/sys/vm/max_map_count` to a larger value for applications that experience that problem or are expected to create a large number of mappings. One source of such mappings is excessive usage of `System.Reflection.Emit.AssemblyBuilder.DefineDynamicAssembly` with the access parameter set to `AssemblyBuilderAccess.Run`.

## Lazily binding an assembly from Resolving event for static load can result in a crash

If an app has a static assembly reference to an assembly that is missing (which is not the normal case since .NET Core app have their dependencies complete) OR attempts to do Assembly.Load against an assembly that is missing AND has wired up to the Resolving event to load the assemblies from custom locations, then the event will not return a valid reference and could result in a crash.

The workaround to address the above problem is one of the following:

Load the assembly using `LoadFromAssemblyName` instead of Assembly.Load, OR
Create a custom `AssemblyLoadContext` and override its Load method to resolve the assembly.

<https://github.com/dotnet/coreclr/issues/5837#issuecomment-226657996>

## global.json needs to be in UTF-8

If global.json file has an UTF-16 BOM, dotnet commands will fail due to not supporting UTF-16 BOM with the error:

```
A JSON parsing exception occurred: * Line 1, Column 2 Syntax error: Malformed token
```

This situation may arise if using tools that by default produce UTF-16 files with the BOM, such as PowerShell's Out-File cmdlet.

**The workaround** is to either remove the BOM or change it to UTF-8 BOM, as these are the currently supported. Visual Studio by default uses UTF-8. If you are using PowerShell, you can specify the encoding for the Out-File cmdlet with the -Encoding argument, `Out-File -Encoding utf8`.

<https://github.com/dotnet/core-setup/issues/185>
<https://github.com/dotnet/cli/issues/2159>

## dotnet restore can fail on Fedora 23 with NSS 3.24 installed with timeouts and SSL connection errors

At this time, the workaround is to downgrade NSS.

```
sudo dnf downgrade nspr nss-util nss-softokn-freebl nss-softokn nss-sysinit nss nss-tools
```

<https://github.com/dotnet/cli/issues/3676>


## Line numbers missing from exception call stack on Windows 7

When an exception goes unhandled, the exception call stack doesn't include the source line numbers.  On the other hand, the source line numbers are included when Exception.ToString() or Exception.StackTrace is called on an exception object.

```csharp
// Catch the exception and call Exception.ToString() on it, e.g.

try
{
    throw new Exception();
}
catch (Exception ex)
{
    Console.WriteLine(ex.ToString());
}
```

<https://github.com/dotnet/coreclr/issues/5828>

## Nano Server TP5

When working on TP5 of Nano server, users will encounter the following error if they try to run either portable or self-contained application:

```
Failed to load the dll from [C:\hwapp_s\bin\Debug\netcoreapp1.0\win10-x64\hostpolicy.dll], HRESULT: 0x8007007E
An error occurred while loading required library hostpolicy.dll from [C:\hwapp_s\bin\Debug\netcoreapp1.0\win10-x64]
```

If you’re using Nano Server Technical Preview 5 with .NET Core CLI, due to a bug in the product, you will need to copy binaries from `c:\windows\system32\forwarders`. The destination depends on the type of deployment that you are choosing for your application.

For portable applications, the forwarders need to be copied to the shared runtime location. The shared runtime can be found wherever you installed .NET Core 1.0.0 (by default, it is `C:\Program Files\dotnet`) under the following path: `shared\Microsoft.NETCore.App\<version>\`.

For self-contained applications, the forwarders need to be copied over into the application folder, that is, whereever you put the published output.

This process will ensure that that the dotnet host finds the appropriate APIs it needs. If your Nano Server Technical Preview 5 build is updated or serviced, please make sure to repeat this process, in case any of the DLLs have been updated as well.

## Windows 7

**Issue:**
Some libraries that Pinvoke into api-set's and target .NET Framework in our nuget packages might fail to run on Windows 7.

**Workarounds:**
Some of the api-sets are installed by the UCRT update: <https://support.microsoft.com/en-us/kb/2999226>
and <https://support.microsoft.com/en-us/kb/2790113> but these installations may not be a comprehensive fix.

- If you're using project.json you can just reference the Microsoft.NETCore.Windows.ApiSets package from your app and be sure to deploy for runtime win7-x86 or win7-x64, as appropriate.

- If you're using packages.config you'll need to manually download and extract the packages, as appropriate for the bitness of your app:
[runtime.win7-x64.Microsoft.NETCore.Windows.ApiSets](https://dotnet.myget.org/F/dotnet-core/api/v2/package/runtime.win7-x64.Microsoft.NETCore.Windows.ApiSets/1.0.1)
[runtime.win7-x86.Microsoft.NETCore.Windows.ApiSets](https://dotnet.myget.org/F/dotnet-core/api/v2/package/runtime.win7-x86.Microsoft.NETCore.Windows.ApiSets/1.0.1)

## UCRT Dependency on Windows 7 and System.IO.Compression

With 1.0 of .NET Core, all applications that target .NET Core and run on Windows have a [Universal CRT (UCRT)](https://blogs.msdn.microsoft.com/vcblog/2015/03/03/introducing-the-universal-crt/) dependency. This dependency is needed on all non-Windows 10 editions. This especially impacts the [self-contained](https://dotnet.github.io/docs/core-concepts/app-types.html) applications, as it means that the machine that they are to be run on needs to have UCRT installed.

If the dependency is not present, applications will fail to run and errors will be thrown. The error will be:

> The program can't start because api-ms-win-crt-runtime-1-1-0.dll is missing from your computer. Try reinstalling the program to fix this problem.

The UCRT dependency can be installed via Windows Update (name: "Update for Universal C Runtime in Windows" as according to <https://support.microsoft.com/en-us/kb/2999226>) and as a recommended update it will be installed automatically if the user left the default settings for Windows Update operational. It can also be downloaded from [Microsoft Download Center](https://www.microsoft.com/en-us/download/details.aspx?id=48234).

<https://github.com/dotnet/corefx/issues/9083>

## Bash on Ubuntu on Windows

[Bash on Windows (WSL)](https://msdn.microsoft.com/en-us/commandline/wsl/about) is not yet supported by .NET Core. Attempting to run applications in the environment can experience interittent crashes.

<https://github.com/Microsoft/BashOnWindows/issues/520>


