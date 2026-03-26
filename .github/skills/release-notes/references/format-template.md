# Format Template

Standard document structure for .NET release notes markdown files.

## Document structure

```markdown
# <Component> in .NET <VERSION> <PREVIEW> - Release Notes

.NET <VERSION> <PREVIEW> includes new <Component> features & enhancements:

- [Feature Name](#anchor)
- [Feature Name](#anchor)

<Component> updates in .NET <VERSION>:

- [What's new in .NET <VERSION>](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-<version>/overview) documentation

## Feature Name

<description> ([<owner>/<repo>#NNNNN](https://github.com/<owner>/<repo>/pull/NNNNN)).

## Bug fixes

- **Category** — Fix description

## Community contributors

- [@username](https://github.com/username)
```

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
