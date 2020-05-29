# System.Dynamic

``` diff
+namespace System.Dynamic {
+    public abstract class BinaryOperationBinder : DynamicMetaObjectBinder {
+        protected BinaryOperationBinder(ExpressionType operation);
+        public ExpressionType Operation { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackBinaryOperation(DynamicMetaObject target, DynamicMetaObject arg);
+        public abstract DynamicMetaObject FallbackBinaryOperation(DynamicMetaObject target, DynamicMetaObject arg, DynamicMetaObject errorSuggestion);
+    }
+    public abstract class BindingRestrictions {
+        public static readonly BindingRestrictions Empty;
+        public static BindingRestrictions Combine(IList<DynamicMetaObject> contributingObjects);
+        public static BindingRestrictions GetExpressionRestriction(Expression expression);
+        public static BindingRestrictions GetInstanceRestriction(Expression expression, object instance);
+        public static BindingRestrictions GetTypeRestriction(Expression expression, Type type);
+        public BindingRestrictions Merge(BindingRestrictions restrictions);
+        public Expression ToExpression();
+    }
+    public sealed class CallInfo {
+        public CallInfo(int argCount, IEnumerable<string> argNames);
+        public CallInfo(int argCount, params string[] argNames);
+        public int ArgumentCount { get; }
+        public ReadOnlyCollection<string> ArgumentNames { get; }
+        public override bool Equals(object obj);
+        public override int GetHashCode();
+    }
+    public abstract class ConvertBinder : DynamicMetaObjectBinder {
+        protected ConvertBinder(Type type, bool @explicit);
+        public bool Explicit { get; }
+        public sealed override Type ReturnType { get; }
+        public Type Type { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackConvert(DynamicMetaObject target);
+        public abstract DynamicMetaObject FallbackConvert(DynamicMetaObject target, DynamicMetaObject errorSuggestion);
+    }
+    public abstract class CreateInstanceBinder : DynamicMetaObjectBinder {
+        protected CreateInstanceBinder(CallInfo callInfo);
+        public CallInfo CallInfo { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackCreateInstance(DynamicMetaObject target, DynamicMetaObject[] args);
+        public abstract DynamicMetaObject FallbackCreateInstance(DynamicMetaObject target, DynamicMetaObject[] args, DynamicMetaObject errorSuggestion);
+    }
+    public abstract class DeleteIndexBinder : DynamicMetaObjectBinder {
+        protected DeleteIndexBinder(CallInfo callInfo);
+        public CallInfo CallInfo { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackDeleteIndex(DynamicMetaObject target, DynamicMetaObject[] indexes);
+        public abstract DynamicMetaObject FallbackDeleteIndex(DynamicMetaObject target, DynamicMetaObject[] indexes, DynamicMetaObject errorSuggestion);
+    }
+    public abstract class DeleteMemberBinder : DynamicMetaObjectBinder {
+        protected DeleteMemberBinder(string name, bool ignoreCase);
+        public bool IgnoreCase { get; }
+        public string Name { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackDeleteMember(DynamicMetaObject target);
+        public abstract DynamicMetaObject FallbackDeleteMember(DynamicMetaObject target, DynamicMetaObject errorSuggestion);
+    }
+    public class DynamicMetaObject {
+        public static readonly DynamicMetaObject[] EmptyMetaObjects;
+        public DynamicMetaObject(Expression expression, BindingRestrictions restrictions);
+        public DynamicMetaObject(Expression expression, BindingRestrictions restrictions, object value);
+        public Expression Expression { get; }
+        public bool HasValue { get; }
+        public Type LimitType { get; }
+        public BindingRestrictions Restrictions { get; }
+        public Type RuntimeType { get; }
+        public object Value { get; }
+        public virtual DynamicMetaObject BindBinaryOperation(BinaryOperationBinder binder, DynamicMetaObject arg);
+        public virtual DynamicMetaObject BindConvert(ConvertBinder binder);
+        public virtual DynamicMetaObject BindCreateInstance(CreateInstanceBinder binder, DynamicMetaObject[] args);
+        public virtual DynamicMetaObject BindDeleteIndex(DeleteIndexBinder binder, DynamicMetaObject[] indexes);
+        public virtual DynamicMetaObject BindDeleteMember(DeleteMemberBinder binder);
+        public virtual DynamicMetaObject BindGetIndex(GetIndexBinder binder, DynamicMetaObject[] indexes);
+        public virtual DynamicMetaObject BindGetMember(GetMemberBinder binder);
+        public virtual DynamicMetaObject BindInvoke(InvokeBinder binder, DynamicMetaObject[] args);
+        public virtual DynamicMetaObject BindInvokeMember(InvokeMemberBinder binder, DynamicMetaObject[] args);
+        public virtual DynamicMetaObject BindSetIndex(SetIndexBinder binder, DynamicMetaObject[] indexes, DynamicMetaObject value);
+        public virtual DynamicMetaObject BindSetMember(SetMemberBinder binder, DynamicMetaObject value);
+        public virtual DynamicMetaObject BindUnaryOperation(UnaryOperationBinder binder);
+        public static DynamicMetaObject Create(object value, Expression expression);
+        public virtual IEnumerable<string> GetDynamicMemberNames();
+    }
+    public abstract class DynamicMetaObjectBinder : CallSiteBinder {
+        protected DynamicMetaObjectBinder();
+        public virtual Type ReturnType { get; }
+        public abstract DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public sealed override Expression Bind(object[] args, ReadOnlyCollection<ParameterExpression> parameters, LabelTarget returnLabel);
+        public DynamicMetaObject Defer(DynamicMetaObject target, params DynamicMetaObject[] args);
+        public DynamicMetaObject Defer(params DynamicMetaObject[] args);
+        public Expression GetUpdateExpression(Type type);
+    }
+    public class DynamicObject : IDynamicMetaObjectProvider {
+        protected DynamicObject();
+        public virtual IEnumerable<string> GetDynamicMemberNames();
+        public virtual DynamicMetaObject GetMetaObject(Expression parameter);
+        public virtual bool TryBinaryOperation(BinaryOperationBinder binder, object arg, out object result);
+        public virtual bool TryConvert(ConvertBinder binder, out object result);
+        public virtual bool TryCreateInstance(CreateInstanceBinder binder, object[] args, out object result);
+        public virtual bool TryDeleteIndex(DeleteIndexBinder binder, object[] indexes);
+        public virtual bool TryDeleteMember(DeleteMemberBinder binder);
+        public virtual bool TryGetIndex(GetIndexBinder binder, object[] indexes, out object result);
+        public virtual bool TryGetMember(GetMemberBinder binder, out object result);
+        public virtual bool TryInvoke(InvokeBinder binder, object[] args, out object result);
+        public virtual bool TryInvokeMember(InvokeMemberBinder binder, object[] args, out object result);
+        public virtual bool TrySetIndex(SetIndexBinder binder, object[] indexes, object value);
+        public virtual bool TrySetMember(SetMemberBinder binder, object value);
+        public virtual bool TryUnaryOperation(UnaryOperationBinder binder, out object result);
+    }
+    public sealed class ExpandoObject : ICollection<KeyValuePair<string, object>>, IDictionary<string, object>, IDynamicMetaObjectProvider, IEnumerable, IEnumerable<KeyValuePair<string, object>>, INotifyPropertyChanged {
+        public ExpandoObject();
+        int System.Collections.Generic.ICollection<System.Collections.Generic.KeyValuePair<System.String,System.Object>>.Count { get; }
+        bool System.Collections.Generic.ICollection<System.Collections.Generic.KeyValuePair<System.String,System.Object>>.IsReadOnly { get; }
+        object System.Collections.Generic.IDictionary<System.String,System.Object>.this[string key] { get; set; }
+        ICollection<string> System.Collections.Generic.IDictionary<System.String,System.Object>.Keys { get; }
+        ICollection<object> System.Collections.Generic.IDictionary<System.String,System.Object>.Values { get; }
+        event PropertyChangedEventHandler System.ComponentModel.INotifyPropertyChanged.PropertyChanged;
+        void System.Collections.Generic.ICollection<System.Collections.Generic.KeyValuePair<System.String,System.Object>>.Add(KeyValuePair<string, object> item);
+        void System.Collections.Generic.ICollection<System.Collections.Generic.KeyValuePair<System.String,System.Object>>.Clear();
+        bool System.Collections.Generic.ICollection<System.Collections.Generic.KeyValuePair<System.String,System.Object>>.Contains(KeyValuePair<string, object> item);
+        void System.Collections.Generic.ICollection<System.Collections.Generic.KeyValuePair<System.String,System.Object>>.CopyTo(KeyValuePair<string, object>[] array, int arrayIndex);
+        bool System.Collections.Generic.ICollection<System.Collections.Generic.KeyValuePair<System.String,System.Object>>.Remove(KeyValuePair<string, object> item);
+        void System.Collections.Generic.IDictionary<System.String,System.Object>.Add(string key, object value);
+        bool System.Collections.Generic.IDictionary<System.String,System.Object>.ContainsKey(string key);
+        bool System.Collections.Generic.IDictionary<System.String,System.Object>.Remove(string key);
+        bool System.Collections.Generic.IDictionary<System.String,System.Object>.TryGetValue(string key, out object value);
+        IEnumerator<KeyValuePair<string, object>> System.Collections.Generic.IEnumerable<System.Collections.Generic.KeyValuePair<System.String,System.Object>>.GetEnumerator();
+        IEnumerator System.Collections.IEnumerable.GetEnumerator();
+        DynamicMetaObject System.Dynamic.IDynamicMetaObjectProvider.GetMetaObject(Expression parameter);
+    }
+    public abstract class GetIndexBinder : DynamicMetaObjectBinder {
+        protected GetIndexBinder(CallInfo callInfo);
+        public CallInfo CallInfo { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackGetIndex(DynamicMetaObject target, DynamicMetaObject[] indexes);
+        public abstract DynamicMetaObject FallbackGetIndex(DynamicMetaObject target, DynamicMetaObject[] indexes, DynamicMetaObject errorSuggestion);
+    }
+    public abstract class GetMemberBinder : DynamicMetaObjectBinder {
+        protected GetMemberBinder(string name, bool ignoreCase);
+        public bool IgnoreCase { get; }
+        public string Name { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackGetMember(DynamicMetaObject target);
+        public abstract DynamicMetaObject FallbackGetMember(DynamicMetaObject target, DynamicMetaObject errorSuggestion);
+    }
+    public interface IDynamicMetaObjectProvider {
+        DynamicMetaObject GetMetaObject(Expression parameter);
+    }
+    public interface IInvokeOnGetBinder {
+        bool InvokeOnGet { get; }
+    }
+    public abstract class InvokeBinder : DynamicMetaObjectBinder {
+        protected InvokeBinder(CallInfo callInfo);
+        public CallInfo CallInfo { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackInvoke(DynamicMetaObject target, DynamicMetaObject[] args);
+        public abstract DynamicMetaObject FallbackInvoke(DynamicMetaObject target, DynamicMetaObject[] args, DynamicMetaObject errorSuggestion);
+    }
+    public abstract class InvokeMemberBinder : DynamicMetaObjectBinder {
+        protected InvokeMemberBinder(string name, bool ignoreCase, CallInfo callInfo);
+        public CallInfo CallInfo { get; }
+        public bool IgnoreCase { get; }
+        public string Name { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public abstract DynamicMetaObject FallbackInvoke(DynamicMetaObject target, DynamicMetaObject[] args, DynamicMetaObject errorSuggestion);
+        public DynamicMetaObject FallbackInvokeMember(DynamicMetaObject target, DynamicMetaObject[] args);
+        public abstract DynamicMetaObject FallbackInvokeMember(DynamicMetaObject target, DynamicMetaObject[] args, DynamicMetaObject errorSuggestion);
+    }
+    public abstract class SetIndexBinder : DynamicMetaObjectBinder {
+        protected SetIndexBinder(CallInfo callInfo);
+        public CallInfo CallInfo { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackSetIndex(DynamicMetaObject target, DynamicMetaObject[] indexes, DynamicMetaObject value);
+        public abstract DynamicMetaObject FallbackSetIndex(DynamicMetaObject target, DynamicMetaObject[] indexes, DynamicMetaObject value, DynamicMetaObject errorSuggestion);
+    }
+    public abstract class SetMemberBinder : DynamicMetaObjectBinder {
+        protected SetMemberBinder(string name, bool ignoreCase);
+        public bool IgnoreCase { get; }
+        public string Name { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackSetMember(DynamicMetaObject target, DynamicMetaObject value);
+        public abstract DynamicMetaObject FallbackSetMember(DynamicMetaObject target, DynamicMetaObject value, DynamicMetaObject errorSuggestion);
+    }
+    public abstract class UnaryOperationBinder : DynamicMetaObjectBinder {
+        protected UnaryOperationBinder(ExpressionType operation);
+        public ExpressionType Operation { get; }
+        public sealed override Type ReturnType { get; }
+        public sealed override DynamicMetaObject Bind(DynamicMetaObject target, DynamicMetaObject[] args);
+        public DynamicMetaObject FallbackUnaryOperation(DynamicMetaObject target);
+        public abstract DynamicMetaObject FallbackUnaryOperation(DynamicMetaObject target, DynamicMetaObject errorSuggestion);
+    }
+}
```

