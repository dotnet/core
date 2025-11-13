# .NET CVEs for 2024-07-09

The following vulnerabilities have been patched.

| ID                               | Problem                                  | Severity | Platforms | CVSS                                                       |
| -------------------------------- | ---------------------------------------- | -------- | --------- | ---------------------------------------------------------- |
| [CVE-2024-30105][CVE-2024-30105] | .NET Denial of Service Vulnerability     | Critical | All       | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:U/RL:O/RC:C |
| [CVE-2024-35264][CVE-2024-35264] | .NET Remote Code Execution Vulnerability | Critical | All       | CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H/E:U/RL:O/RC:C |
| [CVE-2024-38081][CVE-2024-38081] | .NET Denial of Service Vulnerability     | Critical | Windows   | CVSS:3.1/AV:L/AC:L/PR:L/UI:R/S:U/C:H/I:H/A:H/E:U/RL:O/RC:C |
| [CVE-2024-38095][CVE-2024-38095] | .NET Denial of Service Vulnerability     | Critical | All       | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L/E:U/RL:O/RC:C |


## Platform Components

The following table lists version ranges for affected platform components.

| Component | Min Version | Max Version | Fixed Version                                            | CVE            | Source fix          |
| --------- | ----------- | ----------- | -------------------------------------------------------- | -------------- | ------------------- |
| [aspnetcore][aspnetcore] | >=8.0.0 | <=8.0.6 | [8.0.7](https://www.nuget.org/packages/aspnetcore/8.0.7) | CVE-2024-35264 | [c5721fb][c5721fb]  |
| [dotnet][dotnet] | >=6.0.0 | <=6.0.31 | [6.0.32](https://www.nuget.org/packages/dotnet/6.0.32)   | CVE-2024-38081 | [0a0dd0e][0a0dd0e]  |
|           | >=6.0.0     | <=6.0.31    | [6.0.32](https://www.nuget.org/packages/dotnet/6.0.32)   | CVE-2024-38095 | [979135d][979135d]  |
|           | >=8.0.0     | <=8.0.6     | [8.0.7](https://www.nuget.org/packages/dotnet/8.0.7)     | CVE-2024-30105 | [fa5b0d8][fa5b0d8]  |
|           | >=8.0.0     | <=8.0.6     | [8.0.7](https://www.nuget.org/packages/dotnet/8.0.7)     | CVE-2024-38095 | [4a8d5a0][4a8d5a0]  |


## Packages

The following table lists version ranges for affected packages.

| Package                                    | Min Version                | Max Version | Fixed Version                                                     | CVE            | Source fix          |
| ------------------------------------------ | -------------------------- | ----------- | ----------------------------------------------------------------- | -------------- | ------------------- |
| [Microsoft.IO.Redist][Microsoft.IO.Redist] | >=4.6.0-preview.18571.3    | <=6.0.0     | [6.0.1](https://www.nuget.org/packages/Microsoft.IO.Redist/6.0.1) | CVE-2024-38081 | [0a0dd0e][0a0dd0e]  |
| [System.Formats.Asn1][System.Formats.Asn1] | >=5.0.0-preview.7.20364.11 | <=6.0.0     | [6.0.1](https://www.nuget.org/packages/System.Formats.Asn1/6.0.1) | CVE-2024-38095 | [979135d][979135d]  |
|                                            | >=7.0.0-preview.1.22076.8  | <=8.0.0     | [8.0.1](https://www.nuget.org/packages/System.Formats.Asn1/8.0.1) | CVE-2024-38095 | [4a8d5a0][4a8d5a0]  |
| [System.Text.Json][System.Text.Json]       | >=8.0.0                    | <=8.0.3     | [8.0.4](https://www.nuget.org/packages/System.Text.Json/8.0.4)    | CVE-2024-30105 | [fa5b0d8][fa5b0d8]  |



## Commits

The following table lists commits for affected packages.

| Repo                                   | Branch                     | Commit             |
| -------------------------------------- | -------------------------- | ------------------ |
| [dotnet/aspnetcore][dotnet/aspnetcore] | [release/8.0][release/8.0] | [c5721fb][c5721fb] |
| [dotnet/runtime][dotnet/runtime]       | [release/6.0][release/6.0] | [0a0dd0e][0a0dd0e] |
| [dotnet/runtime][dotnet/runtime]       | [release/6.0][release/6.0] | [979135d][979135d] |
| [dotnet/runtime][dotnet/runtime]       | [release/8.0][release/8.0] | [4a8d5a0][4a8d5a0] |
| [dotnet/runtime][dotnet/runtime]       | [release/8.0][release/8.0] | [fa5b0d8][fa5b0d8] |



[CVE-2024-30105]: https://github.com/dotnet/announcements/issues/315
[CVE-2024-35264]: https://github.com/dotnet/announcements/issues/314
[CVE-2024-38081]: https://github.com/dotnet/announcements/issues/313
[CVE-2024-38095]: https://github.com/dotnet/announcements/issues/312
[aspnetcore]: https://www.nuget.org/packages/aspnetcore
[dotnet]: https://www.nuget.org/packages/dotnet
[Microsoft.IO.Redist]: https://www.nuget.org/packages/Microsoft.IO.Redist
[System.Formats.Asn1]: https://www.nuget.org/packages/System.Formats.Asn1
[System.Text.Json]: https://www.nuget.org/packages/System.Text.Json
[dotnet/aspnetcore]: https://github.com/dotnet/aspnetcore
[release/8.0]: https://github.com/dotnet/aspnetcore/tree/release/8.0
[c5721fb]: https://github.com/dotnet/aspnetcore/commit/c5721fb7a65ddc13d1b445c2c08c27b72ab57cdc
[dotnet/runtime]: https://github.com/dotnet/runtime
[release/6.0]: https://github.com/dotnet/runtime/tree/release/6.0
[0a0dd0e]: https://github.com/dotnet/runtime/commit/0a0dd0e27560e692e11ee286ed9f45471b2131fa
[979135d]: https://github.com/dotnet/runtime/commit/979135d5ca4efaf6436ee13539cc3f1e039d570a
[4a8d5a0]: https://github.com/dotnet/runtime/commit/4a8d5a007971d19f389ca17f7b8eb4f9bb199991
[fa5b0d8]: https://github.com/dotnet/runtime/commit/fa5b0d8f4a8b424732cc992158aa92842f8a2846
