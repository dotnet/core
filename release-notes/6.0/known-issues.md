# .NET 6.0 RC2 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations or expected resolution timeframes.

## .NET SDK

.NET 6 is supported with Visual Studio 2022 and MSBuild 17.  It is not supported with Visual Studio 2019 and MSBuild 16.

If you build .NET 6 projects with MSBuild 16.11, for example, you will see the following error:

`warning NETSDK1182: Targeting .NET 6.0 in Visual Studio 2019 is not supported`

You can use the .net 6 SDK to target downlevel runtimes in 16.11.

#### 1. dotnet test x64 emulation on arm64 support
While a lot of work has been done to support arm64 emulation of x64 processes in .net 6, there are some remaining [work](https://github.com/dotnet/sdk/issues/21686) to be done in 6.0.2xx. The most impactful remaining item is `dotnet test` support.

`dotnet test --arch x64` on an arm64 machine will not work as it will not find the correct test host.  To test x64 components on an arm64 machine, you will have to install the x64 SDK and configure your `DOTNET_ROOT` and `PATH` to use the x64 version of dotnet.

#### 2. Upgrade of Visual Studio or .NET SDK from earlier builds can result in a bad `PATH` configuration on Windows
When upgrading Visual Studio to preview 5 or the .NET SDK to RC2 from an earlier build, the installer will uninstall the prior version of the .NET Host (dotnet.exe) and then install a new version. This results in the x64 `PATH` being removed and added back. If a customer has the x86 .NET Host installed, this one will end up ahead of the x64 one and will be picked up first.  

Different architectures of .NET do not know about each other so then the .NET SDK will stop functioning correctly (behavior may be Visual Studio unable to create projects, dotnet new fails, etc).

To confirm, run `dotnet --info` and you'll see (x86) paths for all of the found .NET runtimes and .NET SDKs installed. To resolve this, remove "c:\program files (x86)\dotnet" from the `PATH` environment variable or move it after "c:\program files\dotnet"
   
## ASP.NET Core

### Running Blazor WebAssembly using IIS Express in Development

As of .NET 6 Preview 1, there is an ongoing issue with running Blazor WebAssembly applications using an IIS Express server during development on Visual Studio. As a workaround, we recommend using Kestrel during development.

### Incremental builds in VS not working for apps with Razor views

As of .NET 6 Preview 3, changes to Razor views will not be updated during incremental builds. As a workaround, you can:

- Build from the command line
- Configure VS to always call MSBuild when building projects
- Clean and build projects to pick up changes

### JWT Bearer Handler ArgumentOutOfRangeException in UTC+X time zones

As of .NET 6 Preview 5, when using the JWT Bearer handler in a time zone that is higher than UTC (e.g. Eastern European Time/UTC+2), you may observe an `ArgumentOutOfRangeException` if the JWT token does not contain a `nbf` value (valid from).

Issue is tracked by https://github.com/dotnet/aspnetcore/issues/33634 and will be fixed in .NET 6 Preview 6.

**Workaround**

You can workaround this by always providing a non-zero and non-minimum value for the `notBefore` parameter when using System.IdentityModel.Tokens.Jwt.JwtSecurityToken, or the 'nbf' field if using another JWT library.

### CPU at 100% when enabling HTTP/3 Preview

When enabling HTTP/3 which is only accessible through a feature flag, you might experience Kestrel using 100% of the CPU. We recommend not enabling the feature until this is fixed.

Issue is tracked by https://github.com/dotnet/runtime/issues/60133 and will be fixed in .NET 6 RTM.


**Customizing WebRootPath not supported for minimal applications**

There is a known issue with modifying the `WebRootPath` in a minimal app using the `WebApplicationBuilder` as documented in https://github.com/dotnet/aspnetcore/issues/36999. The issue will be resolved in .NET 6 RTM. As a workaround, users can use the default `wwwroot` directory for serving static files in their applications. Alternatively, you can invoke `UseStaticFiles` with a `StaticFilesOption` containing both the provider and path.

```csharp
app.UseStaticFiles(new StaticFileOptions
{
  ContentTypeProvider = new PhysicalFileProvider("/full/path/to/custom/wwwroot")
});
```
### Configuration not reloaded on changes

A regression introduced in .NET 6 RC2 prevents configuration from being reloaded on changes when using `WebApplication.Create()` and `WebApplication.CreateBuilder()`. This includes both custom configuration sources and default configuration sources such as `appsettings.json`.

Issue is tracked by https://github.com/dotnet/aspnetcore/issues/37046 and will be fixed in .NET 6 RTM.

**Workaround**

To make configuration reloadable in RC2, you can manually add a chained configuration source as follows.

```C#
var builder = WebApplication.CreateBuilder(args);

var chainedConfiguration = new ConfigurationBuilder()
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true);
builder.Configuration.AddConfiguration(chainedConfiguration.Build());

var app = builder.Build();
// ...
```

### SPA template issues with Individual authentication when running in development

The first time SPA apps are run, the authority for the spa proxy might be incorrectly cached which results in the JWT bearer being rejected due to Invalid issuer. The workaround is to just restart the SPA app and the issue will be resolved.

When using localdb (default when creating projects in VS), the normal database apply migrations error page will not be displayed correctly due to the spa proxy. This will result in errors when going to the fetch data page. Apply the migrations via 'dotnet ef database update' to create the database.
