# Format Template

Standard document structure for .NET release notes markdown files.

## Document structure

### Component file

```markdown
# <Component> in .NET <VERSION> <PREVIEW> - Release Notes

.NET <VERSION> <PREVIEW> includes new <Component> features & enhancements:

- [Feature Name](#anchor)
- [Feature Name](#anchor)

## Feature Name

<description> ([<owner>/<repo> #NNNNN](https://github.com/<owner>/<repo>/pull/NNNNN)).

## Breaking changes from .NET <PREVIOUS_MAJOR>

- Migration note for a change affecting apps upgrading from the previous stable .NET release

## Changes since the previous preview

- Migration note for a change to an API or behavior introduced during this major's previews

## Bug fixes

- **Namespace or area**
  - [Cleaned up PR or issue title](https://github.com/<owner>/<repo>/pull/NNNNN)

## Community contributors

- [@username](https://github.com/username)
```

### README.md (index file)

The README.md is the reader-facing index for the milestone. It links to every
component file, groups the links consistently, points to the release downloads,
and provides durable product documentation links. Component files do NOT repeat
these general links.

```markdown
# .NET <VERSION> <MILESTONE> - Release Notes

.NET <VERSION> <MILESTONE> release notes. Find more information on new features released in .NET <VERSION> <MILESTONE> by browsing through the release notes below:

- [Libraries](./libraries.md)
- [Runtime](./runtime.md)
- [SDK](./sdk.md)
- [MSBuild](./msbuild.md)
- [NuGet](./nuget.md)

## Languages

- [C#](./csharp.md)
- [F#](./fsharp.md)
- [Visual Basic](./visualbasic.md)

## Workloads, Libraries, & More

- [.NET MAUI](./dotnetmaui.md)
- [ASP.NET Core](./aspnetcore.md)
- [Container images](./containers.md)
- [EF Core & Data](./efcore.md)
- [Windows Forms](./winforms.md)
- [WPF](./wpf.md)

## Get Started

Instructions on getting started with .NET <VERSION> can be found in the [getting started guide](../../get-started.md). Installers and binaries for .NET <VERSION> <MILESTONE> are available from [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/<version>) and [.NET <VERSION> Releases](../../README.md).

## Stay up-to-date

You can find a detailed overview of all new features in .NET <VERSION>:

- [What's new in C#](https://learn.microsoft.com/dotnet/csharp/whats-new/)
- [What's new in .NET MAUI](https://learn.microsoft.com/dotnet/maui/whats-new/)
- [What's new in Entity Framework Core](https://learn.microsoft.com/ef/core/what-is-new/)
- [What's new in Windows Forms](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/)
- [What's new in WPF](https://learn.microsoft.com/dotnet/desktop/wpf/whats-new/)

The latest .NET <VERSION> release is always available at [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/<version>) and [.NET <VERSION> Releases](../../README.md).
```

Apply these rules when generating the index:

1. Link every component markdown file exactly once. Omit only optional files
   that were not produced, such as `visualbasic.md`.
2. Keep Libraries, Runtime, SDK, MSBuild, and NuGet before the grouped sections.
3. Use **Languages** for language release notes and
   **Workloads, Libraries, & More** for application frameworks, workloads,
   container images, and desktop frameworks.
4. If the artifacts-publishing automation has already created the milestone
   landing page, link to it directly from **Get Started**. Otherwise, use the
   general download page and version release index shown in the template; do
   not create or link to a landing page that does not exist yet.
5. Keep the reader-facing index focused on navigation and documentation. Store
   runtime/SDK versions and VMR base/head refs in `build-metadata.json`; do not
   expose release-notes generation provenance in README.md.
6. Use the stable documentation entry points shown in the template. Do not
   guess milestone-specific documentation URLs that might not exist yet.

### Component-specific docs links

Some components have their own "What's new" page on learn.microsoft.com. Include these in the relevant component file when they exist. Discover them from the docs overview source:

`https://github.com/dotnet/docs/raw/refs/heads/main/docs/core/whats-new/dotnet-{major}/overview.md`

Known component docs links:

