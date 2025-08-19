# Windows Forms in .NET 10 Preview 7 - Release Notes

Here's a summary of what's new in Windows Forms in this preview release:

- [ComboBox Dark Mode Rendering Fix](#combobox-dark-mode-rendering-fix)
- [RichTextBox Dark Mode Improvement and Known Limitation](#richtextbox-dark-mode-improvement-and-known-limitation)
- [PropertyGrid Dark Mode Enhancements](#propertygrid-dark-mode-enhancements)

Windows Forms updates in .NET 10:

- [What's new in Windows Forms](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/) documentation

## ComboBox Dark Mode Rendering Fix

In this update, we've resolved an issue where a disabled ComboBox displayed a white background instead of the appropriate dark mode color scheme. Now, regardless of whether the ComboBox is in editable, list, or simple mode, its constituent controls will correctly render with the proper dark mode background when disabled.

## RichTextBox Dark Mode Improvement and Known Limitation

We’ve also addressed the RichTextBox background issue in dark mode. Previously, a disabled RichTextBox would show a white background. Now it correctly displays the dark mode background. However, there's a known limitation: if the RichTextBox has formatted content, only the first few visible lines will appear correctly, and the formatting might not fully apply in the disabled state.

As a temporary workaround, if maintaining full formatting in a disabled RichTextBox is essential, we recommend setting it to read-only and manually disabling selections. This helps achieve a better preview until a more permanent fix is available. Note that this limitation is due to the underlying RichTextBox control in the common controls library, and a full fix may require a future version update.

## PropertyGrid Dark Mode Enhancements

We’ve also improved the rendering of special buttons within the PropertyGrid for dark mode. Previously, the ellipsis button used to open an editor and the drop-down button for ComboBox-type editors were not rendering well in dark mode. Now, these elements have dedicated renderers ensuring they appear consistently and at the same quality as the rest of the UI in dark mode.

Everything mentioned above pertains specifically to dark mode improvements in Preview 7. Other functionalities remain unchanged in this release.
