# .NET Package Servicing Model

Most packages in the .NET ecosystem support only the latest version. Many packages from the .NET team operate on this same model. A subset of our packages operate on another model where multiple version bands are supported at the same time, matching in-support runtimes, offering more flexibility to users.

Users should aim to maintain their package references to be as close to the supported version as possible. Being close to a supported version means that you have most or all security fixes and likely have no latent compatibility risk that can be present when there is a big gap between your reference and the supported version.

## Latest version servicing

The default package servicing model is “latest version”. The team publishes an updated package with a security and/or functionality fix. Users can upgrade to the new latest version to get the fix.

The following libraries use this servicing model:

- [.NET Aspire](https://github.com/dotnet/aspire)
- [.NET Platform Extensions](https://github.com/dotnet/extensions)
- [ML.NET](https://github.com/dotnet/machinelearning)
- [Maintenance-packages](https://github.com/dotnet/maintenance-packages)

## Runtime-band servicing

Some packages match a library (in name and content) in the runtime. In this case, the team publishes  fixes for the library in the runtime and the package at the same time. The version numbers will match. Users can upgrade to the new latest patch version to get the fix.

Users can upgrade to the latest library version (like 8.0.x) that matches a supported runtime (like 8.0). Users can also move to the latest patch of a newer major version (like 9.0.x) provided that the runtime is still in support.

The advantage of matching versions is that the runtime library will be used in place of the package, resulting in smaller deployments and servicing being provided by the runtime. The advantage of using a newer package version is getting access to newer functionality.

It common for .NET Standard libraries to have a reference to these libraries. Libraries and app projects only need a reference if they need access to newer features in a later major version (than their target framework exposes).

The following libraries use this servicing model:

- [Microsoft.Extensions.DependencyInjection](https://www.nuget.org/packages/Microsoft.Extensions.DependencyInjection)
- [System.Text.Json](https://www.nuget.org/packages/System.Text.Json)
- [System.Diagnostics.DiagnosticSource](https://www.nuget.org/packages/System.Diagnostics.DiagnosticSource)
- [ASP.NET Core Packages](https://github.com/dotnet/aspnetcore)
- [Entity Framework Core Packages](https://github.com/dotnet/efcore)

## Support

Users must be on the latest patch version of the package or a runtime-band to be supported.

## Compatibility

Packages retain compatibility for supported .NET versions. A package will not drop support for a .NET version that is in support. When a .NET version goes out of support, packages released after that point may drop support for that .NET version.

Mechanically, a package can support multiple target frameworks via either of two approaches:

- Multi-targeting: A project supports and is built for multiple target frameworks, resulting in assets supporting multiple .NET versions in a NuGet package.
- Branching: A project exists and is built in multiple branches, each targeting a specific target framework and resulting multiple packages that each include a single asset supporting a specific .NET version.

The differences in these approaches are user observable and require users to adopt different patterns with package references. It's the difference between the two versioning strategies defined earlier. They are also patterns that users can adopt for themselves with their own packages.

## End of Life

.NET packages are no longer supported when either of the following occurs:

- A new patch version of the package is available.
- The package exclusively includes implementations for out-of-support .NET versions.

Nuget.org includes [version](https://www.nuget.org/packages/System.Text.Json/#versions-body-tab) and [supported framework](https://www.nuget.org/packages/System.Text.Json/#supportedframeworks-body-tab) information that can be used to determine support status for packages.

It is important to avoid using packages that are no longer maintained. They may be missing security patches for known vulnerabilities.
