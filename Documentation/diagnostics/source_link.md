# Source Link
Source Link is a developer productivity feature that allows unique information about an assembly's original source code to be embedded in its PDB during compilation. The [Roslyn](https://github.com/dotnet/roslyn/wiki/Roslyn%20Overview) compiler flag for Source Link is `/sourcelink:<file>`.

## Why Source Link?
Most debugging is done against locally built source code on a developer's machine. In this scenario, matching the binary to the source is not difficult. However, there are many debugging scenarios where the original source code is not immediately available. Two good examples of this are debugging crash dumps or third party libraries. In these scenarios, it can be very difficult for a developer to acquire the exact source code that was built to produce the binary they are debugging. Source Link solves this problem by embedding unique information about the source code (such as a git commit hash) in the PDB. Diagnostic tools, such as debuggers, can use this unique information to retrieve the original source code from hosted services (such as [GitHub](https://github.com)).

## Source Link File Specification
The `/sourcelink:<file>` compiler flag will embed a JSON configuration file in the PDB. This configuration file would be generated as part of the build process. The JSON configuration file contains a simple mapping of local file path to URL where the source file can be retrieved via http or https. A debugger would retrieve the original file path of the current location from the PDB, look this path up in the Source Link map, and use the resulting URL to download the source file.

### MSBuild Example
There is an open source tool available for generating Source Link configuration at build time. See https://github.com/ctaggart/SourceLink for the most up to date information.

Generating and embedding a Source Link file can also be done manually with an MSBuild Target. The following is an example of enabling source link in a .csproj for a project hosted on GitHub.
```
...
  <PropertyGroup Condition="'$(UseSourceLink)' == 'true'">
    <SourceLink>$(IntermediateOutputPath)source_link.json</SourceLink>
  </PropertyGroup>
  ...
  <Target Name="GenerateSourceLink" BeforeTargets="CoreCompile" Condition="'$(UseSourceLink)' == 'true'">
    <PropertyGroup>
      <SrcRootDirectory>$([System.IO.Directory]::GetParent($(MSBuildThisFileDirectory.TrimEnd("\"))))</SrcRootDirectory>
      <SourceLinkRoot>$(SrcRootDirectory.Replace("\", "\\"))</SourceLinkRoot>
    </PropertyGroup>

    <Exec Command="git config --get remote.origin.url" ConsoleToMsBuild="true">
      <Output TaskParameter="ConsoleOutput" PropertyName="RemoteUri" />
    </Exec>

    <Exec Command="git rev-parse HEAD" ConsoleToMsBuild="true" Condition = " '$(TF_BUILD)' != 'True' ">
      <Output TaskParameter="ConsoleOutput" PropertyName="LatestCommit" />
    </Exec>

    <Exec Command="git merge-base --fork-point refs/remotes/origin/master HEAD" ConsoleToMsBuild="true" Condition = " '$(TF_BUILD)' == 'True' ">
      <Output TaskParameter="ConsoleOutput" PropertyName="LatestCommit" />
    </Exec>

    <!-- Write out the source file for this project to point at raw.githubusercontent.com -->
    <WriteLinesToFile File="$(IntermediateOutputPath)source_link.json" Overwrite="true" Lines='{"documents": { "$(SourceLinkRoot)\\*" : "$(RemoteUri.Replace(".git", "").Replace("github.com", "raw.githubusercontent.com"))/$(LatestCommit)/*" }}' />
  </Target>
...
```

### Source Link JSON Schema
```json
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "SourceLink",
    "description": "A mapping of source file paths to URL's",
    "type": "object",
    "properties": {
        "documents": {
            "type": "object",
            "minProperties": 1,
            "additionalProperties": {
                "type": "string"
            },
            "description": "Each document is defined by a file path and a URL. Original source file paths are compared 
                             case insensitive to documents and the resulting URL is used to download source. The document 
                             may contain an asterisk to represent a wildcard in order to match anything in the asterisk's 
                             location. The rules for the asterisk are as follows:
                             1. The only acceptable wildcard is one and only one '*', which if present will be replaced by a relative path.
                             2. If the file path does not contain a *, the URL cannot contain a * and if the file path contains a * the URL must contain a *.
                             3. If the file path contains a *, it must be the final character.
                             4. If the URL contains a *, it may be anywhere in the URL."
        }
    },
    "required": ["documents"]
}
```

