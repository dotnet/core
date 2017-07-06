# System.Net.WebSockets

``` diff
+namespace System.Net.WebSockets {
+    public sealed class ClientWebSocket : WebSocket {
+        public ClientWebSocket();
+        public override Nullable<WebSocketCloseStatus> CloseStatus { get; }
+        public override string CloseStatusDescription { get; }
+        public ClientWebSocketOptions Options { get; }
+        public override WebSocketState State { get; }
+        public override string SubProtocol { get; }
+        public override void Abort();
+        public override Task CloseAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken cancellationToken);
+        public override Task CloseOutputAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken cancellationToken);
+        public Task ConnectAsync(Uri uri, CancellationToken cancellationToken);
+        public override void Dispose();
+        public override Task<WebSocketReceiveResult> ReceiveAsync(ArraySegment<byte> buffer, CancellationToken cancellationToken);
+        public override Task SendAsync(ArraySegment<byte> buffer, WebSocketMessageType messageType, bool endOfMessage, CancellationToken cancellationToken);
+    }
+    public sealed class ClientWebSocketOptions {
+        public X509CertificateCollection ClientCertificates { get; set; }
+        public CookieContainer Cookies { get; set; }
+        public ICredentials Credentials { get; set; }
+        public TimeSpan KeepAliveInterval { get; set; }
+        public IWebProxy Proxy { get; set; }
+        public void AddSubProtocol(string subProtocol);
+        public void SetRequestHeader(string headerName, string headerValue);
+    }
+    public abstract class WebSocket : IDisposable {
+        protected WebSocket();
+        public abstract Nullable<WebSocketCloseStatus> CloseStatus { get; }
+        public abstract string CloseStatusDescription { get; }
+        public abstract WebSocketState State { get; }
+        public abstract string SubProtocol { get; }
+        public abstract void Abort();
+        public abstract Task CloseAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken cancellationToken);
+        public abstract Task CloseOutputAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken cancellationToken);
+        public abstract void Dispose();
+        public abstract Task<WebSocketReceiveResult> ReceiveAsync(ArraySegment<byte> buffer, CancellationToken cancellationToken);
+        public abstract Task SendAsync(ArraySegment<byte> buffer, WebSocketMessageType messageType, bool endOfMessage, CancellationToken cancellationToken);
+    }
+    public enum WebSocketCloseStatus {
+        Empty = 1005,
+        EndpointUnavailable = 1001,
+        InternalServerError = 1011,
+        InvalidMessageType = 1003,
+        InvalidPayloadData = 1007,
+        MandatoryExtension = 1010,
+        MessageTooBig = 1009,
+        NormalClosure = 1000,
+        PolicyViolation = 1008,
+        ProtocolError = 1002,
+    }
+    public enum WebSocketError {
+        ConnectionClosedPrematurely = 8,
+        Faulted = 2,
+        HeaderError = 7,
+        InvalidMessageType = 1,
+        InvalidState = 9,
+        NativeError = 3,
+        NotAWebSocket = 4,
+        Success = 0,
+        UnsupportedProtocol = 6,
+        UnsupportedVersion = 5,
+    }
+    public sealed class WebSocketException : Exception {
+        public WebSocketException(int nativeError);
+        public WebSocketException(int nativeError, Exception innerException);
+        public WebSocketException(int nativeError, string message);
+        public WebSocketException(WebSocketError error);
+        public WebSocketException(WebSocketError error, Exception innerException);
+        public WebSocketException(WebSocketError error, int nativeError);
+        public WebSocketException(WebSocketError error, int nativeError, Exception innerException);
+        public WebSocketException(WebSocketError error, int nativeError, string message);
+        public WebSocketException(WebSocketError error, int nativeError, string message, Exception innerException);
+        public WebSocketException(WebSocketError error, string message);
+        public WebSocketException(WebSocketError error, string message, Exception innerException);
+        public WebSocketException(string message);
+        public WebSocketException(string message, Exception innerException);
+        public int ErrorCode { get; }
+        public WebSocketError WebSocketErrorCode { get; }
+    }
+    public enum WebSocketMessageType {
+        Binary = 1,
+        Close = 2,
+        Text = 0,
+    }
+    public class WebSocketReceiveResult {
+        public WebSocketReceiveResult(int count, WebSocketMessageType messageType, bool endOfMessage);
+        public WebSocketReceiveResult(int count, WebSocketMessageType messageType, bool endOfMessage, Nullable<WebSocketCloseStatus> closeStatus, string closeStatusDescription);
+        public Nullable<WebSocketCloseStatus> CloseStatus { get; }
+        public string CloseStatusDescription { get; }
+        public int Count { get; }
+        public bool EndOfMessage { get; }
+        public WebSocketMessageType MessageType { get; }
+    }
+    public enum WebSocketState {
+        Aborted = 6,
+        Closed = 5,
+        CloseReceived = 4,
+        CloseSent = 3,
+        Connecting = 1,
+        None = 0,
+        Open = 2,
+    }
+}
```

