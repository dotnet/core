# Linux package manager install failure diagnosis

Before reporting a package manager install failure, check if your error message is on the list below. There are workarounds for some common failures, and for others, there are diagnosis steps you should run to reveal critical information.

The Linux package manager install instructions are located at https://dotnet.microsoft.com/download.


## `E: Unable to locate package dotnet-sdk-2.2`

After running `apt-get install dotnet-sdk-2.2`, you may see:

```
$ apt-get install dotnet-sdk-2.2
Reading package lists... Done
Building dependency tree
Reading state information... Done
E: Unable to locate package dotnet-sdk-2.2
E: Couldn't find any package by glob 'dotnet-sdk-2.2'
E: Couldn't find any package by regex 'dotnet-sdk-2.2'
```

This is probably because the Microsoft package repository isn't set up correctly on your machine.

The following commands give more info about the error and the current state of your machine. Please run them and include the output in your issue report:

```
# This shows the package repositories you have configured. (Source: https://askubuntu.com/a/741948)
grep -r --include '*.list' '^deb ' /etc/apt/sources.list /etc/apt/sources.list.d/

# These commands show processor and Linux distribution information.
uname -a
cat /etc/os-release

# You can copy this entire block of text and paste it into your terminal for convenience.
```

Next are common issues and resolutions:

### Attempting to use the package repository on a non-x64 device
The Microsoft package repository only works on x64 (`x86_64`). For example, a Raspberry Pi uses an ARM architecture, so you can't install .NET Core on that device using the package repository.

### Package feed not installed due to bug in `packages-microsoft-prod.deb`
The output from the commands above should include a line like this:

```
/etc/apt/sources.list.d/microsoft-prod.list:deb [arch=amd64] https://packages.microsoft.com/ubuntu/18.10/prod cosmic main
```

First, try reinstalling the package to work around a bug in an old version that improperly handles upgrades:

```
sudo dpkg --purge packages-microsoft-prod && sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install dotnet-sdk-2.2
```

If that doesn't work, there are commands listed on each download page that show how to directly install the feed rather than using `packages-microsoft-prod.deb`. These commands are specific to your Linux distro and version.


## `E: Unable to correct problems, you have held broken packages.`

After running `apt-get install dotnet-sdk-2.2`, you may see:

```
$ apt-get install dotnet-sdk-2.2
Reading package lists... Done
Building dependency tree       
Reading state information... Done
Some packages could not be installed. This may mean that you have
requested an impossible situation or if you are using the unstable
distribution that some required packages have not yet been created
or been moved out of Incoming.
The following information may help to resolve the situation:

The following packages have unmet dependencies:
 dotnet-sdk-2.2 : Depends: aspnetcore-runtime-2.2 (>= 2.2.5) but it is not going to be installed
                  Depends: dotnet-runtime-2.2 (>= 2.2.5) but it is not going to be installed
E: Unable to correct problems, you have held broken packages.
```

This means `aspnetcore-runtime-2.2` and `dotnet-runtime-2.2` failed to install, but unfortunately it doesn't say why. You *can* follow the chain by running `apt-get install` for each unmet dependency, but it's usually safe to assume this error is because `dotnet-runtime-deps-2.2` failed to install.

The following commands give more info about the error and the current state of your machine. Please run them and include the output in your issue report:

```
# This shows the package repositories you have configured. (Source: https://askubuntu.com/a/741948)
grep -r --include '*.list' '^deb ' /etc/apt/sources.list /etc/apt/sources.list.d/

# These commands show processor and Linux distribution information.
uname -a
cat /etc/os-release

# This command shows why dotnet-runtime-deps-2.2 can't install.
apt-get install dotnet-runtime-deps-2.2

# You can copy this entire block of text and paste it into your terminal for convenience.
```

Next are common issues and resolutions:

### Mismatched package repository vs. Linux distro/version
The list of package repositories should include a `microsoft-prod.list` line, like this one:

```
/etc/apt/sources.list.d/microsoft-prod.list:deb [arch=amd64] https://packages.microsoft.com/ubuntu/18.10/prod cosmic main
```

Notice `ubuntu/18.10` in that example. That indicates that repository is meant for Ubuntu 18.04. If you try to use it on Ubuntu 19.04, for example, installation will fail.

`cat /etc/os-release` shows you info about the distribution and version you're using:

```
NAME="Ubuntu"
VERSION="19.04 (Disco Dingo)"
...
```

To fix this, make sure the "Linux Distribution" dropdown has the correct selection and run the steps again.

If the dropdown doesn't have an entry for your distribution and version, check if it is listed as supported at [release-notes/2.2/2.2-supported-os.md](../release-notes/2.2/2.2-supported-os.md). If it is supported, please file an issue to report the missing entry. Packages from a similar distribution or version may work.


## `W: Failed to fetch https://packages.microsoft.com/ubuntu/14.04/prod/dists/trusty/main/binary-amd64/Packages Hash Sum mismatch`

This indicates a service outage in the Microsoft repository, not limited to .NET Core. Please file an issue so we can have it fixed it as soon as possible!

---


## Alternative install methods

The Microsoft package repository is the preferred way to install .NET Core, but there are alternatives you can use as a workaround.

### Use the Snap
See [linux-setup.md#installation-using-snap](linux-setup.md#installation-using-snap) for more information on using the .NET Core Snap.

### Install from binaries
This involves manually setting up prerequisites, but it applies to more Linux distributions and processor architectures than the Microsoft package repository:

1. Install the .NET Core prerequisites, listed at [linux-prereqs.md](linux-prereqs.md).
2. On the [download page](https://dotnet.microsoft.com/download), look for the "Binaries" row and click the correct link for your machine.
3. Follow the remaining install instructions on the download page.
