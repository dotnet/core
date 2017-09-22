# Using Microsoft XmlSerializer Generator on .Net Core

Use Microsoft XmlSerializer Generator to generate Xml Serialization code for types in specified project to improve the startup performance of a XmlSerializer when it serializes or deserializes objects of the specified types.

## Prequisition:

The instructions assume you are using [.NET Core SDK daily builds](https://github.com/dotnet/cli#installers-and-binaries) and [.NET Core runtime daily builds](https://github.com/dotnet/core-setup#daily-builds). You can validate your .NET Core SDK version by typing `dotnet --info`.

## Instructions:

1. Create a library with `dotnet new library --name MyData`

1. cd into the project folder, e.g. `cd MyData`

1.  Add a nuget.config file in the root of the project, using the following:
    * `dotnet new nuget`
    * Edit the new nuget.config. Remove `<clear />` and add the following line,
     
     `<add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />`
    * The final file should look like [nuget.config](nuget.config).

4. Add reference to Microsoft.XmlSerializer.Generator package,

    * `dotnet add package Microsoft.XmlSerializer.Generator -v 1.0.0-preview1-25718-03`

    * Add the following lines in MyData.csproj.

  ```
    <ItemGroup>
        <DotNetCliToolReference Include="Microsoft.XmlSerializer.Generator" Version="1.0.0-preview1-25718-03" />
    </ItemGroup>
  ```

5. Run `dotnet restore`.

5. Run `dotnet build`. If all succeed, a file named <AssemblyName>.XmlSerializers.dll will be generated under the output folder. You would see warnings in the output window if the serializer fail to generate.

5. Create a console app and add a project reference to the library. Building the app will generate serialization code for the library and the assembly will be copied to the output folder of the app.

5. Run `dotnet publish` to publish the app.
