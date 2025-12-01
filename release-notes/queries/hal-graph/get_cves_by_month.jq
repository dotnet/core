# Get CVE details from a month index
# Usage: jq -f get_cves_by_month.jq release-notes/timeline/2024/07/index.json
._embedded.disclosures[] |
{
  id: .id,
  title: .title,
  cvss_severity: .cvss_severity,
  affected_releases: .affected_releases
}
