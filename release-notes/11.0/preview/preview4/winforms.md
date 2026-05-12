# Windows Forms in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 does not introduce new Windows Forms feature additions. The
notable user-facing change in this preview is a clipboard regression fix.

- [Bug fixes](#bug-fixes)

## Bug fixes

- **System.Windows.Forms.Clipboard / DataObject**
  - `Clipboard.GetDataObject().GetImage()` once again returns bitmap images
    placed on the clipboard. After the typed/NRBF clipboard pipeline shipped
    in .NET 10, bitmaps were stored in the typed data store, but
    `DataObject.GetImage` only read from the legacy `GetData` store and
    returned `null`. `DataObject.GetImage` tries the typed pipeline
    via `TryGetData<Image>(DataFormats.Bitmap, autoConvert: true, ...)` and
    returns null if it can't retrieve the data.
    ([dotnet/winforms #14427](https://github.com/dotnet/winforms/pull/14427),
    [dotnet/winforms #14423](https://github.com/dotnet/winforms/issues/14423)).

```csharp
// Round-trips again on .NET 11 Preview 4
Clipboard.SetImage(bitmap);
Image? image = Clipboard.GetDataObject()?.GetImage();
```
