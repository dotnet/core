# Container images in .NET 11 Preview 2 - Release Notes

Here's a summary of what's new for .NET container images in this Preview 2 release:

-

## SDK container images are up to 17% smaller

.NET 11 Preview 2 SDK container images are significantly smaller than Preview 1.
This size reduction is a result of [eliminating duplicate files within the SDK](https://github.com/dotnet/sdk/issues/41128) using filesystem hard links.
The result is a compressed (wire) size reduction of approximately 44 MB for all .NET SDK container images.

| OS | Arch | Preview 1 (MB) | Preview 2 (MB) | Diff (MB) | Diff (%) |
| --- | --- | --- | --- | --- | --- |
| Alpine 3.23 | amd64 | 274.2 | 230.3 | **-43.9** | -16.0% |
| Alpine 3.23 | arm64 | 250.4 | 207.5 | **-42.9** | -17.1% |
| Azure Linux 3.0 | amd64 | 337.2 | 293.3 | **-44.0** | -13.0% |
| Azure Linux 3.0 | arm64 | 328.3 | 285.2 | **-43.1** | -13.1% |
| Ubuntu 26.04 | amd64 | 331.0 | 288.9 | **-42.1** | -12.7% |
| Ubuntu 26.04 | arm64 | 323.4 | 282.0 | **-41.4** | -12.8% |

This size reduction also applies to [standalone .NET SDK archives and installers](./sdk.md#smaller-sdk-installers-on-linux-and-macos).
