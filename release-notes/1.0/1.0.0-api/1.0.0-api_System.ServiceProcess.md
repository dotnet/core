# System.ServiceProcess

``` diff
+namespace System.ServiceProcess {
+    public class ServiceController : IDisposable {
+        public ServiceController(string name);
+        public ServiceController(string name, string machineName);
+        public bool CanPauseAndContinue { get; }
+        public bool CanShutdown { get; }
+        public bool CanStop { get; }
+        public ServiceController[] DependentServices { get; }
+        public string DisplayName { get; }
+        public string MachineName { get; }
+        public SafeHandle ServiceHandle { get; }
+        public string ServiceName { get; }
+        public ServiceController[] ServicesDependedOn { get; }
+        public ServiceType ServiceType { get; }
+        public ServiceStartMode StartType { get; }
+        public ServiceControllerStatus Status { get; }
+        public void Continue();
+        public void Dispose();
+        protected virtual void Dispose(bool disposing);
+        public static ServiceController[] GetDevices();
+        public static ServiceController[] GetDevices(string machineName);
+        public static ServiceController[] GetServices();
+        public static ServiceController[] GetServices(string machineName);
+        public void Pause();
+        public void Refresh();
+        public void Start();
+        public void Start(string[] args);
+        public void Stop();
+        public void WaitForStatus(ServiceControllerStatus desiredStatus);
+        public void WaitForStatus(ServiceControllerStatus desiredStatus, TimeSpan timeout);
+    }
+    public enum ServiceControllerStatus {
+        ContinuePending = 5,
+        Paused = 7,
+        PausePending = 6,
+        Running = 4,
+        StartPending = 2,
+        Stopped = 1,
+        StopPending = 3,
+    }
+    public enum ServiceStartMode {
+        Automatic = 2,
+        Boot = 0,
+        Disabled = 4,
+        Manual = 3,
+        System = 1,
+    }
+    public enum ServiceType {
+        Adapter = 4,
+        FileSystemDriver = 2,
+        InteractiveProcess = 256,
+        KernelDriver = 1,
+        RecognizerDriver = 8,
+        Win32OwnProcess = 16,
+        Win32ShareProcess = 32,
+    }
+    public class TimeoutException : Exception {
+        public TimeoutException();
+        public TimeoutException(string message);
+        public TimeoutException(string message, Exception innerException);
+    }
+}
```

