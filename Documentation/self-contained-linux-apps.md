Self-contained Linux applications
=================================
.NET Core Linux applications are now portable over all of the supported Linux distros. However, they still require installation of third-party dependency libraries, such as CURL or OpenSSL, on the target device. While installing these dependencies is usually fine, there are cases when this requirement is undesirable. For example, when the user of such application doesn't have rights to install applications on the target device. Or when the .NET Core dependencies would conflict with dependencies already installed on the target device. 
To enable that scenario, .NET Core 2.0 and later versions support using local copies of third-party dependency libraries. Applications can carry those dependencies and use them, even if there are system-wide installed versions.
## How it works
The main executable of published .NET Core applications (which is the .NET Core host) has an RPATH property set to `$ORIGIN/netcoredeps`. That means that when Linux shared library loader is looking for shared libraries, it looks to this location before looking to default shared library locations. It is worth noting that the paths specified by the `LD_LIBRARY_PATH` environment variable or libraries specified by the `LD_PRELOAD` environment variable are still used before the RPATH property.
So, in order to use local copies of the third-party libraries, developers need to create a directory named `netcoredeps` next to the main application executable and copy all the necessary dependencies into it.
## Gathering the third-party dependencies
The following sections describe the steps needed to get the full set of dependencies that need to be carried with the application:
### Pick the oldest supported distro the application should run at as the source for the dependencies
Select a distro to get the dependencies to be packaged with the application. Using the oldest distro ensures that the third-party dependencies don't reference functions from libc / libstdc++ that are only present in newer versions of those libraries and not present in the supported distros.
### Get the transitive closure of all the first-level dependencies
That means the dependencies of the first-level dependencies, their dependencies, etc. To get those transitives closures, use the `ldd` command-line tool. As a parameter, pass the root set of .NET Core dependencies to the command as follows:
* libcoreclr.so
* If your app uses System.IO.Compression.dll assembly: `System.IO.Compression.Native.so`
* If your app uses the System.Security.Cryptography.dll assembly: `System.Security.Cryptography.Native.OpenSsl.so`, `libssl.so.{version}`, and `libcrypto.so.{version}`.
{version} depends on the source distro as follows:
   * Fedora-based distros: `10`
   * Debian 9-based distros: `1.0.2`
   * All others: `1.0.0`
* If your app uses the System.Net.Http.dll assembly: `System.Net.Http.Native.so`, `libssl.so.{version}`, and `libcrypto.so`.

Then, add all the dependencies needed to your final list and run `ldd` again on these added ones.

If your app doesn't explicitly opt out of using globalization, you also need to add `libicuuc.so.{version}`, `libicui18n.so.{version}`, and `libicudata.so.{version}` to the list, in addition to the ones previously listed. To explicitly opt out of globalization, you need to add the System.Globalization.Invariant element set to true to the xxxxx.runtimeconfig.json file or set the `CORECLR_GLOBAL_INVARIANT` environment variable to 1. The {version} is the version present on the source distro. Use the major version only. For example, for 52.1, use 52.
As previously mentioned, if your app uses System.Security.Cryptography.dll or System.Net.Http.dll, you also need to add `libssl` and `libcrypto`. However, there is a catch related to these libraries. The Fedora-based distros store root certificates at a different location than the other distros and the `libcrypto`, `libssl`, and `libcurl` have that location hardcoded, compiled into the binaries. So, if you want to support both Fedora-based distros and other ones, you either need have two versions of your app, one for each case, or have one app package, but two sets of dependencies. And during installation or first run of your app, you need to detect the current distro and copy the appropriate set of dependencies from some aside directory to the `netcoredeps` one. Or whatever else works for you.
### From that list, remove standard C/C++ libraries and libraries that are available on all the target distros
The following list shows the basic set of libraries to remove: `libc.so.*`, `libm.so.*`, `libstdc++.so.*`, `libpthread.so.*`, `linux-vdso.so.*`, `libgcc_s.so.*`, `librt.so.*`, `libdl.so.*`, `ld-linux-x86-64.so.*`, `libresolv.so.*`. At least, the `libc`, `libresolv` and `libstdc++` have to be removed, otherwise all kinds of weird issues could happen in shared libraries that are used by your application and that were compiled against newer libc / libstdc++ version.
You can also remove other libraries that seem to be installed on all major Linux distros by default as follows:
* `libcom_err.so.2`
* `libcrypt.so.1`
* `libgpg-error.so.0`
* `liblzma.so.5`
* `libuuid.so.1`
This list was verified on CentOS, Fedora, openSUSE, Debian, ArchLinux, Slackware, Gentoo, OpenMandriva, and Ubuntu.
