# This script allows running API-diff to generate the dotnet/core report that compares the APIs introduced between two previews, in the format expected for publishing in the dotnet/core repo.

# Prerequisites:
# - PowerShell 7.0 or later

# Usage:

# RunApiDiff.ps1
# -PreviousMajorMinor        : The 'before' .NET version: '6.0', '7.0', '8.0', etc. If not specified, inferred from existing api-diffs or discovered from -PreviousNuGetFeed.
# -PreviousPrereleaseLabel      : The prerelease label for the 'before' version (e.g., "preview.7", "rc.1"). Omit for GA releases. If not specified, inferred from existing api-diffs or discovered from -PreviousNuGetFeed.
# -CurrentMajorMinor           : The 'after' .NET version: '6.0', '7.0', '8.0', etc. If not specified, inferred from existing api-diffs or discovered from -CurrentNuGetFeed.
# -CurrentPrereleaseLabel       : The prerelease label for the 'after' version (e.g., "preview.7", "rc.1"). Omit for GA releases. If not specified, inferred from existing api-diffs or discovered from -CurrentNuGetFeed.
# -CoreRepo                     : The full path to your local clone of the dotnet/core repo. If not specified, defaults to the git repository root relative to this script.
# -TmpFolder                    : The full path to the folder where the assets will be downloaded, extracted and compared. If not specified, a temporary folder is created automatically.
# -AttributesToExcludeFilePath  : The full path to the file containing the attributes to exclude from the report. By default, it is "ApiDiffAttributesToExclude.txt" in the same folder as this script.
# -AssembliesToExcludeFilePath  : The full path to the file containing the assemblies to exclude from the report. By default, it is "ApiDiffAssembliesToExclude.txt" in the same folder as this script.
# -PreviousNuGetFeed            : The NuGet feed URL to use for downloading previous/before packages. By default, uses the dnceng public transport feed based on the previous major version (e.g., dotnet10).
# -CurrentNuGetFeed             : The NuGet feed URL to use for downloading current/after packages. By default, uses the dnceng public transport feed based on the current major version (e.g., dotnet11).
# -ExcludeNetCore               : Switch to exclude the NETCore comparison.
# -ExcludeAspNetCore            : Switch to exclude the AspNetCore comparison.
# -ExcludeWindowsDesktop        : Switch to exclude the WindowsDesktop comparison.
# -InstallApiDiff               : Switch to install or update the ApiDiff tool before running.
# -PreviousVersion       : Optional exact package version for the previous/before comparison (e.g., "10.0.0-preview.7.25380.108"). Overrides version search logic.
# -CurrentVersion        : Optional exact package version for the current/after comparison (e.g., "10.0.0-rc.1.25451.107"). Overrides version search logic.

# Example — simplest usage (infers next version from existing api-diffs):
# .\RunApiDiff.ps1

# Example — explicit current version:
# .\RunApiDiff.ps1 -CurrentMajorMinor 11.0 -CurrentPrereleaseLabel preview.1

# Example with exact package versions (MajorMinor and PrereleaseLabel are extracted automatically):
# .\RunApiDiff.ps1 -PreviousVersion "10.0.0-preview.7.25380.108" -CurrentVersion "10.0.0-rc.1.25451.107"

Param (
    [Parameter(Mandatory = $false)]
    [ValidatePattern("^(\d+\.\d+)?$")]
    [string]
    $PreviousMajorMinor # 7.0, 8.0, 9.0, ...
    ,
    [Parameter(Mandatory = $false)]
    [AllowEmptyString()]
    [ValidatePattern("^((preview|rc)\.\d+)?$")]
    [string]
    $PreviousPrereleaseLabel # "preview.7", "rc.1", etc. Omit for GA.
    ,
    [Parameter(Mandatory = $false)]
    [ValidatePattern("^(\d+\.\d+)?$")]
    [string]
    $CurrentMajorMinor # 7.0, 8.0, 9.0, ...
    ,
    [Parameter(Mandatory = $false)]
    [AllowEmptyString()]
    [ValidatePattern("^((preview|rc)\.\d+)?$")]
    [string]
    $CurrentPrereleaseLabel # "preview.7", "rc.1", etc. Omit for GA.
    ,
    [Parameter(Mandatory = $false)]
    [string]
    $CoreRepo
    ,
    [Parameter(Mandatory = $false)]
    [string]
    $TmpFolder
    ,
    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]
    $AttributesToExcludeFilePath = "ApiDiffAttributesToExclude.txt"
    ,
    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]
    $AssembliesToExcludeFilePath = "ApiDiffAssembliesToExclude.txt"
    ,
    [Parameter(Mandatory = $false)]
    [string]
    $PreviousNuGetFeed
    ,
    [Parameter(Mandatory = $false)]
    [string]
    $CurrentNuGetFeed
    ,
    [Parameter(Mandatory = $false)]
    [switch]
    $ExcludeNetCore
    ,
    [Parameter(Mandatory = $false)]
    [switch]
    $ExcludeAspNetCore
    ,
    [Parameter(Mandatory = $false)]
    [switch]
    $ExcludeWindowsDesktop
    ,
    [Parameter(Mandatory = $false)]
    [switch]
    $InstallApiDiff
    ,
    [Parameter(Mandatory = $false)]
    [string]
    $PreviousVersion = ""
    ,
    [Parameter(Mandatory = $false)]
    [string]
    $CurrentVersion = ""
)

#######################
### Start Functions ###
#######################

## Get the dnceng public feed URL for a given major version
Function GetDncEngFeedUrl {
    Param (
        [Parameter(Mandatory = $true)]
        [int] $majorVersion,
        [Parameter(Mandatory = $false)]
        [switch] $Transport
    )
    $feedName = If ($Transport) { "dotnet${majorVersion}-transport" } Else { "dotnet${majorVersion}" }
    Return "https://pkgs.dev.azure.com/dnceng/public/_packaging/${feedName}/nuget/v3/index.json"
}

