# Release Notes Format Template

The release notes must mirror the style of the official .NET Preview release notes (e.g. `.NET 10 Preview 1`).

## Document Structure

```markdown
# .NET Libraries in .NET <VERSION> <PREVIEW> - Release Notes

.NET <VERSION> <PREVIEW> includes new .NET Libraries features & enhancements:

- [Feature Name](#anchor)
- [Feature Name](#anchor)
...

.NET Libraries updates in .NET <VERSION>:

- [What's new in .NET <VERSION>](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-<version>/overview) documentation

## Feature Name

[<owner>/<repo>#NNNNN](https://github.com/<owner>/<repo>/pull/NNNNN) <one-paragraph description>.

```csharp
// Code example or API signature
```
```

## Issue and PR References

Use the format `{org}/{repo}#{number}` — no space before the `#` character. Always wrap references in markdown links that expand to the full `github.com` URL, since the release notes are published to a non-GitHub website where auto-linking is not available.

- ✅ `[dotnet/runtime#124264](https://github.com/dotnet/runtime/pull/124264)`
- ✅ `[dotnet/runtime#118468](https://github.com/dotnet/runtime/issues/118468)`
- ❌ `[dotnet/runtime #124264](https://github.com/dotnet/runtime/pull/124264)` (space before `#`)
- ❌ `dotnet/runtime#124264` (bare reference without markdown link)

1. **TOC at top** — Every feature gets a linked entry in the table of contents.
2. **PR link first** — Each section opens with a link to the PR.
3. **One paragraph of context** — What the feature does and why it matters.
4. **API signature** — Show the new public API surface in a `csharp` code block.
5. **Usage example** — A short, runnable code snippet showing the feature in action.
6. **Benchmark summary** (if applicable) — State what was measured and the speedup range. Do NOT embed full BenchmarkDotNet tables.

## Example Section

```markdown
## Finding Certificates By Thumbprints Other Than SHA-1

[<owner>/<repo>#NNNNN](https://github.com/<owner>/<repo>/pull/NNNNN) introduces a new method
that accepts the name of the hash algorithm to use for matching, since SHA-2-256 and SHA-3-256
have the same lengths and making the Find method match any vaguely matching thumbprint was not ideal.

\```csharp
X509Certificate2Collection coll = store.Certificates.FindByThumbprint(
    HashAlgorithmName.SHA256, thumbprint);
return coll.SingleOrDefault();
\```
```
