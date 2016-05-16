# RC1 to RC2 Upgrade Roadmap

Due to schedule changes for the .NET Core all-up, there was a rename of the tooling from "RC2" to "RC2 - Preview 1". This rename impacted all of the packages as well as installers for .NET Core and .NET Core tools. The impact of this change for the users is in that all previous versions of .NET Core and any tooling **must be** removed from the machine in order to properly install and use RC2 release.

**What about RC1 bits?**

This does not impact RC1 release. Since the tooling and the way you write applications has changed, having DNX (or many of them) installed should not be a problem. However, one caveat is what tooling you are using for what project. For RC2 projects you may get wrong results and/or errors if you try to restore dependencies using `dnu restore`. Please use the appropriate tooling. You can see what are the new commands in the DNX to CLI migration document listed below.

For updating your code, you can check these two documents:

* [Migrating from DNX to CLI](http://dotnet.github.io/docs/core-concepts/dnx-migration.html)
* [Updating from ASP.NET Core RC1 to RC2]()

## Native installers

### Windows

On Windows, simply use the Add/Remove programs in the Control Panel to remove all the previous versions of the .NET Core bits. Please note that we have changed the name that appears in Add/Remove programs from ".NET Core CLI" to ".NET Core SDK"; please use the latter to search for installed versions to remove.

### Ubuntu

In order to make life easier, we have created a script for cleaning up all versions of .NET Core from a machine. You can get the script from https://github.com/dotnet/cli/blob/rel/1.0.0/scripts/obtain/uninstall/dotnet-uninstall-debian-packages.sh. Please note that this will remove any and all previous versions, which means the machine will be cleaned completely of any .NET Core bits.  The script needs elevated privileges, so it needs to be run under sudo.

### OS X

In order to make life easier, we have created a script for cleaning up all versions of .NET Core from a machine. You can get the script from https://github.com/dotnet/cli/blob/rel/1.0.0/scripts/obtain/uninstall/dotnet-uninstall-pkgs.sh. Please note that this will remove any and all previous versions, which means the machine will be cleaned completely of any .NET Core bits.  The script needs elevated privileges, so it needs to be run under sudo.

## Installation Scripts (all supported OS-es)

If you installed .NET Core previous versions using an installation script, simply delete the directory where you installed the previous version of .NET Core. If you are on Linux or OSX and you have symlinked the dotnet binary to a global location (e.g. /usr/local/bin) please remove that symlink as well. Once you install RC2 using the installation script, you can recreate the symlink. Similar goes for Windows if you added the install folder to your system path.

After uninstalling the actual bits of the previous version, you should also clear your Nuget package cache. The cache can be found in the following places:

* Windows: `%HOME%\.nuget\packages`
* OSX: `$HOME\.nuget\packages`
* Linux: `$HOME\.nuget\packages`

The easiest way to clear it is to simply delete the entire `packages` directory. It will be recreated the next time you run `dotnet restore` that is, restore your dependencies.

## Check the native dependencies

Before installing the RC2 bits it is also prudent to check whether you have the needed native dependencies. They can be found in the [RC2 release notes](Release-Notes-RC2.md).

## OpenSSL and OSX specifics

If you read the [getting started](http://go.microsoft.com/fwlink/?LinkID=798306&clcid=0x409) instructions you will notice that  you need to update OpenSSL to version 1.0.1 or higher. By default, OS X "El Capitan" comes with OpenSSL 0.9.8. To check what version is installed use `openssl verion`. We are giving instructions for updating using Homebrew because that is what we use on the team. MacPorts can be used as well. You can also do it manually.

What is important is that you have the new version of OpenSSL on the path when you start using the .NET Core RC2. With brew, you can use the `brew link --force openssl` command to relink the OpenSSL. On MacPorts there is no analogue to linking, so you should just uninstall version(s) that are less than 1.0.1. For Mac Ports you can use the following command: `port -f uninstall openssl @0.9.8`.

## After installation of RC2

After you successfully install RC2, please run `dotnet --info` and check the version. The RC2 version of the tooling is `1.0.0-preview1-002702`. This version will indicate that you have the RC2 bits on your path. You should be set up to go.
