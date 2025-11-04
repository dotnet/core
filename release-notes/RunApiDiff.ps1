# This script allows running API-diff to generate the dotnet/core report that compares the APIs introduced between two previews, in the format expected for publishing in the dotnet/core repo.

# Prerequisites:
# - PowerShell 7.0 or later
# - Azure CLI (az) installed and logged in (required for authenticated Azure DevOps feeds): Run 'az login' before using private feeds

# Usage:

# RunApiDiff.ps1
# -PreviousDotNetVersion        : The 'before' .NET version: '6.0', '7.0', '8.0', etc.
# -PreviousPreviewOrRC          : An optional word that indicates if the 'before' version is a Preview, an RC, or GA. Accepted values: "preview", "rc" or "ga".
# -PreviousPreviewNumberVersion : The optional preview or RC number of the 'before' version: '1', '2', '3', etc. For GA, this number is the 3rd one in the released version (7.0.0, 7.0.1, 7.0.2, ...).
# -CurrentDotNetVersion         : The 'after' .NET version: '6.0', '7.0', '8.0', etc.
# -CurrentPreviewOrRC           : An optional word that indicates if the 'after' version is a Preview, an RC, or GA. Accepted values: "preview", "rc" or "ga".
# -CurrentPreviewNumberVersion  : The optional preview or RC number of the 'before' version: '1', '2', '3', etc. For GA, this number is the 3rd one in the released version (7.0.0, 7.0.1, 7.0.2, ...).
# -CoreRepo                     : The full path to your local clone of the dotnet/core repo.
# -TmpFolder                    : The full path to the folder where the assets will be downloaded, extracted and compared.
# -AttributesToExcludeFilePath  : The full path to the file containing the attributes to exclude from the report. By default, it is "ApiDiffAttributesToExclude.txt" in the same folder as this script.
# -AssembliesToExcludeFilePath  : The full path to the file containing the assemblies to exclude from the report. By default, it is "ApiDiffAssembliesToExclude.txt" in the same folder as this script.
# -PreviousNuGetFeed            : The NuGet feed URL to use for downloading previous/before packages. By default, uses https://dnceng.pkgs.visualstudio.com/public/_packaging/dotnet10/nuget/v3/index.json
# -CurrentNuGetFeed             : The NuGet feed URL to use for downloading current/after packages. By default, uses https://dnceng.pkgs.visualstudio.com/public/_packaging/dotnet10/nuget/v3/index.json
# -ExcludeNetCore               : Optional boolean to exclude the NETCore comparison. Default is false.
# -ExcludeAspNetCore            : Optional boolean to exclude the AspNetCore comparison. Default is false.
# -ExcludeWindowsDesktop        : Optional boolean to exclude the WindowsDesktop comparison. Default is false.
# -InstallApiDiff               : Optional boolean to install or update the ApiDiff tool. Default is false.
# -PreviousPackageExactVersion  : Optional exact package version for the previous/before comparison (e.g., "10.0.0-rc.1.25451.107"). Overrides version search logic.
# -CurrentPackageExactVersion   : Optional exact package version for the current/after comparison (e.g., "10.0.0-rc.2.25502.107"). Overrides version search logic.

# Example:
# .\RunApiDiff.ps1 -PreviousDotNetVersion 9.0 -PreviousPreviewOrRC preview -PreviousPreviewNumberVersion 7 -CurrentDotNetVersion 9.0 -CurrentPreviewOrRC rc -CurrentPreviewNumberVersion 1 -CoreRepo C:\Users\calope\source\repos\core\ -SdkRepo C:\Users\calope\source\repos\sdk\ -TmpFolder C:\Users\calope\source\repos\tmp\

# Example with exact package versions:
# .\RunApiDiff.ps1 -PreviousDotNetVersion 10.0 -PreviousPreviewOrRC RC -PreviousPreviewNumberVersion 1 -CurrentDotNetVersion 10.0 -CurrentPreviewOrRC RC -CurrentPreviewNumberVersion 2 -CoreRepo D:\core\ -TmpFolder D:\tmp -PreviousPackageExactVersion "10.0.0-rc.1.25451.107" -CurrentPackageExactVersion "10.0.0-rc.2.25502.107"

# Example with custom NuGet feed:
# .\RunApiDiff.ps1 -PreviousDotNetVersion 9.0 -PreviousPreviewOrRC preview -PreviousPreviewNumberVersion 7 -CurrentDotNetVersion 9.0 -CurrentPreviewOrRC rc -CurrentPreviewNumberVersion 1 -CoreRepo D:\core\ -TmpFolder D:\tmp -PreviousNuGetFeed "https://api.nuget.org/v3/index.json" -CurrentNuGetFeed "https://api.nuget.org/v3/index.json"

