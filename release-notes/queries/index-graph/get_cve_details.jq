# Get full CVE disclosure details from a patch or month index
# Usage: jq -f get_cve_details.jq release-notes/9.0/9.0.1/index.json
._embedded.disclosures[] |
{
  id: .id,
  title: .title,
  cvss_score: .cvss_score,
  cvss_severity: .cvss_severity,
  disclosure_date: .disclosure_date,
  affected_releases: .affected_releases,
  affected_products: .affected_products
}
