# .NET CVEs for 2025-10-14

The following vulnerabilities were disclosed this month.

| CVE                              | Description                                                                                                                                                                 | Platforms     | CVSS                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------- |
| [CVE-2025-55248][CVE-2025-55248] | A MITM (man in the middle) attacker may prevent use of TLS between client and SMTP server, forcing client to send data over unencrypted connection.                         | All Platforms | CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:U/C:H/I:N/A:N/E:U/RL:O/RC:C |
| [CVE-2025-55315][CVE-2025-55315] | Inconsistent interpretation of http requests ('http request/response smuggling') in ASP.NET Core allows an authorized attacker to bypass a security feature over a network. | All Platforms | CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:L/E:U/RL:O/RC:C |
| [CVE-2025-55247][CVE-2025-55247] | A vulnerability exists in .NET where predictable paths for MSBuild's temporary directories on Linux let another user create the directories ahead of MSBuild, leading to DoS of builds. This only affects .NET on Linux operating systems. | Linux | CVSS:3.1/AV:L/AC:L/PR:L/UI:R/S:U/C:H/I:H/A:H/E:U/RL:O/RC:C |

## Vulnerable and patched products

The following table lists vulnerable and patched version ranges for affected products.

| CVE                              | Product  | Min Version | Max Version | Fixed Version |
| -------------------------------- | -------- | ----------- | ----------- | ------------- |
| [CVE-2025-55248][CVE-2025-55248] | .NET Runtime Libraries | >=9.0.0 | <=9.0.9 | 9.0.10  |
| [CVE-2025-55248][CVE-2025-55248] | .NET Runtime Libraries | >=8.0.0 | <=8.0.20 | 8.0.21 |
| [CVE-2025-55315][CVE-2025-55315] | ASP.NET Core Runtime | >=9.0.0 | <=9.0.9 | 9.0.10    |
| [CVE-2025-55315][CVE-2025-55315] | ASP.NET Core Runtime | >=8.0.0 | <=8.0.20 | 8.0.21   |
| [CVE-2025-55247][CVE-2025-55247] | .NET SDK | >=8.0.100   | <=8.0.120   | 8.0.121       |
| [CVE-2025-55247][CVE-2025-55247] | .NET SDK | >=8.0.300   | <=8.0.317   | 8.0.318       |
| [CVE-2025-55247][CVE-2025-55247] | .NET SDK | >=8.0.400   | <=8.0.414   | 8.0.415       |
| [CVE-2025-55247][CVE-2025-55247] | .NET SDK | >=9.0.100   | <=9.0.110   | 9.0.111       |
| [CVE-2025-55247][CVE-2025-55247] | .NET SDK | >=9.0.300   | <=9.0.305   | 9.0.306       |

## Vulnerable and patched packages

The following table lists vulnerable and patched version ranges for affected packages.

| CVE                              | Package                                                          | Min Version | Max Version | Fixed Version |
| -------------------------------- | ---------------------------------------------------------------- | ----------- | ----------- | ------------- |
| [CVE-2025-55315][CVE-2025-55315] | [Microsoft.AspNetCore.Server.Kestrel.Core][Microsoft.AspNetCore.Server.Kestrel.Core] | >=2.0.0 | <=2.3.0 | 2.3.6 |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build.Tasks.Core][Microsoft.Build.Tasks.Core]         | >=17.8.0    | <=17.8.29   | 17.8.43       |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build.Tasks.Core][Microsoft.Build.Tasks.Core]         | >=17.10.0   | <=17.10.29  | 17.10.46      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build.Tasks.Core][Microsoft.Build.Tasks.Core]         | >=17.11.0   | <=17.11.31  | 17.11.48      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build.Tasks.Core][Microsoft.Build.Tasks.Core]         | >=17.12.0   | <=17.12.36  | 17.12.50      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build.Tasks.Core][Microsoft.Build.Tasks.Core]         | >=17.14.0   | <=17.14.8   | 17.14.28      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build][Microsoft.Build]                               | >=17.8.0    | <=17.8.29   | 17.8.43       |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build][Microsoft.Build]                               | >=17.10.0   | <=17.10.29  | 17.10.46      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build][Microsoft.Build]                               | >=17.11.0   | <=17.11.31  | 17.11.48      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build][Microsoft.Build]                               | >=17.12.0   | <=17.12.36  | 17.12.50      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build][Microsoft.Build]                               | >=17.14.0   | <=17.14.8   | 17.14.28      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build.Utilities.Core][Microsoft.Build.Utilities.Core] | >=17.8.0    | <=17.8.29   | 17.8.43       |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build.Utilities.Core][Microsoft.Build.Utilities.Core] | >=17.10.0   | <=17.10.29  | 17.10.46      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build.Utilities.Core][Microsoft.Build.Utilities.Core] | >=17.11.0   | <=17.11.31  | 17.11.48      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build.Utilities.Core][Microsoft.Build.Utilities.Core] | >=17.12.0   | <=17.12.36  | 17.12.50      |
| [CVE-2025-55247][CVE-2025-55247] | [Microsoft.Build.Utilities.Core][Microsoft.Build.Utilities.Core] | >=17.14.0   | <=17.14.8   | 17.14.28      |

