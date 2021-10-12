# .NET 6.0 RC1 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations or expected resolution timeframes.

## .NET SDK

.NET 6 is supported with Visual Studio 2022 and MSBuild 17.  It is not supported with Visual Studio 2019 and MSBuild 16.

If you build .NET 6 projects with MSBuild 16.11, for example, you will see the following error:

`warning NETSDK1182: Targeting .NET 6.0 in Visual Studio 2019 is not supported`


#### 1. Optional workloads on Windows (arm64)

Installing MSI based optional workloads using the CLI will result in a `PlatformNotSupported` exception on Windows (arm64). The CLI installer has a dependency on `System.Management` that is not support on Windows (arm64). This dependency has been removed in RC2.

There is no workaround for this issue in RC1, except to switch to the file based workload installation.

#### 2. Reference assemblies no longer output to the bin directory

These files are only needed during builds and cause confusion for customers to see extra binaries built to the bin\ref folder. Instead they were [moved](https://github.com/dotnet/msbuild/pull/6560) to only build to the obj/ref folder.

**Note, this change is being [reverted](https://github.com/dotnet/msbuild/pull/6718) for RC1 as we found a hardcoded path in Roslyn in VS scenarios that has to be addressed first**

#### 3. Workload install for protected install location (eg. c:\program files) will fail

In the future, the .NET SDK will trigger elevation to install missing workloads but today that fails.

```
C:\Users\MPP>dotnet workload install microsoft-macos-sdk-full --skip-manifest-update

Installing pack Microsoft.macOS.Sdk version 11.3.100-preview.5.889...
Workload installation failed, rolling back installed packs...
Rolling back pack Microsoft.macOS.Sdk installation...
Workload installation failed: One or more errors occurred. (Access to the path 'C:\Program Files\dotnet\metadata\temp\microsoft.macos.sdk\11.3.100-preview.5.889' is denied.)
```
**Workaround**
You'll need to elevate your command prompt before running the install command.
   
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
