---
name: whats-new
description: Release highlights, new features, and announcements for .NET versions
---

# What's New Queries

## Stop Criteria

**STOP when you have the manifest.json.** It contains links to "What's New" docs (both raw markdown and HTML) and release blog posts.

## Quick Answers (from manifest.json)

Once you have `manifest.json._links`:

- What's new overview? → `whats-new.href` (raw markdown, LLM-friendly)
- What's new in runtime? → `whats-new-runtime.href`
- What's new in libraries? → `whats-new-libraries.href` (.NET 9+)
- What's new in SDK? → `whats-new-sdk.href`
- HTML docs URL? → `whats-new-rendered.href`
- Release announcement URL? → `release-blog-rendered.href`

## Navigation Flow (2 fetches for URLs, 3 to read content)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► _links["release-manifest"]
            │
            ▼
        manifest.json
            │
            ├─► _links["whats-new"] ─► Raw markdown overview (LLM-friendly)
            ├─► _links["whats-new-runtime"] ─► Runtime features markdown
            ├─► _links["whats-new-libraries"] ─► Libraries features markdown
            ├─► _links["whats-new-sdk"] ─► SDK features markdown
            │
            ├─► _links["whats-new-rendered"] ─► Microsoft Learn (HTML)
            └─► _links["release-blog-rendered"] ─► DevBlogs announcement (HTML)
```

## Common Queries

### What's new in .NET X? (2-3 fetches)

1. `llms.json` → find version in `_embedded.latest_patches[]`
2. Follow `_links["release-manifest"]` → manifest.json
3. Follow `_links["whats-new"]` for raw markdown, or return `whats-new-rendered.href` for HTML link

### Runtime/Libraries/SDK details? (3 fetches)

Same path, then follow the specific link:
- `whats-new-runtime` — JIT, GC, AOT, performance improvements
- `whats-new-libraries` — BCL, LINQ, JSON, crypto APIs (.NET 9+)
- `whats-new-sdk` — CLI, MSBuild, tooling, templates

### Release announcement for .NET X? (2-3 fetches)

Same path, use `release-blog-rendered.href`

## Available Links

| Relation | Content | Type |
|----------|---------|------|
| `whats-new` | Overview of new features | markdown |
| `whats-new-runtime` | Runtime improvements | markdown |
| `whats-new-libraries` | Library additions (.NET 9+) | markdown |
| `whats-new-sdk` | SDK and tooling changes | markdown |
| `whats-new-containers` | Container improvements (.NET 8 only) | markdown |
| `whats-new-rendered` | Microsoft Learn overview | HTML |
| `release-blog-rendered` | DevBlogs announcement | HTML |
| `downloads-rendered` | .NET download page | HTML |

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| Constructing raw.githubusercontent.com URLs | Follow `_links` from manifest |
| Fetching HTML when markdown available | Use `whats-new` (markdown) for LLM processing |
| Fetching content when URL is enough | If user just needs link, don't fetch the page |
| Looking for `whats-new-libraries` in .NET 8 | .NET 8 has `whats-new-containers` instead |

## Preview Release Notes

Preview manifests contain detailed per-technology what's-new content written by the .NET team during development. This is point-in-time source material that informed the consolidated Learn documentation.

```
10.0/preview/preview1/manifest.json
    │
    ├─► whats-new-runtime
    ├─► whats-new-libraries
    ├─► whats-new-sdk
    ├─► whats-new-aspnetcore
    ├─► whats-new-efcore
    ├─► whats-new-csharp
    ├─► whats-new-fsharp
    ├─► whats-new-dotnetmaui
    ├─► whats-new-winforms
    ├─► whats-new-wpf
    ├─► whats-new-containers
    └─► whats-new-visualbasic
```

Use preview manifests when you need:
- Per-preview changelog of a specific technology
- Original developer-written release notes
- Historical context for when features were introduced

## Tips

- Raw markdown links (`whats-new`, `whats-new-runtime`, etc.) are LLM-friendly
- `-rendered` links are HTML (human-friendly)
- For summarization, prefer raw markdown over HTML
- .NET 8 has containers.md instead of libraries.md
- `release-blog-rendered` has high-level highlights and context
- Preview manifests have granular per-technology release notes
