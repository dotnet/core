# System.ComponentModel.DataAnnotations.Schema

``` diff
+namespace System.ComponentModel.DataAnnotations.Schema {
+    public class ColumnAttribute : Attribute {
+        public ColumnAttribute();
+        public ColumnAttribute(string name);
+        public string Name { get; }
+        public int Order { get; set; }
+        public string TypeName { get; set; }
+    }
+    public class ComplexTypeAttribute : Attribute {
+        public ComplexTypeAttribute();
+    }
+    public class DatabaseGeneratedAttribute : Attribute {
+        public DatabaseGeneratedAttribute(DatabaseGeneratedOption databaseGeneratedOption);
+        public DatabaseGeneratedOption DatabaseGeneratedOption { get; }
+    }
+    public enum DatabaseGeneratedOption {
+        Computed = 2,
+        Identity = 1,
+        None = 0,
+    }
+    public class ForeignKeyAttribute : Attribute {
+        public ForeignKeyAttribute(string name);
+        public string Name { get; }
+    }
+    public class InversePropertyAttribute : Attribute {
+        public InversePropertyAttribute(string property);
+        public string Property { get; }
+    }
+    public class NotMappedAttribute : Attribute {
+        public NotMappedAttribute();
+    }
+    public class TableAttribute : Attribute {
+        public TableAttribute(string name);
+        public string Name { get; }
+        public string Schema { get; set; }
+    }
+}
```