### Examples
The simplest Source Link JSON would map every file in the project directory to a URL with a matching relative path. The following example shows what the Source Link JSON would look like for the .NET [Code Formatter](https://github.com/dotnet/codeformatter). In this example, Code Formatter has been cloned to `C:\src\CodeFormatter\` and is being built at commit `bcc51178e1a82fb2edaf47285f6e577989a7333f`.
```json
{
    "documents": {
        "C:\\src\\CodeFormatter\\*": "https://raw.githubusercontent.com/dotnet/codeformatter/bcc51178e1a82fb2edaf47285f6e577989a7333f/*"
    }
}
```
In this example, the file `C:\src\CodeFormatter\src\Microsoft.DotNet.CodeFormatting\FormattingEngine.cs` would be retrieved from `https://raw.githubusercontent.com/dotnet/codeformatter/bcc51178e1a82fb2edaf47285f6e577989a7333f/src/Microsoft.DotNet.CodeFormatting/FormattingEngine.cs`

If the project was built on linux and was cloned to `/usr/local/src/CodeFormatter/`, the Source Link JSON would be:
```json
{
    "documents": {
        "/usr/local/src/CodeFormatter/*": "https://raw.githubusercontent.com/dotnet/codeformatter/bcc51178e1a82fb2edaf47285f6e577989a7333f/*"
    }
}
```

Source Link configuration can also contain absolute mappings from file paths to URLs without an asterisk. Using the Code Formatter example from above, every source file could be mapped explicitly:
```js
{
    "documents": {
        "C:\\src\\CodeFormatter\\src\\CodeFormatter\\Program.cs":               "https://raw.githubusercontent.com/dotnet/codeformatter/bcc51178e1a82fb2edaf47285f6e577989a7333f/src/CodeFormatter/Program.cs",
        "C:\\src\\CodeFormatter\\src\\CodeFormatter\\CommandLinerParser.cs":    "https://raw.githubusercontent.com/dotnet/codeformatter/bcc51178e1a82fb2edaf47285f6e577989a7333f/src/CodeFormatter/CommandLineParser.cs",
        "C:\\src\\CodeFormatter\\src\\DeadRegions\\Program.cs":                 "https://raw.githubusercontent.com/dotnet/codeformatter/bcc51178e1a82fb2edaf47285f6e577989a7333f/src/DeadRegions/Program.cs",
        "C:\\src\\CodeFormatter\\src\\DeadRegions\\Options.cs":                 "https://raw.githubusercontent.com/dotnet/codeformatter/bcc51178e1a82fb2edaf47285f6e577989a7333f/src/DeadRegions/Options.cs",
        "C:\\src\\CodeFormatter\\src\\DeadRegions\\OptionParser.cs":            "https://raw.githubusercontent.com/dotnet/codeformatter/bcc51178e1a82fb2edaf47285f6e577989a7333f/src/DeadRegions/OptionParser.cs",
        // additional file listings...
    }
}
```

Source Link JSON may contain multiple relative and/or absolute mappings in any order. They will be resolved in order from most specific to least specific. Here is an example of a valid Source Link JSON for an arbitrary project structure:
```json
{
    "documents": {
        "C:\\src\\*":                   "http://MyDefaultDomain.com/src/*",
        "C:\\src\\foo\\*":              "http://MyFooDomain.com/src/*",
        "C:\\src\\foo\\specific.txt":   "http://MySpecificFoodDomain.com/src/specific.txt",
        "C:\\src\\bar\\*":              "http://MyBarDomain.com/src/*"
    }
}
```
In this example:
- All files under directory `bar` will map to a relative URL beginning with `http://MyBarDomain.com/src/`.
- All files under directory `foo` will map to a relative URL beginning with `http://MyFooDomain.com/src/` **EXCEPT** `foo/specific.txt` which will map to `http://MySpecificFoodDomain.com/src/specific.txt`.
- All other files anywhere under the `src` directory will map to a relative url beginning with `http://MyDefaultDomain.com/src/`.

## Tooling
- [Visual Studio 2017](https://www.visualstudio.com/downloads/)
    - First debugger to support Source Link.
    - Supports Source Link in [Portable PDBs](https://github.com/dotnet/core/blob/master/Documentation/diagnostics/portable_pdb.md) -- default PDB format for .NET Core projects.
    - VS 2017 Update 3 supports Source Link in Windows PDBs -- default PDB format for .NET Framework projects.
    - The current implementation uses a case insensitive string comparison between the file path and the Source Link entry. Using multiple entries that differ only in casing is not supported; the first entry will be used and the second entry that differs only by case will be ignored. Here is an example of an unsupported Source Link JSON:
        ```json
        {
            "documents": {
                "/FOO/*": "http://.../X/*",
                "/foo/*": "http://.../Y/*"
            }
        }
        ```
- [C# Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)
    - Source Link is a planned feature but is not yet supported. 
    - [Omnisharp-vscode issue](https://github.com/OmniSharp/omnisharp-vscode/issues/373)
- [JetBrains dotPeek](https://www.jetbrains.com/dotpeek) and [JetBrains ReSharper](https://www.jetbrains.com/resharper)
    - First .NET decompiler to support Source Link.
    - Supports Source Link in [Portable PDBs](https://github.com/dotnet/core/blob/master/Documentation/diagnostics/portable_pdb.md) -- default PDB format for .NET Core projects.
    - Can navigate to sources referenced in `source_link.json` or embedded in the Portable PDB.
    - Can present `source_link.json` contents to the user.
