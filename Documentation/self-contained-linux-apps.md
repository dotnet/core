Self contained Linux applications
=================================
Even though .NET Core Linux applications are now portable over all of the supported Linux distros, they still require installation of 3rd party dependency libraries like CURL, OpenSSL, etc. on the target device. While this is usually ok, there are cases when this is undesirable. For example when the user of such application doesn't have rights to install applications on the target device. Or when the .NET Core dependencies would conflict with dependencies already installed on the target device. 
To enable support of such scenarios, .NET Core starting from version 2.0 supports using local copies of 3rd party dependency libraries. Applications can carry those dependencies with them and use them even if there are system-wide installed versions of those.
## How it works
The main executable of published .NET Core applications (which is the .NET Core host) has a RPATH property set to `$ORIGIN/netcoredeps`. That means that when Linux shared library loader is looking for shared libraries, it looks to this location before looking to default shared library locations. It is worth noting that the paths specified by the `LD_LIBRARY_PATH` environment variable or libraries specified by the `LD_PRELOAD` environment variable are still used before the RPATH property.
So in order to use local copies of the 3rd party libraries, the application developers need to create a directory named `netcoredeps` next to the main application executable and copy all the necessary dependencies into it.
## Gathering the 3rd party dependencies
The following paragraphs below describes the steps needed to get the full set of dependencies that need to be carried with the application:
### Pick the oldest supported distro the application should run at as the source for the dependencies
Select a distro from which you'll get the dependencies that will be packaged with the application. Using the oldest distro ensures that the 3rd party dependencies won't be referencing functions from libc / libstdc++ that are present in newer versions of those libraries only and that are not present on the supported distros.
### Get the transitive closure of all the first level dependencies
That means the dependencies of the first level dependencies, their dependencies, etc. To get that, use the `ldd` command line tool. As a parameter, pass it the root set of dependencies of .NET core listed below. Then add all the dependencies listed to your final list and run `ldd` again on these added ones.
* libcoreclr.so
* System.IO.Compression.Native.so if  your app uses System.IO.Compression.dll assembly
* System.Security.Cryptography.Native.OpenSsl.so if your app uses System.Security.Cryptography.dll assembly
* libssl.so.{version} and libcrypto.so.{version} if your app uses System.Security.Cryptography.dll assembly. The {version} depends on the source distro. For Fedora based distros, it is `10`, for all others except for Debian 9 based distros is it `1.0.0` and for Debian 9 based distros it is `1.0.2`. 
* System.Net.Http.Native.so if your app uses System.Net.Http.dll

In addition to these, add to the list the libicuuc.so.{version}, libicui18n.so.{version} and libicudata.so.{version} if your app doesn't explicitly opt-out of using globalization (by adding the System.Globalization.Invariant element set to true to the xxxxx.runtimeconfig.json file or by setting the `CORECLR_GLOBAL_INVARIANT` env variable to 1). The {version} is the version present on the source distro - use the major version only (for 52.1, use 52)
As mentioned above, if your app uses System.Security.Cryptography.dll, you will also needs to libssl and libcrypto. They are also needed if it uses System.Net.Http.dll. However, there is a catch related to these. The Fedora based distros store root certificates at different location than the other distros and the libcrypto, libssl and libcurl have that location hardcoded (compiled into the binaries). So if you want to support both Fedora based distros and other ones, you'll need to have two versions of your app, one for each case. Or still have one app package, but two sets of dependencies. And during installation or first run of your app, detect the current distro and copy the appropriate set of dependencies from some aside directory to the `netcoredeps` one. Or whatever else works for you.
### From that list, remove standard C/C++ libraries and libraries that are available on all the target distros
This is the basic set of libraries to remove: `libc.so.*`, `libm.so.*`, `libstdc++.so.*`, `libpthread.so.*`, `linux-vdso.so.*`, `libgcc_s.so.*`, `librt.so.*`, `libdl.so.*`, `ld-linux-x86-64.so.*`. At least the `libc` and `libstdc++` have to be removed, otherwise all kinds of weird issues could happen in shared libraries that are used by your application and that were compiled against newer libc / libstdc++ version.
You can also remove a bunch of other libraries that seem to be installed on all major Linux distros by default. Verified on CentOS, Fedora, OpenSUSE, Debian, ArchLinux, Slackware, Gentoo, OpenMandriva and Ubuntu.
* `libcom_err.so.2`
* `libcrypt.so.1`
* `libgpg-error.so.0`
* `liblzma.so.5`
* `libuuid.so.1`
