# Windows Forms in .NET 10 Preview 1 - Release Notes

## Clipboard related serialization and deserialization changes

WinForms continues to ease the pain of migrating away from BinaryFormatter in .NET 10 Preview 1 by simplifying Clipboard serialization for certain custom types. In .NET 9, calls to BinaryFormatter to perform serialization were updated to throw `PlatformNotSupportedException` if the developer did not reference an unsupported compatibility package and enable BinaryFormatter via an application configuration switch ([see more](https://learn.microsoft.com/dotnet/standard/serialization/binaryformatter-migration-guide/compatibility-package)). Clipboard and Drag/Drop scenarios which use custom types, as of .NET 9, require the developer to either enable BinaryFormatter or explicitly take action to use JSON serialization (or similar) to succeed. For additional details about migrating WinForms application away from `BinaryFormatter` see the [Windows Forms migration guide for BinaryFormatter](https://learn.microsoft.com/dotnet/standard/serialization/binaryformatter-migration-guide/winforms-applications). In .NET 10 Preview 1 WinForms is adding several APIs to enable developers to more easily use JSON serliaization in while using the Clipboard. Additionally, developers can now more easily specify expected types when getting data from the Clipboard.

For in-depth discussion of the APIs involved, and usage examples, please see the original [API Proposal](https://github.com/dotnet/winforms/issues/12362) in the WinForms repo.

### Obsoleted Clipboard APIs

In .NET 10, WinForms has marked as obsolete the following APIs to help warn developers that BinaryFormatter may be used to deserialize data.

**Clipboard:**

- `public static object? GetData(string format)`

**DataObject:**

- `public virtual object? GetData(string format)`
- `public virtual object? GetData(string format, bool autoConvert)`
- `public virtual object? GetData(Type format)`

**ClipboardProxy (VisualBasic wrapper for WinForms Clipboard):**

- `public object GetData(string format)`

### New Clipboard related APIs

We’ve introduced the following APIs in Windows Forms for .NET 10 Preview 1:

**Clipboard:**

- `public static void SetDataAsJson<T>(string format, T data)`
- `public static bool TryGetData<T>(string format, out T data)`
- `public static bool TryGetData<T>(string format, Func<TypeName, Type> resolver, out T data)`

**DataObject:**

- `public void SetDataAsJson<T>(T data)`
- `public void SetDataAsJson<T>(string format, T data)`
- `public void SetDataAsJson<T>(string format, bool autoConvert, T data)`
- `public bool TryGetData<T>(out T data);`
- `public bool TryGetData<T>(string format, out T data);`
- `public bool TryGetData<T>(string format, bool autoConvert, out T data);`
- `public bool TryGetData<T>(string format, Func<TypeName, Type> resolver, bool autoConvert, out T data);`
- `protected virtual bool TryGetDataCore<T>(string format, Func<TypeName, Type> resolver, bool autoConvert, out T data)`

**ITypedDataObject:**

- `public bool TryGetData<T>(out T data);`
- `public bool TryGetData<T>(string format, out T data);`
- `public bool TryGetData<T>(string format, bool autoConvert, out T data);`
- `public bool TryGetData<T>(string format, Func<TypeName, Type> resolver, bool autoConvert, out T data);`

**DataObjectExtensions:**

- `public static bool TryGetData<T>(this IDataObject dataObject, out T data)`
- `public static bool TryGetData<T>(this IDataObject dataObject, string format, out T data)`
- `public static bool TryGetData<T>(this IDataObject dataObject, string format, bool autoConvert, out T data)`
- `public static bool TryGetData<T>(this IDataObject dataObject, string format, Func<TypeName, Type> resolver, bool autoConvert, out T data)`

**ClipboardProxy:**

- `public void SetDataAsJson<T>(T data)`
- `public void SetDataAsJson<T>(string format, T data)`
- `public bool TryGetData<T>(string format, out T data)`
- `public bool TryGetData<T>(string format, Func<TypeName, Type> resolver, out T data)`

### New Clipboard compatibility configuration switch

- `Windows.ClipboardDragDrop.EnableUnsafeBinaryFormatterSerialization`

### Considerations for BinaryFormatter usage with the Clipboard

#### Scenarios that work without any added reference to BinaryFormatter

Applications that use the new .NET Clipboard APIs for standard data types or explicitly use JSON serialization will work without needing any reference to `BinaryFormatter`. For instance, the new APIs like `SetDataAsJson` and `TryGetData<T>` are designed to handle common .NET types such as primitive types and `System.Drawing.Bitmap` without relying on `BinaryFormatter`. These APIs ensure type safety and provide mechanisms to constrain incoming data, making them suitable for most scenarios where data exchange is straightforward and does not involve complex types. Serialization using these methods is considered best practice, and developers are strongly encouraged to move in this direction.

For applications that still rely on `BinaryFormatter` for custom format serialization or need to maintain complete compatibility with .NET Framework applications, a reference to the out-of-band, unsupported `System.Runtime.Serialization.Formatters` package and the corresponding AppContext switch is required as detailed [here](https://learn.microsoft.com/en-us/dotnet/standard/serialization/binaryformatter-migration-guide/compatibility-package). This is particularly necessary for scenarios where complex types are involved, and the application cannot migrate to the new JSON-based APIs. In such cases, developers must explicitly opt-in to enable BinaryFormatter serialization and deserialization by setting the `Windows.ClipboardDragDrop.EnableUnsafeBinaryFormatterSerialization` switch to `true` in the configuration file in addition to `System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization` switch to `true`. The advantage to this approach is that `BinaryFormatter` can be explicitly disabled for Clipboard scenarios, while still being allowed in other parts of the application. This ensures that the application can continue to function while gradually transitioning to safer alternatives.

For applications that still rely on `BinaryFormatter` for custom format serialization or need to maintain complete compatibility with .NET Framework applications, a reference to the out-of-band, unsupported `System.Runtime.Serialization.Formatters` package and the corresponding AppContext switch is required as detailed [here](https://learn.microsoft.com/en-us/dotnet/standard/serialization/binaryformatter-migration-guide/compatibility-package). This is particularly necessary for scenarios where complex types are involved, and the application cannot migrate to the new JSON-based APIs. In such cases, developers must explicitly opt-in to enable BinaryFormatter serialization and deserialization by setting the `Windows.ClipboardDragDrop.EnableUnsafeBinaryFormatterSerialization` switch to `true` in the configuration file in addition to `System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization` switch to `true`. The advantage to this approach is that `BinaryFormatter` can be explicitly disabled for Clipboard scenarios, while still being allowed in other parts of the application. This ensures that the application can continue to function while gradually transitioning to safer alternatives.

1. *Replace obsolete APIs*  Start by replacing the obsolete `GetData` methods with the new `TryGetData<T>`. This ensures type safety and avoids the risks associated with unbounded deserialization.

1. *Use JSON Serialization:* For complex types, use JSON serialization instead of BinaryFormatter, replace `SetData` with the new APIs like `SetDataAsJson`.  The `TryGetData<T>` APIs are designed to handle common .NET types and JSON serialization.

#### Best practices to consider when migrating to the new Clipboard APIs

1. *Replace obsolete APIs*  Start by replacing the obsolete `GetData` methods with the new `TryGetData<T>`. This ensures type safety and avoids the risks associated with unbounded deserialization.
1. *Use JSON Serialization:* For complex types, use JSON serialization instead of BinaryFormatter. The new APIs like `SetDataAsJson` and `TryGetData<T>` are designed to handle common .NET types and JSON serialization.
1. *Constrain incoming data:* The new APIs provide ways to ensure that only expected types are deserialized, reducing the risk of deserialization attacks.
1. *Opt-In only for compatibility:* If your application still relies on `BinaryFormatter` for custom format serialization or needs to maintain compatibility with .NET Framework applications, use the configuration switch to enable BinaryFormatter serialization and deserialization. This should be done cautiously and only when necessary. Separately enable BinaryFormatter support during Clipboard serialization and dersialization with the new configuration switch.
1. *Use simple types for data exchange:* Re-design your application to use simple types that have no inheritance hierarchies and have only primitive types as data fields.

## Windows Forms updates in .NET 10

- [What's new in Windows Forms in .NET 10](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/net100) documentation.
- [Issues List for Windows Forms in .NET 10 Preview 1](https://github.com/dotnet/winforms/issues?q=is%3Aissue%20milestone%3A%2210.0%20Preview1%22%20)

**AI-assisted content.** This article was partially created with the help of AI. An author reviewed and revised the content as needed. Learn moreAI-assisted content. This article was partially created with the help of AI. An author reviewed and revised the content as needed. [Learn more](https://devblogs.microsoft.com/principles-for-ai-generated-content/)
