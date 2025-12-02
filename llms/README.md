# Quick Reference

## Entry Points

| Query Type | Entry Point |
|------------|-------------|
| Version/patch queries | `https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json` |
| Time-based queries | `https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/timeline/index.json` |

**CRITICAL**: Never construct URLs manually. Always follow `_links.href` values from JSON responses.

## Common Workflows

| Task | Path |
|------|------|
| Latest release | `index.json` → `_links.latest.href` |
| Latest LTS | `index.json` → `_links.latest-lts.href` |
| Version patches | `index.json` → version → `_embedded.releases[]` |
| Security patches | `9.0/index.json` → `_links.latest-security.href` |
| CVEs for version | `9.0/index.json` → `_embedded.cve_records` |
| CVEs for patch | `9.0/9.0.1/index.json` → `_embedded.disclosures[]` |
| CVEs by month | `timeline/index.json` → year → month → `_embedded.disclosures[]` |
| SDK downloads | `9.0/sdk/index.json` |
| OS support | `9.0/supported-os.json` |

## CVE Analysis Workflows

### Version-Centric (for version/patch queries)

1. GET `index.json` → navigate to major version (e.g., `9.0/index.json`)
2. View all CVEs for version in `_embedded.cve_records`
3. Find security patches: `_embedded.releases[]` where `security: true`
4. Navigate to patch index → **full details in `_embedded.disclosures[]`**
5. **Always ask**: "Would you like inline diffs for these fixes?"
6. If yes: Use `fixes[].href` URLs (already `.diff` format)

### Time-Centric (for date-range queries)

1. GET `timeline/index.json` → navigate to year → navigate to month
2. View CVEs inline: `_embedded.disclosures[]` has full details
3. **Always ask**: "Would you like inline diffs for these fixes?"
4. If yes: Use `fixes[].href` URLs (already `.diff` format)

## Disclosure Object Structure

The `_embedded.disclosures[]` array (in patch and month indexes) contains full CVE details:

```json
{
  "id": "CVE-2025-21171",
  "title": ".NET Remote Code Execution Vulnerability",
  "_links": { "self": { "href": "https://github.com/dotnet/announcements/issues/340" } },
  "fixes": [
    {
      "href": "https://github.com/dotnet/runtime/commit/9da8c6a4a6ea03054e776275d3fd5c752897842e.diff",
      "repo": "dotnet/runtime",
      "branch": "release/9.0",
      "release": "9.0"
    }
  ],
  "cvss_score": 7.5,
  "cvss_severity": "HIGH",
  "disclosure_date": "2025-01-14",
  "affected_releases": ["9.0"],
  "affected_products": ["dotnet-runtime"],
  "affected_packages": ["System.Text.Json"],
  "platforms": ["all"]
}
```

## CVE JSON Quick Queries (for cve.json files)

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

```text
"Here's what I found in .NET release notes..."
```

**CVE follow-up** (mandatory):

```text
[After listing CVEs]
"Would you like inline diffs for these fixes?"
```

**Diff analysis**:

```text
"Here are the commit URLs (diff format, ready for analysis):
- https://github.com/dotnet/runtime/commit/abc123.diff
Note: Change '.diff' to '.patch' for commit message, or remove for web view"
```

## Index Structure Summary

### Major Version Index (e.g., `9.0/index.json`)

- **`_embedded.releases[]`** - Patches with `security`, `cve_records`
- **`_embedded.cve_records`** - All CVE IDs for this major version
- **`_embedded.years[]`** - Cross-links to timeline years
- **`_links.latest-security`** - Most recent security patch

### Patch Index (e.g., `9.0/9.0.1/index.json`)

- **`_embedded.disclosures[]`** - Full CVE details with fixes
- **`_embedded.cve_records`** - CVE IDs for this patch
- **`_links.month-index`** - Cross-link to timeline month
- **`_links.cve-json`** - Link to month's cve.json

### Month Index (e.g., `timeline/2024/07/index.json`)

- **`_embedded.disclosures[]`** - Full CVE details with fixes
- **`_embedded.patches{}`** - Per-version patch info with `cve_records`
- **`_links.cve`** - Link to cve.json for this month

### CVE JSON (e.g., `timeline/2024/07/cve.json`) — Full Schema

- **`cves[]`** - CVE metadata (id, severity, cvss, description, references)
- **`products[]`** - SDK components (dotnet-runtime, dotnet-aspnetcore, dotnet-sdk, dotnet-windowsdesktop)
- **`packages[]`** - NuGet packages (System.Text.Json, Microsoft.IO.Redist, etc.)
- **`commits{}`** - Commit details by hash
- **`product_name{}`** - Product ID → display name
- **`product_cves{}`** - Product ID → CVE IDs
- **`package_cves{}`** - Package name → CVE IDs
- **`cve_commits{}`** - CVE → commit hashes
- **`cve_releases{}`** - CVE → affected versions
- **`release_cves{}`** - Version → CVE IDs

## HAL Links Reference (`_links`)

### Navigation

- **`self`**: Current document
- **`prev`** / **`next`**: Adjacent documents (months, years)

### Version Navigation

- **`latest`**: Most recent release (any support type)
- **`latest-lts`**: Most recent LTS release
- **`latest-security`**: Most recent security patch
- **`major-version-index`**: Parent version index (from patch)

### Cross-Links

- **`timeline-index`**: From version index to timeline
- **`releases-index`**: From timeline to version index
- **`month-index`**: From patch to timeline month
- **`latest-year`**: Most recent year in timeline

### Resources

- **`supported-os`**: OS support information
- **`cve-json`** / **`cve`**: Security vulnerability data
- **`sdk-index`**: SDK information
- **`release-manifest`**: Full release manifest

### Link Properties

- **`href`**: URL (always follow this, never construct)
- **`path`**: Relative path within repo
- **`title`**: Human-readable description
- **`type`**: Media type (`application/hal+json`, `application/json`, `application/markdown`)

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
