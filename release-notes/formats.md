# Release note formats

Release notes are available in a combination of markdown and JSON formats. This content is [licensed](./license-information.md) for broad use.

JSON schemas are available for JSON formats at [schemas](./schemas/README.md).

## Monthly patch release notes

We typically release updates each month. These often include security fixes for vulnerabilities (AKA CVEs) disclosed on the same day. We publish release notes that provide extensive information about the release.

Typical information:

- Links to binaries
- Notable changes, including CVEs
- Compatibility information
- Updated packages

Examples markdown files:

- [6.0/6.0.32/6.0.32.md](./6.0/6.0.32/6.0.32.md)
- [8.0/8.0.1/8.0.1.md](./8.0/8.0.1/8.0.1.md)

Example JSON files:

- [Major releases index](./releases-index.json)
- [Major release](./9.0/releases.json)
- [Patch release index, for a major version](./9.0/patch-release-index.json)
- [Patch release](./9.0/preview/preview1/release.json)

Note: monthly previews are published in the same way, often on the same day. They are not supported so do not include CVE information. However, Release Candidate releases follow our ["go live" policy](https://github.com/dotnet/core/blob/main/release-policies.md) and may include CVE information.

## Monthly preview release notes

We typically release a preview for the next major version each month. These include dense feature information.

Examples:

- [.NET 9 Preview 1](./9.0/preview/preview1/README.md)
- [.NET 9 Preview 6](./9.0/preview/preview6/README.md)

This content is used as source material for [What's New](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) pages in official Microsoft docs, which are [often updated](https://github.com/dotnet/docs/pulls?q=is%3Apr+What%27s+New) on the same day as a preview release.

Preview release notes are always in a `preview` folder. This approach was adopted so that preview releases do not distract from stable releases once preview releases are no longer relevant.
