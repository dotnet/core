# Support Policy for .NET Packages

.NET library packages provide additional functionality that complements the .NET libraries and application frameworks like ASP.NET Core. The library packages have the same [support model as the .NET versions](https://dotnet.microsoft.com/en-us/platform/support/policy) that they target.
For example, [Microsoft.Extensions.Logging](https://www.nuget.org/packages/Microsoft.Extensions.Logging/#supportedframeworks-body-tab) supports multiple .NET versions via the frameworks it targets.

Our packages support any target framework versions that are currently in-support. You can find the currently in-support target framework versions in the following documents:

- .NET: https://dotnet.microsoft.com/en-us/platform/support/policy
- .NET Framework: https://dotnet.microsoft.com/en-us/learn/dotnet/what-is-dotnet-framework
- The minimum in-support .NET Standard version depends on the minimum .NET and .NET Framework version currently in-support by the package and the consuming project. Packages and projects targeting .NET Standard are expected to be compatible between each other by following the same rules specified by our .NET Standard policy: https://learn.microsoft.com/en-us/dotnet/standard/net-standard

## Reporting issues

Developers should report issues in the repo that owns the package, if they know which one it is (https://github.com/dotnet/runtime, https://github.com/dotnet/aspnetcore). When in doubt, we encourage you to report the issue directly in https://github.com/dotnet/runtime, and the repo maintainers will be happy to help transfer the issue to the rightful owners.

There are some assemblies that used to be published out of a .NET version that is currently out of support, but the packages themselves are still supported because they still target a supported .NET version. For these few special cases, we host their source code in the https://github.com/dotnet/maintenance-packages repo. We still encourage users to report issues for these assemblies directly in the central repo https://github.com/dotnet/runtime.