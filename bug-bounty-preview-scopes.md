# .NET Bounty Scope

## Introduction

The [.NET bug bounty](https://www.microsoft.com/msrc/bounty-dot-net-core) covers current released versions of .NET Core, ASP.NET Core and .NET, as well as the latest beta or release candidate of the upcoming version.

.NET has the concept of [preview features](https://github.com/dotnet/designs/blob/main/accepted/2021/preview-features/preview-features.md) which ship in the current version, or in nightly builds of the upcoming version. Preview features are not enabled by default, but their goal is to be enabled in the next major release. Preview features are now considered in scope for the bug bounty if they are listed in the table below.

Bugs against preview features in the current release must be demonstrated against the latest current release.

Bugs against preview features in nightly builds of the next version must be demonstrated against the build number listed in the table below, or subsequent builds. Preview features in nightly builds may fall out of scope while bugs are addressed or the removal of the feature from the upcoming version.

Any inclusion of a feature in the table below should not be taken as an indication that the feature will ship in any upcoming version.

Documentation of security bugs for preview features are only in scope for the current released version of .NET

Read the .NET bug bounty [terms and conditions](https://www.microsoft.com/msrc/bounty-dot-net-core) before submitting your bug report. To be eligible for a bounty, you must submit your bug report through the Microsoft Security Response Center (MSRC).

## In-scope preview features in the current release (.NET 6)

| Feature | Description | Documentation |
|---------|-------------|---------------|
| HTTP/3 | HTTP/3 support in the Kestrel Web Server | [Enabling HTTP/3](https://learn.microsoft.com/aspnet/core/fundamentals/servers/kestrel/http3?view=aspnetcore-6.0) |

## In-scope preview features in nightly builds of the upcoming version (.NET 7)

| Feature | Description | Minimum Build Number | Documentation |
|---------|-------------|----------------------|---------------|
| *None*  ||||

### Page History

Last Updated: 2021-11-15 - Initial listing
