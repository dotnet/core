# Get full CVE description and FAQ (requires cve.json)
# Usage: jq -f get_cve_description.jq release-notes/timeline/2025/01/cve.json
# Note: Description and FAQ are only available in cve.json, not embedded in index files
.disclosures[] |
{
  id: .id,
  problem: .problem,
  description: .description,
  faq: .cna.faq
}
