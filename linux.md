# .NET for Linux Distributions

.NET can be installed on Linux in multiple ways, via [packages](https://learn.microsoft.com/dotnet/core/install/linux), [scripts](https://github.com/dotnet/install-scripts), or [tarballs](https://dotnet.microsoft.com/download/dotnet). It can be installed globally, locally/privately, or with an app.

.NET is supported on Linux per [.NET Support and Compatibility for Linux Distributions](linux-support.md).

## Package archives

.NET is included in the package archives of the following distributions:

- [Alpine Linux](https://pkgs.alpinelinux.org/packages?name=dotnet*)
- [Arch Linux](https://archlinux.org/packages/?q=dotnet)
- [Arch Linux User Repository](https://aur.archlinux.org/packages?K=dotnet)
- [Fedora](https://packages.fedoraproject.org/search?query=dotnet)
- [Red Hat Enterprise Linux](https://access.redhat.com/documentation/en-us/net/6.0)
- [Tizen](https://developer.samsung.com/tizen/About-Tizen.NET/Tizen.NET.html)
- [Ubuntu](https://packages.ubuntu.com/search?keywords=dotnet)

In general, you can install the .NET SDK via a versioned package, like `dotnet7` or `dotnet-sdk-7.0`. For example, on Ubuntu 22.10, you can install .NET via the following.

```bash
sudo apt update && sudo apt install -y dotnet-sdk-7.0
```

## Microsoft packages

Microsoft offers alternate package feeds at [packages.microsoft.com](http://packages.microsoft.com/) that include the Microsoft binary build of .NET. They are document at [Install .NET on Linux](https://learn.microsoft.com/dotnet/core/install/linux).

You can move back and forth between distribution and Microsoft archives using a variety of [package manager patterns](https://learn.microsoft.com/dotnet/core/install/linux-package-mixup) and [previous challenges](https://github.com/dotnet/core/issues/7699) to guide you.

## Containers

.NET containers are published to multiple registries.

- [Microsoft Artifact Repository](https://mcr.microsoft.com/catalog?search=dotnet/)
- [OpenShift](https://developers.redhat.com/blog/2018/07/05/deploy-dotnet-core-apps-openshift)
- [Ubuntu Rocks](https://hub.docker.com/r/ubuntu/dotnet-aspnet)

Microsoft publishes container images per [.NET container publishing policy](https://github.com/dotnet/dotnet-docker/blob/main/documentation/supported-platforms.md). Other distributions may have different policies.

## Building .NET from source

.NET can be built from source via [dotnet/dotnet](https://github.com/dotnet/dotnet).

For distributions publishing packages, follow [.NET Packaging Guidelines](https://learn.microsoft.com/dotnet/core/distribution-packaging#recommended-packages).
