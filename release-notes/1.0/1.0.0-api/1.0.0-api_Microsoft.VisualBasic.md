# Microsoft.VisualBasic

``` diff
+namespace Microsoft.VisualBasic {
+    public enum CallType {
+        Get = 2,
+        Let = 4,
+        Method = 1,
+        Set = 8,
+    }
+    public sealed class Constants {
+        public const string vbBack = "\b";
+        public const string vbCr = "\r";
+        public const string vbCrLf = "\r\n";
+        public const string vbFormFeed = "\f";
+        public const string vbLf = "\n";
+        public const string vbNewLine = "\r\n";
+        public const string vbNullChar = "\0";
+        public const string vbNullString = null;
+        public const string vbTab = "\t";
+        public const string vbVerticalTab = "\v";
+    }
+    public sealed class HideModuleNameAttribute : Attribute {
+        public HideModuleNameAttribute();
+    }
+    public sealed class Strings {
+        public static int AscW(char String);
+        public static int AscW(string String);
+        public static char ChrW(int CharCode);
+    }
+}
```

