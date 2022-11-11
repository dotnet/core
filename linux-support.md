# .NET Support and Compatibility for Linux Distributions

.NET is officially supported on multiple [Linux distributions](os-support-lifecycle.md) and [supported by the community on several others](linux.md).

There are various aspects of compatibility to consider.

## libc compatibility

.NET supports both [glibc](https://www.gnu.org/software/libc/)- and [musl libc](https://musl.libc.org/)-based Linux distributions. [.NET release notes](release-notes/README.md) specify the minimum required libc version (for example for [.NET 6](release-notes/6.0/supported-os.md#linux)). You can use this version information to determine if a given .NET version will run on a given Linux distribution.

On Alpine 3.16:

```bash
# ldd --version
musl libc (aarch64)
Version 1.2.3
```

On Ubuntu 22.04:

```bash
# ldd --version
ldd (Ubuntu GLIBC 2.35-0ubuntu3.1) 2.35
```

## OpenSSL compatibility

.NET 6 and later versions support both OpenSSL 1.x and 3.x and can be run on distributions with either version of this package. For example, Ubuntu 22.04 only includes OpenSSL 3 in its official package archive. Previous .NET versions only support OpenSSL 1.x.

.NET has two policies for OpenSSL:

- When built into a distro archive, .NET will load a specific OpenSSL version, per the distro archive policy.
- When built by Microsoft (as a portable Linux build), .NET will the highest OpenSSL version it finds (that it supports), but can be configured to use a specific version.

## Linux distributions support

.NET can typically be run on any Linux distribution.  Commercially supported distributions are listed in [.NET Supported OS Policy](./os-lifecycle-policy.md), while other distributions are supported at best effort per the compatibility rules above.

.NET can be installed on your distribution using one of the follow approaches:

* Install from the [official archive for your distribution](./linux.md).
* Install the [Microsoft Linux build](https://dotnet.microsoft.com/download), which is built to run on any distro with compatible dependencies (including libc).
* Build from source via [dotnet/source-build](https://github.com/dotnet/source-build).

## Red Hat Family support

.NET is supported on Red Hat family distributions, including [Red Hat Enterprise Linux](http://redhatloves.net/).

* RHEL 7 era distributions are considered in maintenance.
* RHEL 8 era distributions are considered in active support.
* RHEL 9 era distributions are considered in active support.

New .NET versions will typically only be supported on RHEL era distributions in active support. Check [release notes](./release-notes/README.md) for a given .NET version for specific support information.

Red Hat family distributions include: AlmaLinux, CentOS, Fedora, Oracle Linux, Red Hat Enterprise Linux, and Rocky Linux.
