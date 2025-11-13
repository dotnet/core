# .NET Release Metadata - Usage Guide

Structured, machine-readable .NET release data optimized for AI assistant consumption.

## Documentation

This usage guide provides an overview. For detailed workflows and field definitions:

- **[quick-ref.md](quick-ref.md)** - Essential workflows and response patterns
- **[glossary.md](glossary.md)** - HAL+JSON terminology and field definitions
- **[llms.txt](../llms.txt)** - Discovery file (root of repo)

**About link types**: The `index.json` file provides both `-markdown-raw` links (for direct markdown consumption by LLMs) and `-markdown` links (for web viewing). Always follow the appropriate link from `index.json` rather than constructing URLs.

## Quick Start

**Entry point**: `https://raw.githubusercontent.com/richlander/core/main/release-notes/index.json`

All resources use HAL+JSON for navigation. Always follow `_links.href` values - never construct URLs manually.

## Required Behaviors

1. **Always use JSON files** over Markdown when available
2. **CVE queries**: Always offer inline diffs after listing CVEs
3. **HAL navigation**: Follow `_links.href`, never construct URLs
4. **GitHub commits**: URLs are `.diff` format for direct analysis
5. **Start responses**: "Here's what I found in .NET release notes..."

## Core Principles

- **JSON-first**: Use `*.json` for authoritative data
- **HAL navigation**: Discover resources via `_links`
- **Minimal fetching**: Target specific documents (<200 tokens each)
- **Structured responses**: Reference JSON fields directly, avoid prose
