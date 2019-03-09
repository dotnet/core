# dotnet-bot Sample

The dotnet-bot sample demonstrates "hello world" type usage of .NET Core. It displays [dotnet-bot](https://github.com/dotnet-bot), the open source mascot for .NET Core projects. This sample is very similar to the Docker [whalesay](https://docs.docker.com/engine/getstarted/step_three/) sample.

## Topics

You will exercise the following topics in this sample.

- Building and running a .NET Core application.
- Creating a Docker image for a .NET Core application.
- Running a .NET Core application in container.

## Script

Follow these steps to try out this sample. The instructions are intended to be Operating System agnostic, unless called out. 

**Preparing your Environment**

1. Install the [.NET Core SDK](https://dot.net/core) (2.1 or higher) for your operating system.
2. Git clone this repository or otherwise copy this sample to your machine: `git clone https://github.com/dotnet/core/`
3. Navigate to the sample on your machine at the command prompt or terminal.

**Run the application**

4. Run application: `dotnet run`
5. Alternatively, you can build and directly run your application with the following two commands:
   - `dotnet build`
   - `dotnet bin/Debug/netcoreapp2.1/dotnetbot.dll`
6. You can also try passing input to the sample to get the dotnet-bot to say something: `dotnet run dotnet-bot is a great teacher`

**Dockerize the application**

The Docker instructions are OS agnostic, however, the Dockerfile used relies on a Linux image.

7. Install the [Docker tools](https://www.docker.com/products/docker) for your operating system.
8. Build a Docker container, as specified by the [Dockerfile](Dockerfile): `docker build -t dotnetbot .`
9. Run the application in the container: `docker run dotnetbot Hello .NET Core from Docker`
