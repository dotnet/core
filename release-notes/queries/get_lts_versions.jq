# Get all Long-Term Support (LTS) versions
._embedded.releases[] | select(.lifecycle."release-type" == "lts") | .version
