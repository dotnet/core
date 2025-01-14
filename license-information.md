# License Information

The .NET project uses source and binaries from multiple sources that may be important to your use of .NET.

This document is provided for informative purposes only and is not itself a license.

## Source code

.NET source uses the MIT license.

[Each repo](./Documentation/core-repos.md) has:

- A license, for example, [dotnet/runtime LICENSE.TXT](https://github.com/dotnet/runtime/blob/main/LICENSE.TXT).
- Third party notice file, for example, [dotnet/runtime THIRD-PARTY-NOTICES.TXT](https://github.com/dotnet/runtime/blob/main/THIRD-PARTY-NOTICES.TXT)

More information:

- [Project copyright guidance](https://github.com/dotnet/runtime/blob/main/docs/project/copyright.md)

## Product distributions

Product distributions use the following license:

- On Linux and macOS: [MIT license](https://github.com/dotnet/core/blob/main/LICENSE.TXT)
- On Windows: [.NET Library License](https://dotnet.microsoft.com/dotnet_library_license.htm)

Product distributions include [downloadable assets](https://dotnet.microsoft.com/download/dotnet) and [runtime packs](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-x64/).

More information:

- [Windows license information](https://github.com/dotnet/core/blob/main/license-information-windows.md).
- [.NET Asset Licensing Model](https://github.com/dotnet/runtime/blob/main/docs/project/licensing-assets.md)

## Package distributions

Library packages use the MIT license, for example [System.Text.Json](https://www.nuget.org/packages/System.Text.Json).

## Redistribution

Binaries produced by .NET SDK compilers (C#, F#, VB) can be redistributed without additional restrictions. The only restrictions are based on the license of the compiler inputs used to produce the binary.

Applications are subject to the same terms as are covered by "Product distributions" and "Package distibutions", above.

Parts of the .NET runtime are embedded in applications, including [platform-specific executable hosts](https://learn.microsoft.com/dotnet/core/deploying/deploy-with-cli#framework-dependent-executable),
and [self-contained deployments](https://learn.microsoft.com/dotnet/core/deploying/deploy-with-cli#self-contained-deployment).
