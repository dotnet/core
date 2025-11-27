# Create a markdown table of versions grouped by support type
(["| Version | Support Type | Phase | EOL Date |",
  "| ------- | ------------ | ----- | -------- |"] +
 [._embedded.releases[] |
  "| \(.version) | \(.release_type) | \(.phase) | \(.eol_date // "N/A" | split("T")[0]) |"]) |
.[]
