---
name: whats-new
description: Release highlights, new features, and announcements for .NET versions
workflows: https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/whats-new/workflows.json
---

# What's New Queries

## First: Which Content?

| Need | Link relation | Type |
| ---- | ------------- | ---- |
| Overview | `whats-new` | markdown |
| Runtime (JIT, GC, AOT) | `whats-new-runtime` | markdown |
| Libraries (BCL, LINQ) | `whats-new-libraries` | markdown |
| SDK/tooling | `whats-new-sdk` | markdown |
| Announcement blog | `release-blog-html` | HTML |

## Quick Answers

From `manifest.json._links`:

- What's new overview? → `whats-new`
- Runtime improvements? → `whats-new-runtime`
- Library additions? → `whats-new-libraries`
- Release blog URL? → `release-blog-html`

## Stop Criteria

**STOP when you have manifest.json.** It contains links to all "What's New" docs. Only fetch the markdown if you need content.

## Workflows

```json
"whats-new-overview": {
  "follow_path": ["kind:llms", "patches.{version}", "major-manifest", "whats-new"],
  "destination_kind": "markdown",
  "yields": "markdown"
}
```

```json
"whats-new-by-area": {
  "follow_path": ["kind:manifest"],
  "select_link": ["whats-new-{area}"],
  "yields": "url"
}
```

**Example:** Get runtime improvements for .NET 10:

```text
manifest.json._links["whats-new-runtime"].href
→ fetch raw markdown for JIT, GC, AOT details
```

All workflows: <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/whats-new/workflows.json>

## External Schema: manifest.json

| Link relation | Content | Type |
| ------------- | ------- | ---- |
| `whats-new` | Overview of new features | markdown |
| `whats-new-runtime` | Runtime improvements | markdown |
| `whats-new-libraries` | Library additions (.NET 9+) | markdown |
| `whats-new-sdk` | SDK and tooling changes | markdown |
| `whats-new-html` | Microsoft Learn overview | HTML |
| `release-blog-html` | DevBlogs announcement | HTML |

**Note:** .NET 8 has `whats-new-containers` instead of `whats-new-libraries`.

## Common Mistakes

| Mistake | Correction |
| ------- | ---------- |
| Constructing URLs | Follow `_links` from manifest |
| Fetching HTML when markdown available | Use markdown links for LLM processing |
| Fetching content when URL is enough | If user just needs link, don't fetch |
| Looking for `whats-new-libraries` in .NET 8 | Use `whats-new-containers` for .NET 8 |

## Tips

- Raw markdown links are LLM-friendly; `-html` links are for humans
- For summarization, prefer raw markdown over HTML
- `release-blog-html` has high-level highlights and context
