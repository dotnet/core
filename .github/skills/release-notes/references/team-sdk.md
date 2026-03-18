# .NET SDK Team Context

Editorial and categorization overrides for .NET SDK release notes.

## Product

- **Product name**: .NET SDK
- **Component file**: `sdk.md`
- **Source repo**: `dotnet/sdk` (enrichment), `dotnet/dotnet` (VMR, primary)
- **VMR path**: `src/sdk/`

## PR Search Strategy

The SDK is developed primarily in the VMR (`dotnet/dotnet`). When tracing changes:

1. VMR commits touching `src/sdk/` are the primary candidates
2. Cross-reference with `dotnet/sdk` for PR details, linked issues, and design documents
3. Some PRs originate directly in the VMR — these may not have a corresponding `dotnet/sdk` PR

## Content Rules

Use the strategies outlined in `dotnet/sdk`'s own release notes guidance for team-specific categorization and formatting, if available.

## Example Release Notes

- `release-notes/11.0/preview/preview1/sdk.md`
- `release-notes/10.0/preview/preview1/sdk.md`
