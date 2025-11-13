# Quick Reference

**Entry point**: `https://raw.githubusercontent.com/richlander/core/main/release-notes/index.json`

## Common Workflows

| Task | Example |
|------|---------|
| Latest release | `index.json` → `_links.latest.href` |
| Latest LTS | `index.json` → `_links.latest-lts.href` |
| Version patches | `8.0/index.json` → `_embedded.releases[]` |
| CVEs by month | `timeline/2024/index.json` → Month → `_links.cve-json.href` |
| SDK downloads | `8.0/sdk/sdk.json` or `9.0/sdk/sdk.json` |
| OS support | `8.0/supported-os.json` or `9.0/supported-os.json` |

## CVE Analysis Workflow

1. GET `timeline/2024/index.json` (or current year)
2. Navigate to month via `_links.cve-json.href` → e.g. `timeline/2024/07/cve.json`
3. List CVEs from `cves[]` array
4. **Always ask**: "Would you like inline diffs for these fixes?"
5. If yes: Use commit URLs from `commits{}` (already `.diff` format)

## CVE JSON Quick Queries

```bash
# Get all CVE IDs
jq -r '.cves[].id' cve.json

# CVEs for .NET 8.0
jq -r '.["release_cves"]["8.0"][]' cve.json

# CVEs affecting .NET Runtime product
jq -r '.["product_cves"]["dotnet-runtime"][]' cve.json

# CVEs affecting a specific package
jq -r '.["package_cves"]["System.Text.Json"][]' cve.json

# Commits for specific CVE
jq -r '. as $root | .["cve_commits"]["CVE-2024-38095"][] | $root.commits[.].url' cve.json

# Critical severity only
jq -r '.cves[] | select(.severity == "Critical") | .id' cve.json
```

## GitHub Commit URLs

CVE JSON includes `.diff` URLs for immediate analysis:

- **`.diff`** - Raw unified diff (best for code analysis)
- **`.patch`** - Git patch with commit message (best for context)
- **(no extension)** - Web view (for humans)

## Response Templates

**Opening**:
```
"Here's what I found in .NET release notes..."
```

**CVE follow-up** (mandatory):
```
[After listing CVEs]
"Would you like inline diffs for these fixes?"
```

**Diff analysis**:
```
"Here are the commit URLs (diff format, ready for analysis):
- https://github.com/dotnet/runtime/commit/abc123.diff
Note: Change '.diff' to '.patch' for commit message, or remove for web view"
```

## CVE Schema Structure

- **`cves[]`** - CVE metadata (id, severity, cvss, description, references)
- **`products[]`** - SDK components (dotnet-runtime, dotnet-aspnetcore, dotnet-sdk, dotnet-windowsdesktop)
- **`packages[]`** - NuGet packages (System.Text.Json, Microsoft.IO.Redist, etc.)
- **`commits{}`** - Commit details by hash
- **`product_name{}`** - Product ID → display name (e.g., "dotnet-runtime" → ".NET Runtime Libraries")
- **`product_cves{}`** - Product ID → CVE IDs
- **`package_cves{}`** - Package name → CVE IDs (packages are self-documenting, no display name mapping)
- **`cve_commits{}`** - CVE → commit hashes
- **`cve_releases{}`** - CVE → affected versions
- **`release_cves{}`** - Version → CVE IDs

## Error Handling

- **404 on JSON**: Fall back to `.md` version
- **Malformed JSON**: Skip resource, continue
- **GitHub access denied**: Provide URL to user for manual paste
- **Missing fields**: Check existence before accessing

## Performance Tips

- Follow HAL `_links.href` values
- Fetch minimal, focused documents
- Most data available in `_embedded` without additional requests
- Files are CDN-optimized and cache-friendly
