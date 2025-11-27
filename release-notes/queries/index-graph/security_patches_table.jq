# Create a markdown table of security patches with CVE counts
# Usage: jq -rf security_patches_table.jq release-notes/9.0/index.json
(["| Patch | Date | CVE Count |",
  "| ----- | ---- | --------- |"] +
 [._embedded.releases[] | select(.security) |
  "| \(.version) | \(.date | split("T")[0]) | \(.cve_count) |"]) |
.[]
