# Container images in .NET 11 Preview 3 - Release Notes

Here's a summary of what's new for .NET container images in this Preview 3 release:

## .NET container images are now signed

All .NET container images now are signed with [Notary Project](https://notaryproject.dev/docs/notary-project-overview/)
signatures. See the [image signatures documentation](https://github.com/dotnet/dotnet-docker/blob/main/documentation/image-signatures.md)
for the latest documentation on inspecting and verifying image signatures.

Use the [Notation CLI](https://github.com/notaryproject/notation) or the
[ORAS CLI](https://oras.land/docs/installation) to see details about signature artifacts:

```console
notation inspect mcr.microsoft.com/dotnet/sdk:11.0.100-preview.3
oras discover mcr.microsoft.com/dotnet/sdk:11.0.100-preview.3
```
