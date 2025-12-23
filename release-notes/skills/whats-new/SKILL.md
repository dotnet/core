---
name: whats-new
description: Release highlights, new features, and announcements for .NET versions
workflows: https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/skills/whats-new/workflows.json
---

# What's New Queries

## Workflows

This skill uses the following workflows from `workflows.json`:

| Workflow | Use when |
|----------|----------|
| `whats-new-overview` | General "what's new" for latest release |
| `whats-new-runtime` | JIT, GC, AOT, performance improvements |
| `whats-new-libraries` | BCL, LINQ, JSON, crypto APIs (.NET 9+) |
| `whats-new-sdk` | CLI, MSBuild, tooling changes |
| `release-announcement` | Official blog post URL |

## Stop Criteria

**STOP when you have the manifest.json.** It contains links to "What's New" docs (both raw markdown and HTML) and release blog posts.

## Interpretation

### Quick Answers (from manifest.json)

Once you have `manifest.json._links`:

| Question | Link relation | Type |
|----------|---------------|------|
| What's new overview? | `whats-new` | markdown |
| What's new in runtime? | `whats-new-runtime` | markdown |
| What's new in libraries? | `whats-new-libraries` | markdown |
| What's new in SDK? | `whats-new-sdk` | markdown |
| HTML docs URL? | `whats-new-rendered` | HTML |
| Release announcement? | `release-blog-rendered` | HTML |

### Available Link Relations

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

| Mistake | Correction |
|---------|------------|
| Constructing raw.githubusercontent.com URLs | Follow `_links` from manifest |
| Fetching HTML when markdown available | Use `whats-new` (markdown) for LLM processing |
| Fetching content when URL is enough | If user just needs link, don't fetch the page |
| Looking for `whats-new-libraries` in .NET 8 | .NET 8 has `whats-new-containers` instead |

## Preview Release Notes

Preview manifests contain detailed per-technology what's-new content written by the .NET team during development. This is point-in-time source material that informed the consolidated Learn documentation.

Preview manifest link relations:
- `whats-new-runtime`, `whats-new-libraries`, `whats-new-sdk`
- `whats-new-aspnetcore`, `whats-new-efcore`, `whats-new-csharp`
- `whats-new-fsharp`, `whats-new-dotnetmaui`, `whats-new-winforms`
- `whats-new-wpf`, `whats-new-containers`, `whats-new-visualbasic`

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
