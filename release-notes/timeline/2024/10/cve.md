# .NET CVEs for 2024-10-08

The following vulnerabilities have been patched.

| ID                               | Problem                                  | Severity | Platforms | CVSS                                                       |
| -------------------------------- | ---------------------------------------- | -------- | --------- | ---------------------------------------------------------- |
| [CVE-2024-38229][CVE-2024-38229] | .NET Remote Code Execution Vulnerability | Critical | All       | CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H/E:U/RL:O/RC:C |
| [CVE-2024-43483][CVE-2024-43483] | .NET Denial of Service Vulnerability     | Critical | All       | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:U/RL:O/RC:C |
| [CVE-2024-43484][CVE-2024-43484] | (DoS) System.IO.Packaging - Multiple DoS vectors in use of SortedList | Critical | All | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:U/RL:O/RC:C |
| [CVE-2024-43485][CVE-2024-43485] | (DoS) Denial of Service attack against System.Text.Json ExtensionData feature | Critical | All | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H/E:U/RL:O/RC:C |


## Platform Components

The following table lists version ranges for affected platform components.

| Component | Min Version | Max Version | Fixed Version                                            | CVE            | Source fix          |
| --------- | ----------- | ----------- | -------------------------------------------------------- | -------------- | ------------------- |
| [aspnetcore][aspnetcore] | >=8.0.0 | <=8.0.8 | [8.0.9](https://www.nuget.org/packages/aspnetcore/8.0.9) | CVE-2024-38229 | [1002b67][1002b67]  |
| [dotnet][dotnet] | >=6.0.0 | <=6.0.33 | [6.0.34](https://www.nuget.org/packages/dotnet/6.0.34)   | CVE-2024-43483 | [132fb31][132fb31]  |
|           | >=6.0.0     | <=6.0.33    | [6.0.34](https://www.nuget.org/packages/dotnet/6.0.34)   | CVE-2024-43485 | [c3c2cc2][c3c2cc2]  |
|           | >=8.0.0     | <=8.0.8     | [8.0.9](https://www.nuget.org/packages/dotnet/8.0.9)     | CVE-2024-43483 | [76f50f6][76f50f6]  |
|           | >=8.0.0     | <=8.0.8     | [8.0.9](https://www.nuget.org/packages/dotnet/8.0.9)     | CVE-2024-43485 | [be46d16][be46d16]  |


## Packages

The following table lists version ranges for affected packages.

| Package | Min Version | Max Version | Fixed Version                                                        | CVE            | Source fix          |
| ------- | ----------- | ----------- | -------------------------------------------------------------------- | -------------- | ------------------- |
| [System.IO.Packaging][System.IO.Packaging] | >=6.0.0 | <=6.0.0 | [6.0.1](https://www.nuget.org/packages/System.IO.Packaging/6.0.1) | CVE-2024-43483 | [741b045][741b045]  |
|         | >=6.0.0     | <=6.0.0     | [6.0.1](https://www.nuget.org/packages/System.IO.Packaging/6.0.1)    | CVE-2024-43484 | [40d60a1][40d60a1] [741b045][741b045]  |
|         | >=8.0.0     | <=8.0.0     | [8.0.1](https://www.nuget.org/packages/System.IO.Packaging/8.0.1)    | CVE-2024-43483 | [132fb31][132fb31]  |
|         | >=8.0.0     | <=8.0.0     | [8.0.1](https://www.nuget.org/packages/System.IO.Packaging/8.0.1)    | CVE-2024-43484 | [c2891d3][c2891d3] [132fb31][132fb31]  |
|         | >=9.0.0-preview.1.24080.9 | <=9.0.0-rc.1.24431.7 | [9.0.0-rc.2.24473.5](https://www.nuget.org/packages/System.IO.Packaging/9.0.0-rc.2.24473.5) | CVE-2024-43483 | [f5456c7][f5456c7]  |
| [System.Runtime.Caching][System.Runtime.Caching] | >=8.0.0 | <=8.0.0 | [8.0.1](https://www.nuget.org/packages/System.Runtime.Caching/8.0.1) | CVE-2024-43483 | [132fb31][132fb31]  |
| [System.Security.Cryptography.Cose][System.Security.Cryptography.Cose] | >=8.0.0-preview.1.23110.8 | <=8.0.0 | [8.0.1](https://www.nuget.org/packages/System.Security.Cryptography.Cose/8.0.1) | CVE-2024-43483 |  |
|         | >=9.0.0-preview.1.24080.9 | <= 9.0.0-rc.1.24431.7 | [9.0.0-rc.2.24473.5](https://www.nuget.org/packages/System.Security.Cryptography.Cose/9.0.0-rc.2.24473.5) | CVE-2024-43483 |  |
| [System.Text.Json][System.Text.Json] | >=6.0.0 | <=6.0.9 | [6.0.10](https://www.nuget.org/packages/System.Text.Json/6.0.10) | CVE-2024-43485 | [c3c2cc2][c3c2cc2]  |
|         | >=8.0.0     | <=8.0.4     | [8.0.5](https://www.nuget.org/packages/System.Text.Json/8.0.5)       | CVE-2024-43485 | [be46d16][be46d16]  |



## Commits

The following table lists commits for affected packages.

| Repo                                   | Branch                     | Commit             |
| -------------------------------------- | -------------------------- | ------------------ |
| [dotnet/aspnetcore][dotnet/aspnetcore] | [release/8.0][release/8.0] | [1002b67][1002b67] |
| [dotnet/runtime][dotnet/runtime]       | [release/6.0][release/6.0] | [40d60a1][40d60a1] |
| [dotnet/runtime][dotnet/runtime]       | [release/6.0][release/6.0] | [741b045][741b045] |
| [dotnet/runtime][dotnet/runtime]       | [release/6.0][release/6.0] | [c3c2cc2][c3c2cc2] |
| [dotnet/runtime][dotnet/runtime]       | [release/8.0][release/8.0] | [132fb31][132fb31] |
| [dotnet/runtime][dotnet/runtime]       | [release/8.0][release/8.0] | [be46d16][be46d16] |
| [dotnet/runtime][dotnet/runtime]       | [release/8.0][release/8.0] | [c2891d3][c2891d3] |
| [dotnet/runtime][dotnet/runtime]       | [release/9.0][release/9.0] | [f5456c7][f5456c7] |



[CVE-2024-38229]: https://github.com/dotnet/announcements/issues/326
[CVE-2024-43483]: https://github.com/dotnet/announcements/issues/327
[CVE-2024-43484]: https://github.com/dotnet/announcements/issues/328
[CVE-2024-43485]: https://github.com/dotnet/announcements/issues/329
[aspnetcore]: https://www.nuget.org/packages/aspnetcore
[dotnet]: https://www.nuget.org/packages/dotnet
[System.IO.Packaging]: https://www.nuget.org/packages/System.IO.Packaging
[System.Runtime.Caching]: https://www.nuget.org/packages/System.Runtime.Caching
[System.Security.Cryptography.Cose]: https://www.nuget.org/packages/System.Security.Cryptography.Cose
[System.Text.Json]: https://www.nuget.org/packages/System.Text.Json
[dotnet/aspnetcore]: https://github.com/dotnet/aspnetcore
[release/8.0]: https://github.com/dotnet/aspnetcore/tree/release/8.0
[1002b67]: https://github.com/dotnet/aspnetcore/commit/1002b673be5803ba63173ef8a2fdebe3e388a34a
[dotnet/runtime]: https://github.com/dotnet/runtime
[release/6.0]: https://github.com/dotnet/runtime/tree/release/6.0
[40d60a1]: https://github.com/dotnet/runtime/commit/40d60a122dfd637e1b8a7cccbbbc363d508fb0d7
[741b045]: https://github.com/dotnet/runtime/commit/741b04589cdd3514d032cbfd041fb7178bbd15c9
[c3c2cc2]: https://github.com/dotnet/runtime/commit/c3c2cc2e61411fc1c56ca962684348ccf5563ce4
[132fb31]: https://github.com/dotnet/runtime/commit/132fb31922b8c4d5fb11ac6294042d7bb1a4b1d8
[be46d16]: https://github.com/dotnet/runtime/commit/be46d16f6ff2daa6632136f7f100c5de89de6809
[c2891d3]: https://github.com/dotnet/runtime/commit/c2891d32a0408ce62771120dd7c03bc3dde1fca7
[release/9.0]: https://github.com/dotnet/runtime/tree/release/9.0
[f5456c7]: https://github.com/dotnet/runtime/commit/f5456c7804dfd2153cd5cda4054bcde50b153a66
