# Get all patches released in a given month
# Usage: jq -f get_patches_by_month.jq release-notes/timeline/2024/07/index.json
._embedded.releases[] |
{
  version,
  runtime: .runtime_patches,
  sdk: .sdk_patches,
  cves: .cve_records
}