## Parse a NuGet version string into MajorMinor and PrereleaseLabel components
Function ParseVersionString {
    Param (
        [string] $version,
        [string] $label
    )
    $result = @{ MajorMinor = ""; PrereleaseLabel = "" }
    If ($version -match "^([1-9][0-9]*\.[0-9]+)\.[0-9]+-((?:preview|rc)\.[0-9]+)") {
        $result.MajorMinor = $Matches[1]
        $result.PrereleaseLabel = $Matches[2]
    }
    ElseIf ($version -match "^([1-9][0-9]*\.[0-9]+)\.[0-9]+$") {
        $result.MajorMinor = $Matches[1]
        $result.PrereleaseLabel = ""
    }
    Else {
        Write-Error "Could not parse ${label}Version '$version'. Expected format: 'X.Y.Z' or 'X.Y.Z-preview.N.build' / 'X.Y.Z-rc.N.build'." -ErrorAction Stop
    }
    Return $result
}

## Parse a PrereleaseLabel into internal ReleaseKind and PreviewRCNumber components
Function ParsePrereleaseLabel {
    Param (
        [string] $label
    )
    If ([System.String]::IsNullOrWhiteSpace($label)) {
        Return @{ ReleaseKind = "ga"; PreviewRCNumber = "0" }
    }
    If ($label -match "^(preview|rc)\.(\d+)$") {
        Return @{ ReleaseKind = $Matches[1]; PreviewRCNumber = $Matches[2] }
    }
    Write-Error "Invalid prerelease label '$label'. Expected format: 'preview.N' or 'rc.N'." -ErrorAction Stop
}

## Get a numeric sort weight for a release milestone (preview < rc < ga)
Function GetMilestoneSortWeight {
    Param (
        [string] $releaseKind,
        [int] $number
    )
    Switch ($releaseKind) {
        "preview" { Return $number }
        "rc"      { Return 100 + $number }
        "ga"      { Return 200 }
    }
    Return -1
}

## Parse an api-diff folder name (e.g., "preview1", "rc2", "ga") into MajorMinor and PrereleaseLabel
Function ParseApiDiffFolderName {
    Param (
        [string] $majorMinor,
        [string] $folderName
    )
    If ($folderName -match "^(preview|rc)(\d+)$") {
        Return @{ MajorMinor = $majorMinor; PrereleaseLabel = "$($Matches[1]).$($Matches[2])" }
    }
    If ($folderName -eq "ga") {
        Return @{ MajorMinor = $majorMinor; PrereleaseLabel = "" }
    }
    Return $null
}

## Scan release-notes for the most recent api-diff and return its version info
Function FindLatestApiDiff {
    Param (
        [string] $coreRepo
    )
    $releaseNotesDir = [IO.Path]::Combine($coreRepo, "release-notes")

    # Find all version folders that have preview/*/api-diff subfolders
    $entries = @()
    ForEach ($versionDir in (Get-ChildItem -Directory $releaseNotesDir | Where-Object { $_.Name -match "^\d+\.\d+$" })) {
        $previewDir = [IO.Path]::Combine($versionDir.FullName, "preview")
        If (-not (Test-Path $previewDir)) { Continue }

        ForEach ($milestoneDir in (Get-ChildItem -Directory $previewDir)) {
            $apiDiffDir = [IO.Path]::Combine($milestoneDir.FullName, "api-diff")
            If (-not (Test-Path $apiDiffDir)) { Continue }

            $parsed = ParseApiDiffFolderName $versionDir.Name $milestoneDir.Name
            If (-not $parsed) { Continue }

            $milestoneParsed = ParsePrereleaseLabel $parsed.PrereleaseLabel
            $majorVersion = [int]($versionDir.Name.Split(".")[0])
            $sortKey = $majorVersion * 1000 + (GetMilestoneSortWeight $milestoneParsed.ReleaseKind ([int]$milestoneParsed.PreviewRCNumber))

            $entries += @{ MajorMinor = $parsed.MajorMinor; PrereleaseLabel = $parsed.PrereleaseLabel; SortKey = $sortKey }
        }
    }

    If ($entries.Count -eq 0) { Return $null }

    Return ($entries | Sort-Object { $_.SortKey } | Select-Object -Last 1)
}

## Probe the NuGet feed to find the next version after a given milestone
Function GetNextVersionFromFeed {
    Param (
        [string] $majorMinor,
        [string] $prereleaseLabel,
        [string] $feedUrl
    )

    $currentParsed = ParsePrereleaseLabel $prereleaseLabel
    $currentWeight = GetMilestoneSortWeight $currentParsed.ReleaseKind ([int]$currentParsed.PreviewRCNumber)

    $serviceIndex = Invoke-RestMethod -Uri $feedUrl
    $flatContainer = $serviceIndex.resources | Where-Object { $_.'@type' -match 'PackageBaseAddress' } | Select-Object -First 1
    If (-not $flatContainer) { Return $null }

    $baseUrl = $flatContainer.'@id'
    $versionsUrl = "${baseUrl}microsoft.netcore.app.ref/index.json"

    try {
        $versionsResult = Invoke-RestMethod -Uri $versionsUrl
    }
    catch { Return $null }

    If (-not $versionsResult.versions -or $versionsResult.versions.Count -eq 0) { Return $null }

    # Find versions for the same MajorMinor that come after the current milestone
    $candidates = @()
    ForEach ($v in $versionsResult.versions) {
        $parsed = $null
        try { $parsed = ParseVersionString $v "probe" } catch { Continue }
        If ($parsed.MajorMinor -ne $majorMinor) { Continue }

        $milestoneParsed = ParsePrereleaseLabel $parsed.PrereleaseLabel
        $weight = GetMilestoneSortWeight $milestoneParsed.ReleaseKind ([int]$milestoneParsed.PreviewRCNumber)
        If ($weight -gt $currentWeight) {
            $candidates += @{ MajorMinor = $parsed.MajorMinor; PrereleaseLabel = $parsed.PrereleaseLabel; Weight = $weight }
        }
    }

    If ($candidates.Count -gt 0) {
        Return ($candidates | Sort-Object { $_.Weight } | Select-Object -First 1)
    }

    # No newer milestone found on the same major — try the next major's feed
    $nextMajor = [int]($majorMinor.Split(".")[0]) + 1
    $nextMajorMinor = "$nextMajor.0"
    $nextFeedUrl = GetDncEngFeedUrl $nextMajor

    Write-Color cyan "No newer milestone found for $majorMinor on feed. Probing next major feed for $nextMajorMinor..."

    try {
        $nextServiceIndex = Invoke-RestMethod -Uri $nextFeedUrl
        $nextFlatContainer = $nextServiceIndex.resources | Where-Object { $_.'@type' -match 'PackageBaseAddress' } | Select-Object -First 1
        If (-not $nextFlatContainer) { Return $null }

        $nextBaseUrl = $nextFlatContainer.'@id'
        $nextVersionsUrl = "${nextBaseUrl}microsoft.netcore.app.ref/index.json"
        $nextVersionsResult = Invoke-RestMethod -Uri $nextVersionsUrl

        If ($nextVersionsResult.versions -and $nextVersionsResult.versions.Count -gt 0) {
            ForEach ($v in $nextVersionsResult.versions) {
                $parsed = $null
                try { $parsed = ParseVersionString $v "probe" } catch { Continue }
                If ($parsed.MajorMinor -eq $nextMajorMinor) {
                    Return @{ MajorMinor = $parsed.MajorMinor; PrereleaseLabel = $parsed.PrereleaseLabel }
                }
            }
        }
    }
    catch {
        Write-Color yellow "Could not probe next major feed: $_"
    }

    Return $null
}

