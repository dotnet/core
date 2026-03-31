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

<description> ([<owner>/<repo>#NNNNN](https://github.com/<owner>/<repo>/pull/NNNNN)).

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
```

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
2. **One paragraph of context** — what the feature does and why it matters, with PR/issue links
3. **Code sample** — show the feature in use
4. **Feature ordering** — highest customer impact first

## Issue and PR references

Always use markdown links with the `{org}/{repo}#{number}` format:

- ✅ `[dotnet/runtime#124264](https://github.com/dotnet/runtime/pull/124264)`
- ❌ `dotnet/runtime#124264` (bare reference)

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
for thumbprint matching ([dotnet/runtime#NNNNN](https://github.com/dotnet/runtime/pull/NNNNN)).
```

Code sample example:

```csharp
X509Certificate2Collection coll = store.Certificates.FindByThumbprint(
    HashAlgorithmName.SHA256, thumbprint);
return coll.SingleOrDefault();
```
