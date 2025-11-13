# .NET CVEs for 2024-08-13

The following vulnerabilities have been patched.

| ID                               | Problem                                   | Severity | Platforms | CVSS                                                       |
| -------------------------------- | ----------------------------------------- | -------- | --------- | ---------------------------------------------------------- |
| [CVE-2024-38167][CVE-2024-38167] | .NET Information Disclosure Vulnerability | Critical | All       | CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N/E:U/RL:O/RC:C |
| [CVE-2024-38168][CVE-2024-38168] | .NET Denial of Service Vulnerability      | Critical | Windows   | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:U/RL:O/RC:C |


## Platform Components

The following table lists version ranges for affected platform components.

| Component        | Min Version | Max Version | Fixed Version                                            | CVE            | Source fix          |
| ---------------- | ----------- | ----------- | -------------------------------------------------------- | -------------- | ------------------- |
| [aspnetcore][aspnetcore] | >=8.0.0 | <=8.0.7 | [8.0.8](https://www.nuget.org/packages/aspnetcore/8.0.8) | CVE-2024-38168 | [123e69c][123e69c]  |
| [dotnet][dotnet] | >=8.0.0     | <=8.0.7     | [8.0.8](https://www.nuget.org/packages/dotnet/8.0.8)     | CVE-2024-38167 | [76f50f6][76f50f6]  |


## Packages

The following table lists version ranges for affected packages.

No packages with vulnerabilities reported.


## Commits

The following table lists commits for affected packages.

| Repo                                   | Branch                     | Commit             |
| -------------------------------------- | -------------------------- | ------------------ |
| [dotnet/aspnetcore][dotnet/aspnetcore] | [release/8.0][release/8.0] | [123e69c][123e69c] |
| [dotnet/runtime][dotnet/runtime]       | [release/8.0][release/8.0] | [76f50f6][76f50f6] |



[CVE-2024-38167]: https://github.com/dotnet/announcements/issues/319
[CVE-2024-38168]: https://github.com/dotnet/announcements/issues/320
[aspnetcore]: https://www.nuget.org/packages/aspnetcore
[dotnet]: https://www.nuget.org/packages/dotnet
[dotnet/aspnetcore]: https://github.com/dotnet/aspnetcore
[release/8.0]: https://github.com/dotnet/aspnetcore/tree/release/8.0
[123e69c]: https://github.com/dotnet/aspnetcore/commit/123e69ce581cb33fd86c7cd2f8d4ba95e667885c
[dotnet/runtime]: https://github.com/dotnet/runtime
[76f50f6]: https://github.com/dotnet/runtime/commit/76f50f60931e85e9240715ebd1f345547cbae366
