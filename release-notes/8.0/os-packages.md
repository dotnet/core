# .NET 8.0 Linux package dependencies

.NET 8.0 has several dependencies that must be satisfied to run .NET apps. The commands to install these libraries are listed for multiple Linux distributions.

Feel free to contribute packages for distributions not (yet) listed in this document, including ones not supported by the .NET Team.

Tips:

- [runtime-deps container images](https://github.com/dotnet/dotnet-docker/tree/main/src/runtime-deps) installs these same packages. You can look at those dockerfiles.
- [pkgs.org](https://pkgs.org/) is a useful site for searching for packages, to find the one for your distribution.

## Packages

.NET depends on the following packages.

- [C Library][0]
- [GCC low-level runtime library][1]
- [CA Certificates][2]
- [OpenSSL][3]
- [C++ Library][4]
- [ICU][5]
- [tz database][6]
- [Kerberos][7]

You do not need to install ICU if you [enable globalization invariant mode](https://github.com/dotnet/runtime/blob/main/docs/design/features/globalization-invariant-mode.md#enabling-the-invariant-mode).

If your app relies on `https` endpoints, you'll also need to install `ca-certificates`.

[0]: https://github.com/dotnet/core/blob/main/release-notes/8.0/supported-os.md#linux-compatibility
[1]: https://gcc.gnu.org/onlinedocs/gccint/Libgcc.html
[2]: https://www.redhat.com/sysadmin/ca-certificates-cli
[3]: https://www.openssl.org/
[4]: https://gcc.gnu.org/onlinedocs/libstdc++/
[5]: https://icu.unicode.org
[6]: https://data.iana.org/time-zones/tz-link.html
[7]: https://web.mit.edu/kerberos

## Alpine edge

```bash
sudo apk add \
    ca-certificates \
    icu-data-full \
    icu-libs \
    krb5 \
    libgcc \
    libssl3 \
    libstdc++ \
    tzdata
```

## Alpine 3.23

```bash
sudo apk add \
    ca-certificates \
    icu-data-full \
    icu-libs \
    krb5 \
    libgcc \
    libssl3 \
    libstdc++ \
    tzdata
```

## Alpine 3.22

```bash
sudo apk add \
    ca-certificates \
    icu-data-full \
    icu-libs \
    krb5 \
    libgcc \
    libssl3 \
    libstdc++ \
    tzdata
```

## Alpine 3.21

```bash
sudo apk add \
    ca-certificates \
    icu-data-full \
    icu-libs \
    krb5 \
    libgcc \
    libssl3 \
    libstdc++ \
    tzdata
```

## Alpine 3.20

```bash
sudo apk add \
    ca-certificates \
    icu-data-full \
    icu-libs \
    krb5 \
    libgcc \
    libssl3 \
    libstdc++ \
    tzdata
```

## Azure Linux 3.0

```bash
sudo tdnf install -y \
    ca-certificates \
    glibc \
    icu \
    krb5 \
    libgcc \
    libstdc++ \
    openssl-libs \
    tzdata
```

## CentOS Stream 10

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## CentOS Stream 9

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## CentOS Stream 8

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## Debian sid (Unstable)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu76 \
    libssl3t64 \
    libstdc++6 \
    tzdata
```

## Debian 13 (Trixie)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu76 \
    libssl3t64 \
    libstdc++6 \
    tzdata
```

## Debian 12 (Bookworm)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu72 \
    libssl3 \
    libstdc++6 \
    tzdata
```

## Fedora 44

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## Fedora 43

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## Fedora 42

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## Fedora 41

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## FreeBSD 14.1

```bash
sudo pkg install -A \
    icu \
    krb5
```

## openSUSE Leap 16.0

```bash
sudo zypper install -y \
    ca-certificates \
    glibc \
    krb5 \
    libgcc_s1 \
    libicu \
    libopenssl3 \
    libstdc++6 \
    timezone
```

## openSUSE Leap 15.6

```bash
sudo zypper install -y \
    ca-certificates \
    glibc \
    krb5 \
    libgcc_s1 \
    libicu \
    libopenssl3 \
    libstdc++6 \
    timezone
```

## RHEL 10

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## RHEL 9

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## RHEL 8

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## SLES 16.0

```bash
sudo zypper install -y \
    ca-certificates \
    glibc \
    krb5 \
    libgcc_s1 \
    libicu \
    libopenssl3 \
    libstdc++6 \
    timezone
```

## SLES 15.7

```bash
sudo zypper install -y \
    ca-certificates \
    glibc \
    krb5 \
    libgcc_s1 \
    libicu \
    libopenssl3 \
    libstdc++6 \
    timezone
```

## SLES 15.6

```bash
sudo zypper install -y \
    ca-certificates \
    glibc \
    krb5 \
    libgcc_s1 \
    libicu \
    libopenssl3 \
    libstdc++6 \
    timezone
```

## Ubuntu 26.04 LTS (Resolute Raccoon)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu78 \
    libssl3t64 \
    libstdc++6 \
    tzdata
```

## Ubuntu 25.10 (Questing Quokka)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu76 \
    libssl3t64 \
    libstdc++6 \
    tzdata
```

## Ubuntu 24.04 (Noble Numbat)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu74 \
    libssl3t64 \
    libstdc++6 \
    tzdata
```

## Ubuntu 22.04.4 LTS (Jammy Jellyfish)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu70 \
    libssl3 \
    libstdc++6 \
    tzdata
```