Param (
    [Parameter(Mandatory = $true)]
    [ValidatePattern("\d+\.\d")]
    [string]
    $PreviousDotNetVersion # 7.0, 8.0, 9.0, ...
    ,
    [Parameter(Mandatory = $true)]
    [string]
    [ValidateSet("preview", "rc", "ga")]
    $PreviousPreviewOrRC
    ,
    [Parameter(Mandatory = $true)]
    [ValidatePattern("(\d+)?")]
    [string]
    $PreviousPreviewNumberVersion # 0, 1, 2, 3, ...
    ,
    [Parameter(Mandatory = $true)]
    [ValidatePattern("\d+\.\d")]
    [string]
    $CurrentDotNetVersion # 7.0, 8.0, 9.0, ...
    ,
    [Parameter(Mandatory = $true)]
    [string]
    [ValidateSet("preview", "rc", "ga")]
    $CurrentPreviewOrRC
    ,
    [Parameter(Mandatory = $true)]
    [ValidatePattern("(\d+)?")]
    [string]
    $CurrentPreviewNumberVersion # 0, 1, 2, 3, ...
    ,
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]
    $CoreRepo #"D:\\core"
    ,
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]
    $TmpFolder #"D:\tmp"
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
    $PreviousNuGetFeed = "https://dnceng.pkgs.visualstudio.com/public/_packaging/dotnet10/nuget/v3/index.json"
    ,
    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]
    $CurrentNuGetFeed = "https://dnceng.pkgs.visualstudio.com/public/_packaging/dotnet10/nuget/v3/index.json"
    ,
    [Parameter(Mandatory = $false)]
    [bool]
    $ExcludeNetCore = $false
    ,
    [Parameter(Mandatory = $false)]
    [bool]
    $ExcludeAspNetCore = $false
    ,
    [Parameter(Mandatory = $false)]
    [bool]
    $ExcludeWindowsDesktop = $false
    ,
    [Parameter(Mandatory = $false)]
    [bool]
    $InstallApiDiff = $false
    ,
    [Parameter(Mandatory = $false)]
    [string]
    $PreviousPackageExactVersion = ""
    ,
    [Parameter(Mandatory = $false)]
    [string]
    $CurrentPackageExactVersion = ""
)

#######################
### Start Functions ###
#######################

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

