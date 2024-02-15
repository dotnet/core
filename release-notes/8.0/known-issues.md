# .NET 8 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET SDK

### MAUI workloads issue using .NET 8.0.200 SDK
Customers installing MAUI workloads using the 8.0.200 standalone SDK could install the RC1 version of the workloads from a few months ago by mistake. This will impact MAUI app build and behavior functionality. 

The workaround is to install 8.0.102 SDK on the same machine or use global.json to stick with an 8.0.1xx version of the SDK.
