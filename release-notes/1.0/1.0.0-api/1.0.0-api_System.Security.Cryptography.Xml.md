# System.Security.Cryptography.Xml

``` diff
+namespace System.Security.Cryptography.Xml {
+    [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
+    public struct X509IssuerSerial {
+        public string IssuerName { get; set; }
+        public string SerialNumber { get; set; }
+    }
+}
```

