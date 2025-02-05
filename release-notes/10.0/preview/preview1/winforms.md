# Windows Forms in .NET 10 Preview 1 - Release Notes

WinForms continues to ease the pain of migrating away from BinaryFormatter in .NET 10 Preview 1 by simplifying Clipboard serialization for certain custom types. In .NET 9, calls to BinaryFormatter to perform serialization were updated to throw `PlatformNotSupportedException` if the developer did not reference an unsupported compatibility package and enable BinaryFormatter via an application configuration switch([see more](https://github.com/dotnet/winforms/issues/12362)). Clipboard and Drag/Drop scenarios which use custom types, as of .NET 9, require the developer to either enable BinaryFormatter or explicitly take action to use JSON serialization (or similar) to succeed. In .NET 10 Preview 1, WinForms is introducing APIs to help simplify the process of JSON serialization in Clipboard and Drag/Drop scenarios and obsoleting existing APIs to continue to encourage developers to move away from the unsafe BinaryFormatter serialization. For cases where BinaryFormatter is still required, a configuration switch has been added.

For in-depth discussion of the APIs involved, and usage examples, please see the original [API Proposal](https://github.com/dotnet/winforms/issues/12362) in the WinForms repo.

### Obsoleted APIs

In .NET 10, WinForms has marked as obsolete the following APIs to help warn developers that BinaryFormatter may be used to deserialize data. For detailed usage information, please see the API proposal located *An external link was removed to protect your privacy.*.

**Clipboard:**

- `public object GetData(string format)`

**DataObject:**

- `public virtual object? GetData(string format)`
- `public virtual object? GetData(string format, bool autoConvert)`
- `public virtual object? GetData(Type format)`

**ClipboardProxy (VisualBasic wrapper for WinForms Clipboard):**

- `public object GetData(string format)`

### New APIs

We’ve introduced the following APIs:

**Clipboard:**

- `public void SetDataAsJson<T>(T data) { }`
- `public void SetDataAsJson<T>(string format, T data) { }`
- `public void SetDataAsJson<T>(string format, bool autoConvert, T data) { }`
- `public virtual bool TryGetData<T>(out T data) { }`
- `public virtual bool TryGetData<T>(string format, out T data) { }`
- `public virtual bool TryGetData<T>(string format, bool autoConvert, out T data) { }`
- `public virtual bool TryGetData<T>(string format, Func<Reflection.Metadata.TypeName, Type> resolver, bool autoConvert, out T data) { }`

**IDataObject:**

- `bool TryGetData<T>(out T data);`
- `bool TryGetData<T>(string format, out T data);`
- `bool TryGetData<T>(string format, bool autoConvert, out T data);`
- `bool TryGetData<T>(string format, Func<Reflection.Metadata.TypeName, Type> resolver, bool autoConvert, out T data);`

**Control:**

- `public DragDropEffects DoDragDropAsJson<T>(T data, DragDropEffects allowedEffects, Bitmap? dragImage, Point cursorOffset, bool useDefaultDragImage)`
- `public DragDropEffects DoDragDropAsJson<T>(T data, DragDropEffects allowedEffects)`

**DragDrop:**

- `public static DragDropEffects DoDragDropAsJson<T>(DependencyObject dragSource, T data, DragDropEffects allowedEffects)`

**ClipboardProxy:**

- `public void SetDataAsJson<T>(T data) { }`
- `public void SetDataAsJson<T>(string format, T data) { }`
- `public bool TryGetData<T>(string format, out T data) { }`
- `public bool TryGetData<T>(string format, System.Func<System.Reflection.Metadata.TypeName, System.Type> resolver, out T data) { }`

### New Configuration Switch

If an application is unable to adopt the new APIs, and requires a fallback to BinaryFormatter serialization during Clipboard and Drag/Drop operations, the developer will need to take additional action. In .NET 9, calls to BinaryFormatter will always throw a `PlatformNotSupportedException` unless the developer follows the instructions *An external link was removed to protect your privacy.*. In .NET 10 Preview 1, WinForms will now also by default disable the use of BinaryFormatter as a fallback unless it is explicitly enabled with this new configuration switch. This switch is `ClipboardDragDrop.EnableUnsafeBinaryFormatterSerialization`, and it must be set to `True` for the fallback to happen successfully.

Windows Forms updates in .NET 10:

- [What's new in Windows Forms in .NET 10](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/net100) documentation.

**AI-assisted content.** This article was partially created with the help of AI. An author reviewed and revised the content as needed. Learn moreAI-assisted content. This article was partially created with the help of AI. An author reviewed and revised the content as needed. [Learn more](https://devblogs.microsoft.com/principles-for-ai-generated-content/) 
