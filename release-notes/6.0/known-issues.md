# .NET 6.0 Known Issues

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
When upgrading Visual Studio to preview 5 or the .NET SDK to RC2 from an earlier build, the installer will uninstall the prior version of the .NET Host (dotnet.exe) and then install a new version. This results in the path to the x64 copy of dotnet being removed from the `PATH` then added back. If you have the x86 .NET Host installed, it will end up ahead of the x64 one and will be picked up first. 

In this case you may find that Visual Studio is unable to create projects, or commands like `dotnet new` fail with a message like this:
```
Could not execute because the application was not found or a compatible .NET SDK is not installed.
```

To confirm, run `dotnet --info` and you'll see (x86) paths for all of the found .NET runtimes and .NET SDKs installed. 

To fix this, edit your `PATH` environment variable to either remove the `c:\Program Files (x86)\dotnet` entry or move it after the entry for `c:\Program Files\dotnet`. Now reopen your console window.
   
## ASP.NET Core

### SPA template issues with Individual authentication when running in development

The first time SPA apps are run, the authority for the spa proxy might be incorrectly cached which results in the JWT bearer being rejected due to Invalid issuer. The workaround is to just restart the SPA app and the issue will be resolved. If restarting doesn't resolve the problem, another workaround is to specify the authority for your app in Program.cs: `builder.Services.Configure<JwtBearerOptions>("IdentityServerJwtBearer", o => o.Authority = "https://localhost:44416");` where 44416 is the port for the spa proxy.

When using localdb (default when creating projects in VS), the normal database apply migrations error page will not be displayed correctly due to the spa proxy. This will result in errors when going to the fetch data page. Apply the migrations via 'dotnet ef database update' to create the database.
