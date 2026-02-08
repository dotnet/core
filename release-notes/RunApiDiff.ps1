# This script allows running API-diff to generate the dotnet/core report that compares the APIs introduced between two previews, in the format expected for publishing in the dotnet/core repo.

# Prerequisites:
# - PowerShell 7.0 or later
# - Azure CLI (az) installed and logged in (required for authenticated Azure DevOps feeds): Run 'az login' before using private feeds

# Usage:

# RunApiDiff.ps1
# -PreviousMajorMinor        : The 'before' .NET version: '6.0', '7.0', '8.0', etc. If not specified, discovered from -PreviousNuGetFeed.
# -PreviousPrereleaseLabel      : The prerelease label for the 'before' version (e.g., "preview.7", "rc.1"). Omit for GA releases. If not specified, discovered from -PreviousNuGetFeed.
# -CurrentMajorMinor           : The 'after' .NET version: '6.0', '7.0', '8.0', etc. If not specified, discovered from -CurrentNuGetFeed.
# -CurrentPrereleaseLabel       : The prerelease label for the 'after' version (e.g., "preview.7", "rc.1"). Omit for GA releases. If not specified, discovered from -CurrentNuGetFeed.
# -CoreRepo                     : The full path to your local clone of the dotnet/core repo. If not specified, defaults to the git repository root relative to this script.
# -TmpFolder                    : The full path to the folder where the assets will be downloaded, extracted and compared. If not specified, a temporary folder is created automatically.
# -AttributesToExcludeFilePath  : The full path to the file containing the attributes to exclude from the report. By default, it is "ApiDiffAttributesToExclude.txt" in the same folder as this script.
# -AssembliesToExcludeFilePath  : The full path to the file containing the assemblies to exclude from the report. By default, it is "ApiDiffAssembliesToExclude.txt" in the same folder as this script.
# -PreviousNuGetFeed            : The NuGet feed URL to use for downloading previous/before packages. By default, uses https://api.nuget.org/v3/index.json
# -CurrentNuGetFeed             : The NuGet feed URL to use for downloading current/after packages. By default, uses https://api.nuget.org/v3/index.json
# -ExcludeNetCore               : Switch to exclude the NETCore comparison.
# -ExcludeAspNetCore            : Switch to exclude the AspNetCore comparison.
# -ExcludeWindowsDesktop        : Switch to exclude the WindowsDesktop comparison.
# -InstallApiDiff               : Switch to install or update the ApiDiff tool before running.
# -PreviousVersion       : Optional exact package version for the previous/before comparison (e.g., "10.0.0-preview.7.25380.108"). Overrides version search logic.
# -CurrentVersion        : Optional exact package version for the current/after comparison (e.g., "10.0.0-rc.1.25451.107"). Overrides version search logic.

# Example — simplest usage with auto-discovery:
# .\RunApiDiff.ps1 <staging-feed-url>

# Example — explicit version parameters:
# .\RunApiDiff.ps1 -PreviousMajorMinor 10.0 -PreviousPrereleaseLabel preview.7 -CurrentMajorMinor 10.0 -CurrentPrereleaseLabel rc.1 -CurrentNuGetFeed https://api.nuget.org/v3/index.json

# Example with exact package versions (MajorMinor and PrereleaseLabel are extracted automatically):
# .\RunApiDiff.ps1 -PreviousVersion "10.0.0-preview.7.25380.108" -CurrentVersion "10.0.0-rc.1.25451.107"

