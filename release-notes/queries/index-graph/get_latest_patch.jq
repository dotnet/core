# Get the latest patch release from a version-specific index
# Usage: jq -f get_latest_patch.jq release-notes/10.0/index.json
._embedded.releases[0].version
