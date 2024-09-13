# .NET SDK in .NET 9 Preview 2 Release Notes

.NET 9 Preview 2 includes several new SDK features. We focused on the following areas:

## Parallel Testing and Terminal Logger Test Display

`dotnet test` has been updated to be more fully integrated with MSBuild. As a result, tests can be run across different Target Frameworks for the same project in parallel! This parallelism by default will adhere to the standard way of limiting how much parallelism MSBuild uses (the `/m` switch), but if you need to disable this behavior for any reason, you can set the `TestTfmsInParallel` property to `false` to opt out of the new behavior.

In addition, Test result reporting is now supported directly in the MSBuild Terminal Logger. Running `dotnet test` will yield more fully-featured test reporting both while the tests are running (displaying the running test name) as well as after tests are completed (when the test errors, if any, will be rendered nicely).

You can see an example of both of these features at the same time in the following animation:

![parallel-testing](media/dotnettest.gif)

## Controlling .NET Tool runtime behavior

.NET Tools are framework-dependent apps that users can install globally or locally, then run using the .NET SDK and installed .NET Runtimes. These tools, like all .NET apps, are targeted for a specific major version of .NET. By default, apps will not run on _newer_ versions of .NET. Tool authors have been able to opt in to running their tool on newer versions of the .NET Runtime by setting a property called `RollForward` in their project files. However, not all tools do so.

We've added an option to `dotnet tool install` that lets users decide how .NET Tools should be run. When you install a tool via `dotnet tool install`, or when you run an already-installed tool via `dotnet tool run <toolname>`, you can add a new flag called `--allow-roll-forward`. When you do this, the tool will be configured with RollForward mode `Major`. This mode allows the tool to run on a newer major version of .NET if the matching .NET version is not available. The primary scenario of this feature is to help early adopters use .NET Tools without tool authors having to change any code!

# Other Reading

SDK updates in .NET 2 Preview 2:

- [Release notes](sdk.md)
- [What's new in the .NET Runtime in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 2:

- [Discussion](https://aka.ms/dotnet/9/preview2)
- [Release notes](README.md)