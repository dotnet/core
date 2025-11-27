# Get the latest LTS version
# Usage: jq -f get_latest_lts.jq releases-index.json
[."releases-index"[] | select(."release-type" == "lts")][0]."channel-version"
