# .NET 9 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET WPF

#### 1. Usage of incorrect types as DynamicResource
In earlier previews (or .NET 8 and before), applications that attempted to use a `DynamicResource` with incorrect types, and referenced the same from a library, would silently fail by swallowing the exception. However, with the introduction of DynamicResource optimization [here](https://github.com/dotnet/wpf/pull/5610), this behavior has changed. The same implementation will now result in a `XamlParseException` being thrown, potentially causing the application to crash.

The crash might look something like this:
```
PresentationFramework.dll!System.Windows.Markup.XamlReader.RewrapException(System.Exception e, System.Xaml.IXamlLineInfo lineInfo, System.Uri baseUri)
PresentationFramework.dll!System.Windows.Markup.WpfXamlLoader.Load(System.Xaml.XamlReader xamlReader, System.Xaml.IXamlObjectWriterFactory writerFactory, bool skipJournaledProperties, object rootObject, System.Xaml.XamlObjectWriterSettings settings, System.Uri baseUri)
PresentationFramework.dll!System.Windows.Markup.WpfXamlLoader.LoadBaml(System.Xaml.XamlReader xamlReader, bool skipJournaledProperties, object rootObject, System.Xaml.Permissions.XamlAccessLevel accessLevel, System.Uri baseUri)
PresentationFramework.dll!System.Windows.Markup.XamlReader.LoadBaml(System.IO.Stream stream, System.Windows.Markup.ParserContext parserContext, object parent, bool closeStream)
PresentationFramework.dll!System.Windows.Application.LoadComponent(object component, System.Uri resourceLocator)
```

#### Mitigation:
Developers can prevent this crash by updating the resource with the correct value types. However, for those who need to maintain the previous behavior, an **opt-out switch** is being provided in the .NET 9 RC1 release. This switch allows applications to revert to the unoptimized `DynamicResource` usage.


#### 2. Incorrect rendering of applications launched with dark theme
Applications using library-based themes might encounter incorrect rendering of the dark theme due to the implementation of the `Fluent` theme. This could result in incorrect resource settings for windows, such as background and accent colors, which may appear transparent.

#### Available Workaround:
This issue occurs only when starting the application with the dark theme enabled. To ensure correct rendering, the resources can be reloaded. This reloading process can be implemented by hooking into a window event, such as `ContentRendered`.

The implementation for the same would look something like this -
```cs
private void ReactiveWindow_ContentRendered(object sender, System.EventArgs e)
{
    var x = Application.Current.Resources;

    Application.Current.Resources = null;

    Application.Current.Resources = x;
}
```

The behavior will be **fixed in .NET 9 RC1** release.

## .NET SDK

#### .NET 9.0.100-RC.1 will fail when used with 17.11

There is an incompatible dependency between a file loaded from the SDK and the dependencies that Visual Studio includes.

```
NETSDK1060 Error reading assets file: Error loading lock file '...\obj\project.assets.json' : Could not load file or assembly 'System.Text.Json, Version=8.0.0.4, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51' or one of its dependencies. The system cannot find the file specified.
```
**Workaround**
If you must use 17.11, you may be able to workaround this by copying a file from the SDK into a Visual Studio folder (note that you should delete this file in the future)
`copy "C:\Program Files\dotnet\sdk\9.0.100-preview.7.24407.12\Sdks\Microsoft.NET.Sdk\tools\net472\System.Text.Json.dll" "C:\Program Files\Microsoft Visual Studio\2022\Preview\Common7\IDE\CommonExtensions\Microsoft\NuGet"`

This behavior will be **fixed in .NET 9 SDK RC2** release
