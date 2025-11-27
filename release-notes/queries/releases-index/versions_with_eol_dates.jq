# Get versions with their EOL dates
# Usage: jq -f versions_with_eol_dates.jq releases-index.json
."releases-index"[] | {version: ."channel-version", eol_date: ."eol-date", supported: (."support-phase" == "active")}
