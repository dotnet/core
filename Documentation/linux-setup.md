## Preparing your Linux system for .NET Core

There are a few options available for installing .NET Core on Linux systems and each requires a few actions before installing .NET Core. The sections below detail different methods for installing .NET Core and any prerequisites.

* [Using the package manager](#installation-using-a-package-manager)
* [Installing from binary archive (tar.gz)](#installation-from-a-binary-archive)
* [Installing using Snap](#installation-using-snap)

Other useful references

* [OS lifecycle support policy](https://github.com/dotnet/core/blob/main/os-lifecycle-policy.md)
* [Linux System Prerequisites](https://github.com/dotnet/core/blob/main/Documentation/linux-prereqs.md)

### Installation using a package manager

Before installing .NET using a package manager, you will need to register the Microsoft key, register the product repository, and install required dependencies. This only needs to be done once per machine.

Open a command prompt and run the commands below that match your distro:

#### .deb systems

```bash
# Debian 8 - .NET Core 2.0 and newer
wget -nv -O- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
sudo mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/
wget -nv https://packages.microsoft.com/config/debian/8/prod.list
sudo mv prod.list /etc/apt/sources.list.d/microsoft-prod.list
sudo chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg
sudo chown root:root /etc/apt/sources.list.d/microsoft-prod.list

# Debian 9 - .NET Core 2.0 and newer
wget -nv -O- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
sudo mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/
wget -nv https://packages.microsoft.com/config/debian/9/prod.list
sudo mv prod.list /etc/apt/sources.list.d/microsoft-prod.list
sudo chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg
sudo chown root:root /etc/apt/sources.list.d/microsoft-prod.list

# Ubuntu 14.04 - .NET Core 1.0 and newer
wget -nv https://packages.microsoft.com/config/ubuntu/14.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get install apt-transport-https

# Ubuntu 16.04 - .NET Core 2.0 and newer
wget -nv https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get install apt-transport-https

# Ubuntu 18.04 - .NET Core 2.0 and newer
wget -nv https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get install apt-transport-https

# Ubuntu 18.04.1 by default does not configure Universe repository. .NET Core 2.1 depends on liblttng-ust0, which is available in the Universe repository.
sudo add-apt-repository universe
sudo apt-get update

# Ubuntu 18.10 - .NET Core 2.1 and newer
wget -nv https://packages.microsoft.com/config/ubuntu/18.10/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get install apt-transport-https
```

#### .rpm systems

```bash
# CentOS 7, Oracle 7 - .NET Core 2.0 and newer
sudo rpm -Uvh https://packages.microsoft.com/config/rhel/7/packages-microsoft-prod.rpm
sudo yum install libunwind libicu

# Fedora 27, 28 - .NET Core 2.0 and newer
sudo rpm -Uvh https://packages.microsoft.com/config/fedora/27/packages-microsoft-prod.rpm
sudo dnf install libunwind libicu compat-openssl10

# OpenSUSE Leap (Tumbleweed is not officially supported) - .NET Core 2.0 and newer
sudo rpm -Uvh https://packages.microsoft.com/config/opensuse/42.2/packages-microsoft-prod.rpm
sudo zypper install libunwind libicu

# SLES 12 - .NET Core 2.0 and newer
sudo rpm -Uvh https://packages.microsoft.com/config/sles/12/packages-microsoft-prod.rpm
sudo zypper install libunwind libicu
```

## Ready to install

Your system is now ready to install .NET Core. See the [Release Notes index](https://github.com/dotnet/core/tree/main/release-notes#net-core-release-notes) for the latest available updates.

## Installation from a binary archive

Installing from the packages detailed above is recommended or you can install from binary archive, if that better suits your needs. When using binary archives to install, the contents must be extracted to a user location such as `$HOME/dotnet`, a symbolic link created for `dotnet` and a few dependencies installed. Dependency requirements for each distro can be seen in the [Linux System Prerequisites](https://github.com/dotnet/core/blob/main/Documentation/linux-prereqs.md) document.

```bash
mkdir -p $HOME/dotnet && tar zxf dotnet.tar.gz -C $HOME/dotnet
export PATH=$PATH:$HOME/dotnet
```

## Installation using Snap

We have been working on bringing .NET Core to Snap and are ready to hear what you think. Snaps, along with a few other technologies, are an emerging application installation and sandboxing technology which we think is pretty intriguing. The Snap install works well on Debian-based systems and other distros such as Fedora are having challenges that we're working to run down. The following steps can be used if you would like to give this a try.

* Visit [Snapcraft.io](https://snapcraft.io/) for guidance on preparing your system to use Snaps.
* As with our other installers, the Runtime and SDK are available depending on your needs. The SDK installation will include the .NET Core runtime and ASP.NET Core runtime.

```bash
sudo snap install dotnet-sdk --classic
## or
sudo snap install dotnet-runtime-21 --classic
```

### SSL Certificate resolution with Snap installs

On some distros, a few environment variables need to be set in order for .NET Core to properly find the SSL certificate. You will know this is needed on your system if you get an error similar to the following during `restore`.

```bash
Processing post-creation actions...
Running 'dotnet restore' on /home/myhome/test/test.csproj...
  Restoring packages for /home/myhome/test/test.csproj...
/snap/dotnet-sdk/27/sdk/2.2.103/NuGet.targets(114,5): error : Unable to load the service index for source https://api.nuget.org/v3/index.json. [/home/myhome/test/test.csproj]
/snap/dotnet-sdk/27/sdk/2.2.103/NuGet.targets(114,5): error :   The SSL connection could not be established, see inner exception. [/home/myhome/test/test.csproj]
/snap/dotnet-sdk/27/sdk/2.2.103/NuGet.targets(114,5): error :   The remote certificate is invalid according to the validation procedure. [/home/myhome/test/test.csproj]
```

To resolve this issue

```bash
export SSL_CERT_FILE=[certificate file location and name]
export SSL_CERT_DIR=/dev/null
```

The certificate location will vary by distro. Here are the locations for the distros where we have experienced the issue.

* Fedora - `/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem`
* OpenSUSE - `/etc/ssl/ca-bundle.pem`
* Solus - `/etc/ssl/certs/ca-certificates.crt`
