# Microsoft.CSharp.RuntimeBinder

``` diff
+namespace Microsoft.CSharp.RuntimeBinder {
+    public static class Binder {
+        public static CallSiteBinder BinaryOperation(CSharpBinderFlags flags, ExpressionType operation, Type context, IEnumerable<CSharpArgumentInfo> argumentInfo);
+        public static CallSiteBinder Convert(CSharpBinderFlags flags, Type type, Type context);
+        public static CallSiteBinder GetIndex(CSharpBinderFlags flags, Type context, IEnumerable<CSharpArgumentInfo> argumentInfo);
+        public static CallSiteBinder GetMember(CSharpBinderFlags flags, string name, Type context, IEnumerable<CSharpArgumentInfo> argumentInfo);
+        public static CallSiteBinder Invoke(CSharpBinderFlags flags, Type context, IEnumerable<CSharpArgumentInfo> argumentInfo);
+        public static CallSiteBinder InvokeConstructor(CSharpBinderFlags flags, Type context, IEnumerable<CSharpArgumentInfo> argumentInfo);
+        public static CallSiteBinder InvokeMember(CSharpBinderFlags flags, string name, IEnumerable<Type> typeArguments, Type context, IEnumerable<CSharpArgumentInfo> argumentInfo);
+        public static CallSiteBinder IsEvent(CSharpBinderFlags flags, string name, Type context);
+        public static CallSiteBinder SetIndex(CSharpBinderFlags flags, Type context, IEnumerable<CSharpArgumentInfo> argumentInfo);
+        public static CallSiteBinder SetMember(CSharpBinderFlags flags, string name, Type context, IEnumerable<CSharpArgumentInfo> argumentInfo);
+        public static CallSiteBinder UnaryOperation(CSharpBinderFlags flags, ExpressionType operation, Type context, IEnumerable<CSharpArgumentInfo> argumentInfo);
+    }
+    public sealed class CSharpArgumentInfo {
+        public static CSharpArgumentInfo Create(CSharpArgumentInfoFlags flags, string name);
+    }
+    public enum CSharpArgumentInfoFlags {
+        Constant = 2,
+        IsOut = 16,
+        IsRef = 8,
+        IsStaticType = 32,
+        NamedArgument = 4,
+        None = 0,
+        UseCompileTimeType = 1,
+    }
+    public enum CSharpBinderFlags {
+        BinaryOperationLogical = 8,
+        CheckedContext = 1,
+        ConvertArrayIndex = 32,
+        ConvertExplicit = 16,
+        InvokeSimpleName = 2,
+        InvokeSpecialName = 4,
+        None = 0,
+        ResultDiscarded = 256,
+        ResultIndexed = 64,
+        ValueFromCompoundAssignment = 128,
+    }
+    public class RuntimeBinderException : Exception {
+        public RuntimeBinderException();
+        protected RuntimeBinderException(SerializationInfo info, StreamingContext context);
+        public RuntimeBinderException(string message);
+        public RuntimeBinderException(string message, Exception innerException);
+    }
+    public class RuntimeBinderInternalCompilerException : Exception {
+        public RuntimeBinderInternalCompilerException();
+        protected RuntimeBinderInternalCompilerException(SerializationInfo info, StreamingContext context);
+        public RuntimeBinderInternalCompilerException(string message);
+        public RuntimeBinderInternalCompilerException(string message, Exception innerException);
+    }
+}
```

