# Get CWE weakness information for CVEs (requires cve.json)
# Usage: jq -f get_cve_weakness.jq release-notes/timeline/2025/01/cve.json
# Note: This data is only available in cve.json, not embedded in index files
.disclosures[] |
{
  id: .id,
  problem: .problem,
  weakness: .weakness,
  cvss_score: .cvss.score,
  cvss_severity: .cvss.severity
}
