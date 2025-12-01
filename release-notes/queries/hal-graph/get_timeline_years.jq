# Get all years in the timeline
# Usage: jq -f get_timeline_years.jq release-notes/timeline/index.json
._embedded.years[].year
