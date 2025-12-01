# Get all security patches for a major version
# Usage: jq -f get_security_patches.jq release-notes/9.0/index.json
._embedded.releases[] | select(.security == true) | .version
