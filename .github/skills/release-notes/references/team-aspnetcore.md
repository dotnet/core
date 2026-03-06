# ASP.NET Core Team Context

Team-specific overrides for generating ASP.NET Core release notes.

## PR Discovery

**Overrides the default label-based approach** in [collect-prs.md](collect-prs.md).

- **Repo**: `dotnet/aspnetcore`
- ASP.NET Core uses **milestones** (e.g., `11.0-preview2`) to organize PRs by release, not area labels.
- Use the `community-contribution` label to identify community contributor PRs.
- Community contributor search uses the milestone query: `?q=is%3Apr+is%3Amerged+milestone%3A<MILESTONE>+author%3Ausername`

## Release Branch Verification

**Overrides the default VMR verification** in [verify-release-branch.md](verify-release-branch.md).

- **Repository**: `dotnet/aspnetcore` (not the VMR)
- **Branch pattern**: `release/<MAJOR>.0-preview<N>` (e.g., `release/11.0-preview2`)
- If a PR merged after the branch cut, look for a **backport PR** with the `Servicing-approved` label. If no backport exists, the feature slips to the next preview.

## Content Rules

### Bug fixes

Include a **Bug fixes** section listing fixes grouped by **product area** (e.g., "Blazor", "Kestrel", "SignalR", "Identity", "IIS"), with each fix as an indented sub-bullet under the area. Credit community contributors inline. Order areas alphabetically.

Example:

```markdown
- **Blazor**
  - Fixed `Label` component `id` attribute generation in interactive render mode ([dotnet/aspnetcore#65263](https://github.com/dotnet/aspnetcore/pull/65263))
  - Fixed `[EditorRequired]` warning incorrectly shown in SSR mode ([dotnet/aspnetcore#65393](https://github.com/dotnet/aspnetcore/pull/65393))
- **Kestrel**
  - Fixed request smuggling mitigation to use `TryAdd()` for `X-Content-Length` header ([dotnet/aspnetcore#65445](https://github.com/dotnet/aspnetcore/pull/65445))
```

### Performance improvements

Include a **Performance improvements** section for major, measurable performance wins (e.g., significant throughput improvements, large allocation reductions). Minor internal optimizations without measurable user impact should be omitted.

## Feature Categorization

Order sections by customer impact, using reaction counts on backing issues as a signal:

- Blazor
- Minimal APIs / OpenAPI
- SignalR
- Identity / Security
- Kestrel / Server
- Templates / Tooling
- Observability

## Format

- **Document title**: `# ASP.NET Core in .NET <VERSION> <PREVIEW> - Release Notes`
- **Intro links**: Include links to the "What's new" docs page and the ASP.NET Core roadmap issue.
