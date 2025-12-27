---
name: version-eol
description: EOL versions, support lifecycle, version history, and release types
workflows: https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/version-eol/workflows.json
---

# Version and EOL Queries

Supported versions are embedded in llms.json. EOL versions require root → major index. Fetch workflows.json for navigation paths with `next_workflow` transitions.

## Stop Criteria

| Need | Stop At | Has |
|------|---------|-----|
| Supported version info (patch, LTS/STS, support phase) | llms.json | `_embedded.patches["X.0"]` |
| EOL date for any version | major index | `eol_date`, `supported` |
| Last security patch for EOL version | patch index | `cve_records`, security details |

## One Rule

Check `supported_releases` first. If version is listed, use `_embedded.patches`. Otherwise navigate via `root`.
