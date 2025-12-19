---
name: whats-new
description: Release highlights, new features, and announcements for .NET versions
---

# What's New Queries

## Stop Criteria

**STOP when you have the manifest.json.** It contains links to "What's New" docs and release blog posts. These are `-rendered` links (HTML pages)—fetch only if you need to summarize content.

## Quick Answers (from manifest.json)

Once you have `manifest.json._links`:

- What's new docs URL? → `whats-new-rendered.href`
- Release announcement URL? → `release-blog-rendered.href`
- Downloads page? → `downloads-rendered.href`

## Navigation Flow (2 fetches for URLs, 3 to read content)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► _links["release-manifest"]
            │
            ▼
        manifest.json
            │
            ├─► _links["whats-new-rendered"] ─► Microsoft Learn (HTML)
            │
            └─► _links["release-blog-rendered"] ─► DevBlogs announcement (HTML)
```

## Common Queries

### What's new in .NET X? (2-3 fetches)

1. `llms.json` → find version in `_embedded.latest_patches[]`
2. Follow `_links["release-manifest"]` → manifest.json
3. Return `whats-new-rendered.href` or fetch and summarize

### Release announcement for .NET X? (2-3 fetches)

Same path, use `release-blog-rendered.href`

## Available Links

| Relation | Content |
|----------|---------|
| `whats-new-rendered` | Microsoft Learn "What's New" overview |
| `release-blog-rendered` | DevBlogs release announcement |
| `compatibility` | Breaking changes JSON (see breaking-changes skill) |
| `compatibility-rendered` | Breaking changes HTML view |
| `downloads-rendered` | .NET download page |
| `usage-markdown-rendered` | Runtime/SDK usage guidance |

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| Looking for raw markdown | Only `-rendered` (HTML) versions exist for announcements |
| Constructing docs.microsoft.com URLs | Follow `_links` from manifest |
| Fetching HTML when URL is enough | If user just needs link, don't fetch the page |

## Tips

- `-rendered` links are HTML (human-friendly), not raw data
- `whats-new-rendered` has comprehensive feature overview
- `release-blog-rendered` has highlights and context
- For LLM summarization, fetch the HTML and extract key points
