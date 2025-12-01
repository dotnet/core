# Get all fix commits for a specific release (requires cve.json)
# Usage: jq --arg release "8.0" -f get_cve_commits_for_release.jq release-notes/timeline/2025/01/cve.json
# Note: Commit details with full URLs are available in cve.json
.products[] | select(.release == $release) |
{
  cve_id,
  product: .name,
  fixed: .fixed,
  commits: .commits
}
