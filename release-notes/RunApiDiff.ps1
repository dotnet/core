# This script allows running API-diff to generate the dotnet/core report that compares the APIs introduced between two previews, in the format expected for publishing in the dotnet/core repo.

# Usage:

# RunApiDiff.ps1
# -PreviousDotNetVersion        : The 'before' .NET version: '6.0', '7.0', '8.0', etc.
# -PreviousPreviewOrRC          : An optional word that indicates if the 'before' version is a Preview, an RC, or nothing. Accepted values: "preview", "rc". Leave empty for a released version.
# -PreviousPreviewNumberVersion : The optional preview or RC number of the 'before' version: '1', '2', '3', etc. Leave empty for a released version.
# -CurrentDotNetVersion         : The 'after' .NET version: '6.0', '7.0', '8.0', etc.
# -CurrentPreviewOrRC           : An optional word that indicates if the 'after' version is a Preview, an RC, or nothing. Accepted values: "preview", "rc". Leave empty for a released version.
# -CurrentPreviewNumberVersion  : The optional preview or RC number of the 'before' version: '1', '2', '3', etc. Leave empty for a released version.
# -CoreRepo                     : The full path to your local clone of the dotnet/core repo.
# -ArcadeRepo                   : The full path to your local clone of the dotnet/arcade repo.
# -TmpFolder                    : The full path to the folder where the assets will be downloaded, extracted and compared.

# Example:
# .\RunApiDiff.ps1 -PreviousDotNetVersion 7.0 -PreviousPreviewOrRC preview -PreviousPreviewNumberVersion 2 -CurrentDotNetVersion 7.0 -CurrentPreviewOrRC preview -CurrentPreviewNumberVersion 3 -CoreRepo D:\core -ArcadeRepo D:\arcade -TmpFolder D:\tmp

