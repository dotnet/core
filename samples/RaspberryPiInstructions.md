# .NET Core on Raspberry Pi

Arm32 support for .NET Core is still being brought up, but there are now daily runtime builds that are ready to use. 
There is no SDK that runs on ARM32 yet, but you can publish an application that will run on a Raspberry Pi. 

These steps have been tested on a RPi 2 and RPi 3 with Linux and Windows.

## Creating an app:

* [Install .NET Core 2.0 SDK](https://github.com/dotnet/cli/tree/master) into a supported developer configuration.


* From the terminal/commandline create a folder named `helloworld` and go into it.
* Run `dotnet new console`
* You can find `helloworld.csproj` file is created under current directory.
* Edit the `helloworld.csproj` file to look like this (Note the version may be newer for RuntimeFrameworkVersion but not lower than 2.0.0-beta-001620-00).

```
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.0</TargetFramework>
    <RuntimeFrameworkVersion>2.0.0-beta-001620-00</RuntimeFrameworkVersion>
    <RuntimeIdentifiers>win8-arm;ubuntu.14.04-arm;ubuntu.16.04-arm</RuntimeIdentifiers>
  </PropertyGroup>

</Project>
```

* Make sure you have a nuget.config file next to your csproj that includes the dotnet-core myget feed: `<add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />`.

```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />
  </packageSources>
</configuration>
```

* Run `dotnet restore`.

* Run `dotnet publish -r <runtime identifier>` for example `dotnet publish -r win8-arm` to publish the application for windows and `dotnet publish -r ubuntu.16.04-arm` for ubuntu 16.04 running on Raspberry Pi.

* Under `./bin/Debug/netcoreapp2.0/<runtime identifier>/publish` or `.\bin\Debug\netcoreapp2.0\<runtime identifier>\publish` you will see the whole self contained app that you need to copy to your Raspberry Pi.


## Getting the app to run on the Pi.

### Linux (Ubuntu)

* Install [Ubuntu 14.04 or 16.04](https://www.raspberrypi.org/downloads/) on your Pi.

* Install the [prereq packages](https://github.com/dotnet/core/blob/master/Documentation/prereqs.md) for .NET Core. 

* Copy your app to the Raspberry Pi and execute run `./helloworld` to see `Hello World!` from .NET Core running on your Pi!

Note: While it is possible to build the product on the Pi, it isn't easy today and it's slow. We are working on making it very easy to do.

### Win10 IoT Core

* Install [Windows 10 IoT Core](https://developer.microsoft.com/en-us/windows/iot/GetStarted) on your Pi.

* Copy your app to the Raspberry Pi and execute run `helloworld.exe` to see `Hello World!` from .NET Core running on your Pi
