# Create a markdown table of versions by support type
# Usage: jq -rf versions_by_support_type.jq releases-index.json
(["| Version | Support Type | Phase | EOL Date |",
  "| ------- | ------------ | ----- | -------- |"] +
 [."releases-index"[] |
  "| \(."channel-version") | \(."release-type") | \(."support-phase") | \(."eol-date" // "N/A") |"]) |
.[]
