# .NET 9 installation instructions for Linux

The following instructions demonstrate installing .NET 9 on Linux. These instructions augment the more general [.NET install instructions](install.md), including installing with `.tar.gz` files, that work on multiple operating systems.

[Linux package dependencies](linux-packages.md) describes the set of packages required to run .NET on Linux.

## Distributions

The following distributions are available for Linux:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

We recommend you install the .NET SDK to develop and build applications, and to install one of the runtime packages (like ASP.NET Core) to exclusively run applications.

## Downloads

Each of the distributions can be downloaded from:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/9.0)
- [.NET 9 release notes](README.md)

[Container images](https://hub.docker.com/_/microsoft-dotnet) are provided for Linux (Alpine, Debian, and Ubuntu).

## Install using deb/rpm packages

Preview release installers are not available from the Microsoft package repositories. The steps below provide an easy way to install .NET 9 using your Distro package manager.

**Note:** `curl` must be available on the system before running the following steps. Once you have confirmed that `curl` is available, complete the steps to download and install the latest .NET 9 Preview SDK and Runtime.

1. Create a directory to use for the download location and change into that directory. For example, `mkdir $HOME/dotnet_install && cd $HOME/dotnet_install`
2. Run `curl -L https://aka.ms/install-dotnet-preview -o install-dotnet-preview.sh`
3. Run the script with `sudo bash install-dotnet-preview.sh`

Here's what the script does.

- Detects the distribution and version. The script supports platforms and versions listed in [.NET 9.0 - Supported OS versions](supported-os.md).
- Determines if additional system dependencies or utilities are needed to successfully complete and install them. For example, `tar` is used to unpack the installer packages.
- Downloads the tar.gz containing the .NET preview installer packages for the detected distribution.
- Downloads the system dependency installer, if needed.
- Expands the tar.gz into ./dotnet_packages
- Attempts to install the contents of ./dotnet_packages using `rpm` or `dpkg`, as appropriate, for the detected distribution.

## Installing from a binary archive

You can install .NET with a binary archive. This option is required if you want to install .NET for a single user. It is also recommended if you want to install .NET temporarily.

The following workflow demonstrates downloading, unpacking, configuring, and running the .NET SDK from the command line. You may choose to do some of these tasks via the browser and functionality provided by your operating system.

```bash
~# curl -Lo dotnet.tar.gz https://download.visualstudio.microsoft.com/download/pr/911f82cf-0f87-46c2-8d70-44fab9a0f3c9/137ec23686722b8119bd62def8d7b117/dotnet-sdk-9.0.100-preview.2.24157.14-linux-x64.tar.gz
~# mkdir dotnet
~# tar -C dotnet -xf dotnet.tar.gz
~# rm dotnet.tar.gz
~# export DOTNET_ROOT=~/dotnet
~# export PATH=$PATH:~/dotnet
~# dotnet --version
9.0.100-preview.2.24157.14
```

The `DOTNET_ROOT` environment variable is required to launch an application with their executables (like `myapp.exe`). The executables look for this environment variable to find the runtime if it isn't installed in its regular location. The `PATH` environment variable must be updated if you want to use `dotnet` without absolute paths to its location. Setting both of these environment variables is optional.

You can add your .NET install location permanently to your path if you'd like.
