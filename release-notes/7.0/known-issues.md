# .NET 7.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations or expected resolution timeframes.

## .NET Runtime

### Assembly.GetType("System.Net.Http.HttpClientHandler", false, true) does not find some types but finds it when ignoreCase is set to false


When trying to do GetType with ignorecase as true does not find the type but finds it when ignoreCase is set to false.
This only happens in .NET7 preview 1 and does not happen in .NET 6.
More information and workaround can be found at https://github.com/dotnet/runtime/issues/65013
