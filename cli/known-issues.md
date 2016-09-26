Known issues & workarounds
==========================

<!-- TOC -->

- [Known issues](#known-issues)
    - [Installing on clean macOS Sierra does not put `dotnet` on the $PATH](#installing-on-clean-macos-sierra-does-not-put-dotnet-on-the-path)
    - [OpenSSL dependency on OS X](#openssl-dependency-on-os-x)
    - [Brew cannot write to /usr on a clean install of macOS](#brew-cannot-write-to-usr-on-a-clean-install-of-macos)
    - [`brew` refusing to link `openssl`](#brew-refusing-to-link-openssl)
    - [Running .NET Core CLI on Nano Server](#running-net-core-cli-on-nano-server)
    - [Users of zsh (z shell) don't get `dotnet` on the path after install](#users-of-zsh-z-shell-dont-get-dotnet-on-the-path-after-install)
    - [Breaking change in Preview 2 apt-get packages that impacts Preview 1 packages](#breaking-change-in-preview-2-apt-get-packages-that-impacts-preview-1-packages)
    - [`app.config` file needs to be checked out before publishing](#appconfig-file-needs-to-be-checked-out-before-publishing)
    - [`dotnet` commands in the root of the file system fails](#dotnet-commands-in-the-root-of-the-file-system-fails)
    - [On dev builds of the tools, restoring default project from dotnet new fails](#on-dev-builds-of-the-tools-restoring-default-project-from-dotnet-new-fails)
    - [Running `dotnet` on Debian distributions causes a segmentation fault](#running-dotnet-on-debian-distributions-causes-a-segmentation-fault)
    - [`dotnet restore` times out on Win7 x64](#dotnet-restore-times-out-on-win7-x64)
    - [Uninstalling/reinstalling the PKG on OS X](#uninstallingreinstalling-the-pkg-on-os-x)
- [What is this document about?](#what-is-this-document-about)
- [What is a "known issue"?](#what-is-a-known-issue)

<!-- /TOC -->

# Known issues

## Installing on clean macOS Sierra does not put `dotnet` on the $PATH
Users have reported this being the case. It seems that the root cause of the issue is that the `/etc/paths.d/` path does not exist on a clean install of macOS Sierra. This, in turn, leads to the file `/etc/paths.d/dotnet` not being created which means that `$PATH` is not updated with the install location of .NET Core. 

> **Note:** if you wish to know what `paths.d` is, please type `man path_helper` in your Terminal in macOS.  

In order to fix this, after install .NET Core on macOS Sierra, you can issue the following commands to create the directory and the file:

```console
mkdir -p /etc/paths.d
echo /usr/local/share/dotnet > /etc/paths.d/dotnet
```

> **Note:** you may need to run these commands as `sudo`. 

## OpenSSL dependency on OS X
OS X "El Capitan" (10.11) comes with 0.9.8 version of OpenSSL. .NET Core depends on versions >= 1.0.1 of OpenSSL. You can update the version by using [Homebrew](https://brew.sh), [MacPorts](https://www.macports.org/) or manually. The important bit is that you need to have the required OpenSSL version on the path when you work with .NET Core. 

With Homebrew, you can run the following commands to get this done: 

```console
brew update
brew install openssl
```

Homebrew may also show the following warning:

> Apple has deprecated use of OpenSSL in favor of its own TLS and crypto libraries

This warning is meant for the software that uses OpenSSL (in this case, .NET Core) and not for the end-user that is installing said software. Homebrew installation doesn't touch either the existing Apple crypto libraries or existing OpenSSL 0.9.8 version, so there is no impact on any software that uses either one of those crypto solutions and is already installed.

After installing OpenSSL via `brew` you will need to create two symbolic links to get the needed libraries into the loader's path using these commands:

```console
ln -s /usr/local/opt/openssl/lib/libcrypto.1.0.0.dylib /usr/local/lib/
ln -s /usr/local/opt/openssl/lib/libssl.1.0.0.dylib /usr/local/lib/
```

MacPorts doesn't have the concept of linking, so it is reccomended that you uninstall 0.9.8 version of OpenSSL using the following command:

```console
sudo port upgrade openssl
sudo port -f uninstall openssl @0.9.8
```

You can verify whether you have the right version using the  `openssl version` command from the Terminal.

## Brew cannot write to /usr on a clean install of macOS
On a clean install of macOS El Capitan or later, users have reported getting errors that any path under `/usr/` directory is not writable: 

```console
Error: /usr/local must be writable!
```

This is due to permissions being set in a certain way on the `/usr` directory on El Capitan. In order to workaround this problem, you need to give your user ownership of the directory and its contents. More information can be found on the following links:

* http://blog.blakesimpson.co.uk/read/89-fix-homebrew-error-usr-local-bin-is-not-writable-on-os-x-el-capitan
* http://stackoverflow.com/questions/26647412/homebrew-could-not-symlink-usr-local-bin-is-not-writable

## `brew` refusing to link `openssl`

```console
Warning: Refusing to link: openssl
Linking keg-only OpenSSL means you may end up linking against the insecure,
deprecated system version while using the headers from the Homebrew version.
Instead, pass the full include/library paths to your compiler e.g.:
  -I/usr/local/opt/openssl/include -L/usr/local/opt/openssl/lib
```
This is due to a recent update from `brew` where it refuses to link `openssl`. More information and workaround on the following links:

* https://github.com/Homebrew/brew/pull/597
* http://stackoverflow.com/questions/38670295/brew-refusing-to-link-openssl

## Running .NET Core CLI on Nano Server

If you’re using Nano Server Technical Preview 5 with .NET Core CLI, due to a bug in the Nano Server product, you will need to copy binaries from  `c:\windows\system32\forwarders`. The destination depends on the [type of deployment](https://dotnet.github.io/docs/core-concepts/app-types.html) that you are choosing for your application. 

For portable applications, the forwarders need to be copied to the shared runtime location. The shared runtime can be found wherever you installed .NET Core (by default, it is `C:\Program Files\dotnet`) under the following path: `shared\Microsoft.NETCore.App\<version>\`. 

For self-contained applications, the forwarders need to be copied over into the application folder, that is, wherever you put the published output.

This process will ensure that the `dotnet` host finds the appropriate APIs it needs.  If your Nano Server Technical Preview 5 build is updated or serviced, please make sure to repeat this process, in case any of the forwarders have been updated as well.
 
Apologies for any inconvenience. Again, this has been fixed in later releases.

## Users of zsh (z shell) don't get `dotnet` on the path after install
There is a known issue in oh-my-zsh installer that interferes with how `path_helper` works on OS X systems. In short, 
the said installer creates a `.zshrc` file which contains the exploded path at the time of installation. This clobbers 
any dynamically generated path, such as the one generated by `path_helper`. 

There is an [outstanding PR](https://github.com/robbyrussell/oh-my-zsh/pull/4925) on the oh-my-zsh repo for this. 

**Workaround 1:** symlink the `dotnet` binary in the installation directory to a place in the global path, e.g. `/usr/local/bin`. 
The command you can use is:

```console
ln -s /usr/local/share/dotnet/dotnet /usr/local/bin
```

**Workaround 2:** edit your `.zshrc` and/or `.zshprofile` files to add the `/usr/local/share/dotnet` to the $PATH. 

## Breaking change in Preview 2 apt-get packages that impacts Preview 1 packages
We made a breaking change in the way we package Preview 2 Ubuntu packages that also affects Preview 1 packages. The core of the change is that the host policy is now not packaged together with the host, but separately. This means that when you install Preview 1 packages from our Ubuntu apt-get feed, you will run into the following error message when trying to run any `dotnet` command: 

> Failed to resolve library symbol hostfxr_main, error: dotnet: undefined symbol: hostfxr_main
> Segmentation fault (core dumped)

**Issues tracking this:** 

* [dotnet/cli#3657](https://github.com/dotnet/cli/issues/3657)

**Affects:** the Preview 1 apt-get packages

**Workaround:** there are two main workarounds:

1. Use the `dotnet-install.sh` script to install the bits you need; ater you install them, do not forget to put them in the $PATH either by symlinking the `dotnet` binary in a global place (e.g. `/usr/local/bin`) or by adding the install directory to the $PATH. 
2. Install the Preview 2 of tooling and then use the `sudo apt-get install dotnet-sharedframework-microsoft.netcore.app-1.0.0-rc2-3002702` commands to install the Preview 1 shared framework so that you apps can continue to work. 

## `app.config` file needs to be checked out before publishing 
If you have an `app.config` file in source control that places locks on local files (such as TFS), you will recieve the following error during publishing:

```console
Failed to make the following project runnable: <project name> reason: Access to the path <path> is denied.
```

To resolve this, checkout the `app.config` file from the source control prior to publishing. 

## `dotnet` commands in the root of the file system fails
If you run any `dotnet` command on project and code files that reside in the root of the file system (`/` in Linux/macOS or `C:\` in Windows) it may fail due to security reasons. The most common error that is encountered is:

> Object reference not set to an instance of an object.

This affects the situation where the actual code files are in the root. So, the example path that would trigger this behavior would be `/project.json` or `C:\project.json` on UNIX or Windows respectivelly. 

**Workaround:** use a directory to store your projects and source files. 

**More information:** https://github.com/NuGet/Home/issues/3038

## On dev builds of the tools, restoring default project from dotnet new fails
When using non-release versions of the CLI, `dotnet restore` will fail to restore `Microsoft.NETCore.App` because for that particular version it exists on a NuGet feed that is not configured on the machine. This behavior is by design and does not happen with public releases (such as RC2).

**Workaround:** create a `NuGet.config` file in the project directory which contains the following:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <!--To inherit the global NuGet package sources remove the <clear/> line below -->
    <clear />
    <add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />
    <add key="api.nuget.org" value="https://api.nuget.org/v3/index.json" />
  </packageSources>
</configuration>
```

## Running `dotnet` on Debian distributions causes a segmentation fault
If a Debian machine is set in a certain way it may cause the native host (`dotnet`) to produce a segmentation fault. The culprit is the failed installation of the `libicu` dependency due to mirror package repository setup. If you fail to set up mirror package repositories, `apt-get` may not be able to resolve the dependency and the host will fail at runtime. 

**Affects:** the native host

**Workaround:** make sure that all of the [native pre-requisites](../Documentation/prereqs.md) are installed correctly. You can usually do this by running `apt-get` package manager. 

## `dotnet restore` times out on Win7 x64
If you have any virtualization software (so far we've confirmed VMWare and Virtual Box) and you try to use the CLI on a Win7 SP1 x64 machine, `dotnet restore` will be really slow and will eventually time out without doing much restoring. The issue is in the virtual networking adapters that usually get installed with said software. 

**Issues tracking this:** 

* [#1732](https://github.com/dotnet/cli/issues/1732)

**Affects:** `dotnet restore`

**Workaround:** disable the virtual network interface and do the restore.   

## Uninstalling/reinstalling the PKG on OS X
OS X doesn't really have an uninstall capacity for PKGs like Windows has for 
MSIs. There is, however, a way to remove the bits as well as the "recipe" for 
dotnet. More information can be found on [this SuperUser question](http://superuser.com/questions/36567/how-do-i-uninstall-any-apple-pkg-package-file) or you can use the [uninstall script](https://github.com/dotnet/cli/blob/rel/1.0.0-preview2/scripts/obtain/uninstall/dotnet-uninstall-pkgs.sh).

# What is this document about? 
This document outlines the known issues and workarounds for the current state of 
the CLI tools. Issues will also have a workaround and affects sections if necessary. You can use this page to 
get information and get unblocked.

# What is a "known issue"?
A "known issue" is a major issue that block users in doing their everyday tasks and that affect all or 
most of the commands in the CLI tools. If you want to report or see minor issues, you can use the [issues list](https://github.com/dotnet/cli/issues). 
