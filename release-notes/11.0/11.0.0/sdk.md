# SDK in .NET 11 - Release Notes

The .NET 11 SDK includes a CLI responsiveness improvement, a Hot Reload fix, and updated Native AOT publishing defaults.

For features introduced throughout the release, see [What's new in the .NET 11 SDK](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/sdk).

- [Breaking changes and migration](#breaking-changes-and-migration)
- [Updating from previews and release candidates](#updating-from-previews-and-release-candidates)
- [Shorter telemetry waits when CLI commands exit](#shorter-telemetry-waits-when-cli-commands-exit)
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

## Shorter telemetry waits when CLI commands exit

Local CLI commands limit the time spent flushing telemetry at exit, avoiding long waits for network uploads under the default local telemetry configuration. This addresses multi-second exit delays affecting short commands and builds. CI and explicitly configured OpenTelemetry exporters retain their separate flushing behavior ([dotnet/sdk#56863](https://github.com/dotnet/sdk/pull/56863)).

No project changes or opt-in are required.

## Bug fixes

### Hot Reload

- [Restore automatic browser refresh for static SSR pages in Blazor Web apps using WebAssembly or Auto interactivity](https://github.com/dotnet/sdk/pull/56691)

### Tools

- [Prevent races between concurrent tool installations, updates, and removals](https://github.com/dotnet/sdk/pull/51834)

<!-- CLI invocation and default/explicit-opt-in property evaluation verified with the supplied local SDK 11.0.100. This does not establish publish performance or correlation with the final public GA artifact. -->