Param (
    [Parameter(Mandatory=$true)]
    [ValidatePattern("\d+\.\d")]
    [string]
    $PreviousDotNetVersion # 7.0, 8.0, 9.0, ...
,
    [Parameter(Mandatory=$false)]
    [string]
    [ValidateSet("preview", "rc", "")]
    $PreviousPreviewOrRC
,
    [Parameter(Mandatory=$false)]
    [ValidatePattern("(\d+)?")]
    [string]
    $PreviousPreviewNumberVersion # 1, 2, 3, ..., or even ""
,
    [Parameter(Mandatory=$true)]
    [ValidatePattern("\d+\.\d")]
    [string]
    $CurrentDotNetVersion # 7.0, 8.0, 9.0, ...
,
    [Parameter(Mandatory=$false)]
    [string]
    [ValidateSet("preview", "rc", "")]
    $CurrentPreviewOrRC
,
    [Parameter(Mandatory=$false)]
    [ValidatePattern("(\d+)?")]
    [string]
    $CurrentPreviewNumberVersion # 1, 2, 3, ..., or even ""
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


### Globals ###

$ErrorActionPreference = "Stop"

$PreviousDotNetVersionPreviewAndNumber=$PreviousDotNetVersion
If (-Not [System.String]::IsNullOrWhiteSpace($PreviousPreviewNumberVersion))
{
    $PreviousDotNetVersionPreviewAndNumber="$PreviousDotNetVersion-$PreviousPreviewOrRC$PreviousPreviewNumberVersion"
}
$CurrentDotNetVersionPreviewAndNumber=$CurrentDotNetVersion
If (-Not [System.String]::IsNullOrWhiteSpace($CurrentPreviewNumberVersion))
{
    $CurrentDotNetVersionPreviewAndNumber="$CurrentDotNetVersion-$CurrentPreviewOrRC$CurrentPreviewNumberVersion"
}


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
    )

    VerifyPathOrExit $tableOfContentsFilePath

    $correctTitle="# API Difference ${PreviousDotNetVersionPreviewAndNumber} vs ${CurrentDotNetVersionPreviewAndNumber}"

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
    )

    $readmePath=[IO.Path]::Combine($previewFolderPath, "README.md")
    If (Test-Path -Path $readmePath)
    {
        Remove-Item -Path $readmePath
    }
    New-Item -ItemType File $readmePath

    $friendlyPreviewOrRC = "";
    If ($CurrentPreviewOrRC -eq "preview")
    {
        $friendlyPreviewOrRC = "Preview"
    }
    ElseIf ($CurrentPreviewOrRC -eq "rc")
    {
        $friendlyPreviewOrRC = "RC"
    }

    $friendlyDotNetFullName = ".NET $CurrentDotNetVersion $friendlyPreviewOrRC $CurrentPreviewNumberVersion"

    Add-Content $readmePath "# $friendlyDotNetFullName API Changes"
    Add-Content $readmePath ""
    Add-Content $readmePath "The following API changes were made in $($friendlyDotNetFullName):"
    Add-Content $readmePath ""
    Add-Content $readmePath "- [Microsoft.NETCore.App](./Microsoft.NETCore.App/$CurrentDotNetVersionPreviewAndNumber.md)"
    Add-Content $readmePath "- [Microsoft.AspNetCore.App](./Microsoft.AspNetCore.App/$CurrentDotNetVersionPreviewAndNumber.md)"
    Add-Content $readmePath "- [Microsoft.WindowsDesktop.App](./Microsoft.WindowsDesktop.App/$CurrentDotNetVersionPreviewAndNumber.md)"
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
        [Parameter(Mandatory=$false)]
        [ValidateSet("preview", "rc", "")]
        [string]
        $previewOrRC
    ,
        [Parameter(Mandatory=$false)]
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
    $searchTerm = "$dotNetversion.*"
    If (-Not ([System.String]::IsNullOrWhiteSpace($previewOrRC)) -And -Not ([System.String]::IsNullOrWhiteSpace($previewNumberVersion)))
    {
        $searchTerm = "$searchTerm-$previewOrRC.$previewNumberVersion*"
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
$asmDiffExe = [IO.Path]::Combine($asmDiffArtifactsPath, "Release", "net7.0", "Microsoft.DotNet.AsmDiff.exe")
ReBuildIfExeNotFound $asmDiffExe $asmDiffProjectPath $asmDiffArtifactsPath


## Recreate api-diff folder in core repo folder

$previewFolderPath = [IO.Path]::Combine($CoreRepo, "release-notes", $CurrentDotNetVersion, "preview", "api-diff", "$CurrentPreviewOrRC$CurrentPreviewNumberVersion")
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

$tableOfContentsFile = "$CurrentDotNetVersionPreviewAndNumber.md"

$tableOfContentsFilePathNETCore = [IO.Path]::Combine($netCoreTargetFolder, $tableOfContentsFile)
$tableOfContentsFilePathAspNetCore = [IO.Path]::Combine($aspNetCoreTargetFolder, $tableOfContentsFile)
$tableOfContentsFilePathWindowsDesktop = [IO.Path]::Combine($windowsDesktopTargetFolder, $tableOfContentsFile)

RunAsmDiff $asmDiffExe $tableOfContentsFilePathNETCore $netCoreBeforeDllFolder $netCoreAfterDllFolder
RunAsmDiff $asmDiffExe $tableOfContentsFilePathAspNetCore $aspNetCoreBeforeDllFolder $aspNetCoreAfterDllFolder
RunAsmDiff $asmDiffExe $tableOfContentsFilePathWindowsDesktop $windowsDesktopBeforeDllFolder $windowsDesktopAfterDllFolder


## Replace the first line of the summmary files with the correct title, and write final readme

ReplaceTitle $tableOfContentsFilePathNETCore
ReplaceTitle $tableOfContentsFilePathAspNetCore
ReplaceTitle $tableOfContentsFilePathWindowsDesktop

CreateReadme $previewFolderPath
