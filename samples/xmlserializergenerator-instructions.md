# Microsoft XmlSerializer Generator

Provides SGen tool to generate Xml Serialization code for types in specified assembly in order to improve the startup performance of a XmlSerializer when it serializes or deserializes objects of the specified types.

## Prequisition:

* [Install .NET Core 2.1 SDK](https://github.com/dotnet/core-setup#daily-builds) into a supported developer configuration.
* [Install .NET Core 2.1 RUNTIME](https://github.com/dotnet/core-setup#daily-builds) into a supported developer configuration.

## Creating an app:

* From the terminal/commandline create a library app.

* Run `dotnet new library --name MyData`

* Add the types you need in the library. 

* Install the Microsoft.XmlSerializer.Generator package on the project from myget
  
  a.	Add a new package source with the MyGet url (https://dotnet.myget.org/F/dotnet-core/api/v3/index.json) 
  
  b. Search the latest released 1.0.0-preview1-*** version from (https://dotnet.myget.org/feed/dotnet-core/package/nuget/Microsoft.XmlSerializer.Generator) e.g. 1.0.0-preview1-25718-03 and add the following lines in the project
  ```
  <ItemGroup>
         <PackageReference Include="Microsoft.XmlSerializer.Generator" Version="1.0.0-preview1-25718-03" />
  </ItemGroup>
  ```

* Edit the project and add DotNetCliToolReference as the following. The version must match the package version.

  ```
  <?xml version="1.0" encoding="utf-8"?>
  <ItemGroup>
      <DotNetCliToolReference Include="Microsoft.XmlSerializer.Generator" Version="1.0.0-preview1-25718-03" />
  </ItemGroup>
  ```

* Run `dotnet restore` to retore the package.

* Run `dotnet build` to build the package.
  If all succeed, a file named <AssemblyName>.XmlSerializers.dll will be generated under the debug folder. You should check the warning in the output window if the serializer fail to generate.

* Create a console app and add a project reference for the library. Build and the library assembly and its generated serializer will all be in the output folder of the console app.

* Run `dotnet publish` to publish the package.
  The generated serializer will be copied to the PublishOutput folder as well.
