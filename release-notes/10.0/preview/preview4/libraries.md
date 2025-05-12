# .NET Libraries in .NET 10 Preview 4 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [Feature](#feature)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Feature

Something about the feature.

## Add Out-of-Proc Trace Support for Activity Events and Links

 is used for distributed tracing—tracking the flow of operations (or `activities`) across different components or services in an application. The .NET support serializing the distributed tracing data out-of-proc through the event source provider named `Microsoft-Diagnostics-DiagnosticSource`. 
The Activity object can carry [ActivityLink](https://learn.microsoft.com/dotnet/api/system.diagnostics.activitylink) and [ActivityEvent](https://learn.microsoft.com/dotnet/api/system.diagnostics.activityevent) data. We have supported serializing the Activity link and event data along the reset of the tracing data. The out-of-proc collected tracing data now can contain data like the following represnting the links and the events:

The .NET [Activity](https://learn.microsoft.com/dotnet/api/system.diagnostics.activity) class enables distributed tracing by tracking the flow of operations across services or components. .NET supports serializing this tracing data out-of-process via the `Microsoft-Diagnostics-DiagnosticSource event` source provider.

An Activity can include additional metadata such as [ActivityLink](https://learn.microsoft.com/dotnet/api/system.diagnostics.activitylink) and [ActivityEvent](https://learn.microsoft.com/dotnet/api/system.diagnostics.activityevent). We’ve added support for serializing these as well, so out-of-proc trace data can now include information representing links and events, like the following:

```
Events->"[(TestEvent1,​2025-03-27T23:34:10.6225721+00:00,​[E11:​EV1,​E12:​EV2]),​(TestEvent2,​2025-03-27T23:34:11.6276895+00:00,​[E21:​EV21,​E22:​EV22])]"
Links->"[(19b6e8ea216cb2ba36dd5d957e126d9f,​98f7abcb3418f217,​Recorded,​null,​false,​[alk1:​alv1,​alk2:​alv2]),​(2d409549aadfdbdf5d1892584a5f2ab2,​4f3526086a350f50,​None,​null,​false)]"
```

