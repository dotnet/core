# NuGet in .NET 11 RC 2 - Release Notes

- [Configure minimum package publication age from the CLI](#configure-minimum-package-publication-age-from-the-cli)

## Configure minimum package publication age from the CLI

`dotnet nuget add source` and `dotnet nuget update source` accept `--min-publish-age-hours` to set the `minPublishAgeHours` source setting in `nuget.config`. This lets a repository configure the minimum age of package versions eligible for selection without editing the configuration file by hand ([nuget/nuget.client #7724](https://github.com/nuget/nuget.client/pull/7724)). `dotnet package add` and `dotnet package update` use the configured cooldown when selecting a version; an update reports when a newer version is excluded by the setting ([nuget/nuget.client #7713](https://github.com/nuget/nuget.client/pull/7713), [nuget/nuget.client #7705](https://github.com/nuget/nuget.client/pull/7705)). For projects that use floating package versions, restore fails with NU1020 if the cooldown leaves no eligible version. This makes the configuration conflict visible instead of allowing a no-op restore to hide it ([nuget/nuget.client #7694](https://github.com/nuget/nuget.client/pull/7694)).

```dotnetcli
dotnet nuget add source https://api.nuget.org/v3/index.json --name public --min-publish-age-hours 24 --configfile nuget.config
dotnet nuget update source public --min-publish-age-hours 48 --configfile nuget.config
```

<!-- TODO: Validate dotnet package add version selection against a controlled V3 feed with package publication metadata. Package update selection/messaging and NU1020 for floating-version restore were validated separately against a temporary local feed, but are not covered by the maintained configuration demo. -->
