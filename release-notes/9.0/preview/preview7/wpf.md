# .NET WPF updates in .NET 9 Preview 7

Here's a summary of what's new in .NET WPF in this preview release:

* [Introduction of `ThemeMode` (Experimental)](#introduction-of-thememode-experimental)
* [Introduction of `AccentColor`s as `SystemColors`](#introduction-of-accentcolors-as-systemcolors)

.NET 9 Preview 7:
* [Discussion](https://aka.ms/dotnet/9/preview7)
* [Release notes](README.md)

## Introduction of `ThemeMode` (Experimental)
The `ThemeMode` API is designed to facilitate the newly introduced Fluent Themes and the dynamic adjustment of these theme settings in WPF applications. It allows developers to easily toggle between different visual themes, enhancing user experience and accessibility.
This is an **experimental** API introduced at the `Application` and the `Window` level with options to choose from Light, Dark, System and None (Default) theme.

### Usage of the `ThemeMode` API
A developer can set the Application or Window to the desired ThemeMode from the XAML or the code-behind.
1. **Setting Application ThemeMode from XAML:**
    In App.xaml include the ThemeMode property as shown below.
    ```xml
    <Application 
        x:Class="YourSampleApplication.App"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:local="clr-namespace:YourSampleApplication"
        ThemeMode="Dark">
        <Application.Resources>
        
        </Application.Resources>
    </Application>
    ```

2. **Setting Window ThemeMode from XAML:**
    Similar to Application ThemeMode, set the ThemeMode at the desired window's xaml as shown below.
    ```xml
    <Window
        x:Class="YourSampleApplication.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:YourSampleApplication"
        mc:Ignorable="d"
        Title="MainWindow" Height="450" Width="800" ThemeMode="Dark">
        <Grid>
    
        </Grid>
    </Window>
    ```

3. **Setting ThemeMode from Code-Behind:**
    Since the API is experimental, the usage of ThemeMode from code-behind is a bit restricted. To use ThemeMode from code-behind, the developer either needs to configure
    the project to ignore the WPF0001 warning for the project or suppress the warning where needed.

    **To configure the Project to ignore the warning:** <br />
    In your project's .csproj, set the following tag
    ```xml
    <PropertyGroup>
        <NoWarn>WPF0001<NoWarn>
    </PropertyGroup>
    ```

    Use the property from code-behind
    ```cs
    Application.Current.ThemeMode = ThemeMode.Light;
    ```

    or, to apply it to the current window
    ```cs
    this.ThemeMode = ThemeMode.Light;
    ```

    **To suppress the warning:** <br />
    Disable and enable the pragma warning as shown below
    ```cs
    #pragma warning disable WPF0001
        Application.Current.ThemeMode = ThemeMode.Light;
    #pragma warning restore WPF0001
    ```

### Expected behavior of the API
1. When the `ThemeMode` is set to Light or Dark or System, the Fluent Themes are applied to the respective Application or Window.
2. The `ThemeMode` when set to System respects the current operating system's theme settings. This involves detecting whether the user is utilizing a light or dark theme as their App Mode.
3. When the `ThemeMode` is set to None, the Fluent Themes are not applied and the default `Aero2` theme is used.
4. Accent color changes will be adhered to whenever the Fluent Theme is applied irrespective of ThemeMode.
5. When the ThemeMode is set to a Window, it will take precedence over the Application's ThemeMode. In case Window ThemeMode is set to None, the window will adhere to Application's ThemeMode, even if Application uses Fluent Theme.
6. The default value of ThemeMode is None.

<br />

In addition to these behaviors, the ThemeMode is also designed to respect the Fluent Theme Dictionary added to the Application or Window. As mentioned [here](https://github.com/dotnet/core/blob/main/release-notes/9.0/preview/preview4/wpf.md), Fluent Themes can also be loaded by including the respective Fluent Dictionary.
If the given application or window is loaded with a given Fluent Dictionary, let's say Light, then the ThemeMode will be synced to Light Mode as well and vice-versa.

### Minimum System Requirements
- The system should atleast be on Windows 10 to support Fluent Themes. Although, the backdrop is only supported on Windows 11.

**Please try out the new Fluent Themes, provide feedback on the overall experience, report any missing elements, and what we can fix moving forward [here.](https://github.com/dotnet/wpf/issues/new/choose)**

## Introduction of `AccentColor`s as `SystemColors`
With the release of Windows 10, **Accent Color** has become a key component for visual styling of various controls. This provides a visually consistent experience across apps by aligning with the system's theme. However, developers currently have no easy way to retrieve the various accent colors in their applications.
The developers have to depend on undocumented APIs or create their own UISettings wrapper to access the Accent colors, but with the introduction of AccentColors and corresponding brushes in SystemColors, the developers will now have access to the system's accent colors and their variations.

### The following APIs are exposed
1. **Colors:** The following `System.Windows.Media.Color` are being introduced corresponding to the current accent color of the system and its primary, secondary and tertiary variations in both Light and Dark mode.
    ```cs
    AccentColor
    AccentColorLight1
    AccentColorLight2
    AccentColorLight3
    AccentColorDark1
    AccentColorDark2
    AccentColorDark3
    ```

2. **ResourceKey:** Similary, the following `System.Windows.ResourceKey` are being introduced.
    ```cs
    AccentColorKey
    AccentColorLight1Key
    AccentColorLight2Key
    AccentColorLight3Key
    AccentColorDark1Key
    AccentColorDark2Key
    AccentColorDark3Key
    ```

3. **SolidColorBrush:** Similary, the following `System.Windows.Media.SolidColorBrush` are being introduced.
    ```cs
    AccentColorBrush
    AccentColorLight1Brush
    AccentColorLight2Brush
    AccentColorLight3Brush
    AccentColorDark1Brush
    AccentColorDark2Brush
    AccentColorDark3Brush
    ```

### Usage of the `AccentColor` APIs
Developers can use the API to update the applicable properties as shown below
```xml
<Button Content="Sample WPF Button" Background="{x:Static SystemColors.AccentColorBrush}" />
```

## Community contributors

Thank you contributors! ❤️

- [@ThomasGoulet73](https://github.com/ThomasGoulet73)
- [@batzen](https://github.com/batzen)
- [@h3xds1nz](https://github.com/h3xds1nz)
- [@robert-abeo](https://github.com/robert-abeo)
- [@miloush](https://github.com/miloush)
- [@lindexi](https://github.com/lindexi)
- [@MichaeIDietrich](https://github.com/MichaeIDietrich)
- [@pomianowski](https://github.com/pomianowski)