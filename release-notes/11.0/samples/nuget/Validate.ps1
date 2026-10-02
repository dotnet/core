$ErrorActionPreference = 'Stop'
$configFile = Join-Path ([System.IO.Path]::GetTempPath()) "rc2-nuget-source-$PID.config"
$dotnet = (Get-Command dotnet -ErrorAction Stop).Source

try {
    Copy-Item (Join-Path $PSScriptRoot 'NuGet.Template.Config') $configFile
    & $dotnet nuget add source 'https://api.nuget.org/v3/index.json' --name 'rc2-feed' --configfile $configFile --min-publish-age-hours 24
    if ($LASTEXITCODE -ne 0) { throw 'Adding a source failed.' }
    [xml]$config = Get-Content $configFile -Raw
    $source = $config.configuration.packageSources.add
    if ($source.minPublishAgeHours -ne '24') { throw "Expected 24 hours after add, got $($source.minPublishAgeHours)." }

    & $dotnet nuget update source 'rc2-feed' --configfile $configFile --min-publish-age-hours 48
    if ($LASTEXITCODE -ne 0) { throw 'Updating a source failed.' }
    [xml]$config = Get-Content $configFile -Raw
    $source = $config.configuration.packageSources.add
    if ($source.minPublishAgeHours -ne '48') { throw "Expected 48 hours after update, got $($source.minPublishAgeHours)." }
    Write-Output 'Source minimum publication age was set and updated.'
}
finally {
    if (Test-Path -LiteralPath $configFile) {
        Remove-Item -LiteralPath $configFile
    }
}
