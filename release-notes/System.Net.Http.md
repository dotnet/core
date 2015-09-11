# System.Net.Http

## Information

* [NuGet Package](https://nuget.org/packages/System.Net.Http)
* [Documentation](https://msdn.microsoft.com/en-us/library/system.net.http.aspx)
* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/07/17/httpclient-2-2-is-now-stable.aspx)
* [Report an issue](http://github.com/dotnet/corefx/issues/new)
* [Source](https://github.com/dotnet/corefx/tree/master/src)

## Version History

### 4.0.0-beta-22231

* Renamed package to `System.Net.Http`

### 2.2.29 (Microsoft.Net.Http)

* Added specific lib folder for Xamarin.iOS Unified API.

### 2.2.28 (Microsoft.Net.Http)

* Updated to stable, no other changes

### 2.2.27-beta (Microsoft.Net.Http)

* Fixed issue causing hang when an exception was thrown within `BeginGetRequestStream` method.

### 2.2.23-beta (Microsoft.Net.Http)

* Fixed issue with content buffer allocation for `HEAD` requests.
* Fixed issue for `HttpRequestMessage` unbounded range throwing exception.

### 2.2.22 (Microsoft.Net.Http)

* Fixed an issue with Windows Phone 8.1 when using portable libraries and `IWebProxy`, `DecompressionMethods`, or `TransportContext`.
* Added specific lib folders for monoandroid and monotouch.

### 2.2.20 (Microsoft.Net.Http)

* Updated package dependencies and clarified supported platforms.

### 2.2.19 (Microsoft.Net.Http)

* Added Windows Phone 8.1 support

### 2.2.18 (Microsoft.Net.Http)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/11/13/pcl-and-net-nuget-libraries-are-now-enabled-for-xamarin.aspx)
* Updated license to remove Windows-only restriction

### 2.2.15 (Microsoft.Net.Http)

* Fixed bug where the decompression would always run synchronously, even if the stream is read asynchronously

### 2.2.13 (Microsoft.Net.Http)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/07/17/httpclient-2-2-is-now-stable.aspx)

### 2.2.10-RC (Microsoft.Net.Http)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/07/10/httpclient-2-2-is-now-rc.aspx)
* Disabled write stream buffering on Windows Phone 8 when AllowAutoRedirect is set to false, which reduces memory usage.
* Enabled setting credentials for Silverlight when using the client networking stack
* Fixed some exception messages which referred to nonexistent APIs
* Made package metadata updates

### 2.2.7-Beta (Microsoft.Net.Http)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/06/19/update-to-httpclient-and-automatic-decompression.aspx)
* Removed dependency on `Microsoft.Bcl.Compression` while keeping support for automatic decompression

### 2.2.3-Beta (Microsoft.Net.Http)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/06/06/portable-compression-and-httpclient-working-together.aspx)
* Added support for automatic decompression

### 2.1.10 RTM (Microsoft.Net.Http)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/05/29/get-httpclient-rtm-200-ok.aspx)
* Minor branding changes

### 2.1.6 RC (Microsoft.Net.Http)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/05/22/portable-httpclient-is-now-available-as-rc.aspx)
* When consuming a portable class library depending on `HttpClient` from a
  Windows Store application, the app can crash with a `MissingMethodException`.
  We’ve fixed it by using the same technique we explained in our [blog post about Microsoft.Bcl.Async](http://blogs.msdn.com/b/bclteam/archive/2013/04/17/microsoft-bcl-async-is-now-stable.aspx):
  we ensure during the build that the application has a reference to the NuGet
  package.
* Installing `HttpClient` NuGet package into an application can corrupt existing
  binding redirects in the app.config file
* The encoding ISO-8859-1 isn’t supported on Silverlight-based platforms
* When using `HttpClient` in Silverlight over the browser networking stack
  aborting the HTTP connection can result in a `NullReferenceException`
* Header values containing commas get incorrectly split into multiple headers.
* `HttpClientHandler.AllowAutoRedirect` can’t be set on Windows Phone 8 although
  it should be supported.
* `HttpWebRequest.AllowReadStreamBuffering` defaults to true on Windows Phone
  which prevents practical use of `HttpClient` with chunked responses, such as
  streaming live data.

### 2.1.3 Beta (Microsoft.Net.Http)

* Announcement
* First release of the portable version of `HttpClient`

## Troubleshooting

### ~~Issue 1~~

Fixed.

### ~~Issue 2~~

Fixed.

### Issue 3

#### Symptom

When using HttpClient from a Silverlight application many http headers are not
supported and will result in an `ArgumentException` or `NotImplementedException`
when set and calling `HttpClient` methods that send a request.

#### Resolution

For a list of headers which are not supported in Silverlight please see:
http://msdn.microsoft.com/en-us/library/system.net.webheadercollection(v=vs.95).aspx
http://msdn.microsoft.com/en-us/library/system.net.httpwebrequest.headers(v=vs.95).aspx

### Issue 4

#### Symptom

When `HttpClientHandler.SupportsProtocolVersion()` is `false` the
`HttpResponseMessage` returned from a request will have a `null` value for
`Version`.

#### Resolution

Make sure that anytime you are using a version from the `HttpResponseMessage`,
you do a null check on it if `SupportsProtocolVersion()` is `false`.

### ~~Issue 5~~

Fixed.

### Issue 6

#### Symptom

When using `HttpClient` on Silverlight or the Phone be aware that the networking
stack may cache responses.

#### Resolution

To avoid inconsistencies when creating  portable class library that runs on both
platforms be sure that your server sets the cache control-header on the response
to match your expected caching behavior on the Phone.  If you do not control the
server, consider making a portion of the request unique if you do not want a
cached result.

### ~~Issue 7~~

Fixed.

### Issue 8

#### Symptom

ClickOnce applications targeting .NET Framework 4.0 that reference the
`Microsoft.Net.Http` package may experience a `TypeLoadException` or other
errors after being installed.

#### Resolution

This occurs because ClickOnce fails to deploy certain required assemblies. As a
workaround, do the following:

1. Right-click on the project and choose Add Existing Item
2. Browse to the `net40` in the `HttpClient`  package folder
3. In the File name text box enter *.*
4. Holding CTRL, select `System.Net.Http.dll` and `System.Net.Http.Primitives.dll`
5. Click the down-arrow next to the **Add** button and choose **Add as Link**
6. In **Solution Explorer**, holding CTRL select `System.Net.Http.dll` and `System.Net.Http.WebRequest.dll`
7. Right-click the selection, choose **Properties** and change **Copy to Output Directory** to **Copy always**
8. Republish
