# Docker Images and .NET Core Content Reference

In order for Docker containers to run dotnet cli commands, the sdk that you use to build your project with locally must match the dotnet sdk version inside your container. If you want a lighter-weight container and don’t need to use the cli tools inside the container, then you can pull the runtime images.

|    Docker Images   03/08/17            |    .NET Core   Runtime version in image   |    Full SDK   version number    |
|----------------------------------------|-------------------------------------------|---------------------------------|
|    1.0.4-runtime                       |    1.0.4                                  |    *None                        |
|    1.0.4-runtime-nanoserver            |    1.0.4                                  |    *None                        |
|    1.0.4-runtime-deps                  |    None                                   |    *None                        |
|    1.0.4-sdk                           |    1.0.4, 1.1.1                           |    1.0.1                        |
|    1.0.4-sdk-nanoserver                |    1.0.4, 1.1.1                           |    1.0.1                        |
|    1.1.1-runtime                       |    1.1.1                                  |    *None                        |
|    1.1.1-runtime-nanoserver            |    1.1.1                                  |    *None                        |
|    1.1.1-runtime-deps                  |    None                                   |    *None                        |
|    1.1.1-sdk                           |    1.0.4, 1.1.1                           |    1.0.1                        |
|    1.1.1-sdk-nanoserver                |    1.0.4, 1.1.1                           |    1.0.1                        |

> **Note:** Edit your project file to target the runtime you wish to use. All SDK versions work with all runtimes though the SDK is not included in the image.

To make your project target a different runtime simply edit the `netcoreapp1.0` in your project file under the framework node. For example, with MSBuild this would be changing `<TargetFramework>netcoreapp1.0</TargetFramework>` to `<TargetFramework>netcoreapp1.1</TargetFramework>` and running `dotnet restore`.