# This script allows running API-diff to generate the dotnet/core report that compares the APIs introduced between two previews, in the format expected for publishing in the dotnet/core repo.

# Usage:

# RunApiDiff.ps1
# -PreviousDotNetVersion        : The 'before' .NET version: '6.0', '7.0', '8.0', etc.
# -PreviousPreviewOrRC          : An optional word that indicates if the 'before' version is a Preview, an RC, or GA. Accepted values: "preview", "rc" or "ga".
# -PreviousPreviewNumberVersion : The optional preview or RC number of the 'before' version: '1', '2', '3', etc. For GA, this number is the 3rd one in the released version (7.0.0, 7.0.1, 7.0.2, ...).
# -CurrentDotNetVersion         : The 'after' .NET version: '6.0', '7.0', '8.0', etc.
# -CurrentPreviewOrRC           : An optional word that indicates if the 'after' version is a Preview, an RC, or GA. Accepted values: "preview", "rc" or "ga".
# -CurrentPreviewNumberVersion  : The optional preview or RC number of the 'before' version: '1', '2', '3', etc. For GA, this number is the 3rd one in the released version (7.0.0, 7.0.1, 7.0.2, ...).
# -CoreRepo                     : The full path to your local clone of the dotnet/core repo.
# -ArcadeRepo                   : The full path to your local clone of the dotnet/arcade repo.
# -TmpFolder                    : The full path to the folder where the assets will be downloaded, extracted and compared.

# Example:
# .\RunApiDiff.ps1 -PreviousDotNetVersion 8.0 -PreviousPreviewOrRC preview -PreviousPreviewNumberVersion 2 -CurrentDotNetVersion 8.0 -CurrentPreviewOrRC preview -CurrentPreviewNumberVersion 3 -CoreRepo D:\core -ArcadeRepo D:\arcade -TmpFolder D:\tmp

Param (
    [Parameter(Mandatory=$true)]
    [ValidatePattern("\d+\.\d")]
    [string]
    $PreviousDotNetVersion # 7.0, 8.0, 9.0, ...
,
    [Parameter(Mandatory=$true)]
    [string]
    [ValidateSet("preview", "rc", "ga")]
    $PreviousPreviewOrRC
,
    [Parameter(Mandatory=$true)]
    [ValidatePattern("(\d+)?")]
    [string]
    $PreviousPreviewNumberVersion # 0, 1, 2, 3, ...
,
    [Parameter(Mandatory=$true)]
    [ValidatePattern("\d+\.\d")]
    [string]
    $CurrentDotNetVersion # 7.0, 8.0, 9.0, ...
,
    [Parameter(Mandatory=$true)]
    [string]
    [ValidateSet("preview", "rc", "ga")]
    $CurrentPreviewOrRC
,
    [Parameter(Mandatory=$true)]
    [ValidatePattern("(\d+)?")]
    [string]
    $CurrentPreviewNumberVersion # 0, 1, 2, 3, ...
,
    [Parameter(Mandatory=$true)]
    [ValidateNotNullOrEmpty()]
    [string]
    $CoreRepo #"D:\\core"
,
    [Parameter(Mandatory=$true)]
    [ValidateNotNullOrEmpty()]
    [string]
    $ArcadeRepo #"D:\\arcade"
,
    [Parameter(Mandatory=$true)]
    [ValidateNotNullOrEmpty()]
    [string]
    $TmpFolder #"D:\tmp"
)


### Functions ###

Function WriteColor
{
    Param (
        [ValidateNotNullOrEmpty()]
        [string] $newColor
    )

    $oldColor = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $newColor

    If ($args)
    {
        Write-Output $args
    }
    Else
    {
        $input | Write-Output
    }

    $host.UI.RawUI.ForegroundColor = $oldColor
}

Function VerifyPathOrExit
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $path
    )

    If (-Not (Test-Path -Path $path))
    {
        Write-Error "The path '$path' does not exist." -ErrorAction Stop
    }
}

Function RemoveFolderIfExists
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $path
    )

    If (Test-Path -Path $path)
    {
        WriteColor yellow "Removing existing folder: $path"
        Remove-Item -Recurse -Path $path
    }
}

