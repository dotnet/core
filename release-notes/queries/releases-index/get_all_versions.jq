# Get all .NET version numbers
# Usage: jq -f get_all_versions.jq releases-index.json
."releases-index"[]."channel-version"
