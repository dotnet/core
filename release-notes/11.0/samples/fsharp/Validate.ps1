$ErrorActionPreference = 'Stop'
$dotnet = (Get-Command dotnet -ErrorAction Stop).Source

& $dotnet run --project (Join-Path $PSScriptRoot 'FSharp.fsproj')
if ($LASTEXITCODE -ne 0) { throw 'The named-argument example did not run.' }

$diagnostics = & $dotnet build (Join-Path $PSScriptRoot 'invalid\Invalid.fsproj') --nologo 2>&1 | Out-String
if ($LASTEXITCODE -eq 0 -or $diagnostics -notmatch 'error FS3923') {
    throw "Expected positional-call error FS3923, got: $diagnostics"
}
Write-Output 'Positional call correctly reported FS3923.'
