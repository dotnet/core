# .NET Support and Compatibility for Linux Distributions

.NET can be run on almost any Linux distribution, via:

- Portable builds, which are built to be broadly compatible with most Linux distributions.
- Distribution-specific builds, which are built specifically for a given distribution version (like Red Hat Enterprise Linux 9 or Ubuntu 24.04).

The community provides best effort support for .NET across all Linux distributions. [Commercial support](support.md) is provided for some popular distributions.

## General dependencies

.NET has multiple dependencies that must be installed:

- [.NET 6 dependencies](./release-notes/6.0/linux-packages.md)
- [.NET 8 dependencies](./release-notes/8.0/linux-packages.md)
- [.NET 9 dependencies](./release-notes/9.0/linux-packages.md)

## Portable build compatibility

Portable builds are compiled with an [intentionally old Linux version](https://github.com/dotnet/runtime/issues/83428) in order to provide broad compatibility. The primary purpose of this approach is linking to a sufficiently old libc library. The minimum supported libc version is documented in [.NET Supported OS Policy](./os-lifecycle-policy.md).

Microsoft build portable builds supports both [glibc](https://www.gnu.org/software/libc/)-based and [musl libc](https://musl.libc.org/)-based Linux distributions.

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

## Red Hat Enterprise Linux support

New .NET versions will typically only be supported on Red Hat Enterprise Linux (RHEL) versions in active support.

- RHEL 7 is considered in maintenance.
- RHEL 8 is considered in active support.
- RHEL 9 is considered in active support.

RHEL compatible distributions are supported, including: AlmaLinux, CentOS Stream, Oracle Linux, and Rocky Linux.
