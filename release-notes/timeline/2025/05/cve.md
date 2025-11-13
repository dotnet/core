# .NET CVEs for 2025-05-13

The following vulnerabilities have been patched.

| ID                               | Problem                                       | Severity | Platforms | CVSS                                                       |
| -------------------------------- | --------------------------------------------- | -------- | --------- | ---------------------------------------------------------- |
| [CVE-2025-26646][CVE-2025-26646] | .NET and Visual Studio Spoofing Vulnerability | High     | All       | CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:U/C:H/I:H/A:H/E:U/RL:O/RC:C |


## Platform Components

The following table lists version ranges for affected platform components.

| Component | Min Version | Max Version | Fixed Version                                                           | CVE            | Source fix          |
| --------- | ----------- | ----------- | ----------------------------------------------------------------------- | -------------- | ------------------- |
| [microsoft.netcore.sdk][microsoft.netcore.sdk] | >=8.0.100 | <=8.0.115 | [8.0.116](https://www.nuget.org/packages/microsoft.netcore.sdk/8.0.116) | CVE-2025-26646 | [d00609e][d00609e]  |
|           | >=8.0.300   | <=8.0.312   | [8.0.313](https://www.nuget.org/packages/microsoft.netcore.sdk/8.0.313) | CVE-2025-26646 |                     |
|           | >=8.0.400   | <=8.0.408   | [8.0.409](https://www.nuget.org/packages/microsoft.netcore.sdk/8.0.409) | CVE-2025-26646 | [7892f91][7892f91]  |
|           | >=9.0.100   | <=9.0.105   | [9.0.106](https://www.nuget.org/packages/microsoft.netcore.sdk/9.0.106) | CVE-2025-26646 | [ad312fc][ad312fc]  |
|           | >=9.0.200   | <=9.0.203   | [9.0.204](https://www.nuget.org/packages/microsoft.netcore.sdk/9.0.204) | CVE-2025-26646 | [070f5a4][070f5a4]  |


## Packages

The following table lists version ranges for affected packages.

| Package | Min Version | Max Version | Fixed Version                                                                  | CVE            | Source fix |
| ------- | ----------- | ----------- | ------------------------------------------------------------------------------ | -------------- | ---------- |
| [Microsoft.Build.Tasks.Core][Microsoft.Build.Tasks.Core] | >=15.8.166 | <=15.9.20 | [15.9.30](https://www.nuget.org/packages/Microsoft.Build.Tasks.Core/15.9.30) | CVE-2025-26646 |  |
|         | >=16.0.461  | <=16.11.0   | [16.11.6](https://www.nuget.org/packages/Microsoft.Build.Tasks.Core/16.11.6)   | CVE-2025-26646 |            |
|         | >=17.0.0    | <=17.8.3    | [17.8.29](https://www.nuget.org/packages/Microsoft.Build.Tasks.Core/17.8.29)   | CVE-2025-26646 |            |
|         | >=17.9.5    | <=17.10.4   | [17.10.29](https://www.nuget.org/packages/Microsoft.Build.Tasks.Core/17.10.29) | CVE-2025-26646 |            |
|         | >=17.11.4   | <=17.11.4   | [17.13.26](https://www.nuget.org/packages/Microsoft.Build.Tasks.Core/17.13.26) | CVE-2025-26646 |            |
|         | >=17.12.6   | <=17.12.6   | [17.13.26](https://www.nuget.org/packages/Microsoft.Build.Tasks.Core/17.13.26) | CVE-2025-26646 |            |
|         | >=17.13.9   | <=17.13.9   | [17.14.8](https://www.nuget.org/packages/Microsoft.Build.Tasks.Core/17.14.8)   | CVE-2025-26646 |            |



## Commits

The following table lists commits for affected packages.

| Repo                     | Branch                             | Commit             |
| ------------------------ | ---------------------------------- | ------------------ |
| [dotnet/sdk][dotnet/sdk] | [release/8.0.1xx][release/8.0.1xx] | [d00609e][d00609e] |
| [dotnet/sdk][dotnet/sdk] | [release/8.0.4xx][release/8.0.4xx] | [7892f91][7892f91] |
| [dotnet/sdk][dotnet/sdk] | [release/9.0.1xx][release/9.0.1xx] | [ad312fc][ad312fc] |
| [dotnet/sdk][dotnet/sdk] | [release/9.0.2xx][release/9.0.2xx] | [070f5a4][070f5a4] |
| [dotnet/sdk][dotnet/sdk] | [release/9.0.3xx][release/9.0.3xx] | [391e16c][391e16c] |



[CVE-2025-26646]: https://github.com/dotnet/announcements/issues/356
[microsoft.netcore.sdk]: https://www.nuget.org/packages/microsoft.netcore.sdk
[Microsoft.Build.Tasks.Core]: https://www.nuget.org/packages/Microsoft.Build.Tasks.Core
[dotnet/sdk]: https://github.com/dotnet/sdk
[release/8.0.1xx]: https://github.com/dotnet/sdk/tree/release/8.0.1xx
[d00609e]: https://github.com/dotnet/sdk/commit/d00609e7978ee1b0fe62b39a378611311cf85603
[release/8.0.4xx]: https://github.com/dotnet/sdk/tree/release/8.0.4xx
[7892f91]: https://github.com/dotnet/sdk/commit/7892f91f7191adb473a9e97a79e1c4ca8a2c9247
[release/9.0.1xx]: https://github.com/dotnet/sdk/tree/release/9.0.1xx
[ad312fc]: https://github.com/dotnet/sdk/commit/ad312fc3980fd8c562fac172bc17318c447eeb75
[release/9.0.2xx]: https://github.com/dotnet/sdk/tree/release/9.0.2xx
[070f5a4]: https://github.com/dotnet/sdk/commit/070f5a4d7592b7c7a7f2a65e232efdfbfaf2a753
[release/9.0.3xx]: https://github.com/dotnet/sdk/tree/release/9.0.3xx
[391e16c]: https://github.com/dotnet/sdk/commit/391e16c3b5c49938029e20d9ee69c4d5bdf51c70
