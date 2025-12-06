# Get .NET versions that were active during a given year
# Usage: jq -f get_versions_active_in_year.jq release-notes/timeline/2024/index.json
._embedded.releases[] | {version, release_type, support_phase, supported}