Param (
    [Parameter(Mandatory = $false)]
    [ValidatePattern("(\d+\.\d)?")]
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
    [ValidatePattern("(\d+\.\d)?")]
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
    $CoreRepo #"D:\\core"
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
    [ValidateNotNullOrEmpty()]
    [string]
    $PreviousNuGetFeed = "https://api.nuget.org/v3/index.json"
    ,
    [Parameter(Mandatory = $false, Position = 0)]
    [string]
    $CurrentNuGetFeed = "https://api.nuget.org/v3/index.json"
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
    )

    Write-Color cyan "Discovering $label version from feed '$feedUrl'..."

    $headers = GetAuthHeadersForFeed $feedUrl
    $serviceIndex = Invoke-RestMethod -Uri $feedUrl -Headers $headers
    $flatContainer = $serviceIndex.resources | Where-Object { $_.'@type' -match 'PackageBaseAddress' } | Select-Object -First 1

    If (-not $flatContainer) {
        Write-Error "Could not find PackageBaseAddress endpoint in feed '$feedUrl'. Please specify -${label}MajorMinor and -${label}PrereleaseLabel explicitly." -ErrorAction Stop
    }

    $baseUrl = $flatContainer.'@id'
    $versionsUrl = "${baseUrl}microsoft.netcore.app.ref/index.json"
    $versionsResult = Invoke-RestMethod -Uri $versionsUrl -Headers $headers

    If (-not $versionsResult.versions -or $versionsResult.versions.Count -eq 0) {
        Write-Error "No versions of Microsoft.NETCore.App.Ref found on feed '$feedUrl'. Please specify -${label}MajorMinor and -${label}PrereleaseLabel explicitly." -ErrorAction Stop
    }

    $latestVersion = $versionsResult.versions | Select-Object -Last 1
    Write-Color cyan "Latest version on feed: $latestVersion"

    Return ParseVersionString $latestVersion $label
}

Function Write-Color {
    Param (
        [ValidateNotNullOrEmpty()]
        [string] $newColor
    )

    $oldColor = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $newColor

    If ($args) {
        Write-Output $args
    }
    Else {
        $input | Write-Output
    }

    $host.UI.RawUI.ForegroundColor = $oldColor
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
        $rootFolder #"D:\\core"
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
    Add-Content $readmePath "- [Microsoft.NETCore.App](./Microsoft.NETCore.App/$dotNetFullName.md)"
    Add-Content $readmePath "- [Microsoft.AspNetCore.App](./Microsoft.AspNetCore.App/$dotNetFullName.md)"
    Add-Content $readmePath "- [Microsoft.WindowsDesktop.App](./Microsoft.WindowsDesktop.App/$dotNetFullName.md)"
}

