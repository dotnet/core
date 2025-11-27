# .NET Release Metadata - Usage Guide

Structured, machine-readable .NET release data optimized for AI assistant consumption.

## Documentation

This usage guide provides an overview. For detailed workflows and field definitions:

- **[quick-ref.md](quick-ref.md)** - Essential workflows, response patterns, and field definitions
- **[llms.txt](../llms.txt)** - Discovery file (root of repo)
- **Glossary**: Available in `index.json` → `glossary` or `release-notes/_glossary.json`

**About link types**: The `index.json` file provides both `-markdown` links (for raw markdown consumption by LLMs) and `-markdown-rendered` links (for web viewing on GitHub). Always follow the appropriate link from `index.json` rather than constructing URLs.

## Quick Start — Choose Your Entry Point

| Query Type | Entry Point | Example |
|------------|-------------|---------|
| Version/patch queries | Version Index | "What CVEs affect .NET 9.0?" |
| Time-based queries | Timeline Index | "What was disclosed in July 2024?" |

**Version Index**: `https://raw.githubusercontent.com/dotnet/core/main/release-notes/index.json`
**Timeline Index**: `https://raw.githubusercontent.com/dotnet/core/main/release-notes/timeline/index.json`

Both indexes cross-link to each other. All resources use HAL+JSON for navigation. Always follow `_links.href` values - never construct URLs manually.

## Required Behaviors

1. **Always use JSON files** over Markdown when available
2. **CVE queries**: Choose entry point based on query type, always offer inline diffs
3. **HAL navigation**: Follow `_links.href`, never construct URLs
4. **GitHub commits**: URLs are `.diff` format for direct analysis
5. **Start responses**: "Here's what I found in .NET release notes..."

## Core Principles

- **JSON-first**: Use `*.json` for authoritative data
- **HAL navigation**: Discover resources via `_links`
- **Embedded data**: Full CVE details are in `_embedded.disclosures[]` — often no extra fetch needed
- **Cross-linked**: Version and timeline indexes link to each other; patch indexes link to month indexes
