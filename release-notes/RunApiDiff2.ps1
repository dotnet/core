# This script allows running API-diff to generate the dotnet/core report that compares the APIs introduced between two previews, in the format expected for publishing in the dotnet/core repo.

# Usage:

# RunApiDiff2.ps1
# -PreviousDotNetVersion        : The 'before' .NET version: '6.0', '7.0', '8.0', etc.
# -PreviousPreviewOrRC          : An optional word that indicates if the 'before' version is a Preview, an RC, or GA. Accepted values: "preview", "rc" or "ga".
# -PreviousPreviewNumberVersion : The optional preview or RC number of the 'before' version: '1', '2', '3', etc. For GA, this number is the 3rd one in the released version (7.0.0, 7.0.1, 7.0.2, ...).
# -CurrentDotNetVersion         : The 'after' .NET version: '6.0', '7.0', '8.0', etc.
# -CurrentPreviewOrRC           : An optional word that indicates if the 'after' version is a Preview, an RC, or GA. Accepted values: "preview", "rc" or "ga".
# -CurrentPreviewNumberVersion  : The optional preview or RC number of the 'before' version: '1', '2', '3', etc. For GA, this number is the 3rd one in the released version (7.0.0, 7.0.1, 7.0.2, ...).
# -CoreRepo                     : The full path to your local clone of the dotnet/core repo.
# -SdkRepo                      : The full path to your local clone of the dotnet/sdk repo.
# -TmpFolder                    : The full path to the folder where the assets will be downloaded, extracted and compared.
# -AttributesToExcludeFilePath  : The full path to the file containing the attributes to exclude from the report. By default, it is "ApiDiffAttributesToExclude.txt" in the same folder as this script.
# -AssembliesToExcludeFilePath  : The full path to the file containing the assemblies to exclude from the report. By default, it is "ApiDiffAssembliesToExclude.txt" in the same folder as this script.
# -UseNuGet                     : By default, the feed used is https://dnceng.pkgs.visualstudio.com/public/_packaging/dotnet10/nuget/v3/index.json , but if this is set to true, the feed used is https://api.nuget.org/v3/index.json
# -ExcludeNetCore               : Optional boolean to exclude the NETCore comparison. Default is false.
# -ExcludeAspNetCore            : Optional boolean to exclude the AspNetCore comparison. Default is false.
# -ExcludeWindowsDesktop        : Optional boolean to exclude the WindowsDesktop comparison. Default is false.

# Example:
# .\RunApiDiff2.ps1 -PreviousDotNetVersion 9.0 -PreviousPreviewOrRC preview -PreviousPreviewNumberVersion 7 -CurrentDotNetVersion 9.0 -CurrentPreviewOrRC rc -CurrentPreviewNumberVersion 1 -CoreRepo C:\Users\calope\source\repos\core\ -SdkRepo C:\Users\calope\source\repos\sdk\ -TmpFolder C:\Users\calope\source\repos\tmp\

# TODO: SDK Repo argument should go away, the tool will be available in the dotnet10 feed after the PR gets merged.

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
    $SdkRepo #"D:\\sdk" # TODO: DELETE AFTER MERGING PR, REPLACE WITH DOWNLOADING TOOL FROM dotnet10 FEED
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
    [bool]
    $UseNuGet = $false
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

Function RunApiDiff2 {
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
    )

    VerifyPathOrExit $apiDiffExe
    VerifyPathOrExit $beforeFolder
    VerifyPathOrExit $afterFolder

    # All arguments:
    # "https://github.com/dotnet/sdk/tree/main/src/Compatibility/ApiDiff/Microsoft.DotNet.ApiDiff.Tool/Program.cs"

    RunCommand "$apiDiffExe -b '$beforeFolder' -a '$afterFolder' -o '$outputFolder' -tc '$tableOfContentsFileNamePrefix' -eas '$assembliesToExclude' -eattrs '$attributesToExclude' -bfn '$beforeFriendlyName' -afn '$afterFriendlyName'"
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
        [bool]
        $useNuget
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
        [ref]
        $resultingPath
    )

    $fullSdkName = "Microsoft.$sdkName.App"
    $destinationFolder = [IO.Path]::Combine($TmpFolder, "$fullSdkName.$beforeOrAfter")
    RecreateFolder $destinationFolder

    $refPackageName = "$fullSdkName.Ref"

    $feed = $useNuget ? "https://api.nuget.org/v3/index.json" : "https://dnceng.pkgs.visualstudio.com/public/_packaging/dotnet10/nuget/v3/index.json"

    $searchTerm = ""
    If ($previewOrRC -eq "ga") {
        $searchTerm = "$dotNetversion.$previewNumberVersion"
    }
    ElseIf (-Not ([System.String]::IsNullOrWhiteSpace($previewOrRC)) -And -Not ([System.String]::IsNullOrWhiteSpace($previewNumberVersion))) {
        $searchTerm = "$dotNetversion.*-$previewOrRC.$previewNumberVersion*"
    }

    $foundPackages = Find-Package -AllVersions -Source $feed -Name $refPackageName -AllowPrereleaseVersions -ErrorAction Continue

    If ($foundPackages.Count -eq 0) {
        Write-Error "No NuGet packages found with ref package name '$refPackageName' in feed '$feed'"
        Get-PackageSource -Name $refPackageName | Format-Table -Property Name, SourceUri
        Write-Error "Exiting" -ErrorAction Stop
    }

    $results = $foundPackages | Where-Object -Property Version -Like $searchTerm | Sort-Object Version -Descending

    If ($results.Count -eq 0) {
        Write-Error "No NuGet packages found with search term '$searchTerm'." -ErrorAction Stop
    }

    $version = $results[0].Version
    $nupkgFile = [IO.Path]::Combine($TmpFolder, "$refPackageName.$version.nupkg")

    If (-Not(Test-Path -Path $nupkgFile)) {
        $href = $results[0].Links | Where-Object -Property Relationship -Eq "icon" | Select-Object -ExpandProperty HRef
        $link = $href.AbsoluteUri.Replace("?extract=Icon.png", "")

        $nupkgUrl = $useNuget ? "https://www.nuget.org/api/v2/package/$refPackageName/$version" : $link

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

Function GetFileLinesAsCommaSeparaterList {
    Param (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $filePath
    )

    VerifyPathOrExit $filePath

    $lines = (Get-Content -Path $filePath) -join ","
    Return $lines
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
    )

    $beforeDllFolder = ""
    DownloadPackage $UseNuget $sdkName "Before" $PreviousDotNetVersion $PreviousPreviewOrRC $PreviousPreviewNumberVersion ([ref]$beforeDllFolder)
    VerifyPathOrExit $beforeDllFolder

    $afterDllFolder = ""
    DownloadPackage $UseNuget $sdkName "After" $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion ([ref]$afterDllFolder)
    VerifyPathOrExit $afterDllFolder

    $targetFolder = [IO.Path]::Combine($previewFolderPath, "Microsoft.$adkName.App")
    RecreateFolder $targetFolder

    RunApiDiff2 $apiDiffExe $targetFolder $beforeDllFolder $afterDllFolder $currentDotNetFullName $assembliesToExclude $attributesToExclude $previousDotNetFriendlyName $currentDotNetFriendlyName
}

