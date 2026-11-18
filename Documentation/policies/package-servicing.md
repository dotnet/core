# .NET Package Servicing Model

It is important to understand the .NET package servicing model to ensure your use is supported and you stay up to date with security patches. You are recommended to maintain package versions as close to the supported version as possible. Being close to a supported version means that you have most or all security fixes and likely have no latent compatibility risk that could delay updates.

The .NET Team uses multiple policies for package servicing and deprecation, some of which that differ dependending on the package.

See [.NET Support](../../support.md) for more general information.

## Latest-version servicing

The default package servicing model is "latest version". The team publishes an updated package with a security and/or functionality fixes. 

Support: only the latest package version is supported.

The following libraries use this servicing model:

- [Aspire](https://github.com/microsoft/aspire)
- [.NET Platform Extensions](https://github.com/dotnet/extensions)
- [ML.NET](https://github.com/dotnet/machinelearning)
- [Maintenance-packages](https://github.com/dotnet/maintenance-packages)

## Runtime-library servicing

Some packages match a runtime library (in name and content), like System.Text.Json. In this case, the team publishes fixes for the library in the runtime and the package at the same time. The version numbers will match. In the typical case, there will be multiple releases on the same day, like .NET 10 and 11 runtimes and .NET 10 and 11 packages for runtime-libraries. We update the packages even if they have had no fixes. That's done, in part, to make the version numbers match.

Support: the latest package version of each supported .NET version band is supported, like 10.0.latest and 11.0.latest.

You only need to reference runtime-library packages if you want a later version of the package than what comes with the runtime distribution. For example, if you are targeting `net10.0` and need to use the .NET 11 version System.Text.Json, then you need an `11.0.x` version `PackageReference`. If you are targeting `net10.0` and only need the .NET 10 version of System.Text.Json, then you do not need a `PackageReference` for the runtime-library. See [Package Pruning](https://devblogs.microsoft.com/dotnet/nuget-package-pruning-in-dotnet-10/) for more insight.

The advantage of using runtime libraries directly (no `PackageRef`) is smaller deployments and servicing being provided by the runtime, at least for apps that use framework-dependent deployments. The advantage of using a newer package version is getting access to newer functionality.

The following libraries use this servicing model:

- [Microsoft.Extensions.DependencyInjection](https://www.nuget.org/packages/Microsoft.Extensions.DependencyInjection)
- [System.Text.Json](https://www.nuget.org/packages/System.Text.Json)
- [System.Diagnostics.DiagnosticSource](https://www.nuget.org/packages/System.Diagnostics.DiagnosticSource)
- [ASP.NET Core Packages](https://github.com/dotnet/aspnetcore)
- [Entity Framework Core Packages](https://github.com/dotnet/efcore)

## Support

Users must be on the latest patch version of the package to be supported, per the policies above.

## Compatibility

Packages will support a given set of .NET versions until .NET version EOL. A package will not drop support for a .NET version that is in support. After that point, a new version of a package may drop support for a given target framework, which could cause a build or runtime break for an out-of-support .NET version.

Some packages support [.NET Standard](https://learn.microsoft.com/dotnet/standard/net-standard). This does not mean that all possible .NET Standard targets are supported or that an implementation is provided. Instead, it means that the package exposes a .NET Standard compatible API and provides implementations for in-support .NET versions and operating systems.

You may need to pin to a specific package version in the case that a given package is no longer compatible with your environment, such as is you are using an EOL runtime. Doing that would mean you are no longer in a supported state or receiving security updates.

## End of Life

.NET packages are no longer supported when either of the following occurs:

- A new patch version of the package is available.
- The package exclusively includes implementations for out-of-support .NET versions.

Nuget.org includes [version](https://www.nuget.org/packages/System.Text.Json/#versions-body-tab) and [supported framework](https://www.nuget.org/packages/System.Text.Json/#supportedframeworks-body-tab) information that can be used to determine support status for packages.

It is important to avoid using packages that are no longer maintained. They may be missing security patches for known vulnerabilities.
