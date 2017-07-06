# System.Reflection.Context

``` diff
+namespace System.Reflection.Context {
+    public abstract class CustomReflectionContext : ReflectionContext {
+        protected CustomReflectionContext();
+        protected CustomReflectionContext(ReflectionContext source);
+        protected virtual IEnumerable<PropertyInfo> AddProperties(Type type);
+        protected PropertyInfo CreateProperty(Type propertyType, string name, Func<object, object> getter, Action<object, object> setter);
+        protected PropertyInfo CreateProperty(Type propertyType, string name, Func<object, object> getter, Action<object, object> setter, IEnumerable<Attribute> propertyCustomAttributes, IEnumerable<Attribute> getterCustomAttributes, IEnumerable<Attribute> setterCustomAttributes);
+        protected virtual IEnumerable<object> GetCustomAttributes(MemberInfo member, IEnumerable<object> declaredAttributes);
+        protected virtual IEnumerable<object> GetCustomAttributes(ParameterInfo parameter, IEnumerable<object> declaredAttributes);
+        public override Assembly MapAssembly(Assembly assembly);
+        public override TypeInfo MapType(TypeInfo type);
+    }
+}
```

