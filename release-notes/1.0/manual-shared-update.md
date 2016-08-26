# Manually updating CoreCLR and the JIT in the Shared Framework #

The procedures detailed below can be used to update the CoreCLR runtime and JIT that are part of the .NET Core shared runtime and libraries, also known as Microsoft.NETCore.App in-place. This will enable portable applications to take advantage of updates to the shared files. The preferred way to update Microsoft.NETCore.App is to install the new version side-by-side but there may be times when an updated NETCore.App is not yet available while the required components have been released as NuGet packages.

Again, this process should be done only in the event that required updates are available as NuGet packages and not as an updated .NET Core installer.

1. Download the updated packages from [nuget.org](https://www.nuget.org)
2. Rename packages and extract files
3. Back up existing files to be updated
4. Copy new files to the target directory

## Download NuGet packages containing the udpated files ##

Download the updated CoreCLR and JIT NuGet package which correspond to your system. Links below will download the packages directly.

CoreCLR

- [debian.8.x64](https://www.nuget.org/api/v2/package/runtime.debian.8-x64.Microsoft.NETCore.Runtime.CoreCLR/1.0.4)
- [fedora.23.x64](https://www.nuget.org/api/v2/package/runtime.fedora.23-x64.Microsoft.NETCore.Runtime.CoreCLR/1.0.4)
- [rhel.7-x64](https://www.nuget.org/api/v2/package/runtime.rhel.7-x64.Microsoft.NETCore.Runtime.CoreCLR/1.0.4)
- [ubuntu.14.04-x64](https://www.nuget.org/api/v2/package/runtime.ubuntu.14.04-x64.Microsoft.NETCore.Runtime.CoreCLR/1.0.4)
- [ubuntu.16.04-x64](https://www.nuget.org/api/v2/package/runtime.ubuntu.16.04-x64.Microsoft.NETCore.Runtime.CoreCLR/1.0.4)

JIT

- [debian.8.x64](https://www.nuget.org/api/v2/package/runtime.debian.8-x64.Microsoft.NETCore.Jit/1.0.4)
- [fedora.23.x64](https://www.nuget.org/api/v2/package/runtime.fedora.23-x64.Microsoft.NETCore.Jit/1.0.4)
- [rhel.7-x64](https://www.nuget.org/api/v2/package/runtime.rhel.7-x64.Microsoft.NETCore.Jit/1.0.4)
- [ubuntu.14.04-x64](https://www.nuget.org/api/v2/package/runtime.ubuntu.14.04-x64.Microsoft.NETCore.Jit/1.0.4)
- [ubuntu.16.04-x64](https://www.nuget.org/api/v2/package/runtime.ubuntu.16.04-x64.Microsoft.NETCore.Jit/1.0.4)

## Rename and Extract ##

If your system doesn't recognize *nupkg files as archives, rename them to *.zip or *.tar.gz and extract the `/runtimes` directory to a temporary location. For CoreCLR there will be `/native` and `/lib/netstandard1.0` directories under `/runtimes`. JIT will have only a `/native` directory. Here's an example of what the tmp location should look like when you are done if the Debian 8 packages were used. The list of binaries will be different for other distros.

```
~/tmp-update/
        System.Globalization.Native.so
        libcoreclr.so
        libdbgshim.so
        libmscordbi.so
        libsosplugin.so
        sosdocsunix.txt
        System.Private.CoreLib.ni.dll
        libcoreclrtraceptprovider.so
        libmscordaccore.so
        libsos.so
        mscorlib.ni.dll
        libclrjit.dylib
```

## Back up existing files ##

Since we'll be updating files in-place it's a good idea to make a backup. First you need to locate the `Microsoft.NETCoreApp/1.0.0` directory. If you used the installers for Ubuntu, 1.0.0 will be found under `/usr/share/dotnet/shared/Microsoft.NETCore.App/`. Other distro installations are still manual extraction from archives so it's whereever you copied the directory structure. Something like `/opt/dotnet/shared/Microsoft.NETCore.App` would not be uncommon.

Now that `Microsoft.NETCore.App/1.0.0` has been located, the easiest way to make the backup will be to copy the entire directory which will be updated. `sudo rsync -r 1.0.0/ 1.0.0-backup/` will create the backup directory and copy the entire contents of the source directory.

If the backup was successful `diff 1.0.0/ 1.0.0-backup` will return nothing.

## Copy new files to the shared directory ##

The final step is to update the files in `Microsoft.NETCore.App/1.0.0` by copying the files from the temporary location into Microsoft.NETCoreApp/1.0.0. Do not copy the /native or /lib directories, just the files.

At this point, any portable application on the system will make use of the updated runtime files which you have copied into the `Microsoft.NETCoreApp/1.0.0` directory.
