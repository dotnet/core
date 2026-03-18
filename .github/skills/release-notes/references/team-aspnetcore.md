# ASP.NET Core Team Context

Editorial and categorization overrides for ASP.NET Core release notes.

## Product

- **Product name**: ASP.NET Core
- **Component file**: `aspnetcore.md`
- **Source repo**: `dotnet/aspnetcore`
- **VMR path**: `src/aspnetcore/`
- **Document title**: `# ASP.NET Core in .NET <VERSION> <PREVIEW> - Release Notes`

## PR Search Strategy

When searching `dotnet/aspnetcore` for candidate PRs, use **milestones** (e.g., `11.0-preview2`) instead of area labels:

```
search_pull_requests(
  owner: "dotnet",
  repo: "aspnetcore",
  query: "is:merged milestone:<MAJOR>.0-preview<N>",
  perPage: 30
)
```

Use the `community-contribution` label to identify community contributor PRs. Community contributor search uses the milestone query: `?q=is%3Apr+is%3Amerged+milestone%3A<MILESTONE>+author%3Ausername`

## Content Rules

### Bug fixes

Include a **Bug fixes** section grouped by **product area** (e.g., "Blazor", "Kestrel", "SignalR", "Identity", "IIS"), not by namespace. Each fix is an indented sub-bullet under the area. Credit community contributors inline. Order areas alphabetically.

### Performance improvements

Include a **Performance improvements** section for major, measurable performance wins. Omit minor internal optimizations without measurable user impact.

## Feature Categorization

Order sections by customer impact:

- Blazor
- Minimal APIs / OpenAPI
- SignalR
- Identity / Security
- Kestrel / Server
- Templates / Tooling
- Observability

## Format

- **Intro links**: Include links to the "What's new" docs page and the ASP.NET Core roadmap issue.

## Example Release Notes

- `release-notes/11.0/preview/preview1/aspnetcore.md`
- `release-notes/10.0/preview/preview1/aspnetcore.md`
