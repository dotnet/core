param([switch] $PublishAot)

$ErrorActionPreference = 'Stop'
$dotnet = (Get-Command dotnet -ErrorAction Stop).Source
$metadata = Get-Content (Join-Path $PSScriptRoot '../../preview/rc2/build-metadata.json') -Raw | ConvertFrom-Json
$sdkVersion = & $dotnet --version
if ($LASTEXITCODE -ne 0 -or $sdkVersion -ne $metadata.build.sdk_version) {
    throw "Expected SDK $($metadata.build.sdk_version), got '$sdkVersion'. Put the exact SDK on PATH."
}

$project = Join-Path $PSScriptRoot 'FSharp.fsproj'
$invalidProject = Join-Path $PSScriptRoot 'invalid/Invalid.fsproj'
$aotProject = Join-Path $PSScriptRoot 'aot/Aot.fsproj'

foreach ($language in @('default', 'preview')) {
    & $dotnet build $project --nologo --no-incremental "-p:LangVersion=$language"
    if ($LASTEXITCODE -ne 0) { throw "The $language-language examples did not build." }
    & $dotnet run --project $project --no-build
    if ($LASTEXITCODE -ne 0) { throw "The $language-language examples did not run." }
}

function Assert-BuildFailure([string] $Case, [string] $Language, [string[]] $Expected) {
    $diagnostics = & $dotnet build $invalidProject --nologo --no-incremental `
        "-p:LangVersion=$Language" "-p:ValidationCase=$Case" 2>&1 | Out-String
    $exitCode = $LASTEXITCODE
    $errors = @([regex]::Matches($diagnostics, 'error ([A-Z]+\d+)') |
        ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique)
    $expectedErrors = @($Expected | Sort-Object -Unique)
    if ($exitCode -eq 0 -or ($errors -join ',') -ne ($expectedErrors -join ',')) {
        throw "Expected only $($expectedErrors -join ', ') for $Case with $Language, got: $diagnostics"
    }
    Write-Output "$Case with $Language correctly reported $($expectedErrors -join ', ')."
}

& $dotnet build $invalidProject --nologo --no-incremental -p:LangVersion=default
if ($LASTEXITCODE -ne 0) { throw 'A positional call should compile with the default language version.' }
Assert-BuildFailure 'NamedArguments' 'preview' 'FS3923'
Assert-BuildFailure 'Reraise' 'default' 'FS3350'
Assert-BuildFailure 'RuntimeAsync' 'default' 'FS3350'
Assert-BuildFailure 'Srtp' 'default' @('FS0001', 'FS0043')
Assert-BuildFailure 'RecordConstructors' 'default' 'FS0800'
Assert-BuildFailure 'ClosureOptimization' '10.0' 'FS3350'
Assert-BuildFailure 'CharEnums' 'default' 'FS0001'
Assert-BuildFailure 'CharEnums' 'preview' 'FS0001'

& $dotnet build $invalidProject --nologo --no-incremental -p:LangVersion=10.0 -p:ValidationCase=CharEnums
if ($LASTEXITCODE -ne 0) { throw 'Char-backed enum bitwise operations should compile with F# 10 language rules.' }

& $dotnet build $invalidProject --nologo --no-incremental -p:LangVersion=preview -p:ValidationCase=Reraise
if ($LASTEXITCODE -ne 0) { throw 'The article reraise example should compile with preview.' }

& $dotnet fsi --langversion:default --exec (Join-Path $PSScriptRoot 'Fsi.fsx')
if ($LASTEXITCODE -ne 0) { throw 'The FSI asynchronous-disposal example did not run.' }

& $dotnet build $aotProject --nologo -p:TreatWarningsAsErrors=true
if ($LASTEXITCODE -ne 0) { throw 'The Array2D example did not build.' }
& $dotnet run --project $aotProject --no-build
if ($LASTEXITCODE -ne 0) { throw 'The Array2D example did not run.' }

if ($PublishAot) {
    $nativeDirectory = Join-Path $PSScriptRoot 'aot/bin/native'
    & $dotnet publish $aotProject --nologo -c Release -p:PublishAot=true `
        -p:TreatWarningsAsErrors=true -p:TrimmerSingleWarn=false -p:IlcSingleWarn=false -o $nativeDirectory
    if ($LASTEXITCODE -ne 0) { throw 'The Array2D Native AOT publish failed.' }
    $executable = if ($IsWindows) { 'Aot.exe' } else { 'Aot' }
    & (Join-Path $nativeDirectory $executable)
    if ($LASTEXITCODE -ne 0) { throw 'The Array2D Native AOT executable failed.' }
}
