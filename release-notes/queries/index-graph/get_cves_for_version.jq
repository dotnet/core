# Get all CVE IDs for a major version
# Usage: jq -f get_cves_for_version.jq release-notes/9.0/index.json
._embedded.cve_records[]
