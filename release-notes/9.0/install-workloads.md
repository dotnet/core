# .NET Workloads

After installing .NET 9 previews, you can install workloads by following these instructions. For more information read through the [documentation](https://learn.microsoft.com/dotnet/core/tools/dotnet-workload).

## .NET MAUI

Install the .NET MAUI workload:

```
> dotnet workload install maui
...
Successfully installed workload(s) maui.
```

Verify installation:

```
> dotnet workload list

Installed Workload Id      Manifest Version                            Installation Source
--------------------------------------------------------------------------------------------
maui                    9.0.0-preview.1.9973/9.0.100-preview.1     SDK 9.0.100-preview.1
```

Installing the `maui` workload includes `android`, `ios`, and `maccatalyst` workloads which may be installed independently. Run `dotnet workload search` for a full list of available workload configurations.