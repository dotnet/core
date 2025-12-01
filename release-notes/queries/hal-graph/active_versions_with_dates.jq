# List active versions with GA and EOL dates
._embedded.releases[] | select(.phase == "active") | {version, release_type, ga_date, eol_date}
