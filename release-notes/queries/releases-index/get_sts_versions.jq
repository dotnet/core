# Get all STS versions
# Usage: jq -f get_sts_versions.jq releases-index.json
."releases-index"[] | select(."release-type" == "sts") | ."channel-version"