Function DiscoverVersionFromFeed {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $feedUrl
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $label # "Previous" or "Current", for error messages
        ,
        [Parameter(Mandatory = $false)]
        [ValidateSet("NETCore", "AspNetCore", "WindowsDesktop")]
        [string]
        $sdkName = "NETCore"
    )

    $refPackageName = "Microsoft.$sdkName.App.Ref"
    $pkgIdLower = $refPackageName.ToLower()

    Write-Color cyan "Discovering $label version of $refPackageName from feed '$feedUrl'..."

    $serviceIndex = Invoke-RestMethod -Uri $feedUrl
    $flatContainer = $serviceIndex.resources | Where-Object { $_.'@type' -match 'PackageBaseAddress' } | Select-Object -First 1

    If (-not $flatContainer) {
        Write-Error "Could not find PackageBaseAddress endpoint in feed '$feedUrl'. Please specify -${label}MajorMinor and -${label}PrereleaseLabel explicitly." -ErrorAction Stop
    }

    $baseUrl = $flatContainer.'@id'
    $versionsUrl = "${baseUrl}${pkgIdLower}/index.json"
    $versionsResult = Invoke-RestMethod -Uri $versionsUrl

    If (-not $versionsResult.versions -or $versionsResult.versions.Count -eq 0) {
        Write-Error "No versions of $refPackageName found on feed '$feedUrl'. Please specify -${label}MajorMinor and -${label}PrereleaseLabel explicitly." -ErrorAction Stop
    }

    $latestVersion = $versionsResult.versions | Select-Object -Last 1
    Write-Color cyan "Latest $refPackageName version on feed: $latestVersion"

    Return ParseVersionString $latestVersion $label
}

Function Write-Color {
    Param (
        [ValidateNotNullOrEmpty()]
        [string] $newColor
    )

    If ($args) {
        Write-Host ($args -join ' ') -ForegroundColor $newColor
    }
    Else {
        $input | ForEach-Object { Write-Host $_ -ForegroundColor $newColor }
    }
}

Function VerifyPathOrExit {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $path
    )

    If (-Not (Test-Path -Path $path)) {
        Write-Error "The path '$path' does not exist." -ErrorAction Stop
    }
}

Function RemoveFolderIfExists {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $path
    )

    If (Test-Path -Path $path) {
        Write-Color yellow "Removing existing folder: $path"
        Remove-Item -Recurse -Path $path
    }
}

Function RecreateFolder {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $path
    )

    RemoveFolderIfExists $path

    Write-Color cyan "Creating new folder: $path"
    New-Item -ItemType Directory -Path $path
}

Function VerifyCountDlls {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $path
    )

    VerifyPathOrExit $path

    $count = (Get-ChildItem -Path $path -Filter "*.dll" | Measure-Object).Count
    If ($count -eq 0) {
        Write-Error "There are no DLL files inside the folder." -ErrorAction Stop
    }
}

Function GetDotNetFullName {
    Param (
        [Parameter(Mandatory = $true)]
        [bool]
        $IsComparingReleases
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $dotNetVersion # 7.0, 8.0, 9.0, ...
        ,
        [Parameter(Mandatory = $true)]
        [string]
        [ValidateSet("preview", "rc", "ga")]
        $releaseKind
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $previewNumberVersion # 0, 1, 2, 3, ...
    )

    If ($IsComparingReleases) {
        Return "$dotNetVersion.$previewNumberVersion"
    }

    If ($releaseKind -eq "ga") {
        If ($previewNumberVersion -eq "0") {
            # Example: Don't return "7.0-ga0", instead just return "7.0-ga"
            Return "$dotNetVersion-$releaseKind"
        }

        # Examples: Don't include "ga", instead just return "7.0.1", "7.0.2"
        Return "$dotNetVersion.$previewNumberVersion"
    }

    # Examples: "7.0-preview5", "7.0-rc2", "7.0-ga"
    Return "$dotNetVersion-$releaseKind$previewNumberVersion"
}

