# Check if a specific version is vulnerable to any CVEs (requires cve.json)
# Usage: jq --arg version "8.0.11" -f check_version_vulnerable.jq release-notes/timeline/2025/01/cve.json
# Note: Version range checking requires cve.json data
.products[] |
select(.min_vulnerable <= $version and .max_vulnerable >= $version) |
{
  cve_id,
  product: .name,
  vulnerable_range: "\(.min_vulnerable) - \(.max_vulnerable)",
  fixed_in: .fixed
}
