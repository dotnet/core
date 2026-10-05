# NuGet release-note validation

With the .NET 11 RC 2 SDK on `PATH`, run `.\Validate.ps1`. It demonstrates that `dotnet nuget add source` and `dotnet nuget update source` persist the configured minimum age in a temporary NuGet configuration file. It does not exercise package version selection or restore behavior.

Package update selection/messaging and floating-version restore failure with NU1020 were validated separately against a temporary local feed; the maintained sample does not cover those behaviors. `dotnet package add` version selection against a controlled V3 feed with publication metadata remains unvalidated, as tracked by the TODO in the RC 2 NuGet release notes.