Function RecreateFolder
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $path
    )

    RemoveFolderIfExists $path

    WriteColor cyan "Creating new folder: $path"
    New-Item -ItemType Directory -Path $path
}

Function VerifyCountDlls
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $path
    )

    VerifyPathOrExit $path

    $count=(Get-ChildItem -Path $path -Filter "*.dll" | Measure-Object).Count
    If ($count -eq 0)
    {
        Write-Error "There are no DLL files inside the folder." -ErrorAction Stop
    }
}

Function RunCommand
{
    Param (
        [Parameter(Mandatory=$True)]
        [ValidateNotNullOrEmpty()]
        [string]
        $command
    )

    WriteColor yellow $command
    Invoke-Expression "$command"
}

Function GetDotNetFullName
{
    Param (
        [Parameter(Mandatory=$true)]
        [bool]
        $areVersionsEqual
    ,
        [Parameter(Mandatory=$true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $dotNetVersion # 7.0, 8.0, 9.0, ...
    ,
        [Parameter(Mandatory=$true)]
        [string]
        [ValidateSet("preview", "rc", "ga")]
        $previewOrRC
    ,
        [Parameter(Mandatory=$true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $previewNumberVersion # 0, 1, 2, 3, ...
    )

    If (-Not $areVersionsEqual)
    {
        Return "$dotNetVersion.$previewNumberVersion"
    }

    If ($previewOrRC -eq "ga")
    {
        If ($previewNumberVersion -eq "0")
        {
            # Example: Don't return "7.0-ga0", instead just return "7.0-ga"
            Return "$dotNetVersion-$previewOrRC"
        }

        # Examples: Don't include "ga", instead just return "7.0.1", "7.0.2"
        Return "$dotNetVersion.$previewNumberVersion"
    }

    # Examples: "7.0-preview5", "7.0-rc2", "7.0-ga"
    Return "$dotNetVersion-$previewOrRC$previewNumberVersion"
}

Function GetDotNetFriendlyName
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $DotNetVersion # 7.0, 8.0, 9.0, ...
    ,
        [Parameter(Mandatory=$true)]
        [string]
        [ValidateSet("preview", "rc", "ga")]
        $PreviewOrRC
    ,
        [Parameter(Mandatory=$true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $PreviewNumberVersion # 0, 1, 2, 3, ...
    )

    $friendlyPreview = ""
    If ($PreviewOrRC -eq "preview")
    {
        $friendlyPreview = "Preview"
    }
    ElseIf ($PreviewOrRC -eq "rc")
    {
        $friendlyPreview = "RC"
    }
    ElseIf ($PreviewOrRC -eq "ga")
    {
        $friendlyPreview = "GA"
        If ($PreviewNumberVersion -eq 0)
        {
            # Example: Don't return "7.0 GA 0", instead just return "7.0 GA"
            Return ".NET $DotNetVersion $friendlyPreview"
        }

        # Examples: Don't include "ga", instead just return "7.0.1", "7.0.2"
        Return ".NET $DotNetVersion.$PreviewNumberVersion"
    }

    # Examples: "7.0 Preview 5", "7.0 RC 2"
    Return ".NET $DotNetVersion $friendlyPreview $PreviewNumberVersion"
}

Function GetPreviewOrRCFolderName
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $dotNetVersion # 7.0, 8.0, 9.0, ...
    ,
        [Parameter(Mandatory=$true)]
        [string]
        [ValidateSet("preview", "rc", "ga")]
        $previewOrRC
    ,
        [Parameter(Mandatory=$true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $previewNumberVersion # 0, 1, 2, 3, ...
    )

    If ($previewOrRC -eq "ga")
    {
        If ($previewNumberVersion -eq "0")
        {
            # return "ga", not "ga0"
            Return $previewOrRC
        }

        # return "7.0.1", "7.0.2", not "ga1, ga2"
        Return "$dotNetVersion$previewNumberVersion"
    }

    Return "$previewOrRC$previewNumberVersion"
}

Function GetPreviewFolderPath
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $rootFolder #"D:\\core"
    ,
        [Parameter(Mandatory=$true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $dotNetVersion # 7.0, 8.0, 9.0, ...
    ,
        [Parameter(Mandatory=$true)]
        [string]
        [ValidateSet("preview", "rc", "ga")]
        $previewOrRC
    ,
        [Parameter(Mandatory=$true)]
        [ValidatePattern("(\d+)?")]
        [string]
        $previewNumberVersion # 0, 1, 2, 3, ...
    ,
        [Parameter(Mandatory=$true)]
        [bool]
        $areVersionsEqual
    )

    $prefixFolder = [IO.Path]::Combine($rootFolder, "release-notes", $dotNetVersion)
    $apiDiffFolderName = "api-diff"
    If ($areVersionsEqual)
    {
        $previewOrRCFolderName = GetPreviewOrRCFolderName $dotNetVersion $previewOrRC $previewNumberVersion
        Return [IO.Path]::Combine($prefixFolder, "preview", $apiDiffFolderName, $previewOrRCFolderName)
    }

    Return [IO.Path]::Combine($prefixFolder, "$dotNetVersion.$previewNumberVersion", $apiDiffFolderName)
}

Function RunAsmDiff
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $asmDiffExe
    ,
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $tableOfContentsFilePath
    ,
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $beforeFolder
    ,
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $afterFolder
    )

    VerifyPathOrExit $asmDiffExe
    VerifyPathOrExit $beforeFolder
    VerifyPathOrExit $afterFolder

    If (Test-Path -Path $tableOfContentsFilePath)
    {
        WriteColor yellow "Deleting existing table of contents file..."
        Remove-Item -Path $tableOfContentsFilePath
    }
    # Arguments currently used:
    # -r: Include members, types, and namespaces that were removed.
    # -a: Include members, types and namespaces that were added.
    # -c: Included members, types and namespaces that were changed.
    # -itc: Include table of contents.
    # -cfn: Create files per namespace.
    # -adm: Forces showing all members of a type that was added or removed.
    # -hbm: Highlight members that are interface implementations or overrides of a base member.
    # -da: Enables diffing of the attributes as well.
    # -w markdown: Type of diff writer to use.
    # -o <path>: Output file path.
    # -os <path>: Path to the old assembly set (baseline).
    # -ns <path>: Path to the new assembly set.

    # All arguments:
    # https://github.com/dotnet/arcade/blob/main/src/Microsoft.DotNet.AsmDiff/Program.cs

    RunCommand "$asmDiffExe -r -a -c -itc -cfn -adm -hbm -da -w markdown -o $tableOfContentsFilePath -os $beforeFolder -ns $afterFolder"
}

Function ReplaceTitle
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $tableOfContentsFilePath
    ,
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $previousFullName
    ,
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $currentFullName
    )

    VerifyPathOrExit $tableOfContentsFilePath

    $correctTitle="# API Difference ${previousFullName} vs ${currentFullName}"

    WriteColor cyan "Replacing title of table of contents with correct one: $tableOfContentsFilePath"
    $updatedTableOfContents = .{
        $correctTitle
        Get-Content $tableOfContentsFilePath | Select-Object -Skip 1
    }

    Set-Content -Path $tableOfContentsFilePath -Value $updatedTableOfContents
}

