.NET Core native prerequisites
==============================

This document outlines the dependencies needed to run .NET Core tools and applications. 

For Operating System support, please refer to [the roadmap document](https://github.com/dotnet/core/blob/master/roadmap.md#technology-roadmaps). 

## Windows dependencies
On Windows, the only dependency is the VC++ Redistributable. Depending on the version of Windows you are running on, the versions are changing.

.NET Core requires the VC++ Redistributable when running on Windows. It is installed for you by the .NET Core installer. You need to install the Visual C++ redistributable manually if you are installing .NET Core via the installer script (`dotnet-install.ps1`) or are attempting to run a self-contained .NET Core application. 

[Visual C++ Redistributable for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48145)

* Windows 7 and 2008 only
    * Please make sure that your Windows installation is up-to-date and includes hotfix [KB2533623](https://support.microsoft.com/en-us/kb/2533623) installed through Windows Update.
    
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

* libssl version 1.0.1

## Installing the dependencies
Please follow the recommended practices of each operating system in question. For Linux, we recommend using your package manager such as `apt-get` for Ubuntu and `yum` for CentOS. For OS X and upgrading the libssl, we recommend using [Homebrew](https://brew.sh/); if you do use it, do not forget the link phase you need to do at the end of install (`brew link openssl --force`). 
