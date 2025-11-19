# Create a markdown table of versions grouped by support type
(["| Version | Support Type | Phase | EOL Date |",
  "| ------- | ------------ | ----- | -------- |"] +
 [._embedded.releases[] |
  "| \(.version) | \(.lifecycle."release-type") | \(.lifecycle.phase) | \(.lifecycle."eol-date" // "N/A" | split("T")[0]) |"]) |
.[]
