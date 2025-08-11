# Container image updates in .NET 10 Preview 2 - Release Notes

Here's a summary of what's new in container images in this preview release:

- [Native AOT SDK images](#native-aot-sdk-images)

## Native AOT SDK images

Native AOT .NET apps have faster startup time, smaller memory footprints, and can run on machines that don't have the .NET runtime installed.

For .NET 10, we are publishing new .NET SDK image variants that support building [Native AOT](https://learn.microsoft.com/dotnet/core/deploying/native-aot) apps.

The images are intended for two primary scenarios:

- Building container images that contain a Native AOT app, using the SDK image in a multi-stage Dockerfile
- Building Native AOT .NET executables using the SDK image as a containerized build environment

See the [.NET Native AOT Dockerfile samples](https://github.com/dotnet/dotnet-docker/tree/main/samples/releasesapi) for details on how to use the new Native AOT SDK images.

The following images have been added to the `dotnet/sdk` repo:

- `10.0-noble-preview-aot` (Also tagged as `10.0-preview-aot`)
- `10.0-preview-alpine-aot`
- `10.0-preview-azurelinux3.0-aot`

For more information, see:

- [.NET 10 SDK AOT container images (Announcement)](https://github.com/dotnet/dotnet-docker/discussions/6312)
- [Provide Officially-Supported .NET AOT Images](https://github.com/dotnet/dotnet-docker/issues/5020)
