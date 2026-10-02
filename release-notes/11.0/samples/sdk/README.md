# SDK release-note validation

Run `dotnet run Program.cs` from this directory with SDK `11.0.100-rc.2.26475.137`. The file-based app checks that a quoted file-level property becomes generated assembly metadata.

To verify MSBuild property expansion in file-based launch-profile arguments, run `dotnet run --file launch-profile/Program.cs --launch-profile AssemblyName` from this directory. The adjacent `Program.run.json` defines the profile, and the file-based program declares `AssemblyName`; it exits with an error if the property is not expanded.
