# System.ComponentModel.Composition.Primitives

``` diff
+namespace System.ComponentModel.Composition.Primitives {
+    public abstract class ComposablePart {
+        protected ComposablePart();
+        public abstract IEnumerable<ExportDefinition> ExportDefinitions { get; }
+        public abstract IEnumerable<ImportDefinition> ImportDefinitions { get; }
+        public virtual IDictionary<string, object> Metadata { get; }
+        public virtual void Activate();
+        public abstract object GetExportedValue(ExportDefinition definition);
+        public abstract void SetImport(ImportDefinition definition, IEnumerable<Export> exports);
+    }
+    public abstract class ComposablePartCatalog : IDisposable, IEnumerable, IEnumerable<ComposablePartDefinition> {
+        protected ComposablePartCatalog();
+        public virtual IQueryable<ComposablePartDefinition> Parts { get; }
+        public void Dispose();
+        protected virtual void Dispose(bool disposing);
+        public virtual IEnumerator<ComposablePartDefinition> GetEnumerator();
+        public virtual IEnumerable<Tuple<ComposablePartDefinition, ExportDefinition>> GetExports(ImportDefinition definition);
+        IEnumerator System.Collections.IEnumerable.GetEnumerator();
+    }
+    public abstract class ComposablePartDefinition {
+        protected ComposablePartDefinition();
+        public abstract IEnumerable<ExportDefinition> ExportDefinitions { get; }
+        public abstract IEnumerable<ImportDefinition> ImportDefinitions { get; }
+        public virtual IDictionary<string, object> Metadata { get; }
+        public abstract ComposablePart CreatePart();
+    }
+    public class ComposablePartException : Exception {
+        public ComposablePartException();
+        protected ComposablePartException(SerializationInfo info, StreamingContext context);
+        public ComposablePartException(string message);
+        public ComposablePartException(string message, ICompositionElement element);
+        public ComposablePartException(string message, ICompositionElement element, Exception innerException);
+        public ComposablePartException(string message, Exception innerException);
+        public ICompositionElement Element { get; }
+        public override void GetObjectData(SerializationInfo info, StreamingContext context);
+    }
+    public class ContractBasedImportDefinition : ImportDefinition {
+        protected ContractBasedImportDefinition();
+        public ContractBasedImportDefinition(string contractName, string requiredTypeIdentity, IEnumerable<KeyValuePair<string, Type>> requiredMetadata, ImportCardinality cardinality, bool isRecomposable, bool isPrerequisite, CreationPolicy requiredCreationPolicy);
+        public ContractBasedImportDefinition(string contractName, string requiredTypeIdentity, IEnumerable<KeyValuePair<string, Type>> requiredMetadata, ImportCardinality cardinality, bool isRecomposable, bool isPrerequisite, CreationPolicy requiredCreationPolicy, IDictionary<string, object> metadata);
+        public override Expression<Func<ExportDefinition, bool>> Constraint { get; }
+        public virtual CreationPolicy RequiredCreationPolicy { get; }
+        public virtual IEnumerable<KeyValuePair<string, Type>> RequiredMetadata { get; }
+        public virtual string RequiredTypeIdentity { get; }
+        public override bool IsConstraintSatisfiedBy(ExportDefinition exportDefinition);
+        public override string ToString();
+    }
+    public class Export {
+        protected Export();
+        public Export(ExportDefinition definition, Func<object> exportedValueGetter);
+        public Export(string contractName, IDictionary<string, object> metadata, Func<object> exportedValueGetter);
+        public Export(string contractName, Func<object> exportedValueGetter);
+        public virtual ExportDefinition Definition { get; }
+        public IDictionary<string, object> Metadata { get; }
+        public object Value { get; }
+        protected virtual object GetExportedValueCore();
+    }
+    public class ExportDefinition {
+        protected ExportDefinition();
+        public ExportDefinition(string contractName, IDictionary<string, object> metadata);
+        public virtual string ContractName { get; }
+        public virtual IDictionary<string, object> Metadata { get; }
+        public override string ToString();
+    }
+    public class ExportedDelegate {
+        protected ExportedDelegate();
+        public ExportedDelegate(object instance, MethodInfo method);
+        public virtual Delegate CreateDelegate(Type delegateType);
+    }
+    public interface ICompositionElement {
+        string DisplayName { get; }
+        ICompositionElement Origin { get; }
+    }
+    public enum ImportCardinality {
+        ExactlyOne = 1,
+        ZeroOrMore = 2,
+        ZeroOrOne = 0,
+    }
+    public class ImportDefinition {
+        protected ImportDefinition();
+        public ImportDefinition(Expression<Func<ExportDefinition, bool>> constraint, string contractName, ImportCardinality cardinality, bool isRecomposable, bool isPrerequisite);
+        public ImportDefinition(Expression<Func<ExportDefinition, bool>> constraint, string contractName, ImportCardinality cardinality, bool isRecomposable, bool isPrerequisite, IDictionary<string, object> metadata);
+        public virtual ImportCardinality Cardinality { get; }
+        public virtual Expression<Func<ExportDefinition, bool>> Constraint { get; }
+        public virtual string ContractName { get; }
+        public virtual bool IsPrerequisite { get; }
+        public virtual bool IsRecomposable { get; }
+        public virtual IDictionary<string, object> Metadata { get; }
+        public virtual bool IsConstraintSatisfiedBy(ExportDefinition exportDefinition);
+        public override string ToString();
+    }
+}
```

