# Microsoft.Bcl.Async

## Information

* [NuGet Package](https://nuget.org/packages/Microsoft.Bcl.Async)
* [Announcement](http://blogs.msdn.com/b/bclteam/archive/2013/04/17/microsoft-bcl-async-is-now-stable.aspx)
* [Report an issue](https://www.nuget.org/packages/Microsoft.Bcl.Async/ContactOwners)

## Version History

### 1.0.168

* Updated package dependencies and clarified supported platforms.

### 1.0.166

* Added Windows Phone 8.1 support

### 1.0.166-beta

* Fixed issue with missing Microsoft.Threading.Tasks.Extensions.Desktop.dll when targeting .Net 4.5

### 1.0.165

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/11/13/pcl-and-net-nuget-libraries-are-now-enabled-for-xamarin.aspx)
* Updated license to remove Windows-only restriction

### 1.0.16

* Switched to RTM
* Added support for build-time warnings around missing package references
* Release announcement can be found [here](http://blogs.msdn.com/b/bclteam/archive/2013/04/17/microsoft-bcl-async-is-now-stable.aspx)

### 1.0.14-rc

* Changed: Moved to latest Microsoft.Bcl package (1.0.16-rc).

### 1.0.13-beta

* Fixed: [ConfigureAwait(false) still continue on captured context when using Async Targeting Pack](http://connect.microsoft.com/VisualStudio/feedback/details/767008/configureawait-false-still-continue-on-captured-context-when-using-async-targeting-pack)
* Fixed: Silverlight 4 projects now get Microsoft.Threading.Tasks.Extensions.Silverlight
* Added: Package now references System.Net.dll automatically for .NET 4.0 projects so that networking extension methods work out of the box.
* Changed: Moved types in Microsoft.Threading.Tasks from System.* to Microsoft.* namespace to prevent name conflicts
* Changed: Package now includes Microsoft.Threading.Tasks for .NET 4.5, Windows Store apps and Windows Phone 8 projects to enable the consumption of custom awaiters.
* Changed: Microsoft.Bcl dependency is now not included for .NET 4.5, Windows Store apps and Windows Phone 8 projects because it is not needed.

### 1.0.12-beta

* Fixed: [TypeLoadException when using Async for WP7.5 version 1.0.11-beta](https://connect.microsoft.com/VisualStudio/feedback/details/768521/system-typeloadexception-when-using-async-for-wp7-5-version-1-0-11-beta)

### 1.0.11-beta

* Initial release
* [Announcement](http://blogs.msdn.com/b/bclteam/archive/2012/10/22/using-async-await-without-net-framework-4-5.aspx)

## Troubleshooting

### Issue 1

#### Symptom

You may get the following error when trying to add a reference to the Microsoft.Bcl.Async package:

    Attempting to resolve dependency 'Microsoft.Bcl (= 1.0.0-beta)'.
    Successfully installed 'Microsoft.Bcl 1.0.10-beta'.
    Successfully installed 'Microsoft.Bcl.Async 1.0.10-beta'.
    Successfully uninstalled 'Microsoft.Bcl 1.0.10-beta'.
    Install failed. Rolling back...
    Could not install package 'Microsoft.Bcl 1.0.10-beta'.
    You are trying to install this package into a project that targets '.NETPortable,Version=v4.0,Profile=Profile4',
    but the package does not contain any assembly references or content files that are compatible with that framework.
    For more information, contact the package author.

#### Resolution

This happens when trying to reference a NuGet package from a Portable Class
Library that supports platforms not supported by the package. For
`Microsoft.Bcl.Async`, this usually occurs when trying to reference it from a
Portable Class Library which supports Windows Phone 7.0. To resolve this, change
the Portable Class Library to target Windows Phone 7.5 and higher.

### Issue 2

#### Symptom

After installing the `Microsoft.Bcl` or `Microsoft.Bcl.Async` packages to
certain projects, you may get build errors or warnings similar to:

    Cannot await 'System.Threading.Tasks.Task'.

-or-

    The primary reference "Microsoft.Threading.Tasks" could not be resolved because it has an indirect dependency on the framework assembly "System.Runtime, Version=1.5.10.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" which could not be resolved in the currently targeted framework. ".NETFramework,Version=v4.0". To resolve this problem, either remove the reference "Microsoft.Threading.Tasks" or retarget your application to a framework version which contains "System.Runtime, Version=1.5.10.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a".

#### Resolution

`Microsoft.Bcl.Async` package is not supported in Visual Basic Web Application
projects. As a workaround, place all async/await usage in a class library and
consume that from the Web Application project.

Otherwise, for other project types add an `App.Config` to the project with the
following contents, replacing [version] with the version (for example,
`2.5.10.0`) of `System.Runtime` and `System.Threading.Tasks` that you are
referencing:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <runtime>
    <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
      <dependentAssembly>
        <assemblyIdentity name="System.Runtime" publicKeyToken="b03f5f7f11d50a3a" culture="neutral" />
        <bindingRedirect oldVersion="0.0.0.0-[version]" newVersion="[version]" />
      </dependentAssembly>
      <dependentAssembly>
        <assemblyIdentity name="System.Threading.Tasks" publicKeyToken="b03f5f7f11d50a3a" culture="neutral" />
        <bindingRedirect oldVersion="0.0.0.0-[version]" newVersion="[version]" />
      </dependentAssembly>
    </assemblyBinding>
  </runtime>
</configuration>
```

### Issue 3

#### Symptom

After retargeting a .NET Framework, Portable or Windows Phone project from an
older target framework version to a newer target framework version, you may get
build warnings similar to:

    The predefined type 'System.Runtime.CompilerServices.AsyncStateMachineAttribute' is defined in multiple assemblies in the global alias; using definition from 'c:\Program Files (x86)\Reference Assemblies\Microsoft\Framework\.NETFramework\v4.5\mscorlib.dll'

#### Resolution

Higher versions of these platforms already include the types from the
`Microsoft.Bcl` and `Microsoft.Bcl.Async` packages. Uninstall them from the
project, and remove the `<assemblyBinding>` elements from any `app.config` that
refers to `System.Runtime` and `System.Threading.Tasks`.

### Issue 4

#### Symptom

You get syntax errors when you attempt to use the Microsoft.Bcl.Async package in
a web site project, similar to:

    The type or namespace name 'async' could not be found (are you missing a using directive or an assembly reference?)

-or-

    The type or namespace name 'await' could not be found (are you missing a using directive or an assembly reference?)

#### Solution

`Microsoft.Bcl.Async` package is not supported in Web Sites. As a workaround,
place all async/await usage in a class library and consume that from the Web Site.

### Issue 5

#### Symptoms

When using the NuGet package restore feature the code doesn’t build with the
following error message:

    The imported project "<ProjectPath>\packages\Microsoft.Bcl.Build.<version>\tools\Microsoft.Bcl.Build.targets" was not found. Confirm that the path in the <Import> declaration is correct, and that the file exists on disk.

#### Solution

Package Restore is a feature of NuGet that will download any missing packages as
part of the build, which means the packages folder doesn’t need to be checked
into source control. However, this doesn’t work for NuGet packages that inject
MSBuild targets files. You will need to make sure all *.targets files under the
packages folder are being checked into version control.

For `Microsoft.Bcl.Build` you need check in the following file:

    Microsoft.Bcl.Build.<version>\tools\Microsoft.Bcl.Build.targets

### Issue 6

#### Symptoms

When adding the NuGet package to a project that is consumed by another project
with a different target framework you might see warnings similar to the
following:

    The primary reference "Microsoft.Threading.Tasks, Version=1.0.12.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a, processorArchitecture=MSIL" could not be resolved because it has an indirect dependency on the framework assembly "System.Runtime, Version=2.5.19.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" which could not be resolved in the currently targeted framework. ".NETFramework,Version=v4.5". To resolve this problem, either remove the reference "Microsoft.Threading.Tasks, Version=1.0.12.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a, processorArchitecture=MSIL" or retarget your application to a framework version which contains "System.Runtime, Version=2.5.19.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a".
    The primary reference "Microsoft.Threading.Tasks.Extensions, Version=1.0.12.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a, processorArchitecture=MSIL" could not be resolved because it has an indirect dependency on the framework assembly "System.Runtime, Version=2.5.19.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" which could not be resolved in the currently targeted framework. ".NETFramework,Version=v4.5". To resolve this problem, either remove the reference "Microsoft.Threading.Tasks.Extensions, Version=1.0.12.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a, processorArchitecture=MSIL" or retarget your application to a framework version which contains "System.Runtime, Version=2.5.19.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a".

#### Solution

The problem is that NuGet added incorrect binding redirects for platform
assemblies. To remove them, please open the `app.config` for the project that
caused the warnings and remove the highlighted entries:

```xml
<?xmlversion="1.0"encoding="utf-8"?>
<configuration>
  <runtime>
    <assemblyBindingxmlns="urn:schemas-microsoft-com:asm.v1">
      <dependentAssembly>
        <assemblyIdentityname="System.Runtime"publicKeyToken="b03f5f7f11d50a3a"culture="neutral" />
        <bindingRedirectoldVersion="0.0.0.0-2.5.19.0"newVersion="2.5.19.0" />
      </dependentAssembly>
      <dependentAssembly>
        <assemblyIdentityname="System.Threading.Tasks"publicKeyToken="b03f5f7f11d50a3a"culture="neutral" />
        <bindingRedirectoldVersion="0.0.0.0-2.5.19.0"newVersion="2.5.19.0" />
      </dependentAssembly>
    </assemblyBinding>
  </runtime>
</configuration>
```

### Issue 7

#### Symptoms

When building a Windows Runtime Component (.winmd) you might get one of the following error messages:

    Could not resolve reference 'Assembly(Name=System.Threading.Tasks, Version=1.5.11.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a)'.
    Could not resolve reference 'Assembly(Name=System.Threading.Tasks, Version=2.5.11.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a)'.

Please note the version number that it mentions.

#### Solution

This is an issue with the tool that creates a Windows Runtime Component
(WINMDEXP). Until we address this issue you will need to work around this by
adding a reference to the assembly directly by following these steps:

1. Unload the Windows Runtime Component project by right click the project node
   in Solution Explorer and selecting Unload Project.
2. Edit the project by right clicking it again in Solution Explorer and
   selecting Edit `<Project Name>`.
3. Jump to end of the file (after the imports). Depending on the version number
   of the error message paste in one of the following snippets before the
   closing `</Project>` element.

Version 1.5.x:

```xml
<Target Name="InjectAsyncDependencies" BeforeTargets="ExportWindowsMDFile">
  <ItemGroup>
    <ReferencePath Include="..\packages\Microsoft.Bcl.1.0.19\lib\sl4\System.Threading.Tasks.dll" />
  </ItemGroup>
</Target>
```

Version 2.5.x:

```xml
<Target Name="InjectAsyncDependencies" BeforeTargets="ExportWindowsMDFile">
  <ItemGroup>
    <ReferencePath Include="..\packages\Microsoft.Bcl.1.0.19\lib\net40\System.Threading.Tasks.dll" />
  </ItemGroup>
</Target>
```

### Issue 8

#### Symptom

When targeting .NET 4 you get the following error:

    Could not load file or assembly 'System.Core, Version=2.0.5.0

#### Resolution

Using `Microsoft.Bcl.Async` on .NET 4 requires http://support.microsoft.com/kb/2468871 to be installed.

### Issue 9

#### Symptom

ClickOnce applications targeting .NET Framework 4.0 that reference the
`Microsoft.`Bcl or `Microsoft.Bcl.Async` packages may experience a
`TypeLoadException` or other errors after being installed.

#### Resolution

This occurs because ClickOnce fails to deploy certain required assemblies. As a
workaround, do the following:

1. Right-click on the project and choose **Add Existing Item**
2. Browse to the folde `net40` within the `Microsoft.Bcl` package folder
3. In the File name text box enter `*.*`
4. Holding CTRL, select `System.Runtime.dll` and `System.Threading.Tasks.dll`
5. Click the down-arrow next to the Add button and choose Add as Link
6. In Solution Explorer, holding CTRL select `System.Runtime.dll` and `System.Threading.Taks.dll`
7. Right-click the selection, choose Properties and change **Copy to Output Directory** to **Copy always**
8. Republish
