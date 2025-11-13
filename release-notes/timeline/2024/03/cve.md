# .NET CVEs for 2024-03-12

The following vulnerabilities have been patched.

| ID                               | Problem                              | Severity | Platforms | CVSS                                                       |
| -------------------------------- | ------------------------------------ | -------- | --------- | ---------------------------------------------------------- |
| [CVE-2024-21392][CVE-2024-21392] | .NET Denial of Service Vulnerability | Critical | All       | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:P/RL:O/RC:C |
| [CVE-2024-26190][CVE-2024-26190] | Microsoft QUIC Denial of Service Vulnerability | Critical | Windows | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:U/RL:O/RC:C |


## Platform Components

The following table lists version ranges for affected platform components.

| Component | Min Version | Max Version | Fixed Version                                          | CVE            | Source fix |
| --------- | ----------- | ----------- | ------------------------------------------------------ | -------------- | ---------- |
| [dotnet][dotnet] | >=7.0.0 | <=7.0.16 | [7.0.17](https://www.nuget.org/packages/dotnet/7.0.17) | CVE-2024-21392 |            |
|           | >=7.0.0     | <=7.0.16    | [7.0.17](https://www.nuget.org/packages/dotnet/7.0.17) | CVE-2024-26190 |            |
|           | >=8.0.0     | <=8.0.2     | [8.0.3](https://www.nuget.org/packages/dotnet/8.0.3)   | CVE-2024-21392 |            |
|           | >=8.0.0     | <=8.0.2     | [8.0.3](https://www.nuget.org/packages/dotnet/8.0.3)   | CVE-2024-26190 |            |


## Packages

The following table lists version ranges for affected packages.

No packages with vulnerabilities reported.


## Commits

The following table lists commits for affected packages.

| Repo | Branch | Commit |
| ---- | ------ | ------ |



[CVE-2024-21392]: https://github.com/dotnet/announcements/issues/299
[CVE-2024-26190]: https://github.com/dotnet/announcements/issues/300
[dotnet]: https://www.nuget.org/packages/dotnet