Function GetAuthHeadersForFeed {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $feedUrl
    )

    # Check if authentication is required (internal dnceng feeds)
    if ($feedUrl -match "dnceng/internal") {
        try {
            # Try to get Azure DevOps token using az CLI
            $token = az account get-access-token --resource "499b84ac-1321-427f-aa17-267ca6975798" --query accessToken -o tsv 2>$null
            if ($token) {
                Write-Host "Using Azure CLI authentication for internal Azure DevOps feed" -ForegroundColor Cyan
                return @{
                    Authorization = "Bearer $token"
                }
            }
            else {
                Write-Error "Could not get Azure DevOps token from Azure CLI. Please run 'az login' first." -ErrorAction Stop
            }
        }
        catch {
            Write-Error "Azure CLI not available or not logged in. Please run 'az login' first." -ErrorAction Stop
        }
    }
    
    return @{}
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
        [Parameter(Mandatory = $true)]
        [ValidateSet("preview", "rc", "ga")]
        [string]
        $releaseKind
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $previewNumberVersion
        ,
        [Parameter(Mandatory = $false)]
        [string]
        $version = ""
        ,
        [ref]
        $resultingPath
    )

    $fullSdkName = "Microsoft.$sdkName.App"
    $destinationFolder = [IO.Path]::Combine($TmpFolder, "$fullSdkName.$beforeOrAfter")
    RecreateFolder $destinationFolder

    $refPackageName = "$fullSdkName.Ref"

    # If exact version is provided, use it directly
    If (-Not ([System.String]::IsNullOrWhiteSpace($version))) {
        Write-Color cyan "Using exact package version: $version"
    }
    Else {
        # Otherwise, search for the package version
        $searchTerm = ""
        If ($releaseKind -eq "ga") {
            $searchTerm = "$dotNetVersion.$previewNumberVersion"
        }
        ElseIf (-Not ([System.String]::IsNullOrWhiteSpace($releaseKind)) -And -Not ([System.String]::IsNullOrWhiteSpace($previewNumberVersion))) {
            $searchTerm = "$dotNetVersion.*-$releaseKind.$previewNumberVersion*"
        }

        $headers = GetAuthHeadersForFeed $nuGetFeed

        # Get service index
        $serviceIndex = Invoke-RestMethod -Uri $nuGetFeed -Headers $headers

        # Try flat2 (PackageBaseAddress) first — works reliably on all feeds including per-build shipping feeds
        $flatContainer = $serviceIndex.resources | Where-Object { $_.'@type' -match 'PackageBaseAddress' } | Select-Object -First 1
        $version = ""

        If ($flatContainer) {
            $flatBaseUrl = $flatContainer.'@id'
            $pkgIdLower = $refPackageName.ToLower()
            $versionsUrl = "$flatBaseUrl$pkgIdLower/index.json"
            Write-Color cyan "Searching for package '$refPackageName' matching '$searchTerm' via flat2 in feed '$nuGetFeed'..."

            try {
                $versionsResult = Invoke-RestMethod -Uri $versionsUrl -Headers $headers
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
                Headers = $headers
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
    
    $nupkgFile = [IO.Path]::Combine($TmpFolder, "$refPackageName.$version.nupkg")

    If (-Not(Test-Path -Path $nupkgFile)) {
        # Construct download URL based on the feed
        if ($nuGetFeed -eq "https://api.nuget.org/v3/index.json") {
            # Use NuGet.org v2 API for downloads
            $nupkgUrl = "https://www.nuget.org/api/v2/package/$refPackageName/$version"
        }
        else {
            # Use flat2 pattern for all other feeds
            $baseUrl = $nuGetFeed -replace "/v3/index\.json$", ""
            $nupkgUrl = "$baseUrl/v3/flat2/$refPackageName/$version/$refPackageName.$version.nupkg"
        }

        Write-Color yellow "Downloading '$nupkgUrl' to '$nupkgFile'..."
        
        # Get authentication headers if required
        $headers = GetAuthHeadersForFeed $nuGetFeed
        
        if ($headers.Count -gt 0) {
            Invoke-WebRequest -Uri $nupkgUrl -OutFile $nupkgFile -Headers $headers
        }
        else {
            Invoke-WebRequest -Uri $nupkgUrl -OutFile $nupkgFile
        }
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

    $beforeDllFolder = ""
    DownloadPackage $previousNuGetFeed $sdkName "Before" $previousMajorMinor $previousReleaseKind $previousPreviewRCNumber $previousVersion ([ref]$beforeDllFolder)
    VerifyPathOrExit $beforeDllFolder

    $afterDllFolder = ""
    DownloadPackage $currentNuGetFeed $sdkName "After" $currentMajorMinor $currentReleaseKind $currentPreviewRCNumber $currentVersion ([ref]$afterDllFolder)
    VerifyPathOrExit $afterDllFolder

    # For AspNetCore and WindowsDesktop, also download NETCore references to provide core assemblies
    $beforeReferenceFolder = ""
    $afterReferenceFolder = ""
    if ($sdkName -eq "AspNetCore" -or $sdkName -eq "WindowsDesktop") {
        DownloadPackage $previousNuGetFeed "NETCore" "Before" $previousMajorMinor $previousReleaseKind $previousPreviewRCNumber $previousVersion ([ref]$beforeReferenceFolder)
        VerifyPathOrExit $beforeReferenceFolder
        
        DownloadPackage $currentNuGetFeed "NETCore" "After" $currentMajorMinor $currentReleaseKind $currentPreviewRCNumber $currentVersion ([ref]$afterReferenceFolder)
        VerifyPathOrExit $afterReferenceFolder
    }

    $targetFolder = [IO.Path]::Combine($previewFolderPath, "Microsoft.$sdkName.App")
    RecreateFolder $targetFolder

    RunApiDiff $apiDiffExe $targetFolder $beforeDllFolder $afterDllFolder $currentDotNetFullName $assembliesToExclude $attributesToExclude $previousDotNetFriendlyName $currentDotNetFriendlyName $beforeReferenceFolder $afterReferenceFolder
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

# True when comparing 8.0 GA with 9.0 GA
$IsComparingReleases = ($PreviousMajorMinor -Ne $CurrentMajorMinor) -And ($PreviousReleaseKind -Eq "ga") -And ($CurrentReleaseKind -eq "ga")

## Resolve CoreRepo if not provided
If ([System.String]::IsNullOrWhiteSpace($CoreRepo)) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    try {
        $CoreRepo = git -C $scriptDir rev-parse --show-toplevel 2>$null
    }
    catch { }

    If ([System.String]::IsNullOrWhiteSpace($CoreRepo)) {
        Write-Error "Could not determine the git repository root from '$scriptDir'. Please specify -CoreRepo explicitly." -ErrorAction Stop
    }

    Write-Color cyan "Using git repo root: $CoreRepo"
}

## Resolve paths to absolute to avoid issues with ~ or relative paths
$CoreRepo = [System.IO.Path]::GetFullPath((Resolve-Path $CoreRepo).Path)

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

$currentMajorVersion = $CurrentMajorMinor.Split(".")[0]
$InstallApiDiffCommand = "dotnet tool install --global Microsoft.DotNet.ApiDiff.Tool --source https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet$currentMajorVersion-transport/nuget/v3/index.json --prerelease"

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
## Recreate api-diff folder in core repo folder

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

If (-Not $ExcludeNetCore)
{
    ProcessSdk -sdkName "NETCore" -previousNuGetFeed $PreviousNuGetFeed -currentNuGetFeed $CurrentNuGetFeed -apiDiffExe $apiDiffExe -currentDotNetFullName $currentDotNetFullName -assembliesToExclude $AssembliesToExcludeFilePath -attributesToExclude $AttributesToExcludeFilePath -previousDotNetFriendlyName $previousDotNetFriendlyName -currentDotNetFriendlyName $currentDotNetFriendlyName -previousMajorMinor $PreviousMajorMinor -previousReleaseKind $PreviousReleaseKind -previousPreviewRCNumber $PreviousPreviewRCNumber -currentMajorMinor $CurrentMajorMinor -currentReleaseKind $CurrentReleaseKind -currentPreviewRCNumber $CurrentPreviewRCNumber -previousVersion $PreviousVersion -currentVersion $CurrentVersion
}

If (-Not $ExcludeAspNetCore)
{
    ProcessSdk -sdkName "AspNetCore" -previousNuGetFeed $PreviousNuGetFeed -currentNuGetFeed $CurrentNuGetFeed -apiDiffExe $apiDiffExe -currentDotNetFullName $currentDotNetFullName -assembliesToExclude $AssembliesToExcludeFilePath -attributesToExclude $AttributesToExcludeFilePath -previousDotNetFriendlyName $previousDotNetFriendlyName -currentDotNetFriendlyName $currentDotNetFriendlyName -previousMajorMinor $PreviousMajorMinor -previousReleaseKind $PreviousReleaseKind -previousPreviewRCNumber $PreviousPreviewRCNumber -currentMajorMinor $CurrentMajorMinor -currentReleaseKind $CurrentReleaseKind -currentPreviewRCNumber $CurrentPreviewRCNumber -previousVersion $PreviousVersion -currentVersion $CurrentVersion
}

If (-Not $ExcludeWindowsDesktop)
{
    ProcessSdk -sdkName "WindowsDesktop" -previousNuGetFeed $PreviousNuGetFeed -currentNuGetFeed $CurrentNuGetFeed -apiDiffExe $apiDiffExe -currentDotNetFullName $currentDotNetFullName -assembliesToExclude $AssembliesToExcludeFilePath -attributesToExclude $AttributesToExcludeFilePath -previousDotNetFriendlyName $previousDotNetFriendlyName -currentDotNetFriendlyName $currentDotNetFriendlyName -previousMajorMinor $PreviousMajorMinor -previousReleaseKind $PreviousReleaseKind -previousPreviewRCNumber $PreviousPreviewRCNumber -currentMajorMinor $CurrentMajorMinor -currentReleaseKind $CurrentReleaseKind -currentPreviewRCNumber $CurrentPreviewRCNumber -previousVersion $PreviousVersion -currentVersion $CurrentVersion
}

CreateReadme $previewFolderPath $currentDotNetFriendlyName $currentDotNetFullName

#####################
### End Execution ###
#####################
