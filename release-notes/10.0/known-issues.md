# .NET 10 Known Issues

You may encounter some known issues, which may include workarounds, mitigations, or expected resolution timeframes. Watch this space for any known issues in .NET 10.0.

## Windows hosting bundle upgrade breaks ANCM on ARM64 machines

Starting in .NET 10 preview 2, changes to the Windows hosting bundle installer fix running x64 and x86 web applications with ANCM v2 on ARM64 has broken upgrade scenarios. Some important components like aspnetcorev2.dll and the module entry in applicationhost.config get removed rather than updated if you have a previous version of the hosting bundle already installed.

This causes problems for both IIS and IIS express on ARM64 machines only after attempting to update. Fortunately, **you can work around this issue by uninstalling all hosting bundles and reinstalling the .NET 10 preview 2 hosting bundle.**

See https://github.com/dotnet/aspnetcore/issues/60764 for more details.
