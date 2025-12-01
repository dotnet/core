# Get all currently supported .NET versions
._embedded.releases[] | select(.supported == true) | .version
