# .NET Core 1.1 Preview 1

This page provides download links for .NET Core 1.1 Preview 1 runtime and shared framework only. If you also need the SDK, use the download links on the main [Preview 1 download](https://github.com/dotnet/core/blob/master/release-notes/preview-download.md) page.

| .NET Core 1.1 Preview 1 | Installer                                        | Binaries                                        |
| ----------------------- | :----------------------------------------------: | :----------------------------------------------:|
| Windows                 | [32-bit](https://go.microsoft.com/fwlink/?LinkID=831452) / [64-bit](https://go.microsoft.com/fwlink/?LinkID=831444)  | [32-bit](https://go.microsoft.com/fwlink/?LinkID=831483) / [64-bit](https://go.microsoft.com/fwlink/?LinkID=831476) |
| macOS                   | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831446)  | -                                                                                 |
| CentOS 7.1              | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831487)                          |
| Debian 8                | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831477)                          |
| Fedora 23               | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831484)                          |
| openSUSE 13.2           | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831491)                          |
| openSUSE 42.1           | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831475)                          |
| Ubuntu 14.04            | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831468)                          |
| Ubuntu 16.04            | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831482)                          |
| Ubuntu 16.10            | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?LinkID=831490)                          |

## Installation from a binary archive

When using binary archives to install, we recommend the contents be extracted to /opt/dotnet and a symbolic link created for dotnet. If an earlier release of .NET Core is already installed, the directory and symbolic link may already exist.

```bash
sudo mkdir -p /opt/dotnet
sudo tar zxf [tar.gz filename] -C /opt/dotnet
sudo ln -s /opt/dotnet/dotnet /usr/local/bin
```