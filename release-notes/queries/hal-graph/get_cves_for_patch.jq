# Get CVE IDs fixed in a specific patch
# Usage: jq -f get_cves_for_patch.jq release-notes/9.0/9.0.1/index.json
.cve_records[]
