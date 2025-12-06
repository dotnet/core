# Get all End-of-Life (EOL) versions
._embedded.releases[] | select(.support_phase == "eol") | .version