Function CreateReadme
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $previewFolderPath
    ,
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $dotNetFriendlyName
    ,
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $dotNetFullName
    )

    $readmePath=[IO.Path]::Combine($previewFolderPath, "README.md")
    If (Test-Path -Path $readmePath)
    {
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

Function RebuildIfExeNotFound
{
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $exePath
    ,
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $projectPath
    ,
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $artifactsPath
    )

    VerifyPathOrExit $projectPath

    If (-Not (Test-Path -Path $exePath))
    {
        # Building the project

        WriteColor cyan "Building project '$projectPath'"
        RunCommand "dotnet build -c release $projectPath"

        # Verifying expected output from building
        VerifyPathOrExit $artifactsPath
        VerifyPathOrExit $exePath
    }
}

Function DownloadPackage
{
    Param
    (
        [Parameter(Mandatory=$true)]
        [ValidateSet("NETCore", "AspNetCore", "WindowsDesktop")]
        [string]
        $sdkName
    ,
        [Parameter(Mandatory=$true)]
        [ValidateSet("Before", "After")]
        [string]
        $beforeOrAfter
    ,
        [Parameter(Mandatory=$true)]
        [ValidatePattern("\d+\.\d")]
        [string]
        $dotNetVersion
    ,
        [Parameter(Mandatory=$true)]
        [ValidateSet("preview", "rc", "ga")]
        [string]
        $previewOrRC
    ,
        [Parameter(Mandatory=$true)]
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
    $nugetSource = "https://api.nuget.org/v3/index.json"
    $searchTerm = ""
    If ($previewOrRC -eq "ga")
    {
        $searchTerm = "$dotNetversion.$previewNumberVersion"
    }
    ElseIf (-Not ([System.String]::IsNullOrWhiteSpace($previewOrRC)) -And -Not ([System.String]::IsNullOrWhiteSpace($previewNumberVersion)))
    {
        $searchTerm = "$dotNetversion.*-$previewOrRC.$previewNumberVersion*"
    }

    $results = Find-Package -AllVersions -Source $nugetSource -Name $refPackageName -AllowPrereleaseVersions | Where-Object -Property Version -Like $searchTerm | Sort-Object Version -Descending

    If ($results.Count -eq 0)
    {
        Write-Error "No NuGet packages found with search term '$searchTerm'." -ErrorAction Stop
    }

    $version = $results[0].Version
    $nupkgFile = [IO.Path]::Combine($TmpFolder, "$refPackageName.$version.nupkg")

    If (-Not (Test-Path -Path $nupkgFile))
    {
        Write-Color yellow "Package '$nupkgFile' does not exist. Downloading."
        Invoke-WebRequest -Uri "https://www.nuget.org/api/v2/package/$refPackageName/$version" -OutFile $nupkgFile
        VerifyPathOrExit $nupkgFile
    }
    Else
    {
        Write-Color green "The '$nupkgFile' package was already found. Skipping new download."
    }

    Expand-Archive -Path $nupkgFile -DestinationPath $destinationFolder

    $dllPath = [IO.Path]::Combine($destinationFolder, "ref", "net$dotNetVersion")
    VerifyPathOrExit $dllPath
    VerifyCountDlls $dllPath
    $resultingPath.value = $dllPath
}


### Execution ###

## Generate strings with no whitespace

$areVersionsEqual = $PreviousDotNetVersion -eq $CurrentDotNetVersion

$previousDotNetFullName = GetDotNetFullName $areVersionsEqual $PreviousDotNetVersion $PreviousPreviewOrRC $PreviousPreviewNumberVersion
$currentDotNetFullName = GetDotNetFullName $areVersionsEqual $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion


## Check folders passed as parameters exist

VerifyPathOrExit $CoreRepo
VerifyPathOrExit $ArcadeRepo
VerifyPathOrExit $TmpFolder


## Download the NuGet packages

# NETCore
$netCoreBeforeDllFolder = ""
DownloadPackage "NETCore" "Before" $PreviousDotNetVersion $PreviousPreviewOrRC $PreviousPreviewNumberVersion ([ref]$netCoreBeforeDllFolder)
VerifyPathOrExit $netCoreBeforeDllFolder

$netCoreAfterDllFolder = ""
DownloadPackage "NETCore" "After" $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion ([ref]$netCoreAfterDllFolder)
VerifyPathOrExit $netCoreAfterDllFolder

# AspNetCore
$aspNetCoreBeforeDllFolder = ""
DownloadPackage "AspNetCore" "Before" $PreviousDotNetVersion $PreviousPreviewOrRC $PreviousPreviewNumberVersion ([ref]$aspNetCoreBeforeDllFolder)
VerifyPathOrExit $aspNetCoreBeforeDllFolder

$aspNetCoreAfterDllFolder = ""
DownloadPackage "AspNetCore" "After" $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion ([ref]$aspNetCoreAfterDllFolder)
VerifyPathOrExit $aspNetCoreAfterDllFolder

# WindowsDesktop
$windowsDesktopBeforeDllFolder = ""
DownloadPackage "WindowsDesktop" "Before" $PreviousDotNetVersion $PreviousPreviewOrRC $PreviousPreviewNumberVersion ([ref]$windowsDesktopBeforeDllFolder)
VerifyPathOrExit $windowsDesktopBeforeDllFolder

$windowsDesktopAfterDllFolder = ""
DownloadPackage "WindowsDesktop" "After" $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion ([ref]$windowsDesktopAfterDllFolder)
VerifyPathOrExit $windowsDesktopAfterDllFolder


## Ensure AsmDiff artifacts exist

$asmDiffProjectPath = [IO.Path]::Combine($ArcadeRepo, "src", "Microsoft.DotNet.AsmDiff", "Microsoft.DotNet.AsmDiff.csproj")
$asmDiffArtifactsPath = [IO.Path]::Combine($ArcadeRepo ,"artifacts", "bin", "Microsoft.DotNet.AsmDiff")
$asmDiffExe = [IO.Path]::Combine($asmDiffArtifactsPath, "Release", "net8.0", "Microsoft.DotNet.AsmDiff.exe")
ReBuildIfExeNotFound $asmDiffExe $asmDiffProjectPath $asmDiffArtifactsPath

## Recreate api-diff folder in core repo folder

$previewFolderPath = GetPreviewFolderPath $CoreRepo $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion $areVersionsEqual
WriteColor cyan "Checking existing diff folder: $previewFolderPath"
RecreateFolder $previewFolderPath


## Create subfolders

# NETCore
$netCoreTargetFolder = [IO.Path]::Combine($previewFolderPath, "Microsoft.NETCore.App")
RecreateFolder $netCoreTargetFolder

#AspNetCore
$aspNetCoreTargetFolder = [IO.Path]::Combine($previewFolderPath, "Microsoft.AspNetCore.App")
RecreateFolder $aspNetCoreTargetFolder

# WindowsDesktop
$windowsDesktopTargetFolder = [IO.Path]::Combine($previewFolderPath, "Microsoft.WindowsDesktop.App")
RecreateFolder $windowsDesktopTargetFolder


## Run the Asm-Diff commands

$tableOfContentsFile = "$currentDotNetFullName.md"

$tableOfContentsFilePathNETCore = [IO.Path]::Combine($netCoreTargetFolder, $tableOfContentsFile)
$tableOfContentsFilePathAspNetCore = [IO.Path]::Combine($aspNetCoreTargetFolder, $tableOfContentsFile)
$tableOfContentsFilePathWindowsDesktop = [IO.Path]::Combine($windowsDesktopTargetFolder, $tableOfContentsFile)

RunAsmDiff $asmDiffExe $tableOfContentsFilePathNETCore $netCoreBeforeDllFolder $netCoreAfterDllFolder
RunAsmDiff $asmDiffExe $tableOfContentsFilePathAspNetCore $aspNetCoreBeforeDllFolder $aspNetCoreAfterDllFolder
RunAsmDiff $asmDiffExe $tableOfContentsFilePathWindowsDesktop $windowsDesktopBeforeDllFolder $windowsDesktopAfterDllFolder


## Replace the first line of the summmary files with the correct title, and write final readme

ReplaceTitle $tableOfContentsFilePathNETCore $previousDotNetFullName $currentDotNetFullName
ReplaceTitle $tableOfContentsFilePathAspNetCore $previousDotNetFullName $currentDotNetFullName
ReplaceTitle $tableOfContentsFilePathWindowsDesktop $previousDotNetFullName $currentDotNetFullName

$currentDotNetFriendlyName = GetDotNetFriendlyName $CurrentDotNetVersion $CurrentPreviewOrRC $CurrentPreviewNumberVersion

CreateReadme $previewFolderPath $currentDotNetFriendlyName $currentDotNetFullName
