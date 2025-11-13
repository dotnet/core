# .NET CVEs for 2025-01-14

The following vulnerabilities have been patched.

| ID                               | Problem                                   | Severity | Platforms | CVSS                                         |
| -------------------------------- | ----------------------------------------- | -------- | --------- | -------------------------------------------- |
| [CVE-2025-21171][CVE-2025-21171] | .NET Remote Code Execution Vulnerability  | High     | All       | CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H |
| [CVE-2025-21172][CVE-2025-21172] | .NET and Visual Studio Remote Code Execution Vulnerability | High | All | CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:H |
| [CVE-2025-21173][CVE-2025-21173] | .NET Elevation of Privilege Vulnerability | High     | Linux     | CVSS:3.1/AV:L/AC:L/PR:L/UI:R/S:U/C:H/I:H/A:H/E:U/RL:O/RC:C |
| [CVE-2025-21176][CVE-2025-21176] | .NET and Visual Studio Remote Code Execution Vulnerability | High | All | CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H |


## Platform Components

The following table lists version ranges for affected platform components.

| Component | Min Version | Max Version | Fixed Version                                          | CVE            | Source fix          |
| --------- | ----------- | ----------- | ------------------------------------------------------ | -------------- | ------------------- |
| [dotnet][dotnet] | >=   | <=          | Unknown                                                | CVE-2025-21172 | [b3f8ef0][b3f8ef0]  |
|           | >=          | <=          | Unknown                                                | CVE-2025-21176 | [b3f8ef0][b3f8ef0]  |
|           | >=8.0.0     | <=8.0.11    | [8.0.12](https://www.nuget.org/packages/dotnet/8.0.12) | CVE-2025-21172 | [89ef51c][89ef51c]  |
|           | >=8.0.0     | <=8.0.11    | [8.0.12](https://www.nuget.org/packages/dotnet/8.0.12) | CVE-2025-21176 | [89ef51c][89ef51c]  |
|           | >=9.0.0     | <=9.0.0     | [9.0.1](https://www.nuget.org/packages/dotnet/9.0.1)   | CVE-2025-21171 | [9da8c6a][9da8c6a]  |
|           | >=9.0.0     | <=9.0.0     | [9.0.1](https://www.nuget.org/packages/dotnet/9.0.1)   | CVE-2025-21172 | [32d8ea6][32d8ea6]  |
|           | >=9.0.0     | <=9.0.0     | [9.0.1](https://www.nuget.org/packages/dotnet/9.0.1)   | CVE-2025-21176 | [32d8ea6][32d8ea6]  |
| [microsoft.netcore.sdk][microsoft.netcore.sdk] | >= | <= | Unknown                             | CVE-2025-21173 | [4416ac9][4416ac9]  |
|           | >=8.0.100   | <=8.0.111   | [8.0.112](https://www.nuget.org/packages/microsoft.netcore.sdk/8.0.112) | CVE-2025-21173 | [7034fd9][7034fd9]  |
|           | >=8.0.300   | <=8.0.307   | [8.0.308](https://www.nuget.org/packages/microsoft.netcore.sdk/8.0.308) | CVE-2025-21173 | [2a98e61][2a98e61]  |
|           | >=          | <=          | Unknown                                                | CVE-2025-21173 | [1ba6238][1ba6238]  |
|           | >=9.0.100   | <=9.0.101   | [9.0.102](https://www.nuget.org/packages/microsoft.netcore.sdk/9.0.102) | CVE-2025-21173 | [802c364][802c364]  |


## Packages

The following table lists version ranges for affected packages.

No packages with vulnerabilities reported.


## Commits

The following table lists commits for affected packages.

| Repo                     | Branch                     | Commit             |
| ------------------------ | -------------------------- | ------------------ |
| [dotnet/runtime][dotnet/runtime] | [release/6.0][release/6.0] | [b3f8ef0][b3f8ef0] |
| [dotnet/runtime][dotnet/runtime] | [release/8.0][release/8.0] | [89ef51c][89ef51c] |
| [dotnet/runtime][dotnet/runtime] | [release/9.0][release/9.0] | [32d8ea6][32d8ea6] |
| [dotnet/runtime][dotnet/runtime] | [release/9.0][release/9.0] | [9da8c6a][9da8c6a] |
| [dotnet/sdk][dotnet/sdk] | [release/6.0][release/6.0] | [4416ac9][4416ac9] |
| [dotnet/sdk][dotnet/sdk] | [release/8.0.1xx][release/8.0.1xx] | [7034fd9][7034fd9] |
| [dotnet/sdk][dotnet/sdk] | [release/8.0.3xx][release/8.0.3xx] | [2a98e61][2a98e61] |
| [dotnet/sdk][dotnet/sdk] | [release/8.0.4xx][release/8.0.4xx] | [1ba6238][1ba6238] |
| [dotnet/sdk][dotnet/sdk] | [release/9.0.1xx][release/9.0.1xx] | [802c364][802c364] |



[CVE-2025-21171]: https://github.com/dotnet/announcements/issues/340
[CVE-2025-21172]: https://github.com/dotnet/announcements/issues/339
[CVE-2025-21173]: https://github.com/dotnet/announcements/issues/337
[CVE-2025-21176]: https://github.com/dotnet/announcements/issues/338
[dotnet]: https://www.nuget.org/packages/dotnet
[microsoft.netcore.sdk]: https://www.nuget.org/packages/microsoft.netcore.sdk
[dotnet/runtime]: https://github.com/dotnet/runtime
[release/6.0]: https://github.com/dotnet/runtime/tree/release/6.0
[b3f8ef0]: https://github.com/dotnet/runtime/commit/b3f8ef0105c079c255caa6aa31d630482db5d03c
[release/8.0]: https://github.com/dotnet/runtime/tree/release/8.0
[89ef51c]: https://github.com/dotnet/runtime/commit/89ef51c5d8f5239345127a1e282e11036e590c8b
[release/9.0]: https://github.com/dotnet/runtime/tree/release/9.0
[32d8ea6]: https://github.com/dotnet/runtime/commit/32d8ea6eecf7f192a75162645390847b14b56dbb
[9da8c6a]: https://github.com/dotnet/runtime/commit/9da8c6a4a6ea03054e776275d3fd5c752897842e
[dotnet/sdk]: https://github.com/dotnet/sdk
[4416ac9]: https://github.com/dotnet/sdk/commit/4416ac92cd8588320132c4ce0d508d78a4a26d15
[release/8.0.1xx]: https://github.com/dotnet/sdk/tree/release/8.0.1xx
[7034fd9]: https://github.com/dotnet/sdk/commit/7034fd96502b925b5f65c31e34e99116870bc59f
[release/8.0.3xx]: https://github.com/dotnet/sdk/tree/release/8.0.3xx
[2a98e61]: https://github.com/dotnet/sdk/commit/2a98e615955be9b9d0752d090c3f92f70c7d0223
[release/8.0.4xx]: https://github.com/dotnet/sdk/tree/release/8.0.4xx
[1ba6238]: https://github.com/dotnet/sdk/commit/1ba623839f23fe8857d2aa0dc23783692325deab
[release/9.0.1xx]: https://github.com/dotnet/sdk/tree/release/9.0.1xx
[802c364]: https://github.com/dotnet/sdk/commit/802c364c05180a487624fc839870677625810b10
