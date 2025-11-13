# .NET CVEs for 2024-11-12

The following vulnerabilities have been patched.

| ID                               | Problem                                  | Severity | Platforms | CVSS                                                       |
| -------------------------------- | ---------------------------------------- | -------- | --------- | ---------------------------------------------------------- |
| [CVE-2024-43498][CVE-2024-43498] | .NET Remote Code Execution Vulnerability | Critical | All       | CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H/E:U/RL:O/RC:C |
| [CVE-2024-43499][CVE-2024-43499] | .NET Core - DoS - (unbounded work factor) in NrbfDecoder component | High | All | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:U/RL:O/RC:C |


## Platform Components

The following table lists version ranges for affected platform components.

| Component | Min Version               | Max Version          | Fixed Version                                        | CVE            | Source fix          |
| --------- | ------------------------- | -------------------- | ---------------------------------------------------- | -------------- | ------------------- |
| [dotnet][dotnet] | >=0.0-preview.6.24327.7 | <=9.0.0-rc.2.24473.5 | [9.0.0](https://www.nuget.org/packages/dotnet/9.0.0) | CVE-2024-43498 | [d16f41a][d16f41a]  |
|           | >=9.0.0-preview.6.24327.7 | <=9.0.0-rc.2.24473.5 | [9.0.0](https://www.nuget.org/packages/dotnet/9.0.0) | CVE-2024-43499 | [d16f41a][d16f41a]  |


## Packages

The following table lists version ranges for affected packages.

| Package | Min Version               | Max Version          | Fixed Version                                                     | CVE            | Source fix          |
| ------- | ------------------------- | -------------------- | ----------------------------------------------------------------- | -------------- | ------------------- |
| [System.Formats.Nrbf][System.Formats.Nrbf] | >=9.0.0-preview.6.24327.7 | <=9.0.0-rc.2.24473.5 | [9.0.0](https://www.nuget.org/packages/System.Formats.Nrbf/9.0.0) | CVE-2024-43498 | [d16f41a][d16f41a]  |
|         | >=9.0.0-preview.6.24327.7 | <=9.0.0-rc.2.24473.5 | [9.0.0](https://www.nuget.org/packages/System.Formats.Nrbf/9.0.0) | CVE-2024-43499 | [d16f41a][d16f41a]  |



## Commits

The following table lists commits for affected packages.

| Repo                             | Branch                     | Commit             |
| -------------------------------- | -------------------------- | ------------------ |
| [dotnet/runtime][dotnet/runtime] | [release/9.0][release/9.0] | [d16f41a][d16f41a] |



[CVE-2024-43498]: https://github.com/dotnet/announcements/issues/334
[CVE-2024-43499]: https://github.com/dotnet/announcements/issues/333
[dotnet]: https://www.nuget.org/packages/dotnet
[System.Formats.Nrbf]: https://www.nuget.org/packages/System.Formats.Nrbf
[dotnet/runtime]: https://github.com/dotnet/runtime
[release/9.0]: https://github.com/dotnet/runtime/tree/release/9.0
[d16f41a]: https://github.com/dotnet/runtime/commit/d16f41ad8fded18bf82bca88df27967cc3365eb0
