# License Information

The .NET project uses source and binaries from multiple sources that may be important to your use of .NET.

This document is provided for informative purposes only and is not itself a license.

## Source code

.NET source uses the MIT license. There are several [project repos](./Documentation/core-repos.md).

Each repo has:

- A license, for example, [dotnet/runtime LICENSE.TXT](https://github.com/dotnet/runtime/blob/main/LICENSE.TXT).
- Third party notice file, for example, [dotnet/runtime THIRD-PARTY-NOTICES.TXT](https://github.com/dotnet/runtime/blob/main/THIRD-PARTY-NOTICES.TXT)

Third party notice files are used to document source copied (and possibly further modified) from other projects.

[Project copyright guidance](https://github.com/dotnet/runtime/blob/main/docs/project/copyright.md) provides more details on our policies.

## Binaries

Microsoft built binaries use the MIT license, for:

- NuGet packages
- Runtime (including ASP.NET Core) and SDK builds for Linux and macOS

The .NET runtime [statically links some binaries](https://github.com/dotnet/runtime/tree/main/src/native/external), all of which are compatible with the specified runtime license.

[Windows builds](license-information-windows.md) carry additional license terms, for closed source dependencies. These terms apply to runtimes (including ASP.NET Core), NuGet runtime packs, and SDK builds, but not to NuGet library packages.

See [.NET Asset Licensing Model](https://github.com/dotnet/runtime/blob/main/docs/project/licensing-assets.md) for more information.

Note: The licensing of .NET builds provided by other parties may differ.

## Redistribution

Binaries produced by .NET SDK compilers (C#, F#, VB) can be redistributed without additional restrictions. The only restrictions are based on the license of the compiler inputs used to produce the binary.

Parts of the .NET runtime are embedded in applications, including [platform-specific executable hosts](https://learn.microsoft.com/dotnet/core/deploying/deploy-with-cli#framework-dependent-executable), and [self-contained deployments](https://learn.microsoft.com/dotnet/core/deploying/deploy-with-cli#self-contained-deployment), are subject to [.NET](https://github.com/dotnet/dotnet/blob/main/LICENSE.TXT) and [third-party notice](https://github.com/dotnet/dotnet/blob/main/THIRD-PARTY-NOTICES.txt) license terms.

Binaries that target Windows are subject to [additional terms](license-information-windows.md).
