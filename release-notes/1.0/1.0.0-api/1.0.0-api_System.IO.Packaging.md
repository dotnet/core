# System.IO.Packaging

``` diff
+namespace System.IO.Packaging {
+    public enum CompressionOption {
+        Fast = 2,
+        Maximum = 1,
+        Normal = 0,
+        NotCompressed = -1,
+        SuperFast = 3,
+    }
+    public enum EncryptionOption {
+        None = 0,
+        RightsManagement = 1,
+    }
+    public abstract class Package : IDisposable {
+        protected Package(FileAccess openFileAccess);
+        public FileAccess FileOpenAccess { get; }
+        public PackageProperties PackageProperties { get; }
+        public void Close();
+        public PackagePart CreatePart(Uri partUri, string contentType);
+        public PackagePart CreatePart(Uri partUri, string contentType, CompressionOption compressionOption);
+        protected abstract PackagePart CreatePartCore(Uri partUri, string contentType, CompressionOption compressionOption);
+        public PackageRelationship CreateRelationship(Uri targetUri, TargetMode targetMode, string relationshipType);
+        public PackageRelationship CreateRelationship(Uri targetUri, TargetMode targetMode, string relationshipType, string id);
+        public void DeletePart(Uri partUri);
+        protected abstract void DeletePartCore(Uri partUri);
+        public void DeleteRelationship(string id);
+        protected virtual void Dispose(bool disposing);
+        public void Flush();
+        protected abstract void FlushCore();
+        public PackagePart GetPart(Uri partUri);
+        protected abstract PackagePart GetPartCore(Uri partUri);
+        public PackagePartCollection GetParts();
+        protected abstract PackagePart[] GetPartsCore();
+        public PackageRelationship GetRelationship(string id);
+        public PackageRelationshipCollection GetRelationships();
+        public PackageRelationshipCollection GetRelationshipsByType(string relationshipType);
+        public static Package Open(Stream stream);
+        public static Package Open(Stream stream, FileMode packageMode);
+        public static Package Open(Stream stream, FileMode packageMode, FileAccess packageAccess);
+        public static Package Open(string path);
+        public static Package Open(string path, FileMode packageMode);
+        public static Package Open(string path, FileMode packageMode, FileAccess packageAccess);
+        public static Package Open(string path, FileMode packageMode, FileAccess packageAccess, FileShare packageShare);
+        public virtual bool PartExists(Uri partUri);
+        public bool RelationshipExists(string id);
+        void System.IDisposable.Dispose();
+    }
+    public abstract class PackagePart {
+        protected PackagePart(Package package, Uri partUri);
+        protected PackagePart(Package package, Uri partUri, string contentType);
+        protected PackagePart(Package package, Uri partUri, string contentType, CompressionOption compressionOption);
+        public CompressionOption CompressionOption { get; }
+        public string ContentType { get; }
+        public Package Package { get; }
+        public Uri Uri { get; }
+        public PackageRelationship CreateRelationship(Uri targetUri, TargetMode targetMode, string relationshipType);
+        public PackageRelationship CreateRelationship(Uri targetUri, TargetMode targetMode, string relationshipType, string id);
+        public void DeleteRelationship(string id);
+        protected virtual string GetContentTypeCore();
+        public PackageRelationship GetRelationship(string id);
+        public PackageRelationshipCollection GetRelationships();
+        public PackageRelationshipCollection GetRelationshipsByType(string relationshipType);
+        public Stream GetStream();
+        public Stream GetStream(FileMode mode);
+        public Stream GetStream(FileMode mode, FileAccess access);
+        protected abstract Stream GetStreamCore(FileMode mode, FileAccess access);
+        public bool RelationshipExists(string id);
+    }
+    public class PackagePartCollection : IEnumerable, IEnumerable<PackagePart> {
+        public IEnumerator<PackagePart> GetEnumerator();
+        IEnumerator<PackagePart> System.Collections.Generic.IEnumerable<System.IO.Packaging.PackagePart>.GetEnumerator();
+        IEnumerator System.Collections.IEnumerable.GetEnumerator();
+    }
+    public abstract class PackageProperties : IDisposable {
+        protected PackageProperties();
+        public abstract string Category { get; set; }
+        public abstract string ContentStatus { get; set; }
+        public abstract string ContentType { get; set; }
+        public abstract Nullable<DateTime> Created { get; set; }
+        public abstract string Creator { get; set; }
+        public abstract string Description { get; set; }
+        public abstract string Identifier { get; set; }
+        public abstract string Keywords { get; set; }
+        public abstract string Language { get; set; }
+        public abstract string LastModifiedBy { get; set; }
+        public abstract Nullable<DateTime> LastPrinted { get; set; }
+        public abstract Nullable<DateTime> Modified { get; set; }
+        public abstract string Revision { get; set; }
+        public abstract string Subject { get; set; }
+        public abstract string Title { get; set; }
+        public abstract string Version { get; set; }
+        public void Dispose();
+        protected virtual void Dispose(bool disposing);
+    }
+    public class PackageRelationship {
+        public string Id { get; }
+        public Package Package { get; }
+        public string RelationshipType { get; }
+        public Uri SourceUri { get; }
+        public TargetMode TargetMode { get; }
+        public Uri TargetUri { get; }
+    }
+    public class PackageRelationshipCollection : IEnumerable, IEnumerable<PackageRelationship> {
+        public IEnumerator<PackageRelationship> GetEnumerator();
+        IEnumerator System.Collections.IEnumerable.GetEnumerator();
+    }
+    public sealed class PackageRelationshipSelector {
+        public PackageRelationshipSelector(Uri sourceUri, PackageRelationshipSelectorType selectorType, string selectionCriteria);
+        public string SelectionCriteria { get; }
+        public PackageRelationshipSelectorType SelectorType { get; }
+        public Uri SourceUri { get; }
+        public List<PackageRelationship> Select(Package package);
+    }
+    public enum PackageRelationshipSelectorType {
+        Id = 0,
+        Type = 1,
+    }
+    public static class PackUriHelper {
+        public static readonly string UriSchemePack;
+        public static int ComparePartUri(Uri firstPartUri, Uri secondPartUri);
+        public static Uri CreatePartUri(Uri partUri);
+        public static Uri GetNormalizedPartUri(Uri partUri);
+        public static Uri GetRelationshipPartUri(Uri partUri);
+        public static Uri GetRelativeUri(Uri sourcePartUri, Uri targetPartUri);
+        public static Uri GetSourcePartUriFromRelationshipPartUri(Uri relationshipPartUri);
+        public static bool IsRelationshipPartUri(Uri partUri);
+        public static Uri ResolvePartUri(Uri sourcePartUri, Uri targetUri);
+    }
+    public enum TargetMode {
+        External = 1,
+        Internal = 0,
+    }
+    public sealed class ZipPackage : Package {
+        protected override PackagePart CreatePartCore(Uri partUri, string contentType, CompressionOption compressionOption);
+        protected override void DeletePartCore(Uri partUri);
+        protected override void Dispose(bool disposing);
+        protected override void FlushCore();
+        protected override PackagePart GetPartCore(Uri partUri);
+        protected override PackagePart[] GetPartsCore();
+    }
+    public sealed class ZipPackagePart : PackagePart {
+        protected override Stream GetStreamCore(FileMode streamFileMode, FileAccess streamFileAccess);
+    }
+}
```

