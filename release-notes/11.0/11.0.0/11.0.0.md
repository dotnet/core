# .NET 11.0.0 - November 10, 2026

The .NET 11.0.0 release is available for download. The latest 11.0 release is always listed at [.NET 11.0 Releases](../README.md).

11.0 SDKs that include 11.0.0 runtimes:

* [11.0.100][11.0.100]

## Downloads

|           | SDK Installer                        | SDK Binaries                 | Runtime Installer                                        | Runtime Binaries                                 | ASP.NET Core Runtime           |Windows Desktop Runtime          |
| --------- | :------------------------------------------:     | :----------------------:                 | :---------------------------:                            | :-------------------------:                      | :-----------------:            | :-----------------:            |
| Windows   | [x86][dotnet-sdk-win-x86.exe] \| [x64][dotnet-sdk-win-x64.exe] \| [Arm64][dotnet-sdk-win-arm64.exe] | [x86][dotnet-sdk-win-x86.zip] \| [x64][dotnet-sdk-win-x64.zip] \|  [Arm64][dotnet-sdk-win-arm64.zip] | [x86][dotnet-runtime-win-x86.exe] \| [x64][dotnet-runtime-win-x64.exe] \| [Arm64][dotnet-runtime-win-arm64.exe] | [x86][dotnet-runtime-win-x86.zip] \| [x64][dotnet-runtime-win-x64.zip] \| [Arm64][dotnet-runtime-win-arm64.zip] | [x86][aspnetcore-runtime-win-x86.exe] \| [x64][aspnetcore-runtime-win-x64.exe] \| [Hosting Bundle][dotnet-hosting-win.exe] | [x86][windowsdesktop-runtime-win-x86.exe] \| [x64][windowsdesktop-runtime-win-x64.exe] \| [Arm64][windowsdesktop-runtime-win-arm64.exe] |
| macOS     | [x64][dotnet-sdk-osx-x64.pkg] \| [ARM64][dotnet-sdk-osx-arm64.pkg] | [x64][dotnet-sdk-osx-x64.tar.gz] \| [ARM64][dotnet-sdk-osx-arm64.tar.gz]  | [x64][dotnet-runtime-osx-x64.pkg] \| [ARM64][dotnet-runtime-osx-arm64.pkg] | [x64][dotnet-runtime-osx-x64.tar.gz] \| [ARM64][dotnet-runtime-osx-arm64.tar.gz]| [x64][aspnetcore-runtime-osx-x64.tar.gz] \| [ARM64][aspnetcore-runtime-osx-arm64.tar.gz] | - |
| Linux     |  [Snap and Package Manager](../install-linux.md)  | [x64][dotnet-sdk-linux-x64.tar.gz] \| [Arm][dotnet-sdk-linux-arm.tar.gz]  \| [Arm64][dotnet-sdk-linux-arm64.tar.gz] \| [Arm32 Alpine][dotnet-sdk-linux-musl-arm.tar.gz]  \| [x64 Alpine][dotnet-sdk-linux-musl-x64.tar.gz] | [Packages (x64)][linux-packages] | [x64][dotnet-runtime-linux-x64.tar.gz] \| [Arm][dotnet-runtime-linux-arm.tar.gz] \| [Arm64][dotnet-runtime-linux-arm64.tar.gz] \| [Arm32 Alpine][dotnet-runtime-linux-musl-arm.tar.gz] \| [Arm64 Alpine][dotnet-runtime-linux-musl-arm64.tar.gz] \| [x64 Alpine][dotnet-runtime-linux-musl-x64.tar.gz]  | [x64][aspnetcore-runtime-linux-x64.tar.gz]  \| [Arm][aspnetcore-runtime-linux-arm.tar.gz] \| [Arm64][aspnetcore-runtime-linux-arm64.tar.gz] \| [x64 Alpine][aspnetcore-runtime-linux-musl-x64.tar.gz] | - |
|  | [Checksums][checksums-sdk]                             | [Checksums][checksums-sdk]                                      | [Checksums][checksums-runtime]                             | [Checksums][checksums-runtime]  | [Checksums][checksums-runtime]  | [Checksums][checksums-runtime] |

1. Includes the .NET Runtime and ASP.NET Core Runtime
2. For hosting stand-alone apps on Windows Servers. Includes the ASP.NET Core Module for IIS and can be installed separately on servers without installing .NET Runtime.

The .NET SDK includes a matching updated .NET Runtime. Downloading the Runtime or ASP.NET Core packages is not needed when installing the SDK.

You can check your .NET SDK version by running the following command. The example version shown is for this release.

---

### .NET SDK 11.0.100

```console
$ dotnet --version
11.0.100
```