| Component | Docs URL |
| --------- | -------- |
| Runtime | `https://learn.microsoft.com/dotnet/core/whats-new/dotnet-{major}/runtime` |
| Libraries | `https://learn.microsoft.com/dotnet/core/whats-new/dotnet-{major}/libraries` |
| SDK | `https://learn.microsoft.com/dotnet/core/whats-new/dotnet-{major}/sdk` |
| ASP.NET Core | `https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-{major}` |
| C# | `https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-{lang-version}` |
| EF Core | `https://learn.microsoft.com/ef/core/what-is-new/ef-core-{major}.0/whatsnew` |

## Section rules

1. **TOC at top** — every feature gets a linked entry
2. **One paragraph of context** — what the feature does and why it matters in concrete terms, with PR/issue links; avoid inferred feelings or marketing-style claims
3. **Code sample** — show the feature in use
4. **Feature ordering** — highest customer impact first
5. **Upgrade guidance near the end** — keep version-to-version breaking changes separate from changes affecting only preview users. `breaking_changes: true` flags migration significance, not which section an item belongs in; see below.
6. **Preview feature callout** — when a feature is listed in `release-notes/features.json`, start its section with the standard blockquote callout from that file

## Upgrade guidance

Use **Breaking changes from .NET N** (where N is the previous stable major version) for changes that affect code or behavior from that release. Keep these visible in preview notes and make sure they are covered in the new version's aggregate compatibility documentation. State which preview introduced the change and link the published breaking-change guidance when available; a preview note alone is not the aggregate documentation.

Use **Changes since the previous preview** for migrations that only affect code written against this major's earlier previews or RCs. For an RC, compare against the preceding prerelease, including an earlier RC. Name the old and new behavior and the affected preview or RC. Do not carry preview-only churn into the version-to-version breaking-change list. Omit either section when it has no entries.

The [incremental API diff](api-verification.md#review-incremental-api-diffs-for-preview-upgrades) and maintained samples can reveal migration candidates, but do not determine which baseline they break.

Cover these when they apply. They tend to surface only when an existing project is actually upgraded
to the new build, which is one of the reasons
[`validate-code-samples`](../../validate-code-samples/SKILL.md) upgrades the component's maintained sample set under `release-notes/<major>.0/samples/<component>/`:

- **Renamed APIs**, especially renames that invert meaning (`EnableX` becoming `DisableX`). Show the
  before and after, and state the new default explicitly.
- **New analyzer diagnostics that fire on previously clean code.** Code that built without warnings
  on the last preview and now reports diagnostics is an upgrade issue even though nothing in the
  user's code changed. Name the diagnostic IDs.
- **Changed defaults**, where existing code keeps compiling but behaves differently.

**Removed or replaced workarounds** are the one upgrade item that is not a breaking change. If a bug
that required a workaround is now fixed, say so with the fix in Bug fixes, so users can delete the
workaround rather than carrying it forward.

Do not turn this into a changelog of everything that moved. Include an item when a user upgrading
from the previous stable release or preview would otherwise hit a build error, a new warning, or a
silent behavior change.

Attribute these to the milestone that actually changed them. A fix that shipped two previews ago is
not upgrade guidance for this one — see
[api-verification.md](api-verification.md) for the provenance rule.

## Issue and PR references

Always use markdown links with the `{org}/{repo} #{number}` format, with a space before `#`:

- ✅ `[dotnet/runtime #124264](https://github.com/dotnet/runtime/pull/124264)`
- ❌ `dotnet/runtime#124264` (wrong spacing and bare reference)

## Minimal stub

For components with no noteworthy changes:

```markdown
# <Component> in .NET <VERSION> <PREVIEW> - Release Notes

There are no new features or improvements in <Component> in this release.
```

## Example entry

```markdown
## Finding Certificates By Thumbprints Other Than SHA-1

A new method on `X509Certificate2Collection` accepts the name of the hash algorithm to use
for thumbprint matching ([dotnet/runtime #NNNNN](https://github.com/dotnet/runtime/pull/NNNNN)).
```

Preview-feature example:

```markdown
## Unsafe Evolution remains a preview feature in .NET 11

> This is a preview feature for .NET 11.

Preview 3 adds clearer language-version errors for updated memory-safety rules...
```

Code sample example:

```csharp
X509Certificate2Collection coll = store.Certificates.FindByThumbprint(
    HashAlgorithmName.SHA256, thumbprint);
return coll.SingleOrDefault();
```
