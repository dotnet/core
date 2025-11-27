# Get all EOL versions
# Usage: jq -f get_eol_versions.jq releases-index.json
."releases-index"[] | select(."support-phase" == "eol") | ."channel-version"