Function GetDotNetFriendlyName {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $DotNetVersion # 7.0, 8.0, 9.0, ...
        ,
        [Parameter(Mandatory = $true)]
        [string]
        [ValidateSet("preview", "rc", "ga")]
        $releaseKind
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $PreviewNumberVersion # 0, 1, 2, 3, ...
    )

    $friendlyPreview = ""
    If ($releaseKind -eq "preview") {
        $friendlyPreview = "Preview"
    }
    ElseIf ($releaseKind -eq "rc") {
        $friendlyPreview = "RC"
    }
    ElseIf ($releaseKind -eq "ga") {
        $friendlyPreview = "GA"
        If ($PreviewNumberVersion -eq 0) {
            # Example: Don't return "7.0 GA 0", instead just return "7.0 GA"
            Return ".NET $DotNetVersion $friendlyPreview"
        }

        # Examples: Don't include "ga", instead just return "7.0.1", "7.0.2"
        Return ".NET $DotNetVersion.$PreviewNumberVersion"
    }

    # Examples: "7.0 Preview 5", "7.0 RC 2"
    Return ".NET $DotNetVersion $friendlyPreview $PreviewNumberVersion"
}

Function GetReleaseKindFolderName {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $dotNetVersion # 7.0, 8.0, 9.0, ...
        ,
        [Parameter(Mandatory = $true)]
        [string]
        [ValidateSet("preview", "rc", "ga")]
        $releaseKind
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $previewNumberVersion # 0, 1, 2, 3, ...
    )

    If ($releaseKind -eq "ga") {
        If ($previewNumberVersion -eq "0") {
            # return "ga", not "ga0"
            Return $releaseKind
        }

        # return "7.0.1", "7.0.2", not "ga1, ga2"
        Return "$dotNetVersion.$previewNumberVersion"
    }

    Return "$releaseKind$previewNumberVersion"
}

Function GetPreviewFolderPath {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $rootFolder
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $dotNetVersion # 7.0, 8.0, 9.0, ...
        ,
        [Parameter(Mandatory = $true)]
        [string]
        [ValidateSet("preview", "rc", "ga")]
        $releaseKind
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $previewNumberVersion # 0, 1, 2, 3, ...
        ,
        [Parameter(Mandatory = $true)]
        [bool]
        $IsComparingReleases # True when comparing 8.0 GA with 9.0 GA
    )

    $prefixFolder = [IO.Path]::Combine($rootFolder, "release-notes", $dotNetVersion)
    $apiDiffFolderName = "api-diff"

    If ($IsComparingReleases) {
        Return [IO.Path]::Combine($prefixFolder, "$dotNetVersion.$previewNumberVersion", $apiDiffFolderName)
    }

    $releaseKindFolderName = GetReleaseKindFolderName $dotNetVersion $releaseKind $previewNumberVersion
    Return [IO.Path]::Combine($prefixFolder, "preview", $releaseKindFolderName, $apiDiffFolderName)
}

Function RunApiDiff {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $apiDiffExe
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $outputFolder
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $beforeFolder
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $afterFolder
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $tableOfContentsFileNamePrefix
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $assembliesToExclude
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $attributesToExclude
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $beforeFriendlyName
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $afterFriendlyName
        ,
        [Parameter(Mandatory = $false)]
        [string]
        $beforeReferenceFolder = ""
        ,
        [Parameter(Mandatory = $false)]
        [string]
        $afterReferenceFolder = ""
    )

    VerifyPathOrExit $apiDiffExe
    VerifyPathOrExit $beforeFolder
    VerifyPathOrExit $afterFolder

    $referenceParams = @()
    if (-not [string]::IsNullOrEmpty($beforeReferenceFolder) -and -not [string]::IsNullOrEmpty($afterReferenceFolder)) {
        VerifyPathOrExit $beforeReferenceFolder
        VerifyPathOrExit $afterReferenceFolder
        $referenceParams = @('-rb', $beforeReferenceFolder, '-ra', $afterReferenceFolder)
    }

    $arguments = @('-b', $beforeFolder, '-a', $afterFolder, '-o', $outputFolder, '-tc', $tableOfContentsFileNamePrefix, '-eas', $assembliesToExclude, '-eattrs', $attributesToExclude, '-bfn', $beforeFriendlyName, '-afn', $afterFriendlyName) + $referenceParams
    Write-Color yellow "& $apiDiffExe $arguments"
    & $apiDiffExe @arguments
}

Function CreateReadme {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $previewFolderPath
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $dotNetFriendlyName
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $dotNetFullName
        ,
        [Parameter(Mandatory = $true)]
        [string[]]
        $sdkNames
    )

    $readmePath = [IO.Path]::Combine($previewFolderPath, "README.md")
    If (Test-Path -Path $readmePath) {
        Remove-Item -Path $readmePath
    }
    New-Item -ItemType File $readmePath

    Add-Content $readmePath "# $dotNetFriendlyName API Changes"
    Add-Content $readmePath ""
    Add-Content $readmePath "The following API changes were made in $($dotNetFriendlyName):"
    Add-Content $readmePath ""
    ForEach ($sdk in $sdkNames) {
        Add-Content $readmePath "- [Microsoft.$sdk.App](./Microsoft.$sdk.App/$dotNetFullName.md)"
    }
}

