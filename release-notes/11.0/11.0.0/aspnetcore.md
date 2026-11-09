# ASP.NET Core in .NET 11 - Release Notes

The final ASP.NET Core updates for .NET 11 focus on quality and stability.

For features introduced throughout the release, see [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11?view=aspnetcore-11.0).

## Bug fixes

### Data Protection

- [Reduce managed encryption and decryption allocations for SHA-256 and SHA-512 validation](https://github.com/dotnet/aspnetcore/pull/69789)

### Validation

- [Validate attributes on active union cases in MVC](https://github.com/dotnet/aspnetcore/pull/69834)
- [Honor skipped validation and traverse union cases in Minimal API collections](https://github.com/dotnet/aspnetcore/pull/69870)

### Hosting and caching

- [Honor custom output-cache policies that explicitly allow already-authenticated users](https://github.com/dotnet/aspnetcore/pull/69580)
- [Fix first-request HTTP 404 errors for IIS in-process apps hosted in virtual directories](https://github.com/dotnet/aspnetcore/pull/69398)

### SignalR

- [Bind SignalR connection tokens to their originating endpoint mapping, preventing reuse across separately mapped endpoints](https://github.com/dotnet/aspnetcore/pull/69835)

Before upgrading an existing app, review [Breaking changes in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/breaking-changes/11/overview?view=aspnetcore-11.0).

## Community contributors

- [@marcominerva](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Amarcominerva+milestone%3A12.0-preview1)
- [@Souheyl7Gouadria](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3ASouheyl7Gouadria+milestone%3A12.0-preview1)