Function RunCommand {
    Param (
        [Parameter(Mandatory = $True)]
        [ValidateNotNullOrEmpty()]
        [string]
        $command
    )

    Write-Color yellow $command
    Invoke-Expression "$command"
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
        $previewOrRC
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $previewNumberVersion # 0, 1, 2, 3, ...
    )

    If ($IsComparingReleases) {
        Return "$dotNetVersion.$previewNumberVersion"
    }

    If ($previewOrRC -eq "ga") {
        If ($previewNumberVersion -eq "0") {
            # Example: Don't return "7.0-ga0", instead just return "7.0-ga"
            Return "$dotNetVersion-$previewOrRC"
        }

        # Examples: Don't include "ga", instead just return "7.0.1", "7.0.2"
        Return "$dotNetVersion.$previewNumberVersion"
    }

    # Examples: "7.0-preview5", "7.0-rc2", "7.0-ga"
    Return "$dotNetVersion-$previewOrRC$previewNumberVersion"
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
        $PreviewOrRC
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $PreviewNumberVersion # 0, 1, 2, 3, ...
    )

    $friendlyPreview = ""
    If ($PreviewOrRC -eq "preview") {
        $friendlyPreview = "Preview"
    }
    ElseIf ($PreviewOrRC -eq "rc") {
        $friendlyPreview = "RC"
    }
    ElseIf ($PreviewOrRC -eq "ga") {
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

Function GetPreviewOrRCFolderName {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $dotNetVersion # 7.0, 8.0, 9.0, ...
        ,
        [Parameter(Mandatory = $true)]
        [string]
        [ValidateSet("preview", "rc", "ga")]
        $previewOrRC
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $previewNumberVersion # 0, 1, 2, 3, ...
    )

    If ($previewOrRC -eq "ga") {
        If ($previewNumberVersion -eq "0") {
            # return "ga", not "ga0"
            Return $previewOrRC
        }

        # return "7.0.1", "7.0.2", not "ga1, ga2"
        Return "$dotNetVersion$previewNumberVersion"
    }

    Return "$previewOrRC$previewNumberVersion"
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
        $previewOrRC
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

    $previewOrRCFolderName = GetPreviewOrRCFolderName $dotNetVersion $previewOrRC $previewNumberVersion
    Return [IO.Path]::Combine($prefixFolder, "preview", $previewOrRCFolderName, $apiDiffFolderName)
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

    $referenceParams = ""
    if (-not [string]::IsNullOrEmpty($beforeReferenceFolder) -and -not [string]::IsNullOrEmpty($afterReferenceFolder)) {
        VerifyPathOrExit $beforeReferenceFolder
        VerifyPathOrExit $afterReferenceFolder
        $referenceParams = " -rb '$beforeReferenceFolder' -ra '$afterReferenceFolder'"
    }

    RunCommand "$apiDiffExe -b '$beforeFolder' -a '$afterFolder' -o '$outputFolder' -tc '$tableOfContentsFileNamePrefix' -eas '$assembliesToExclude' -eattrs '$attributesToExclude' -bfn '$beforeFriendlyName' -afn '$afterFriendlyName'$referenceParams"
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

Function RebuildIfExeNotFound {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $exePath
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $projectPath
        ,
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $artifactsPath
    )

    VerifyPathOrExit $projectPath

    If (-Not (Test-Path -Path $exePath)) {
        # Building the project

        Write-Color cyan "Building project '$projectPath'"
        RunCommand "$SdkRepo/.dotnet/dotnet build -c release $projectPath"

        # Verifying expected output from building
        VerifyPathOrExit $artifactsPath
        VerifyPathOrExit $exePath
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
        $previewOrRC
        ,
        [Parameter(Mandatory = $true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $previewNumberVersion
        ,
        [Parameter(Mandatory = $false)]
        [string]
        $exactVersion = ""
        ,
        [ref]
        $resultingPath
    )

    $fullSdkName = "Microsoft.$sdkName.App"
    $destinationFolder = [IO.Path]::Combine($TmpFolder, "$fullSdkName.$beforeOrAfter")
    RecreateFolder $destinationFolder

    $refPackageName = "$fullSdkName.Ref"

    $version = ""
    
    # If exact version is provided, use it directly
    If (-Not ([System.String]::IsNullOrWhiteSpace($exactVersion))) {
        Write-Color cyan "Using exact package version: $exactVersion"
        $version = $exactVersion
    }
    Else {
        # Otherwise, search for the package version
        $searchTerm = ""
        If ($previewOrRC -eq "ga") {
            $searchTerm = "$dotNetversion.$previewNumberVersion"
        }
        ElseIf (-Not ([System.String]::IsNullOrWhiteSpace($previewOrRC)) -And -Not ([System.String]::IsNullOrWhiteSpace($previewNumberVersion))) {
            $searchTerm = "$dotNetversion.*-$previewOrRC.$previewNumberVersion*"
        }

        # Use NuGet API directly instead of Find-Package to support authenticated feeds
        Write-Color cyan "Searching for package '$refPackageName' matching '$searchTerm' in feed '$nuGetFeed'..."
        
        $headers = GetAuthHeadersForFeed $nuGetFeed
        
        # Get service index
        $serviceIndex = Invoke-RestMethod -Uri $nuGetFeed -Headers $headers
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
        $matchingVersions = $package.versions | Where-Object -Property version -Like $searchTerm | Sort-Object version -Descending
        
        If ($matchingVersions.Count -eq 0) {
            Write-Error "No NuGet packages found with search term '$searchTerm'." -ErrorAction Stop
        }

        $version = $matchingVersions[0].version
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
        [Parameter(Mandatory = $false)]
        [ValidateNotNullOrEmpty()]
        [string]
        $sdkName
    ,
        [Parameter(Mandatory = $false)]
        [ValidateNotNullOrEmpty()]
        [string]
        $previousNuGetFeed
    ,
        [Parameter(Mandatory = $false)]
        [ValidateNotNullOrEmpty()]
        [string]
        $currentNuGetFeed
    ,
        [Parameter(Mandatory = $false)]
        [ValidateNotNullOrEmpty()]
        [string]
        $apiDiffExe
    ,
        [Parameter(Mandatory = $false)]
        [ValidateNotNullOrEmpty()]
        [string]
        $currentDotNetFullName
    ,
        [Parameter(Mandatory = $false)]
        [ValidateNotNullOrEmpty()]
        [string]
        $assembliesToExclude
    ,
        [Parameter(Mandatory = $false)]
        [ValidateNotNullOrEmpty()]
        [string]
        $attributesToExclude
    ,
        [Parameter(Mandatory = $false)]
        [ValidateNotNullOrEmpty()]
        [string]
        $previousDotNetFriendlyName
    ,
        [Parameter(Mandatory = $false)]
        [ValidateNotNullOrEmpty()]
        [string]
        $currentDotNetFriendlyName
    ,
        [Parameter(Mandatory = $false)]
        [string]
        $previousExactVersion = ""
    ,
        [Parameter(Mandatory = $false)]
        [string]
        $currentExactVersion = ""
    )

    $beforeDllFolder = ""
    DownloadPackage $previousNuGetFeed $sdkName "Before" $PreviousDotNetVersion $PreviousPreviewOrRC $PreviousPreviewNumberVersion $previousExactVersion ([ref]$beforeDllFolder)
    VerifyPathOrExit $beforeDllFolder

    $afterDllFolder = ""
    DownloadPackage $currentNuGetFeed $sdkName "After" $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion $currentExactVersion ([ref]$afterDllFolder)
    VerifyPathOrExit $afterDllFolder

    # For AspNetCore and WindowsDesktop, also download NETCore references to provide core assemblies
    $beforeReferenceFolder = ""
    $afterReferenceFolder = ""
    if ($sdkName -eq "AspNetCore" -or $sdkName -eq "WindowsDesktop") {
        DownloadPackage $previousNuGetFeed "NETCore" "Before" $PreviousDotNetVersion $PreviousPreviewOrRC $PreviousPreviewNumberVersion $previousExactVersion ([ref]$beforeReferenceFolder)
        VerifyPathOrExit $beforeReferenceFolder
        
        DownloadPackage $currentNuGetFeed "NETCore" "After" $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion $currentExactVersion ([ref]$afterReferenceFolder)
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

## Generate strings with no whitespace

# True when comparing 8.0 GA with 9.0 GA
$IsComparingReleases = ($PreviousDotNetVersion -Ne $CurrentDotNetVersion) -And ($PreviousPreviewOrRC -Eq "ga") -And ($CurrentPreviewOrRC -eq "ga")


## Check folders passed as parameters exist
VerifyPathOrExit $CoreRepo
VerifyPathOrExit $TmpFolder

$currentMajorVersion = $CurrentDotNetVersion.Split(".")[0]
$InstallApiDiffCommand = "dotnet tool install --global Microsoft.DotNet.ApiDiff.Tool --source https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet$currentMajorVersion-transport/nuget/v3/index.json --prerelease"

if ($InstallApiDiff) {
    Write-Color white "Installing ApiDiff tool..."
    RunCommand $InstallApiDiffCommand
}

$apiDiffCommand = get-command "apidiff" -ErrorAction SilentlyContinue

if (-Not $apiDiffCommand) 
{
     Write-Error "The command apidiff could not be found.  Please first install the tool using the following command: $InstallApiDiffCommand" -ErrorAction Stop
}

$apiDiffExe = $apiDiffCommand.Source
## Recreate api-diff folder in core repo folder

$previewFolderPath = GetPreviewFolderPath $CoreRepo $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion $IsComparingReleases
If (-Not (Test-Path -Path $previewFolderPath))
{
    Write-Color white "Creating new diff folder: $previewFolderPath"
    New-Item -ItemType Directory -Path $previewFolderPath
}

## Run the ApiDiff commands

# Example: "10.0-preview2"
$currentDotNetFullName = GetDotNetFullName $IsComparingReleases $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion

# Examples: ".NET 10 Preview 1" and ".NET 10 Preview 2"
$previousDotNetFriendlyName = GetDotNetFriendlyName $PreviousDotNetVersion $PreviousPreviewOrRC $PreviousPreviewNumberVersion
$currentDotNetFriendlyName = GetDotNetFriendlyName $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion

If (-Not $ExcludeNetCore)
{
    ProcessSdk "NETCore" $PreviousNuGetFeed $CurrentNuGetFeed $apiDiffExe $currentDotNetFullName $AssembliesToExcludeFilePath  $AttributesToExcludeFilePath $previousDotNetFriendlyName $currentDotNetFriendlyName $PreviousPackageExactVersion $CurrentPackageExactVersion
}

If (-Not $ExcludeAspNetCore)
{
    ProcessSdk "AspNetCore" $PreviousNuGetFeed $CurrentNuGetFeed $apiDiffExe $currentDotNetFullName $AssembliesToExcludeFilePath  $AttributesToExcludeFilePath $previousDotNetFriendlyName $currentDotNetFriendlyName $PreviousPackageExactVersion $CurrentPackageExactVersion
}

If (-Not $ExcludeWindowsDesktop)
{
    ProcessSdk "WindowsDesktop" $PreviousNuGetFeed $CurrentNuGetFeed $apiDiffExe $currentDotNetFullName $AssembliesToExcludeFilePath  $AttributesToExcludeFilePath $previousDotNetFriendlyName $currentDotNetFriendlyName $PreviousPackageExactVersion $CurrentPackageExactVersion
}

CreateReadme $previewFolderPath $currentDotNetFriendlyName $currentDotNetFullName

#####################
### End Execution ###
#####################