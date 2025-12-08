# .NET 10.0 Required Packages

Various packages must be installed to run .NET apps and the .NET SDK on some operating systems. This is handled automatically if .NET is [installed through archive packages](../../linux.md).

## Package Overview

| Id           | Name      | Required scenarios | Notes                                                       |
| ------------ | --------- | ------------------ | ----------------------------------------------------------- |
| [libc][0]    | C Library | All                | <https://github.com/dotnet/core/blob/main/release-notes/10.0/supported-os.md#linux-compatibility> ; <https://www.gnu.org/software/libc/libc.html> ; <https://musl.libc.org/> |
| [libgcc][1]  | GCC low-level runtime library | All | <https://gcc.gnu.org/onlinedocs/gccint/Libgcc.html>    |
| [ca-certificates][2] | CA Certificates | Https | <https://www.redhat.com/sysadmin/ca-certificates-cli>      |
| [openssl][3] | OpenSSL   | Https ; Cryptography | Minimum required version 1.1.1 ; <https://www.openssl.org/> |
| [libstdc++][4] | C++ Library | Runtime        | <https://gcc.gnu.org/onlinedocs/libstdc++/>                 |
| [libicu][5]  | ICU       | Globalization      | <https://icu.unicode.org> ; <https://github.com/dotnet/runtime/blob/main/docs/design/features/globalization-invariant-mode.md> |
| [tzdata][6]  | tz database | Globalization    | <https://data.iana.org/time-zones/tz-link.html>             |
| [krb5][7]    | Kerberos  | Kerberos           | <https://web.mit.edu/kerberos>                              |

[0]: https://pkgs.org/search/?q=libc
[1]: https://pkgs.org/search/?q=libgcc
[2]: https://pkgs.org/search/?q=ca-certificates
[3]: https://pkgs.org/search/?q=openssl
[4]: https://pkgs.org/search/?q=libstdc++
[5]: https://pkgs.org/search/?q=libicu
[6]: https://pkgs.org/search/?q=tzdata
[7]: https://pkgs.org/search/?q=krb5

## Alpine

### Alpine 3.22

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

### Alpine 3.21

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

## Debian

### Debian 13 (Trixie)

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

### Debian 12 (Bookworm)

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

## Fedora

### Fedora 43

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

### Fedora 42

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

## FreeBSD

### FreeBSD 14.1

```bash
sudo pkg install -A \
    icu \
    krb5
```

## openSUSE Leap

### openSUSE Leap 16.0

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

### openSUSE Leap 15.6

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

## SLES

### SLES 16.0

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

### SLES 15.7

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

### SLES 15.6

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

## Azure Linux

### Azure Linux 3.0

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

## CentOS Stream

### CentOS Stream 10

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

### CentOS Stream 9

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

### CentOS Stream 8

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

## RHEL

### RHEL 10

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

### RHEL 9

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

### RHEL 8

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

## Ubuntu

### Ubuntu 26.04 LTS (Resolute Raccoon)

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

### Ubuntu 25.10 (Questing Quokka)

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

### Ubuntu 24.04 (Noble Numbat)

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

### Ubuntu 22.04.4 LTS (Jammy Jellyfish)

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

## About

This file is generated from [os-packages.json](os-packages.json).
