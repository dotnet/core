# .NET WPF updates in .NET 9 Preview 7

Here's a summary of what's new in .NET WPF in this preview release:

* [Introduction of `ThemeMode`](#introduction-of-thememode)

.NET 9 Preview 7:
* [Discussion](https://aka.ms/dotnet/9/preview7)
* [Release notes](README.md)

## Introduction of `ThemeMode`
The `ThemeMode` API is designed to facilitate the newly introduced Fluent Themes and the dynamic adjustment of these themes settings in WPF applications. It allows developers to easily toggle between different visual themes, enhancing user experience and accessibility. This is an **experimental** API introduced at `Application` and `Window` level with options to choose from Light, Dark, System and None (Default) theme.

### Usage of the API
A developer can set the Application or Window to the desired ThemeMode from XAML or the code-behind.
### Setting Application ThemeMode from XAML: 
In App.xaml include the ThemeMode property as shown below.
```xml
<Application 
    x:Class="YourSampleApplication.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="clr-namespace:YourSampleApplication"
    ThemeMode="Light">
    <Application.Resources>
    
    </Application.Resources>
</Application>
```

### Setting Window ThemeMode from XAML: 
Similar to Application ThemeMode, set the ThemeMode at the desired window'ss xaml as shown below.
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

### Setting ThemeMode from Code-Behind:
Since the API is experimental, the usage of ThemeMode from code-behind is a bit restricted. To use ThemeMode from code-behind, the developer either need to configure the project to ignore the WPF0001 warning for the project or suppress the warning where needed.

#### Configure the Project to ignore the warning:
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

or, to apply to the current window
```cs
this.ThemeMode = ThemeMode.Light;
```


#### To suppress the warning:
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
