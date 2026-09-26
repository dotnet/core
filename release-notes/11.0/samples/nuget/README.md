# NuGet release-note validation

With SDK `11.0.100-rc.2.26475.137` on `PATH`, run `.\Validate.ps1`. It creates a temporary NuGet configuration, adds a package source with `--min-publish-age-hours 24`, updates that source to 48 hours, checks the persisted values, and removes the temporary configuration. It does not change the user's configured package sources.
