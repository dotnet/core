# .NET CVEs for 2024-02-13

The following vulnerabilities have been patched.

| ID                               | Problem                              | Severity | Platforms | CVSS                                                       |
| -------------------------------- | ------------------------------------ | -------- | --------- | ---------------------------------------------------------- |
| [CVE-2024-21386][CVE-2024-21386] | .NET Denial of Service Vulnerability | Critical | All       | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:P/RL:O/RC:C |
| [CVE-2024-21404][CVE-2024-21404] | .NET Denial of Service Vulnerability | Critical | Linux     | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:P/RL:O/RC:C |


## Platform Components

The following table lists version ranges for affected platform components.

| Component | Min Version | Max Version | Fixed Version                                              | CVE            | Source fix |
| --------- | ----------- | ----------- | ---------------------------------------------------------- | -------------- | ---------- |
| [aspnetcore][aspnetcore] | >=6.0.0 | <=6.0.26 | [6.0.27](https://www.nuget.org/packages/aspnetcore/6.0.27) | CVE-2024-21386 |    |
|           | >=7.0.0     | <=7.0.15    | [7.0.16](https://www.nuget.org/packages/aspnetcore/7.0.16) | CVE-2024-21386 |            |
|           | >=8.0.0     | <=8.0.1     | [8.0.2](https://www.nuget.org/packages/aspnetcore/8.0.2)   | CVE-2024-21386 |            |
| [dotnet][dotnet] | >=6.0.0 | <=6.0.26 | [6.0.27](https://www.nuget.org/packages/dotnet/6.0.27)     | CVE-2024-21404 |            |
|           | >=7.0.0     | <=7.0.15    | [7.0.16](https://www.nuget.org/packages/dotnet/7.0.16)     | CVE-2024-21404 |            |
|           | >=8.0.0     | <=8.0.1     | [8.0.2](https://www.nuget.org/packages/dotnet/8.0.2)       | CVE-2024-21404 |            |


## Packages

The following table lists version ranges for affected packages.

No packages with vulnerabilities reported.


## Commits

The following table lists commits for affected packages.

| Repo | Branch | Commit |
| ---- | ------ | ------ |



[CVE-2024-21386]: https://github.com/dotnet/announcements/issues/295
[CVE-2024-21404]: https://github.com/dotnet/announcements/issues/296
[aspnetcore]: https://www.nuget.org/packages/aspnetcore
[dotnet]: https://www.nuget.org/packages/dotnet
