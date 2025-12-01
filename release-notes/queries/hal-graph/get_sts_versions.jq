# Get all Standard-Term Support (STS) versions
._embedded.releases[] | select(.release_type == "sts") | .version
