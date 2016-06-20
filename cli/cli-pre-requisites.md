CLI native prerequisites
=========================

This document outlines the dependencies needed to run .NET Core CLI tools. Most of these dependencies are also .NET Core's general dependencies, so installing them will make sure that you can run applications written for .NET Core in general.

## Windows dependencies
On Windows, the only dependency is the VC++ Redistributable. Depending on the version of Windows you are running on, the versions are changing.

> **Note:** these dependencies are chained in the installer, you only need to install them manually if you are using
> the installer script (`dotnet-install.sh` or `dotnet-install.ps1`). 

* Windows 10
    * [Visual C++ Redistributable for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48145)
* Pre-Windows 10
    * Please make sure that your Windows installation is up-to-date and includes hotfix [KB2533623] (https://support.microsoft.com/en-us/kb/2533623) installed through Windows Update.
    * [Visual C++ Redistributable for Visual Studio 2012 Update 4](https://www.microsoft.com/en-us/download/confirmation.aspx?id=30679)

## Ubuntu
Ubuntu distributions require the following libraries installed:

- libunwind8 
- libunwind8-dev
- gettext
- libicu-dev
- liblttng-ust-dev
- libcurl4-openssl-dev
- libssl-dev
- uuid-dev
- unzip


## CentOS
CentOS distributions require the following libraries installed:

* deltarpm
* epel-release
* unzip
* libunwind
* gettext 
* libcurl-devel 
* openssl-devel 
* zlib 
* libicu-devel

## OS X 
OS X requires the following libraries and versions installed:

* libssl 1.1

## Installing the dependencies
Please follow the recommended practices of each operating system in question. For Linux, we recommend using your package manager such as `apt-get` for Ubuntu and `yum` for CentOS. For OS X and upgrading the libssl, we recommend using [Homebrew](https://brew.sh/); if you do use it, do not forget the link phase you need to do at the end of install (`brew link openssl --force`). 
