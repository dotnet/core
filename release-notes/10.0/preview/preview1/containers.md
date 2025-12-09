# Container image updates in .NET 10 Preview 1 - Release Notes

.NET 10 Preview 1 includes the following updates for container images:

- [`10.0-preview` tags use Ubuntu 24.04](#100-preview-tags-use-ubuntu-2404)
- [Ubuntu Chiseled images now contain the Chisel manifest](#ubuntu-chiseled-images-now-contain-the-chisel-manifest)

## `10.0-preview` tags use Ubuntu 24.04

The default OS for .NET tags has been changed from Debian to Ubuntu.
This applies to all .NET tags that do not explicitly specify an OS.

- `docker pull mcr.microsoft.com/dotnet/sdk:10.0-preview` - Refers to Ubuntu 24.04 "Noble Numbat"
- `docker pull mcr.microsoft.com/dotnet/sdk:10.0-preview-noble` - Also refers to Ubuntu 24.04 "Noble Numbat"

For more information, see:

- [Platforms for .NET 10 container images](https://github.com/dotnet/dotnet-docker/discussions/6539)
- [.NET containers supported platforms](https://github.com/dotnet/dotnet-docker/blob/main/documentation/supported-platforms.md)
- [Proposal: Switch to Ubuntu for .NET convenience tags (dotnet/dotnet-docker#5709)](https://github.com/dotnet/dotnet-docker/discussions/5709)

## Ubuntu Chiseled images now contain the Chisel manifest

[Ubuntu Chiseled](https://github.com/dotnet/dotnet-docker/edit/main/documentation/ubuntu-chiseled.md) images are a type of distroless container image that contain only the minimal set of packages .NET needs, with everything else removed. New for .NET 10, Ubuntu Chiseled images include the [Chisel manifest].
The Chisel manifest describes the package contents of the image and can also be used to install additional packages on top of existing Chiseled base images.

Ubuntu Chiseled base images:

- `docker pull mcr.microsoft.com/dotnet/aspnet:10.0-preview-noble-chiseled`
- `docker pull mcr.microsoft.com/dotnet/runtime:10.0-preview-noble-chiseled`
- `docker pull mcr.microsoft.com/dotnet/runtime-deps:10.0-preview-noble-chiseled`

Other [image variants](https://github.com/dotnet/dotnet-docker/blob/main/documentation/image-variants.md) are also available. For more information, see:

- [How do I install additional packages on Chiseled images?](https://github.com/dotnet/dotnet-docker/blob/main/documentation/ubuntu-chiseled.md#how-do-i-install-additional-packages-on-chiseled-images)
- [Chisel manifest documentation][Chisel manifest]
- [PR: Add documentation for installing additional slices on Ubuntu Chiseled images (dotnet/dotnet-docker#6187)](https://github.com/dotnet/dotnet-docker/pull/6187).

[Chisel manifest]: https://discourse.ubuntu.com/t/chisel-manifest-is-supported-in-newly-released-v1-0-0/48944
