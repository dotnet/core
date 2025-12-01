# Create a markdown table of CVEs by month for a year
# Usage: jq -rf cves_by_year_table.jq release-notes/timeline/2024/index.json
(["| Month | CVE Count | CVEs |",
  "| ----- | --------- | ---- |"] +
 [._embedded.months[] | select(.security) |
  "| \(.month) | \(.cve_count) | \(.cve_records | join(", ")) |"]) |
.[]
