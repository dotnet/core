## Implicit compilation sources includes in the Visual Studio 2017 RC3 release of the .NET Core SDK
As part of the RC3 release of Visual Studio 2017, a new version of the .NET Core SDK is included. With that, we've  moved the default includes and excludes for compile items and embedded resources to the SDK properties files. This means that you don't need to specify these items in your project file moving forward. 

The main reason for doing this is to reduce the clutter on your project file. The defaults that are present in the SDK should cover most common use cases, so there is no need to repeat them in every project that you create. This leads to shorter projects that are much easier to understand as well as edit by hand, if needed. 

The table below shows which element and which globs are both included and excluded in the SDK: 

| Element          	| Include glob                           	| Exclude glob                                     	            | Remove glob             	 |
|-------------------|-------------------------------------------|---------------------------------------------------------------|----------------------------|
| Compile          	| \*\*/\*.cs (or other language extensions) | \*\*/\*.user;  \*\*/\*.\*proj;  \*\*/\*.sln;  \*\*/\*.vssscc 	| N/A                     	 |
| EmbeddedResource 	| \*\*/\*.resx                             	| \*\*/\*.user; \*\*/\*.\*proj; \*\*/\*.sln; \*\*/\*.vssscc     | N/A                     	 |
| None             	| \*\*/\*                                  	| \*\*/\*.user; \*\*/\*.\*proj; \*\*/\*.sln; \*\*/\*.vssscc     | - \*\*/\*.cs; \*\*/\*.resx |

If you have globs in your project and you try to build it using the newest SDK, you'll get the following error:

> Duplicate Compile items were included. The .NET SDK includes Compile items from your project directory by default. You can either remove these items from your project file, or set the 'EnableDefaultCompileItems' property to 'false' if you want to explicitly include them in your project file. 

In order to get around this error, you can either remove the explicit Compile items that match the ones listed above, or you can set the `<EnableDefaultCompileItems>` property to false, like this:

```xml
<PropertyGroup>
    <EnableDefaultCompileItems>false</EnableDefaultCompileItems>
</PropertyGroup>
```
Setting this property to `false` will override implicit inclusion and the behavior will revert back to the previous SDKs where you had to specify the default globs in your project. 

This change does not modify the main mechanics of other includes. However, if you wish to specify, for example, some files to get published with your app, you can still use the known mechanisms in `csproj` for that (for example, the `<Content>` element).

### Recommendation
Moving forward, our recommendation is for you to remove the above default globs from your project and only add globs file paths for those artifacts that your app/library needs for various scenarios (runtime, NuGet packaging, etc.)
