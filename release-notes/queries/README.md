# .NET Release Notes Index Queries

This directory contains standard `jq` queries for working with .NET release `index.json` files. These queries help extract and analyze release information from the structured JSON data.

## About the Index Files

The .NET release notes repository contains several `index.json` files:

- `/release-notes/index.json` - Master index of all .NET versions (1.0-10.0)
- `/release-notes/{version}/index.json` - Patch release index for specific versions (e.g., 10.0.0, 10.0.1)
- `/release-notes/timeline/index.json` - Release timeline index by year
- `/release-notes/timeline/{year}/index.json` - Year-specific timeline (e.g., 2025, 2024)
- `/release-notes/timeline/{year}/{month}/index.json` - Month-specific releases

## Usage

To use these queries with `jq`:

```bash
# Run a query on the main index
jq -f queries/get_supported_versions.jq release-notes/index.json

# Run a query on a specific version index
jq -f queries/get_latest_patch.jq release-notes/10.0/index.json

# Pipe output to create tables or reports
jq -f queries/versions_by_support_type.jq release-notes/index.json
```

## Available Queries

### Version Information

- **get_all_versions.jq** - List all .NET version numbers
- **get_supported_versions.jq** - List currently supported .NET versions
- **get_lts_versions.jq** - List Long-Term Support (LTS) versions
- **get_sts_versions.jq** - List Standard-Term Support (STS) versions
- **get_eol_versions.jq** - List End-of-Life (EOL) versions

### Release Details

- **get_latest_version.jq** - Get the latest .NET version
- **get_latest_lts.jq** - Get the latest LTS version
- **get_latest_patch.jq** - Get the latest patch for a version (use with version-specific index)
- **versions_by_support_type.jq** - Create a table of versions grouped by support type

### Lifecycle Information

- **versions_with_eol_dates.jq** - List versions with their end-of-life dates
- **active_versions_with_dates.jq** - List active versions with release and EOL dates
- **check_version_supported.jq** - Check if a specific version is still supported (requires parameter)

## Query Categories

### Basic Extraction

Simple queries that extract specific fields or filter by basic criteria.

### Formatted Output

Queries that produce markdown tables or formatted reports for documentation.

### Analytical Queries

Queries that compute or derive information from multiple fields (e.g., time until EOL).

## Example Outputs

### List Supported Versions

```bash
$ jq -f queries/get_supported_versions.jq release-notes/index.json
"10.0"
"9.0"
"8.0"
```

### Versions by Support Type (Markdown Table)

```bash
$ jq -f queries/versions_by_support_type.jq release-notes/index.json
| Version | Support Type | Phase | EOL Date |
| ------- | ------------ | ----- | -------- |
| 10.0 | lts | active | 2028-11-14 |
| 9.0 | sts | active | 2026-11-10 |
| 8.0 | lts | active | 2026-11-10 |
```

## Creating New Queries

When creating new queries:

1. Use descriptive filenames that clearly indicate the query purpose
2. Include comments in the `.jq` file explaining what the query does
3. Test queries against multiple index files to ensure they work correctly
4. Follow the patterns established in existing queries
5. Consider output format (raw values, arrays, or markdown tables)

## Related Resources

- [jq Manual](https://jqlang.github.io/jq/manual/)
- [.NET Release Policies](../../release-policies.md)
- [Release Notes Index Schema](../schemas/dotnet-release-version-index.json)
- [CVE Queries](../../designs/accepted/2025/cve-schema/jq_queries) - Similar queries for security disclosures

## Contributing

To add a new query:

1. Create a `.jq` file in this directory with a descriptive name
2. Update this README with the query name and description
3. Test the query against relevant index files
4. Submit a PR with your new query
