# .NET 7.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations or expected resolution timeframes.

## .NET Runtime

### Assembly.GetType("System.Net.Http.HttpClientHandler", false, true) does not find some types but finds it when ignoreCase is set to false


When trying to do GetType with ignorecase as true in some cases does not find the type but finds it when ignoreCase is set to false.
This only happens in .NET7 preview 1 and does not happen in .NET 6.
More information and workaround can be found at https://github.com/dotnet/runtime/issues/65013

## .NET SDK

### MAUI optional workloads not yet supported in .NET 7

You can continue using 6.0.200 .NET SDK versions until .NET MAUI joins the .NET 7 release. See more information here: https://github.com/dotnet/maui/wiki/.NET-7-and-.NET-MAUI
