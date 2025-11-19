# List active versions with release and EOL dates
._embedded.releases[] | 
select(.lifecycle.phase == "active") |
{
  version: .version,
  "release-type": .lifecycle."release-type",
  "release-date": .lifecycle."release-date",
  "eol-date": .lifecycle."eol-date"
}
