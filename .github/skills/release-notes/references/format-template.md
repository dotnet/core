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

## Breaking changes

- Short migration note or heads-up for narrower changes that users may need to react to

## Bug fixes

- **Category** — Fix description

## Community contributors

- [@username](https://github.com/username)
```

### README.md (index file)

The README.md links to all component files and includes the general docs link. Component files do NOT include the general "What's new" link — that goes in the README only.

```markdown
# .NET <VERSION> <PREVIEW> - Release Notes

- [Libraries](libraries.md)
- [Runtime](runtime.md)
- [ASP.NET Core](aspnetcore.md)
...

.NET <VERSION> updates:

- [What's new in .NET <VERSION>](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-<version>/overview)

## Release information

| | Version |
| --- | --- |
| Runtime | <runtime-version> |
| SDK | <sdk-version> |

### VMR refs

These release notes were generated from the [dotnet/dotnet](https://github.com/dotnet/dotnet) VMR:

- **Base**: [`<base-tag>`](https://github.com/dotnet/dotnet/tree/<base-tag>)
- **Head**: [`<head-branch>`](https://github.com/dotnet/dotnet/tree/<head-branch>)
```

Read the runtime version, SDK version, base ref, and head ref from `build-metadata.json`.

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
5. **Breaking changes near the end** — low-score entries with `breaking_changes: true` usually belong in a short section before Bug fixes, not as full feature sections. In preview notes this section is also the upgrade guidance for readers coming from the previous preview — see below
6. **Preview feature callout** — when a feature is listed in `release-notes/features.json`, start its section with the standard blockquote callout from that file

## Breaking changes

Preview notes are read mostly by people who are already running the *previous* preview. For them the
most valuable content is often not the new feature, but the thing that stops their existing code
from building or working after they move to this build.

Because each preview's Breaking changes section covers what changed *in that milestone*, it is
already the preview-to-preview upgrade story. Write it for the reader doing that upgrade rather than
as an abstract list of incompatibilities with the last GA release.

Cover these when they apply. They tend to surface only when an existing project is actually upgraded
to the new build, which is one of the reasons
[`validate-code-samples`](../../validate-code-samples/SKILL.md) runs against a maintained sample set:

- **Renamed APIs**, especially renames that invert meaning (`EnableX` becoming `DisableX`). Show the
  before and after, and state the new default explicitly.
- **New analyzer diagnostics that fire on previously clean code.** Code that built without warnings
  on the last preview and now reports diagnostics is an upgrade issue even though nothing in the
  user's code changed. Name the diagnostic IDs.
- **Changed defaults**, where existing code keeps compiling but behaves differently.

**Removed or replaced workarounds** are the one upgrade item that is not a breaking change. If a bug
that required a workaround is now fixed, say so with the fix in Bug fixes, so users can delete the
workaround rather than carrying it forward.

Do not turn this into a changelog of everything that moved. Include an item only when a user
upgrading from the previous preview would otherwise hit a build error, a new warning, or a silent
behavior change.

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
