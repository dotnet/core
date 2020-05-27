# How to use .NET Core on RHEL 6 / CentOS 6
This document describes the prerequisites required to run .NET Core applications on RHEL / CentOS 6. Since this version is quite old, there are two runtime libraries that are not available as standard  installation packages in versions that .NET Core can use, so they need to be obtained in different ways described in the sections below.
## Required packages
.NET Core requires the following packages to be installed on RHEL 6: 
* epel-release 
* libunwind
* openssl
* libnghttp2
* libidn
* krb5-libs
* libuuid
* lttng-ust
* zlib

.NET Core also needs two runtime libraries - CURL and ICU - that are not available as RHEL 6 installation packages in versions that .NET Core relies on. CURL is required if the application references System.Net.Http.dll. ICU is needed except if globalization is disabled. Globalization can be disabled by setting the environment variable `DOTNET_SYSTEM_GLOBALIZATION_INVARIANT` to `true` or by adding `System.Globalization.Invariant` element set to `true` under `configProperties` in `*.runtimeconfig.json` file of the application. Here is an example for a console app:
```json
{
    "runtimeOptions": {
        "configProperties": {
            "System.Globalization.Invariant": true
        },
    }
}
```
For more information about enabling or disabling the Globalization, you may refer to the [Globalization Invariant Mode Doc](https://github.com/dotnet/corefx/blob/master/Documentation/architecture/globalization-invariant-mode.md)

## Getting the libraries that are not available as packages.
### ICU
The ICU libraries can be downloaded as a precompiled binary from the ICU website, the URL is https://github.com/unicode-org/icu/releases/download/release-57-1/icu4c-57_1-RHEL6-x64.tgz.
### CURL
The CURL libraries need to be built from the source code. The source code can be obtained from the CURL website, the URL is https://curl.haxx.se/download/curl-7.45.0.tar.gz.
To build it, follow the steps described below.

First install the prerequisites:
```sh
yum install -y \
    wget \
    epel-release 

yum install -y \
    openssl-devel \
    libnghttp2-devel \
    libidn-devel \
    gcc 
```
Now untar the source code
```sh
tar -xf curl-7.45.0.tar.gz
```
Change the current directory to where the CURL source code was untared:
```sh
cd curl-7.45.0
```
The following command performs the build with the right settings for .NET Core:
```sh
./configure \
    --disable-dict \
    --disable-file \
    --disable-ftp \
    --disable-gopher \
    --disable-imap \
    --disable-ldap \
    --disable-ldaps \
    --disable-libcurl-option \
    --disable-manual \
    --disable-pop3 \
    --disable-rtsp \
    --disable-smb \
    --disable-smtp \
    --disable-telnet \
    --disable-tftp \
    --enable-ipv6 \
    --enable-optimize \
    --enable-symbol-hiding \
    --with-ca-bundle=/etc/pki/tls/certs/ca-bundle.crt \
    --with-nghttp2 \
    --with-gssapi \
    --with-ssl \
    --without-librtmp \
    --prefix=$PWD/install/usr/local \
&& \
make install
```
Now pack the compiled CURL:
```sh
cd install 
tar -czf curl-7_45_0-RHEL6-x64.tgz *
```
## Making the libraries available for a .NET Core application
There are several ways to do this. The following paragraphs describe them. 
### Install the libraries into /usr/local
First untar the .tgz files as follows:
```sh
tar -xf curl-7_45_0-RHEL6-x64.tgz -C /
tar -xf icu4c-57_1-RHEL6-x64.tgz -C /
```
Then set `LD_LIBRARY_PATH` to `/usr/local/lib` before running the application:
```sh
LD_LIBRARY_PATH=/usr/local/lib your_dotnet_app
```
**Important** - please make sure that you do not set the LD_LIBRARY_PATH using `export` in your current shell or even globally for your session. Linux applications that depend on the default CURL (like the `yum`) would stop working.
### Install the libraries into the netcoredeps subdirectory of your .NET Core application
This works only for self-contained published apps. Create the `netcoredeps` subdirectory in the same directory where your apps main executable is located. Then change the current directory to the `netcoredeps` and extract the libraries into that directory as follows:
```sh
tar -xf /your/path/to/curl-7_45_0-RHEL6-x64.tgz --strip-components=3 usr/local/lib/*.so*
tar -xf /your/path/to/icu4c-57_1-RHEL6-x64.tgz --strip-components=3 usr/local/lib/*.so*
```
(replace the /your/path/to/ by the real path to the tar file)
### For the app developers – pack the libraries with your application
The steps are the same as for the previous option, but they are done by the app developer. The app is then packaged including the libraries.
## Troubleshooting
**Q1:** I try to run a .NET Core application on RHEL 6 / CentOS 6 and I get the following exception: 
```
FailFast: Couldn't find a valid ICU package installed on the system. Set the configuration flag System.Globalization.Invariant to true if you want to run with no globalization support.

   at System.Environment.FailFast(System.String)
   at System.Globalization.GlobalizationMode.GetGlobalizationInvariantMode()
   at System.Globalization.GlobalizationMode..cctor()
   at System.Globalization.CultureData.CreateCultureWithInvariantData()
   at System.Globalization.CultureData.get_Invariant()
   at System.Globalization.CultureData.GetCultureData(System.String, Boolean)
   at System.Globalization.CultureInfo.InitializeFromName(System.String, Boolean)
   at System.Globalization.CultureInfo.Init()
   at System.Globalization.CultureInfo..cctor()
   at System.StringComparer..cctor()
   at System.AppDomainSetup.SetCompatibilitySwitches(System.Collections.Generic.IEnumerable`1<System.String>)
   at System.AppDomain.PrepareDataForSetup(System.String, System.AppDomainSetup, System.String[], System.String[])
Aborted (core dumped)
```
**A1:** The ICU libraries were not extracted from `icu4c-57_1-RHEL6-x64.tgz` to the right place, or `LD_LIBRARY_PATH` was not set to `/usr/local/lib`. See the [Making the libraries available for a .NET Core application](#making-the-libraries-available-for-a-net-core-application) section.
 

**Q2:** I try to run a .NET Core application on RHEL 6 / CentOS 6 and I get the exception similar to the following one:
```
dotnet: symbol lookup error: System.Net.Http.Native.so: undefined symbol: curl_multi_wait
```
**A2:** The CURL libraries were not extracted from `curl-7_45_0-RHEL6-x64.tgz` to the right place, or `LD_LIBRARY_PATH` was not set to `/usr/local/lib`. See the [Making the libraries available for a .NET Core application](#making-the-libraries-available-for-a-net-core-application) section.
