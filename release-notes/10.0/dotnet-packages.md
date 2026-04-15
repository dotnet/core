# .NET 10.0 Linux packages

.NET 10.0 is available in the package feeds of the following Linux distributions.

| Distribution  | Version                              | Feed           |
| ------------- | ------------------------------------ | -------------- |
| Alpine        | Alpine edge                          | Built-in       |
| Alpine        | Alpine 3.23                          | Built-in       |
| Arch Linux    | Arch Linux (rolling)                 | Built-in, AUR  |
| CentOS Stream | CentOS Stream 10                     | Built-in       |
| CentOS Stream | CentOS Stream 9                      | Built-in       |
| Fedora        | Fedora 44                            | Built-in       |
| Fedora        | Fedora 43                            | Built-in       |
| Fedora        | Fedora 42                            | Built-in       |
| Homebrew      | Homebrew (rolling)                   | Built-in, Cask |
| NixOS         | NixOS 25.11                          | Built-in       |
| RHEL          | RHEL 10                              | Built-in       |
| RHEL          | RHEL 9                               | Built-in       |
| RHEL          | RHEL 8                               | Built-in       |
| Ubuntu        | Ubuntu 26.04 LTS (Resolute Raccoon)  | Built-in       |
| Ubuntu        | Ubuntu 25.10 (Questing Quokka)       | Built-in       |
| Ubuntu        | Ubuntu 24.04 (Noble Numbat)          | Built-in       |
| Ubuntu        | Ubuntu 22.04.4 LTS (Jammy Jellyfish) | Backports PPA  |

## Alpine

### Alpine edge

```bash
sudo apk add \
    aspnetcore10-runtime \
    dotnet10-runtime \
    dotnet10-sdk
```

### Alpine 3.23

```bash
sudo apk add \
    aspnetcore10-runtime \
    dotnet10-runtime \
    dotnet10-sdk
```

## Arch Linux

### Arch Linux (rolling)

```bash
sudo pacman -S \
    dotnet-runtime \
    dotnet-sdk
```

**AUR:**

Register the feed:

```bash
# Install from AUR using an AUR helper (e.g. yay, paru)
```

```bash
sudo pacman -S \
    aspnet-runtime-bin \
    dotnet-runtime-bin \
    dotnet-sdk-bin
```

## CentOS Stream

### CentOS Stream 10

```bash
sudo dnf install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

### CentOS Stream 9

```bash
sudo dnf install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

## Fedora

### Fedora 44

```bash
sudo dnf install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

### Fedora 43

```bash
sudo dnf install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

### Fedora 42

```bash
sudo dnf install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

## Homebrew

### Homebrew (rolling)

```bash
sudo brew install \
    dotnet
```

**Cask:**

Register the feed:

```bash
brew install --cask {packages}
```

```bash
sudo brew install \
    dotnet-runtime \
    dotnet-sdk
```

## NixOS

### NixOS 25.11

```bash
sudo nix-env -iA nixpkgs. \
    dotnet-aspnetcore_10 \
    dotnet-runtime_10 \
    dotnet-sdk_10
```

## RHEL

### RHEL 10

```bash
sudo dnf install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

### RHEL 9

```bash
sudo dnf install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

### RHEL 8

```bash
sudo dnf install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

## Ubuntu

### Ubuntu 26.04 LTS (Resolute Raccoon)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

### Ubuntu 25.10 (Questing Quokka)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

### Ubuntu 24.04 (Noble Numbat)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```

### Ubuntu 22.04.4 LTS (Jammy Jellyfish)

**Backports PPA:**

Register the feed:

```bash
sudo apt-get install -y software-properties-common && sudo add-apt-repository ppa:dotnet/backports && sudo apt-get update
```

```bash
sudo apt-get update && \
sudo apt-get install -y \
    dotnet-aspnetcore-runtime-10.0 \
    dotnet-runtime-10.0 \
    dotnet-sdk-10.0
```
