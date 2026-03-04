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

**Exception — preview feedback fixes:** Bug fixes or behavior changes made in response to community feedback on a previous preview ARE included. See the standard [preview-to-preview feedback fixes](editorial-rules.md#preview-to-preview-feedback-fixes) criteria. These show that the preview process is working and the team is responsive to feedback.

A good rule of thumb: if a PR fixes a behavior that was supposed to work already in a *released* version (even if the fix is important), it does not belong in the release notes. But if a community member reported the issue against a *preview* and the team responded, that's worth calling out. Examples of bug fixes to exclude:

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

Follow the standard [required content per feature](format-template.md#required-content-per-feature) rules. No team-specific overrides.

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

Follow the standard [community contributors](editorial-rules.md#community-contributors) rules for inline attribution and the community contributors section.

**Team-specific details:**

- Use the **milestone** (e.g., `milestone:11.0-preview2`) when searching for community contributor PRs, since ASP.NET Core organizes by milestone rather than date ranges.
- The contributor list link format uses the milestone query: `?q=is%3Apr+is%3Amerged+milestone%3A<MILESTONE>+author%3Ausername`

## Release Branch Verification

**Overrides the default VMR verification** in [verify-release-branch.md](verify-release-branch.md).

- **Repository**: `dotnet/aspnetcore` (not the VMR)
- **Branch pattern**: `release/<MAJOR>.0-preview<N>` (e.g., `release/11.0-preview2`)

**Verification steps:**

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
