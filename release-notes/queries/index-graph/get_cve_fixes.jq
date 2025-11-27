# Get fix commit URLs for all CVEs in a patch or month index
# Usage: jq -f get_cve_fixes.jq release-notes/9.0/9.0.1/index.json
._embedded.disclosures[] |
{
  id: .id,
  fixes: [.fixes[] | {repo, branch, href}]
}
