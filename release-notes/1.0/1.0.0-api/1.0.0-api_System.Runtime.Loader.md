# System.Runtime.Loader

``` diff
+namespace System.Runtime.Loader {
+    public abstract class AssemblyLoadContext {
+        protected AssemblyLoadContext();
+        public static AssemblyLoadContext Default { get; }
+        public event Func<AssemblyLoadContext, AssemblyName, Assembly> Resolving;
+        public event Action<AssemblyLoadContext> Unloading;
+        public static AssemblyName GetAssemblyName(string assemblyPath);
+        public static AssemblyLoadContext GetLoadContext(Assembly assembly);
+        protected abstract Assembly Load(AssemblyName assemblyName);
+        public Assembly LoadFromAssemblyName(AssemblyName assemblyName);
+        public Assembly LoadFromAssemblyPath(string assemblyPath);
+        public Assembly LoadFromNativeImagePath(string nativeImagePath, string assemblyPath);
+        public Assembly LoadFromStream(Stream assembly);
+        public Assembly LoadFromStream(Stream assembly, Stream assemblySymbols);
+        protected virtual IntPtr LoadUnmanagedDll(string unmanagedDllName);
+        protected IntPtr LoadUnmanagedDllFromPath(string unmanagedDllPath);
+        public void SetProfileOptimizationRoot(string directoryPath);
+        public void StartProfileOptimization(string profile);
+    }
+}
```

