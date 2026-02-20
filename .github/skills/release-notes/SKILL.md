---
name: release-notes
description: Generate .NET release notes for a preview or RC release. Determines team context, gathers merged PRs, enriches with issue details, categorizes by impact, and produces formatted markdown. Use when asked to write, update, or draft release notes, a changelog, or a what's new summary for any .NET component.
compatibility: Requires GitHub MCP server or gh CLI, SQL tool for structured storage, and access to the dotnet/core repository clone.
disable-model-invocation: true
argument-hint: "[team] [owner/repo]"
---

# .NET Release Notes Generator

Generate release notes for a .NET preview or RC release. This skill works for any .NET team that publishes release notes in the `dotnet/core` repository.

## Execution guidelines

- **Do not write intermediate files to disk.** Use the **SQL tool** for structured storage and querying (see [sql-storage.md](references/sql-storage.md) for schema).
- **Do not run linters, formatters, or validators.** Do not run markdownlint, prettier, link checkers, or any other validation tool on the output. The only output of this skill is the release notes markdown file itself.
- **Maximize parallel tool calls.** Fetch multiple PR and issue details in a single response to minimize round trips.
- **Follow [GitHub tool guidance](references/github-tools.md)** for all GitHub API interactions.

## Process

### Step 1: Identify team and collect inputs

**[Process inputs](references/process-inputs.md)** — determine which team's release notes are being produced, then collect preview name, Code Complete dates, and output path.

Once the team is identified, load the team context from `references/team-<team>.md`. The team context specifies:

- Product name and repositories to search
- Area labels for PR filtering
- Optional process steps (e.g., API diff review)
- Example release notes for reference
- Team-specific guidance

Team contexts with defined references:

| Team | Context file | Component file |
|------|-------------|----------------|
| Libraries | [team-libraries.md](references/team-libraries.md) | `libraries.md` |

Other teams can be added by creating a `references/team-<team>.md` file following the same structure.

### Step 2: Data pipeline

Gather the changes included in the release:

1. **[Collect and filter PRs](references/collect-prs.md)** — search for merged PRs using the repos and labels from the team context.
2. **[Enrich — fetch PR and issue details](references/enrich-prs.md)** — fetch full PR bodies, discover linked issues, gather reactions and Copilot summaries.
3. **API diff review** (optional) — if the team context specifies API diff review, follow [api-diff-review.md](references/api-diff-review.md) to cross-reference new APIs with candidate PRs.

### Step 3: Verify scope

Validate the candidate list:

1. **[Deduplicate from previous release notes](references/dedup-previous-releases.md)** — ensure features aren't already covered in an earlier preview. Load the previous release notes for the team's component file (e.g., `libraries.md` for Libraries). **Retain these previous release notes in context** — they are needed during the authoring step for theme continuations.
2. **[Confirm inclusion in release branch](references/verify-release-branch.md)** — spot-check that candidate changes shipped in the target preview via the VMR.

### Step 4: Author content

Write the release notes:

1. **[Categorize entries by area, theme, and impact](references/categorize-entries.md)** — group PRs into impact tiers using common criteria plus any team-specific guidance from the team context. Reference the previous release notes (loaded during deduplication) to identify **theme continuations** — features that build on work from prior previews should acknowledge the earlier coverage and describe what's new.
2. **[Apply formatting rules](references/format-template.md)** — follow the standard .NET release notes document structure.
3. **[Apply editorial rules](references/editorial-rules.md)** — follow attribution, benchmark, naming, and ranking guidelines.

### Step 5: Suggest reviewers

**[Suggest reviewers](references/suggest-reviewers.md)** — gather authors, coauthors, assignees, and mergers from candidate PRs and present suggested reviewers grouped by area.

### Step 6: Confirm and finalize

Present the complete draft to the user:

1. Feature list with categorization and ordering
2. Suggested reviewers grouped by area
3. Any unresolved items (ambiguous PRs, or for teams using API diff review, any unmatched API surface area)

Get user confirmation before writing the output file.

## Example usage

**User prompt:**

> Write the .NET Libraries release notes for .NET 11 Preview 2. The repo is dotnet/runtime.

**Expected output:** A markdown file at `release-notes/11.0/preview/preview2/libraries.md` following the format:

```markdown
# .NET Libraries in .NET 11 Preview 2 - Release Notes

.NET 11 Preview 2 includes new .NET Libraries features & enhancements:

- [Support for Zstandard compression](#support-for-zstandard-compression)
- [Faster time zone conversions](#faster-time-zone-conversions)
...

## Support for Zstandard compression

The new `ZstandardStream` class brings native Zstandard compression
support to `System.IO.Compression` ([dotnet/runtime#NNNNN](https://github.com/dotnet/runtime/pull/NNNNN)).
...
```
