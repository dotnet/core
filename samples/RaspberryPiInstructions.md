# .NET Core on Raspberry Pi

Arm32 builds are available as community supported builds for .NET Core 2.0. 
**There is no SDK that runs on ARM32** but you can publish an application that will run on a Raspberry Pi. 

These steps have been tested on a RPi 2 and RPi 3 with Linux and Windows.

Note: All models of generation 1 and Pi Zero are not supported because the .NET Core JIT depends on armv7 instructions not available on those versions.

## Creating an app:

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
