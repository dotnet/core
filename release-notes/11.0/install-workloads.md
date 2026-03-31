# .NET Workloads

After installing .NET 11 previews, you can install workloads by following these instructions. For more information read through the [documentation](https://learn.microsoft.com/dotnet/core/tools/dotnet-workload).

## .NET MAUI

Install the .NET MAUI workload:

```console
> dotnet workload install maui
...
Successfully installed workload(s) maui.
```

Verify installation:

```console
> dotnet workload list

Installed Workload Id      Manifest Version                            Installation Source
--------------------------------------------------------------------------------------------
maui                    11.0.100-preview.2.26159/11.0.100-preview.2     SDK 11.0.100-preview.2
```

Installing the `maui` workload includes `android`, `ios`, and `maccatalyst` workloads which may be installed independently. Run `dotnet workload search` for a full list of available workload configurations.
