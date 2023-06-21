# .NET 6.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations or expected resolution timeframes.

## Failure to install the .NET 6.0.1 update via Microsoft Update

### Summary

There have been limited reports of a failure to install the .NET 6.0.1 update via Microsoft Update, the update fails with an error code 0x80070643.

.NET 6.0 can be updated to 6.0.1 via MU and .NET 6.0.1 is also included in the Visual Studio 17.0.3 update. Both options carry the .NET Core Runtime and ASP.NET Core runtime version 6.0.1 and the .NET 6 SDK version 6.0.101. When these are installed, applications will by default roll forward to using the latest runtime patch version automatically. See [framework dependent app runtime roll forward](https://learn.microsoft.com/dotnet/core/versions/selection#framework-dependent-apps-roll-forward) for more information about this behavior.

Therefore, installing either the 6.0.1 update via MU or the VS 17.0.3 update will secure the machine for the vulnerability described in [CVE-2021-43877](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-43877).

### Root Cause

The optional workload manifest MSIs in the SDK populate the Language column in the Upgrade table. The INSTALLEDLANGUAGE property cannot be queried under the USERUNMANAGED context, it can only be queried under MSIINSTALLCONTEXT_MACHINE context. Due to an error the .NET 6.0.101 SDK Wix bundle sets the installer context incorrectly to USERUNMANAGED when running under the LOCAL\SYSTEM account. This causes the engine to continue and execute an older copy of the MSI instead of skipping it, which in turn triggers a launch condition to block the downgrade and the subsequent error causes the bundle to fail, resulting in the MU update failure.

### Workaround

Running the 6.0.101 SDK bundle (without using MU) results in the context changing to MSIINSTALLCONTEXT_MACHINE, this allows the API call to query the INSTALLEDLANGUAGE to complete and the SDK Wix bundle install succeeds.

Therefore a workaround for this issue is to install the 6.0.101 SDK bundle manually by downloading it from the [.NET download site](https://dotnet.microsoft.com/download/dotnet/6.0). Once this is successfully installed, scanning MU again will result in clearing the previous error.

As described previously the computer can be secured by installing the VS 17.0.3 update, even if the MU update results in a failure so the MU failure is not a critical factor from a security perspective. Therefore for the case where we expect the VS update to offer and secure the computer we will be making a change to not offer the MU update to those computers to avoid the MU failure. For the case where .NET 6 was installed as a standalone version and VS is not expected to patch the computer we will continue to offer the 6.0.1 update via MU.

## Failure when using ICU App-Local feature in .NET 6.0.10

### Summary

Applications using the [App-local ICU](https://learn.microsoft.com/dotnet/core/extensions/globalization-icu#app-local-icu) feature to deploy ICU library binaries with the application binaries can experience throwing unhandled [AccessViolationException](https://learn.microsoft.com/dotnet/api/system.accessviolationexception?view=net-6.0). The [reported issue](https://github.com/dotnet/runtime/issues/77045) contains more information about this failure.

### Workarounds

- If having the ICU app-local feature to use ICU in the .NET 6.0 application when running on OS like `Windows Server 2019`, migration to .NET 7.0 would help as ICU gets loaded in the application without the need to use the app-local feature. .NET 7.0 supports loading ICU by default on `Windows Server 2019`.
- Use a different .NET version than `6.0.10` like `6.0.9` or `6.0.11` or any later version including .NET `7.0`.

## .NET SDK

.NET 6 is supported with Visual Studio 2022 and MSBuild 17.  It is not supported with Visual Studio 2019 and MSBuild 16.

If you build .NET 6 projects with MSBuild 16.11, for example, you will see the following error:

`warning NETSDK1182: Targeting .NET 6.0 in Visual Studio 2019 is not supported`

You can use the .net 6 SDK to target downlevel runtimes in 16.11.

### 1. Repair or update of VS or old .NET versions can lead to bad `PATH` configuration on windows

In 2021, .NET Runtime and .NET SDK were changed to no longer add the `program files (x86)\dotnet` location to the global machine `PATH` but not all prior versions were updated. Some customers may still have an old version of 2.1 or older runtime and any repair of Visual Studio or that SDK will set the x86 path. Customers can end up in a state where the x86 path ends up ahead of the x64 `program files\dotnet` path which Visual Studio should be using.

**Behavior**
`The SDK 'Microsoft.NET.Sdk' specified could not be found`
<img width="438" alt="image" src="https://github.com/dotnet/core/assets/12663534/1e6fdd30-cc33-4296-bb81-da9d26482f66">



```
dotnet --info

Host:
  Version:      7.0.5
  Architecture: **x86**
  Commit:       8042d61b17
```

#### Workarounds
See https://github.com/dotnet/core/issues/5962#issuecomment-780084535 for more details
- Edit the system environment variables
- Environment Variables
- Double click `Path` under System variables
- Delete the `program files (x86)\dotnet path`

## ASP.NET Core

### SPA template issues with Individual authentication when running in development

The first time SPA apps are run, the authority for the spa proxy might be incorrectly cached which results in the JWT bearer being rejected due to Invalid issuer. The workaround is to just restart the SPA app and the issue will be resolved. If restarting doesn't resolve the problem, another workaround is to specify the authority for your app in Program.cs: `builder.Services.Configure<JwtBearerOptions>("IdentityServerJwtBearer", o => o.Authority = "https://localhost:44416");` where 44416 is the port for the spa proxy.

When using localdb (default when creating projects in VS), the normal database apply migrations error page will not be displayed correctly due to the spa proxy. This will result in errors when going to the fetch data page. Apply the migrations via 'dotnet ef database update' to create the database.

### SPA template issues with Individual authentication when running in production

SPA apps on Azure App Service with all the following:

- Individual authentication and requires login for every page.
- A custom domain such as `https://MyDomain.com`:

Sometimes return the following error `WWW-Authenticate: Bearer error="invalid_token", error_description="The issuer 'https://MyDomain.com' is invalid"`. If the app is accessed from the Azure DNS (MyDomain.azurewebsites.net), authentication is successful. Subsequent requests to `https://MyDomain.com` succeed.  Alternatively, stopping and starting the app, enables authentication to succeed. This error can occur with [`Always On`](https://learn.microsoft.com/azure/app-service/configure-common) set to `true` or `false`.

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

- To run Windows Desktop applications built with 6.0.200 or later .NET SDK, the Windows Desktop runtime 6.0.2 or later is required.

The team appreciates that the fix is less than ideal, however it was chosen for the following reasons.

- If the ref pack version number was reverted to 6.0.0, then all DLLs built with 6.0.2 reference assemblies would be broken. Those projects/libraries would have no other workaround besides rebuilding, which would mean that any NuGet packages published would be irreversibly broken and would need to be updated.
- If we lock the ref pack version number at 6.0.2, there is a workaround that allows building an app or library that can run on 6.0.0 or 6.0.1 - for an end-user it requires installing Windows Desktop runtime 6.0.0 or 6.0.1, and for a developer - locking the runtime at the project level:

    ```xml
    <ItemGroup Condition="'$(TargetFrameworkVersion)' == '6.0'">
      <FrameworkReference
              Update="Microsoft.WindowsDesktop.App;Microsoft.WindowsDesktop.App.WPF;Microsoft.WindowsDesktop.App.WindowsForms"
              TargetingPackVersion="6.0.0" />
    </ItemGroup>
    ```

- Additionally 6.0.1 and 6.0.2 are security releases, and customers are encouraged to update to the latest version.

### Issues building WPF application with Windows Desktop 6.0.7 and 6.0.8

Some customers are unable to build WPF applications with Windows Desktop 6.0.7 and 6.0.8, if they are including source generators coming from NuGet Packages, and receive errors similar to :

```output
Rebuild started...
1>------ Rebuild All started: Project: ObservablePropertyTest, Configuration: Debug Any CPU ------
Restored C:\git\ObservablePropertyTest\ObservablePropertyTest.csproj (in 2 ms).
1>C:\git\ObservablePropertyTest\CommunityToolkit.Mvvm.SourceGenerators\CommunityToolkit.Mvvm.SourceGenerators.ObservablePropertyGenerator\__KnownINotifyPropertyChangedOrChangingArgs.cs(12,27,12,70): error CS0101: The namespace 'CommunityToolkit.Mvvm.ComponentModel.__Internals' already contains a definition for '__KnownINotifyPropertyChangedOrChangingArgs'
1>C:\git\ObservablePropertyTest\CommunityToolkit.Mvvm.SourceGenerators\CommunityToolkit.Mvvm.SourceGenerators.ObservablePropertyGenerator\__KnownINotifyPropertyChangedOrChangingArgs.cs(7,6,7,51): error CS0579: Duplicate 'global::System.CodeDom.Compiler.GeneratedCode' attribute
1>C:\git\ObservablePropertyTest\CommunityToolkit.Mvvm.SourceGenerators\CommunityToolkit.Mvvm.SourceGenerators.ObservablePropertyGenerator\__KnownINotifyPropertyChangedOrChangingArgs.cs(8,6,8,52): error CS0579: Duplicate 'global::System.Diagnostics.DebuggerNonUserCode' attribute
1>C:\git\ObservablePropertyTest\CommunityToolkit.Mvvm.SourceGenerators\CommunityToolkit.Mvvm.SourceGenerators.ObservablePropertyGenerator\__KnownINotifyPropertyChangedOrChangingArgs.cs(9,6,9,69): error CS0579: Duplicate 'global::System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage' attribute
1>C:\git\ObservablePropertyTest\CommunityToolkit.Mvvm.SourceGenerators\CommunityToolkit.Mvvm.SourceGenerators.ObservablePropertyGenerator\__KnownINotifyPropertyChangedOrChangingArgs.cs(10,6,10,51): error CS0579: Duplicate 'global::System.ComponentModel.EditorBrowsable' attribute
1>C:\git\ObservablePropertyTest\CommunityToolkit.Mvvm.SourceGenerators\CommunityToolkit.Mvvm.SourceGenerators.ObservablePropertyGenerator\__KnownINotifyPropertyChangedOrChangingArgs.cs(11,6,11,29): error CS0579: Duplicate 'global::System.Obsolete' attribute
1>C:\git\ObservablePropertyTest\CommunityToolkit.Mvvm.SourceGenerators\CommunityToolkit.Mvvm.SourceGenerators.ObservablePropertyGenerator\ObservablePropertyTest.TestVM.cs(12,23,12,33): error CS0102: The type 'TestVM' already contains a definition for 'TestString'
1>Done building project "ObservablePropertyTest_yynlzhol_wpftmp.csproj" -- FAILED.
========== Rebuild All: 0 succeeded, 1 failed, 0 skipped ==========
```

This happened because WPF builds in 6.0.7 onwards, only considered source generators that were coming from nuget references. This caused an issue when there were source generators that were essentially coming via FrameworkReference. This issue has already been addressed in next release (6.0.9). However, the following workaround would unblock WPF builds.

**Fix:**

- To enable build in Windows Desktop 6.0.7, navigate to the directory containing the `Microsoft.WinFx.targets` file ( `C:\Program Files\dotnet\sdk\6.0.302\Sdks\Microsoft.NET.Sdk.WindowsDesktop\targets` )
- Add the following target in the file :

    ```xml

    <Target Name="RemoveDuplicateAnalyzers" BeforeTargets="CoreCompile">
        <ItemGroup>
            <FilteredAnalyzer Include="@(Analyzer->Distinct())" />
            <Analyzer Remove="@(Analyzer)" />
            <Analyzer Include="@(FilteredAnalyzer)" />
        </ItemGroup>
    </Target>
    ```
