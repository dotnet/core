# List versions with their end-of-life dates
# Output: version and eol-date as an object
._embedded.releases[] | 
{
  version: .version,
  "eol-date": .lifecycle."eol-date",
  supported: .lifecycle.supported
}