## Commits

The following table lists commits for affected packages.

| CVE                              | Branch                                                                                              | Commit                                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [CVE-2025-55248][CVE-2025-55248] | [release/9.0](https://github.com/dotnet/runtime/commit/18e28d767acf44208afa6c4e2e67a10c65e9647e)    | [18e28d7](https://github.com/dotnet/runtime/commit/18e28d767acf44208afa6c4e2e67a10c65e9647e.diff)    |
| [CVE-2025-55248][CVE-2025-55248] | [release/8.0](https://github.com/dotnet/runtime/commit/44527b9ed8427463578126a4494c3654dda11866)    | [44527b9](https://github.com/dotnet/runtime/commit/44527b9ed8427463578126a4494c3654dda11866.diff)    |
| [CVE-2025-55315][CVE-2025-55315] | [release/9.0](https://github.com/dotnet/aspnetcore/commit/97a86434195a82fc7e302a4c57d5ec7f885c1ad5) | [97a8643](https://github.com/dotnet/aspnetcore/commit/97a86434195a82fc7e302a4c57d5ec7f885c1ad5.diff) |
| [CVE-2025-55315][CVE-2025-55315] | [release/8.0](https://github.com/dotnet/aspnetcore/commit/61794b7f3aac0b6719f783db5b5c725fefc8b695) | [61794b7](https://github.com/dotnet/aspnetcore/commit/61794b7f3aac0b6719f783db5b5c725fefc8b695.diff) |
| [CVE-2025-55247][CVE-2025-55247] | [vs17.8](https://github.com/dotnet/msbuild/commit/f0cbb13971c30ad15a3f252a8d0171898a01ec11)         | [f0cbb13](https://github.com/dotnet/msbuild/commit/f0cbb13971c30ad15a3f252a8d0171898a01ec11.diff)    |
| [CVE-2025-55247][CVE-2025-55247] | [vs17.10](https://github.com/dotnet/msbuild/commit/aa888d3214e5adb503c48c3bad2bfc6c5aff638a)        | [aa888d3](https://github.com/dotnet/msbuild/commit/aa888d3214e5adb503c48c3bad2bfc6c5aff638a.diff)    |
| [CVE-2025-55247][CVE-2025-55247] | [vs17.11](https://github.com/dotnet/msbuild/commit/02bf66295b64ab368d12933041f7281aad186a2d)        | [02bf662](https://github.com/dotnet/msbuild/commit/02bf66295b64ab368d12933041f7281aad186a2d.diff)    |
| [CVE-2025-55247][CVE-2025-55247] | [vs17.12](https://github.com/dotnet/msbuild/commit/728984d96edf07d56918a88b0f37fec6b1dfbbc9)        | [728984d](https://github.com/dotnet/msbuild/commit/728984d96edf07d56918a88b0f37fec6b1dfbbc9.diff)    |
| [CVE-2025-55247][CVE-2025-55247] | [vs17.14](https://github.com/dotnet/msbuild/commit/09c1be8483dad070189c3a0c660e7acacf478402)        | [09c1be8](https://github.com/dotnet/msbuild/commit/09c1be8483dad070189c3a0c660e7acacf478402.diff)    |

[CVE-2025-55248]: https://www.cve.org/CVERecord?id=CVE-2025-55248
[CVE-2025-55315]: https://www.cve.org/CVERecord?id=CVE-2025-55315
[CVE-2025-55247]: https://www.cve.org/CVERecord?id=CVE-2025-55247
[Microsoft.AspNetCore.Server.Kestrel.Core]: https://www.nuget.org/packages/Microsoft.AspNetCore.Server.Kestrel.Core
[Microsoft.Build.Tasks.Core]: https://www.nuget.org/packages/Microsoft.Build.Tasks.Core
[Microsoft.Build]: https://www.nuget.org/packages/Microsoft.Build
[Microsoft.Build.Utilities.Core]: https://www.nuget.org/packages/Microsoft.Build.Utilities.Core