Visit [.NET Documentation](https://learn.microsoft.com/dotnet/core/) to learn about .NET, for building many different types of applications.

### Docker Images

The [.NET Docker images](https://hub.docker.com/_/microsoft-dotnet) have been updated for this release. The [.NET Docker samples](https://github.com/dotnet/dotnet-docker/blob/main/samples/README.md) show various ways to use .NET and Docker together. You can use the following command to try running the latest .NET 11 container image:

```console
docker run --rm mcr.microsoft.com/dotnet/samples
```

### Notable Changes

[.NET November 2026 Updates][dotnet-blog]

.NET 11.0.0 release carries security and non-security fixes.

* [CVE-2026-114146 | ASP.NET Core Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/504)
* [CVE-2026-109475 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/498)
* [CVE-2026-114147 | ASP.NET Core Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/504)
* [CVE-2026-105544 | .NET Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/517)
* [CVE-2026-114149 | ASP.NET Core Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/504)
* [CVE-2026-114150 | ASP.NET Core Information Disclosure Vulnerability](https://github.com/dotnet/announcements/issues/504)
* [CVE-2026-114151 | Visual Studio Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/498)
* [CVE-2026-114152 | Visual Studio Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/498)
* [CVE-2026-109476 | ASP.NET Core Information Disclosure Vulnerability](https://github.com/dotnet/announcements/issues/504)
* [CVE-2026-109481 | ASP.NET Core Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/504)
* [CVE-2026-118745 | Visual Studio Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/498)
* [CVE-2026-114155 | .NET Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/502)
* [CVE-2026-114156 | ASP.NET Core Security Feature Bypass Vulnerability](https://github.com/dotnet/announcements/issues/504)
* [CVE-2026-70175 | ASP.NET Core Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/457)
* [CVE-2026-118746 | .NET Security Feature Bypass Vulnerability](https://github.com/dotnet/announcements/issues/498)
* [CVE-2026-118747 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/498)
* [CVE-2026-114157 | ASP.NET Core Security Feature Bypass Vulnerability](https://github.com/dotnet/announcements/issues/504)
* [CVE-2026-114158 | Visual Studio Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/498)
* [CVE-2026-114159 | Visual Studio Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/498)
* [CVE-2026-118748 | ASP.NET Core Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/504)
* [CVE-2026-118749 | ASP.NET Core Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/504)
* [CVE-2026-120796 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/498)

### Visual Studio Compatibility

[Visual Studio](https://visualstudio.microsoft.com) 18.12.0 includes .NET SDK 11.0.100 and the .NET 11.0.0 runtime.

You can also use Visual Studio Code and the [C# Dev Kit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit) extension with .NET 11.

## Feedback

Your feedback is important and appreciated. Please use [dotnet/core issues](https://github.com/dotnet/core/issues) for questions and comments.

[11.0.100]: 11.0.0.md

[checksums-runtime]: https://builds.dotnet.microsoft.com/dotnet/checksums/11.0.0-sha.txt
[checksums-sdk]: https://builds.dotnet.microsoft.com/dotnet/checksums/11.0.0-sha.txt

[dotnet-blog]: https://devblogs.microsoft.com/dotnet/dotnet-and-dotnet-framework-november-2026-servicing-updates/

[linux-packages]: ../install-linux.md

## Packages updated in this release

| Package name                                | Version     |
| :------------------------------------------ | :---------: |
| AspNetCoreRuntime.11.0.x64 | 11.0.0 |
| AspNetCoreRuntime.11.0.x86 | 11.0.0 |
| dotnet-ef | 11.0.0 |
| dotnet-ilverify | 11.0.0 |
| dotnet-sql-cache | 11.0.0 |
| dotnet-suggest | 3.0.0 |
| FSharp.Compiler.Service | 43.13.101 |
| FSharp.Core | 11.0.101 |
| Microsoft.AspNetCore.App.Internal.Assets | 11.0.0 |
| Microsoft.AspNetCore.App.Ref | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.linux-arm | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.linux-arm64 | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.linux-musl-arm | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.linux-musl-arm64 | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.linux-musl-x64 | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.linux-x64 | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.osx-arm64 | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.osx-x64 | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.win-arm64 | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.win-x64 | 11.0.0 |
| Microsoft.AspNetCore.App.Runtime.win-x86 | 11.0.0 |
| Microsoft.AspNetCore.Authentication.Certificate | 11.0.0 |
| Microsoft.AspNetCore.Authentication.Facebook | 11.0.0 |
| Microsoft.AspNetCore.Authentication.Google | 11.0.0 |
| Microsoft.AspNetCore.Authentication.JwtBearer | 11.0.0 |
| Microsoft.AspNetCore.Authentication.MicrosoftAccount | 11.0.0 |
| Microsoft.AspNetCore.Authentication.Negotiate | 11.0.0 |
| Microsoft.AspNetCore.Authentication.OpenIdConnect | 11.0.0 |
| Microsoft.AspNetCore.Authentication.Twitter | 11.0.0 |
| Microsoft.AspNetCore.Authentication.WsFederation | 11.0.0 |
| Microsoft.AspNetCore.Authorization | 11.0.0 |
| Microsoft.AspNetCore.AzureAppServices.HostingStartup | 11.0.0 |
| Microsoft.AspNetCore.AzureAppServices.SiteExtension | 11.0.0 |
| Microsoft.AspNetCore.AzureAppServicesIntegration | 11.0.0 |
| Microsoft.AspNetCore.Components | 11.0.0 |
| Microsoft.AspNetCore.Components.Analyzers | 11.0.0 |
| Microsoft.AspNetCore.Components.Authorization | 11.0.0 |
| Microsoft.AspNetCore.Components.CustomElements | 11.0.0 |
| Microsoft.AspNetCore.Components.Forms | 11.0.0 |
| Microsoft.AspNetCore.Components.Gateway | 11.0.0 |
| Microsoft.AspNetCore.Components.Gateway.Cli | 11.0.0 |
| Microsoft.AspNetCore.Components.Media | 11.0.0-preview.7.26529.118 |
| Microsoft.AspNetCore.Components.QuickGrid | 11.0.0 |
| Microsoft.AspNetCore.Components.QuickGrid.EntityFrameworkAdapter | 11.0.0 |
| Microsoft.AspNetCore.Components.Server.AutoPause | 11.0.0 |
| Microsoft.AspNetCore.Components.Testing | 11.0.0-preview.7.26529.118 |
| Microsoft.AspNetCore.Components.Testing.NativeAot | 11.0.0-preview.7.26529.118 |
| Microsoft.AspNetCore.Components.Web | 11.0.0 |
| Microsoft.AspNetCore.Components.WebAssembly | 11.0.0 |
| Microsoft.AspNetCore.Components.WebAssembly.Authentication | 11.0.0 |
| Microsoft.AspNetCore.Components.WebAssembly.DevServer | 11.0.0 |
| Microsoft.AspNetCore.Components.WebAssembly.Server | 11.0.0 |
| Microsoft.AspNetCore.Components.WebView | 11.0.0 |
| Microsoft.AspNetCore.Connections.Abstractions | 11.0.0 |
| Microsoft.AspNetCore.Cryptography.Internal | 11.0.0 |
| Microsoft.AspNetCore.Cryptography.KeyDerivation | 11.0.0 |
| Microsoft.AspNetCore.DataProtection | 11.0.0 |
| Microsoft.AspNetCore.DataProtection.Abstractions | 11.0.0 |
| Microsoft.AspNetCore.DataProtection.EntityFrameworkCore | 11.0.0 |
| Microsoft.AspNetCore.DataProtection.Extensions | 11.0.0 |
| Microsoft.AspNetCore.DataProtection.MicroBenchmarks | 11.0.0 |
| Microsoft.AspNetCore.DataProtection.StackExchangeRedis | 11.0.0 |
| Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore | 11.0.0 |
| Microsoft.AspNetCore.Grpc.JsonTranscoding | 11.0.0 |
| Microsoft.AspNetCore.HeaderPropagation | 11.0.0 |
| Microsoft.AspNetCore.Hosting.WindowsServices | 11.0.0 |
| Microsoft.AspNetCore.Http.Connections.Client | 11.0.0 |
| Microsoft.AspNetCore.Http.Connections.Common | 11.0.0 |
| Microsoft.AspNetCore.Identity.EntityFrameworkCore | 11.0.0 |
| Microsoft.AspNetCore.Identity.UI | 11.0.0 |
| Microsoft.AspNetCore.JsonPatch | 11.0.0 |
| Microsoft.AspNetCore.JsonPatch.SystemTextJson | 11.0.0 |
| Microsoft.AspNetCore.Metadata | 11.0.0 |
| Microsoft.AspNetCore.MiddlewareAnalysis | 11.0.0 |
| Microsoft.AspNetCore.Mvc.NewtonsoftJson | 11.0.0 |
| Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation | 11.0.0 |
| Microsoft.AspNetCore.Mvc.Testing | 11.0.0 |
| Microsoft.AspNetCore.OpenApi | 11.0.0 |
| Microsoft.AspNetCore.OutputCaching.StackExchangeRedis | 11.0.0 |
| Microsoft.AspNetCore.Owin | 11.0.0 |
| Microsoft.AspNetCore.SignalR.Client | 11.0.0 |
| Microsoft.AspNetCore.SignalR.Client.Core | 11.0.0 |
| Microsoft.AspNetCore.SignalR.Common | 11.0.0 |
| Microsoft.AspNetCore.SignalR.Protocols.Json | 11.0.0 |
| Microsoft.AspNetCore.SignalR.Protocols.MessagePack | 11.0.0 |
| Microsoft.AspNetCore.SignalR.Protocols.NewtonsoftJson | 11.0.0 |
| Microsoft.AspNetCore.SignalR.Specification.Tests | 11.0.0 |
| Microsoft.AspNetCore.SignalR.StackExchangeRedis | 11.0.0 |
| Microsoft.AspNetCore.SpaProxy | 11.0.0 |
| Microsoft.AspNetCore.SpaServices.Extensions | 11.0.0 |
| Microsoft.AspNetCore.TestHost | 11.0.0 |
| Microsoft.AspNetCore.WebUtilities | 11.0.0 |
| Microsoft.Authentication.WebAssembly.Msal | 11.0.0 |
| Microsoft.Bcl.AsyncInterfaces | 11.0.0 |
| Microsoft.Bcl.Cryptography | 11.0.0 |
| Microsoft.Bcl.Memory | 11.0.0 |
| Microsoft.Bcl.Numerics | 11.0.0 |
| Microsoft.Bcl.TimeProvider | 11.0.0 |
| Microsoft.Build.StandardCI | 11.0.100-rtm.26529.118 |
| Microsoft.Build.Tasks.Git | 11.0.100 |
| Microsoft.CodeAnalysis.NetAnalyzers | 11.0.100 |
| Microsoft.Data.Sqlite | 11.0.0 |
| Microsoft.Data.Sqlite.Core | 11.0.0 |
| Microsoft.DiaSymReader | 3.0.0 |
| Microsoft.dotnet-openapi | 11.0.0 |
| Microsoft.DotNet.ApiCompat.Task | 11.0.100 |
| Microsoft.DotNet.ApiCompat.Tool | 11.0.100 |
| Microsoft.DotNet.Common.ItemTemplates | 11.0.100 |
| Microsoft.DotNet.Common.ProjectTemplates.11.0 | 11.0.100 |
| Microsoft.DotNet.HotReload.Watch.Aspire | 11.0.100 |
| Microsoft.DotNet.ILCompiler | 11.0.0 |
| Microsoft.DotNet.Web.Client.ItemTemplates | 11.0.0 |
| Microsoft.DotNet.Web.ItemTemplates.11.0 | 11.0.0 |
| Microsoft.DotNet.Web.ProjectTemplates.11.0 | 11.0.0 |
| Microsoft.EntityFrameworkCore | 11.0.0 |
| Microsoft.EntityFrameworkCore.Abstractions | 11.0.0 |
| Microsoft.EntityFrameworkCore.Analyzers | 11.0.0 |
| Microsoft.EntityFrameworkCore.Cosmos | 11.0.0 |
| Microsoft.EntityFrameworkCore.Design | 11.0.0 |
| Microsoft.EntityFrameworkCore.InMemory | 11.0.0 |
| Microsoft.EntityFrameworkCore.Proxies | 11.0.0 |
| Microsoft.EntityFrameworkCore.Relational | 11.0.0 |
| Microsoft.EntityFrameworkCore.Relational.Specification.Tests | 11.0.0 |
| Microsoft.EntityFrameworkCore.Specification.Tests | 11.0.0 |
| Microsoft.EntityFrameworkCore.Sqlite | 11.0.0 |
| Microsoft.EntityFrameworkCore.Sqlite.Core | 11.0.0 |
| Microsoft.EntityFrameworkCore.Sqlite.NetTopologySuite | 11.0.0 |
| Microsoft.EntityFrameworkCore.SqlServer | 11.0.0 |
| Microsoft.EntityFrameworkCore.SqlServer.Abstractions | 11.0.0 |
| Microsoft.EntityFrameworkCore.SqlServer.HierarchyId | 11.0.0 |
| Microsoft.EntityFrameworkCore.SqlServer.NetTopologySuite | 11.0.0 |
| Microsoft.EntityFrameworkCore.Tasks | 11.0.0 |
| Microsoft.EntityFrameworkCore.Templates | 11.0.0 |
| Microsoft.EntityFrameworkCore.Tools | 11.0.0 |
| Microsoft.Extensions.ApiDescription.Server | 11.0.0 |
| Microsoft.Extensions.Caching.Abstractions | 11.0.0 |
| Microsoft.Extensions.Caching.Memory | 11.0.0 |
| Microsoft.Extensions.Caching.SqlServer | 11.0.0 |
| Microsoft.Extensions.Caching.StackExchangeRedis | 11.0.0 |
| Microsoft.Extensions.Configuration | 11.0.0 |
| Microsoft.Extensions.Configuration.Abstractions | 11.0.0 |
| Microsoft.Extensions.Configuration.Binder | 11.0.0 |
| Microsoft.Extensions.Configuration.CommandLine | 11.0.0 |
| Microsoft.Extensions.Configuration.EnvironmentVariables | 11.0.0 |
| Microsoft.Extensions.Configuration.FileExtensions | 11.0.0 |
| Microsoft.Extensions.Configuration.Ini | 11.0.0 |
| Microsoft.Extensions.Configuration.Json | 11.0.0 |
| Microsoft.Extensions.Configuration.KeyPerFile | 11.0.0 |
| Microsoft.Extensions.Configuration.UserSecrets | 11.0.0 |
| Microsoft.Extensions.Configuration.Xml | 11.0.0 |
| Microsoft.Extensions.DependencyInjection | 11.0.0 |
| Microsoft.Extensions.DependencyInjection.Abstractions | 11.0.0 |
| Microsoft.Extensions.DependencyInjection.Specification.Tests | 11.0.0 |
| Microsoft.Extensions.DependencyModel | 11.0.0 |
| Microsoft.Extensions.Diagnostics | 11.0.0 |
| Microsoft.Extensions.Diagnostics.Abstractions | 11.0.0 |
| Microsoft.Extensions.Diagnostics.HealthChecks | 11.0.0 |
| Microsoft.Extensions.Diagnostics.HealthChecks.Abstractions | 11.0.0 |
| Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore | 11.0.0 |
| Microsoft.Extensions.Features | 11.0.0 |
| Microsoft.Extensions.FileProviders.Abstractions | 11.0.0 |
| Microsoft.Extensions.FileProviders.Composite | 11.0.0 |
| Microsoft.Extensions.FileProviders.Embedded | 11.0.0 |
| Microsoft.Extensions.FileProviders.Physical | 11.0.0 |
| Microsoft.Extensions.FileSystemGlobbing | 11.0.0 |
| Microsoft.Extensions.Hosting | 11.0.0 |
| Microsoft.Extensions.Hosting.Abstractions | 11.0.0 |
| Microsoft.Extensions.Hosting.Systemd | 11.0.0 |
| Microsoft.Extensions.Hosting.WindowsServices | 11.0.0 |
| Microsoft.Extensions.Http | 11.0.0 |
| Microsoft.Extensions.Http.Polly | 11.0.0 |
| Microsoft.Extensions.Identity.Core | 11.0.0 |
| Microsoft.Extensions.Identity.Stores | 11.0.0 |
| Microsoft.Extensions.Localization | 11.0.0 |
| Microsoft.Extensions.Localization.Abstractions | 11.0.0 |
| Microsoft.Extensions.Logging | 11.0.0 |
| Microsoft.Extensions.Logging.Abstractions | 11.0.0 |
| Microsoft.Extensions.Logging.AzureAppServices | 11.0.0 |
| Microsoft.Extensions.Logging.Configuration | 11.0.0 |
| Microsoft.Extensions.Logging.Console | 11.0.0 |
| Microsoft.Extensions.Logging.Debug | 11.0.0 |
| Microsoft.Extensions.Logging.EventLog | 11.0.0 |
| Microsoft.Extensions.Logging.EventSource | 11.0.0 |
| Microsoft.Extensions.Logging.TraceSource | 11.0.0 |
| Microsoft.Extensions.ObjectPool | 11.0.0 |
| Microsoft.Extensions.Options | 11.0.0 |
| Microsoft.Extensions.Options.ConfigurationExtensions | 11.0.0 |
| Microsoft.Extensions.Options.DataAnnotations | 11.0.0 |
| Microsoft.Extensions.Primitives | 11.0.0 |
| Microsoft.Extensions.Validation | 11.0.0 |
| Microsoft.Extensions.WebEncoders | 11.0.0 |
| Microsoft.ILVerification | 11.0.0 |
| Microsoft.JSInterop | 11.0.0 |
| Microsoft.JSInterop.WebAssembly | 11.0.0 |
| Microsoft.McpServer.ProjectTemplates.11.0 | 11.0.0 |
| Microsoft.Net.Http.Headers | 11.0.0 |
| Microsoft.NET.ILLink.Tasks | 11.0.0 |
| Microsoft.NET.Runtime.Android.Sample.Mono | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Cache.linux-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Cache.linux-musl-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Cache.linux-musl-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Cache.linux-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Cache.osx-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Cache.osx-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Cache.win-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Cache.win-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Cache.win-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Cache.win-x64.Msi.x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Node.linux-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Node.linux-musl-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Node.linux-musl-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Node.linux-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Node.osx-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Node.osx-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Node.win-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Node.win-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Node.win-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Node.win-x64.Msi.x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Python.osx-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Python.osx-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Python.win-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Python.win-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Python.win-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Python.win-x64.Msi.x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Sdk.linux-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Sdk.linux-musl-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Sdk.linux-musl-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Sdk.linux-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Sdk.osx-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Sdk.osx-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Sdk.win-arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Sdk.win-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Sdk.win-x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.6.0.2.Sdk.win-x64.Msi.x64 | 11.0.0 |
| Microsoft.NET.Runtime.Emscripten.Internal | 11.0.0 |
| Microsoft.NET.Runtime.iOS.Sample.Mono | 11.0.0 |
| Microsoft.NET.Runtime.LibraryBuilder.Sdk | 11.0.0 |
| Microsoft.NET.Runtime.MonoAOTCompiler.Task | 11.0.0 |
| Microsoft.NET.Runtime.MonoAOTCompiler.Task.Msi.arm64 | 11.0.0 |
| Microsoft.NET.Runtime.MonoAOTCompiler.Task.Msi.x64 | 11.0.0 |
| Microsoft.NET.Runtime.MonoAOTCompiler.Task.Msi.x86 | 11.0.0 |
| Microsoft.NET.Runtime.MonoTargets.Sdk | 11.0.0 |
| Microsoft.NET.Runtime.MonoTargets.Sdk.Msi.arm64 | 11.0.0 |
| Microsoft.NET.Runtime.MonoTargets.Sdk.Msi.x64 | 11.0.0 |
| Microsoft.NET.Runtime.MonoTargets.Sdk.Msi.x86 | 11.0.0 |
| Microsoft.NET.Runtime.wasm.Sample.Mono | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Sdk | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Sdk.Msi.arm64 | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Sdk.Msi.x64 | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Sdk.Msi.x86 | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Templates.net11 | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Templates.net11.Msi.arm64 | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Templates.net11.Msi.x64 | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Templates.net11.Msi.x86 | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Wasi.Sdk | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Wasi.Sdk.Msi.arm64 | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Wasi.Sdk.Msi.x64 | 11.0.0 |
| Microsoft.NET.Runtime.WebAssembly.Wasi.Sdk.Msi.x86 | 11.0.0 |
| Microsoft.Net.Sdk.Compilers.Toolset | 11.0.100 |
| Microsoft.NET.Sdk.IL | 11.0.0 |
| Microsoft.NET.Sdk.WebAssembly.Pack | 11.0.0 |
| Microsoft.NET.Sdk.WebAssembly.Pack.Msi.arm64 | 11.0.0 |
| Microsoft.NET.Sdk.WebAssembly.Pack.Msi.x64 | 11.0.0 |
| Microsoft.NET.Sdk.WebAssembly.Pack.Msi.x86 | 11.0.0 |
| Microsoft.NET.WebAssembly.Threading | 11.0.0 |
| Microsoft.NET.Workload.Emscripten.Current.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.Current.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.Current.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.Current.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net10.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net10.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net10.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net10.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net6.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net6.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net6.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net6.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net7.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net7.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net7.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net7.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net8.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net8.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net8.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net8.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net9.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net9.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net9.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Emscripten.net9.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.Current.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.Current.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.Current.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.Current.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net10.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net10.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net10.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net10.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net6.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net6.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net6.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net6.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net7.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net7.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net7.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net7.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net8.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net8.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net8.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net8.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net9.Manifest-11.0.100 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net9.Manifest-11.0.100.Msi.arm64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net9.Manifest-11.0.100.Msi.x64 | 11.0.100 |
| Microsoft.NET.Workload.Mono.Toolchain.net9.Manifest-11.0.100.Msi.x86 | 11.0.100 |
| Microsoft.NETCore.App.Crossgen2.linux-arm | 11.0.0 |
| Microsoft.NETCore.App.Crossgen2.linux-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Crossgen2.linux-musl-arm | 11.0.0 |
| Microsoft.NETCore.App.Crossgen2.linux-musl-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Crossgen2.linux-musl-x64 | 11.0.0 |
| Microsoft.NETCore.App.Crossgen2.linux-x64 | 11.0.0 |
| Microsoft.NETCore.App.Crossgen2.osx-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Crossgen2.osx-x64 | 11.0.0 |
| Microsoft.NETCore.App.Crossgen2.win-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Crossgen2.win-x64 | 11.0.0 |
| Microsoft.NETCore.App.Crossgen2.win-x86 | 11.0.0 |
| Microsoft.NETCore.App.Host.linux-arm | 11.0.0 |
| Microsoft.NETCore.App.Host.linux-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Host.linux-bionic-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Host.linux-bionic-x64 | 11.0.0 |
| Microsoft.NETCore.App.Host.linux-musl-arm | 11.0.0 |
| Microsoft.NETCore.App.Host.linux-musl-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Host.linux-musl-x64 | 11.0.0 |
| Microsoft.NETCore.App.Host.linux-x64 | 11.0.0 |
| Microsoft.NETCore.App.Host.osx-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Host.osx-x64 | 11.0.0 |
| Microsoft.NETCore.App.Host.win-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Host.win-x64 | 11.0.0 |
| Microsoft.NETCore.App.Host.win-x86 | 11.0.0 |
| Microsoft.NETCore.App.Ref | 11.0.0 |
| Microsoft.NETCore.App.Runtime.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-arm64.Cross.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-arm64.Cross.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-arm64.Cross.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-arm64.Cross.android-x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-arm64.Cross.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-arm64.Cross.wasi-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-arm64.Cross.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-arm64.Cross.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-arm64.Cross.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-arm64.Cross.android-x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-arm64.Cross.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-arm64.Cross.wasi-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-x64.Cross.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-x64.Cross.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-x64.Cross.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-x64.Cross.android-x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-x64.Cross.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-musl-x64.Cross.wasi-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-x64.Cross.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-x64.Cross.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-x64.Cross.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-x64.Cross.android-x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-x64.Cross.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.linux-x64.Cross.wasi-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.android-x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.ios-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.iossimulator-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.iossimulator-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.maccatalyst-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.maccatalyst-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.tvos-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.tvossimulator-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.tvossimulator-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-arm64.Cross.wasi-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.android-x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.ios-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.iossimulator-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.iossimulator-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.maccatalyst-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.maccatalyst-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.tvos-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.tvossimulator-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.tvossimulator-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.osx-x64.Cross.wasi-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.android-arm.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.android-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.android-x64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.android-x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.android-x86.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.browser-wasm.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.wasi-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-arm64.Cross.wasi-wasm.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.android-arm.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.android-arm64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.android-x64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.android-x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.android-x86.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.browser-wasm.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.wasi-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.AOT.win-x64.Cross.wasi-wasm.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.browser-wasm.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.browser-wasm.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.browser-wasm.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.ios-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.iossimulator-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.iossimulator-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.linux-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.linux-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.linux-bionic-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.linux-bionic-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.linux-musl-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.linux-musl-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.linux-musl-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.linux-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.maccatalyst-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.maccatalyst-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-arm.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-arm.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-arm.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-arm64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-arm64.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-x64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-x64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-x64.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-x86.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-x86.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.android-x86.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.browser-wasm.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.browser-wasm.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.browser-wasm.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.ios-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.ios-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.ios-arm64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.ios-arm64.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvos-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvos-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvos-arm64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvos-arm64.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.wasi-wasm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.wasi-wasm.Msi.arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.wasi-wasm.Msi.x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.Mono.wasi-wasm.Msi.x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.android-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.android-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.android-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.ios-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.linux-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.osx-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.osx-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.tvos-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.win-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.win-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.NativeAOT.win-x86 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.osx-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.osx-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.tvos-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.tvossimulator-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.tvossimulator-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.win-arm64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.win-x64 | 11.0.0 |
| Microsoft.NETCore.App.Runtime.win-x86 | 11.0.0 |
| Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| Microsoft.NETCore.ILAsm | 11.0.0 |
| Microsoft.NETCore.ILDAsm | 11.0.0 |
| Microsoft.SourceLink.AzureDevOpsServer.Git | 11.0.100 |
| Microsoft.SourceLink.AzureRepos.Git | 11.0.100 |
| Microsoft.SourceLink.Bitbucket.Git | 11.0.100 |
| Microsoft.SourceLink.Common | 11.0.100 |
| Microsoft.SourceLink.Gitea | 11.0.100 |
| Microsoft.SourceLink.Gitee | 11.0.100 |
| Microsoft.SourceLink.GitHub | 11.0.100 |
| Microsoft.SourceLink.GitLab | 11.0.100 |
| Microsoft.SourceLink.GitWeb | 11.0.100 |
| Microsoft.SourceLink.Tools | 11.0.100 |
| Microsoft.TemplateEngine.Abstractions | 11.0.100 |
| Microsoft.TemplateEngine.Authoring.CLI | 11.0.100 |
| Microsoft.TemplateEngine.Authoring.Tasks | 11.0.100 |
| Microsoft.TemplateEngine.Authoring.Templates | 11.0.100 |
| Microsoft.TemplateEngine.Authoring.TemplateVerifier | 11.0.100 |
| Microsoft.TemplateEngine.Core | 11.0.100 |
| Microsoft.TemplateEngine.Core.Contracts | 11.0.100 |
| Microsoft.TemplateEngine.Edge | 11.0.100 |
| Microsoft.TemplateEngine.IDE | 11.0.100 |
| Microsoft.TemplateEngine.Orchestrator.RunnableProjects | 11.0.100 |
| Microsoft.TemplateEngine.Samples | 11.0.100 |
| Microsoft.TemplateEngine.TemplateLocalizer.Core | 11.0.100 |
| Microsoft.TemplateEngine.Utils | 11.0.100 |
| Microsoft.TemplateSearch.Common | 11.0.100 |
| Microsoft.Web.Xdt | 3.3.0 |
| Microsoft.Win32.Registry.AccessControl | 11.0.0 |
| Microsoft.Win32.SystemEvents | 11.0.0 |
| Microsoft.Windows.Compatibility | 11.0.0 |
| Microsoft.WindowsDesktop.App.Ref | 11.0.0 |
| Microsoft.WindowsDesktop.App.Runtime.win-arm64 | 11.0.0 |
| Microsoft.WindowsDesktop.App.Runtime.win-x64 | 11.0.0 |
| Microsoft.WindowsDesktop.App.Runtime.win-x86 | 11.0.0 |
| Microsoft.XmlSerializer.Generator | 11.0.0 |
| runtime.android-arm.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.android-arm64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.android-x64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.android-x86.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.linux-arm.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.linux-arm.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.linux-arm.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.linux-arm.Microsoft.NETCore.ILDAsm | 11.0.0 |
| runtime.linux-arm.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.linux-arm64.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.linux-arm64.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.linux-arm64.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.linux-arm64.Microsoft.NETCore.ILDAsm | 11.0.0 |
| runtime.linux-arm64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.linux-bionic-arm64.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.linux-bionic-arm64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.linux-bionic-x64.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.linux-bionic-x64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.linux-musl-arm.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.linux-musl-arm.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.linux-musl-arm.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.linux-musl-arm.Microsoft.NETCore.ILDAsm | 11.0.0 |
| runtime.linux-musl-arm.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.linux-musl-arm64.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.linux-musl-arm64.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.linux-musl-arm64.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.linux-musl-arm64.Microsoft.NETCore.ILDAsm | 11.0.0 |
| runtime.linux-musl-arm64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.linux-musl-x64.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.linux-musl-x64.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.linux-musl-x64.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.linux-musl-x64.Microsoft.NETCore.ILDAsm | 11.0.0 |
| runtime.linux-musl-x64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.linux-x64.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.linux-x64.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.linux-x64.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.linux-x64.Microsoft.NETCore.ILDAsm | 11.0.0 |
| runtime.linux-x64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.maccatalyst-arm64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.maccatalyst-x64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.native.System.IO.Ports | 11.0.0 |
| runtime.osx-arm64.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.osx-arm64.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.osx-arm64.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.osx-arm64.Microsoft.NETCore.ILDAsm | 11.0.0 |
| runtime.osx-arm64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.osx-x64.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.osx-x64.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.osx-x64.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.osx-x64.Microsoft.NETCore.ILDAsm | 11.0.0 |
| runtime.osx-x64.runtime.native.System.IO.Ports | 11.0.0 |
| runtime.win-arm64.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.win-arm64.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.win-arm64.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.win-arm64.Microsoft.NETCore.ILDAsm | 11.0.0 |
| runtime.win-x64.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.win-x64.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.win-x64.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.win-x64.Microsoft.NETCore.ILDAsm | 11.0.0 |
| runtime.win-x86.Microsoft.DotNet.ILCompiler | 11.0.0 |
| runtime.win-x86.Microsoft.NETCore.DotNetAppHost | 11.0.0 |
| runtime.win-x86.Microsoft.NETCore.ILAsm | 11.0.0 |
| runtime.win-x86.Microsoft.NETCore.ILDAsm | 11.0.0 |
| System.CodeDom | 11.0.0 |
| System.Collections.Immutable | 11.0.0 |
| System.CommandLine | 3.0.0 |
| System.CommandLine.StaticCompletions | 3.0.0 |
| System.ComponentModel.Composition | 11.0.0 |
| System.ComponentModel.Composition.Registration | 11.0.0 |
| System.Composition | 11.0.0 |
| System.Composition.AttributedModel | 11.0.0 |
| System.Composition.Convention | 11.0.0 |
| System.Composition.Hosting | 11.0.0 |
| System.Composition.Runtime | 11.0.0 |
| System.Composition.TypedParts | 11.0.0 |
| System.Configuration.ConfigurationManager | 11.0.0 |
| System.Data.Odbc | 11.0.0 |
| System.Data.OleDb | 11.0.0 |
| System.Diagnostics.DiagnosticSource | 11.0.0 |
| System.Diagnostics.EventLog | 11.0.0 |
| System.Diagnostics.PerformanceCounter | 11.0.0 |
| System.DirectoryServices | 11.0.0 |
| System.DirectoryServices.AccountManagement | 11.0.0 |
| System.DirectoryServices.Protocols | 11.0.0 |
| System.Drawing.Common | 11.0.0 |
| System.Formats.Asn1 | 11.0.0 |
| System.Formats.Cbor | 11.0.0 |
| System.Formats.Nrbf | 11.0.0 |
| System.IO.Hashing | 11.0.0 |
| System.IO.Packaging | 11.0.0 |
| System.IO.Pipelines | 11.0.0 |
| System.IO.Ports | 11.0.0 |
| System.Linq.AsyncEnumerable | 11.0.0 |
| System.Management | 11.0.0 |
| System.Memory.Data | 11.0.0 |
| System.Net.Http.Json | 11.0.0 |
| System.Net.Http.WinHttpHandler | 11.0.0 |
| System.Net.ServerSentEvents | 11.0.0 |
| System.Numerics.Tensors | 11.0.0 |
| System.Reflection.Context | 11.0.0 |
| System.Reflection.Metadata | 11.0.0 |
| System.Reflection.MetadataLoadContext | 11.0.0 |
| System.Resources.Extensions | 11.0.0 |
| System.Runtime.Caching | 11.0.0 |
| System.Runtime.Serialization.Formatters | 11.0.0 |
| System.Runtime.Serialization.Schema | 11.0.0 |
| System.Security.Cryptography.Cose | 11.0.0 |
| System.Security.Cryptography.Pkcs | 11.0.0 |
| System.Security.Cryptography.ProtectedData | 11.0.0 |
| System.Security.Cryptography.Xml | 11.0.0 |
| System.Security.Permissions | 11.0.0 |
| System.ServiceModel.Syndication | 11.0.0 |
| System.ServiceProcess.ServiceController | 11.0.0 |
| System.Speech | 11.0.0 |
| System.Text.Encoding.CodePages | 11.0.0 |
| System.Text.Encodings.Web | 11.0.0 |
| System.Text.Json | 11.0.0 |
| System.Threading.AccessControl | 11.0.0 |
| System.Threading.Channels | 11.0.0 |
| System.Threading.RateLimiting | 11.0.0 |
| System.Threading.Tasks.Dataflow | 11.0.0 |
| System.Windows.Extensions | 11.0.0 |

[//]: # ( Runtime 11.0.0)
[dotnet-runtime-linux-arm.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-linux-arm.tar.gz
[dotnet-runtime-linux-arm64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-linux-arm64.tar.gz
[dotnet-runtime-linux-musl-arm.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-linux-musl-arm.tar.gz
[dotnet-runtime-linux-musl-arm64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-linux-musl-arm64.tar.gz
[dotnet-runtime-linux-musl-x64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-linux-musl-x64.tar.gz
[dotnet-runtime-linux-x64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-linux-x64.tar.gz
[dotnet-runtime-osx-arm64.pkg]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-osx-arm64.pkg
[dotnet-runtime-osx-arm64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-osx-arm64.tar.gz
[dotnet-runtime-osx-x64.pkg]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-osx-x64.pkg
[dotnet-runtime-osx-x64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-osx-x64.tar.gz
[dotnet-runtime-win-arm64.exe]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-win-arm64.exe
[dotnet-runtime-win-arm64.zip]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-win-arm64.zip
[dotnet-runtime-win-x64.exe]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-win-x64.exe
[dotnet-runtime-win-x64.zip]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-win-x64.zip
[dotnet-runtime-win-x86.exe]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-win-x86.exe
[dotnet-runtime-win-x86.zip]: https://builds.dotnet.microsoft.com/dotnet/Runtime/11.0.0/dotnet-runtime-11.0.0-win-x86.zip

[//]: # ( WindowsDesktop 11.0.0)
[windowsdesktop-runtime-win-arm64.exe]: https://builds.dotnet.microsoft.com/dotnet/WindowsDesktop/11.0.0/windowsdesktop-runtime-11.0.0-win-arm64.exe
[windowsdesktop-runtime-win-x64.exe]: https://builds.dotnet.microsoft.com/dotnet/WindowsDesktop/11.0.0/windowsdesktop-runtime-11.0.0-win-x64.exe
[windowsdesktop-runtime-win-x86.exe]: https://builds.dotnet.microsoft.com/dotnet/WindowsDesktop/11.0.0/windowsdesktop-runtime-11.0.0-win-x86.exe

[//]: # ( ASP 11.0.0)
[aspnetcore-runtime-linux-arm.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/11.0.0/aspnetcore-runtime-11.0.0-linux-arm.tar.gz
[aspnetcore-runtime-linux-arm64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/11.0.0/aspnetcore-runtime-11.0.0-linux-arm64.tar.gz
[aspnetcore-runtime-linux-musl-x64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/11.0.0/aspnetcore-runtime-11.0.0-linux-musl-x64.tar.gz
[aspnetcore-runtime-linux-x64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/11.0.0/aspnetcore-runtime-11.0.0-linux-x64.tar.gz
[aspnetcore-runtime-osx-arm64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/11.0.0/aspnetcore-runtime-11.0.0-osx-arm64.tar.gz
[aspnetcore-runtime-osx-x64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/11.0.0/aspnetcore-runtime-11.0.0-osx-x64.tar.gz
[aspnetcore-runtime-win-x64.exe]: https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/11.0.0/aspnetcore-runtime-11.0.0-win-x64.exe
[aspnetcore-runtime-win-x86.exe]: https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/11.0.0/aspnetcore-runtime-11.0.0-win-x86.exe
[dotnet-hosting-win.exe]: https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/11.0.0/dotnet-hosting-11.0.0-win.exe

[//]: # ( SDK 11.0.100)
[dotnet-sdk-linux-arm.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-linux-arm.tar.gz
[dotnet-sdk-linux-arm64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-linux-arm64.tar.gz
[dotnet-sdk-linux-musl-arm.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-linux-musl-arm.tar.gz
[dotnet-sdk-linux-musl-x64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-linux-musl-x64.tar.gz
[dotnet-sdk-linux-x64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-linux-x64.tar.gz
[dotnet-sdk-osx-arm64.pkg]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-osx-arm64.pkg
[dotnet-sdk-osx-arm64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-osx-arm64.tar.gz
[dotnet-sdk-osx-x64.pkg]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-osx-x64.pkg
[dotnet-sdk-osx-x64.tar.gz]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-osx-x64.tar.gz
[dotnet-sdk-win-arm64.exe]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-win-arm64.exe
[dotnet-sdk-win-arm64.zip]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-win-arm64.zip
[dotnet-sdk-win-x64.exe]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-win-x64.exe
[dotnet-sdk-win-x64.zip]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-win-x64.zip
[dotnet-sdk-win-x86.exe]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-win-x86.exe
[dotnet-sdk-win-x86.zip]: https://builds.dotnet.microsoft.com/dotnet/Sdk/11.0.100/dotnet-sdk-11.0.100-win-x86.zip
