# .NET Release Notes

[Releases](../releases.md) under active support or development:

|  Version  | Release Date | Support | Latest Patch Version | End of Support |
| :-- | :-- | :-- | :-- | :-- |
| [.NET 9](9.0/README.md) | November 12, 2024 | [STS][policies] | [9.0.0-rc.2][9.0.0-rc.2] | May 12, 2026 |
| [.NET 8](8.0/README.md) | [November 14, 2023](https://devblogs.microsoft.com/dotnet/announcing-dotnet-8/) | [LTS][policies] | [8.0.10][8.0.10] | November 10, 2026 |
| [.NET 6](6.0/README.md) | [November 8, 2021](https://devblogs.microsoft.com/dotnet/announcing-net-6/) | [LTS][policies] | [6.0.35][6.0.35]  | November 12, 2024 |

[9.0.0-rc.2]: 9.0/preview/rc2/9.0.0-rc.2.md
[8.0.10]: 8.0/8.0.10/8.0.10.md
[6.0.35]: 6.0/6.0.35/6.0.35.md
[policies]: ../release-policies.md

* [Binaries and installers](https://dotnet.microsoft.com/download/dotnet)
* [Installation docs](https://learn.microsoft.com/dotnet/core/install/)

You can find release notes for all releases in the [release-notes](.) directory, in markdown and [JSON formats](./schemas/README.md). This content is [licensed](./license-information.md) for broad use.

## Monthly patch release notes

Patch releases are published monthly, often including fixes for vulnerabilities (AKA CVEs) that are disclosed at the same time.

Release notes include:

- Links to binaries
- Notable changes, including CVEs
- Compatibility information
- Updated packages

Example markdown files:

- [6.0/6.0.32/6.0.32.md](./6.0/6.0.32/6.0.32.md)
- [8.0/8.0.1/8.0.1.md](./8.0/8.0.1/8.0.1.md)

Example JSON files:

- [Major releases index](./releases-index.json)
- [Major release](./9.0/releases.json)

`releases-index.json` and all the files it references are stored in blob storage and in GitHub. We use GitHub for easy discoverability of the files and Azure Blob Storage as our production platform.

It is straightforward to programmatically transform the [blob storage links](https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/releases-index.json) to [`raw` GitHub links](https://raw.githubusercontent.com/dotnet/core/main/release-notes/releases-index.json) should that be desired.

Note: monthly previews are published in the same way, often on the same day. They are not supported so do not include CVE information. However, Release Candidate releases follow our ["Go Live" policy](https://github.com/dotnet/core/blob/main/release-policies.md) and may include CVE information.

## Monthly preview release notes

We typically release a preview for the next major version each month. These include detailed feature information.

Examples:

- [.NET 9 Preview 1](./9.0/preview/preview1/README.md)
- [.NET 9 Preview 6](./9.0/preview/preview6/README.md)

This content is used as source material for [What's New](https://learn.microsoft.com/dotnet/core/whats-new/) pages in official Microsoft docs.

Preview release notes are always in a `preview` folder. This approach was adopted so that preview releases do not distract from stable releases once preview releases are no longer relevant.

## Supported OS

Supported OS information is published for each major release. This information indicates to users which OSes they can expect an app (or the .NET SDK) to run on for a given .NET version. It also indicates which OSes are supported and when they transitioned to EOL status.

Examples:

- [.NET 8 Supported OSes (json)](./8.0/supported-os.json)
- [.NET 8 Supported OSes (markdown)](./8.0/supported-os.md)

## OS packages

OS package information is published for each major release. This information indicates which packages must be installed on a given distro for a .NET app (or the .NET SDK) to run. [.NET packages](../linux.md) are available for multiple distros, which automatically install all required packages.

Examples:

- [.NET 9 OS packages (json)](./9.0/os-packages.json)
- [.NET 9 OS packages (markdown)](./9.0/os-packages.md)
