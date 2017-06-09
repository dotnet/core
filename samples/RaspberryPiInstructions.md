# .NET Core on Raspberry Pi

Arm32 support for .NET Core is still being brought up, but there are now daily runtime builds that are ready to use. 
There is no SDK that runs on ARM32 yet, but you can publish an application that will run on a Raspberry Pi. 

These steps have been tested on a RPi 2 and RPi 3 with Linux and Windows.

## Creating an app:

* [Install .NET Core 2.0 SDK](https://www.microsoft.com/net/core/preview) into a supported developer configuration.


* From the terminal/commandline create a folder named `helloworld` and go into it.
* Run `dotnet new console`
* You can find `helloworld.csproj` file is created under current directory.

```
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.0</TargetFramework>
    <RuntimeIdentifiers>win-arm;linux-arm</RuntimeIdentifiers>
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

* Run `dotnet restore`.

* Run `dotnet publish -r <runtime identifier>` for example `dotnet publish -r win-arm` to publish the application for windows and `dotnet publish -r linux-arm` for Linux running on Raspberry Pi.

* Under `./bin/Debug/netcoreapp2.0/<runtime identifier>/publish` or `.\bin\Debug\netcoreapp2.0\<runtime identifier>\publish` you will see the whole self contained app that you need to copy to your Raspberry Pi.


## Getting the app to run on the Pi.

### Linux

* Install [Linux](https://www.raspberrypi.org/downloads/) on your Pi.

* Install the [prereq packages](https://github.com/dotnet/core/blob/master/Documentation/prereqs.md) for .NET Core. 

* Copy your app to the Raspberry Pi and execute run `./helloworld` to see `Hello World!` from .NET Core running on your Pi!

### Win10 IoT Core

* Install [Windows 10 IoT Core](https://developer.microsoft.com/en-us/windows/iot/GetStarted) on your Pi.

* Copy your app to the Raspberry Pi and execute run `helloworld.exe` to see `Hello World!` from .NET Core running on your Pi


## Getting a MVC application run on the Pi 

* Create a new MVC app with the latest SDK and via the command line: dotnet new mvc on a windows laptop/pc
* Change the cproj file with the following:

```
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>netcoreapp2.0</TargetFramework>
    <MvcRazorCompileOnPublish>false</MvcRazorCompileOnPublish>
  <RuntimeIdentifiers>win-arm;linux-arm</RuntimeIdentifiers>
    <UserSecretsId>aspnet-test6-1765DAD7-51F4-4572-8443-7F7BD9581173</UserSecretsId>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.All" Version="2.0.0-preview2-25159" />
  </ItemGroup>

  <ItemGroup>
    <DotNetCliToolReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Tools" Version="2.0.0-preview2-25159" />
  </ItemGroup>

</Project>
```

* run `dotnet restore`
* run `dotnet publish -r linux-arm`
* copy the output in the pubished folder (bin\Debug\netcoreapp2.0\linux-arm\publish) to a folder on your raspberry pi (in my case running Raspbian Jessie)
* go to the folder (with ssh) and run: `sudo ./yourprojectname`

Tada! A working MVC application on your raspberry pi!

