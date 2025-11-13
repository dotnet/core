# .NET CVEs for 2025-04-08

The following vulnerabilities have been patched.

| ID                               | Problem                              | Severity | Platforms | CVSS                                                       |
| -------------------------------- | ------------------------------------ | -------- | --------- | ---------------------------------------------------------- |
| [CVE-2025-26682][CVE-2025-26682] | .NET Denial of Service Vulnerability | High     | All       | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:P/RL:O/RC:C |


## Platform Components

The following table lists version ranges for affected platform components.

| Component | Min Version | Max Version | Fixed Version                                                                    | CVE            | Source fix          |
| --------- | ----------- | ----------- | -------------------------------------------------------------------------------- | -------------- | ------------------- |
| [microsoft.aspnetcore.app.runtime][microsoft.aspnetcore.app.runtime] | >=8.0.0 | <=8.0.14 | [8.0.15](https://www.nuget.org/packages/microsoft.aspnetcore.app.runtime/8.0.15) | CVE-2025-26682 | [d6605eb][d6605eb]  |
|           | >=9.0.0     | <=9.0.3     | [9.0.4](https://www.nuget.org/packages/microsoft.aspnetcore.app.runtime/9.0.4)   | CVE-2025-26682 | [d5933a9][d5933a9]  |


## Packages

The following table lists version ranges for affected packages.

No packages with vulnerabilities reported.


## Commits

The following table lists commits for affected packages.

| Repo                                   | Branch       | Commit             |
| -------------------------------------- | ------------ | ------------------ |
| [dotnet/aspnetcore][dotnet/aspnetcore] | [main][main] | [d5933a9][d5933a9] |
| [dotnet/aspnetcore][dotnet/aspnetcore] | [main][main] | [d6605eb][d6605eb] |



[CVE-2025-26682]: https://github.com/dotnet/announcements/issues/352
[microsoft.aspnetcore.app.runtime]: https://www.nuget.org/packages/microsoft.aspnetcore.app.runtime
[dotnet/aspnetcore]: https://github.com/dotnet/aspnetcore
[main]: https://github.com/dotnet/aspnetcore/tree/main
[d5933a9]: https://github.com/dotnet/aspnetcore/commit/d5933a9d685c3a09566ec7c9ca818bd7ac2f08ad
[d6605eb]: https://github.com/dotnet/aspnetcore/commit/d6605eb150c993dd8943e2c1a6875a93927c301a
