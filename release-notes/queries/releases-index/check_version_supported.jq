# Check if a version is supported
# Usage: jq --arg version "9.0" -f check_version_supported.jq releases-index.json
."releases-index"[] | select(."channel-version" == $version) | {version: ."channel-version", supported: (."support-phase" == "active"), phase: ."support-phase", eol_date: ."eol-date"}
