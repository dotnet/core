# Support Policy for .NET Packages

NuGet packages owned by the .NET team are supported as long as they target at least one framework that is still actively supported.

The minimum supported .NET versions are:

- .NET Framework 4.6.2
- .NET Standard 2.0
- .NET 6.0

The support policy of our frameworks can be found here: https://dotnet.microsoft.com/en-us/platform/support/policy


## Package and project compatibility

A package targeting any of these above mentioned supported frameworks is expected to be compatible with projects targeting any newer versions. For example:

- If you have a project that targets .NET 8.0, and it consumes a package that targets either .NET Standard 2.0 or .NET 6.0, you should expect the package to be compatible with your project because .NET Standard 2.0 supports .NET 8.0 and .NET 8.0 is greater than .NET 6.0.
- If you have a project that targets .NET 6.0, and it consumes a package that targets .NET Standard 2.0 and .NET 8.0, you should expect the package to be compatible with the project because .NET Standard 2.0 supports .NET 6.0.
- If you have a project that targets .NET 7.0, and it consumes a package that targets .NET 6.0, you should expect the package to be compatible with the project because .NET 7.0 is greater than .NET 6.0.
- If you have a project that targets .NET Framework 4.8, and it consumes a package that targets .NET Standard 2.0 and .NET Framework 4.6.2, you should expect the package to be compatible with the project because .NET Standard 2.0 supports .NET Framework 4.8 and .NET Framework 4.8 is greater than .NET Framework 4.6.2.
- If you have a project that targets .NET 6.0 and it consumes a package that targets .NET 8.0, the package is not compatible with the project.
- If you have a project that targets .NET Framework 4.6.2 and it consumes a package that targets .NET Framework 4.8, the package is not compatible with the project.

The detailed list of .NET Frameworks supported by each .NET Standard version can be found here: https://learn.microsoft.com/en-us/dotnet/standard/net-standard

## Package types

If a package has a newer version that is compatible with your project, you should always upgrade the package to that version.

We publish assemblies in various ways:

### Assemblies that are part of the shared framework

These are the majority of the assemblies. They are part of the shared framework by default when installing the SDK or runtime, and you can get the latest version of the assembly when you upgrade your installation to the latest available release. For example, System.Net.Http.

### Assemblies published only as packages

These are assemblies that are only available as NuGet packages, and they are always being built out of the latest supported .NET version. Whenever a new .NET version is released, a new version of the package is released, and it's expected to be compatible with all the .NET versions that are actively supported at the moment of the release. For example, (most?) Microsoft.Extensions assemblies.

### Assemblies published both as packages and as part of the shared framework

These are assemblies that are part of the shared framework in .NET, but that also get their own NuGet package published so that .NET Framework and .NET Standard projects can consume it too. Similar to the package-only case, whenever a new .NET version is released, a new version of the package is released. NET users will get the latest version of the assembly when they upgrade their installed SDK or runtime to the latest version, while projects targeting .NET Framework or .NET Standard can just update the package to the latest available version. For example, [System.Text.Json](https://www.nuget.org/packages/System.Text.Json).

### Assemblies that used to be packages, and now are part of the shared framework

We have assemblies that used to be published as NuGet packages in older .NET releases, but we later made the decision of merging them into the shared framework of the next release of .NET, while at the same time we stopped publishing them as NuGet packages.

If your project consumes this assembly in a version equal or greater than the one where the package was absorbed by the shared framework, then you don't need to reference the package, and you can get the latest version of the assembly whenever you upgrade your SDK or runtime to the latest version. It is not mandatory to remove the package reference from your project though, as MSBuild is capable of automatically detecting if the assembly is available in-box, in which case, the in-box version will be consumed instead, and the referenced package will be ignored.

But if your project targets a .NET version that is still in support, where this assembly was still being published as a NuGet package, then as long as the package still targets an actively supported minimum .NET version, we will consider it to be actively supported until its targeted frameworks go out of support.


### TODO: Describe the edge-case assemblies like System.Data.SqlClient, System.Xml.XPath.XDocument

TODO - Assemblies that used to be In-Box and then were converted to NuGet packages (?).

## Packages supported by ASP.NET Core 2.1 on .NET Framework

The following document lists the minimum version you can consume of the packages that are required when using ASP.NET Core 2.1 on .NET Framework:

https://dotnet.microsoft.com/en-us/platform/support/policy/aspnet/2.1-packages

## Reporting issues

Developers should report issues in the repo that owns the package, if they know which one it is (https://github.com/dotnet/runtime, https://github.com/dotnet/aspnetcore). When in doubt, we encourage you to report the issue directly in https://github.com/dotnet/runtime, and the repo maintainers will be happy to help transfer the issue to the rightful owners.

There are some assemblies that used to be published out of a .NET version that is currently out of support, but the packages themselves are still supported because they still target a supported .NET version. For these few special cases, we host their source code in the https://github.com/dotnet/maintenance-packages repo. We still encourage users to report issues for these assemblies directly in the central repo https://github.com/dotnet/runtime.

The following table lists the special case assemblies that were migrated to maintenance-packages, their branch of origin, and the way they're supported in each framework category.

| Assembly | Origin | 6.0+ | .NET Standard 2.0 | 4.6.2+ |
|-|-|-|-|-|
| System.Xml.XPath.XmlDocument | 1.1 | Package | Not supported | Package |
| System.Buffers | 2.1 | In-Box | Package | Package |
| System.Memory | 2.1 | In-Box | Package | Package |
| System.Numerics.Vectors | 2.1 | In-Box | Package | Package |
| System.Threading.Tasks.Extensions | 2.1 | In-Box | Package | Package |
| Microsoft.Bcl.HashCode | 3.1 | Package | Package | Package |
| System.Data.SqlClient | 3.1 | ? | ? | ? |
| System.Json | 3.1 | Package | Package | Package |
| System.Reflection.DispatchProxy | 3.1 | In-Box | Package | Package |
| System.Runtime.WindowsRuntime | 3.1 | ? | ? | ? |
| System.Runtime.WindowsRuntime.UI.Xaml | 3.1 | ? | ? | ? |
| System.Net.WebSockets.WebSocketProtocol | 5.0 | Package | Package | Package |
| System.Runtime.CompilerServices.Unsafe | 6.0 | In-Box | Package | Package |

TODO for the table:
- System.Runtime.WindowsRuntime* might have to be deprecated instead, as built-in support for WinRT has been deprecated: https://learn.microsoft.com/en-us/dotnet/core/compatibility/interop/5.0/built-in-support-for-winrt-removed . We should instead encourage users to move to CsWinRT.
- System.Data.SqlClient is a special case, need to confirm how to describe their supported frameworks.