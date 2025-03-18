# .NET SDK in .NET 10 Preview 1 - Release Notes

.NET 10 Preview 1 includes new .NET SDK features & enhancements:

- [Pruning of Framework-provided Package References](#pruning-of-framework-provided-package-references)

.NET SDK updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Pruning of Framework-provided Package References

Starting in .NET 10, the [NuGet Audit][nuget-audit] feature can now [prune framework-provided package references][prune-package-references-spec] that are not used by the project. This feature will be enabled by default for all .NET TargetFrameworks (e.g. `net8.0`, `net10.0`) and .NET Standard 2.0 and greater TargetFrameworks. This change will help reduce the number of packages that are restored and analyzed during the build process, which can lead to faster build times and reduced disk space usage. It also can lead to a reduction in false positives from NuGet Audit and other dependency-scanning mechanisms.

When this feature is enabled, you should see a marked reduction in the contents of your applications' generated `.deps.json` files - any PackageReferences you may have had that are actually being supplied by the .NET Runtime you use will be automatically removed from the generated dependency file.

While this feature is enabled by default for the TFMs listed above, you can disable it by setting the `RestoreEnablePackagePruning` property to `false` in your project file or Directory.Build.props file.
As part of this feature, a few different validations may be raised, [NU1509](https://learn.microsoft.com/nuget/reference/errors-and-warnings/nu1509), [NU1510](https://learn.microsoft.com/nuget/reference/errors-and-warnings/nu1510) and [NU1511](https://learn.microsoft.com/nuget/reference/errors-and-warnings/nu1511).
The most frequent warning you may see is `NU1510`, which will warn when you have unnecessary direct `PackageReference` in your project. Consider conditioning or remove those PackageReference to address this warning.

[nuget-audit]: https://learn.microsoft.com/nuget/concepts/auditing-packages
[prune-package-references-spec]: https://github.com/NuGet/Home/blob/451c27180d14214bca60483caee57f0dc737b8cf/accepted/2024/prune-package-reference.md
