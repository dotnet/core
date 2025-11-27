# Get all LTS versions
# Usage: jq -f get_lts_versions.jq releases-index.json
."releases-index"[] | select(."release-type" == "lts") | ."channel-version"
