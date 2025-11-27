# Get months that have CVE disclosures for a given year
# Usage: jq -f get_months_with_cves.jq release-notes/timeline/2024/index.json
._embedded.months[] | select(.security) | {month, cve_count: (.cve_records | length)}
