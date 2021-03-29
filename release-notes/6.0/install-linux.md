# .NET 6 installation instructions for Linux

The following instructions demonstrate installing .NET 6 on Linux. These instructions augment the more general [.NET install instructions](install.md), including installing with `.tar.gz` files, that work on multiple operating systems.

## Distributions

The following distributions are available for Linux:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

You are recommended to install the .NET SDK to develop and build applications, and to install one of the runtimes packages (like ASP.NET Core) to exclusively run applications.

## Downloads

Each of the distributions can be downloaded from:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/6.0)
- [.NET 6 release notes](README.md)

[Container images](https://hub.docker.com/r/microsoft/dotnet/) are provided for Linux (Alpine, Debian, and Ubuntu).

## Install using deb/rpm packages

Preview release installers are not available from the Microsoft package repositories. The steps below provide an easy way to install .NET 6 using your Distro package manager.

**Note:** `curl` must be available on the system before running the following steps. Once you have confirmed that `curl` is available, complete the steps to download and install the latest .NET 6 Preview SDK and Runtime.

1. Create a directory to use for the download location and change into that directory. For example `mkdir $HOME/dotnet_install && cd $HOME/dotnet_install`
2. Run `curl -L https://aka.ms/install-dotnet-preview -o install-dotnet-preview.sh`
3. Run the script with `sudo bash install-dotnet-preview.sh`

Here's what the script does.

* Detects the distribution and version. The script supports platforms and versions listed in [.NET 6.0 - Supported OS versions](https://github.com/dotnet/core/blob/main/release-notes/6.0/6.0-supported-os.md).
* Determines if additional system dependencies or utilities are needed to successfully complete and install them. For example `tar` is used to unpack that installer packages.
* Downloads the tar.gz containing the .NET preview installer packages for the detected distribution.
* Downloads the system dependency installer, if needed.
* Expands the tar.gz into ./dotnet_packages
* Attempts to install the contents of ./dotnet_packages using `rpm` or `dpkg`, as appropriate, for the detected distribution.

## Install using Snap

Because of the isolated environment, using Snap is the preferred way to install and try .NET Previews on [Linux distributions that support Snap](https://docs.snapcraft.io/installing-snapd/6735).

After configuring Snap on your system, run the following command to install the latest .NET Core SDK.

`sudo snap install dotnet-sdk --channel=6.0/beta --classic`

When .NET Core is installed using the Snap package, the default .NET Core command is `dotnet-sdk.dotnet`, as opposed to just `dotnet`. The benefit of the namespaced command is that it will not conflict with a globally installed .NET Core version you may have. This command can be aliased to `dotnet` with:

`sudo snap alias dotnet-sdk.dotnet dotnet`

**Note:** Some distributions require an additional step to enable access to the SSL certificate. If you experience SSL errors when running `dotnet restore`, see [Linux Setup](https://github.com/dotnet/core/blob/main/Documentation/linux-setup.md) for a possible resolution.
