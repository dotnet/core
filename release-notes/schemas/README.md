# Release notes schemas

JSON schemas are available for most JSON formats used in this repository.

All current schemas are v1 and located in the [`v1/`](./v1/) directory.

## HAL Index Files (Recommended)

The HAL index files are the recommended entry points. They use HAL+JSON format with `_links` for navigation and `_embedded` for inline data.

### Root Index — `index.json`

The root index contains all major .NET versions with support status and EOL dates.

- File: [`index.json`](../index.json)
- Schema: [`dotnet-release-version-index.json`](./v1/dotnet-release-version-index.json)

### Major Version Index — `{version}/index.json`

Contains all patch releases for a major version with CVE summaries.

- Example: [`8.0/index.json`](../8.0/index.json)
- Schema: [`dotnet-release-version-index.json`](./v1/dotnet-release-version-index.json)

### Patch Index — `{version}/{patch}/index.json`

Contains details for a single patch release including embedded CVE disclosures.

- Example: [`8.0/8.0.21/index.json`](../8.0/8.0.21/index.json)
- Schema: [`dotnet-patch-detail-index.json`](./v1/dotnet-patch-detail-index.json)

### Timeline Index — `timeline/index.json`

Time-based entry point for navigating releases by year and month.

- File: [`timeline/index.json`](../timeline/index.json)
- Schema: [`dotnet-release-timeline-index.json`](./v1/dotnet-release-timeline-index.json)

### SDK Index — `{version}/sdk/index.json`

SDK feature band metadata for a major version.

- Example: [`8.0/sdk/index.json`](../8.0/sdk/index.json)
- Schema: [`dotnet-sdk-version-index.json`](./v1/dotnet-sdk-version-index.json)

## releases-index Files (Backward Compatibility)

These files are the original release metadata format, maintained for backward compatibility with existing tooling.

### Major releases index — `releases-index.json`

The `releases-index.json` file is the index file for all major releases. The file includes high-level information about each major version, including version, support phase, latest patch version, whether the latest patch version includes CVE fixes, and links to other JSON resources. It is relatively small, about a dozen lines per version object.

- File: [`releases-index.json`](../releases-index.json)
- Schema: [`dotnet-releases-index.json`](./v1/dotnet-releases-index.json)

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
    "releases.json": "https://builds.dotnet.microsoft.com/dotnet/release-metadata/8.0/releases.json",
    "supported-os.json": "https://builds.dotnet.microsoft.com/dotnet/release-metadata/8.0/supported-os.json"
}
```

Notes:

- Some property values are repeated. The properties with `.` characters in them, like `supported-os.json`, are considered deprecated.
- This file is generated from the `releases.json` files in the major version directories.

### Patch releases — `releases.json`

The `releases.json` file contains detailed release information for the life of a major release, all within a single file.

- Example: [`8.0/releases.json`](../8.0/releases.json)
- Schema: [`dotnet-patch-release.json`](./v1/dotnet-patch-release.json)

Notes:

- These files can grow to be quite large (>10k lines).
- These files are used as the source for other, generated, files.

## Supporting Files

### Supported OS — `supported-os.json`

Supported OS information is published for each major release. It describes a set of operating distributions and which versions are supported.

- Example: [`8.0/supported-os.json`](../8.0/supported-os.json)
- Schema: [`dotnet-supported-os.json`](./v1/dotnet-supported-os.json)

Notes:

- This file is only present for .NET 6+.

### OS packages — `os-packages.json`

OS package information is published for each major release. A nominal set of packages is documented, including the scenarios they are required for. Each operating system can then indicate which of those packages are required (for that given environment). The packages are documented in an order that makes it possible to `foreach` over the first n packages in the array for common scenarios.

- Example: [`9.0/os-packages.json`](../9.0/os-packages.json)
- Schema: [`dotnet-os-packages.json`](./v1/dotnet-os-packages.json)

Notes:

- This file is only present for .NET 9+.

### CVE Details — `cve.json`

Full CVE disclosure details for a month, including affected products, packages, and commit diffs.

- Example: [`timeline/2025/01/cve.json`](../timeline/2025/01/cve.json)
- Schema: [`dotnet-cves.json`](./v1/dotnet-cves.json)

Notes:

- Located in timeline month directories (e.g., `timeline/2025/01/cve.json`).
- Only present for months with security releases.
