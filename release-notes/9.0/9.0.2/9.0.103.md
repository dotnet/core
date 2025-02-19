# .NET 9.0.103 -February 11, 2025

The .NET 9.0.103 release is available for download. This SDK includes the  released .NET 9.0.2 Runtime and is in support of Visual Studio 17.12 release. The latest 9.0 release is always listed at [.NET 9.0 Releases](../README.md).

## Downloads

|           | SDK Installer                        | SDK Binaries                 | Runtime Installer                                        | Runtime Binaries                                 | ASP.NET Core Runtime           |Windows Desktop Runtime          |
| --------- | :------------------------------------------:     | :----------------------:                 | :---------------------------:                            | :-------------------------:                      | :-----------------:            | :-----------------:            |
| Windows   | [x86][dotnet-sdk-win-x86.exe] \| [x64][dotnet-sdk-win-x64.exe] \| [Arm64][dotnet-sdk-win-arm64.exe] | [x86][dotnet-sdk-win-x86.zip] \| [x64][dotnet-sdk-win-x64.zip] \|  [Arm64][dotnet-sdk-win-arm64.zip] | [x86][dotnet-runtime-win-x86.exe] \| [x64][dotnet-runtime-win-x64.exe] \| [Arm64][dotnet-runtime-win-arm64.exe] | [x86][dotnet-runtime-win-x86.zip] \| [x64][dotnet-runtime-win-x64.zip] \| [Arm64][dotnet-runtime-win-arm64.zip] | [x86][aspnetcore-runtime-win-x86.exe] \| [x64][aspnetcore-runtime-win-x64.exe] \| [Hosting Bundle][dotnet-hosting-win.exe] | [x86][windowsdesktop-runtime-win-x86.exe] \| [x64][windowsdesktop-runtime-win-x64.exe] \| [Arm64][windowsdesktop-runtime-win-arm64.exe] |
| macOS     | [x64][dotnet-sdk-osx-x64.pkg] \| [ARM64][dotnet-sdk-osx-arm64.pkg] | [x64][dotnet-sdk-osx-x64.tar.gz] \| [ARM64][dotnet-sdk-osx-arm64.tar.gz]  | [x64][dotnet-runtime-osx-x64.pkg] \| [ARM64][dotnet-runtime-osx-arm64.pkg] | [x64][dotnet-runtime-osx-x64.tar.gz] \| [ARM64][dotnet-runtime-osx-arm64.tar.gz]| [x64][aspnetcore-runtime-osx-x64.tar.gz] \| [ARM64][aspnetcore-runtime-osx-arm64.tar.gz] | - |
| Linux     |  [Snap and Package Manager](../install-linux.md)  | [x64][dotnet-sdk-linux-x64.tar.gz] \| [Arm][dotnet-sdk-linux-arm.tar.gz]  \| [Arm64][dotnet-sdk-linux-arm64.tar.gz] \| [Arm32 Alpine][dotnet-sdk-linux-musl-arm.tar.gz]  \| [x64 Alpine][dotnet-sdk-linux-musl-x64.tar.gz] | [Packages (x64)][linux-packages] | [x64][dotnet-runtime-linux-x64.tar.gz] \| [Arm][dotnet-runtime-linux-arm.tar.gz] \| [Arm64][dotnet-runtime-linux-arm64.tar.gz] \| [Arm32 Alpine][dotnet-runtime-linux-musl-arm.tar.gz] \| [Arm64 Alpine][dotnet-runtime-linux-musl-arm64.tar.gz] \| [x64 Alpine][dotnet-runtime-linux-musl-x64.tar.gz]  | [x64][aspnetcore-runtime-linux-x64.tar.gz]  \| [Arm][aspnetcore-runtime-linux-arm.tar.gz] \| [Arm64][aspnetcore-runtime-linux-arm64.tar.gz] \| [x64 Alpine][aspnetcore-runtime-linux-musl-x64.tar.gz] | - |
|  | [Checksums][checksums-sdk]                             | [Checksums][checksums-sdk]                                      | [Checksums][checksums-runtime]                             | [Checksums][checksums-runtime]  | [Checksums][checksums-runtime]  | [Checksums][checksums-runtime] |

1. Includes the .NET Runtime and ASP.NET Core Runtime
2. For hosting stand-alone apps on Windows Servers. Includes the ASP.NET Core Module for IIS and can be installed separately on servers without installing .NET Runtime.