Function DownloadPackage {
    Param
    (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $nuGetFeed
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $tmpFolder
        ,
        [Parameter(Mandatory = $true)]
        [ValidateSet("NETCore", "AspNetCore", "WindowsDesktop")]
        [string]
        $sdkName
        ,
        [Parameter(Mandatory = $true)]
        [ValidateSet("Before", "After")]
        [string]
        $beforeOrAfter
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $dotNetVersion
        ,
        [Parameter(Mandatory = $false)]
        [ValidateSet("preview", "rc", "ga", "")]
        [string]
        $releaseKind = ""
        ,
        [Parameter(Mandatory = $false)]
        [string]
        $previewNumberVersion = ""
        ,
        [Parameter(Mandatory = $false)]
        [string]
        $version = ""
        ,
        [ref]
        $resultingPath
    )

    $fullSdkName = "Microsoft.$sdkName.App"
    $destinationFolder = [IO.Path]::Combine($tmpFolder, "$fullSdkName.$beforeOrAfter")
    RecreateFolder $destinationFolder

    $refPackageName = "$fullSdkName.Ref"

    # Get service index and flat2 base URL (used for both version search and download)
    $serviceIndex = Invoke-RestMethod -Uri $nuGetFeed
    $flatContainer = $serviceIndex.resources | Where-Object { $_.'@type' -match 'PackageBaseAddress' } | Select-Object -First 1
    $flatBaseUrl = If ($flatContainer) { $flatContainer.'@id' } Else { "" }

    # If exact version is provided, use it directly
    If (-Not ([System.String]::IsNullOrWhiteSpace($version))) {
        Write-Color cyan "Using exact package version: $version"
    }
    Else {
        If ([System.String]::IsNullOrWhiteSpace($releaseKind) -or [System.String]::IsNullOrWhiteSpace($previewNumberVersion)) {
            Write-Error "Either -version or both -releaseKind and -previewNumberVersion must be provided to DownloadPackage." -ErrorAction Stop
        }

        # Search for the package version
        $searchTerm = ""
        If ($releaseKind -eq "ga") {
            $searchTerm = "$dotNetVersion.$previewNumberVersion"
        }
        Else {
            $searchTerm = "$dotNetVersion.*-$releaseKind.$previewNumberVersion*"
        }

        # Try flat2 (PackageBaseAddress) first — works reliably on all feeds including per-build shipping feeds
        $version = ""

        If ($flatBaseUrl) {
            $pkgIdLower = $refPackageName.ToLower()
            $versionsUrl = "$flatBaseUrl$pkgIdLower/index.json"
            Write-Color cyan "Searching for package '$refPackageName' matching '$searchTerm' via flat2 in feed '$nuGetFeed'..."

            try {
                $versionsResult = Invoke-RestMethod -Uri $versionsUrl
                $matchingVersions = @($versionsResult.versions | Where-Object { $_ -Like $searchTerm } | Sort-Object -Descending)

                If ($matchingVersions.Count -gt 0) {
                    $version = $matchingVersions[0]
                    Write-Color green "Found version '$version' via flat2."
                }
            }
            catch {
                Write-Color yellow "Flat2 lookup failed for '$refPackageName': $_"
            }
        }

        # Fall back to SearchQueryService if flat2 didn't find a match
        If ([System.String]::IsNullOrWhiteSpace($version)) {
            Write-Color cyan "Searching for package '$refPackageName' matching '$searchTerm' via search in feed '$nuGetFeed'..."

            $searchQueryService = $serviceIndex.resources | Where-Object { $_.'@type' -match 'SearchQueryService' } | Select-Object -First 1

            if (-not $searchQueryService) {
                Write-Error "Could not find SearchQueryService endpoint in feed '$nuGetFeed'" -ErrorAction Stop
            }

            $searchUrl = $searchQueryService.'@id'

            $searchParams = @{
                Uri = "$searchUrl`?q=$refPackageName&prerelease=true&take=1"
            }

            $searchResults = Invoke-RestMethod @searchParams

            If (-not $searchResults.data -or $searchResults.data.Count -eq 0) {
                Write-Error "No NuGet packages found with ref package name '$refPackageName' in feed '$nuGetFeed'" -ErrorAction Stop
            }

            $package = $searchResults.data | Where-Object { $_.id -eq $refPackageName } | Select-Object -First 1

            If (-not $package) {
                Write-Error "Package '$refPackageName' not found in search results" -ErrorAction Stop
            }

            # Filter versions matching search term
            $matchingVersions = @($package.versions | Where-Object -Property version -Like $searchTerm | Sort-Object version -Descending)

            If ($matchingVersions.Count -eq 0) {
                Write-Error "No NuGet packages found with search term '$searchTerm'." -ErrorAction Stop
            }

            $version = $matchingVersions[0].version
        }
    }
    
    $nupkgFile = [IO.Path]::Combine($tmpFolder, "$refPackageName.$version.nupkg")

    If (-Not(Test-Path -Path $nupkgFile)) {
        # Construct download URL using flat2 base URL from the service index
        $pkgIdLower = $refPackageName.ToLower()
        If ($flatBaseUrl) {
            $nupkgUrl = "$flatBaseUrl$pkgIdLower/$version/$pkgIdLower.$version.nupkg"
        }
        ElseIf ($nuGetFeed -eq "https://api.nuget.org/v3/index.json") {
            $nupkgUrl = "https://www.nuget.org/api/v2/package/$refPackageName/$version"
        }
        Else {
            Write-Error "Could not determine download URL for package '$refPackageName' version '$version'. No PackageBaseAddress endpoint found in feed '$nuGetFeed'." -ErrorAction Stop
        }

        Write-Color yellow "Downloading '$nupkgUrl' to '$nupkgFile'..."
        Invoke-WebRequest -Uri $nupkgUrl -OutFile $nupkgFile
        VerifyPathOrExit $nupkgFile
    }
    Else {
        Write-Color green "File '$nupkgFile' already exists locally. Skipping re-download."
    }

    Expand-Archive -Path $nupkgFile -DestinationPath $destinationFolder -ErrorAction Stop

    $dllPath = [IO.Path]::Combine($destinationFolder, "ref", "net$dotNetVersion")
    VerifyPathOrExit $dllPath
    VerifyCountDlls $dllPath
    $resultingPath.value = $dllPath
}

