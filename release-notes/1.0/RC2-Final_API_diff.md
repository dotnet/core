# API Diff between RC2 and 1.0.0 final

API listing follows standard diff formatting. Lines preceded by a '+' are additions and a '-' indicates removal.

- [System](#system)
- [System.Buffers](#systembuffers)
- [System.ComponentModel](#systemcomponentmodel)
- [System.Data.Common](#systemdatacommon)
- [System.Diagnostics.Tracing](#systemdiagnosticstracing)
- [System.IO](#systemio)
- [System.Net.Http](#systemnethttp)
- [System.Net.Sockets](#systemnetsockets)
- [System.Reflection](#systemreflection)
- [System.Reflection.Context](#systemreflectioncontext)
- [System.Reflection.Metadata](#systemreflectionmetadata)
- [System.Reflection.Metadata.Decoding](#systemreflectionmetadatadecoding)
- [System.Reflection.Metadata.Ecma335](#systemreflectionmetadataecma335)
- [System.Reflection.Metadata.Ecma335.Blobs](#systemreflectionmetadataecma335blobs)
- [System.Reflection.PortableExecutable](#systemreflectionportableexecutable)
- [System.Runtime.CompilerServices](#systemruntimecompilerservices)
- [System.Runtime.InteropServices](#systemruntimeinteropservices)
- [System.Runtime.Loader](#systemruntimeloader)
- [System.Security](#systemsecurity)
- [System.Security.Authentication](#systemsecurityauthentication)
- [System.Security.Cryptography](#systemsecuritycryptography)
- [System.Security.Cryptography.Pkcs](#systemsecuritycryptographypkcs)
- [System.Security.Cryptography.Xml](#systemsecuritycryptographyxml)
- [System.ServiceModel.Security](#systemservicemodelsecurity)
- [System.Text.RegularExpressions](#systemtextregularexpressions)
- [System.Threading.Tasks](#systemthreadingtasks)

## System

```c#
 namespace System {
+ public class UriTypeConverter : TypeConverter {
+   public UriTypeConverter();
+   public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType);
+   public override bool CanConvertTo(ITypeDescriptorContext context, Type destinationType);
+   public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value);
+   public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType);
  }
 }
```

## System.Buffers

```c#
 namespace System.Buffers {
  public abstract class ArrayPool<T> {
    public static ArrayPool<T> Shared { [MethodImpl(AggressiveInlining)]get; }
    public abstract void Return(T[] bufferarray, bool clearArray=false);
  }
 }
```

## System.ComponentModel

```c#
 namespace System.ComponentModel {
  public class ArrayConverter : CollectionConverter {
+   public override PropertyDescriptorCollection GetProperties(ITypeDescriptorContext context, object value, Attribute[] attributes);
+   public override bool GetPropertiesSupported(ITypeDescriptorContext context);
  }
+ public class AttributeCollection : ICollection, IEnumerable {
+   public static readonly AttributeCollection Empty;
+   protected AttributeCollection();
+   public AttributeCollection(params Attribute[] attributes);
+   protected virtual Attribute[] Attributes { get; }
+   public int Count { get; }
+   bool System.Collections.ICollection.IsSynchronized { get; }
+   object System.Collections.ICollection.SyncRoot { get; }
+   public virtual Attribute this[int index] { get; }
+   public virtual Attribute this[Type attributeType] { get; }
+   public bool Contains(Attribute attribute);
+   public bool Contains(Attribute[] attributes);
+   public void CopyTo(Array array, int index);
+   public static AttributeCollection FromExisting(AttributeCollection existing, params Attribute[] newAttributes);
+   protected Attribute GetDefaultAttribute(Type attributeType);
+   public IEnumerator GetEnumerator();
+   public bool Matches(Attribute attribute);
+   public bool Matches(Attribute[] attributes);
  }
+ public class AttributeProviderAttribute : Attribute {
+   public AttributeProviderAttribute(string typeName);
+   public AttributeProviderAttribute(string typeName, string propertyName);
+   public AttributeProviderAttribute(Type type);
+   public string PropertyName { get; }
+   public string TypeName { get; }
  }
  public class BooleanConverter : TypeConverter {
+   public override TypeConverter.StandardValuesCollection GetStandardValues(ITypeDescriptorContext context);
+   public override bool GetStandardValuesExclusive(ITypeDescriptorContext context);
+   public override bool GetStandardValuesSupported(ITypeDescriptorContext context);
  }
+ public sealed class BrowsableAttribute : Attribute {
+   public static readonly BrowsableAttribute Default;
+   public static readonly BrowsableAttribute No;
+   public static readonly BrowsableAttribute Yes;
+   public BrowsableAttribute(bool browsable);
+   public bool Browsable { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public delegate void CancelEventHandler(object sender, CancelEventArgs e);
+ public class CategoryAttribute : Attribute {
+   public CategoryAttribute();
+   public CategoryAttribute(string category);
+   public static CategoryAttribute Action { get; }
+   public static CategoryAttribute Appearance { get; }
+   public static CategoryAttribute Asynchronous { get; }
+   public static CategoryAttribute Behavior { get; }
+   public string Category { get; }
+   public static CategoryAttribute Data { get; }
+   public static CategoryAttribute Default { get; }
+   public static CategoryAttribute Design { get; }
+   public static CategoryAttribute DragDrop { get; }
+   public static CategoryAttribute Focus { get; }
+   public static CategoryAttribute Format { get; }
+   public static CategoryAttribute Key { get; }
+   public static CategoryAttribute Layout { get; }
+   public static CategoryAttribute Mouse { get; }
+   public static CategoryAttribute WindowStyle { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
+   protected virtual string GetLocalizedString(string value);
  }
+ public enum CollectionChangeAction {
+   Add = 1,
+   Refresh = 3,
+   Remove = 2,
  }
+ public class CollectionChangeEventArgs : EventArgs {
+   public CollectionChangeEventArgs(CollectionChangeAction action, object element);
+   public virtual CollectionChangeAction Action { get; }
+   public virtual object Element { get; }
  }
+ public delegate void CollectionChangeEventHandler(object sender, CollectionChangeEventArgs e);
  public class CollectionConverter : TypeConverter {
+   public override PropertyDescriptorCollection GetProperties(ITypeDescriptorContext context, object value, Attribute[] attributes);
+   public override bool GetPropertiesSupported(ITypeDescriptorContext context);
  }
+ public abstract class CustomTypeDescriptor : ICustomTypeDescriptor {
+   protected CustomTypeDescriptor();
+   protected CustomTypeDescriptor(ICustomTypeDescriptor parent);
+   public virtual AttributeCollection GetAttributes();
+   public virtual string GetClassName();
+   public virtual string GetComponentName();
+   public virtual TypeConverter GetConverter();
+   public virtual EventDescriptor GetDefaultEvent();
+   public virtual PropertyDescriptor GetDefaultProperty();
+   public virtual object GetEditor(Type editorBaseType);
+   public virtual EventDescriptorCollection GetEvents();
+   public virtual EventDescriptorCollection GetEvents(Attribute[] attributes);
+   public virtual PropertyDescriptorCollection GetProperties();
+   public virtual PropertyDescriptorCollection GetProperties(Attribute[] attributes);
+   public virtual object GetPropertyOwner(PropertyDescriptor pd);
  }
+ public sealed class DefaultEventAttribute : Attribute {
+   public static readonly DefaultEventAttribute Default;
+   public DefaultEventAttribute(string name);
+   public string Name { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public sealed class DefaultPropertyAttribute : Attribute {
+   public static readonly DefaultPropertyAttribute Default;
+   public DefaultPropertyAttribute(string name);
+   public string Name { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public class DescriptionAttribute : Attribute {
+   public static readonly DescriptionAttribute Default;
+   public DescriptionAttribute();
+   public DescriptionAttribute(string description);
+   public virtual string Description { get; }
+   protected string DescriptionValue { get; set; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public sealed class DesignerCategoryAttribute : Attribute {
+   public static readonly DesignerCategoryAttribute Component;
+   public static readonly DesignerCategoryAttribute Default;
+   public static readonly DesignerCategoryAttribute Form;
+   public static readonly DesignerCategoryAttribute Generic;
+   public DesignerCategoryAttribute();
+   public DesignerCategoryAttribute(string category);
+   public string Category { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public enum DesignerSerializationVisibility {
+   Content = 2,
+   Hidden = 0,
+   Visible = 1,
  }
+ public sealed class DesignerSerializationVisibilityAttribute : Attribute {
+   public static readonly DesignerSerializationVisibilityAttribute Content;
+   public static readonly DesignerSerializationVisibilityAttribute Default;
+   public static readonly DesignerSerializationVisibilityAttribute Hidden;
+   public static readonly DesignerSerializationVisibilityAttribute Visible;
+   public DesignerSerializationVisibilityAttribute(DesignerSerializationVisibility visibility);
+   public DesignerSerializationVisibility Visibility { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public sealed class DesignOnlyAttribute : Attribute {
+   public static readonly DesignOnlyAttribute Default;
+   public static readonly DesignOnlyAttribute No;
+   public static readonly DesignOnlyAttribute Yes;
+   public DesignOnlyAttribute(bool isDesignOnly);
+   public bool IsDesignOnly { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public class DisplayNameAttribute : Attribute {
+   public static readonly DisplayNameAttribute Default;
+   public DisplayNameAttribute();
+   public DisplayNameAttribute(string displayName);
+   public virtual string DisplayName { get; }
+   protected string DisplayNameValue { get; set; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
  public class EnumConverter : TypeConverter {
+   protected virtual IComparer Comparer { get; }
+   protected TypeConverter.StandardValuesCollection Values { get; set; }
+   public override TypeConverter.StandardValuesCollection GetStandardValues(ITypeDescriptorContext context);
+   public override bool GetStandardValuesExclusive(ITypeDescriptorContext context);
+   public override bool GetStandardValuesSupported(ITypeDescriptorContext context);
+   public override bool IsValid(ITypeDescriptorContext context, object value);
  }
+ public abstract class EventDescriptor : MemberDescriptor {
+   protected EventDescriptor(MemberDescriptor descr);
+   protected EventDescriptor(MemberDescriptor descr, Attribute[] attrs);
+   protected EventDescriptor(string name, Attribute[] attrs);
+   public abstract Type ComponentType { get; }
+   public abstract Type EventType { get; }
+   public abstract bool IsMulticast { get; }
+   public abstract void AddEventHandler(object component, Delegate value);
+   public abstract void RemoveEventHandler(object component, Delegate value);
  }
+ public class EventDescriptorCollection : ICollection, IEnumerable, IList {
+   public static readonly EventDescriptorCollection Empty;
+   public EventDescriptorCollection(EventDescriptor[] events);
+   public EventDescriptorCollection(EventDescriptor[] events, bool readOnly);
+   public int Count { get; }
+   bool System.Collections.ICollection.IsSynchronized { get; }
+   object System.Collections.ICollection.SyncRoot { get; }
+   bool System.Collections.IList.IsFixedSize { get; }
+   bool System.Collections.IList.IsReadOnly { get; }
+   object System.Collections.IList.this[int index] { get; set; }
+   public virtual EventDescriptor this[int index] { get; }
+   public virtual EventDescriptor this[string name] { get; }
+   public int Add(EventDescriptor value);
+   public void Clear();
+   public bool Contains(EventDescriptor value);
+   public virtual EventDescriptor Find(string name, bool ignoreCase);
+   public IEnumerator GetEnumerator();
+   public int IndexOf(EventDescriptor value);
+   public void Insert(int index, EventDescriptor value);
+   protected void InternalSort(IComparer sorter);
+   protected void InternalSort(string[] names);
+   public void Remove(EventDescriptor value);
+   public void RemoveAt(int index);
+   public virtual EventDescriptorCollection Sort();
+   public virtual EventDescriptorCollection Sort(IComparer comparer);
+   public virtual EventDescriptorCollection Sort(string[] names);
+   public virtual EventDescriptorCollection Sort(string[] names, IComparer comparer);
+   void System.Collections.ICollection.CopyTo(Array array, int index);
+   int System.Collections.IList.Add(object value);
+   bool System.Collections.IList.Contains(object value);
+   int System.Collections.IList.IndexOf(object value);
+   void System.Collections.IList.Insert(int index, object value);
+   void System.Collections.IList.Remove(object value);
  }
+ public sealed class EventHandlerList : IDisposable {
+   public EventHandlerList();
+   public Delegate this[object key] { get; set; }
+   public void AddHandler(object key, Delegate value);
+   public void AddHandlers(EventHandlerList listToAddFrom);
+   public void Dispose();
+   public void RemoveHandler(object key, Delegate value);
  }
+ public sealed class ExtenderProvidedPropertyAttribute : Attribute {
+   public ExtenderProvidedPropertyAttribute();
+   public PropertyDescriptor ExtenderProperty { get; }
+   public IExtenderProvider Provider { get; }
+   public Type ReceiverType { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public class HandledEventArgs : EventArgs {
+   public HandledEventArgs();
+   public HandledEventArgs(bool defaultHandledValue);
+   public bool Handled { get; set; }
  }
+ public delegate void HandledEventHandler(object sender, HandledEventArgs e);
+ public interface ICustomTypeDescriptor {
+   AttributeCollection GetAttributes();
+   string GetClassName();
+   string GetComponentName();
+   TypeConverter GetConverter();
+   EventDescriptor GetDefaultEvent();
+   PropertyDescriptor GetDefaultProperty();
+   object GetEditor(Type editorBaseType);
+   EventDescriptorCollection GetEvents();
+   EventDescriptorCollection GetEvents(Attribute[] attributes);
+   PropertyDescriptorCollection GetProperties();
+   PropertyDescriptorCollection GetProperties(Attribute[] attributes);
+   object GetPropertyOwner(PropertyDescriptor pd);
  }
+ public interface IExtenderProvider {
+   bool CanExtend(object extendee);
  }
+ public interface IListSource {
+   bool ContainsListCollection { get; }
+   IList GetList();
  }
+ public sealed class ImmutableObjectAttribute : Attribute {
+   public static readonly ImmutableObjectAttribute Default;
+   public static readonly ImmutableObjectAttribute No;
+   public static readonly ImmutableObjectAttribute Yes;
+   public ImmutableObjectAttribute(bool immutable);
+   public bool Immutable { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public sealed class InitializationEventAttribute : Attribute {
+   public InitializationEventAttribute(string eventName);
+   public string EventName { get; }
  }
+ public class InvalidAsynchronousStateException : ArgumentException {
+   public InvalidAsynchronousStateException();
+   public InvalidAsynchronousStateException(string message);
+   public InvalidAsynchronousStateException(string message, Exception innerException);
  }
+ public interface ITypedList {
+   PropertyDescriptorCollection GetItemProperties(PropertyDescriptor[] listAccessors);
+   string GetListName(PropertyDescriptor[] listAccessors);
  }
+ public sealed class LocalizableAttribute : Attribute {
+   public static readonly LocalizableAttribute Default;
+   public static readonly LocalizableAttribute No;
+   public static readonly LocalizableAttribute Yes;
+   public LocalizableAttribute(bool isLocalizable);
+   public bool IsLocalizable { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public abstract class MemberDescriptor {
+   protected MemberDescriptor(MemberDescriptor descr);
+   protected MemberDescriptor(MemberDescriptor oldMemberDescriptor, Attribute[] newAttributes);
+   protected MemberDescriptor(string name);
+   protected MemberDescriptor(string name, Attribute[] attributes);
+   protected virtual Attribute[] AttributeArray { get; set; }
+   public virtual AttributeCollection Attributes { get; }
+   public virtual string Category { get; }
+   public virtual string Description { get; }
+   public virtual bool DesignTimeOnly { get; }
+   public virtual string DisplayName { get; }
+   public virtual bool IsBrowsable { get; }
+   public virtual string Name { get; }
+   protected virtual int NameHashCode { get; }
+   protected virtual AttributeCollection CreateAttributeCollection();
+   public override bool Equals(object obj);
+   protected virtual void FillAttributes(IList attributeList);
+   protected static MethodInfo FindMethod(Type componentClass, string name, Type[] args, Type returnType);
+   protected static MethodInfo FindMethod(Type componentClass, string name, Type[] args, Type returnType, bool publicOnly);
+   public override int GetHashCode();
+   protected virtual object GetInvocationTarget(Type type, object instance);
+   protected static ISite GetSite(object component);
  }
+ public sealed class MergablePropertyAttribute : Attribute {
+   public static readonly MergablePropertyAttribute Default;
+   public static readonly MergablePropertyAttribute No;
+   public static readonly MergablePropertyAttribute Yes;
+   public MergablePropertyAttribute(bool allowMerge);
+   public bool AllowMerge { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
  public class MultilineStringConverter : TypeConverter {
+   public override PropertyDescriptorCollection GetProperties(ITypeDescriptorContext context, object value, Attribute[] attributes);
+   public override bool GetPropertiesSupported(ITypeDescriptorContext context);
  }
+ public sealed class NotifyParentPropertyAttribute : Attribute {
+   public static readonly NotifyParentPropertyAttribute Default;
+   public static readonly NotifyParentPropertyAttribute No;
+   public static readonly NotifyParentPropertyAttribute Yes;
+   public NotifyParentPropertyAttribute(bool notifyParent);
+   public bool NotifyParent { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
  public class NullableConverter : TypeConverter {
+   public override object CreateInstance(ITypeDescriptorContext context, IDictionary propertyValues);
+   public override bool GetCreateInstanceSupported(ITypeDescriptorContext context);
+   public override PropertyDescriptorCollection GetProperties(ITypeDescriptorContext context, object value, Attribute[] attributes);
+   public override bool GetPropertiesSupported(ITypeDescriptorContext context);
+   public override TypeConverter.StandardValuesCollection GetStandardValues(ITypeDescriptorContext context);
+   public override bool GetStandardValuesExclusive(ITypeDescriptorContext context);
+   public override bool GetStandardValuesSupported(ITypeDescriptorContext context);
+   public override bool IsValid(ITypeDescriptorContext context, object value);
  }
+ public sealed class ParenthesizePropertyNameAttribute : Attribute {
+   public static readonly ParenthesizePropertyNameAttribute Default;
+   public ParenthesizePropertyNameAttribute();
+   public ParenthesizePropertyNameAttribute(bool needParenthesis);
+   public bool NeedParenthesis { get; }
+   public override bool Equals(object o);
+   public override int GetHashCode();
  }
  public abstract class PropertyDescriptor : MemberDescriptor {
+   protected PropertyDescriptor(MemberDescriptor descr);
+   protected PropertyDescriptor(MemberDescriptor descr, Attribute[] attrs);
+   protected PropertyDescriptor(string name, Attribute[] attrs);
+   public abstract Type ComponentType { get; }
+   public virtual TypeConverter Converter { get; }
+   public virtual bool IsLocalizable { get; }
+   public abstract bool IsReadOnly { get; }
+   public abstract Type PropertyType { get; }
+   public DesignerSerializationVisibility SerializationVisibility { get; }
+   public virtual bool SupportsChangeEvents { get; }
+   public virtual void AddValueChanged(object component, EventHandler handler);
+   public abstract bool CanResetValue(object component);
+   protected object CreateInstance(Type type);
+   public override bool Equals(object obj);
+   protected override void FillAttributes(IList attributeList);
+   public PropertyDescriptorCollection GetChildProperties();
+   public PropertyDescriptorCollection GetChildProperties(Attribute[] filter);
+   public PropertyDescriptorCollection GetChildProperties(object instance);
+   public virtual PropertyDescriptorCollection GetChildProperties(object instance, Attribute[] filter);
+   public virtual object GetEditor(Type editorBaseType);
+   public override int GetHashCode();
+   protected override object GetInvocationTarget(Type type, object instance);
+   protected Type GetTypeFromName(string typeName);
+   public abstract object GetValue(object component);
+   protected internal EventHandler GetValueChangedHandler(object component);
+   protected virtual void OnValueChanged(object component, EventArgs e);
+   public virtual void RemoveValueChanged(object component, EventHandler handler);
+   public abstract void ResetValue(object component);
+   public abstract void SetValue(object component, object value);
+   public abstract bool ShouldSerializeValue(object component);
  }
+ public class PropertyDescriptorCollection : ICollection, IDictionary, IEnumerable, IList {
+   public static readonly PropertyDescriptorCollection Empty;
+   public PropertyDescriptorCollection(PropertyDescriptor[] properties);
+   public PropertyDescriptorCollection(PropertyDescriptor[] properties, bool readOnly);
+   public int Count { get; }
+   bool System.Collections.ICollection.IsSynchronized { get; }
+   object System.Collections.ICollection.SyncRoot { get; }
+   bool System.Collections.IDictionary.IsFixedSize { get; }
+   bool System.Collections.IDictionary.IsReadOnly { get; }
+   object System.Collections.IDictionary.this[object key] { get; set; }
+   ICollection System.Collections.IDictionary.Keys { get; }
+   ICollection System.Collections.IDictionary.Values { get; }
+   bool System.Collections.IList.IsFixedSize { get; }
+   bool System.Collections.IList.IsReadOnly { get; }
+   object System.Collections.IList.this[int index] { get; set; }
+   public virtual PropertyDescriptor this[int index] { get; }
+   public virtual PropertyDescriptor this[string name] { get; }
+   public int Add(PropertyDescriptor value);
+   public void Clear();
+   public bool Contains(PropertyDescriptor value);
+   public void CopyTo(Array array, int index);
+   public virtual PropertyDescriptor Find(string name, bool ignoreCase);
+   public virtual IEnumerator GetEnumerator();
+   public int IndexOf(PropertyDescriptor value);
+   public void Insert(int index, PropertyDescriptor value);
+   protected void InternalSort(IComparer sorter);
+   protected void InternalSort(string[] names);
+   public void Remove(PropertyDescriptor value);
+   public void RemoveAt(int index);
+   public virtual PropertyDescriptorCollection Sort();
+   public virtual PropertyDescriptorCollection Sort(IComparer comparer);
+   public virtual PropertyDescriptorCollection Sort(string[] names);
+   public virtual PropertyDescriptorCollection Sort(string[] names, IComparer comparer);
+   void System.Collections.IDictionary.Add(object key, object value);
+   bool System.Collections.IDictionary.Contains(object key);
+   IDictionaryEnumerator System.Collections.IDictionary.GetEnumerator();
+   void System.Collections.IDictionary.Remove(object key);
+   int System.Collections.IList.Add(object value);
+   bool System.Collections.IList.Contains(object value);
+   int System.Collections.IList.IndexOf(object value);
+   void System.Collections.IList.Insert(int index, object value);
+   void System.Collections.IList.Remove(object value);
  }
+ public sealed class ProvidePropertyAttribute : Attribute {
+   public ProvidePropertyAttribute(string propertyName, string receiverTypeName);
+   public ProvidePropertyAttribute(string propertyName, Type receiverType);
+   public string PropertyName { get; }
+   public string ReceiverTypeName { get; }
+   public override bool Equals(object obj);
+   public override int GetHashCode();
  }
+ public sealed class ReadOnlyAttribute : Attribute {
+   public static readonly ReadOnlyAttribute Default;
+   public static readonly ReadOnlyAttribute No;
+   public static readonly ReadOnlyAttribute Yes;
+   public ReadOnlyAttribute(bool isReadOnly);
+   public bool IsReadOnly { get; }
+   public override bool Equals(object value);
+   public override int GetHashCode();
  }
+ public class RefreshEventArgs : EventArgs {
+   public RefreshEventArgs(object componentChanged);
+   public RefreshEventArgs(Type typeChanged);
+   public object ComponentChanged { get; }
+   public Type TypeChanged { get; }
  }
+ public delegate void RefreshEventHandler(RefreshEventArgs e);
+ public enum RefreshProperties {
+   All = 1,
+   None = 0,
+   Repaint = 2,
  }
+ public sealed class RefreshPropertiesAttribute : Attribute {
+   public static readonly RefreshPropertiesAttribute All;
+   public static readonly RefreshPropertiesAttribute Default;
+   public static readonly RefreshPropertiesAttribute Repaint;
+   public RefreshPropertiesAttribute(RefreshProperties refresh);
+   public RefreshProperties RefreshProperties { get; }
+   public override bool Equals(object value);
+   public override int GetHashCode();
  }
  public class TypeConverter {
+   public object ConvertFromInvariantString(ITypeDescriptorContext context, string text);
+   public object ConvertFromString(ITypeDescriptorContext context, string text);
+   public string ConvertToInvariantString(ITypeDescriptorContext context, object value);
+   public string ConvertToString(ITypeDescriptorContext context, object value);
+   public object CreateInstance(IDictionary propertyValues);
+   public virtual object CreateInstance(ITypeDescriptorContext context, IDictionary propertyValues);
+   public bool GetCreateInstanceSupported();
+   public virtual bool GetCreateInstanceSupported(ITypeDescriptorContext context);
+   public PropertyDescriptorCollection GetProperties(ITypeDescriptorContext context, object value);
+   public virtual PropertyDescriptorCollection GetProperties(ITypeDescriptorContext context, object value, Attribute[] attributes);
+   public PropertyDescriptorCollection GetProperties(object value);
+   public bool GetPropertiesSupported();
+   public virtual bool GetPropertiesSupported(ITypeDescriptorContext context);
+   public ICollection GetStandardValues();
+   public virtual TypeConverter.StandardValuesCollection GetStandardValues(ITypeDescriptorContext context);
+   public bool GetStandardValuesExclusive();
+   public virtual bool GetStandardValuesExclusive(ITypeDescriptorContext context);
+   public bool GetStandardValuesSupported();
+   public virtual bool GetStandardValuesSupported(ITypeDescriptorContext context);
+   public virtual bool IsValid(ITypeDescriptorContext context, object value);
+   public bool IsValid(object value);
+   protected PropertyDescriptorCollection SortProperties(PropertyDescriptorCollection props, string[] names);
+   protected abstract class SimplePropertyDescriptor : PropertyDescriptor {
+     protected SimplePropertyDescriptor(Type componentType, string name, Type propertyType);
+     protected SimplePropertyDescriptor(Type componentType, string name, Type propertyType, Attribute[] attributes);
+     public override Type ComponentType { get; }
+     public override bool IsReadOnly { get; }
+     public override Type PropertyType { get; }
+     public override bool CanResetValue(object component);
+     public override void ResetValue(object component);
+     public override bool ShouldSerializeValue(object component);
    }
+   public class StandardValuesCollection : ICollection, IEnumerable {
+     public StandardValuesCollection(ICollection values);
+     public int Count { get; }
+     bool System.Collections.ICollection.IsSynchronized { get; }
+     object System.Collections.ICollection.SyncRoot { get; }
+     public object this[int index] { get; }
+     public void CopyTo(Array array, int index);
+     public IEnumerator GetEnumerator();
    }
  }
  public sealed class TypeConverterAttribute : Attribute {
+   public static readonly TypeConverterAttribute Default;
+   public TypeConverterAttribute();
  }
+ public abstract class TypeDescriptionProvider {
+   protected TypeDescriptionProvider();
+   protected TypeDescriptionProvider(TypeDescriptionProvider parent);
+   public virtual object CreateInstance(IServiceProvider provider, Type objectType, Type[] argTypes, object[] args);
+   public virtual IDictionary GetCache(object instance);
+   public virtual ICustomTypeDescriptor GetExtendedTypeDescriptor(object instance);
+   protected internal virtual IExtenderProvider[] GetExtenderProviders(object instance);
+   public virtual string GetFullComponentName(object component);
+   public Type GetReflectionType(object instance);
+   public Type GetReflectionType(Type objectType);
+   public virtual Type GetReflectionType(Type objectType, object instance);
+   public virtual Type GetRuntimeType(Type reflectionType);
+   public ICustomTypeDescriptor GetTypeDescriptor(object instance);
+   public ICustomTypeDescriptor GetTypeDescriptor(Type objectType);
+   public virtual ICustomTypeDescriptor GetTypeDescriptor(Type objectType, object instance);
+   public virtual bool IsSupportedType(Type type);
  }
+ public sealed class TypeDescriptionProviderAttribute : Attribute {
+   public TypeDescriptionProviderAttribute(string typeName);
+   public TypeDescriptionProviderAttribute(Type type);
+   public string TypeName { get; }
  }
  public sealed class TypeDescriptor {
+   public static Type InterfaceType { get; }
+   public static event RefreshEventHandler Refreshed;
+   public static TypeDescriptionProvider AddAttributes(object instance, params Attribute[] attributes);
+   public static TypeDescriptionProvider AddAttributes(Type type, params Attribute[] attributes);
+   public static void AddEditorTable(Type editorBaseType, Hashtable table);
+   public static void AddProvider(TypeDescriptionProvider provider, object instance);
+   public static void AddProvider(TypeDescriptionProvider provider, Type type);
+   public static void AddProviderTransparent(TypeDescriptionProvider provider, object instance);
+   public static void AddProviderTransparent(TypeDescriptionProvider provider, Type type);
+   public static void CreateAssociation(object primary, object secondary);
+   public static EventDescriptor CreateEvent(Type componentType, EventDescriptor oldEventDescriptor, params Attribute[] attributes);
+   public static EventDescriptor CreateEvent(Type componentType, string name, Type type, params Attribute[] attributes);
+   public static object CreateInstance(IServiceProvider provider, Type objectType, Type[] argTypes, object[] args);
+   public static PropertyDescriptor CreateProperty(Type componentType, PropertyDescriptor oldPropertyDescriptor, params Attribute[] attributes);
+   public static PropertyDescriptor CreateProperty(Type componentType, string name, Type type, params Attribute[] attributes);
+   public static object GetAssociation(Type type, object primary);
+   public static AttributeCollection GetAttributes(object component);
+   public static AttributeCollection GetAttributes(object component, bool noCustomTypeDesc);
+   public static AttributeCollection GetAttributes(Type componentType);
+   public static string GetClassName(object component);
+   public static string GetClassName(object component, bool noCustomTypeDesc);
+   public static string GetClassName(Type componentType);
+   public static string GetComponentName(object component);
+   public static string GetComponentName(object component, bool noCustomTypeDesc);
+   public static TypeConverter GetConverter(object component);
+   public static TypeConverter GetConverter(object component, bool noCustomTypeDesc);
+   public static EventDescriptor GetDefaultEvent(object component);
+   public static EventDescriptor GetDefaultEvent(object component, bool noCustomTypeDesc);
+   public static EventDescriptor GetDefaultEvent(Type componentType);
+   public static PropertyDescriptor GetDefaultProperty(object component);
+   public static PropertyDescriptor GetDefaultProperty(object component, bool noCustomTypeDesc);
+   public static PropertyDescriptor GetDefaultProperty(Type componentType);
+   public static object GetEditor(object component, Type editorBaseType);
+   public static object GetEditor(object component, Type editorBaseType, bool noCustomTypeDesc);
+   public static object GetEditor(Type type, Type editorBaseType);
+   public static EventDescriptorCollection GetEvents(object component);
+   public static EventDescriptorCollection GetEvents(object component, Attribute[] attributes);
+   public static EventDescriptorCollection GetEvents(object component, Attribute[] attributes, bool noCustomTypeDesc);
+   public static EventDescriptorCollection GetEvents(object component, bool noCustomTypeDesc);
+   public static EventDescriptorCollection GetEvents(Type componentType);
+   public static EventDescriptorCollection GetEvents(Type componentType, Attribute[] attributes);
+   public static string GetFullComponentName(object component);
+   public static PropertyDescriptorCollection GetProperties(object component);
+   public static PropertyDescriptorCollection GetProperties(object component, Attribute[] attributes);
+   public static PropertyDescriptorCollection GetProperties(object component, Attribute[] attributes, bool noCustomTypeDesc);
+   public static PropertyDescriptorCollection GetProperties(object component, bool noCustomTypeDesc);
+   public static PropertyDescriptorCollection GetProperties(Type componentType);
+   public static PropertyDescriptorCollection GetProperties(Type componentType, Attribute[] attributes);
+   public static TypeDescriptionProvider GetProvider(object instance);
+   public static TypeDescriptionProvider GetProvider(Type type);
+   public static Type GetReflectionType(object instance);
+   public static Type GetReflectionType(Type type);
+   public static void Refresh(object component);
+   public static void Refresh(Assembly assembly);
+   public static void Refresh(Module module);
+   public static void Refresh(Type type);
+   public static void RemoveAssociation(object primary, object secondary);
+   public static void RemoveAssociations(object primary);
+   public static void RemoveProvider(TypeDescriptionProvider provider, object instance);
+   public static void RemoveProvider(TypeDescriptionProvider provider, Type type);
+   public static void RemoveProviderTransparent(TypeDescriptionProvider provider, object instance);
+   public static void RemoveProviderTransparent(TypeDescriptionProvider provider, Type type);
+   public static void SortDescriptorArray(IList infos);
  }
  public abstract class TypeListConverter : TypeConverter {
+   public override TypeConverter.StandardValuesCollection GetStandardValues(ITypeDescriptorContext context);
+   public override bool GetStandardValuesExclusive(ITypeDescriptorContext context);
+   public override bool GetStandardValuesSupported(ITypeDescriptorContext context);
  }
 }
```

## System.Data.Common

```c#

 namespace System.Data.Common {
+ public class DbEnumerator : IEnumerator {
+   public DbEnumerator(IDataReader reader, bool closeReader);
+   public object Current { get; }
+   public bool MoveNext();
+   public void Reset();
  }
 }
 ```

## System.Diagnostics.Tracing

```c#

 namespace System.Diagnostics.Tracing {
+ public class EventCounter {
+   public EventCounter(string name, EventSource eventSource);
+   public void WriteMetric(float value);
  }
  public abstract class EventListener : IDisposable {
-   publicprotected static int EventSourceIndex(EventSource eventSource);
  }
 }
 ```

## System.IO

```c#

 namespace System.IO {
  public class FileSystemWatcher : IDisposable {
+   public WaitForChangedResult WaitForChanged(WatcherChangeTypes changeType);
+   public WaitForChangedResult WaitForChanged(WatcherChangeTypes changeType, int timeout);
  }
+ [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential, Size=1)]
  public struct WaitForChangedResult {
+   public WatcherChangeTypes ChangeType { get; set; }
+   public string Name { get; set; }
+   public string OldName { get; set; }
+   public bool TimedOut { get; set; }
  }
 }
 ```

## System.Net.Http

```c#

 namespace System.Net.Http {
  public class HttpClientHandler : HttpMessageHandler {
+   public bool CheckCertificateRevocationList { get; set; }
+   public X509CertificateCollection ClientCertificates { get; }
+   public ICredentials DefaultProxyCredentials { get; set; }
+   public int MaxConnectionsPerServer { get; set; }
+   public int MaxResponseHeadersLength { get; set; }
+   public IDictionary<string, object> Properties { get; }
+   public Func<HttpRequestMessage, X509Certificate2, X509Chain, SslPolicyErrors, bool> ServerCertificateCustomValidationCallback { get; set; }
+   public SslProtocols SslProtocols { get; set; }
  }
  public class WinHttpHandler : HttpMessageHandler {
-   public TimeSpan ConnectTimeout { get; set; }
+   public IDictionary<string, object> Properties { get; }
  }
 }
```

## System.Net.Sockets

```c#

 namespace System.Net.Sockets {
  public class TcpClient : IDisposable {
+   public Socket Client { get; set; }
  }
  public class UdpClient : IDisposable {
+   public Socket Client { get; set; }
  }
 }
```

## System.Reflection

```c#

 namespace System.Reflection {
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct Blob {
-   public bool IsDefault { get; }
-   public int Length { get; }
-   public ArraySegment<byte> GetBytes();
  }
- public class BlobBuilder {
-   public BlobBuilder(int size=256);
-   public int Count { get; }
-   public void Align(int alignment);
-   protected virtual BlobBuilder AllocateChunk(int minimalSize);
-   public void Clear();
-   public bool ContentEquals(BlobBuilder other);
-   protected void Free();
-   protected virtual void FreeChunk();
-   public BlobBuilder.Blobs GetBlobs();
-   public void LinkPrefix(BlobBuilder prefix);
-   public void LinkSuffix(BlobBuilder suffix);
-   public void PadTo(int position);
-   public Blob ReserveBytes(int byteCount);
-   public byte[] ToArray();
-   public byte[] ToArray(int start, int byteCount);
-   public ImmutableArray<byte> ToImmutableArray();
-   public ImmutableArray<byte> ToImmutableArray(int start, int byteCount);
-   public int TryWriteBytes(Stream source, int byteCount);
-   public void WriteBoolean(bool value);
-   public void WriteByte(byte value);
-   public unsafe void WriteBytes(byte* buffer, int byteCount);
-   public void WriteBytes(byte value, int byteCount);
-   public void WriteBytes(byte[] buffer);
-   public void WriteBytes(byte[] buffer, int start, int byteCount);
-   public void WriteBytes(ImmutableArray<byte> buffer);
-   public void WriteBytes(ImmutableArray<byte> buffer, int start, int byteCount);
-   public void WriteCompressedInteger(int value);
-   public void WriteCompressedSignedInteger(int value);
-   public void WriteConstant(object value);
-   public void WriteContentTo(Stream destination);
-   public void WriteContentTo(BlobBuilder destination);
-   public void WriteContentTo(ref BlobWriter destination);
-   public void WriteDateTime(DateTime value);
-   public void WriteDecimal(decimal value);
-   public void WriteDouble(double value);
-   public void WriteInt16(short value);
-   public void WriteInt16BE(short value);
-   public void WriteInt32(int value);
-   public void WriteInt32BE(int value);
-   public void WriteInt64(long value);
-   public void WriteSByte(sbyte value);
-   public void WriteSerializedString(string value);
-   public void WriteSingle(float value);
-   public void WriteUInt16(ushort value);
-   public void WriteUInt16BE(ushort value);
-   public void WriteUInt32(uint value);
-   public void WriteUInt32BE(uint value);
-   public void WriteUInt64(ulong value);
-   public void WriteUTF16(char[] value);
-   public void WriteUTF16(string value);
-   public void WriteUTF8(string value, bool allowUnpairedSurrogates);
-   [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
    public struct Blobs : IDisposable, IEnumerable, IEnumerable<Blob>, IEnumerator, IEnumerator<Blob> {
-     public Blob Current { get; }
-     object System.Collections.IEnumerator.Current { get; }
-     public BlobBuilder.Blobs GetEnumerator();
-     public bool MoveNext();
-     public void Reset();
-     IEnumerator<Blob> System.Collections.Generic.IEnumerable<System.Reflection.Blob>.GetEnumerator();
-     IEnumerator System.Collections.IEnumerable.GetEnumerator();
-     void System.IDisposable.Dispose();
    }
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct BlobWriter {
-   public BlobWriter(byte[] buffer);
-   public BlobWriter(byte[] buffer, int start, int count);
-   public BlobWriter(int size);
-   public BlobWriter(Blob blob);
-   public Blob Blob { get; }
-   public int Length { get; }
-   public int Offset { get; set; }
-   public int RemainingBytes { get; }
-   public void Align(int alignment);
-   public void Clear();
-   public bool ContentEquals(BlobWriter other);
-   public void PadTo(int offset);
-   public byte[] ToArray();
-   public byte[] ToArray(int start, int byteCount);
-   public ImmutableArray<byte> ToImmutableArray();
-   public ImmutableArray<byte> ToImmutableArray(int start, int byteCount);
-   public void WriteBoolean(bool value);
-   public void WriteByte(byte value);
-   public unsafe void WriteBytes(byte* buffer, int byteCount);
-   public void WriteBytes(byte value, int byteCount);
-   public void WriteBytes(byte[] buffer);
-   public void WriteBytes(byte[] buffer, int start, int byteCount);
-   public void WriteBytes(ImmutableArray<byte> buffer);
-   public void WriteBytes(ImmutableArray<byte> buffer, int start, int byteCount);
-   public int WriteBytes(Stream source, int byteCount);
-   public void WriteBytes(BlobBuilder source);
-   public void WriteCompressedInteger(int value);
-   public void WriteCompressedSignedInteger(int value);
-   public void WriteConstant(object value);
-   public void WriteDateTime(DateTime value);
-   public void WriteDecimal(decimal value);
-   public void WriteDouble(double value);
-   public void WriteInt16(short value);
-   public void WriteInt16BE(short value);
-   public void WriteInt32(int value);
-   public void WriteInt32BE(int value);
-   public void WriteInt64(long value);
-   public void WriteReference(uint reference, int size);
-   public void WriteSByte(sbyte value);
-   public void WriteSerializedString(string str);
-   public void WriteSingle(float value);
-   public void WriteUInt16(ushort value);
-   public void WriteUInt16BE(ushort value);
-   public void WriteUInt32(uint value);
-   public void WriteUInt32BE(uint value);
-   public void WriteUInt64(ulong value);
-   public void WriteUTF16(char[] value);
-   public void WriteUTF16(string value);
-   public void WriteUTF8(string value, bool allowUnpairedSurrogates);
  }
 }
```

## System.Reflection.Context

```c#

+namespace System.Reflection.Context {
+ public abstract class CustomReflectionContext : ReflectionContext {
+   protected CustomReflectionContext();
+   protected CustomReflectionContext(ReflectionContext source);
+   protected virtual IEnumerable<PropertyInfo> AddProperties(Type type);
+   protected PropertyInfo CreateProperty(Type propertyType, string name, Func<object, object> getter, Action<object, object> setter);
+   protected PropertyInfo CreateProperty(Type propertyType, string name, Func<object, object> getter, Action<object, object> setter, IEnumerable<Attribute> propertyCustomAttributes, IEnumerable<Attribute> getterCustomAttributes, IEnumerable<Attribute> setterCustomAttributes);
+   protected virtual IEnumerable<object> GetCustomAttributes(MemberInfo member, IEnumerable<object> declaredAttributes);
+   protected virtual IEnumerable<object> GetCustomAttributes(ParameterInfo parameter, IEnumerable<object> declaredAttributes);
+   public override Assembly MapAssembly(Assembly assembly);
+   public override TypeInfo MapType(TypeInfo type);
  }
 }
```

## System.Reflection.Metadata

```c#

 namespace System.Reflection.Metadata {
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct CustomAttribute {
-   public CustomAttributeValue<TType> DecodeValue<TType>(ICustomAttributeTypeProvider<TType> provider);
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct FieldDefinition {
-   public TType DecodeSignature<TType>(ISignatureTypeProvider<TType> provider, SignatureDecoderOptions options=(SignatureDecoderOptions)(0));
  }
- public enum ILOpCode : ushort {
-   Add = (ushort)88,
-   Add_ovf = (ushort)214,
-   Add_ovf_un = (ushort)215,
-   And = (ushort)95,
-   Arglist = (ushort)65024,
-   Beq = (ushort)59,
-   Beq_s = (ushort)46,
-   Bge = (ushort)60,
-   Bge_s = (ushort)47,
-   Bge_un = (ushort)65,
-   Bge_un_s = (ushort)52,
-   Bgt = (ushort)61,
-   Bgt_s = (ushort)48,
-   Bgt_un = (ushort)66,
-   Bgt_un_s = (ushort)53,
-   Ble = (ushort)62,
-   Ble_s = (ushort)49,
-   Ble_un = (ushort)67,
-   Ble_un_s = (ushort)54,
-   Blt = (ushort)63,
-   Blt_s = (ushort)50,
-   Blt_un = (ushort)68,
-   Blt_un_s = (ushort)55,
-   Bne_un = (ushort)64,
-   Bne_un_s = (ushort)51,
-   Box = (ushort)140,
-   Br = (ushort)56,
-   Br_s = (ushort)43,
-   Break = (ushort)1,
-   Brfalse = (ushort)57,
-   Brfalse_s = (ushort)44,
-   Brtrue = (ushort)58,
-   Brtrue_s = (ushort)45,
-   Call = (ushort)40,
-   Calli = (ushort)41,
-   Callvirt = (ushort)111,
-   Castclass = (ushort)116,
-   Ceq = (ushort)65025,
-   Cgt = (ushort)65026,
-   Cgt_un = (ushort)65027,
-   Ckfinite = (ushort)195,
-   Clt = (ushort)65028,
-   Clt_un = (ushort)65029,
-   Constrained = (ushort)65046,
-   Conv_i = (ushort)211,
-   Conv_i1 = (ushort)103,
-   Conv_i2 = (ushort)104,
-   Conv_i4 = (ushort)105,
-   Conv_i8 = (ushort)106,
-   Conv_ovf_i = (ushort)212,
-   Conv_ovf_i_un = (ushort)138,
-   Conv_ovf_i1 = (ushort)179,
-   Conv_ovf_i1_un = (ushort)130,
-   Conv_ovf_i2 = (ushort)181,
-   Conv_ovf_i2_un = (ushort)131,
-   Conv_ovf_i4 = (ushort)183,
-   Conv_ovf_i4_un = (ushort)132,
-   Conv_ovf_i8 = (ushort)185,
-   Conv_ovf_i8_un = (ushort)133,
-   Conv_ovf_u = (ushort)213,
-   Conv_ovf_u_un = (ushort)139,
-   Conv_ovf_u1 = (ushort)180,
-   Conv_ovf_u1_un = (ushort)134,
-   Conv_ovf_u2 = (ushort)182,
-   Conv_ovf_u2_un = (ushort)135,
-   Conv_ovf_u4 = (ushort)184,
-   Conv_ovf_u4_un = (ushort)136,
-   Conv_ovf_u8 = (ushort)186,
-   Conv_ovf_u8_un = (ushort)137,
-   Conv_r_un = (ushort)118,
-   Conv_r4 = (ushort)107,
-   Conv_r8 = (ushort)108,
-   Conv_u = (ushort)224,
-   Conv_u1 = (ushort)210,
-   Conv_u2 = (ushort)209,
-   Conv_u4 = (ushort)109,
-   Conv_u8 = (ushort)110,
-   Cpblk = (ushort)65047,
-   Cpobj = (ushort)112,
-   Div = (ushort)91,
-   Div_un = (ushort)92,
-   Dup = (ushort)37,
-   Endfilter = (ushort)65041,
-   Endfinally = (ushort)220,
-   Initblk = (ushort)65048,
-   Initobj = (ushort)65045,
-   Isinst = (ushort)117,
-   Jmp = (ushort)39,
-   Ldarg = (ushort)65033,
-   Ldarg_0 = (ushort)2,
-   Ldarg_1 = (ushort)3,
-   Ldarg_2 = (ushort)4,
-   Ldarg_3 = (ushort)5,
-   Ldarg_s = (ushort)14,
-   Ldarga = (ushort)65034,
-   Ldarga_s = (ushort)15,
-   Ldc_i4 = (ushort)32,
-   Ldc_i4_0 = (ushort)22,
-   Ldc_i4_1 = (ushort)23,
-   Ldc_i4_2 = (ushort)24,
-   Ldc_i4_3 = (ushort)25,
-   Ldc_i4_4 = (ushort)26,
-   Ldc_i4_5 = (ushort)27,
-   Ldc_i4_6 = (ushort)28,
-   Ldc_i4_7 = (ushort)29,
-   Ldc_i4_8 = (ushort)30,
-   Ldc_i4_m1 = (ushort)21,
-   Ldc_i4_s = (ushort)31,
-   Ldc_i8 = (ushort)33,
-   Ldc_r4 = (ushort)34,
-   Ldc_r8 = (ushort)35,
-   Ldelem = (ushort)163,
-   Ldelem_i = (ushort)151,
-   Ldelem_i1 = (ushort)144,
-   Ldelem_i2 = (ushort)146,
-   Ldelem_i4 = (ushort)148,
-   Ldelem_i8 = (ushort)150,
-   Ldelem_r4 = (ushort)152,
-   Ldelem_r8 = (ushort)153,
-   Ldelem_ref = (ushort)154,
-   Ldelem_u1 = (ushort)145,
-   Ldelem_u2 = (ushort)147,
-   Ldelem_u4 = (ushort)149,
-   Ldelema = (ushort)143,
-   Ldfld = (ushort)123,
-   Ldflda = (ushort)124,
-   Ldftn = (ushort)65030,
-   Ldind_i = (ushort)77,
-   Ldind_i1 = (ushort)70,
-   Ldind_i2 = (ushort)72,
-   Ldind_i4 = (ushort)74,
-   Ldind_i8 = (ushort)76,
-   Ldind_r4 = (ushort)78,
-   Ldind_r8 = (ushort)79,
-   Ldind_ref = (ushort)80,
-   Ldind_u1 = (ushort)71,
-   Ldind_u2 = (ushort)73,
-   Ldind_u4 = (ushort)75,
-   Ldlen = (ushort)142,
-   Ldloc = (ushort)65036,
-   Ldloc_0 = (ushort)6,
-   Ldloc_1 = (ushort)7,
-   Ldloc_2 = (ushort)8,
-   Ldloc_3 = (ushort)9,
-   Ldloc_s = (ushort)17,
-   Ldloca = (ushort)65037,
-   Ldloca_s = (ushort)18,
-   Ldnull = (ushort)20,
-   Ldobj = (ushort)113,
-   Ldsfld = (ushort)126,
-   Ldsflda = (ushort)127,
-   Ldstr = (ushort)114,
-   Ldtoken = (ushort)208,
-   Ldvirtftn = (ushort)65031,
-   Leave = (ushort)221,
-   Leave_s = (ushort)222,
-   Localloc = (ushort)65039,
-   Mkrefany = (ushort)198,
-   Mul = (ushort)90,
-   Mul_ovf = (ushort)216,
-   Mul_ovf_un = (ushort)217,
-   Neg = (ushort)101,
-   Newarr = (ushort)141,
-   Newobj = (ushort)115,
-   Nop = (ushort)0,
-   Not = (ushort)102,
-   Or = (ushort)96,
-   Pop = (ushort)38,
-   Readonly = (ushort)65054,
-   Refanytype = (ushort)65053,
-   Refanyval = (ushort)194,
-   Rem = (ushort)93,
-   Rem_un = (ushort)94,
-   Ret = (ushort)42,
-   Rethrow = (ushort)65050,
-   Shl = (ushort)98,
-   Shr = (ushort)99,
-   Shr_un = (ushort)100,
-   Sizeof = (ushort)65052,
-   Starg = (ushort)65035,
-   Starg_s = (ushort)16,
-   Stelem = (ushort)164,
-   Stelem_i = (ushort)155,
-   Stelem_i1 = (ushort)156,
-   Stelem_i2 = (ushort)157,
-   Stelem_i4 = (ushort)158,
-   Stelem_i8 = (ushort)159,
-   Stelem_r4 = (ushort)160,
-   Stelem_r8 = (ushort)161,
-   Stelem_ref = (ushort)162,
-   Stfld = (ushort)125,
-   Stind_i = (ushort)223,
-   Stind_i1 = (ushort)82,
-   Stind_i2 = (ushort)83,
-   Stind_i4 = (ushort)84,
-   Stind_i8 = (ushort)85,
-   Stind_r4 = (ushort)86,
-   Stind_r8 = (ushort)87,
-   Stind_ref = (ushort)81,
-   Stloc = (ushort)65038,
-   Stloc_0 = (ushort)10,
-   Stloc_1 = (ushort)11,
-   Stloc_2 = (ushort)12,
-   Stloc_3 = (ushort)13,
-   Stloc_s = (ushort)19,
-   Stobj = (ushort)129,
-   Stsfld = (ushort)128,
-   Sub = (ushort)89,
-   Sub_ovf = (ushort)218,
-   Sub_ovf_un = (ushort)219,
-   Switch = (ushort)69,
-   Tail = (ushort)65044,
-   Throw = (ushort)122,
-   Unaligned = (ushort)65042,
-   Unbox = (ushort)121,
-   Unbox_any = (ushort)165,
-   Volatile = (ushort)65043,
-   Xor = (ushort)97,
  }
- public static class ILOpCodeExtensions {
-   public static int GetBranchOperandSize(this ILOpCode opCode);
-   public static ILOpCode GetLongBranch(this ILOpCode opCode);
-   public static ILOpCode GetShortBranch(this ILOpCode opCode);
-   public static bool IsBranch(this ILOpCode opCode);
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct MemberReference {
-   public TType DecodeFieldSignature<TType>(ISignatureTypeProvider<TType> provider, SignatureDecoderOptions options=(SignatureDecoderOptions)(0));
-   public MethodSignature<TType> DecodeMethodSignature<TType>(ISignatureTypeProvider<TType> provider, SignatureDecoderOptions options=(SignatureDecoderOptions)(0));
  }
+ public sealed class MetadataReaderProvider : IDisposable {
+   public void Dispose();
+   public unsafe static MetadataReaderProvider FromMetadataImage(byte* start, int size);
+   public static MetadataReaderProvider FromMetadataImage(ImmutableArray<byte> image);
+   public static MetadataReaderProvider FromMetadataStream(Stream stream, MetadataStreamOptions options=(MetadataStreamOptions)(0), int size=0);
+   public unsafe static MetadataReaderProvider FromPortablePdbImage(byte* start, int size);
+   public static MetadataReaderProvider FromPortablePdbImage(ImmutableArray<byte> image);
+   public static MetadataReaderProvider FromPortablePdbStream(Stream stream, MetadataStreamOptions options=(MetadataStreamOptions)(0), int size=0);
+   public MetadataReader GetMetadataReader(MetadataReaderOptions options=(MetadataReaderOptions)(1), MetadataStringDecoder utf8Decoder=null);
  }
+ public enum MetadataStreamOptions {
+   Default = 0,
+   LeaveOpen = 1,
+   PrefetchMetadata = 2,
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct MethodDefinition {
-   public MethodSignature<TType> DecodeSignature<TType>(ISignatureTypeProvider<TType> provider, SignatureDecoderOptions options=(SignatureDecoderOptions)(0));
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct MethodSpecification {
-   public ImmutableArray<TType> DecodeSignature<TType>(ISignatureTypeProvider<TType> provider, SignatureDecoderOptions options=(SignatureDecoderOptions)(0));
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct PropertyDefinition {
-   public MethodSignature<TType> DecodeSignature<TType>(ISignatureTypeProvider<TType> provider, SignatureDecoderOptions options=(SignatureDecoderOptions)(0));
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct StandaloneSignature {
-   public ImmutableArray<TType> DecodeLocalSignature<TType>(ISignatureTypeProvider<TType> provider, SignatureDecoderOptions options=(SignatureDecoderOptions)(0));
-   public MethodSignature<TType> DecodeMethodSignature<TType>(ISignatureTypeProvider<TType> provider, SignatureDecoderOptions options=(SignatureDecoderOptions)(0));
  }
  [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct TypeSpecification {
-   public TType DecodeSignature<TType>(ISignatureTypeProvider<TType> provider, SignatureDecoderOptions options=(SignatureDecoderOptions)(0));
  }
 }
```

## System.Reflection.Metadata.Decoding

```c#

-namespace System.Reflection.Metadata.Decoding {
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ArrayShape {
-   public ArrayShape(int rank, ImmutableArray<int> sizes, ImmutableArray<int> lowerBounds);
-   public ImmutableArray<int> LowerBounds { get; }
-   public int Rank { get; }
-   public ImmutableArray<int> Sizes { get; }
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct CustomAttributeNamedArgument<TType> {
-   public CustomAttributeNamedArgument(string name, CustomAttributeNamedArgumentKind kind, TType type, object value);
-   public CustomAttributeNamedArgumentKind Kind { get; }
-   public string Name { get; }
-   public TType Type { get; }
-   public object Value { get; }
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct CustomAttributeTypedArgument<TType> {
-   public CustomAttributeTypedArgument(TType type, object value);
-   public TType Type { get; }
-   public object Value { get; }
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct CustomAttributeValue<TType> {
-   public CustomAttributeValue(ImmutableArray<CustomAttributeTypedArgument<TType>> fixedArguments, ImmutableArray<CustomAttributeNamedArgument<TType>> namedArguments);
-   public ImmutableArray<CustomAttributeTypedArgument<TType>> FixedArguments { get; }
-   public ImmutableArray<CustomAttributeNamedArgument<TType>> NamedArguments { get; }
  }
- public interface IConstructedTypeProvider<TType> : ISZArrayTypeProvider<TType> {
-   TType GetArrayType(TType elementType, ArrayShape shape);
-   TType GetByReferenceType(TType elementType);
-   TType GetGenericInstance(TType genericType, ImmutableArray<TType> typeArguments);
-   TType GetPointerType(TType elementType);
  }
- public interface ICustomAttributeTypeProvider<TType> : IPrimitiveTypeProvider<TType>, ISZArrayTypeProvider<TType>, ITypeProvider<TType> {
-   TType GetSystemType();
-   TType GetTypeFromSerializedName(string name);
-   PrimitiveTypeCode GetUnderlyingEnumType(TType type);
-   bool IsSystemType(TType type);
  }
- public interface IPrimitiveTypeProvider<TType> {
-   TType GetPrimitiveType(PrimitiveTypeCode typeCode);
  }
- public interface ISignatureTypeProvider<TType> : IConstructedTypeProvider<TType>, IPrimitiveTypeProvider<TType>, ISZArrayTypeProvider<TType>, ITypeProvider<TType> {
-   TType GetFunctionPointerType(MethodSignature<TType> signature);
-   TType GetGenericMethodParameter(int index);
-   TType GetGenericTypeParameter(int index);
-   TType GetModifiedType(MetadataReader reader, bool isRequired, TType modifier, TType unmodifiedType);
-   TType GetPinnedType(TType elementType);
  }
- public interface ISZArrayTypeProvider<TType> {
-   TType GetSZArrayType(TType elementType);
  }
- public interface ITypeProvider<TType> {
-   TType GetTypeFromDefinition(MetadataReader reader, TypeDefinitionHandle handle, SignatureTypeHandleCode code);
-   TType GetTypeFromReference(MetadataReader reader, TypeReferenceHandle handle, SignatureTypeHandleCode code);
-   TType GetTypeFromSpecification(MetadataReader reader, TypeSpecificationHandle handle, SignatureTypeHandleCode code);
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct MethodSignature<TType> {
-   public MethodSignature(SignatureHeader header, TType returnType, int requiredParameterCount, int genericParameterCount, ImmutableArray<TType> parameterTypes);
-   public int GenericParameterCount { get; }
-   public SignatureHeader Header { get; }
-   public ImmutableArray<TType> ParameterTypes { get; }
-   public int RequiredParameterCount { get; }
-   public TType ReturnType { get; }
  }
- public enum PrimitiveTypeCode : byte {
-   Boolean = (byte)2,
-   Byte = (byte)5,
-   Char = (byte)3,
-   Double = (byte)13,
-   Int16 = (byte)6,
-   Int32 = (byte)8,
-   Int64 = (byte)10,
-   IntPtr = (byte)24,
-   Object = (byte)28,
-   SByte = (byte)4,
-   Single = (byte)12,
-   String = (byte)14,
-   TypedReference = (byte)22,
-   UInt16 = (byte)7,
-   UInt32 = (byte)9,
-   UInt64 = (byte)11,
-   UIntPtr = (byte)25,
-   Void = (byte)1,
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct SignatureDecoder<TType> {
-   public SignatureDecoder(ISignatureTypeProvider<TType> provider, MetadataReader metadataReader=null, SignatureDecoderOptions options=(SignatureDecoderOptions)(0));
-   public TType DecodeFieldSignature(ref BlobReader blobReader);
-   public ImmutableArray<TType> DecodeLocalSignature(ref BlobReader blobReader);
-   public MethodSignature<TType> DecodeMethodSignature(ref BlobReader blobReader);
-   public ImmutableArray<TType> DecodeMethodSpecificationSignature(ref BlobReader blobReader);
-   public TType DecodeType(ref BlobReader blobReader, bool allowTypeSpecifications=false);
  }
- public enum SignatureDecoderOptions {
-   DifferentiateClassAndValueTypes = 1,
-   None = 0,
  }
- public enum SignatureTypeHandleCode : byte {
-   Class = (byte)18,
-   Unresolved = (byte)0,
-   ValueType = (byte)17,
  }
 }
```

## System.Reflection.Metadata.Ecma335

```c#

 namespace System.Reflection.Metadata.Ecma335 {
- public static class CodedIndex {
-   public static int ToCustomAttributeType(EntityHandle handle);
-   public static int ToHasConstant(EntityHandle handle);
-   public static int ToHasCustomAttribute(EntityHandle handle);
-   public static int ToHasCustomDebugInformation(EntityHandle handle);
-   public static int ToHasDeclSecurity(EntityHandle handle);
-   public static int ToHasFieldMarshal(EntityHandle handle);
-   public static int ToHasSemantics(EntityHandle handle);
-   public static int ToImplementation(EntityHandle handle);
-   public static int ToMemberForwarded(EntityHandle handle);
-   public static int ToMemberRefParent(EntityHandle handle);
-   public static int ToMethodDefOrRef(EntityHandle handle);
-   public static int ToResolutionScope(EntityHandle handle);
-   public static int ToTypeDefOrRefOrSpec(EntityHandle handle);
-   public static int ToTypeOrMethodDef(EntityHandle handle);
  }
- public sealed class MetadataBuilder {
-   public MetadataBuilder(int userStringHeapStartOffset=0, int stringHeapStartOffset=0, int blobHeapStartOffset=0, int guidHeapStartOffset=0);
-   public AssemblyDefinitionHandle AddAssembly(StringHandle name, Version version, StringHandle culture, BlobHandle publicKey, AssemblyFlags flags, AssemblyHashAlgorithm hashAlgorithm);
-   public AssemblyFileHandle AddAssemblyFile(StringHandle name, BlobHandle hashValue, bool containsMetadata);
-   public AssemblyReferenceHandle AddAssemblyReference(StringHandle name, Version version, StringHandle culture, BlobHandle publicKeyOrToken, AssemblyFlags flags, BlobHandle hashValue);
-   public ConstantHandle AddConstant(EntityHandle parent, object value);
-   public CustomAttributeHandle AddCustomAttribute(EntityHandle parent, EntityHandle constructor, BlobHandle value);
-   public CustomDebugInformationHandle AddCustomDebugInformation(EntityHandle parent, GuidHandle kind, BlobHandle value);
-   public DeclarativeSecurityAttributeHandle AddDeclarativeSecurityAttribute(EntityHandle parent, DeclarativeSecurityAction action, BlobHandle permissionSet);
-   public DocumentHandle AddDocument(BlobHandle name, GuidHandle hashAlgorithm, BlobHandle hash, GuidHandle language);
-   public void AddEncLogEntry(EntityHandle entity, EditAndContinueOperation code);
-   public void AddEncMapEntry(EntityHandle entity);
-   public EventDefinitionHandle AddEvent(EventAttributes attributes, StringHandle name, EntityHandle type);
-   public void AddEventMap(TypeDefinitionHandle declaringType, EventDefinitionHandle eventList);
-   public ExportedTypeHandle AddExportedType(TypeAttributes attributes, StringHandle @namespace, StringHandle name, EntityHandle implementation, int typeDefinitionId);
-   public FieldDefinitionHandle AddFieldDefinition(FieldAttributes attributes, StringHandle name, BlobHandle signature);
-   public void AddFieldLayout(FieldDefinitionHandle field, int offset);
-   public void AddFieldRelativeVirtualAddress(FieldDefinitionHandle field, int relativeVirtualAddress);
-   public GenericParameterHandle AddGenericParameter(EntityHandle parent, GenericParameterAttributes attributes, StringHandle name, int index);
-   public GenericParameterConstraintHandle AddGenericParameterConstraint(GenericParameterHandle genericParameter, EntityHandle constraint);
-   public ImportScopeHandle AddImportScope(ImportScopeHandle parentScope, BlobHandle imports);
-   public InterfaceImplementationHandle AddInterfaceImplementation(TypeDefinitionHandle type, EntityHandle implementedInterface);
-   public LocalConstantHandle AddLocalConstant(StringHandle name, BlobHandle signature);
-   public LocalScopeHandle AddLocalScope(MethodDefinitionHandle method, ImportScopeHandle importScope, LocalVariableHandle variableList, LocalConstantHandle constantList, int startOffset, int length);
-   public LocalVariableHandle AddLocalVariable(LocalVariableAttributes attributes, int index, StringHandle name);
-   public ManifestResourceHandle AddManifestResource(ManifestResourceAttributes attributes, StringHandle name, EntityHandle implementation, long offset);
-   public void AddMarshallingDescriptor(EntityHandle parent, BlobHandle descriptor);
-   public MemberReferenceHandle AddMemberReference(EntityHandle parent, StringHandle name, BlobHandle signature);
-   public MethodDebugInformationHandle AddMethodDebugInformation(DocumentHandle document, BlobHandle sequencePoints);
-   public MethodDefinitionHandle AddMethodDefinition(MethodAttributes attributes, MethodImplAttributes implAttributes, StringHandle name, BlobHandle signature, int bodyOffset, ParameterHandle paramList);
-   public MethodImplementationHandle AddMethodImplementation(TypeDefinitionHandle type, EntityHandle methodBody, EntityHandle methodDeclaration);
-   public void AddMethodImport(EntityHandle member, MethodImportAttributes attributes, StringHandle name, ModuleReferenceHandle module);
-   public void AddMethodSemantics(EntityHandle association, ushort semantics, MethodDefinitionHandle methodDefinition);
-   public MethodSpecificationHandle AddMethodSpecification(EntityHandle method, BlobHandle instantiation);
-   public ModuleDefinitionHandle AddModule(int generation, StringHandle moduleName, GuidHandle mvid, GuidHandle encId, GuidHandle encBaseId);
-   public ModuleReferenceHandle AddModuleReference(StringHandle moduleName);
-   public void AddNestedType(TypeDefinitionHandle type, TypeDefinitionHandle enclosingType);
-   public ParameterHandle AddParameter(ParameterAttributes attributes, StringHandle name, int sequenceNumber);
-   public PropertyDefinitionHandle AddProperty(PropertyAttributes attributes, StringHandle name, BlobHandle signature);
-   public void AddPropertyMap(TypeDefinitionHandle declaringType, PropertyDefinitionHandle propertyList);
-   public StandaloneSignatureHandle AddStandaloneSignature(BlobHandle signature);
-   public void AddStateMachineMethod(MethodDefinitionHandle moveNextMethod, MethodDefinitionHandle kickoffMethod);
-   public TypeDefinitionHandle AddTypeDefinition(TypeAttributes attributes, StringHandle @namespace, StringHandle name, EntityHandle baseType, FieldDefinitionHandle fieldList, MethodDefinitionHandle methodList);
-   public void AddTypeLayout(TypeDefinitionHandle type, ushort packingSize, uint size);
-   public TypeReferenceHandle AddTypeReference(EntityHandle resolutionScope, StringHandle @namespace, StringHandle name);
-   public TypeSpecificationHandle AddTypeSpecification(BlobHandle signature);
-   public BlobHandle GetBlob(ImmutableArray<byte> blob);
-   public BlobHandle GetBlob(BlobBuilder builder);
-   public BlobHandle GetBlob(string str);
-   public BlobHandle GetBlobUtf8(string str);
-   public BlobHandle GetConstantBlob(object value);
-   public uint GetExportedTypeFlags(int rowId);
-   public GuidHandle GetGuid(Guid guid);
-   public int GetHeapOffset(BlobHandle handle);
-   public int GetHeapOffset(GuidHandle handle);
-   public int GetHeapOffset(StringHandle handle);
-   public int GetHeapOffset(UserStringHandle handle);
-   public ImmutableArray<int> GetHeapSizes();
-   public ImmutableArray<int> GetRowCounts();
-   public StringHandle GetString(string str);
-   public UserStringHandle GetUserString(string str);
-   public GuidHandle ReserveGuid(out Blob reservedBlob);
-   public void SetCapacity(TableIndex table, int capacity);
-   public void WriteHeapsTo(BlobBuilder writer);
  }
- public abstract class MetadataSerializer {
-   protected readonly MetadataBuilder _tables;
-   public MetadataSerializer(MetadataBuilder tables, MetadataSizes sizes, string metadataVersion);
-   public MetadataSizes MetadataSizes { get; }
-   protected void SerializeMetadataImpl(BlobBuilder metadataWriter, int methodBodyStreamRva, int mappedFieldDataStreamRva);
-   protected abstract void SerializeStandalonePdbStream(BlobBuilder writer);
  }
- public sealed class MetadataSizes {
-   public readonly bool IsMinimalDelta;
-   public readonly byte BlobIndexSize;
-   public readonly byte CustomAttributeTypeCodedIndexSize;
-   public readonly byte DeclSecurityCodedIndexSize;
-   public readonly byte DocumentIndexSize;
-   public readonly byte EventDefIndexSize;
-   public readonly byte FieldDefIndexSize;
-   public readonly byte GenericParamIndexSize;
-   public readonly byte GuidIndexSize;
-   public readonly byte HasConstantCodedIndexSize;
-   public readonly byte HasCustomAttributeCodedIndexSize;
-   public readonly byte HasCustomDebugInformationSize;
-   public readonly byte HasFieldMarshalCodedIndexSize;
-   public readonly byte HasSemanticsCodedIndexSize;
-   public readonly byte ImplementationCodedIndexSize;
-   public readonly byte ImportScopeIndexSize;
-   public readonly byte LocalConstantIndexSize;
-   public readonly byte LocalVariableIndexSize;
-   public readonly byte MemberForwardedCodedIndexSize;
-   public readonly byte MemberRefParentCodedIndexSize;
-   public readonly byte MethodDefIndexSize;
-   public readonly byte MethodDefOrRefCodedIndexSize;
-   public readonly byte ModuleRefIndexSize;
-   public readonly byte ParameterIndexSize;
-   public readonly byte PropertyDefIndexSize;
-   public readonly byte ResolutionScopeCodedIndexSize;
-   public readonly byte StringIndexSize;
-   public readonly byte TypeDefIndexSize;
-   public readonly byte TypeDefOrRefCodedIndexSize;
-   public readonly byte TypeOrMethodDefCodedIndexSize;
-   public readonly ImmutableArray<int> ExternalRowCounts;
-   public readonly ImmutableArray<int> HeapSizes;
-   public readonly ImmutableArray<int> RowCounts;
-   public readonly int MetadataStreamStorageSize;
-   public readonly int MetadataTableStreamSize;
-   public const int MetadataVersionPaddedLength = 12;
-   public readonly int StandalonePdbStreamSize;
-   public const ulong DebugMetadataTablesMask = (ulong)71776119061217280;
-   public readonly ulong ExternalTablesMask;
-   public readonly ulong PresentTablesMask;
-   public const ulong SortedDebugTables = (ulong)55169095435288576;
-   public MetadataSizes(ImmutableArray<int> rowCounts, ImmutableArray<int> externalRowCounts, ImmutableArray<int> heapSizes, bool isMinimalDelta, bool isStandaloneDebugMetadata);
-   public bool IsMetadataTableStreamCompressed { get; }
-   public bool IsStandaloneDebugMetadata { get; }
-   public int MetadataHeaderSize { get; }
-   public int MetadataSize { get; }
-   public int GetAlignedHeapSize(HeapIndex index);
-   public static int GetMetadataStreamHeaderSize(string streamName);
-   public bool IsPresent(TableIndex table);
  }
- public sealed class StandaloneDebugMetadataSerializer : MetadataSerializer {
-   public StandaloneDebugMetadataSerializer(MetadataBuilder builder, ImmutableArray<int> typeSystemRowCounts, MethodDefinitionHandle entryPoint, bool isMinimalDelta);
-   public void SerializeMetadata(BlobBuilder builder, Func<BlobBuilder, ContentId> idProvider, out ContentId contentId);
-   protected override void SerializeStandalonePdbStream(BlobBuilder builder);
  }
- public sealed class TypeSystemMetadataSerializer : MetadataSerializer {
-   public TypeSystemMetadataSerializer(MetadataBuilder tables, string metadataVersion, bool isMinimalDelta);
-   public void SerializeMetadata(BlobBuilder metadataWriter, int methodBodyStreamRva, int mappedFieldDataStreamRva);
-   protected override void SerializeStandalonePdbStream(BlobBuilder writer);
  }
 }
```

## System.Reflection.Metadata.Ecma335.Blobs

```c#

-namespace System.Reflection.Metadata.Ecma335.Blobs {
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ArrayShapeEncoder {
-   public ArrayShapeEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public void Shape(int rank, ImmutableArray<int> sizes, ImmutableArray<int> lowerBounds);
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct BlobEncoder {
-   public BlobEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public void CustomAttributeSignature(out FixedArgumentsEncoder fixedArguments, out CustomAttributeNamedArgumentsEncoder namedArguments);
-   public SignatureTypeEncoder FieldSignature();
-   public LocalVariablesEncoder LocalVariableSignature(int count);
-   public MethodSignatureEncoder MethodSignature(SignatureCallingConvention convention=(SignatureCallingConvention)(0), int genericParameterCount=0, bool isInstanceMethod=false);
-   public GenericTypeArgumentsEncoder MethodSpecificationSignature(int genericArgumentCount);
-   public NamedArgumentsEncoder PermissionSetArguments(int argumentCount);
-   public PermissionSetEncoder PermissionSetBlob(int attributeCount);
-   public MethodSignatureEncoder PropertySignature(bool isInstanceProperty=false);
-   public SignatureTypeEncoder TypeSpecificationSignature();
  }
- public sealed class BranchBuilder {
-   public BranchBuilder();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct CustomAttributeArrayTypeEncoder {
-   public CustomAttributeArrayTypeEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public CustomAttributeElementTypeEncoder ElementType();
-   public void ObjectArray();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct CustomAttributeElementTypeEncoder {
-   public CustomAttributeElementTypeEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public void Boolean();
-   public void Char();
-   public void Enum(string enumTypeName);
-   public void Float32();
-   public void Float64();
-   public void Int16();
-   public void Int32();
-   public void Int64();
-   public void Int8();
-   public void IntPtr();
-   public void String();
-   public void SystemType();
-   public void UInt16();
-   public void UInt32();
-   public void UInt64();
-   public void UInt8();
-   public void UIntPtr();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct CustomAttributeNamedArgumentsEncoder {
-   public CustomAttributeNamedArgumentsEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public NamedArgumentsEncoder Count(int count);
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct CustomModifiersEncoder {
-   public CustomModifiersEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public CustomModifiersEncoder AddModifier(bool isOptional, EntityHandle typeDefRefSpec);
-   public void EndModifiers();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ExceptionRegionEncoder {
-   public BlobBuilder Builder { get; }
-   public void AddCatch(int tryOffset, int tryLength, int handlerOffset, int handlerLength, EntityHandle catchType);
-   public void AddFault(int tryOffset, int tryLength, int handlerOffset, int handlerLength);
-   public void AddFilter(int tryOffset, int tryLength, int handlerOffset, int handlerLength, int filterOffset);
-   public void AddFinally(int tryOffset, int tryLength, int handlerOffset, int handlerLength);
-   public void AddRegion(ExceptionRegionKind kind, int tryOffset, int tryLength, int handlerOffset, int handlerLength, EntityHandle catchType, int filterOffset);
-   public void EndRegions();
-   public static bool IsSmallExceptionRegion(int startOffset, int length);
-   public static bool IsSmallRegionCount(int exceptionRegionCount);
-   public void StartRegions();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct FixedArgumentsEncoder {
-   public FixedArgumentsEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public LiteralEncoder AddArgument();
-   public void EndArguments();
  }
- public enum FunctionPointerAttributes {
-   HasExplicitThis = 96,
-   HasThis = 32,
-   None = 0,
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct GenericTypeArgumentsEncoder {
-   public GenericTypeArgumentsEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public SignatureTypeEncoder AddArgument();
-   public void EndArguments();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct InstructionEncoder {
-   public InstructionEncoder(BlobBuilder builder, BranchBuilder branchBuilder=null);
-   public BlobBuilder Builder { get; }
-   public int Offset { get; }
-   public void Branch(ILOpCode code, LabelHandle label);
-   public void Call(EntityHandle methodHandle);
-   public void CallIndirect(StandaloneSignatureHandle signature);
-   public LabelHandle DefineLabel();
-   public void LoadArgument(int argumentIndex);
-   public void LoadArgumentAddress(int argumentIndex);
-   public void LoadConstantI4(int value);
-   public void LoadConstantI8(long value);
-   public void LoadConstantR4(float value);
-   public void LoadConstantR8(double value);
-   public void LoadLocal(int slotIndex);
-   public void LoadLocalAddress(int slotIndex);
-   public void LoadString(UserStringHandle handle);
-   public void LongBranchTarget(int ilOffset);
-   public void MarkLabel(LabelHandle label);
-   public void OpCode(ILOpCode code);
-   public void ShortBranchTarget(byte ilOffset);
-   public void StoreArgument(int argumentIndex);
-   public void StoreLocal(int slotIndex);
-   public void Token(int token);
-   public void Token(EntityHandle handle);
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct LabelHandle : IEquatable<LabelHandle> {
-   public bool IsNil { get; }
-   public override bool Equals(object obj);
-   public bool Equals(LabelHandle other);
-   public override int GetHashCode();
-   public static bool operator ==(LabelHandle left, LabelHandle right);
-   public static bool operator !=(LabelHandle left, LabelHandle right);
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct LiteralEncoder {
-   public LiteralEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public ScalarEncoder Scalar();
-   public void TaggedScalar(out CustomAttributeElementTypeEncoder type, out ScalarEncoder scalar);
-   public void TaggedVector(out CustomAttributeArrayTypeEncoder arrayType, out VectorEncoder vector);
-   public VectorEncoder Vector();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct LiteralsEncoder {
-   public LiteralsEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public LiteralEncoder AddLiteral();
-   public void EndLiterals();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct LocalVariablesEncoder {
-   public LocalVariablesEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public LocalVariableTypeEncoder AddVariable();
-   public void EndVariables();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct LocalVariableTypeEncoder {
-   public LocalVariableTypeEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public CustomModifiersEncoder CustomModifiers();
-   public SignatureTypeEncoder Type(bool isByRef=false, bool isPinned=false);
-   public void TypedReference();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct MethodBodiesEncoder {
-   public MethodBodiesEncoder(BlobBuilder builder=null);
-   public BlobBuilder Builder { get; }
-   public MethodBodyEncoder AddMethodBody(int maxStack=8, int exceptionRegionCount=0, StandaloneSignatureHandle localVariablesSignature=null, MethodBodyAttributes attributes=(MethodBodyAttributes)(1));
  }
- public enum MethodBodyAttributes {
-   InitLocals = 1,
-   LargeExceptionRegions = 2,
-   None = 0,
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct MethodBodyEncoder {
-   public BlobBuilder Builder { get; }
-   public ExceptionRegionEncoder WriteInstructions(ImmutableArray<byte> instructions, out int bodyOffset);
-   public ExceptionRegionEncoder WriteInstructions(ImmutableArray<byte> instructions, out int bodyOffset, out Blob instructionBlob);
-   public ExceptionRegionEncoder WriteInstructions(BlobBuilder codeBuilder, out int bodyOffset);
-   public ExceptionRegionEncoder WriteInstructions(BlobBuilder codeBuilder, BranchBuilder branchBuilder, out int bodyOffset);
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct MethodSignatureEncoder {
-   public MethodSignatureEncoder(BlobBuilder builder, bool isVarArg);
-   public BlobBuilder Builder { get; }
-   public void Parameters(int parameterCount, out ReturnTypeEncoder returnType, out ParametersEncoder parameters);
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct NamedArgumentsEncoder {
-   public NamedArgumentsEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public void AddArgument(bool isField, out NamedArgumentTypeEncoder typeEncoder, out NameEncoder name, out LiteralEncoder literal);
-   public void EndArguments();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct NamedArgumentTypeEncoder {
-   public NamedArgumentTypeEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public void Object();
-   public CustomAttributeElementTypeEncoder ScalarType();
-   public CustomAttributeArrayTypeEncoder SZArray();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct NameEncoder {
-   public NameEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public void Name(string name);
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ParametersEncoder {
-   public ParametersEncoder(BlobBuilder builder, bool allowVarArgs);
-   public BlobBuilder Builder { get; }
-   public ParameterTypeEncoder AddParameter();
-   public void EndParameters();
-   public ParametersEncoder StartVarArgs();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ParameterTypeEncoder {
-   public ParameterTypeEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public CustomModifiersEncoder CustomModifiers();
-   public SignatureTypeEncoder Type(bool isByRef=false);
-   public void TypedReference();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct PermissionSetEncoder {
-   public PermissionSetEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public PermissionSetEncoder AddPermission(string typeName, BlobBuilder arguments);
-   public void EndPermissions();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ReturnTypeEncoder {
-   public ReturnTypeEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public CustomModifiersEncoder CustomModifiers();
-   public SignatureTypeEncoder Type(bool isByRef=false);
-   public void TypedReference();
-   public void Void();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ScalarEncoder {
-   public ScalarEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public void Constant(object value);
-   public void NullArray();
-   public void SystemType(string serializedTypeName);
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct SignatureTypeEncoder {
-   public SignatureTypeEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public void Array(out SignatureTypeEncoder elementType, out ArrayShapeEncoder arrayShape);
-   public void Boolean();
-   public void Char();
-   public CustomModifiersEncoder CustomModifiers();
-   public void Float32();
-   public void Float64();
-   public MethodSignatureEncoder FunctionPointer(SignatureCallingConvention convention, FunctionPointerAttributes attributes, int genericParameterCount);
-   public GenericTypeArgumentsEncoder GenericInstantiation(bool isValueType, EntityHandle typeRefDefSpec, int genericArgumentCount);
-   public void GenericMethodTypeParameter(int parameterIndex);
-   public void GenericTypeParameter(int parameterIndex);
-   public void Int16();
-   public void Int32();
-   public void Int64();
-   public void Int8();
-   public void IntPtr();
-   public void Object();
-   public SignatureTypeEncoder Pointer();
-   public void String();
-   public SignatureTypeEncoder SZArray();
-   public void TypeDefOrRefOrSpec(bool isValueType, EntityHandle typeRefDefSpec);
-   public void UInt16();
-   public void UInt32();
-   public void UInt64();
-   public void UInt8();
-   public void UIntPtr();
-   public void VoidPointer();
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct VectorEncoder {
-   public VectorEncoder(BlobBuilder builder);
-   public BlobBuilder Builder { get; }
-   public LiteralsEncoder Count(int count);
  }
 }
```

## System.Reflection.PortableExecutable

```c#

 namespace System.Reflection.PortableExecutable {
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ContentId {
-   public readonly byte[] Guid;
-   public readonly byte[] Stamp;
-   public const int Size = 20;
-   public ContentId(byte[] guid, byte[] stamp);
-   public ContentId(Guid guid, int stamp);
-   public bool IsDefault { get; }
  }
- public static class ManagedPEBuilder {
-   public static void AddManagedSections(this PEBuilder peBuilder, PEDirectoriesBuilder peDirectoriesBuilder, TypeSystemMetadataSerializer metadataSerializer, BlobBuilder ilStream, BlobBuilder mappedFieldData, BlobBuilder managedResourceData, Action<BlobBuilder, PESectionLocation> nativeResourceSectionSerializer, int strongNameSignatureSize, MethodDefinitionHandle entryPoint, string pdbPathOpt, ContentId nativePdbContentId, ContentId portablePdbContentId, CorFlags corFlags);
  }
- public sealed class ManagedTextSection {
-   public const int ManagedResourcesDataAlignment = 8;
-   public const int MappedFieldDataAlignment = 8;
-   public ManagedTextSection(int metadataSize, int ilStreamSize, int mappedFieldDataSize, int resourceDataSize, int strongNameSignatureSize, Characteristics imageCharacteristics, Machine machine, string pdbPathOpt, bool isDeterministic);
-   public int ILStreamSize { get; }
-   public Characteristics ImageCharacteristics { get; }
-   public bool Is32Bit { get; }
-   public bool IsDeterministic { get; }
-   public Machine Machine { get; }
-   public int MappedFieldDataSize { get; }
-   public int MetadataSize { get; }
-   public int OffsetToILStream { get; }
-   public string PdbPathOpt { get; }
-   public int ResourceDataSize { get; }
-   public int StrongNameSignatureSize { get; }
-   public int CalculateOffsetToMappedFieldDataStream();
-   public int ComputeSizeOfTextSection();
-   public DirectoryEntry GetCorHeaderDirectoryEntry(int rva);
-   public DirectoryEntry GetDebugDirectoryEntry(int rva);
-   public int GetEntryPointAddress(int rva);
-   public DirectoryEntry GetImportAddressTableDirectoryEntry(int rva);
-   public DirectoryEntry GetImportTableDirectoryEntry(int rva);
-   public void Serialize(BlobBuilder builder, int relativeVirtualAddess, int entryPointTokenOrRelativeVirtualAddress, CorFlags corFlags, ulong baseAddress, BlobBuilder metadataBuilder, BlobBuilder ilBuilder, BlobBuilder mappedFieldDataBuilder, BlobBuilder resourceBuilder, BlobBuilder debugTableBuilderOpt);
  }
- public sealed class PEBuilder {
-   public PEBuilder(Machine machine, int sectionAlignment, int fileAlignment, ulong imageBase, byte majorLinkerVersion, byte minorLinkerVersion, ushort majorOperatingSystemVersion, ushort minorOperatingSystemVersion, ushort majorImageVersion, ushort minorImageVersion, ushort majorSubsystemVersion, ushort minorSubsystemVersion, Subsystem subsystem, DllCharacteristics dllCharacteristics, Characteristics imageCharacteristics, ulong sizeOfStackReserve, ulong sizeOfStackCommit, ulong sizeOfHeapReserve, ulong sizeOfHeapCommit, Func<BlobBuilder, ContentId> deterministicIdProvider=null);
-   public DllCharacteristics DllCharacteristics { get; }
-   public int FileAlignment { get; }
-   public Func<BlobBuilder, ContentId> IdProvider { get; }
-   public ulong ImageBase { get; }
-   public Characteristics ImageCharacteristics { get; set; }
-   public bool IsDeterministic { get; }
-   public Machine Machine { get; }
-   public ushort MajorImageVersion { get; }
-   public byte MajorLinkerVersion { get; }
-   public ushort MajorOperatingSystemVersion { get; }
-   public ushort MajorSubsystemVersion { get; }
-   public ushort MinorImageVersion { get; }
-   public byte MinorLinkerVersion { get; }
-   public ushort MinorOperatingSystemVersion { get; }
-   public ushort MinorSubsystemVersion { get; }
-   public int SectionAlignment { get; }
-   public ulong SizeOfHeapCommit { get; }
-   public ulong SizeOfHeapReserve { get; }
-   public ulong SizeOfStackCommit { get; }
-   public ulong SizeOfStackReserve { get; }
-   public Subsystem Subsystem { get; }
-   public void AddSection(string name, SectionCharacteristics characteristics, Func<PESectionLocation, BlobBuilder> builder);
-   public void Serialize(BlobBuilder builder, PEDirectoriesBuilder headers, out ContentId contentId);
  }
- public sealed class PEDirectoriesBuilder {
-   public PEDirectoriesBuilder();
-   public int AddressOfEntryPoint { get; set; }
-   public DirectoryEntry BaseRelocationTable { get; set; }
-   public DirectoryEntry BoundImportTable { get; set; }
-   public DirectoryEntry CertificateTable { get; set; }
-   public DirectoryEntry CopyrightTable { get; set; }
-   public DirectoryEntry CorHeaderTable { get; set; }
-   public DirectoryEntry DebugTable { get; set; }
-   public DirectoryEntry DelayImportTable { get; set; }
-   public DirectoryEntry ExceptionTable { get; set; }
-   public DirectoryEntry ExportTable { get; set; }
-   public DirectoryEntry GlobalPointerTable { get; set; }
-   public DirectoryEntry ImportAddressTable { get; set; }
-   public DirectoryEntry ImportTable { get; set; }
-   public DirectoryEntry LoadConfigTable { get; set; }
-   public DirectoryEntry ResourceTable { get; set; }
-   public DirectoryEntry ThreadLocalStorageTable { get; set; }
  }
- [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct PESectionLocation {
-   public PESectionLocation(int relativeVirtualAddress, int pointerToRawData);
-   public int PointerToRawData { get; }
-   public int RelativeVirtualAddress { get; }
  }
 }
```

## System.Runtime.CompilerServices

```c#
 namespace System.Runtime.CompilerServices {
+ public static class Unsafe {
+   [MethodImpl(AggressiveInlining)]public static T As<T>(object o) where T : class;
+   [MethodImpl(AggressiveInlining)]public unsafe static void* AsPointer<T>(ref T value);
+   [MethodImpl(AggressiveInlining)]public unsafe static T AsRef<T>(void* source);
+   [MethodImpl(AggressiveInlining)]public unsafe static void Copy<T>(void* destination, ref T source);
+   [MethodImpl(AggressiveInlining)]public unsafe static void Copy<T>(ref T destination, void* source);
+   [MethodImpl(AggressiveInlining)]public unsafe static void CopyBlock(void* destination, void* source, uint byteCount);
+   [MethodImpl(AggressiveInlining)]public unsafe static void InitBlock(void* startAddress, byte value, uint byteCount);
+   [MethodImpl(AggressiveInlining)]public unsafe static T Read<T>(void* source);
+   [MethodImpl(AggressiveInlining)]public static int SizeOf<T>();
+   [MethodImpl(AggressiveInlining)]public unsafe static void Write<T>(void* destination, T value);
  }
 }
```

## System.Runtime.InteropServices

```c#
 namespace System.Runtime.InteropServices {
- public static class PInvokeMarshal {
-   public static readonly int SystemDefaultCharSize;
-   public static readonly int SystemMaxDBCSCharSize;
-   public static IntPtr AllocateMemory(int sizeInBytes);
-   public static void DestroyStructure(IntPtr ptr, Type structureType);
-   public static void DestroyStructure<T>(IntPtr ptr);
-   public static void FreeMemory(IntPtr ptr);
-   public static Delegate GetDelegateForFunctionPointer(IntPtr ptr, Type delegateType);
-   public static TDelegate GetDelegateForFunctionPointer<TDelegate>(IntPtr ptr);
-   public static IntPtr GetFunctionPointerForDelegate(Delegate d);
-   public static IntPtr GetFunctionPointerForDelegate<TDelegate>(TDelegate d);
-   public static int GetLastError();
-   public static IntPtr OffsetOf(Type type, string fieldName);
-   public static IntPtr OffsetOf<T>(string fieldName);
-   public static string PtrToStringAnsi(IntPtr ptr);
-   public static string PtrToStringAnsi(IntPtr ptr, int len);
-   public static string PtrToStringUTF16(IntPtr ptr);
-   public static string PtrToStringUTF16(IntPtr ptr, int len);
-   public static void PtrToStructure(IntPtr ptr, object structure);
-   public static object PtrToStructure(IntPtr ptr, Type structureType);
-   public static T PtrToStructure<T>(IntPtr ptr);
-   public static void PtrToStructure<T>(IntPtr ptr, T structure);
-   public static IntPtr ReallocateMemory(IntPtr ptr, int sizeInBytes);
-   public static int SizeOf(object structure);
-   public static int SizeOf(Type type);
-   public static int SizeOf<T>();
-   public static IntPtr StringToAllocatedMemoryAnsi(string s);
-   public static IntPtr StringToAllocatedMemoryUTF16(string s);
-   public static void StructureToPtr(object structure, IntPtr ptr, bool fDeleteOld);
-   public static void StructureToPtr<T>(T structure, IntPtr ptr, bool fDeleteOld);
-   public static IntPtr UnsafeAddrOfPinnedArrayElement(Array arr, int index);
-   public static IntPtr UnsafeAddrOfPinnedArrayElement<T>(T[] arr, int index);
-   public static void ZeroFreeMemoryAnsi(IntPtr s);
-   public static void ZeroFreeMemoryUTF16(IntPtr s);
  }
 }
```

## System.Runtime.Loader

```c#
 namespace System.Runtime.Loader {
  public abstract class AssemblyLoadContext {
-   public static void InitializeDefaultContext(AssemblyLoadContext context);
  }
 }
```

## System.Security

```c#
 namespace System.Security {
+ public sealed class SecureString : IDisposable {
+   public SecureString();
+   public unsafe SecureString(char* value, int length);
+   public int Length { get; }
+   public void AppendChar(char c);
+   public void Clear();
+   public SecureString Copy();
+   public void Dispose();
+   public void InsertAt(int index, char c);
+   public bool IsReadOnly();
+   public void MakeReadOnly();
+   public void RemoveAt(int index);
+   public void SetAt(int index, char c);
  }
+ public static class SecureStringMarshal {
+   public static IntPtr SecureStringToCoTaskMemAnsi(SecureString s);
+   public static IntPtr SecureStringToCoTaskMemUnicode(SecureString s);
+   public static IntPtr SecureStringToGlobalAllocAnsi(SecureString s);
+   public static IntPtr SecureStringToGlobalAllocUnicode(SecureString s);
  }
 }
```

## System.Security.Authentication

```c#
 namespace System.Security.Authentication {
+ public class InvalidCredentialException : AuthenticationException {
+   public InvalidCredentialException();
+   public InvalidCredentialException(string message);
+   public InvalidCredentialException(string message, Exception innerException);
  }
 }
```

## System.Security.Cryptography

```c#
 namespace System.Security.Cryptography {
+ public sealed class AesCng : Aes {
+   public AesCng();
+   public AesCng(string keyName);
+   public AesCng(string keyName, CngProvider provider);
+   public AesCng(string keyName, CngProvider provider, CngKeyOpenOptions openOptions);
+   public override byte[] Key { get; set; }
+   public override int KeySize { get; set; }
+   public override ICryptoTransform CreateDecryptor();
+   public override ICryptoTransform CreateDecryptor(byte[] rgbKey, byte[] rgbIV);
+   public override ICryptoTransform CreateEncryptor();
+   public override ICryptoTransform CreateEncryptor(byte[] rgbKey, byte[] rgbIV);
+   protected override void Dispose(bool disposing);
+   public override void GenerateIV();
+   public override void GenerateKey();
  }
+ public sealed class AsnEncodedDataCollection : ICollection, IEnumerable {
+   public AsnEncodedDataCollection();
+   public AsnEncodedDataCollection(AsnEncodedData asnEncodedData);
+   public int Count { get; }
+   bool System.Collections.ICollection.IsSynchronized { get; }
+   object System.Collections.ICollection.SyncRoot { get; }
+   public AsnEncodedData this[int index] { get; }
+   public int Add(AsnEncodedData asnEncodedData);
+   public void CopyTo(AsnEncodedData[] array, int index);
+   public AsnEncodedDataEnumerator GetEnumerator();
+   public void Remove(AsnEncodedData asnEncodedData);
+   void System.Collections.ICollection.CopyTo(Array array, int index);
+   IEnumerator System.Collections.IEnumerable.GetEnumerator();
  }
+ public sealed class AsnEncodedDataEnumerator : IEnumerator {
+   public AsnEncodedData Current { get; }
+   object System.Collections.IEnumerator.Current { get; }
+   public bool MoveNext();
+   public void Reset();
  }
  public abstract class AsymmetricAlgorithm : IDisposable {
+   protected int KeySizeValue;
+   protected KeySizes[] LegalKeySizesValue;
  }
  public sealed class CngAlgorithm : IEquatable<CngAlgorithm> {
+   public static CngAlgorithm ECDiffieHellman { get; }
+   public static CngAlgorithm ECDsa { get; }
  }
  public sealed class CngKeyBlobFormat : IEquatable<CngKeyBlobFormat> {
+   public static CngKeyBlobFormat EccFullPrivateBlob { get; }
+   public static CngKeyBlobFormat EccFullPublicBlob { get; }
  }
+ public sealed class CryptographicAttributeObject {
+   public CryptographicAttributeObject(Oid oid);
+   public CryptographicAttributeObject(Oid oid, AsnEncodedDataCollection values);
+   public Oid Oid { get; }
+   public AsnEncodedDataCollection Values { get; }
  }
+ public sealed class CryptographicAttributeObjectCollection : ICollection, IEnumerable {
+   public CryptographicAttributeObjectCollection();
+   public CryptographicAttributeObjectCollection(CryptographicAttributeObject attribute);
+   public int Count { get; }
+   bool System.Collections.ICollection.IsSynchronized { get; }
+   object System.Collections.ICollection.SyncRoot { get; }
+   public CryptographicAttributeObject this[int index] { get; }
+   public int Add(AsnEncodedData asnEncodedData);
+   public int Add(CryptographicAttributeObject attribute);
+   public void CopyTo(CryptographicAttributeObject[] array, int index);
+   public CryptographicAttributeObjectEnumerator GetEnumerator();
+   public void Remove(CryptographicAttributeObject attribute);
+   void System.Collections.ICollection.CopyTo(Array array, int index);
+   IEnumerator System.Collections.IEnumerable.GetEnumerator();
  }
+ public sealed class CryptographicAttributeObjectEnumerator : IEnumerator {
+   public CryptographicAttributeObject Current { get; }
+   object System.Collections.IEnumerator.Current { get; }
+   public bool MoveNext();
+   public void Reset();
  }
+ public enum DataProtectionScope {
+   CurrentUser = 0,
+   LocalMachine = 1,
  }
+ [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ECCurve {
+   public ECCurve.ECCurveType CurveType;
+   public byte[] A;
+   public byte[] B;
+   public byte[] Cofactor;
+   public byte[] Order;
+   public byte[] Polynomial;
+   public byte[] Prime;
+   public byte[] Seed;
+   public Nullable<HashAlgorithmName> Hash;
+   public ECPoint G;
+   public bool IsCharacteristic2 { get; }
+   public bool IsExplicit { get; }
+   public bool IsNamed { get; }
+   public bool IsPrime { get; }
+   public Oid Oid { get; }
+   public static ECCurve CreateFromFriendlyName(string oidFriendlyName);
+   public static ECCurve CreateFromOid(Oid curveOid);
+   public static ECCurve CreateFromValue(string oidValue);
+   public void Validate();
+   public enum ECCurveType {
+     Characteristic2 = 4,
+     Implicit = 0,
+     Named = 5,
+     PrimeMontgomery = 3,
+     PrimeShortWeierstrass = 1,
+     PrimeTwistedEdwards = 2,
    }
+   public static class NamedCurves {
+     public static ECCurve brainpoolP160r1 { get; }
+     public static ECCurve brainpoolP160t1 { get; }
+     public static ECCurve brainpoolP192r1 { get; }
+     public static ECCurve brainpoolP192t1 { get; }
+     public static ECCurve brainpoolP224r1 { get; }
+     public static ECCurve brainpoolP224t1 { get; }
+     public static ECCurve brainpoolP256r1 { get; }
+     public static ECCurve brainpoolP256t1 { get; }
+     public static ECCurve brainpoolP320r1 { get; }
+     public static ECCurve brainpoolP320t1 { get; }
+     public static ECCurve brainpoolP384r1 { get; }
+     public static ECCurve brainpoolP384t1 { get; }
+     public static ECCurve brainpoolP512r1 { get; }
+     public static ECCurve brainpoolP512t1 { get; }
+     public static ECCurve nistP256 { get; }
+     public static ECCurve nistP384 { get; }
+     public static ECCurve nistP521 { get; }
    }
  }
  public abstract class ECDsa : AsymmetricAlgorithm {
+   public static ECDsa Create();
+   public static ECDsa Create(ECCurve curve);
+   public static ECDsa Create(ECParameters parameters);
+   public virtual ECParameters ExportExplicitParameters(bool includePrivateParameters);
+   public virtual ECParameters ExportParameters(bool includePrivateParameters);
+   public virtual void GenerateKey(ECCurve curve);
+   public virtual void ImportParameters(ECParameters parameters);
  }
  public sealed class ECDsaCng : ECDsa {
+   public ECDsaCng(ECCurve curve);
+   public override int KeySize { get; set; }
+   public override ECParameters ExportExplicitParameters(bool includePrivateParameters);
+   public override ECParameters ExportParameters(bool includePrivateParameters);
+   public override void GenerateKey(ECCurve curve);
+   public override void ImportParameters(ECParameters parameters);
  }
  public sealed class ECDsaOpenSsl : ECDsa {
+   public ECDsaOpenSsl(ECCurve curve);
    public override int KeySize { get; set; }
+   public override ECParameters ExportExplicitParameters(bool includePrivateParameters);
+   public override ECParameters ExportParameters(bool includePrivateParameters);
+   public override void GenerateKey(ECCurve curve);
+   public override void ImportParameters(ECParameters parameters);
  }
+ [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ECParameters {
+   public byte[] D;
+   public ECCurve Curve;
+   public ECPoint Q;
+   public void Validate();
  }
+ [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct ECPoint {
+   public byte[] X;
+   public byte[] Y;
  }
+ public static class ProtectedData {
+   public static byte[] Protect(byte[] userData, byte[] optionalEntropy, DataProtectionScope scope);
+   public static byte[] Unprotect(byte[] encryptedData, byte[] optionalEntropy, DataProtectionScope scope);
  }
  public abstract class SymmetricAlgorithm : IDisposable {
+   protected byte[] IVValue;
+   protected byte[] KeyValue;
+   protected int BlockSizeValue;
+   protected int KeySizeValue;
+   protected CipherMode ModeValue;
+   protected KeySizes[] LegalBlockSizesValue;
+   protected KeySizes[] LegalKeySizesValue;
+   protected PaddingMode PaddingValue;
  }
+ public sealed class TripleDESCng : TripleDES {
+   public TripleDESCng();
+   public TripleDESCng(string keyName);
+   public TripleDESCng(string keyName, CngProvider provider);
+   public TripleDESCng(string keyName, CngProvider provider, CngKeyOpenOptions openOptions);
+   public override byte[] Key { get; set; }
+   public override int KeySize { get; set; }
+   public override KeySizes[] LegalKeySizes { get; }
+   public override ICryptoTransform CreateDecryptor();
+   public override ICryptoTransform CreateDecryptor(byte[] rgbKey, byte[] rgbIV);
+   public override ICryptoTransform CreateEncryptor();
+   public override ICryptoTransform CreateEncryptor(byte[] rgbKey, byte[] rgbIV);
+   protected override void Dispose(bool disposing);
+   public override void GenerateIV();
+   public override void GenerateKey();
  }
 }
```

## System.Security.Cryptography.Pkcs

```c#
+namespace System.Security.Cryptography.Pkcs {
+ public sealed class AlgorithmIdentifier {
+   public AlgorithmIdentifier();
+   public AlgorithmIdentifier(Oid oid);
+   public AlgorithmIdentifier(Oid oid, int keyLength);
+   public int KeyLength { get; set; }
+   public Oid Oid { get; set; }
  }
+ public sealed class CmsRecipient {
+   public CmsRecipient(SubjectIdentifierType recipientIdentifierType, X509Certificate2 certificate);
+   public CmsRecipient(X509Certificate2 certificate);
+   public X509Certificate2 Certificate { get; }
+   public SubjectIdentifierType RecipientIdentifierType { get; }
  }
+ public sealed class CmsRecipientCollection : ICollection, IEnumerable {
+   public CmsRecipientCollection();
+   public CmsRecipientCollection(CmsRecipient recipient);
+   public CmsRecipientCollection(SubjectIdentifierType recipientIdentifierType, X509Certificate2Collection certificates);
+   public int Count { get; }
+   bool System.Collections.ICollection.IsSynchronized { get; }
+   object System.Collections.ICollection.SyncRoot { get; }
+   public CmsRecipient this[int index] { get; }
+   public int Add(CmsRecipient recipient);
+   public void CopyTo(Array array, int index);
+   public void CopyTo(CmsRecipient[] array, int index);
+   public CmsRecipientEnumerator GetEnumerator();
+   public void Remove(CmsRecipient recipient);
+   IEnumerator System.Collections.IEnumerable.GetEnumerator();
  }
+ public sealed class CmsRecipientEnumerator : IEnumerator {
+   public CmsRecipient Current { get; }
+   object System.Collections.IEnumerator.Current { get; }
+   public bool MoveNext();
+   public void Reset();
  }
+ public sealed class ContentInfo {
+   public ContentInfo(byte[] content);
+   public ContentInfo(Oid contentType, byte[] content);
+   public byte[] Content { get; }
+   public Oid ContentType { get; }
+   public static Oid GetContentType(byte[] encodedMessage);
  }
+ public sealed class EnvelopedCms {
+   public EnvelopedCms();
+   public EnvelopedCms(ContentInfo contentInfo);
+   public EnvelopedCms(ContentInfo contentInfo, AlgorithmIdentifier encryptionAlgorithm);
+   public X509Certificate2Collection Certificates { get; }
+   public AlgorithmIdentifier ContentEncryptionAlgorithm { get; }
+   public ContentInfo ContentInfo { get; }
+   public RecipientInfoCollection RecipientInfos { get; }
+   public CryptographicAttributeObjectCollection UnprotectedAttributes { get; }
+   public int Version { get; }
+   public void Decode(byte[] encodedMessage);
+   public void Decrypt();
+   public void Decrypt(RecipientInfo recipientInfo);
+   public void Decrypt(RecipientInfo recipientInfo, X509Certificate2Collection extraStore);
+   public void Decrypt(X509Certificate2Collection extraStore);
+   public byte[] Encode();
+   public void Encrypt(CmsRecipient recipient);
+   public void Encrypt(CmsRecipientCollection recipients);
  }
+ public sealed class KeyAgreeRecipientInfo : RecipientInfo {
+   public DateTime Date { get; }
+   public override byte[] EncryptedKey { get; }
+   public override AlgorithmIdentifier KeyEncryptionAlgorithm { get; }
+   public SubjectIdentifierOrKey OriginatorIdentifierOrKey { get; }
+   public CryptographicAttributeObject OtherKeyAttribute { get; }
+   public override SubjectIdentifier RecipientIdentifier { get; }
+   public override int Version { get; }
  }
+ public sealed class KeyTransRecipientInfo : RecipientInfo {
+   public override byte[] EncryptedKey { get; }
+   public override AlgorithmIdentifier KeyEncryptionAlgorithm { get; }
+   public override SubjectIdentifier RecipientIdentifier { get; }
+   public override int Version { get; }
  }
+ public class Pkcs9AttributeObject : AsnEncodedData {
+   public Pkcs9AttributeObject();
+   public Pkcs9AttributeObject(AsnEncodedData asnEncodedData);
+   public Pkcs9AttributeObject(Oid oid, byte[] encodedData);
+   public Pkcs9AttributeObject(string oid, byte[] encodedData);
+   public new Oid Oid { get; }
+   public override void CopyFrom(AsnEncodedData asnEncodedData);
  }
+ public sealed class Pkcs9ContentType : Pkcs9AttributeObject {
+   public Pkcs9ContentType();
+   public Oid ContentType { get; }
+   public override void CopyFrom(AsnEncodedData asnEncodedData);
  }
+ public sealed class Pkcs9DocumentDescription : Pkcs9AttributeObject {
+   public Pkcs9DocumentDescription();
+   public Pkcs9DocumentDescription(byte[] encodedDocumentDescription);
+   public Pkcs9DocumentDescription(string documentDescription);
+   public string DocumentDescription { get; }
+   public override void CopyFrom(AsnEncodedData asnEncodedData);
  }
+ public sealed class Pkcs9DocumentName : Pkcs9AttributeObject {
+   public Pkcs9DocumentName();
+   public Pkcs9DocumentName(byte[] encodedDocumentName);
+   public Pkcs9DocumentName(string documentName);
+   public string DocumentName { get; }
+   public override void CopyFrom(AsnEncodedData asnEncodedData);
  }
+ public sealed class Pkcs9MessageDigest : Pkcs9AttributeObject {
+   public Pkcs9MessageDigest();
+   public byte[] MessageDigest { get; }
+   public override void CopyFrom(AsnEncodedData asnEncodedData);
  }
+ public sealed class Pkcs9SigningTime : Pkcs9AttributeObject {
+   public Pkcs9SigningTime();
+   public Pkcs9SigningTime(byte[] encodedSigningTime);
+   public Pkcs9SigningTime(DateTime signingTime);
+   public DateTime SigningTime { get; }
+   public override void CopyFrom(AsnEncodedData asnEncodedData);
  }
+ public sealed class PublicKeyInfo {
+   public AlgorithmIdentifier Algorithm { get; }
+   public byte[] KeyValue { get; }
  }
+ public abstract class RecipientInfo {
+   public abstract byte[] EncryptedKey { get; }
+   public abstract AlgorithmIdentifier KeyEncryptionAlgorithm { get; }
+   public abstract SubjectIdentifier RecipientIdentifier { get; }
+   public RecipientInfoType Type { get; }
+   public abstract int Version { get; }
  }
+ public sealed class RecipientInfoCollection : ICollection, IEnumerable {
+   public int Count { get; }
+   bool System.Collections.ICollection.IsSynchronized { get; }
+   object System.Collections.ICollection.SyncRoot { get; }
+   public RecipientInfo this[int index] { get; }
+   public void CopyTo(Array array, int index);
+   public void CopyTo(RecipientInfo[] array, int index);
+   public RecipientInfoEnumerator GetEnumerator();
+   IEnumerator System.Collections.IEnumerable.GetEnumerator();
  }
+ public sealed class RecipientInfoEnumerator : IEnumerator {
+   public RecipientInfo Current { get; }
+   object System.Collections.IEnumerator.Current { get; }
+   public bool MoveNext();
+   public void Reset();
  }
+ public enum RecipientInfoType {
+   KeyAgreement = 2,
+   KeyTransport = 1,
+   Unknown = 0,
  }
+ public sealed class SubjectIdentifier {
+   public SubjectIdentifierType Type { get; }
+   public object Value { get; }
  }
+ public sealed class SubjectIdentifierOrKey {
+   public SubjectIdentifierOrKeyType Type { get; }
+   public object Value { get; }
  }
+ public enum SubjectIdentifierOrKeyType {
+   IssuerAndSerialNumber = 1,
+   PublicKeyInfo = 3,
+   SubjectKeyIdentifier = 2,
+   Unknown = 0,
  }
+ public enum SubjectIdentifierType {
+   IssuerAndSerialNumber = 1,
+   NoSignature = 3,
+   SubjectKeyIdentifier = 2,
+   Unknown = 0,
  }
 }
```

## System.Security.Cryptography.Xml

```c#
+namespace System.Security.Cryptography.Xml {
+ [System.Runtime.InteropServices.StructLayoutAttribute(System.Runtime.InteropServices.LayoutKind.Sequential)]
  public struct X509IssuerSerial {
+   public string IssuerName { get; set; }
+   public string SerialNumber { get; set; }
  }
 }
```

## System.ServiceModel.Security

```c#
 namespace System.ServiceModel.Security {
  public sealed class X509ServiceCertificateAuthentication {
+   public X509ServiceCertificateAuthentication();
  }
 }
```

## System.Text.RegularExpressions

```c#
 namespace System.Text.RegularExpressions {
  public class Regex {
+   protected internal int capsize;
+   protected internal string pattern;
+   protected internal string[] capslist;
+   protected internal RegexOptions roptions;
+   protected internal RegexRunnerFactory factory;
+   protected internal TimeSpan internalMatchTimeout;
+   protected IDictionary CapNames { get; set; }
+   protected IDictionary Caps { get; set; }
+   protected void InitializeReferences();
+   protected internal static void ValidateMatchTimeout(TimeSpan matchTimeout);
  }
+ public abstract class RegexRunner {
+   protected internal int runcrawlpos;
+   protected internal int runstackpos;
+   protected internal int runtextbeg;
+   protected internal int runtextend;
+   protected internal int runtextpos;
+   protected internal int runtextstart;
+   protected internal int runtrackcount;
+   protected internal int runtrackpos;
+   protected internal int[] runcrawl;
+   protected internal int[] runstack;
+   protected internal int[] runtrack;
+   protected internal string runtext;
+   protected internal Match runmatch;
+   protected internal Regex runregex;
+   protected internal RegexRunner();
+   protected void Capture(int capnum, int start, int end);
+   protected static bool CharInClass(char ch, string charClass);
+   protected static bool CharInSet(char ch, string @set, string category);
+   protected void CheckTimeout();
+   protected void Crawl(int i);
+   protected int Crawlpos();
+   protected void DoubleCrawl();
+   protected void DoubleStack();
+   protected void DoubleTrack();
+   protected void EnsureStorage();
+   protected abstract bool FindFirstChar();
+   protected abstract void Go();
+   protected abstract void InitTrackCount();
+   protected bool IsBoundary(int index, int startpos, int endpos);
+   protected bool IsECMABoundary(int index, int startpos, int endpos);
+   protected bool IsMatched(int cap);
+   protected int MatchIndex(int cap);
+   protected int MatchLength(int cap);
+   protected int Popcrawl();
+   protected internal Match Scan(Regex regex, string text, int textbeg, int textend, int textstart, int prevlen, bool quick);
+   protected internal Match Scan(Regex regex, string text, int textbeg, int textend, int textstart, int prevlen, bool quick, TimeSpan timeout);
+   protected void TransferCapture(int capnum, int uncapnum, int start, int end);
+   protected void Uncapture();
  }
+ public abstract class RegexRunnerFactory {
+   protected RegexRunnerFactory();
+   protected internal abstract RegexRunner CreateInstance();
  }
 }
```

## System.Threading.Tasks

```c#
 namespace System.Threading.Tasks {
  public struct ValueTask<TResult> : IEquatable<ValueTask<TResult>> {
-   public static implicit operator ValueTask<TResult> (Task<TResult> task);
-   public static implicit operator ValueTask<TResult> (TResult result);
  }
 }
```
