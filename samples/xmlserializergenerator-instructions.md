# Using Microsoft XmlSerializer Generator on .Net Core

When a running application creates an instance of XmlSerializer, it generates a temporary assembly containing the implementation of the serializer. This happens once for each type for which an XmlSerializer is needed. To improve performance, we can use Microsoft XmlSerializer Generator to pre-generate code for an XmlSerializer for each specified type in a project and compile it into an assembly. This assembly will then be used by the application when creating an XmlSerializer instead of generating a temporary one.

## Prerequisition

You need to install the followings on your machine:
* [.NET Core SDK daily builds](https://github.com/dotnet/cli#installers-and-binaries) 
* [.NET Core runtime daily builds](https://github.com/dotnet/core-setup#daily-builds). 

You can validate your .NET Core SDK version by typing `dotnet --info`.

## Instructions

Here are the step by step instructions how to create a dotnet project and install the XmlSerializer Generator for that project.

1. Create a library project that contains your custom data types. E.g. create a library named MyData using the CLI: `dotnet new library --name MyData`

2. Go to the folder of the project you created in step 1, e.g. `cd MyData`

3.  Add a nuget.config file in the root of the project, using the following:
    * `dotnet new nuget`
    * Edit the new nuget.config. Remove `<clear />` and add the following line:

      `<add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />`

    - The final file should look like [nuget.config](nuget.config):
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />
  </packageSources>
</configuration>
```

4. Add a reference to the Microsoft.XmlSerializer.Generator package:

    * `dotnet add package Microsoft.XmlSerializer.Generator -v 1.0.0-preview1-25718-03`

    * Add the following lines in MyData.csproj.

  ```xml
    <ItemGroup>
        <DotNetCliToolReference Include="Microsoft.XmlSerializer.Generator" Version="1.0.0-preview1-25718-03" />
    </ItemGroup>
  ```

5. Run `dotnet restore`.

5. Run `dotnet build`. If everything succeeds, a file named \<AssemblyName\>.XmlSerializers.dll will be generated in the output folder. You will see warnings in the build output if the serializer failed to generate.

5. Create a console app and add a project reference to the library. Building the app will generate serialization code for the library and the assembly will be copied to the output folder of the app.

5. Run `dotnet publish` to publish the app.
