# .NET 11.0 Linux package dependencies

.NET 11.0 has several dependencies that must be installed to run .NET apps. The install commands for each supported Linux distribution are listed below.

Tips:

- [runtime-deps container images](https://github.com/dotnet/dotnet-docker/tree/main/src/runtime-deps) install these same packages.
- [pkgs.org](https://pkgs.org/) is useful for searching packages across distributions.

## Packages

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

[0]: https://github.com/dotnet/core/blob/main/release-notes/11.0/supported-os.md#linux-compatibility
[1]: https://gcc.gnu.org/onlinedocs/gccint/Libgcc.html
[2]: https://www.redhat.com/sysadmin/ca-certificates-cli
[3]: https://www.openssl.org/
[4]: https://gcc.gnu.org/onlinedocs/libstdc++/
[5]: https://icu.unicode.org
[6]: https://data.iana.org/time-zones/tz-link.html
[7]: https://web.mit.edu/kerberos

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

## Red Hat Enterprise Linux

### Red Hat Enterprise Linux 10

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

### Red Hat Enterprise Linux 9

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

### Red Hat Enterprise Linux 8

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

## SUSE Linux Enterprise Server

### SUSE Linux Enterprise Server 16.0

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

### SUSE Linux Enterprise Server 15.7

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

### SUSE Linux Enterprise Server 15.6

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

## Ubuntu

### Ubuntu 26.04 LTS (Resolute Raccoon)

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
