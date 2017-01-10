# .NET Core 1.1 Preview 1 and .NET Core SDK 1.0 Preview 2.1

The installers and binary archives on this page include .NET Core 1.1 Preview 1 (runtime and shared framework) and the .NET Core 1.0 SDK Preview 2.1. If you only need the runtime and shared framework (no SDK), download links are available on the [Runtime Download](https://github.com/dotnet/core/blob/master/release-notes/preview-runtime-download.md) page.

| .NET Core 1.1 Preview 1 | Installer                                        | Binaries                                        |
| ----------------------- | :----------------------------------------------: | :----------------------------------------------:|
| Windows                 | [32-bit](https://go.microsoft.com/fwlink/?LinkID=831458) / [64-bit](https://go.microsoft.com/fwlink/?LinkID=831453)  | [32-bit](https://go.microsoft.com/fwlink/?LinkID=831474) / [64-bit](https://go.microsoft.com/fwlink/?LinkID=831469) |
| Windows Server Hosting  | [32-bit/64-bit](https://go.microsoft.com/fwlink/?linkid=832756) | - |
| macOS                   | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831445)  | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831486)                          |
| CentOS 7.1              | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831470)                          |
| Debian 8                | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831481)                          |
| Fedora 23               | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831489)                          |
| openSUSE 13.2           | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831491)                          |
| openSUSE 42.1           | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831478)                          |
| Ubuntu 14.04            | See notes below for Ubuntu 14.04 and Mint 17 installers   | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831488)                          |
| Ubuntu 16.04            | See notes below for Ubuntu 16.04 and Mint 18 installers   | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831471)                          |
| Ubuntu 16.10            | See notes below for Ubuntu 16.10                          | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831479)                          |

## Installation from a binary archive

When using binary archives to install, we recommend the contents be extracted to /opt/dotnet and a symbolic link created for dotnet. If an earlier release of .NET Core is already installed, the directory and symbolic link may already exist.

```bash
sudo mkdir -p /opt/dotnet
sudo tar zxf [tar.gz filename] -C /opt/dotnet
sudo ln -s /opt/dotnet/dotnet /usr/local/bin
```

## Ubuntu installation

dotnet-host-ubuntu-x64.1.1.0-preview1-001100-00.deb
dotnet-hostfxr-ubuntu-x64.1.1.0-preview1-001100-00.deb
dotnet-sharedframework-ubuntu-x64.1.1.0-preview1-001100-00.deb
dotnet-sdk-ubuntu-x64.1.0.0-preview2.1-003155.deb


### Set up package source

The first step is to establish the source feed for the package manager. This is only needed if you have not previously set up the source or if you are installing on Ubuntu 16.10 for the first time.

#### Ubuntu 14.04 and Linux Mint 17

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ trusty main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.0-preview2.1-003155
```

Installed packages

```
dotnet-host-ubuntu-x64.1.1.0-preview1-001100-00.deb
dotnet-hostfxr-ubuntu-x64.1.1.0-preview1-001100-00.deb
dotnet-sharedframework-ubuntu-x64.1.1.0-preview1-001100-00.deb
dotnet-sdk-ubuntu-x64.1.0.0-preview2.1-003155.deb
```

#### Ubuntu 16.04 and Linux Mint 18

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ xenial main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.0-preview2.1-003155
```

Installed packages

```
dotnet-host-ubuntu.16.04-x64.1.1.0-preview1-001100-00.deb
dotnet-hostfxr-ubuntu.16.04-x64.1.1.0-preview1-001100-00.deb
dotnet-sharedframework-ubuntu.16.04-x64.1.1.0-preview1-001100-00.deb
dotnet-sdk-ubuntu.16.04-x64.1.0.0-preview2.1-003155.deb
```

#### Ubuntu 16.10

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ yakkety main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.0-preview2.1-003155
```

Installed packages

```
dotnet-hostfxr-ubuntu.16.10-x64.1.1.0-preview1-001100-00.deb
dotnet-host-ubuntu.16.10-x64.1.1.0-preview1-001100-00.deb
dotnet-sharedframework-ubuntu.16.10-x64.1.1.0-preview1-001100-00.deb
dotnet-sdk-ubuntu.16.10-x64.1.0.0-preview2.1-003155.deb
```

## Windows Server Hosting
If you are looking to host stand-alone apps on Windows Servers, the ASP.NET Core Module for IIS can be installed separately on servers without installing .NET Core runtime. You can download the Windows (Server Hosting) installer and run the following command from an Administrator command prompt:
``DotNetCore.1.1.0.Preview1-WindowsHosting.exe OPT_INSTALL_LTS_REDIST=0 OPT_INSTALL_FTS_REDIST=0``
