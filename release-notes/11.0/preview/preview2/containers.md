# Container images in .NET 11 Preview 2 - Release Notes

Here's a summary of what's new for .NET container images in this Preview 2 release:

-

## SDK container images are up to 17% smaller

.NET 11 Preview 2 SDK container images are significantly smaller than Preview 1.
This size reduction is a result of [eliminating duplicate files within the SDK](https://github.com/dotnet/sdk/issues/41128) using filesystem hard links.
The result is a compressed (wire) size reduction of approximately 44 MB for all .NET SDK container images.

| OS | Arch | Preview 1 (MB) | Preview 2 (MB) | Diff (MB) | Diff (%) |
| --- | --- | --- | --- | --- | --- |
| Alpine 3.23 | amd64 | 274.2 | 230.0 | **-44.2** | -16.1% |
| Alpine 3.23 | arm64 | 250.4 | 207.2 | **-43.2** | -17.2% |
| Azure Linux 3.0 | amd64 | 337.2 | 293.1 | **-44.1** | -13.1% |
| Azure Linux 3.0 | arm64 | 328.3 | 285.0 | **-43.2** | -13.2% |
| Ubuntu 26.04[^1] | amd64 | 331.0[^1] | 292.7[^1] | **-38.3**[^1] | -11.6%[^1] |
| Ubuntu 26.04[^1] | arm64 | 323.4[^1] | 286.0[^1] | **-37.4**[^1] | -11.6%[^1] |

This size reduction also applies to [standalone .NET SDK archives and installers](./sdk.md#smaller-sdk-installers-on-linux-and-macos).

[^1]: The difference in size for Ubuntu 26.04 (Resolute) images is due to package updates and not due to differences in the .NET SDK. Ubuntu 26.04 is pre-release software, so it receives frequent package updates that cause the images to fluctuate in size. The SDK layer size reduction is consistent across all images, including Ubuntu 26.04.
