# .NET Releases

The .NET team releases new major versions of .NET annually, each November. Releases are either Long Term Support (LTS) or Standard Term Support (STS), and transition from full support through to end-of-life on a defined schedule, per [.NET release policies][policies]. .NET releases are [supported by Microsoft](microsoft-support.md) on [multiple operating systems](os-lifecycle-policy.md) and hardware architectures.

All .NET versions can be downloaded from the [.NET Website](https://dotnet.microsoft.com/download/dotnet), [Linux Package Managers](https://learn.microsoft.com/dotnet/core/install/linux), and the [Microsoft Artifact Registry](https://mcr.microsoft.com/catalog?search=dotnet/).

## Supported releases

The following table lists supported releases.

| Version                | Release Date                                                                     | Release type | Support phase | Latest Patch Version | End of Support    |
| ---------------------- | -------------------------------------------------------------------------------- | ------------ | ------------- | -------------------- | ----------------- |
| [.NET 10.0][.NET 10.0] | [November 10, 2025](https://devblogs.microsoft.com/dotnet/announcing-dotnet-10/) | [LTS][LTS]   | Active        | [10.0.0][10.0.0]     | November 14, 2028 |
| [.NET 9.0][.NET 9.0]   | [November 11, 2024](https://devblogs.microsoft.com/dotnet/announcing-dotnet-9/)  | [STS][STS]   | Active        | [9.0.11][9.0.11]     | November 10, 2026 |
| [.NET 8.0][.NET 8.0]   | [November 13, 2023](https://devblogs.microsoft.com/dotnet/announcing-dotnet-8/)  | [LTS][LTS]   | Active        | [8.0.22][8.0.22]     | November 10, 2026 |

[.NET 10.0]: release-notes/10.0/README.md
[LTS]: policies
[10.0.0]: release-notes/10.0/10.0.0/10.0.0.md
[.NET 9.0]: release-notes/9.0/README.md
[9.0.11]: release-notes/9.0/9.0.11/9.0.11.md
[.NET 8.0]: release-notes/8.0/README.md
[8.0.22]: release-notes/8.0/8.0.22/8.0.22.md

## End-of-life releases

The following table lists end-of-life releases.

| Version                        | Release Date                                                                         | Support    | Final Patch Version | End of Support                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------ | ---------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [.NET 7.0][.NET 7.0]           | [November 7, 2022](https://devblogs.microsoft.com/dotnet/announcing-dotnet-7/)       | [STS][STS] | [7.0.20][7.0.20]    | [May 14, 2024](https://devblogs.microsoft.com/dotnet/dotnet-7-end-of-support/)                                         |
| [.NET 6.0][.NET 6.0]           | [November 7, 2021](https://devblogs.microsoft.com/dotnet/announcing-net-6/)          | [LTS][LTS] | [6.0.36][6.0.36]    | [November 12, 2024](https://devblogs.microsoft.com/dotnet/dotnet-6-end-of-support/)                                    |
| [.NET 5.0][.NET 5.0]           | [November 9, 2020](https://devblogs.microsoft.com/dotnet/announcing-net-5-0/)        | [STS][STS] | [5.0.17][5.0.17]    | [May 10, 2022](https://devblogs.microsoft.com/dotnet/dotnet-5-end-of-support-update/)                                  |
| [.NET Core 3.1][.NET Core 3.1] | [December 2, 2019](https://devblogs.microsoft.com/dotnet/announcing-net-core-3-1/)   | [LTS][LTS] | [3.1.32][3.1.32]    | [December 13, 2022](https://devblogs.microsoft.com/dotnet/net-core-3-1-will-reach-end-of-support-on-december-13-2022/) |
| [.NET Core 3.0][.NET Core 3.0] | [September 22, 2019](https://devblogs.microsoft.com/dotnet/announcing-net-core-3-0/) | [STS][STS] | [3.0.3][3.0.3]      | [March 3, 2020](https://devblogs.microsoft.com/dotnet/net-core-3-0-end-of-life/)                                       |
| [.NET Core 2.2][.NET Core 2.2] | [December 3, 2018](https://devblogs.microsoft.com/dotnet/announcing-net-core-2-2/)   | [STS][STS] | [2.2.8][2.2.8]      | [December 23, 2019](https://devblogs.microsoft.com/dotnet/net-core-2-2-will-reach-end-of-life-on-december-23-2019/)    |
| [.NET Core 2.1][.NET Core 2.1] | [May 29, 2018](https://devblogs.microsoft.com/dotnet/announcing-net-core-2-1/)       | [LTS][LTS] | [2.1.30][2.1.30]    | [August 21, 2021](https://devblogs.microsoft.com/dotnet/net-core-2-1-will-reach-end-of-support-on-august-21-2021/)     |
| [.NET Core 2.0][.NET Core 2.0] | [August 13, 2017](https://devblogs.microsoft.com/dotnet/announcing-net-core-2-0/)    | [STS][STS] | [2.0.9][2.0.9]      | [October 1, 2018](https://devblogs.microsoft.com/dotnet/net-core-2-0-will-reach-end-of-life-on-september-1-2018/)      |
| [.NET Core 1.1][.NET Core 1.1] | [November 15, 2016](https://devblogs.microsoft.com/dotnet/announcing-net-core-1-1/)  | [LTS][LTS] | [1.1.13][1.1.13]    | [June 27, 2019](https://devblogs.microsoft.com/dotnet/net-core-1-0-and-1-1-will-reach-end-of-life-on-june-27-2019/)    |
| [.NET Core 1.0][.NET Core 1.0] | [June 26, 2016](https://devblogs.microsoft.com/dotnet/announcing-net-core-1-0/)      | [LTS][LTS] | [1.0.16][1.0.16]    | [June 27, 2019](https://devblogs.microsoft.com/dotnet/net-core-1-0-and-1-1-will-reach-end-of-life-on-june-27-2019/)    |

[.NET 7.0]: release-notes/7.0/README.md
[STS]: policies
[7.0.20]: release-notes/7.0/7.0.20/7.0.20.md
[.NET 6.0]: release-notes/6.0/README.md
[6.0.36]: release-notes/6.0/6.0.36/6.0.36.md
[.NET 5.0]: release-notes/5.0/README.md
[5.0.17]: release-notes/5.0/5.0.17/5.0.17.md
[.NET Core 3.1]: release-notes/3.1/README.md
[3.1.32]: release-notes/3.1/3.1.32/3.1.32.md
[.NET Core 3.0]: release-notes/3.0/README.md
[3.0.3]: release-notes/3.0/3.0.3/3.0.3.md
[.NET Core 2.2]: release-notes/2.2/README.md
[2.2.8]: release-notes/2.2/2.2.8/2.2.8.md
[.NET Core 2.1]: release-notes/2.1/README.md
[2.1.30]: release-notes/2.1/2.1.30/2.1.30.md
[.NET Core 2.0]: release-notes/2.0/README.md
[2.0.9]: release-notes/2.0/2.0.9/2.0.9.md
[.NET Core 1.1]: release-notes/1.1/README.md
[1.1.13]: release-notes/1.1/1.1.13/1.1.13.md
[.NET Core 1.0]: release-notes/1.0/README.md
[1.0.16]: release-notes/1.0/1.0.16/1.0.16.md

[policies]: release-policies.md
