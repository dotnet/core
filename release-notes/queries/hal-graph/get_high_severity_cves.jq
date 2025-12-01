# Get HIGH and CRITICAL severity CVEs from a patch or month index
# Usage: jq -f get_high_severity_cves.jq release-notes/9.0/9.0.1/index.json
._embedded.disclosures[] |
select(.cvss_severity == "HIGH" or .cvss_severity == "CRITICAL") |
{
  id: .id,
  title: .title,
  cvss_score: .cvss_score,
  cvss_severity: .cvss_severity
}
