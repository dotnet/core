# .NET Core on Raspberry Pi

Arm32 support for .NET Core is still being brought up but there has been enough progress for people to start playing with it. 
It's not ready to be used as a developer environment yet but you can publish an application on a developer machine and run it on a Raspberry Pi. 
These steps have been tested on both a Pi 2 and Pi 3 on Linux and Windows with success.

##Creating an app:

* [Install .NET Core](https://www.microsoft.com/net/download/core) into a supported developer configuration.

* From the terminal/commandline create a folder named helloworld and go into it.

* Run `dotnet new` then `dotnet restore` then `dotnet publish` to publish your helloworld app.

* Run `dotnet ./bin/Debug/netcoreapp1.1/publish/helloworld.dll` on Linux/OSX or `dotnet .\bin\Debug\netcoreapp1.1\publish\helloworld.dll` and you should see it print `Hello World!`.

* Under `./bin/Debug/netcoreapp1.1/publish` or `.\bin\Debug\netcoreapp1.1\publish` on Windows you need to edit the helloworld.runtimeconfig.json file to update the version to `1.2.0-beta-001291-00`.

* This app is now ready to copy over to any machine that has the `1.2.0-beta-001291-00` version of .NET Core on it.


##Getting the app to run on the Pi.

###Linux (Ubuntu)

* Install [Ubuntu 14.04 or 16.04](https://www.raspberrypi.org/downloads/) on your Pi.

* Install the [prereq packages](https://github.com/dotnet/core/blob/master/Documentation/prereqs.md) for .NET Core. 

`sudo apt-get install libunwind8 libunwind8-dev gettext libicu-dev liblttng-ust-dev libcurl4-openssl-dev libssl-dev uuid-dev`

* Extract the matching tar.gz to a folder on your Pi and **cd into that folder in the terminal**.

[dotnet-ubuntu.14.04-arm.1.2.0-beta-001291-00.tar.gz](https://github.com/dotnet/core-setup/files/716354/dotnet-ubuntu.14.04-arm.1.2.0-beta-001291-00.tar.gz) (Ubuntu 14.04 ARM)
[dotnet-ubuntu.16.04-arm.1.2.0-beta-001291-00.tar.gz](https://github.com/dotnet/core-setup/files/716356/dotnet-ubuntu.16.04-arm.1.2.0-beta-001291-00.tar.gz) (Ubuntu 16.04 ARM)

* Create a subfolder called `helloworld` and copy contents of the publish folder you created on your developer machine into it. The contents should be:

```
helloworld.deps.json
helloworld.dll
hellohorld.runtimeconfig.json
```

* run `./dotnet helloworld/helloworld.dll` and you should see `Hello World!` from .NET Core running on your Pi!

Note: While it is possible to build the product on the Pi, it isn't easy today and it's slow. We are working on making it very easy to do. 
We're also hopefully very soon going to have daily dev builds people can get to have all the latest fixes. 
For now I am just pointing to tar.gz's that were built for Ubuntu at a point in time.

###Win10 IoT Core

* Install [Windows 10 IoT Core](https://developer.microsoft.com/en-us/windows/iot/GetStarted) on your Pi.

* Extract [dotnet-win-arm.1.2.0-beta-001291-00.zip](https://dotnetcli.blob.core.windows.net/dotnet/master/Binaries/1.2.0-beta-001291-00/dotnet-win-arm.1.2.0-beta-001291-00.zip) to a folder on your Pi and **cd into that folder in the terminal**.

* Add the folder where you extracted it to your path.

* Create a folder to put your app into and copy contents of the publish folder you created on your developer machine into it which should be:

```
helloworld.deps.json
helloworld.dll
hellohorld.runtimeconfig.json
```

* From that folder run `dotnet helloworld.dll` and you should see `Hello World!` from .NET Core running on your Pi!
