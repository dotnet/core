# Using Microsoft XmlSerializer Generator on .Net Core

Use Microsoft XmlSerializer Generator to generate Xml Serialization code for types in specified project to improve the startup performance of a XmlSerializer when it serializes or deserializes objects of the specified types.

## Prequisition:

The instructions assume you are using [.NET Core SDK daily builds](https://github.com/dotnet/cli#installers-and-binaries) and [.NET Core runtime daily builds](https://github.com/dotnet/core-setup#daily-builds). You can validate your .NET Core SDK version by typing `dotnet --info`.

## Instructions:

1. Create a library with `dotnet new library --name MyData`

1. cd into it, e.g. `cd MyData`

1.  Add a `nuget.config` file in the root of the project, using the following:
   * `dotnet new nuget`
   * Edit the new `nuget.config`. Remove `<clear />` and add the following line,
     
     `<add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />`
   * The final file should look like [nuget.config](nuget.config).

4. `dotnet add package Microsoft.XmlSerializer.Generator -v 1.0.0-preview1-25718-03`

4. Add the following lines in MyData.csproj. The version must match the package version.

  ```xml
  <ItemGroup>
      <DotNetCliToolReference Include="Microsoft.XmlSerializer.Generator" Version="1.0.0-preview1-25718-03" />
  </ItemGroup>
  ```

6. Run `dotnet restore` to retore the package.

6. Run `dotnet build` to build the package.
  If all succeed, a file named <AssemblyName>.XmlSerializers.dll will be generated under the debug folder. You should check the warning in the output window if the serializer fail to generate.

6. Create a console app and add a project reference for the library. Build and the library assembly and its generated serializer will all be in the output folder of the console app.

6. Run `dotnet publish` to publish the package.
  The generated serializer will be copied to the `PublishOutput` folder as well as the output assembly.
