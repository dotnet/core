# .NET CVEs for 2025-06-10

The following vulnerabilities have been patched.

| ID                               | Problem                                           | Severity | Platforms | CVSS                                                       |
| -------------------------------- | ------------------------------------------------- | -------- | --------- | ---------------------------------------------------------- |
| [CVE-2025-30399][CVE-2025-30399] | DLL Hijacking Remote Code Execution Vulnerability | High     | All       | CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:H/E:U/RL:O/RC:C |


## Platform Components

The following table lists version ranges for affected platform components.

| Component | Min Version | Max Version | Fixed Version                                                           | CVE            | Source fix          |
| --------- | ----------- | ----------- | ----------------------------------------------------------------------- | -------------- | ------------------- |
| [microsoft.netcore.sdk][microsoft.netcore.sdk] | >=8.0.100 | <=8.0.116 | [8.0.117](https://www.nuget.org/packages/microsoft.netcore.sdk/8.0.117) | CVE-2025-30399 | [d00609e][d00609e]  |
|           | >=8.0.300   | <=8.0.312   | [8.0.313](https://www.nuget.org/packages/microsoft.netcore.sdk/8.0.313) | CVE-2025-30399 |                     |
|           | >=8.0.400   | <=8.0.409   | [8.0.410](https://www.nuget.org/packages/microsoft.netcore.sdk/8.0.410) | CVE-2025-30399 | [7892f91][7892f91]  |


## Packages

The following table lists version ranges for affected packages.

No packages with vulnerabilities reported.


## Commits

The following table lists commits for affected packages.

| Repo                             | Branch                     | Commit             |
| -------------------------------- | -------------------------- | ------------------ |
| [dotnet/runtime][dotnet/runtime] | [release/8.0][release/8.0] | [b33d4e3][b33d4e3] |
| [dotnet/runtime][dotnet/runtime] | [release/9.0][release/9.0] | [214743e][214743e] |



[CVE-2025-30399]: https://github.com/dotnet/announcements/issues/362
[microsoft.netcore.sdk]: https://www.nuget.org/packages/microsoft.netcore.sdk
[dotnet/runtime]: https://github.com/dotnet/runtime
[release/8.0]: https://github.com/dotnet/runtime/tree/release/8.0
[b33d4e3]: https://github.com/dotnet/runtime/commit/b33d4e34e1cbf993583d78fc1b64ea8400935978
[release/9.0]: https://github.com/dotnet/runtime/tree/release/9.0
[214743e]: https://github.com/dotnet/runtime/commit/214743ee2a5a25b9a3a07e3f0451da73eb4e97e2
