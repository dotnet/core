# .NET Support and Compatibility for Linux Distributions

.NET is supported by various [commercial and community organizations](support.md) on [multiple Linux distributions](linux.md).

.NET can be run on any Linux distribution, via:

- Portable builds, which are built to be broadly compatible with most Linux distributions.
- Distribution-specific builds, which are built specifically for a given distribution version (like Red Hat Enterprise Linux 9 or Ubuntu 22.04).

Microsoft builds are portable builds.

## General dependencies

Portable builds have multiple dependencies that must be installed:

- [.NET 6 dependencies](./release-notes/6.0/linux-packages.md)
- [.NET 7 dependencies](./release-notes/7.0/linux-packages.md)
- [.NET 8 dependencies](./release-notes/8.0/linux-packages.md)

## libc compatibility

Portable builds supports both [glibc](https://www.gnu.org/software/libc/)-based and [musl libc](https://musl.libc.org/)-based Linux distributions, per the following minimum version information.

- [.NET 6 minimum libc](release-notes/6.0/supported-os.md#libc-compatibility)
- [.NET 7 minimum libc](release-notes/7.0/supported-os.md#libc-compatibility)
- [.NET 8 minimum libc](release-notes/8.0/supported-os.md#libc-compatibility)

You can use the following pattern to determine the libc version provided for your distribution.

On Alpine:

```bash
# ldd --version
musl libc (aarch64)
Version 1.2.3
```

On Ubuntu:

```bash
# ldd --version
ldd (Ubuntu GLIBC 2.35-0ubuntu3.1) 2.35
```

## OpenSSL compatibility

Portable builds support both OpenSSL 1.x and 3.x and can be run on distributions with either version of OpenSSL. For example, Ubuntu 22.04 only includes OpenSSL 3 in its official package archive.

The highest OpenSSL version is loaded by default, but it can be [configured to use a specific version](https://github.com/dotnet/runtime/issues/79153#issuecomment-1335476471).

## Red Hat Enterprise Linux support

New .NET versions will typically only be supported on Red Hat Enterprise Linux (RHEL) versions in active support.

- RHEL 7 is considered in maintenance.
- RHEL 8 is considered in active support.
- RHEL 9 is considered in active support.

RHEL compatible distributions are supported, including: AlmaLinux, CentOS, Oracle Linux, and Rocky Linux. 
