# Windows Forms in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 does not introduce new Windows Forms feature additions. The
notable user-facing change in this preview is a clipboard regression fix.

- [Bug fixes](#bug-fixes)

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Add documentation and in-code awareness for shared WinForms/WPF clipboard/OLE infrastructure (dotnet/winforms #14306). Repo-internal contributor docs only; no behavior change.
  - Adding NuGet package for Microsoft.Private.Windows.Core assembly (dotnet/winforms #14429). Internal transport package for VS/WPF consumption; not a public surface.
  - Updating TFM for .NET Framework assembly from net472 to net481 (dotnet/winforms #14450). Build/infra-only change to internal projects.
  - Pin System.Formats.Nrbf and its transitive dependencies to 10.0.4 release for .NET Framework (dotnet/winforms #14487). Dependency pin for .NET Framework build; no app-visible change.
  - Fix WinformsControlTest exit when clicking Column2 header (dotnet/winforms #14477). Bug in the in-repo test/sample app, not the product.
  - Multiple "[main] Source code updates from dotnet/dotnet" PRs (#14409, #14419, #14426, #14431, #14432, #14433, #14437, #14443, #14444, #14446, #14456, #14464, #14470, #14476, #14479). VMR sync noise.
  - Repo Copilot/skill workflow updates (#14428, #14451, #14480). Repo automation only.
-->

## Bug fixes

- **System.Windows.Forms.Clipboard / DataObject**
  - `Clipboard.GetDataObject().GetImage()` once again returns bitmap images
    placed on the clipboard. After the typed/NRBF clipboard pipeline shipped
    in .NET 10, bitmaps were stored in the typed data store, but
    `DataObject.GetImage` only read from the legacy `GetData` store and
    returned `null`. `DataObject.GetImage` now first tries the typed pipeline
    via `TryGetData<Image>(DataFormats.Bitmap, autoConvert: true, ...)` and
    falls back to the legacy path, matching the behavior of
    `Clipboard.GetImage()`
    ([dotnet/winforms #14427](https://github.com/dotnet/winforms/pull/14427),
    [dotnet/winforms #14423](https://github.com/dotnet/winforms/issues/14423)).

```csharp
// Round-trips again on .NET 11 Preview 4
Clipboard.SetImage(bitmap);
Image? image = Clipboard.GetDataObject()?.GetImage();
```
