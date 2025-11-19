# Get all Standard-Term Support (STS) versions
._embedded.releases[] | select(.lifecycle."release-type" == "sts") | .version