Function ProcessSdk
{
    Param(
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $sdkName
    ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $previewFolderPath
    ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $tmpFolder
    ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $previousNuGetFeed
    ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $currentNuGetFeed
    ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $apiDiffExe
    ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $currentDotNetFullName
    ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $assembliesToExclude
    ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $attributesToExclude
    ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $previousDotNetFriendlyName
    ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $currentDotNetFriendlyName
    ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $previousMajorMinor
    ,
        [Parameter(Mandatory = $true)]
        [ValidateSet("preview", "rc", "ga")]
        [string]
        $previousReleaseKind
    ,
        [Parameter(Mandatory = $true)]
        [string]
        $previousPreviewRCNumber
    ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $currentMajorMinor
    ,
        [Parameter(Mandatory = $true)]
        [ValidateSet("preview", "rc", "ga")]
        [string]
        $currentReleaseKind
    ,
        [Parameter(Mandatory = $true)]
        [string]
        $currentPreviewRCNumber
    ,
        [Parameter(Mandatory = $false)]
        [string]
        $previousVersion = ""
    ,
        [Parameter(Mandatory = $false)]
        [string]
        $currentVersion = ""
    )

    # For non-NETCore SDKs, don't pass exact NETCore version — versions may differ across frameworks (pre-.NET 10)
    $sdkPreviousVersion = If ($sdkName -eq "NETCore") { $previousVersion } Else { "" }
    $sdkCurrentVersion = If ($sdkName -eq "NETCore") { $currentVersion } Else { "" }

    $beforeDllFolder = ""
    DownloadPackage -nuGetFeed $previousNuGetFeed -tmpFolder $tmpFolder -sdkName $sdkName -beforeOrAfter "Before" -dotNetVersion $previousMajorMinor -releaseKind $previousReleaseKind -previewNumberVersion $previousPreviewRCNumber -version $sdkPreviousVersion -resultingPath ([ref]$beforeDllFolder)
    VerifyPathOrExit $beforeDllFolder

    $afterDllFolder = ""
    DownloadPackage -nuGetFeed $currentNuGetFeed -tmpFolder $tmpFolder -sdkName $sdkName -beforeOrAfter "After" -dotNetVersion $currentMajorMinor -releaseKind $currentReleaseKind -previewNumberVersion $currentPreviewRCNumber -version $sdkCurrentVersion -resultingPath ([ref]$afterDllFolder)
    VerifyPathOrExit $afterDllFolder

    # For AspNetCore and WindowsDesktop, also download NETCore references to provide core assemblies
    $beforeReferenceFolder = ""
    $afterReferenceFolder = ""
    if ($sdkName -eq "AspNetCore" -or $sdkName -eq "WindowsDesktop") {
        DownloadPackage -nuGetFeed $previousNuGetFeed -tmpFolder $tmpFolder -sdkName "NETCore" -beforeOrAfter "Before" -dotNetVersion $previousMajorMinor -releaseKind $previousReleaseKind -previewNumberVersion $previousPreviewRCNumber -version $previousVersion -resultingPath ([ref]$beforeReferenceFolder)
        VerifyPathOrExit $beforeReferenceFolder
        
        DownloadPackage -nuGetFeed $currentNuGetFeed -tmpFolder $tmpFolder -sdkName "NETCore" -beforeOrAfter "After" -dotNetVersion $currentMajorMinor -releaseKind $currentReleaseKind -previewNumberVersion $currentPreviewRCNumber -version $currentVersion -resultingPath ([ref]$afterReferenceFolder)
        VerifyPathOrExit $afterReferenceFolder
    }

    $targetFolder = [IO.Path]::Combine($previewFolderPath, "Microsoft.$sdkName.App")
    RecreateFolder $targetFolder

    RunApiDiff -apiDiffExe $apiDiffExe -outputFolder $targetFolder -beforeFolder $beforeDllFolder -afterFolder $afterDllFolder -tableOfContentsFileNamePrefix $currentDotNetFullName -assembliesToExclude $assembliesToExclude -attributesToExclude $attributesToExclude -beforeFriendlyName $previousDotNetFriendlyName -afterFriendlyName $currentDotNetFriendlyName -beforeReferenceFolder $beforeReferenceFolder -afterReferenceFolder $afterReferenceFolder
}

#####################
### End Functions ###
#####################

#######################
### Start Execution ###
#######################

if ($PSVersionTable.PSVersion.Major -lt 7) {
    Write-Error "This script requires PowerShell 7.0 or later.  See  https://aka.ms/PSWindows for instructions." -ErrorAction Stop
}

## Resolve CoreRepo and scriptDir early (needed for api-diff scanning and exclude file paths)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

If ([System.String]::IsNullOrWhiteSpace($CoreRepo)) {
    try {
        $CoreRepo = git -C $scriptDir rev-parse --show-toplevel 2>$null
    }
    catch { }

    If ([System.String]::IsNullOrWhiteSpace($CoreRepo)) {
        Write-Error "Could not determine the git repository root from '$scriptDir'. Please specify -CoreRepo explicitly." -ErrorAction Stop
    }

    Write-Color cyan "Using git repo root: $CoreRepo"
}

$CoreRepo = [System.IO.Path]::GetFullPath((Resolve-Path $CoreRepo).Path)

## Extract MajorMinor and PrereleaseLabel from explicit Version parameters if provided
If (-not [System.String]::IsNullOrWhiteSpace($PreviousVersion)) {
    $parsed = ParseVersionString $PreviousVersion "Previous"
    If ([System.String]::IsNullOrWhiteSpace($PreviousMajorMinor)) { $PreviousMajorMinor = $parsed.MajorMinor }
    If ([System.String]::IsNullOrWhiteSpace($PreviousPrereleaseLabel)) { $PreviousPrereleaseLabel = $parsed.PrereleaseLabel }
    Write-Color green "Parsed from PreviousVersion: MajorMinor=$PreviousMajorMinor, PrereleaseLabel=$(If ($PreviousPrereleaseLabel) { $PreviousPrereleaseLabel } Else { 'GA' })"
}

If (-not [System.String]::IsNullOrWhiteSpace($CurrentVersion)) {
    $parsed = ParseVersionString $CurrentVersion "Current"
    If ([System.String]::IsNullOrWhiteSpace($CurrentMajorMinor)) { $CurrentMajorMinor = $parsed.MajorMinor }
    If ([System.String]::IsNullOrWhiteSpace($CurrentPrereleaseLabel)) { $CurrentPrereleaseLabel = $parsed.PrereleaseLabel }
    Write-Color green "Parsed from CurrentVersion: MajorMinor=$CurrentMajorMinor, PrereleaseLabel=$(If ($CurrentPrereleaseLabel) { $CurrentPrereleaseLabel } Else { 'GA' })"
}

