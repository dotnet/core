# System.Runtime

``` diff
 namespace System.Runtime {
     public sealed class MemoryFailPoint : CriticalFinalizerObject, IDisposable {
+        ~MemoryFailPoint();
     }
+    public static class ProfileOptimization {
+        public static void SetProfileRoot(string directoryPath);
+        public static void StartProfile(string profile);
+    }
 }
```

