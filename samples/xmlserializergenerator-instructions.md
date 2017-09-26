# Using Microsoft XmlSerializer Generator on .Net Core

An XmlSerializer generates serialization code and a serialization assembly for each type every time an application run during the Xml Serialization. To improve the performance, we can use Microsoft XmlSerializer Generator to generate Xml Serialization code for types in specified project and compile it into an assembly in advance. These assemblies can then run with the application.

## Prerequisition

You need install the followings on your machine:
* [.NET Core SDK daily builds](https://github.com/dotnet/cli#installers-and-binaries) 
* [.NET Core runtime daily builds](https://github.com/dotnet/core-setup#daily-builds). 

You can validate your .NET Core SDK version by typing `dotnet --info`.

## Instructions

Here is the step by step how to create a dotnet project and install the XmlSerializer Generator on the project.

1. Create a library project that contains you custom data. e.g. Create a library named MyData using the CLI: `dotnet new library --name MyData`

2. Go to the folder of the project you created in step1, e.g. `cd MyData`

3.  Add a nuget.config file in the root of the project, using the following:
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
