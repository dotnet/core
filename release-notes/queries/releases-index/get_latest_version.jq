# Get the latest .NET version
# Usage: jq -f get_latest_version.jq releases-index.json
."releases-index"[0]."channel-version"
