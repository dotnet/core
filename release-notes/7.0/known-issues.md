# .NET 7.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations or expected resolution timeframes.

## .NET Runtime

### Assembly.GetType("System.Net.Http.HttpClientHandler", false, true) does not find some types but finds it when ignoreCase is set to false


When trying to do GetType with ignorecase as true in some cases does not find the type but finds it when ignoreCase is set to false.
This only happens in .NET7 preview 1 and does not happen in .NET 6.
More information and workaround can be found at https://github.com/dotnet/runtime/issues/65013

### Libraries has a non blocking issue in System.Security.Cryptography.
.NET 7 Preview 3 on Linux skips revocation checks for expired certificates, reporting RevocationStatusUnknown when revocation checks were enabled. You can read more about this here: https://github.com/dotnet/runtime/issues/66803

## .NET SDK

### [Unhandled Exception in dotnet format app in .NET 7.0 Preview 5](https://github.com/dotnet/sdk/issues/25879)

dotnet format app that comes with SDK has this exception:
Unhandled exception: System.IO.FileLoadException: Could not load file or assembly 'System.Configuration.ConfigurationManager, Version=6.0.0.0

Workaround:

[Install dotnet-format as a global tool](https://github.com/dotnet/format#how-to-install-development-builds)

`dotnet tool install -g dotnet-format --version "7.*" --add-source https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet7/nuget/v3/index.json`

Then invoke the global tool using `dotnet-format` instead of through the dotnet CLI using `dotnet format`.


### MAUI optional workloads not yet supported in .NET 7

You can continue using 6.0.200 .NET SDK versions until .NET MAUI joins the .NET 7 release. See more information here: https://github.com/dotnet/maui/wiki/.NET-7-and-.NET-MAUI




