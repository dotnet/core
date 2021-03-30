# Linux package dependencies

.NET 6 has several dependencies that must be satisfied to run .NET apps. The commands to install these libraries are listed for multiple distributions.

Feel free to contribute packages for distributions not (yet) listed in this document, including ones not supported by the .NET Team.

Tips:

- [runtime-deps container images](https://github.com/dotnet/dotnet-docker/tree/main/src/runtime-deps) installs these same packages. You can look at those dockerfiles.
- [pkgs.org](https://pkgs.org/) is a useful site for searching for packages, to find the one for your distribution.

## Packages

.NET depends on the following packages.

- [GNU C Library (glibc)](https://www.gnu.org/software/libc/libc.html)
- [GNU C++ Library](https://gcc.gnu.org/onlinedocs/libstdc++/)
- [GCC low-level runtime library](https://gcc.gnu.org/onlinedocs/gccint/Libgcc.html)
- [ICU](http://site.icu-project.org/)
- [Kerberos](http://web.mit.edu/kerberos/)
- [Open SSL](https://www.openssl.org/)
- [zlib compression library](https://www.zlib.net/)

You do not need to install ICU if you [enable globalization invariant mode](https://github.com/dotnet/runtime/blob/main/docs/design/features/globalization-invariant-mode.md#enabling-the-invariant-mode).

If your app relies on `https` endpoints, you'll also need to install `ca-certificates`.

## Alpine 3.13

```bash
sudo apk add \
    krb5-libs \
    libgcc \
    libintl \
    libssl1.1 \
    libstdc++ \
    zlib
```

## Debian 10 "bullseye"

```bash
sudo apt-get update \
    && sudo apt-get install -y --no-install-recommends \
    libc6 \
    libgcc1 \
    libgssapi-krb5-2 \
    libicu67 \
    libssl1.1 \
    libstdc++6 \
    zlib1g
```

## Ubuntu 20.04 "focal"

```bash
sudo apt-get update \
    && sudo apt-get install -y --no-install-recommends \
    libc6 \
    libgcc1 \
    libgssapi-krb5-2 \
    libicu66 \
    libssl1.1 \
    libstdc++6 \
    zlib1g 
```

Note: Add [noninteractive](https://github.com/dotnet/dotnet-docker/blob/c0e8be8a44b47b1dcc2a5b4b2ebd92022087ac0b/src/runtime-deps/3.1/focal/arm64v8/Dockerfile#L4) for non-interactive installation.

## Ubuntu 18.04 "bionic"

```bash
sudo apt-get update \
    && sudo apt-get install -y --no-install-recommends \
    libc6 \
    libgcc1 \
    libgssapi-krb5-2 \
    libicu60 \
    libssl1.1 \
    libstdc++6 \
    zlib1g \
```

## Arch Linux (rolling build)

```bash
pacman -Sy \
    glibc \
    gcc \
    krb5 \
    icu \
    openssl \
    libc++ \
    zlib
```

Also tested on Manjaro.

Note: Arch Linux is not supported by the .NET team.
