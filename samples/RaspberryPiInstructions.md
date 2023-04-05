# .NET Core on Raspberry Pi

[.NET Core SDK is available on ARM32/ARM64](https://dotnet.microsoft.com/download) which is used by Raspberry Pi but many users have reported it's more convenient to cross build (i.e. `dotnet publish -r linux-arm`) binaries from desktop as it allows for much faster iteration cycle.

These steps have been tested on a RPi 2 and RPi 3 with Linux and Windows.

Note: All models of generation 1 and Pi Zero are not supported because the .NET Core JIT depends on armv7 instructions not available on those versions.

## Creating an app

* [Install .NET Core SDK](https://dotnet.microsoft.com/download) into a supported developer configuration.
(Raspberry Pi itself is supported only as deployment target but there is an unsupported version of the SDK available as well.)

* From the terminal/commandline create a folder named `helloworld` and go into it.
* Run `dotnet new console`
* You can find a `helloworld.csproj` file is created under current directory.

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.1</TargetFramework>
  </PropertyGroup>

</Project>
```

* If you get restore errors, make sure you have a nuget.config file next to your csproj that includes the dotnet-core myget feed: `<add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />`.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />
  </packageSources>
</configuration>
```

## Publishing an app to run on the Pi

* Run `dotnet publish -r <runtime identifier>` for example `dotnet publish -r win-arm` to publish the application for windows and `dotnet publish -r linux-arm` for Linux running on Raspberry Pi.

* Under `./bin/Debug/netcoreapp2.1/<runtime identifier>/publish` or `.\bin\Debug\netcoreapp2.1\<runtime identifier>\publish` you will see the whole self contained app that you need to copy to your Raspberry Pi.

## Getting the app to run on the Pi

### Linux

* Install [Linux](https://www.raspberrypi.org/downloads/) on your Pi.
* Install the [platform dependencies from your distro's package manager](https://github.com/dotnet/core/blob/main/Documentation/prereqs.md) for .NET Core. .NET Core depends on some packages from the Linux package manager as prerequisites to running your application.

For Raspbian [Debian 9 Jessie](https://learn.microsoft.com/dotnet/core/linux-prerequisites?tabs=netcore2x#install-net-core-for-debian-8-or-debian-9-64-bit) you need to do the following:

```console
sudo apt-get update
sudo apt-get install curl libunwind8 gettext apt-transport-https
```

* Copy your app, i.e. whole `publish` directory mentioned above, to the Raspberry Pi and execute run `./helloworld` to see `Hello World!` from .NET Core running on your Pi! (make sure you `chmod 755 ./helloworld`)

### Win10 IoT Core

* Install [Windows 10 IoT Core](https://learn.microsoft.com/windows/iot-core/getstarted) on your Pi.
* Copy your app, i.e. whole `publish` directory mentioned above, to the Raspberry Pi and execute run `helloworld.exe` to see `Hello World!` from .NET Core running on your Pi.

**It is important that you copy the `publish` directory contents displayed at the end of the publish operation and not from another location in the `bin` folder.**

## Remote debugging

It is possible to setup VS Code for remote debugging. Please refer to [Scott Hanselman's tutorial](https://www.hanselman.com/blog/RemoteDebuggingWithVSCodeOnWindowsToARaspberryPiUsingNETCoreOnARM.aspx).

## Remote Debugging from Windows using a Setup Script

Pete Gallagher (A Microsoft Azure MVP - @pete_codes) has created a single line setup script to enable remote debugging from a Windows Machine using VS Code to a Raspberry Pi.

This setup script makes use of cwRsync to copy the published files over to the Pi and then uses SSH to download and attach the .NET debugger remotely from VS Code.

Please refer to [Pete Gallagher's Blog](https://bit.ly/pidotnetremotedeploy)

## Single Line Install script for .NET Core and .NET 5 for the Raspberry Pi

Pete Gallagher has also created single line install scripts for .NET Core and .NET 5 for the Raspberry Pi.

Please refer to Pete Gallagher's Blog;

* [.NET Core](https://bit.ly/dotnetcorepi)
* [NET 5](https://bit.ly/dotnet5pi)

## GPIO access / communicating with hardware

GPIO access as well as I2C, SPI, PWM and many more can be achieved with [.NET IoT](https://github.com/dotnet/iot). For list of available devices please refer to [device listing](https://github.com/dotnet/iot/blob/main/src/devices/README.md).

Please consider contributing to the repository or filing an issue if you cannot find the device you're looking for!
