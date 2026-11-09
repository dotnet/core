# SDK in .NET 11 - Release Notes

The .NET 11 SDK includes a Hot Reload fix, updated Native AOT publishing defaults, and a fix to how tool installation works under concurrent use.

For features introduced throughout the release, see [What's new in the .NET 11 SDK](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/sdk).

- [Breaking changes and migration](#breaking-changes-and-migration)
- [Updating from previews and release candidates](#updating-from-previews-and-release-candidates)
- [Bug fixes](#bug-fixes)

## Breaking changes and migration

Before upgrading an existing app, review [Breaking changes in .NET 11](https://learn.microsoft.com/dotnet/core/compatibility/11).

### Updating from previews and release candidates

Optimized Native AOT publishing is opt-in in .NET 11. Unlike RC3, `UseOptimizedPublish` defaults to `false` for Native AOT projects, restoring the full build target chain and its build hooks. Leave the default in place if your project depends on that behavior. To explicitly opt in to optimized publishing, add the following properties to your project ([dotnet/sdk#56661](https://github.com/dotnet/sdk/pull/56661)):

```xml
<PropertyGroup>
  <PublishAot>true</PublishAot>
  <UseOptimizedPublish>true</UseOptimizedPublish>
</PropertyGroup>
```
## Bug fixes

### Hot Reload

- [Restore automatic browser refresh for static SSR pages in Blazor Web apps using WebAssembly or Auto interactivity](https://github.com/dotnet/sdk/pull/56691)

### Tools

- [Prevent races between concurrent tool installations, updates, and removals](https://github.com/dotnet/sdk/pull/51834)
