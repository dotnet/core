# .NET for Linux Distributions

.NET can be [installed on Linux](https://learn.microsoft.com/dotnet/core/install/linux) in multiple ways, via packages, [scripts](https://github.com/dotnet/install-scripts), or [tarballs](https://dotnet.microsoft.com/en-us/download). It can be installed globally, locally/privately, or with an app.

.NET is supported on Linux per [.NET Support and Compatibility for Linux Distributions](linux-support.md).

## Official archives

.NET is included in the [archives](https://pkgs.org/download/dotnet) of the following distributions:

- [Alpine Linux](https://pkgs.alpinelinux.org/packages?name=dotnet*)
- [Arch Linux](https://archlinux.org/packages/?q=dotnet)
- [Arch Linux User Repository](https://aur.archlinux.org/packages?K=dotnet)
- [Fedora](https://packages.fedoraproject.org/search?query=dotnet)
- [Red Hat Enterprise Linux](https://access.redhat.com/documentation/en-us/net/6.0)
- [Ubuntu](https://packages.ubuntu.com/search?keywords=dotnet)

In general, you can install the .NET SDK via a versioned package, like `dotnet7` or `dotnet-sdk-7.0`. For example, on Ubuntu 22.10, you can install .NET via the following.

```bash
sudo apt update && sudo apt install -y dotnet-sdk-7.0
```

See [Install .NET on Linux](https://learn.microsoft.com/dotnet/core/install/linux) for extensive install instructions.

## Containers

.NET containers are published to multiple registries.

- [Microsoft Artifact Repository](https://mcr.microsoft.com/catalog?search=dotnet/)
- [OpenShift](https://developers.redhat.com/blog/2018/07/05/deploy-dotnet-core-apps-openshift)
- [Ubuntu Rocks](https://hub.docker.com/r/ubuntu/dotnet-aspnet)

Microsoft publishes container images per [.NET container publishing policy](https://github.com/dotnet/dotnet-docker/blob/main/documentation/supported-platforms.md).

## Building .NET from source

.NET can be built from source via [dotnet/source-build](https://github.com/dotnet/source-build). This capability is expanding with [dotnet/dotnet](https://github.com/dotnet/dotnet) (which also uses source-build).

For distributions publishing packages, please follow the [official packaging guidelines](https://learn.microsoft.com/dotnet/core/distribution-packaging#recommended-packages).
