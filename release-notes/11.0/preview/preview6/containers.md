# Container image updates in .NET 11 Preview 6 - Release Notes

Here's a summary of what's new for .NET container images in this Preview 6 release:

- [Azure Linux 4.0 images](#azure-linux-40-images)
- [Smaller Native AOT SDK images](#smaller-native-aot-sdk-images)

## Azure Linux 4.0 images

Azure Linux-based .NET 11 container images have been upgraded from Azure Linux
3.0 to Azure Linux 4.0 Beta. Use the `azurelinux4.0` tags for the
`runtime-deps`, `runtime`, `aspnet`, and `sdk` repositories, including Native
AOT SDK, distroless, and ASP.NET Core composite image variants. For more
information, see [dotnet/dotnet-docker #7209](https://github.com/dotnet/dotnet-docker/pull/7209).

## Smaller Native AOT SDK images

The .NET 11 Native AOT SDK images now use GCC instead of Clang/LLVM and install
only the compiler, linker, and development packages required for Native AOT.
This reduces the Alpine 3.23 image by 123.9 MB (30.9%) and the Ubuntu Resolute
image by 66.8 MB (15.6%). With Azure Linux 4.0 replacing Azure Linux 3.0, the
Azure Linux image is 185.1 MB (32.7%) smaller.

| Image | Before | After | Saved |
| --- | ---: | ---: | ---: |
| `mcr.microsoft.com/dotnet/sdk:11.0-preview-alpine3.23-aot` | 401.2 MB | 277.3 MB | 123.9 MB (30.9%) |
| `mcr.microsoft.com/dotnet/sdk:11.0-preview-azurelinux3.0-aot`<br/> (now `11.0-preview-azurelinux4.0-aot`) | 565.5 MB | 380.4 MB | 185.1 MB (32.7%) |
| `mcr.microsoft.com/dotnet/sdk:11.0-preview-resolute-aot` | 429.5 MB | 362.7 MB | 66.8 MB (15.6%) |

For more information, see
[dotnet/dotnet-docker #7231](https://github.com/dotnet/dotnet-docker/pull/7231).
