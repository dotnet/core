# Get all End-of-Life (EOL) versions
._embedded.releases[] | select(.phase == "eol") | .version
