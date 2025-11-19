# Get all End-of-Life (EOL) versions
._embedded.releases[] | select(.lifecycle.phase == "eol") | .version
