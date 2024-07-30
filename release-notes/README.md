# .NET Release Notes

The following table lists [releases](../releases.md) under active support or development:

|  Version  | Release Date | Support | Latest Patch Version | End of Support |
| :-- | :-- | :-- | :-- | :-- |
| [.NET 9](9.0/README.md) | November 12, 2024 | [STS][policies] | [9.0.0-preview.6][9.0.0-preview.6] | May 12, 2026 |
| [.NET 8](8.0/README.md) | [November 14, 2023](https://devblogs.microsoft.com/dotnet/announcing-dotnet-8/) | [LTS][policies] | [8.0.7][8.0.7] | November 10, 2026 |
| [.NET 6](6.0/README.md) | [November 8, 2021](https://devblogs.microsoft.com/dotnet/announcing-net-6/) | [LTS][policies] | [6.0.32][6.0.32]  | November 12, 2024 |

[9.0.0-preview.6]: 9.0/preview/preview6/9.0.0-preview.6.md
[8.0.7]: 8.0/8.0.7/8.0.7.md
[6.0.32]: 6.0/6.0.32/6.0.32.md
[policies]: ../release-policies.md

You can find release notes for all releases in the [release-notes](.) directory, in a combination of markdown and JSON formats. This content is [licensed](./license-information.md) for broad use. JSON schemas are available for JSON formats at [schemas](./schemas/README.md).

## Download .NET

* [Binaries and installers](https://dotnet.microsoft.com/download/dotnet)
* [Installation docs](https://learn.microsoft.com/dotnet/core/install/)
* [dotnet-install scripts](https://learn.microsoft.com/dotnet/core/tools/dotnet-install-script)

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
- [Patch release index, for a major version](./9.0/patch-release-index.json)
- [Patch release](./9.0/preview/preview1/release.json)

Note: monthly previews are published in the same way, often on the same day. They are not supported so do not include CVE information. However, Release Candidate releases follow our ["Go Live" policy](https://github.com/dotnet/core/blob/main/release-policies.md) and may include CVE information.

## Monthly preview release notes

We typically release a preview for the next major version each month. These include detailed feature information.

Examples:

- [.NET 9 Preview 1](./9.0/preview/preview1/README.md)
- [.NET 9 Preview 6](./9.0/preview/preview6/README.md)

This content is used as source material for [What's New](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) pages in official Microsoft docs, which are [often updated](https://github.com/dotnet/docs/pulls?q=is%3Apr+What%27s+New) on the same day as a preview release.

Preview release notes are always in a `preview` folder. This approach was adopted so that preview releases do not distract from stable releases once preview releases are no longer relevant.

## Supported OS

Supported OS information is published for each major release. This information indicates to users which OSes they can expect an app (or the .NET SDK) to run on for a given .NET version. It also indicates which OSes are supported and when they transitioned to EOL status.

Examples:

- [.NET 8 Supported OSes (json)](./8.0/supported-os.json)
- [.NET 8 Supported OSes (markdown)](./8.0/supported-os.md)

## OS packages

OS package information is published for each major release. This information indicates which packages must be installed on a given distro for a .NET app (or the .NET SDK) to run. [.NET packages](../../linux.md) are available for multiple distros, which automatically install all required packages.

Examples:

- [.NET 9 OS packages (json)](./9.0/os-packages.json)
- [.NET 9 OS packages (markdown)](./9.0/os-packages.md)
