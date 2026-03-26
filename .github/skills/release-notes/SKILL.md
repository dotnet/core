---
name: release-notes
description: Generate and maintain .NET release notes. Uses the VMR source-manifest.json and dotnet-release tool to identify what shipped, then writes curated markdown for high-value features. Designed to run as a cron-driven agentic workflow that maintains PR branches per release milestone.
compatibility: Requires GitHub MCP server or gh CLI for cross-repo queries. Uses dotnet-release generate changes for structured change data.
---

# .NET Release Notes

Generate and maintain release notes for .NET preview, RC, and GA releases.

## How it works

1. The `dotnet-release generate changes` tool diffs `source-manifest.json` between VMR release refs to produce `changes.json` — a comprehensive manifest of all PRs/commits that shipped
2. The agent reads `changes.json` and writes curated markdown release notes for high-value features
3. Output is one PR per release milestone in dotnet/core, maintained incrementally

## Reference documents

- [quality-bar.md](references/quality-bar.md) — what good release notes look like
- [vmr-structure.md](references/vmr-structure.md) — VMR branches, tags, source-manifest.json
- [changes-schema.md](references/changes-schema.md) — the changes.json schema
- [component-mapping.md](references/component-mapping.md) — components, product slugs, output files
- [format-template.md](references/format-template.md) — markdown document structure
- [editorial-rules.md](references/editorial-rules.md) — tone, attribution, naming
