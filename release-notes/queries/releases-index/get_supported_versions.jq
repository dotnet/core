# Get currently supported .NET versions
# Usage: jq -f get_supported_versions.jq releases-index.json
."releases-index"[] | select(."support-phase" == "active") | ."channel-version"
