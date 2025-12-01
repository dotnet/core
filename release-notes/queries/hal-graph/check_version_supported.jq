# Check if a specific version is still supported
# Usage: jq --arg version "10.0" -f check_version_supported.jq release-notes/index.json
._embedded.releases[] | select(.version == $version) | {version, supported, phase, eol_date}
