# .NET Support and Compatibility for Linux Distributions

.NET is [supported by Microsoft](os-lifecycle-policy.md) and by [various commercial vendors and the community](linux.md) on multiple Linux distributions.

.NET can typically be run on any Linux distribution, via:

- The Microsoft build, which is built to be broadly compatible.
- Distribution-specific builds, which are built specifically for a given distribution version (like Red Hat Enterprise Linux 9 or Ubuntu 22.04).

## General dependencies

Microsoft builds have multiple dependencies that must be installed:

- [.NET 6 dependencies](./release-notes/6.0/linux-packages.md)
- [.NET 7 dependencies](./release-notes/7.0/linux-packages.md)

## libc compatibility

Microsoft builds supports both [glibc](https://www.gnu.org/software/libc/)-based and [musl libc](https://musl.libc.org/)-based Linux distributions, per the following minimum version information.

- [.NET 6 minimum libc](release-notes/6.0/supported-os.md#libc-compatibility)
- [.NET 7 minimum libc](release-notes/7.0/supported-os.md#libc-compatibility)

You can use the following pattern to determine the libc version provided for your distribution.

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

Microsoft builds support both OpenSSL 1.x and 3.x and can be run on distributions with either version of this package. For example, Ubuntu 22.04 only includes OpenSSL 3 in its official package archive.

Microsoft builds will generally load the highest OpenSSL version it finds, but can be configured to use a specific version.

## Red Hat Enterprise Linux Family support

Microsoft builds support multiple Red Hat versions. New .NET versions will typically only be supported on RHEL era distributions in active support.

- RHEL 7 era distributions are considered in maintenance.
- RHEL 8 era distributions are considered in active support.
- RHEL 9 era distributions are considered in active support.

Red Hat family distributions include: AlmaLinux, CentOS, Oracle Linux, Red Hat Enterprise Linux, and Rocky Linux.

## Red Hat Commercial Support

Red Hat supports .NET via [Red Hat Enterprise Linux](http://redhatloves.net/), per the following.

- .NET 6 is supported in RHEL 7+.
- .NET 7 is supported in RHEL 8+.

## Ubuntu Commercial Support

Canonical supports .NET on Ubuntu via APT archives, per the following.

- .NET 6 is supported in Ubuntu 22.04+.
- .NET 7 is supported in Ubuntu 22.10+.
