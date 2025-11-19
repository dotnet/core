# Get all currently supported .NET versions
._embedded.releases[] | select(.lifecycle.supported == true) | .version
