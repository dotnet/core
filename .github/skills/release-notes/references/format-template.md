# Release Notes Format Template

The release notes must mirror the style of the official .NET Preview release notes.

## Document structure

```markdown
# <Product> in .NET <VERSION> <PREVIEW> - Release Notes

.NET <VERSION> <PREVIEW> includes new <Product> features & enhancements:

- [Feature Name](#anchor)
- [Feature Name](#anchor)
...

<Product> updates in .NET <VERSION>:

- [What's new in .NET <VERSION>](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-<version>/overview) documentation

## Feature Name

<one-paragraph description> ([<owner>/<repo>#NNNNN](https://github.com/<owner>/<repo>/pull/NNNNN)).

```csharp
// Code example or API signature
```

## Bug fixes

<grouped bug fix summary — see [editorial-rules.md](editorial-rules.md#bug-fix-summary)>

## Community contributors

<list of external contributors — see [editorial-rules.md](editorial-rules.md#community-contributors-section)>
```

The `<Product>` name comes from the component name (e.g., ".NET Libraries", "ASP.NET Core", ".NET SDK"). Team context files may override the document title.

## Issue and PR references

Use the format `{org}/{repo}#{number}`. Always wrap references in markdown links:

- ✅ `[dotnet/runtime#124264](https://github.com/dotnet/runtime/pull/124264)`
- ✅ `[dotnet/runtime#118468](https://github.com/dotnet/runtime/issues/118468)`
- ❌ `dotnet/runtime#124264` (bare reference without link)

Link to PRs and issues naturally within the description text.

## Section rules

1. **TOC at top** — every feature gets a linked entry
2. **One paragraph of context** — what the feature does and why it matters, with PR/issue links
3. **API signature** — show new public API surface in a `csharp` code block
4. **Usage example** — a short, runnable code snippet
5. **Benchmark summary** (if applicable) — state what was measured and the speedup range

## Required content per feature

Every feature entry MUST include:

1. **Why** — what problem does this solve? What scenario does it enable?
2. **How** — a code sample showing usage. If a feature cannot be demonstrated with code, reconsider whether it is user-facing enough for release notes.
3. **Learn more** — link to the backing issue or PR for additional details

## Minimal stub format

For components with no meaningful changes:

```markdown
# <Component> in .NET <VERSION> <PREVIEW> - Release Notes

There are no new features or improvements in <Component> in this release.
```

## Example section

```markdown
## Finding Certificates By Thumbprints Other Than SHA-1

A new method on `X509Certificate2Collection` accepts the name of the hash algorithm to use
for thumbprint matching ([dotnet/runtime#NNNNN](https://github.com/dotnet/runtime/pull/NNNNN)).
Since SHA-2-256 and SHA-3-256 have the same lengths, matching any vaguely similar thumbprint
was not ideal.

\```csharp
X509Certificate2Collection coll = store.Certificates.FindByThumbprint(
    HashAlgorithmName.SHA256, thumbprint);
return coll.SingleOrDefault();
\```
```
