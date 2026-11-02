# SDK updates in .NET 11

For features introduced throughout the release, see [What's new in the .NET 11 SDK](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/sdk).

See the [SDK repository changelog](https://github.com/dotnet/sdk/compare/b370d9f8508baee1ab99f3f8aba8bf5e1dfacf41...93718bf425cb9f28c46b3ed281301dee812ad4ee) for changes since RC3.

Before upgrading an existing app, review [Breaking changes in .NET 11](https://learn.microsoft.com/dotnet/core/compatibility/11).

## Changes for users of earlier release candidates

Optimized Native AOT publishing is opt-in in .NET 11. Unlike RC3, `UseOptimizedPublish` defaults to `false` for Native AOT projects. To opt in, set `UseOptimizedPublish` to `true` ([dotnet/sdk#56661](https://github.com/dotnet/sdk/pull/56661)).

<!-- The default and explicit opt-in were evaluated with the supplied local SDK 11.0.100. Correlation with the final public GA artifact is pending. -->
