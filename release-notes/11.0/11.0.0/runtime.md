# Runtime in .NET 11 - Release Notes

The final runtime updates for .NET 11 focus on quality and stability.

## Bug fixes

### Interoperability

- [Fix spurious abandoned-mutex errors when sharing Unix named mutexes with older .NET processes](https://github.com/dotnet/runtime/pull/134595)
- [Correct invalid values and unexpected exceptions when marshalling arrays to native code](https://github.com/dotnet/runtime/pull/135246)

### Process management

- [Fix hangs when terminating a process tree on macOS](https://github.com/dotnet/runtime/pull/135409)

For features introduced throughout the release, see [What's new in the .NET 11 runtime](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/runtime).

Before upgrading an existing app, review [Breaking changes in .NET 11](https://learn.microsoft.com/dotnet/core/compatibility/11).

## Community contributors

- [@pcshrosbree](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Apcshrosbree)
