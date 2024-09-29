# .NET SDK in .NET 9 Preview 1 Release Notes

.NET 9 Preview 1 includes several new SDK features.

SDK updates in .NET 9 Preview 1:
* [What's new in the .NET SDK in .NET 9](https://review.learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation.

.NET 9 Preview 1:
* [Discussion](https://aka.ms/dotnet/9/preview1)
* [Release notes](README.md) 

# Terminal Logger enabled by default

The default experience for all `dotnet` CLI commands that use MSBuild is now Terminal Logger - the enhanced logging experience that we released in .NET 8. This new output uses the capabilities of modern terminals to provide functionality like clickable links, duration timers for MSBuild tasks, and color coding of warning and error messages in a more condensed and usable output than the existing MSBuild console logger. You can read more about the new logger in the [original release announcement](https://devblogs.microsoft.com/dotnet/announcing-dotnet-8-preview-4/).

The new logger should auto-detect if it can be used, but users can always manually control when Terminal Logger is used. Terminal Logger can be disabled for a specific command by using the `--tl:off` option, or on a more broad scale by setting the `MSBUILDTERMINALLOGGER` environment variable to `off`.

The set of commands that will use Terminal Logger by default is

* build
* clean
* msbuild
* pack
* publish
* restore
* test

# Automatic tool upgrade and downgrade on install

`dotnet tool install` will now automatically update the tool to the latest version if a newer version is available. Previously, `dotnet tool update` was required to update an installed tool.

For example:

```bash
$ dotnet tool install PowerShell -g --version 7.4.0
$ dotnet tool install PowerShell -g
```

The latest version is now installed, 7.4.1 at the time of writing.


`dotnet tool install --allow-downgrade` will now allow you to install an older version of a tool already installed

For more detail, see [dotnet/sdk #37311](https://github.com/dotnet/sdk/pull/37311)
