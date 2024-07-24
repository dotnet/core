# Release note formats

Release notes are available in a combination of markdown and JSON formats. The intent is to make release notes available in JSON format if there is a scenario that requires structured data. This content is [licensed](./license-information.md) for broad use.

JSON schemas are available for JSON formats at [schemas](./schemas/README.md).

## Monthly patch release notes

We typically release updates each month. These often include security fixes for vulnerabilities (AKA CVEs) disclosed on the same day. We publish release notes that provide extensive information about the release.

Typical information:

- Links to binaries
- Notable changes, including CVEs
- Compatibility information
- Updates packages

Examples markdown files:

- [6.0/6.0.32/6.0.32.md](./6.0/6.0.32/6.0.32.md)
- [8.0/8.0.1/8.0.1.md](./8.0/8.0.1/8.0.1.md)

Example JSON files:

- [releases-index.json](./releases-index.json)
- [9.0/releases.json](./9.0/releases.json)
- [9.0/patch-release-index.json](./9.0/patch-release-index.json)
- [Patch release overview](./9.0/preview/preview1/release.json)

## Monthly preview release notes

We typically release a preview for the next major version each month. These are much the same as the monthly patches.

They primarily differ in two ways:

- Dense feature descriptions
- No CVE information (applies to previews, not RCs)

Examples:

- [.NET 9 Preview 1](./9.0/preview/preview1/README.md)
- [.NET 9 Preview 6](./9.0/preview/preview6/README.md)

This content is used as source material for [What's New](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) pages in official Microsoft docs, which are [often updated](https://github.com/dotnet/docs/pulls?q=is%3Apr+What%27s+New) on the same day as a preview release.

Preview release notes are always in a `preview` folder. This approach was adopted so that preview releases do not distract from stable releases once preview releases are no longer relevant.

## Releases Index (json)

The `releases-index.json` file is the entrypoint into all other JSON files. This file is relatively small, about a dozen lines per major version. The file includes support phase, latest version, and whether the latest version included CVE fixes.

- File: [`releases-index.json`](./releases-index.json)
- Schema: [`dotnet-releases-index.json`](https://json.schemastore.org/dotnet-releases-index.json)

The following example demonstrates a version object from the file.

```json
{
    "channel-version": "8.0",
    "latest-release": "8.0.7",
    "latest-release-date": "2024-07-09",
    "security": true,
    "latest-runtime": "8.0.7",
    "latest-sdk": "8.0.303",
    "product": ".NET",
    "support-phase": "active",
    "eol-date": "2026-11-10",
    "release-type": "lts",
    "releases.json": "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/releases.json",
    "supported-os.json": "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/supported-os.json"
}
```

Each version object includes links to more detailed release-specific information.

The links are to a blob storage location, not to GitHub. We chose the blog storage links as the default because we knew some users were using the JSON files from within Azure and we also better understood the reliability characteristics of Azure.

`releases-index.json` and all the files it references are stored in blob storage and in GitHub. It is straightforward to programmatically transform the [blob storage links](https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/releases-index.json) to [`raw` GitHub links](https://raw.githubusercontent.com/dotnet/core/main/release-notes/releases-index.json) should that be desired.

## Releases (json)

The `releases.json` file contains expansive release information for the life of a major release. It includes much the same information as the Monthly and preview markdown release notes.

Examples:

- [.NET 8 `releases.json`](./8.0/releases.json)
- [.NET 9 `releases.json`](./9.0/releases.json)

These files can grow to be quite large. We are considering producing release-specific versions of this file, for example for `8.0/8.0.1/release.json`.

## Supported OS (json and markdown)

Supported OS information is published for each release. This information indicates to users which OSes they can expect an app (or the .NET SDK) to run on for a given .NET version. It also indicates which OSes are supported and when they transitioned to EOL status.

Examples:

- [.NET 8 Supported OSes (json)](./8.0/supported-os.json)
- [.NET 8 Supported OSes (markdown)](./8.0/supported-os.md)
- [.NET 9 Supported OSes (json)](./9.0/supported-os.json)
- [.NET 9 Supported OSes (markdown)](./9.0/supported-os.md)

## OS packages (json and markdown)

OS package information is published for each release. This information indicates which packages must be installed on a given distro for a .NET app (or the .NET SDK) to run. [.NET packages](../linux.md) are available for multiple distros, which automatically install all required packages.

Schema: [dotnet-os-packages.json](./schemas/dotnet-os-packages.json)

Examples:

- [.NET 9 OS packages (json)](./9.0/os-packages.json)
- [.NET 9 OS packages (markdown)](./9.0/os-packages.md)
