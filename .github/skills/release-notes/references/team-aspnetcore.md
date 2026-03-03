# ASP.NET Core Team Context

Team-specific overrides and instructions for generating ASP.NET Core release notes.

## Repository

- **Repo**: `dotnet/aspnetcore`
- **Release branch pattern**: `release/11.0-preview2` (not the VMR `release/<MAJOR>.0.1xx-<prerelease>` pattern)

## PR Discovery

ASP.NET Core uses **milestones** (e.g., `11.0-preview2`) to organize PRs by release, not area labels. To collect candidate PRs:

1. Search for merged PRs in `dotnet/aspnetcore` with the target milestone (e.g., `milestone:11.0-preview2 is:merged`).
2. Filter out infrastructure, dependency updates, backports, test-only, and build changes.
3. Use the `community-contribution` label to identify community contributor PRs.

Do NOT use area-label-scoped searches as described in `collect-prs.md` — those are Libraries-specific.

## Content Rules

### No bug fixes

ASP.NET Core release notes should NOT include bug fixes. Fixing bugs in existing functionality is assumed. The release notes focus exclusively on new capabilities and functionality.

A good rule of thumb: if a PR fixes a behavior that was supposed to work already (even if the fix is important), it does not belong in the release notes. Examples of bug fixes to exclude:

- Fixing a method that bypassed expected checks
- Fixing attribute generation that only failed in certain render modes
- Fixing compatibility issues between SDK versions
- Fixing a property that wasn't set in certain environments

### No internal implementation details

Do not include internal performance optimizations or implementation changes where no user action or new API is involved. Examples to exclude:

- Internal parser changes that improve throughput
- Object pooling for internal streams
- Using `TryAdd` instead of `Add` in internal code paths

### Partial features

If part of a feature lands in a release but it's not ready for users to try out, hold off on documenting it until it's in a more complete form. Check with the team if uncertain.

### Required content per feature

Every feature entry MUST include:

1. **Why** — What problem does this solve? What scenario does it enable?
2. **How** — A code sample showing how to use the feature. If a feature cannot be demonstrated with a code sample, reconsider whether it's user-facing enough for release notes.
3. **Learn more** — Link to the backing issue (if one exists) for details. However, do not clutter the release notes with links — only include issue links when they provide significant additional context beyond what's in the release notes entry itself.

Keep entries concise — link to docs for full details rather than documenting every option.

### No PR links

Do NOT include PR links in ASP.NET Core release notes. Features often span multiple PRs, so linking a single PR is misleading. Issue links are optional — only include them when they provide meaningful additional context.

## Feature Categorization

ASP.NET Core features typically fall into these categories. Order sections by customer impact within the release notes, using reaction counts on backing issues as a signal:

- Blazor
- Minimal APIs / OpenAPI
- SignalR
- Identity / Security
- Kestrel / Server
- Templates / Tooling
- Observability

## Community Contributors

### Inline attribution

When a documented feature was contributed by a community member (identified by the `community-contribution` label), thank them inline at the end of that feature's section:

```markdown
Thank you [@username](https://github.com/username) for this contribution!
```

### Community contributors section

Include a "Community contributors" section at the bottom of the release notes listing ALL external contributors for the milestone — not just those who contributed documented features. This includes contributors whose PRs were bug fixes, test improvements, or other changes that aren't in the release notes.

To build this list, search for all merged PRs with the `community-contribution` label in the milestone. List contributors alphabetically with links to their milestone PRs:

```markdown
## Community contributors

Thank you contributors! ❤️

- [@username](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A<MILESTONE>+author%3Ausername)
```

## Release Branch Verification

The release branch for ASP.NET Core is in `dotnet/aspnetcore` (not the VMR). The branch name follows the pattern `release/<MAJOR>.0-preview<N>` (e.g., `release/11.0-preview2`).

When verifying features are in the release:

1. Check that the PR merged to `main` before the branch cut date.
2. If the PR merged after the branch cut, look for a **backport PR** targeting the release branch. Backport PRs with the `Servicing-approved` label indicate the change will ship.
3. If no backport exists, the feature will slip to the next preview — do not include it in the release notes.

## Format

Follow the general format template from `format-template.md` with these overrides:

- **Document title**: `# ASP.NET Core in .NET <VERSION> <PREVIEW> - Release Notes`
- **Intro links**: Include links to both the "What's new" docs page and the ASP.NET Core roadmap issue.
- **PR link format**: Do NOT link to individual PRs. Issue links are optional — only include them when they add meaningful context beyond the release notes text itself.

Example header:

```markdown
# ASP.NET Core in .NET 11 Preview 2 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Feature Name](#feature-name)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11) documentation.
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/NNNNN)
```
