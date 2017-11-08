# Using Microsoft Xml Serializer Generator on .Net Core

Like the Xml Serializer Generator (sgen.exe) on desktop, Microsoft.XmlSerializer.Generator NuGet package is the solution for .NET Core and .NET Standard Libraries. It creates an Xml serialization assembly for types contained in an assembly in order to improve the startup performance of Xml serialization when serializing or de-serializing objects of those types using XmlSerializer. 

You can start using the tool today following the instructions below. 

## Prerequisition

* Install [.Net Core SDK of version 2.0.X](https://www.microsoft.com/net/download/windows).
* Install the latest [.NET Core runtime Release/2.0.X build](https://github.com/dotnet/core-setup#daily-builds). 
  
  
  Note: You would need to set the project's `RuntimeFrameworkVersion` to the build version of the runtime, which can be found on the download page. For example, if the build version is `2.0.4-servicing-25831-01`, add the following lines in the project's .csproj,

```xml
  <PropertyGroup>
    <RuntimeFrameworkVersion>2.0.4-servicing-25831-01</RuntimeFrameworkVersion>
  </PropertyGroup>
```

## Instructions

Here are the step by step instructions on how to Xml Serializer Generator in a .Net Core console application.

1. Create a .Net Core console application, e.g. create a app named 'MyApp' using the command: `dotnet new console --name MyApp`.

2. Add dotnet-core MyGet feed to the project. 
    * Go to the project folder and create a file named `nuget.config` with the following content. The final file should look like [nuget.config](nuget.config)
    
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

    * Add the following lines in MyApp.csproj.

```xml
  <ItemGroup>
    <DotNetCliToolReference Include="Microsoft.XmlSerializer.Generator" Version="1.0.0-preview1-25906-03" />
  </ItemGroup>
```

4. Build the application by running `dotnet restore` and  `dotnet build`. If everything succeeds, a file named MyApp.XmlSerializers.dll will be generated in the output folder. You will see warnings in the build output if the tool failed to generate the serialization code.

Now you can use `XmlSerializer` in the application. And the application will be able to load and use the pre-generated serializers at runtime.

