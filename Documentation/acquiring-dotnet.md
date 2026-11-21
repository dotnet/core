# Acquiring .NET reliably

Choose an acquisition method for your environment, then decide whether the
version should move with servicing or remain pinned for a particular build.

## Choose a download resource

| Resource                                                                               | Use it for                                                                             | Version behavior                                                             |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [.NET download site](https://dotnet.microsoft.com/download/dotnet)                     | Interactive selection of an SDK, runtime, installer, or archive                        | Select the release and OS architecture you need                              |
| [Installation documentation](https://learn.microsoft.com/dotnet/core/install/)         | Development machines and deployed applications, including package-manager installation | Depends on the selected installation method                                  |
| [Install scripts](https://learn.microsoft.com/dotnet/core/tools/dotnet-install-script) | Non-admin SDK or runtime setup in CI                                                   | Use `--version` to pin an exact version, or `--channel` to resolve a channel |
| [Release metadata](../release-notes/README.md#monthly-patch-release-notes)             | Tools that select artifacts programmatically                                           | Select an exact release and artifact from the JSON                           |
| Direct artifact URL                                                                    | Downloading the artifact selected by a release manifest                                | A versioned URL identifies a particular build                                |
| An `aka.ms` download link                                                              | Following a published redirect without constructing a storage path                     | The target may move when the link represents a channel or feature band       |

Use the SDK to build applications. Choose a runtime distribution when the
machine only needs to run applications. Match the OS and architecture as well
as the version; an x64 archive is not an Arm64 archive.

## Domains and redirects

The [CDN migration announcement](https://devblogs.microsoft.com/dotnet/critical-dotnet-install-links-are-changing/)
identifies `builds.dotnet.microsoft.com` for official builds and `ci.dot.net` for
CI builds. The old `dotnetcli.azureedge.net` and `dotnetbuilds.azureedge.net`
domains are retired acquisition locations. Update old copies of installation
scripts and download tooling rather than relying on those domains.

The announcement provides a path-compatible migration from the old
`dotnetcli.azureedge.net` and `dotnetcli.blob.core.windows.net` artifact locations
to `builds.dotnet.microsoft.com`. Do not generalize that replacement to other
URL layouts. In particular, historical release metadata can contain
`download.visualstudio.microsoft.com` URLs with opaque paths: follow the full
published URL instead of deriving one from a filename.

Download clients must follow HTTPS redirects, including redirects from
`dot.net` script URLs and `aka.ms` links. Account for the final download hosts
in network allowlists. Check the actual artifact URL when diagnosing a network
failure; access to the download homepage alone does not verify artifact access.

## Select artifacts through release JSON

The production [release index](https://builds.dotnet.microsoft.com/dotnet/release-metadata/releases-index.json)
contains a `releases.json` URL for each channel. Follow that URL, then select
the required release, component, version, and runtime identifier (RID).
Artifact entries provide the download URL and SHA-512 hash.

The [metadata overview](../release-notes/README.md#monthly-patch-release-notes)
describes the index and channel files; the [schemas](../release-notes/schemas/README.md)
describe their formats. Use these published fields rather than scraping the
download website or assuming that all components have the same version.

Store the selected version, RID, URL, and expected hash with your build inputs.
Resolving a channel again later can select a newer servicing release. A
redirecting link is useful for moving channels, but the link alone does not
record which artifact an earlier build used.

## Preview script resolution before installing

The install script's `--dry-run` option resolves download links and prints a
repeatable invocation without installing the SDK. For example, in Bash:

```bash
curl --fail --location --retry 3 --output dotnet-install.sh https://dot.net/v1/dotnet-install.sh
bash ./dotnet-install.sh --channel 10.0 --architecture x64 --dry-run
```

The equivalent PowerShell commands are:

```powershell
Invoke-WebRequest https://dot.net/v1/dotnet-install.ps1 -OutFile dotnet-install.ps1
./dotnet-install.ps1 -Channel 10.0 -Architecture x64 -DryRun
```

This example resolves the current .NET 10 SDK for the detected OS and x64.
Select the architecture for your target. Use `--version` with an approved exact
SDK version when reproducing a build, instead of resolving the channel afresh.
Review the [script reference](https://learn.microsoft.com/dotnet/core/tools/dotnet-install-script)
for runtime-only installation, installation directories, and other options.

## Plan for download failures

For automation that must continue through a temporary public download outage:

1. Resolve and download approved versions before the job needs them. Retain
   the selected metadata alongside the artifacts in your own cache or mirror.
2. [Verify downloaded binaries](verifying-binaries.md) against the expected
   SHA-512 values before admitting them to the cache. Keep versions and RIDs
   separate so one artifact cannot replace another accidentally.
3. Use bounded retries with backoff for transient failures. Set connection and
   overall request timeouts appropriate to your job's download size and budget.
4. Fall back to the cached, verified copy of the same artifact. If none is
   available, fail the job rather than silently installing a different release
   or accepting a checksum mismatch.
5. Exercise the cached path periodically and monitor the metadata, redirect,
   and artifact endpoints your jobs actually use.

These are resilience practices for your pipeline, not an availability guarantee
for a particular public endpoint. A second hostname is not automatically an
independent mirror or a supported fallback. Outside documented migration paths,
avoid inventing fallback URLs by rewriting a published URL's host or path.

For download problems, report the affected URL, UTC time, HTTP status or client
error, and whether redirects completed in the [.NET issue tracker](https://github.com/dotnet/core/issues).
Consult the [CDN migration tracking issue](https://github.com/dotnet/core/issues/9671)
when investigating tooling that still uses retired locations.
