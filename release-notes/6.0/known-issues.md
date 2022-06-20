# .NET 6.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations or expected resolution timeframes.

## Failure to install the .NET 6.0.1 update via Microsoft Update

#### Summary
There have been limited reports of a failure to install the .NET 6.0.1 update via Microsoft Update, the update fails with an error code 0x80070643.

.NET 6.0 can be updated to 6.0.1 via MU and .NET 6.0.1 is also included in the Visual Studio 17.0.3 update. Both options carry the .NET Core Runtime and ASP.NET Core runtime version 6.0.1 and the .NET 6 SDK version 6.0.101. When these are installed, applications will by default roll forward to using the latest runtime patch version automatically. See [framework dependent app runtime roll forward](https://docs.microsoft.com/en-us/dotnet/core/versions/selection#framework-dependent-apps-roll-forward) for more information about this behavior.

Therefore, installing either the 6.0.1 update via MU or the VS 17.0.3 update will secure the machine for the vulnerability described in [CVE-2021-43877](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-43877).


#### Root Cause
The optional workload manifest MSIs in the SDK populate the Language column in the Upgrade table. The INSTALLEDLANGUAGE property cannot be queried under the USERUNMANAGED context, it can only be queried under MSIINSTALLCONTEXT_MACHINE context. Due to an error the .NET 6.0.101 SDK Wix bundle sets the installer context incorrectly to USERUNMANAGED when running under the LOCAL\SYSTEM account. This causes the engine to continue and execute an older copy of the MSI instead of skipping it, which in turn triggers a launch condition to block the downgrade and the subsequent error causes the bundle to fail, resulting in the MU update failure.


#### Workaround
Running the 6.0.101 SDK bundle (without using MU) results in the context changing to MSIINSTALLCONTEXT_MACHINE, this allows the API call to query the INSTALLEDLANGUAGE to complete and the SDK Wix bundle install succeeds.

Therefore a workaround for this issue is to install the 6.0.101 SDK bundle manually by downloading it from the [.NET download site](https://dotnet.microsoft.com/en-us/download/dotnet/6.0). Once this is successfully installed scanning MU again will result in clearing the previous error. 

As described previously the computer can be secured by installing the VS 17.0.3 update, even if the MU update results in a failure so the MU failure is not a critical factor from a security perspective. Therefore for the case where we expect the VS update to offer and secure the computer we will be making a change to not offer the MU update to those computers to avoid the MU failure. For the case where .NET 6 was installed as a standalone version and VS is not expected to patch the computer we will continue to offer the 6.0.1 update via MU. 


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

### SPA template issues with Individual authentication when running in production

SPA apps on Azure App Service with all the following:
* Individual authentication and requires login for every page.
* A custom domain such as `https://MyDomain.com`:

Sometimes return the following error `WWW-Authenticate: Bearer error="invalid_token", error_description="The issuer 'https://MyDomain.com' is invalid"`. If the app is accessed from the Azure DNS (MyDomain.azurewebsites.net), authentication is successful. Subsequent requests to `https://MyDomain.com` succeed.  Alternatively, stopping and starting the app, enables authentication to succeed. This error can occur with [`Always On`](/azure/app-service/configure-common) set to `true` or `false`.

To prevent this problem without having to stop and restart the app:

1. Add a new app setting which contains the target DNS address. For example, create `IdentityServer:IssuerUri` with value `https://MyDomain.com/`
1. Add the following code to the app:
```
builder.Services.AddIdentityServer(options =>
{
    if (!string.IsNullOrEmpty(settings.IdentityServer.IssuerUri))
    {
        options.IssuerUri = settings.IdentityServer.IssuerUri;
    }
})
```
   Alternatively, add the following code:
```
builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    if (!string.IsNullOrEmpty(settings.IdentityServer.IssuerUri))
    {
        options.Tokens.AuthenticatorIssuer = settings.IdentityServer.IssuerUri;
    }
})
```

For more information, see [this GitHub issue](https://github.com/dotnet/aspnetcore/issues/42072)

## Windows Desktop (Windows Forms / WPF)

### Issues running applications with Windows Desktop 6.0.2

Some customers are unable to run Windows Desktop (that is, Windows Forms or WPF) applications built with 6.0.200 or later .NET SDK, if the target environment has only .NET Windows Desktop runtime 6.0.0 or 6.0.1 installed, and receive error messages similar to the following:
```
Application: WinFormsApp1.exe
CoreCLR Version: 6.0.121.56705
.NET Version: 6.0.1
Description: The process was terminated due to an unhandled exception.
Exception Info: System.IO.FileLoadException: Could not load file or assembly 'System.Windows.Forms, Version=6.0.2.0, Culture=neutral, PublicKeyToken=b77a5c561934e089'. The located assembly's manifest definition does not match the assembly reference. (0x80131040)
File name: 'System.Windows.Forms, Version=6.0.2.0, Culture=neutral, PublicKeyToken=b77a5c561934e089'
   at WinFormsApp1.Program.Main()   
```

This is a result of Windows Desktop servicing ref pack in 6.0.2, which was shipped with an incorrect version.

**Fix:**
* To run Windows Desktop applications built with 6.0.200 or later .NET SDK, the Windows Desktop runtime 6.0.2 or later is required.

The team appreciates that the fix is less than ideal, however it was chosen for the following reasons.
* If the ref pack version number was reverted to 6.0.0, then all DLLs built with 6.0.2 reference assemblies would be broken. Those projects/libraries would have no other workaround besides rebuilding, which would mean that any NuGet packages published would be irreversibly broken and would need to be updated.
* If we lock the ref pack version number at 6.0.2, there is a workaround that allows building an app or library that can run on 6.0.0 or 6.0.1 - for an end-user it requires installing Windows Desktop runtime 6.0.0 or 6.0.1, and for a developer - locking the runtime at the project level:
    ```xml
    <ItemGroup Condition="'$(TargetFrameworkVersion)' == '6.0'">
      <FrameworkReference
              Update="Microsoft.WindowsDesktop.App;Microsoft.WindowsDesktop.App.WPF;Microsoft.WindowsDesktop.App.WindowsForms"
              TargetingPackVersion="6.0.0" />
    </ItemGroup>
    ```
* Additionally 6.0.1 and 6.0.2 are security releases, and customers are encouraged to update to the latest version.