## Infer current and previous versions from existing api-diffs if not provided
If ([System.String]::IsNullOrWhiteSpace($CurrentMajorMinor) -and [System.String]::IsNullOrWhiteSpace($CurrentPrereleaseLabel) -and [System.String]::IsNullOrWhiteSpace($CurrentNuGetFeed)) {
    $latestApiDiff = FindLatestApiDiff $CoreRepo
    If ($latestApiDiff) {
        $latestDesc = If ($latestApiDiff.PrereleaseLabel) { "$($latestApiDiff.MajorMinor)-$($latestApiDiff.PrereleaseLabel)" } Else { "$($latestApiDiff.MajorMinor) GA" }
        Write-Color cyan "Latest existing api-diff: $latestDesc"

        # Probe the feed for the next version after the latest api-diff
        $latestMajorVersion = [int]($latestApiDiff.MajorMinor.Split(".")[0])
        $probeFeedUrl = GetDncEngFeedUrl $latestMajorVersion
        $next = GetNextVersionFromFeed $latestApiDiff.MajorMinor $latestApiDiff.PrereleaseLabel $probeFeedUrl

        If ($next) {
            $CurrentMajorMinor = $next.MajorMinor
            $CurrentPrereleaseLabel = $next.PrereleaseLabel
            $nextDesc = If ($CurrentPrereleaseLabel) { "$CurrentMajorMinor-$CurrentPrereleaseLabel" } Else { "$CurrentMajorMinor GA" }
            Write-Color green "Discovered next version from feed: $nextDesc"
        } Else {
            Write-Error "Could not discover the next version from feed '$probeFeedUrl' after $latestDesc. Specify -CurrentMajorMinor and -CurrentPrereleaseLabel explicitly." -ErrorAction Stop
        }

        # Also infer previous from the latest api-diff if not explicitly provided
        If ([System.String]::IsNullOrWhiteSpace($PreviousMajorMinor) -and [System.String]::IsNullOrWhiteSpace($PreviousPrereleaseLabel) -and [System.String]::IsNullOrWhiteSpace($PreviousVersion)) {
            $PreviousMajorMinor = $latestApiDiff.MajorMinor
            $PreviousPrereleaseLabel = $latestApiDiff.PrereleaseLabel
            Write-Color green "Inferred previous version: $latestDesc"
        }
    }
}

## Construct default CurrentNuGetFeed from CurrentMajorMinor if not provided
If ([System.String]::IsNullOrWhiteSpace($CurrentNuGetFeed)) {
    If (-not [System.String]::IsNullOrWhiteSpace($CurrentMajorMinor)) {
        $currentMajorVersion = [int]($CurrentMajorMinor.Split(".")[0])
        $CurrentNuGetFeed = GetDncEngFeedUrl $currentMajorVersion
        Write-Color cyan "Using default current feed: $CurrentNuGetFeed"
    } Else {
        Write-Error "CurrentNuGetFeed could not be determined. Specify -CurrentMajorMinor, -CurrentVersion, or -CurrentNuGetFeed." -ErrorAction Stop
    }
}

## Construct default PreviousNuGetFeed from PreviousMajorMinor if not provided
If ([System.String]::IsNullOrWhiteSpace($PreviousNuGetFeed)) {
    If (-not [System.String]::IsNullOrWhiteSpace($PreviousMajorMinor)) {
        $previousMajorVersion = [int]($PreviousMajorMinor.Split(".")[0])
        $PreviousNuGetFeed = GetDncEngFeedUrl $previousMajorVersion
        Write-Color cyan "Using default previous feed: $PreviousNuGetFeed"
    }
}

## Discover version info from feeds if not provided
If ([System.String]::IsNullOrWhiteSpace($PreviousMajorMinor) -and [System.String]::IsNullOrWhiteSpace($PreviousPrereleaseLabel)) {
    $discovered = DiscoverVersionFromFeed $PreviousNuGetFeed "Previous"
    $PreviousMajorMinor = $discovered.MajorMinor
    $PreviousPrereleaseLabel = $discovered.PrereleaseLabel
    Write-Color green "Discovered previous: $PreviousMajorMinor $(If ($PreviousPrereleaseLabel) { $PreviousPrereleaseLabel } Else { 'GA' })"
} ElseIf ([System.String]::IsNullOrWhiteSpace($PreviousMajorMinor)) {
    $discovered = DiscoverVersionFromFeed $PreviousNuGetFeed "Previous"
    $PreviousMajorMinor = $discovered.MajorMinor
    Write-Color green "Discovered previous major.minor: $PreviousMajorMinor"
}

If ([System.String]::IsNullOrWhiteSpace($CurrentMajorMinor) -and [System.String]::IsNullOrWhiteSpace($CurrentPrereleaseLabel)) {
    $discovered = DiscoverVersionFromFeed $CurrentNuGetFeed "Current"
    $CurrentMajorMinor = $discovered.MajorMinor
    $CurrentPrereleaseLabel = $discovered.PrereleaseLabel
    Write-Color green "Discovered current: $CurrentMajorMinor $(If ($CurrentPrereleaseLabel) { $CurrentPrereleaseLabel } Else { 'GA' })"
} ElseIf ([System.String]::IsNullOrWhiteSpace($CurrentMajorMinor)) {
    $discovered = DiscoverVersionFromFeed $CurrentNuGetFeed "Current"
    $CurrentMajorMinor = $discovered.MajorMinor
    Write-Color green "Discovered current major.minor: $CurrentMajorMinor"
}

## Parse prerelease labels into internal variables used by the rest of the script
$previousParsed = ParsePrereleaseLabel $PreviousPrereleaseLabel
$PreviousReleaseKind = $previousParsed.ReleaseKind
$PreviousPreviewRCNumber = $previousParsed.PreviewRCNumber

$currentParsed = ParsePrereleaseLabel $CurrentPrereleaseLabel
$CurrentReleaseKind = $currentParsed.ReleaseKind
$CurrentPreviewRCNumber = $currentParsed.PreviewRCNumber

