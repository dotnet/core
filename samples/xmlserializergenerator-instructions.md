# Using Microsoft Xml Serializer Generator on .Net Core

Like the Xml Serializer Generator (sgen.exe) on desktop, Microsoft.XmlSerializer.Generator NuGet package is the solution for .NET Core and .NET Standard Libraries. It creates an Xml serialization assembly for types contained in an assembly to improve the startup performance of Xml serialization when serializing or de-serializing objects of those types using XmlSerializer. 

You can start using the tool today following the instructions below. 

## Prerequisites

* [.Net Core SDK of version 2.0.2 or later](https://www.microsoft.com/net/download/windows)
* [.NET Core runtime Release/2.0.X](https://github.com/dotnet/core-setup#daily-builds) (build 2.0.4-servicing-25831-01 or later. Note down the build version which will be used in the step 3 of the instructions below.)
  
## Instructions

Here are the step by step instructions on how to use Xml Serializer Generator in a .Net Core console application.

1. Create a .Net Core console application, e.g. create an app named 'MyApp' with the command,
    ```
    dotnet new console --name MyApp
    ```
2. The Microsoft.XmlSerializer.Generator package is currently available on MyGet only. We need to add dotnet-core MyGet feed as a NuGet source. For example, add a file named `nuget.config` as shown below in \MyApp folder.
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <configuration>
      <packageSources>
        <add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />
      </packageSources>
    </configuration>
    ```
3. Set the project's `RuntimeFrameworkVersion` to the build version of the runtime you have installed. For example, if the build version is `2.0.4-servicing-25831-01`, add the following lines in MyApp.csproj,
    ```xml
    <PropertyGroup>
      <RuntimeFrameworkVersion>2.0.4-servicing-25831-01</RuntimeFrameworkVersion>
    </PropertyGroup>
    ```
4. Edit the .csproj and add a reference to the Microsoft.XmlSerializer.Generator package. For example, 
    * Run command: `dotnet add package Microsoft.XmlSerializer.Generator -v 1.0.0-preview1-25906-03`
    * Add the following lines in MyApp.csproj,
    ```xml
    <ItemGroup>
      <DotNetCliToolReference Include="Microsoft.XmlSerializer.Generator" Version="1.0.0-preview1-25906-03" />
    </ItemGroup>
    ```
5. Add a class in the application. For example, add the class below in Program.cs,
    ```c#
    public class MyClass
    {
        public int Value;
    }
    ```
    Now you can create an `XmlSerializer` for MyClass.
    ```c#
    var serializer = new System.Xml.Serialization.XmlSerializer(typeof(MyClass));
    ```
    
6. Build the application by running `dotnet build`. If everything succeeds, an assembly named MyApp.XmlSerializers.dll will be generated in the output folder. You will see warnings in the build output if the tool failed to generate the assembly.

Start the application and it will automatically load and use the pre-generated serializers at runtime.

