# .NET CVEs for 2024-05-14

The following vulnerabilities have been patched.

| ID                               | Problem                                  | Severity | Platforms | CVSS                                                       |
| -------------------------------- | ---------------------------------------- | -------- | --------- | ---------------------------------------------------------- |
| [CVE-2024-30045][CVE-2024-30045] | .NET Remote Code Execution Vulnerability | Critical | All       | CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L/E:U/RL:O/RC:C |
| [CVE-2024-30046][CVE-2024-30046] | .NET Denial of Service Vulnerability     | Critical | All       | CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:H/E:U/RL:O/RC:C |


## Platform Components

The following table lists version ranges for affected platform components.

| Component | Min Version | Max Version | Fixed Version                                              | CVE            | Source fix |
| --------- | ----------- | ----------- | ---------------------------------------------------------- | -------------- | ---------- |
| [aspnetcore][aspnetcore] | >=7.0.0 | <=7.0.18 | [7.0.19](https://www.nuget.org/packages/aspnetcore/7.0.19) | CVE-2024-30046 |    |
|           | >=8.0.0     | <=8.0.4     | [8.0.5](https://www.nuget.org/packages/aspnetcore/8.0.5)   | CVE-2024-30046 |            |
| [dotnet][dotnet] | >=7.0.0 | <=7.0.18 | [7.0.19](https://www.nuget.org/packages/dotnet/7.0.19)     | CVE-2024-30045 |            |
|           | >=8.0.0     | <=8.0.4     | [8.0.5](https://www.nuget.org/packages/dotnet/8.0.5)       | CVE-2024-30045 |            |


## Packages

The following table lists version ranges for affected packages.

No packages with vulnerabilities reported.


## Commits

The following table lists commits for affected packages.

| Repo | Branch | Commit |
| ---- | ------ | ------ |



[CVE-2024-30045]: https://github.com/dotnet/announcements/issues/307
[CVE-2024-30046]: https://github.com/dotnet/announcements/issues/308
[aspnetcore]: https://www.nuget.org/packages/aspnetcore
[dotnet]: https://www.nuget.org/packages/dotnet
