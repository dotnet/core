# .NET Core SDK 1.0 Preview 3 build 004056

The installers and binary archives on this page include .NET Core 1.0 SDK Preview 3. [Checksums](https://dotnetcli.blob.core.windows.net/dotnet/checksums/1.0.1-SDK-Preview-3-4056-SHA.txt) are available to verify downloads.

| .NET Core 1.0 Preview 3 | SDK Installer                                        | SDK Binaries                                        | Runtime Installer | Runtime Binaries |
| ----------------------- | :----------------------------------------------: | :----------------------------------------------:|:--|:--|
| Windows                 | [32-bit](https://go.microsoft.com/fwlink/?LinkID=835138) / [64-bit](https://go.microsoft.com/fwlink/?LinkID=835132)  | [32-bit](https://go.microsoft.com/fwlink/?LinkID=835139) / [64-bit](https://go.microsoft.com/fwlink/?LinkID=835127) | [32-bit](https://go.microsoft.com/fwlink/?LinkID=827516) / [64-bit](https://go.microsoft.com/fwlink/?LinkID=827515) | [32-bit](https://go.microsoft.com/fwlink/?LinkID=825883) / [64-bit](https://go.microsoft.com/fwlink/?LinkID=825882) |
| macOS                   | [64-bit](https://go.microsoft.com/fwlink/?LinkID=835133)  | [64-bit](https://go.microsoft.com/fwlink/?LinkID=835129)                          | [64-bit](https://go.microsoft.com/fwlink/?LinkID=827517) | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825884) |
| CentOS 7.1              | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=835137)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825888) |
| Debian 8                | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=835131)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825887) |
| Fedora 23               | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=835126)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825891) |
| openSUSE 13.2           | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=835134)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825890) |
| Ubuntu 14.04            | See notes below for Ubuntu 14.04 and Mint 17 installers   | [64-bit](https://go.microsoft.com/fwlink/?LinkID=835135)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825885) |
| Ubuntu 16.04            | See notes below for Ubuntu 16.04 and Mint 18 installers   | [64-bit](https://go.microsoft.com/fwlink/?LinkID=835136)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825886) |

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
dotnet-sdk-ubuntu-x64.1.0.0-preview3-004056.deb

### Set up package source

The first step is to establish the source feed for the package manager. This is only needed if you have not previously set up the source or if you are installing for the first time.

#### Ubuntu 14.04 and Linux Mint 17

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ trusty main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.0-preview3-004056

```

Installed packages

```
dotnet-host-ubuntu-x64.1.0.1.deb
dotnet-hostfxr-ubuntu-x64.1.0.1.deb
dotnet-sharedframework-ubuntu-x64.1.0.1.deb
dotnet-sdk-ubuntu-x64.1.0.0-preview3-004056.deb
```

#### Ubuntu 16.04 and Linux Mint 18

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ xenial main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.0-preview3-004056
```

Installed packages

```
dotnet-host-ubuntu.16.04-x64.1.0.1.deb
dotnet-hostfxr-ubuntu.16.04-x64.1.0.1.deb
dotnet-sharedframework-ubuntu.16.04-x64.1.0.1.deb
dotnet-sdk-ubuntu.16.04-x64.1.0.0-preview3-004056.deb
```