The .NET SDK includes a matching updated .NET Runtime. Downloading the Runtime or ASP.NET Core packages is not needed when installing the SDK.

You can check your .NET SDK version by running the following command. The example version shown is for this release.

```console
$ dotnet --version
9.0.103
```

Visit [.NET Documentation](https://learn.microsoft.com/dotnet/) to learn about .NET, for building many different types of applications.

## Visual Studio Compatibility

You need [Visual Studio 17.12](https://visualstudio.microsoft.com) or later to use .NET 9.0 on Windows. While not officially supported, we’ve also enabled rudimentary support for .NET 9 in Visual Studio for Mac. Users have to enable a preview feature in Preferences to enable the IDE to discover and use the .NET 9 SDK for creating, loading, building, and debugging projects.
The [C# extension](https://code.visualstudio.com/docs/languages/dotnet) for [Visual Studio Code](https://code.visualstudio.com/) supports .NET 9.0 and C# 12.

[checksums-runtime]: https://builds.dotnet.microsoft.com/dotnet/checksums/9.0.2-sha.txt
[checksums-sdk]: https://builds.dotnet.microsoft.com/dotnet/checksums/9.0.2-sha.txt

[linux-packages]: ../install-linux.md

[//]: # ( Runtime 9.0.2)
[dotnet-runtime-linux-arm.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/6ad62cc2-7db5-4961-9192-84d50536b636/19e78b86ce8b40becdca65a7b7e8d8df/dotnet-runtime-9.0.2-linux-arm.tar.gz
[dotnet-runtime-linux-arm64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/3658cac0-6e40-4467-af08-02cf5bc0309c/ad2d0efa6e2bf05fd1078182d232f052/dotnet-runtime-9.0.2-linux-arm64.tar.gz
[dotnet-runtime-linux-musl-arm.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/efa5ec39-7af0-4941-9886-6c37758df9cd/9b0910cf8f0be4645fd7bde1f2665e5c/dotnet-runtime-9.0.2-linux-musl-arm.tar.gz
[dotnet-runtime-linux-musl-arm64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/5a74dfdf-3b5d-4e92-bd17-878401c55dd5/a9fcf25e0571144a1cf08b23da3476fc/dotnet-runtime-9.0.2-linux-musl-arm64.tar.gz
[dotnet-runtime-linux-musl-x64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/e848109e-b3a7-4496-ae31-345b92345a81/78db157b0850dd7d9ce22c908d53154f/dotnet-runtime-9.0.2-linux-musl-x64.tar.gz
[dotnet-runtime-linux-x64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/a15e92d8-e1db-402c-b06d-b6dcf7ad58eb/8c4233bceadcf8f57b40f64aceda69f7/dotnet-runtime-9.0.2-linux-x64.tar.gz
[dotnet-runtime-osx-arm64.pkg]: https://download.visualstudio.microsoft.com/download/pr/016550c2-bc46-43e1-9a9b-31ddb92608ed/7f2a45a4560de9ce447a681162e2e753/dotnet-runtime-9.0.2-osx-arm64.pkg
[dotnet-runtime-osx-arm64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/4e559996-ff59-4cdb-8a91-e6c7d7235f4e/e5766287ef607672cc47be8119afc28a/dotnet-runtime-9.0.2-osx-arm64.tar.gz
[dotnet-runtime-osx-x64.pkg]: https://download.visualstudio.microsoft.com/download/pr/8639e61e-f1da-4e5b-a3d1-f1a92f726b3d/4a1f32a0db1e3858dee4f2f3823941e3/dotnet-runtime-9.0.2-osx-x64.pkg
[dotnet-runtime-osx-x64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/b5a5d3a4-2054-499f-99e2-cf64bbc7ad24/bf987a5f19a84196621b725b9e41b332/dotnet-runtime-9.0.2-osx-x64.tar.gz
[dotnet-runtime-win-arm64.exe]: https://download.visualstudio.microsoft.com/download/pr/13aefe6a-ec97-4166-9b8c-278d026a8db9/58b4801e50bdfd60eedef192248cb8fd/dotnet-runtime-9.0.2-win-arm64.exe
[dotnet-runtime-win-arm64.zip]: https://download.visualstudio.microsoft.com/download/pr/9f54f2ae-49f3-4c94-a49a-4a4a5331d106/8b71ca2d99b8a4c7360d4dbfcf9b4b1b/dotnet-runtime-9.0.2-win-arm64.zip
[dotnet-runtime-win-x64.exe]: https://download.visualstudio.microsoft.com/download/pr/f3a5b463-833d-4275-bcaf-5e10c24b31fd/f55af40f168e104e5d93aa1998879570/dotnet-runtime-9.0.2-win-x64.exe
[dotnet-runtime-win-x64.zip]: https://download.visualstudio.microsoft.com/download/pr/a1b2400e-b3c9-487d-af4c-f46d78e24752/3769330a99d7556c0f625e657fe9b361/dotnet-runtime-9.0.2-win-x64.zip
[dotnet-runtime-win-x86.exe]: https://download.visualstudio.microsoft.com/download/pr/4e6149c1-93a5-4c39-93f7-acedb3b8f576/01b7d995fb8cf6d87d71bc625b61dc96/dotnet-runtime-9.0.2-win-x86.exe
[dotnet-runtime-win-x86.zip]: https://download.visualstudio.microsoft.com/download/pr/25bb6f46-a94f-4ebf-952a-52c5d2310240/fc7a4440f6d8020483821e437d40cf5e/dotnet-runtime-9.0.2-win-x86.zip

[//]: # ( WindowsDesktop 9.0.2)
[windowsdesktop-runtime-win-arm64.exe]: https://download.visualstudio.microsoft.com/download/pr/d8b26b48-2f5c-4814-a253-c752a45b504e/2ff9ba5aa7ab19d3736a3c5d9d346b3d/windowsdesktop-runtime-9.0.2-win-arm64.exe
[windowsdesktop-runtime-win-x64.exe]: https://download.visualstudio.microsoft.com/download/pr/0e1df956-98b6-48cc-86ac-8b6c02feb6d9/cb90f6c099d4cdefe8d35af6115a3ec5/windowsdesktop-runtime-9.0.2-win-x64.exe
[windowsdesktop-runtime-win-x86.exe]: https://download.visualstudio.microsoft.com/download/pr/f9db1de7-9170-443f-955c-565c56ede288/b0a583d9f169ee3357639479786d1eb8/windowsdesktop-runtime-9.0.2-win-x86.exe

[//]: # ( ASP 9.0.2)
[aspnetcore-runtime-linux-arm.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/0b7ddf3f-d43d-49c2-be1d-bf59075d85e7/b1da14023ea7fef1fada6c8898635fbb/aspnetcore-runtime-9.0.2-linux-arm.tar.gz
[aspnetcore-runtime-linux-arm64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/744cd467-ac89-4656-9633-ed22e3afb35e/4277cdc84219d6515cb14220ddc0bde3/aspnetcore-runtime-9.0.2-linux-arm64.tar.gz
[aspnetcore-runtime-linux-musl-x64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/435eb32e-b24f-4c82-b044-6f4b97e7338f/5e79b00ea13180f349e28f127cf1c26a/aspnetcore-runtime-9.0.2-linux-musl-x64.tar.gz
[aspnetcore-runtime-linux-x64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/36ab7b0d-966a-44ce-ad19-bc0d7e835724/a38c1f97ccc9f4ccce58427c830c32fb/aspnetcore-runtime-9.0.2-linux-x64.tar.gz
[aspnetcore-runtime-osx-arm64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/0e3c0776-3b1b-4e34-8dc5-1f764e435f68/3fc575fd1def4bba8258cdf39cf24e35/aspnetcore-runtime-9.0.2-osx-arm64.tar.gz
[aspnetcore-runtime-osx-x64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/80ab707c-4568-4bb3-998d-04b1935648dd/cec09318721d7d5e3cdd64e987a1dd8e/aspnetcore-runtime-9.0.2-osx-x64.tar.gz
[aspnetcore-runtime-win-x64.exe]: https://download.visualstudio.microsoft.com/download/pr/ef8f48ce-bf76-4ffc-bb8f-40991ec99b6e/f68b6492c75839333ad8c2fd3ff9c7b4/aspnetcore-runtime-9.0.2-win-x64.exe
[aspnetcore-runtime-win-x86.exe]: https://download.visualstudio.microsoft.com/download/pr/b985a5f3-8a2c-4854-a69d-e6a585a277fd/8e9965972940a2efd07b150432ee7f5f/aspnetcore-runtime-9.0.2-win-x86.exe
[dotnet-hosting-win.exe]: https://download.visualstudio.microsoft.com/download/pr/785df3b0-8483-4eb0-8826-3cfb0d708ba7/28ad125421135a4fad3f03cea41cd673/dotnet-hosting-9.0.2-win.exe

[//]: # ( SDK 9.0.103)
[dotnet-sdk-linux-arm.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/c2cb3c08-be1a-4b0f-95f3-3c2b2c2371fb/04c3b5830bb78065424666956d65a503/dotnet-sdk-9.0.103-linux-arm.tar.gz
[dotnet-sdk-linux-arm64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/226328f5-ac73-4daa-99dc-04961042c422/18787af4ca8bd7d646534c559e4a3c75/dotnet-sdk-9.0.103-linux-arm64.tar.gz
[dotnet-sdk-linux-musl-arm.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/63a41de4-93be-4cbd-ac13-93d1feec6a30/a6bb2018d1a952daadf70852064686c9/dotnet-sdk-9.0.103-linux-musl-arm.tar.gz
[dotnet-sdk-linux-musl-x64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/0211b6cf-e6b2-4034-b2a4-f47828046fe3/fcbc490417d2ea0114a74aafbb46b92b/dotnet-sdk-9.0.103-linux-musl-x64.tar.gz
[dotnet-sdk-linux-x64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/053d1161-da60-4c43-bcf4-cfb91d3d3201/18cad0308294c91e3ca9913a33cb4371/dotnet-sdk-9.0.103-linux-x64.tar.gz
[dotnet-sdk-osx-arm64.pkg]: https://download.visualstudio.microsoft.com/download/pr/06a9e1cc-16a2-4054-810d-02538924b96f/c29ef6a7597763178cb3026973e23cf4/dotnet-sdk-9.0.103-osx-arm64.pkg
[dotnet-sdk-osx-arm64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/c54a9a42-e212-42ce-b00e-ac352d2fc848/3cbf76fac85c39e1eb8ba4a4bd9fcd55/dotnet-sdk-9.0.103-osx-arm64.tar.gz
[dotnet-sdk-osx-x64.pkg]: https://download.visualstudio.microsoft.com/download/pr/f04372d6-2f53-45fb-b7b1-b91f64ceab57/2d7ccbe05b267ec9c7e08a940638abb6/dotnet-sdk-9.0.103-osx-x64.pkg
[dotnet-sdk-osx-x64.tar.gz]: https://download.visualstudio.microsoft.com/download/pr/7306a1d9-153d-4417-9d94-950e2d2d0426/fa4dfb44bce429d39ebbc916e949c3cf/dotnet-sdk-9.0.103-osx-x64.tar.gz
[dotnet-sdk-win-arm64.exe]: https://download.visualstudio.microsoft.com/download/pr/a12cf12e-5a09-4ae3-aa2c-6023afa76b67/241a7d94a78c830a9a727e536d9d489c/dotnet-sdk-9.0.103-win-arm64.exe
[dotnet-sdk-win-arm64.zip]: https://download.visualstudio.microsoft.com/download/pr/0580d1d7-4ff9-4e8b-9801-fc084507d7cc/f7afd81cc0d6e6f17def4258a617405c/dotnet-sdk-9.0.103-win-arm64.zip
[dotnet-sdk-win-x64.exe]: https://download.visualstudio.microsoft.com/download/pr/25df6db4-4cf7-4cb2-94aa-1138932e840f/bf87e06f6da564de405d3e9c4f38f025/dotnet-sdk-9.0.103-win-x64.exe
[dotnet-sdk-win-x64.zip]: https://download.visualstudio.microsoft.com/download/pr/ab33cf70-527c-4517-9ed1-97056db08896/997dd9b12cce454426babec7e0071bde/dotnet-sdk-9.0.103-win-x64.zip
[dotnet-sdk-win-x86.exe]: https://download.visualstudio.microsoft.com/download/pr/80088bbe-136f-4cc6-9c16-212dd5a39ffc/cd51139a737774c90b1b90f051f42ca6/dotnet-sdk-9.0.103-win-x86.exe
[dotnet-sdk-win-x86.zip]: https://download.visualstudio.microsoft.com/download/pr/2fd8d789-df0d-4031-a8b9-87f7e7a22c4c/a2b6818b1e626904502f3ce5d79d0917/dotnet-sdk-9.0.103-win-x86.zip