# Validate required values are present
If ([System.String]::IsNullOrWhiteSpace($PreviousMajorMinor)) {
    Write-Error "PreviousMajorMinor is required. Specify it explicitly or provide -PreviousNuGetFeed to auto-discover." -ErrorAction Stop
}
If ([System.String]::IsNullOrWhiteSpace($CurrentMajorMinor)) {
    Write-Error "CurrentMajorMinor is required. Specify it explicitly or provide -CurrentNuGetFeed to auto-discover." -ErrorAction Stop
}

# Validate that previous and current versions are different
If ($PreviousMajorMinor -eq $CurrentMajorMinor -and $PreviousPrereleaseLabel -eq $CurrentPrereleaseLabel) {
    $previousDesc = If ($PreviousPrereleaseLabel) { "$PreviousMajorMinor-$PreviousPrereleaseLabel" } Else { "$PreviousMajorMinor GA" }
    Write-Error "Previous and current versions are the same ($previousDesc). Ensure -PreviousNuGetFeed and -CurrentNuGetFeed point to different versions, or specify version parameters explicitly." -ErrorAction Stop
}

# True when comparing GA releases
$IsComparingReleases = ($PreviousMajorMinor -Ne $CurrentMajorMinor) -And ($PreviousReleaseKind -Eq "ga") -And ($CurrentReleaseKind -eq "ga")

## Resolve exclude file paths relative to the script's directory if they are relative paths
If (-not [System.IO.Path]::IsPathRooted($AttributesToExcludeFilePath)) {
    $AttributesToExcludeFilePath = [IO.Path]::Combine($scriptDir, $AttributesToExcludeFilePath)
}
If (-not [System.IO.Path]::IsPathRooted($AssembliesToExcludeFilePath)) {
    $AssembliesToExcludeFilePath = [IO.Path]::Combine($scriptDir, $AssembliesToExcludeFilePath)
}

## Create a temp folder if not provided
If ([System.String]::IsNullOrWhiteSpace($TmpFolder)) {
    $TmpFolder = Join-Path ([System.IO.Path]::GetTempPath()) ([System.IO.Path]::GetRandomFileName())
    New-Item -ItemType Directory -Path $TmpFolder | Out-Null
    Write-Color cyan "Using temp folder: $TmpFolder"
} Else {
    $TmpFolder = [System.IO.Path]::GetFullPath((Resolve-Path $TmpFolder).Path)
}

## Check folders passed as parameters exist
VerifyPathOrExit $CoreRepo
VerifyPathOrExit $TmpFolder

$currentMajorVersion = [int]($CurrentMajorMinor.Split(".")[0])
$transportFeedUrl = GetDncEngFeedUrl $currentMajorVersion -Transport
$InstallApiDiffCommand = "dotnet tool install --global Microsoft.DotNet.ApiDiff.Tool --source $transportFeedUrl --prerelease"

if ($InstallApiDiff) {
    Write-Color white "Installing ApiDiff tool..."
    Write-Color yellow $InstallApiDiffCommand
    Invoke-Expression $InstallApiDiffCommand
}

$apiDiffCommand = get-command "apidiff" -ErrorAction SilentlyContinue

if (-Not $apiDiffCommand) 
{
     Write-Error "The command apidiff could not be found.  Please first install the tool using the following command: $InstallApiDiffCommand" -ErrorAction Stop
}

$apiDiffExe = $apiDiffCommand.Source

## Create api-diff folder in core repo folder if it doesn't exist

$previewFolderPath = GetPreviewFolderPath $CoreRepo $CurrentMajorMinor $CurrentReleaseKind $CurrentPreviewRCNumber $IsComparingReleases
If (-Not (Test-Path -Path $previewFolderPath))
{
    Write-Color white "Creating new diff folder: $previewFolderPath"
    New-Item -ItemType Directory -Path $previewFolderPath
}

## Run the ApiDiff commands

# Example: "10.0-preview2"
$currentDotNetFullName = GetDotNetFullName $IsComparingReleases $CurrentMajorMinor $CurrentReleaseKind $CurrentPreviewRCNumber

# Examples: ".NET 10 Preview 1" and ".NET 10 Preview 2"
$previousDotNetFriendlyName = GetDotNetFriendlyName $PreviousMajorMinor $PreviousReleaseKind $PreviousPreviewRCNumber
$currentDotNetFriendlyName = GetDotNetFriendlyName $CurrentMajorMinor $CurrentReleaseKind $CurrentPreviewRCNumber

$sdksToProcess = @()
If (-Not $ExcludeNetCore) { $sdksToProcess += "NETCore" }
If (-Not $ExcludeAspNetCore) { $sdksToProcess += "AspNetCore" }
If (-Not $ExcludeWindowsDesktop) { $sdksToProcess += "WindowsDesktop" }

$commonParams = @{
    previewFolderPath = $previewFolderPath
    tmpFolder = $TmpFolder
    previousNuGetFeed = $PreviousNuGetFeed
    currentNuGetFeed = $CurrentNuGetFeed
    apiDiffExe = $apiDiffExe
    currentDotNetFullName = $currentDotNetFullName
    assembliesToExclude = $AssembliesToExcludeFilePath
    attributesToExclude = $AttributesToExcludeFilePath
    previousDotNetFriendlyName = $previousDotNetFriendlyName
    currentDotNetFriendlyName = $currentDotNetFriendlyName
    previousMajorMinor = $PreviousMajorMinor
    previousReleaseKind = $PreviousReleaseKind
    previousPreviewRCNumber = $PreviousPreviewRCNumber
    currentMajorMinor = $CurrentMajorMinor
    currentReleaseKind = $CurrentReleaseKind
    currentPreviewRCNumber = $CurrentPreviewRCNumber
    previousVersion = $PreviousVersion
    currentVersion = $CurrentVersion
}

ForEach ($sdk in $sdksToProcess) {
    ProcessSdk -sdkName $sdk @commonParams
}

CreateReadme $previewFolderPath $currentDotNetFriendlyName $currentDotNetFullName $sdksToProcess

#####################
### End Execution ###
#####################
