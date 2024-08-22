# Linux Distribution Support and Compatibility

.NET can be [installed](https://learn.microsoft.com/dotnet/core/install/linux) and run on almost any Linux distribution. Packages that are available in a given distribution are compatible with that distribution. Packages and binaries from Microsoft are compatible with a broad set of distributions.

The .NET community provides [best effort support](./os-lifecycle-policy.md) across all Linux distributions. [Commercial support](support.md) is provided for some popular distributions.

## Containers

.NET containers are published to multiple registries.

- [Chainguard Images](https://images.chainguard.dev/directory/image/dotnet-sdk/versions)
- [Microsoft Artifact Repository](https://mcr.microsoft.com/catalog?search=dotnet/)
- [OpenShift](https://developers.redhat.com/blog/2018/07/05/deploy-dotnet-core-apps-openshift)
- [SUSE Linux Enterprise Server Container Images](https://registry.suse.com/repositories?languages%5B%5D=dotnet)
- [Ubuntu Rocks](https://hub.docker.com/r/ubuntu/dotnet-aspnet)

Note: Microsoft publishes container images per [.NET container publishing policy](https://github.com/dotnet/dotnet-docker/blob/main/documentation/supported-platforms.md). Other distributions may have different policies.

## Packages

.NET is included in the package archives of the following distributions:

- [Alpine Linux](https://pkgs.alpinelinux.org/packages?name=dotnet*)
- [Arch Linux](https://archlinux.org/packages/?q=dotnet)
- [Arch Linux User Repository](https://aur.archlinux.org/packages?K=dotnet)
- [Fedora](https://packages.fedoraproject.org/search?query=dotnet)
- [Red Hat Enterprise Linux](https://access.redhat.com/documentation/en-us/net/6.0)
- [Tizen](https://developer.samsung.com/tizen/About-Tizen.NET/Tizen.NET.html)
- [Ubuntu](https://packages.ubuntu.com/search?keywords=dotnet)

In general, you can install the .NET SDK via a versioned package, like `dotnet8` or `dotnet-sdk-8.0`.

```bash
sudo apt update && sudo apt install -y dotnet-sdk-8.0
```

## Microsoft packages

Microsoft offers alternate package feeds at [packages.microsoft.com](http://packages.microsoft.com/) that include the Microsoft binary build of .NET.
They are documented at [Install .NET on Linux](https://learn.microsoft.com/dotnet/core/install/linux).
You can move back and forth between distribution and Microsoft archives using a variety of [package manager patterns](https://learn.microsoft.com/dotnet/core/install/linux-package-mixup) and [previous challenges](https://github.com/dotnet/core/issues/7699) to guide you.

Microsoft is [no longer publishing packages for Ubuntu starting with Ubuntu 24.04](https://github.com/dotnet/core/discussions/9258).

[SDK feature bands](https://learn.microsoft.com/en-us/dotnet/core/releases-and-support#feature-bands-sdk-only) are the only significant difference between Microsoft and distro-provided builds. Distro-provided SDK builds are always within the `.1xx` feature band, while Microsoft SDK builds are always for the latest feature band, for example `.2xx`.

## Dependencies

.NET has multiple dependencies that must be installed. If you install .NET via packages, these packages will typically already be installed.

- [.NET 6 dependencies](./release-notes/6.0/linux-packages.md)
- [.NET 8 dependencies](./release-notes/8.0/linux-packages.md)
- [.NET 9 dependencies](./release-notes/9.0/os-packages.md)

## Portable build compatibility

Portable builds are compiled to provide [broad compatibility](https://github.com/dotnet/runtime/issues/83428). The minimum supported libc version is documented in [.NET Supported OS Policy](./os-lifecycle-policy.md).

Microsoft provides [portable builds](https://dotnet.microsoft.com/download/dotnet) that support both [glibc](https://www.gnu.org/software/libc/)-based and [musl libc](https://musl.libc.org/)-based Linux distributions.

The following examples demonstrate how to find the libc version provided for your distribution.

On Alpine 3.13:

```bash
# ldd --version
musl libc (aarch64)
Version 1.2.2
```

On Ubuntu 16.04:

```bash
# ldd --version
ldd (Ubuntu GLIBC 2.23-0ubuntu11.3) 2.23
```

## OpenSSL compatibility

Portable builds support both OpenSSL 1.x and 3.x and can be run on distributions with either version of OpenSSL. For example, Ubuntu 22.04 only includes OpenSSL 3 in its official package archive.

The highest OpenSSL version is loaded by default, but it can be [configured to use a specific version](https://github.com/dotnet/runtime/issues/79153#issuecomment-1335476471).

## Building .NET from source

.NET can be built from source via [dotnet/dotnet](https://github.com/dotnet/dotnet).

For distributions publishing packages, follow [.NET Packaging Guidelines](https://learn.microsoft.com/dotnet/core/distribution-packaging#recommended-packages).
