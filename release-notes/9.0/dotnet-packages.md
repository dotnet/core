# .NET 9.0 Linux packages

.NET 9.0 is available in the package feeds of the following Linux distributions.

| Distribution | Version | Feed |
| ------------ | ------- | ---- |
| Alpine       | Alpine edge | Built-in |
| Alpine       | Alpine 3.23 | Built-in |
| Alpine       | Alpine 3.22 | Built-in |
| Alpine       | Alpine 3.21 | Built-in |
| CentOS Stream | CentOS Stream 10 | Built-in |
| CentOS Stream | CentOS Stream 9 | Built-in |
| Fedora       | Fedora 43 | Built-in |
| Fedora       | Fedora 42 | Built-in |
| Red Hat Enterprise Linux | Red Hat Enterprise Linux 10 | Built-in |
| Red Hat Enterprise Linux | Red Hat Enterprise Linux 9 | Built-in |
| Red Hat Enterprise Linux | Red Hat Enterprise Linux 8 | Built-in |
| Ubuntu       | Ubuntu 26.04 LTS (Resolute Raccoon) | Backports PPA |
| Ubuntu       | Ubuntu 25.10 (Questing Quokka) | Built-in |
| Ubuntu       | Ubuntu 24.04 (Noble Numbat) | Backports PPA |
| Ubuntu       | Ubuntu 22.04.4 LTS (Jammy Jellyfish) | Backports PPA |

## Alpine

### Alpine edge

```bash
sudo apk add \
    aspnetcore9-runtime \
    dotnet9-runtime \
    dotnet9-sdk
```

### Alpine 3.23

```bash
sudo apk add \
    aspnetcore9-runtime \
    dotnet9-runtime \
    dotnet9-sdk
```

### Alpine 3.22

```bash
sudo apk add \
    aspnetcore9-runtime \
    dotnet9-runtime \
    dotnet9-sdk
```

### Alpine 3.21

```bash
sudo apk add \
    aspnetcore9-runtime \
    dotnet9-runtime \
    dotnet9-sdk
```

## CentOS Stream

### CentOS Stream 10

```bash
sudo dnf install -y \
    aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```

### CentOS Stream 9

```bash
sudo dnf install -y \
    aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```

## Fedora

### Fedora 43

```bash
sudo dnf install -y \
    aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```

### Fedora 42

```bash
sudo dnf install -y \
    aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```

## Red Hat Enterprise Linux

### Red Hat Enterprise Linux 10

```bash
sudo dnf install -y \
    aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```

### Red Hat Enterprise Linux 9

```bash
sudo dnf install -y \
    aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```

### Red Hat Enterprise Linux 8

```bash
sudo dnf install -y \
    aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```

## Ubuntu

### Ubuntu 26.04 LTS (Resolute Raccoon)

**Backports PPA:**

Register the feed:

```bash
sudo add-apt-repository ppa:dotnet/backports && sudo apt-get update
```

```bash
sudo apt-get update && \
sudo apt-get install -y \
    dotnet-aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```

### Ubuntu 25.10 (Questing Quokka)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```

### Ubuntu 24.04 (Noble Numbat)

**Backports PPA:**

Register the feed:

```bash
sudo add-apt-repository ppa:dotnet/backports && sudo apt-get update
```

```bash
sudo apt-get update && \
sudo apt-get install -y \
    dotnet-aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```

### Ubuntu 22.04.4 LTS (Jammy Jellyfish)

**Backports PPA:**

Register the feed:

```bash
sudo add-apt-repository ppa:dotnet/backports && sudo apt-get update
```

```bash
sudo apt-get update && \
sudo apt-get install -y \
    dotnet-aspnetcore-runtime-9.0 \
    dotnet-runtime-9.0 \
    dotnet-sdk-9.0
```
