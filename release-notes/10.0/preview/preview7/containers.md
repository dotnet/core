# Containers in .NET 10 Preview 7 - Release Notes

Here's a summary of what's new in Containers in this preview release:

- [`dnx` is now on the `PATH` in SDK images](#dnx-is-now-on-the-path-in-sdk-images)

Containers updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## `dnx` is now on the `PATH` in SDK images

`dnx` is now available directly from .NET 10 SDK container images. See [One-shot tool execution](../preview6/sdk.md#one-shot-tool-execution) for more details about `dnx`.

To run a .NET tool using `dnx` in your Dockerfile build, you can use the following syntax:

```Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview
RUN dnx --yes <packageId> [<commandArguments>...]
```

To use `dnx` from the .NET SDK image directly from the command line, you can use the following Docker command:

```console
docker run --rm mcr.microsoft.com/dotnet/sdk:10.0-preview dnx --yes <packageId> [<commandArguments>...]
```
