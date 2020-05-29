# System.IO.MemoryMappedFiles

``` diff
+namespace System.IO.MemoryMappedFiles {
+    public class MemoryMappedFile : IDisposable {
+        public SafeMemoryMappedFileHandle SafeMemoryMappedFileHandle { get; }
+        public static MemoryMappedFile CreateFromFile(FileStream fileStream, string mapName, long capacity, MemoryMappedFileAccess access, HandleInheritability inheritability, bool leaveOpen);
+        public static MemoryMappedFile CreateFromFile(string path);
+        public static MemoryMappedFile CreateFromFile(string path, FileMode mode);
+        public static MemoryMappedFile CreateFromFile(string path, FileMode mode, string mapName);
+        public static MemoryMappedFile CreateFromFile(string path, FileMode mode, string mapName, long capacity);
+        public static MemoryMappedFile CreateFromFile(string path, FileMode mode, string mapName, long capacity, MemoryMappedFileAccess access);
+        public static MemoryMappedFile CreateNew(string mapName, long capacity);
+        public static MemoryMappedFile CreateNew(string mapName, long capacity, MemoryMappedFileAccess access);
+        public static MemoryMappedFile CreateNew(string mapName, long capacity, MemoryMappedFileAccess access, MemoryMappedFileOptions options, HandleInheritability inheritability);
+        public static MemoryMappedFile CreateOrOpen(string mapName, long capacity);
+        public static MemoryMappedFile CreateOrOpen(string mapName, long capacity, MemoryMappedFileAccess access);
+        public static MemoryMappedFile CreateOrOpen(string mapName, long capacity, MemoryMappedFileAccess access, MemoryMappedFileOptions options, HandleInheritability inheritability);
+        public MemoryMappedViewAccessor CreateViewAccessor();
+        public MemoryMappedViewAccessor CreateViewAccessor(long offset, long size);
+        public MemoryMappedViewAccessor CreateViewAccessor(long offset, long size, MemoryMappedFileAccess access);
+        public MemoryMappedViewStream CreateViewStream();
+        public MemoryMappedViewStream CreateViewStream(long offset, long size);
+        public MemoryMappedViewStream CreateViewStream(long offset, long size, MemoryMappedFileAccess access);
+        public void Dispose();
+        protected virtual void Dispose(bool disposing);
+        public static MemoryMappedFile OpenExisting(string mapName);
+        public static MemoryMappedFile OpenExisting(string mapName, MemoryMappedFileRights desiredAccessRights);
+        public static MemoryMappedFile OpenExisting(string mapName, MemoryMappedFileRights desiredAccessRights, HandleInheritability inheritability);
+    }
+    public enum MemoryMappedFileAccess {
+        CopyOnWrite = 3,
+        Read = 1,
+        ReadExecute = 4,
+        ReadWrite = 0,
+        ReadWriteExecute = 5,
+        Write = 2,
+    }
+    public enum MemoryMappedFileOptions {
+        DelayAllocatePages = 67108864,
+        None = 0,
+    }
+    public enum MemoryMappedFileRights {
+        AccessSystemSecurity = 16777216,
+        ChangePermissions = 262144,
+        CopyOnWrite = 1,
+        Delete = 65536,
+        Execute = 8,
+        FullControl = 983055,
+        Read = 4,
+        ReadExecute = 12,
+        ReadPermissions = 131072,
+        ReadWrite = 6,
+        ReadWriteExecute = 14,
+        TakeOwnership = 524288,
+        Write = 2,
+    }
+    public sealed class MemoryMappedViewAccessor : UnmanagedMemoryAccessor {
+        public long PointerOffset { get; }
+        public SafeMemoryMappedViewHandle SafeMemoryMappedViewHandle { get; }
+        protected override void Dispose(bool disposing);
+        public void Flush();
+    }
+    public sealed class MemoryMappedViewStream : UnmanagedMemoryStream {
+        public long PointerOffset { get; }
+        public SafeMemoryMappedViewHandle SafeMemoryMappedViewHandle { get; }
+        protected override void Dispose(bool disposing);
+        public override void Flush();
+        public override void SetLength(long value);
+    }
+}
```

