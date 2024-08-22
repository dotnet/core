# Release notes schemas

JSON schemas are available for most JSON formats used in this repository.

> Note: The JSON formats are currently undergoing (compatible) change. For a short while, the information in this document and the repo may not match.

## Major releases index -- `releases-index.json`

The `releases-index.json` file is the index file for all major releases. The file includes high-level information about each major version, including version, support phase, latest patch version, whether the latest patch version includes CVE fixes, and links to other JSON resources. It is relatively small, about a dozen lines per version object.

- File: [`releases-index.json`](../releases-index.json)
- Schema: [`dotnet-releases-index.json`](./dotnet-releases-index.json)

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
    "patch-releases-info-uri": "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/releases.json",
    "patch-releases-index-uri": "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/patch-releases-index.json",
    "supported-os.json": "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/supported-os.json",
    "supported-os-info-uri": "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/supported-os.json"
},
```

Notes:

- Some property values are repeated. The properties with `.` characters in them, like `supported-os.json`, are considered deprecated.
- This file is generated from the `releases.json` files in the major version directories.

## Patch releases -- `releases.json`

The `releases.json` file contains detailed release information for the life of a major release, all within a single file.

- Example: [8.0 `releases.json`](../8.0/releases.json)
- Schema: [`dotnet-patch-release.json`](./dotnet-patch-release.json)

The following example demonstrates the start of this file.

```json
{
  "channel-version": "8.0",
  "latest-release": "8.0.7",
  "latest-release-date": "2024-07-09",
  "latest-release-security": true,
  "latest-runtime": "8.0.7",
  "latest-sdk": "8.0.303",
  "product": ".NET",
  "support-phase": "active",
  "release-type": "lts",
  "eol-date": "2026-11-10",
  "lifecycle-policy": "https://aka.ms/dotnetcoresupport",
  "patch-releases-index-uri":"https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/patch-releases-index.json",
  "supported-os-info-uri": "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/supported-os.json",
  "releases": [
    {
      "release-date": "2024-07-09",
      "release-version": "8.0.7",
      "security": true,
      "cve-list": [
        {
          "cve-id": "CVE-2024-38095",
          "cve-url": "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-38095"
        },
        {
          "cve-id": "CVE-2024-35264",
          "cve-url": "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-35264"
        },
        {
          "cve-id": "CVE-2024-30105",
          "cve-url": "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-30105"
        }
      ],
      "release-notes": "https://github.com/dotnet/core/blob/main/release-notes/8.0/8.0.7/8.0.7.md",
```

Notes:

- These files can grow to be quite large (>10k lines).
- These files are used as the source for other, generated, files.

<!--
## Patch releases index -- `patch-releases-index.json`

The `patch-releases-index.json` is the index file for all patch releases within a major release. It contains much the same high-level information as `releases-index.json`, but for a single major release.  It is relatively small, just a few lines per version object.

- Example: [8.0 `patch-releases-index.json`](../8.0/patch-releases-index.json)
- Schema: [`dotnet-patch-releases-index.json`](./dotnet-patch-releases-index.json)

The following example demonstrates the start of this file including one version object.

```json
{
  "channel-version": "8.0",
  "latest-release": "8.0.7",
  "latest-release-date": "2024-07-09",
  "latest-release-security": true,
  "supported-os-info-uri": "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/supported-os.json",
  "releases": [
    {
      "release-version": "8.0.7",
      "release-date": "2024-07-09",
      "security": true,
      "release-info-uri": "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/8.0.7/release.json"
    },
```

Notes:

- This file is only present for .NET 8+.
- This file is generated from the `releases.json` files in the major version directories.

## Patch release -- `release.json`

The `release.json` file contains expansive release information for a single patch version. It contains the same information as `releases.json`, for a single patch release.

- Example: [8.0.0 `release.json`](../8.0/8.0.0/release.json)
- Schema: [`dotnet-patch-release.json`](./dotnet-patch-release.json)

Notes:

- This file is medium size, typically <1000 lines.
- This file is only present for .NET 8+.
- This file is generated from the `releases.json` files in the major version directories.

-->

## Supported OS -- `supported-os.json`

Supported OS information is published for each major release. It describes a set of operating distributions and which versions are supported.

- Example: [8.0 `supported-os.json`](../8.0/supported-os.json)
- Schema: [`dotnet-supported-os.json`](./dotnet-supported-os.json)

Notes:

- This file is only present for .NET 6+.

## OS packages -- `os-packages.json`

OS package information is published for each major release. A nominal set of packages is documented, including the scenarios they are required for. Each operating system can then indicate which of those packages are required (for that given environment). The packages are documented in an order that makes it possibly to `foreach` over the first n packages in the array for common scenarios.

- Example: [9.0 OS packages (json)](../9.0/os-packages.json)
- Schema: [`dotnet-os-packages.json`](./dotnet-os-packages.json)

- This file is only present for .NET 9+.
