# .NET Core SDK 1.0 rc4 build 004771

The installers and binary archives on this page include .NET Core 1.0 SDK RC 4.

| .NET Core 1.0 RC 4      | Installer                                        | Binaries                                        |Docker Images                                        |
| ----------------------- | :----------------------------------------------: | :----------------------------------------------:| :----------------------------------------------:|
| Windows                 | [32-bit](https://go.microsoft.com/fwlink/?linkid=841695) [(sha)](download-sha/1.0.3-sdk-rc4/dotnet-dev-win-x86.1.0.0-rc4-004771.exe.sha) / [64-bit](https://go.microsoft.com/fwlink/?linkid=841686) [(sha)](download-sha/1.0.3-sdk-rc4/dotnet-dev-win-x64.1.0.0-rc4-004771.exe.sha) | [32-bit](https://go.microsoft.com/fwlink/?linkid=841690) [(sha)](download-sha/1.0.3-sdk-rc4/dotnet-dev-win-x86.1.0.0-rc4-004771.exe.sha) / [64-bit](https://go.microsoft.com/fwlink/?linkid=841683)  [(sha)](download-sha/1.0.3-sdk-rc4/dotnet-dev-win-x64.1.0.0-rc4-004771.zip.sha) | [1.1.0-sdk-msbuild-rc4-nanoserver](https://hub.docker.com/r/microsoft/dotnet/)|
| macOS                   | [64-bit](https://go.microsoft.com/fwlink/?linkid=841693) [(sha)](download-sha/1.0.3-sdk-rc4/dotnet-dev-osx-x64.1.0.0-rc4-004771.pkg.sha) | [64-bit](https://go.microsoft.com/fwlink/?linkid=841692) [(sha)](download-sha/1.0.3-sdk-rc4/dotnet-dev-osx-x64.1.0.0-rc4-004771.tar.gz.sha)                         ||
| CentOS 7.1              | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?linkid=841688) [(sha)](download-sha/1.0.3-sdk-rc4/dotnet-dev-centos-x64.1.0.0-rc4-004771.tar.gz.sha)                         ||
| Debian 8                | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?linkid=841689) [(sha)](download-sha/1.0.3-sdk-rc4/dotnet-dev-debian-x64.1.0.0-rc4-004771.tar.gz.sha)                         | [1.1.0-sdk-msbuild-rc4](1.1.0-sdk-msbuild-rc4)|
| Ubuntu 14.04            | See notes below for Ubuntu 14.04 and Mint 17 installers   | [64-bit](https://go.microsoft.com/fwlink/?linkid=841687) [(sha)](download-sha/1.0.3-sdk-rc4/dotnet-dev-ubuntu-x64.1.0.0-rc4-004771.tar.gz.sha)                         ||
| Ubuntu 16.04            | See notes below for Ubuntu 16.04 and Mint 18 installers   | [64-bit](https://go.microsoft.com/fwlink/?linkid=841684) [(sha)](download-sha/1.0.3-sdk-rc4/dotnet-dev-ubuntu.16.04-x64.1.0.0-rc4-004771.tar.gz.sha)

## Installation from a binary archive

When using binary archives to install, we recommend the contents be extracted to /opt/dotnet and a symbolic link created for dotnet. If an earlier release of .NET Core is already installed, the directory and symbolic link may already exist. Ubuntu and Mint users should follow the instructions in the Ubuntu Installation section below.

```bash
sudo mkdir -p /opt/dotnet
sudo tar zxf [tar.gz filename] -C /opt/dotnet
sudo ln -s /opt/dotnet/dotnet /usr/local/bin
```

## Ubuntu installation

dotnet-host-ubuntu-x64.deb
dotnet-hostfxr-ubuntu-x64.deb
dotnet-sharedframework-ubuntu-x64.deb
dotnet-sdk-ubuntu-x64.1.0.0-rc4-004771.deb

### Set up package source

The first step is to establish the source feed for the package manager. This is only needed if you have not previously set up the source or if you are installing for the first time.

#### Ubuntu 14.04 and Linux Mint 17

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ trusty main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.0-rc4-004771

```

Installed packages

```
dotnet-host-ubuntu-x64.1.0.1.deb
dotnet-hostfxr-ubuntu-x64.1.0.1.deb
dotnet-sharedframework-ubuntu-x64.1.0.3.deb
dotnet-sdk-ubuntu-x64.1.0.0-rc4-004771.deb
```

#### Ubuntu 16.04 and Linux Mint 18

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ xenial main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.0-rc4-004771
```

Installed packages

```
dotnet-host-ubuntu.16.04-x64.1.0.1.deb
dotnet-hostfxr-ubuntu.16.04-x64.1.0.1.deb
dotnet-sharedframework-ubuntu.16.04-x64.1.0.3.deb
dotnet-sdk-ubuntu.16.04-x64.1.0.0-rc4-004771.deb
```
