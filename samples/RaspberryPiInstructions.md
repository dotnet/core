# .NET Core on Raspberry Pi

.NET Core builds are available that run on the Raspberry Pi and similar hardware. In particular, the Raspberry Pi uses an ARM chip, and requires .NET Core ARM builds. .NET Core supports ARM32 and ARM64.

You can build an application for ARM either on an ARM device or on your X64 machine. Both options are documented below.

We recommend that you use .NET Core 3 for Raspberry Pi development. There are significant improvements in .NET Core 3 that make the experience much better.

Note: .NET Core supports Raspberry Pi 2 and Pi 3. We recommend the Pi 3.

## Installing the .NET Core SDK on Rasberry Pi

The best way to install .NET Core on ARM platforms is via curl.

Note: The pattern documented below is the same one we use for [Docker](https://github.com/dotnet/dotnet-docker). You can look at .NET Core Dockerfiles to learn more about specific installation needs.

Download .NET Core via curl (choose the version that works for you):

* 2.2 ARM32: `curl -SL --output dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Sdk/2.2.103/dotnet-sdk-2.2.103-linux-arm.tar.gz`
* 3.0 ARM32: `curl -SL --output dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Sdk/3.0.100-preview-010184/dotnet-sdk-3.0.100-preview-010184-linux-arm.tar.gz`
* 3.0 ARM64: `curl -SL --output dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Sdk/3.0.100-preview-010184/dotnet-sdk-3.0.100-preview-010184-linux-arm64.tar.gz`

Note: The latest download links are available at the [.NET Core Download page](https://dotnet.microsoft.com/download/archives).

Unpack .NET Core to a global location:

* `sudo mkdir -p /usr/share/dotnet`
* `sudo tar -zxf dotnet.tar.gz -C /usr/share/dotnet`

Symbolically link dotnet into a path location:

* `sudo ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet`

## Installation .NET Core



* [Install .NET Core SDK](https://www.microsoft.com/net/core) into a supported developer configuration.
(Raspberry Pi itself is supported only as deployment target but there is an unsupported version of the SDK available as well.)

* From the terminal/commandline create a folder named `helloworld` and go into it.
* Run `dotnet new console`
* You can find a `helloworld.csproj` file is created under current directory.

```
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.1</TargetFramework>
  </PropertyGroup>

</Project>
```

* If you get restore errors, make sure you have a nuget.config file next to your csproj that includes the dotnet-core myget feed: `<add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />`.

```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />
  </packageSources>
</configuration>
```

## Publishing an app to run on the Pi:

* Run `dotnet publish -r <runtime identifier>` for example `dotnet publish -r win-arm` to publish the application for windows and `dotnet publish -r linux-arm` for Linux running on Raspberry Pi.

* Under `./bin/Debug/netcoreapp2.1/<runtime identifier>/publish` or `.\bin\Debug\netcoreapp2.1\<runtime identifier>\publish` you will see the whole self contained app that you need to copy to your Raspberry Pi.


## Getting the app to run on the Pi.

### Linux

* Install [Linux](https://www.raspberrypi.org/downloads/) on your Pi.

* Install the [platform dependencies from your distro's package manager](https://github.com/dotnet/core/blob/master/Documentation/prereqs.md) for .NET Core. .NET Core depends on some packages from the Linux package manager as prerequisites to running your application.

For Raspbian [Debian 9 Jessie](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x#install-net-core-for-debian-8-or-debian-9-64-bit) you need to do the following:
```
sudo apt-get update
sudo apt-get install curl libunwind8 gettext apt-transport-https
```

* Copy your app, i.e. whole `publish` directory mentioned above, to the Raspberry Pi and execute run `./helloworld` to see `Hello World!` from .NET Core running on your Pi! (make sure you `chmod 755 ./helloworld`)

### Win10 IoT Core

* Install [Windows 10 IoT Core](https://docs.microsoft.com/en-us/windows/iot-core/getstarted) on your Pi.

* Copy your app, i.e. whole `publish` directory mentioned above, to the Raspberry Pi and execute run `helloworld.exe` to see `Hello World!` from .NET Core running on your Pi. 

**It is important that you copy the `publish` directory contents displayed at the end of the publish operation and not from another location in the `bin` folder.**
