# Get vulnerable version ranges for CVEs (requires cve.json)
# Usage: jq -f get_cve_version_range.jq release-notes/timeline/2025/01/cve.json
# Note: Version range info is only available in cve.json, not embedded in index files
.products[] |
{
  cve_id,
  product: .name,
  release,
  min_vulnerable,
  max_vulnerable,
  fixed
}
