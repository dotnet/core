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
```

The `<Product>` name comes from the team context (e.g., ".NET Libraries", "ASP.NET Core", "Windows Forms").

## Issue and PR references

Use the format `{org}/{repo}#{number}`. Always wrap references in markdown links that expand to the full `github.com` URL, since the release notes are published to a non-GitHub website where auto-linking is not available.

- ✅ `[dotnet/runtime#124264](https://github.com/dotnet/runtime/pull/124264)`
- ✅ `[dotnet/runtime#118468](https://github.com/dotnet/runtime/issues/118468)`
- ❌ `dotnet/runtime#124264` (bare reference without markdown link)

Link to PRs and issues naturally within the description text. Do not force them into a fixed position.

## Section rules

1. **TOC at top** — Every feature gets a linked entry in the table of contents
2. **One paragraph of context** — What the feature does and why it matters, with PR/issue links woven in naturally
3. **API signature** — Show the new public API surface in a `csharp` code block
4. **Usage example** — A short, runnable code snippet showing the feature in action
5. **Benchmark summary** (if applicable) — State what was measured and the speedup range. Do NOT embed full BenchmarkDotNet tables

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
