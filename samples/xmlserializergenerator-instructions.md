 # Using Xml Serializer Generator on .NET Core

Like the Xml Serializer Generator (sgen.exe) on desktop, Microsoft.XmlSerializer.Generator NuGet package is the solution for .NET Core and .NET Standard Libraries. It creates an Xml serialization assembly for types contained in an assembly to improve the startup performance of Xml serialization when serializing or de-serializing objects of those types using XmlSerializer. 

You can start using the tool today following the instructions below. 

## Prerequisites

The following is required for Microsoft.XmlSerializer.Generator to work. You can use command `dotnet --info` to check which versions of .NET Core SDK and runtime you may already have installed.

* [.NET Core SDK 2.0.2 or later](https://www.microsoft.com/net/download/windows)
* [.NET Core runtime 2.0.3 or later](https://github.com/dotnet/core/blob/master/release-notes/download-archives/2.0.3.md)
  
## Instructions

Here are the step by step instructions on how to use Xml Serializer Generator in a .NET Core console application.

1. Create a .NET Core console application, e.g. create an app named 'MyApp' with the command,
    ```
    dotnet new console --name MyApp
    ```
1. Edit the .csproj and add a reference to the Microsoft.XmlSerializer.Generator package. For example,

    1. Run command: `dotnet add package Microsoft.XmlSerializer.Generator -v 1.0.0`

    1. Add the following lines in MyApp.csproj,
    ```xml
    <ItemGroup>
      <DotNetCliToolReference Include="Microsoft.XmlSerializer.Generator" Version="1.0.0" />
    </ItemGroup>
    ```
1. Add a class in the application. For example, add the class below in Program.cs,
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
1. Build the application by running `dotnet build`. If everything succeeds, an assembly named MyApp.XmlSerializers.dll will be generated in the output folder. You will see warnings in the build output if the tool failed to generate the assembly.

Start the application and it will automatically load and use the pre-generated serializers at runtime.
