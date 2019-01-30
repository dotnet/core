# Run .NET Core Apps on Raspberry Pi

.NET Core builds are available that run on the Raspberry Pi and similar hardware. In particular, the Raspberry Pi uses an ARM chip, and requires .NET Core ARM builds. .NET Core supports ARM32 and ARM64.

You can build an application for ARM either on an ARM device or on your X64 machine. Both options are documented below.

We recommend that you use .NET Core 3 for Raspberry Pi development. There are significant improvements in .NET Core 3 that make the experience much better.

Note: .NET Core supports Raspberry Pi 2 and Pi 3. We recommend the Pi 3.

Note: You can run [32-bit Linux](https://www.raspberrypi.org/downloads/raspbian/), [64-bit Linux](https://gist.github.com/richlander/467813274cea8abc624553ee72b28213#how-to-install-arm64-builds) and [32-bit Windows](https://docs.microsoft.com/en-us/windows/iot-core/downloads) on the Pi. Any of those options will work with .NET Core. On Linux, it may be helpful to [Starting ssh automatically at boot time](https://raspberrypi.stackexchange.com/questions/1747/starting-ssh-automatically-at-boot-time).

## Configuring Linux

For [32-bit Linux](https://www.raspberrypi.org/downloads/raspbian/), you need to [install the following prerequisites](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x#install-net-core-for-debian-8-or-debian-9-64-bit):

```console
sudo apt-get update
sudo apt-get install curl libunwind8 gettext apt-transport-https
```

For 64-bit Linux, there are several different distros in progress:

* [Debian on Raspberry Pi 3](https://github.com/Debian/raspi3-image-spec)
* [Fedora on Raspberry Pi 3](https://fedoraproject.org/wiki/Architectures/ARM/Raspberry_Pi#Raspberry_Pi_3_aarch64_support)
* [Ubuntu on Raspberry Pi 3](https://wiki.ubuntu.com/ARM/RaspberryPi#arm64)
* [Ubuntu on Pine64](http://wiki.pine64.org/index.php/Pine_A64_Software_Release#Xenial_Mate)

## Installing the .NET Core SDK on Rasberry Pi for Linux ARM32/ARM64

The best way to install .NET Core on ARM platforms is currently via curl. We are working on other options.

Note: The pattern documented below is the same one we use for [Docker](https://github.com/dotnet/dotnet-docker). You can look at .NET Core Dockerfiles to learn more about specific installation needs.

1. Download .NET Core via curl (choose the version that works for you):
  * 2.2 ARM32: `curl -SL --output dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Sdk/2.2.103/dotnet-sdk-2.2.103-linux-arm.tar.gz`
  * 3.0 ARM32: `curl -SL --output dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Sdk/3.0.100-preview-010184/dotnet-sdk-3.0.100-preview-010184-linux-arm.tar.gz`
  * 3.0 ARM64: `curl -SL --output dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Sdk/3.0.100-preview-010184/dotnet-sdk-3.0.100-preview-010184-linux-arm64.tar.gz`

  Note: The latest download links are available at the [.NET Core Download page](https://dotnet.microsoft.com/download/archives).
2. Unpack .NET Core to a global location:
  * `sudo mkdir -p /usr/share/dotnet`
  * `sudo tar -zxf dotnet.tar.gz -C /usr/share/dotnet`
3. Symbolically link dotnet into a path location:
  * `sudo ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet`

You should be able to run .NET Core at this point:

```console
dotnet
```

## Installing the .NET Core SDK on Raspberry Pi on Win10 IoT Core

Install [Windows 10 IoT Core](https://docs.microsoft.com/en-us/windows/iot-core/getstarted) on your Pi.

Install the [.NET Core 3.0 SDK for Windows ARM32](https://dotnet.microsoft.com/download/dotnet-core/3.0).

## Creating and Running an Application on the Pi

It is easy to run an application on the Pi. The following commands are for Linux, but switching the casing will enable the same commands to work on Windows.

Console App:

1. `dotnet new console -o app` // Generate app from template
2. `cd app`
3. `dotnet run` // Build and run app
4. `./bin/Debug/netcoreapp3.0/app` // Alternatively, run app directly

Web App:

1. `dotnet new webapp -o webapp` // Generate app from template
2. `cd webapp`
3. `dotnet run` // Build and run app -- will use `localhost`
4. `./bin/Debug/netcoreapp3.0/webapp --urls "http://*:5100"` //Run app, exposed on port 5100

Note: `dotnet run` will use the `localhost` loopback by default. To view the site on an external port, [configure ASP.NET Core](https://docs.microsoft.com/aspnet/core/fundamentals/host/web-host?view=aspnetcore-2.1#server-urls) to do so with `--urls "http://*:5100"` argument (with `dotnet run` or direct exectuable launch, as seen in step 4 above) and then view on the appropriate IP address and port, such as `http://192.168.1.75:5100`.

## Build on X64 and Publish to Pi

You can build and publish app on another machine (likely x64) and publish to the Pi. We will use a webapp for this example and first test on the local machine (desktop or laptop).

1. `dotnet new webapp -o webapp` // Generate app from template
2. `cd webapp`
3. `dotnet run` // Build and run app -- will use `localhost:5000`
4. `\bin\Debug\netcoreapp3.0\webapp.exe` // Alternatively, run app directly

Now, we will copy the app to the Pi with scp (other tools work similarly, like Putty). There are a few different options.

Assume matching .NET Core runtime is installed on Pi:

1. `scp -r bin\Debug\netcoreapp3.0\ pi@192.168.1.75:~/webapp` // copy app to Pi
2. `ssh pi@@192.168.1.75`
3. `chmod 755 ./webapp/webapp`
4. `./webapp/webapp --urls "http://*:5100"`
5. Navigate to webapp in desktop browser at: `192.168.1.75:5100`

Build self-contained Linux ARM32 app and copy to Pi:

1. `dotnet publish -r linux-arm`
2. `scp -r bin\Debug\netcoreapp3.0\linux-arm\publish pi@192.168.1.75:~/webapp` // copy app to Pi
3. `ssh pi@@192.168.1.75`
4. `chmod 755 ./webapp/webapp`
5. `./webapp/webapp --urls "http://*:5100"`
6. Navigate to webapp in desktop browser at: `192.168.1.75:5100`

Note: For Linux ARM32, use `-r linux-arm`, for  Linux ARM64, use `-r linux-arm64` and for Windows ARM32, use `-r win-arm` .

## Run with Docker

You can run [sample .NET Core Docker apps](https://github.com/dotnet/dotnet-docker/blob/master/samples/README.md) if you have Docker installed.