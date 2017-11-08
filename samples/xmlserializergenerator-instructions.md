# Using Microsoft XmlSerializer Generator on .Net Core

When a running application creates an instance of XmlSerializer, it generates a temporary assembly containing the implementation of the serializer. This happens once for each type for which an XmlSerializer is needed. To improve performance, we can use Microsoft XmlSerializer Generator to pre-generate code for an XmlSerializer for each specified type in a project and compile it into an assembly. This assembly will then be used by the application when creating an XmlSerializer instead of generating a temporary one.

## Prerequisition

Install the latest 2.0 build released on Oct. on your machine from the following link since the earlier version won't work 
* [.NET Core runtime Release/2.0.X build](https://github.com/dotnet/core-setup#daily-builds). 

The version number is just above the link of the installer e.g. version 2.0.4-servicing-25831-01. You need specify the version through RuntimeFrameworkVersion in your .csproj like the following.

  ```xml
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <RuntimeFrameworkVersion>2.0.4-servicing-25831-01</RuntimeFrameworkVersion>
  </PropertyGroup>
 ```

## Instructions

Here are the step by step instructions how to create a dotnet project and install the XmlSerializer Generator for that project.

1. Create a library project that contains your custom data types. E.g. create a library named MyLibrary using the CLI: `dotnet new library --name MyLibrary`

2. Add dotnet-core MyGet feed to the project.
    * Go to the folder of the project you created in step 1, e.g. `cd MyLibrary`
    * Add a nuget.config file in the root of the project, using the command `dotnet new nuget`
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

3. Add a reference to the Microsoft.XmlSerializer.Generator package:

    * `dotnet add package Microsoft.XmlSerializer.Generator -v 1.0.0-preview1-25906-03`

    * Add the following lines in MyLibrary.csproj.

  ```xml
    <ItemGroup>
        <DotNetCliToolReference Include="Microsoft.XmlSerializer.Generator" Version="1.0.0-preview1-25906-03" />
    </ItemGroup>
  ```

4. Run `dotnet restore` and  `dotnet build` to build the library. If everything succeeds, a file named MyLibrary.XmlSerializers.dll will be generated in the output folder. You will see warnings in the build output if the serializer failed to generate.

5. Create a console app and add a project reference to the library. Building the app will generate serialization code for the library and the assembly called MyLibrary.XmlSerializers.dll will be copied to the output folder of the app. You need make sure your console app will use the latest 2.0 build by specifying the RuntimeFrameWorkVersion as mentioned in Prequisition.

6. Add code to create XmlSerializer with the type defined in the library such as the following. MyLibrary.XmlSerializers.dll will be loaded into the memory after executing the following line. 

   `XmlSerializer serializer = new XmlSerializer(typeof(MyClass));`
