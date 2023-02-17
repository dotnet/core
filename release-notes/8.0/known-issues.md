# .NET 8.0 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET SDK
### [8.0 Preview 1] Using the `--output` option fails for many commands when targeting a solution

A [breaking change](https://learn.microsoft.com/dotnet/core/compatibility/sdk/7.0/solution-level-output-no-longer-valid) was introduced that was intended to prevent common build errors. However, many users relied on this behavior to build their projects. We have downgraded this change to a warning and are intent on releasing this fix in .NET 8.0 Preview 2. Please see the linked breaking change notification for more details.
