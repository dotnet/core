# Windows Forms in .NET 10 Preview 2 - Release Notes

.NET 10 Preview 2 includes new Windows Forms features & enhancements:

- [Clipboard Code Sharing with WPF](#clipboard-code-sharing-with-wpf)
- [Ported more System.Windows.Forms.Design UITypeEditors](#ported-more-systemwindowsformsdesign-uitypeeditors)
- [Quality Enhancements](#quality-enhancements)

## Windows Forms updates in .NET 10

- [What's new in Windows Forms in .NET 10](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/net100) documentation.
- [Issues List for Windows Forms in .NET 10 Preview 2](https://github.com/dotnet/winforms/issues?q=is%3Aissue%20milestone%3A%2210.0%20Preview2%22%20)

## Clipboard Code Sharing with WPF

 We are unifying how WinForms and WPF handle the Clipboard, refining behaviors introduced in Preview 1. Over the course of Preview 2 the WinForms team has refactored much of the Clipboard code to a new location in order to make it shareable with WPF. By sharing and consolidating Clipboard code across both frameworks, we aim to enhance consistency, stability, and overall reliability for .NET Windows Desktop scenarios. We have also continued to enhance the Clipboard APIs introduced in Preview 1 with tweaks to the behavior in certain edge-cases.

## Ported more System.Windows.Forms.Design UITypeEditors  

We’ve ported several `UITypeEditors` in the `System.Windows.Forms.Design` namespace from the .NET Framework code base, giving developers more robust options for creating designer applications. New editors include `ToolStripCollectionEditor` and several editors related to the `DataGridView` control. These editors will now be discoverable by the `PropertyGrid` and Designer Actions Panel.

## Quality Enhancements

We’ve expanded our unit test coverage and addressed a variety of bug fixes, continuing to focus on delivering high quality in Windows Forms.

> **AI-assisted content.** This article was partially created with the help of AI. An author reviewed and revised the content as needed. [Learn more](https://devblogs.microsoft.com/principles-for-ai-generated-content/)
