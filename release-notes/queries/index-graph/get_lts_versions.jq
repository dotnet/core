# Get all Long-Term Support (LTS) versions
._embedded.releases[] | select(.release_type == "lts") | .version
