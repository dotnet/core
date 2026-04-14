# Container images in .NET 11 Preview 3 - Release Notes

Here's a summary of what's new for .NET container images in this Preview 3
release:

## .NET container images are now signed

All .NET container images now are now cryptographically signed by Microsoft
according to the [Notary Project] specification. See the [image signatures
documentation] for the latest documentation on inspecting and verifying image
signatures.

Use the [Notation CLI] or the [ORAS CLI] to see details about signature
artifacts:

```console
notation inspect mcr.microsoft.com/dotnet/sdk:11.0.100-preview.3
oras discover mcr.microsoft.com/dotnet/sdk:11.0.100-preview.3
```

[Notary Project]: https://notaryproject.dev/docs/notary-project-overview/
[image signatures documentation]: https://github.com/dotnet/dotnet-docker/blob/main/documentation/image-signatures.md
[Notation CLI]: https://github.com/notaryproject/notation
[ORAS CLI]: https://oras.land/docs/installation