#####################
### End Functions ###
#####################

#######################
### Start Execution ###
#######################


## Generate strings with no whitespace

# True when comparing 8.0 GA with 9.0 GA
$IsComparingReleases = ($PreviousDotNetVersion -Ne $CurrentDotNetVersion) -And ($PreviousPreviewOrRC -Eq "ga") -And ($CurrentPreviewOrRC -eq "ga")


## Check folders passed as parameters exist

VerifyPathOrExit $CoreRepo
VerifyPathOrExit $SdkRepo
VerifyPathOrExit $TmpFolder


## Ensure ApiDiff artifacts exist

$apiDiffProjectPath = [IO.Path]::Combine($SdkRepo, "src", "Compatibility", "ApiDiff", "Microsoft.DotNet.ApiDiff.Tool", "Microsoft.DotNet.ApiDiff.Tool.csproj")
$apiDiffArtifactsPath = [IO.Path]::Combine($SdkRepo , "artifacts", "bin", "Microsoft.DotNet.ApiDiff.Tool")
$apiDiffExe = [IO.Path]::Combine($apiDiffArtifactsPath, "Release", "net8.0", "Microsoft.DotNet.ApiDiff.Tool.exe")
ReBuildIfExeNotFound $apiDiffExe $apiDiffProjectPath $apiDiffArtifactsPath


## Recreate api-diff folder in core repo folder

$previewFolderPath = GetPreviewFolderPath $CoreRepo $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion $IsComparingReleases
If (-Not (Test-Path -Path $previewFolderPath))
{
    Write-Color white "Creating new diff folder: $previewFolderPath"
    New-Item -ItemType Directory -Path $previewFolderPath
}


## Run the ApiDiff commands

# Comma separated docIDs of attribute types to exclude
$attributesToExclude = GetFileLinesAsCommaSeparaterList $AttributesToExcludeFilePath

# Comma separated list of assembly names to exclude
$assembliesToExclude = GetFileLinesAsCommaSeparaterList $AssembliesToExcludeFilePath

# Example: "10.0-preview2"
$currentDotNetFullName = GetDotNetFullName $IsComparingReleases $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion

# Examples: ".NET 10 Preview 1" and ".NET 10 Preview 2"
$previousDotNetFriendlyName = GetDotNetFriendlyName $PreviousDotNetVersion $PreviousPreviewOrRC $PreviousPreviewNumberVersion
$currentDotNetFriendlyName = GetDotNetFriendlyName $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion

If (-Not $ExcludeNetCore)
{
    ProcessSdk "NETCore" $apiDiffExe $currentDotNetFullName $assembliesToExclude $attributesToExclude $previousDotNetFriendlyName $currentDotNetFriendlyName
}

If (-Not $ExcludeAspNetCore)
{
    ProcessSdk "AspNetCore" $apiDiffExe $currentDotNetFullName $assembliesToExclude $attributesToExclude $previousDotNetFriendlyName $currentDotNetFriendlyName
}

If (-Not $ExcludeWindowsDesktop)
{
    ProcessSdk "WindowsDesktop" $apiDiffExe $currentDotNetFullName $assembliesToExclude $attributesToExclude $previousDotNetFriendlyName $currentDotNetFriendlyName
}

CreateReadme $previewFolderPath $currentDotNetFriendlyName $currentDotNetFullName

#####################
### End Execution ###
#####################