# License Information

The .NET project uses source and binaries from multiple sources. The MIT license is the primary license used, however, there are some exceptions.

[Windows builds](license-information-windows.md) are the most notable difference, which carry additional license terms.

This document is provided for informative purposes only and is not itself a license.

## Source code

.NET source is held in a variety of [project repos](./Documentation/core-repos.md). They use the MIT license, for example, [dotnet/runtime LICENSE.TXT](https://github.com/dotnet/runtime/blob/main/LICENSE.TXT).

Project repos may include source from other projects, and include a matching third-party notice for copied and modified source, for example [dotnet/runtime THIRD-PARTY-NOTICES.TXT](https://github.com/dotnet/runtime/blob/main/THIRD-PARTY-NOTICES.TXT).

[Project copyright guidance](https://github.com/dotnet/runtime/blob/main/docs/project/copyright.md) provides more details on our policies.

## Binaries

Project binaries (like the .NET runtime distribution) primarily use the MIT license. Binaries built for macOS and Linux exclusively use the MIT license.

[Windows builds](license-information-windows.md) carry additional license terms, for closed source dependencies.

## Redistribution

Binaries produced by .NET SDK compilers (C#, F#, VB) can be redistributed without additional restrictions. The only restrictions are based on the license of the compiler inputs used to produce the binary.

Parts of the .NET runtime are embedded in applications, including [platform-specific executable hosts](https://learn.microsoft.com/dotnet/core/deploying/deploy-with-cli#framework-dependent-executable), and [self-contained deployments](https://learn.microsoft.com/dotnet/core/deploying/deploy-with-cli#self-contained-deployment), are subject to [.NET](https://github.com/dotnet/dotnet/blob/main/LICENSE.TXT) and [third-party notice](https://github.com/dotnet/dotnet/blob/main/THIRD-PARTY-NOTICES.txt) license terms.

Binaries that target Windows are subject to [additional terms](license-information-windows.md).
