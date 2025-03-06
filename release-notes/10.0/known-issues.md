# .NET 10 Known Issues

You may encounter some known issues, which may include workarounds, mitigations, or expected resolution timeframes. Watch this space for any known issues in .NET 10.0.

## ASP.NET Core Runtime Hosting Bundle upgrade breaks IIS hosting on ARM64 machines

Starting in .NET 10 Preview 2, installing the ASP.NET Core Runtime Hosting Bundle for Windows on ARM64 when a earlier version of the hosting bundle was previously installed breaks IIS hosting. This causes problems for both IIS and IIS express on ARM64 machines after attempting to update the hosting bundle. Fortunately, **you can work around this issue by uninstalling all hosting bundles and reinstalling the .NET 10 Preview 2 hosting bundle.**

See https://github.com/dotnet/aspnetcore/issues/60764 for more details.
