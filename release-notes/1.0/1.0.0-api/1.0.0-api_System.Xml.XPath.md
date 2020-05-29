# System.Xml.XPath

``` diff
+namespace System.Xml.XPath {
+    public static class Extensions {
+        public static XPathNavigator CreateNavigator(this XNode node);
+        public static XPathNavigator CreateNavigator(this XNode node, XmlNameTable nameTable);
+        public static object XPathEvaluate(this XNode node, string expression);
+        public static object XPathEvaluate(this XNode node, string expression, IXmlNamespaceResolver resolver);
+        public static XElement XPathSelectElement(this XNode node, string expression);
+        public static XElement XPathSelectElement(this XNode node, string expression, IXmlNamespaceResolver resolver);
+        public static IEnumerable<XElement> XPathSelectElements(this XNode node, string expression);
+        public static IEnumerable<XElement> XPathSelectElements(this XNode node, string expression, IXmlNamespaceResolver resolver);
+    }
+    public interface IXPathNavigable {
+        XPathNavigator CreateNavigator();
+    }
+    public static class XDocumentExtensions {
+        public static IXPathNavigable ToXPathNavigable(this XNode node);
+    }
+    public enum XmlCaseOrder {
+        LowerFirst = 2,
+        None = 0,
+        UpperFirst = 1,
+    }
+    public enum XmlDataType {
+        Number = 2,
+        Text = 1,
+    }
+    public enum XmlSortOrder {
+        Ascending = 1,
+        Descending = 2,
+    }
+    public class XPathDocument : IXPathNavigable {
+        public XPathDocument(Stream stream);
+        public XPathDocument(TextReader textReader);
+        public XPathDocument(string uri);
+        public XPathDocument(string uri, XmlSpace space);
+        public XPathDocument(XmlReader reader);
+        public XPathDocument(XmlReader reader, XmlSpace space);
+        public XPathNavigator CreateNavigator();
+    }
+    public class XPathException : Exception {
+        public XPathException();
+        public XPathException(string message);
+        public XPathException(string message, Exception innerException);
+    }
+    public abstract class XPathExpression {
+        public abstract string Expression { get; }
+        public abstract XPathResultType ReturnType { get; }
+        public abstract void AddSort(object expr, IComparer comparer);
+        public abstract void AddSort(object expr, XmlSortOrder order, XmlCaseOrder caseOrder, string lang, XmlDataType dataType);
+        public abstract XPathExpression Clone();
+        public static XPathExpression Compile(string xpath);
+        public static XPathExpression Compile(string xpath, IXmlNamespaceResolver nsResolver);
+        public abstract void SetContext(IXmlNamespaceResolver nsResolver);
+        public abstract void SetContext(XmlNamespaceManager nsManager);
+    }
+    public abstract class XPathItem {
+        public abstract bool IsNode { get; }
+        public abstract object TypedValue { get; }
+        public abstract string Value { get; }
+        public abstract bool ValueAsBoolean { get; }
+        public abstract DateTime ValueAsDateTime { get; }
+        public abstract double ValueAsDouble { get; }
+        public abstract int ValueAsInt { get; }
+        public abstract long ValueAsLong { get; }
+        public abstract Type ValueType { get; }
+        public virtual object ValueAs(Type returnType);
+        public abstract object ValueAs(Type returnType, IXmlNamespaceResolver nsResolver);
+    }
+    public enum XPathNamespaceScope {
+        All = 0,
+        ExcludeXml = 1,
+        Local = 2,
+    }
+    public abstract class XPathNavigator : XPathItem, IXmlNamespaceResolver, IXPathNavigable {
+        protected XPathNavigator();
+        public abstract string BaseURI { get; }
+        public virtual bool CanEdit { get; }
+        public virtual bool HasAttributes { get; }
+        public virtual bool HasChildren { get; }
+        public virtual string InnerXml { get; set; }
+        public abstract bool IsEmptyElement { get; }
+        public sealed override bool IsNode { get; }
+        public abstract string LocalName { get; }
+        public abstract string Name { get; }
+        public abstract string NamespaceURI { get; }
+        public abstract XmlNameTable NameTable { get; }
+        public static IEqualityComparer NavigatorComparer { get; }
+        public abstract XPathNodeType NodeType { get; }
+        public virtual string OuterXml { get; set; }
+        public abstract string Prefix { get; }
+        public override object TypedValue { get; }
+        public virtual object UnderlyingObject { get; }
+        public override bool ValueAsBoolean { get; }
+        public override DateTime ValueAsDateTime { get; }
+        public override double ValueAsDouble { get; }
+        public override int ValueAsInt { get; }
+        public override long ValueAsLong { get; }
+        public override Type ValueType { get; }
+        public virtual string XmlLang { get; }
+        public virtual XmlWriter AppendChild();
+        public virtual void AppendChild(string newChild);
+        public virtual void AppendChild(XmlReader newChild);
+        public virtual void AppendChild(XPathNavigator newChild);
+        public virtual void AppendChildElement(string prefix, string localName, string namespaceURI, string value);
+        public abstract XPathNavigator Clone();
+        public virtual XmlNodeOrder ComparePosition(XPathNavigator nav);
+        public virtual XPathExpression Compile(string xpath);
+        public virtual void CreateAttribute(string prefix, string localName, string namespaceURI, string value);
+        public virtual XmlWriter CreateAttributes();
+        public virtual XPathNavigator CreateNavigator();
+        public virtual void DeleteRange(XPathNavigator lastSiblingToDelete);
+        public virtual void DeleteSelf();
+        public virtual object Evaluate(string xpath);
+        public virtual object Evaluate(string xpath, IXmlNamespaceResolver resolver);
+        public virtual object Evaluate(XPathExpression expr);
+        public virtual object Evaluate(XPathExpression expr, XPathNodeIterator context);
+        public virtual string GetAttribute(string localName, string namespaceURI);
+        public virtual string GetNamespace(string name);
+        public virtual IDictionary<string, string> GetNamespacesInScope(XmlNamespaceScope scope);
+        public virtual XmlWriter InsertAfter();
+        public virtual void InsertAfter(string newSibling);
+        public virtual void InsertAfter(XmlReader newSibling);
+        public virtual void InsertAfter(XPathNavigator newSibling);
+        public virtual XmlWriter InsertBefore();
+        public virtual void InsertBefore(string newSibling);
+        public virtual void InsertBefore(XmlReader newSibling);
+        public virtual void InsertBefore(XPathNavigator newSibling);
+        public virtual void InsertElementAfter(string prefix, string localName, string namespaceURI, string value);
+        public virtual void InsertElementBefore(string prefix, string localName, string namespaceURI, string value);
+        public virtual bool IsDescendant(XPathNavigator nav);
+        public abstract bool IsSamePosition(XPathNavigator other);
+        public virtual string LookupNamespace(string prefix);
+        public virtual string LookupPrefix(string namespaceURI);
+        public virtual bool Matches(string xpath);
+        public virtual bool Matches(XPathExpression expr);
+        public abstract bool MoveTo(XPathNavigator other);
+        public virtual bool MoveToAttribute(string localName, string namespaceURI);
+        public virtual bool MoveToChild(string localName, string namespaceURI);
+        public virtual bool MoveToChild(XPathNodeType type);
+        public virtual bool MoveToFirst();
+        public abstract bool MoveToFirstAttribute();
+        public abstract bool MoveToFirstChild();
+        public bool MoveToFirstNamespace();
+        public abstract bool MoveToFirstNamespace(XPathNamespaceScope namespaceScope);
+        public virtual bool MoveToFollowing(string localName, string namespaceURI);
+        public virtual bool MoveToFollowing(string localName, string namespaceURI, XPathNavigator end);
+        public virtual bool MoveToFollowing(XPathNodeType type);
+        public virtual bool MoveToFollowing(XPathNodeType type, XPathNavigator end);
+        public abstract bool MoveToId(string id);
+        public virtual bool MoveToNamespace(string name);
+        public abstract bool MoveToNext();
+        public virtual bool MoveToNext(string localName, string namespaceURI);
+        public virtual bool MoveToNext(XPathNodeType type);
+        public abstract bool MoveToNextAttribute();
+        public bool MoveToNextNamespace();
+        public abstract bool MoveToNextNamespace(XPathNamespaceScope namespaceScope);
+        public abstract bool MoveToParent();
+        public abstract bool MoveToPrevious();
+        public virtual void MoveToRoot();
+        public virtual XmlWriter PrependChild();
+        public virtual void PrependChild(string newChild);
+        public virtual void PrependChild(XmlReader newChild);
+        public virtual void PrependChild(XPathNavigator newChild);
+        public virtual void PrependChildElement(string prefix, string localName, string namespaceURI, string value);
+        public virtual XmlReader ReadSubtree();
+        public virtual XmlWriter ReplaceRange(XPathNavigator lastSiblingToReplace);
+        public virtual void ReplaceSelf(string newNode);
+        public virtual void ReplaceSelf(XmlReader newNode);
+        public virtual void ReplaceSelf(XPathNavigator newNode);
+        public virtual XPathNodeIterator Select(string xpath);
+        public virtual XPathNodeIterator Select(string xpath, IXmlNamespaceResolver resolver);
+        public virtual XPathNodeIterator Select(XPathExpression expr);
+        public virtual XPathNodeIterator SelectAncestors(string name, string namespaceURI, bool matchSelf);
+        public virtual XPathNodeIterator SelectAncestors(XPathNodeType type, bool matchSelf);
+        public virtual XPathNodeIterator SelectChildren(string name, string namespaceURI);
+        public virtual XPathNodeIterator SelectChildren(XPathNodeType type);
+        public virtual XPathNodeIterator SelectDescendants(string name, string namespaceURI, bool matchSelf);
+        public virtual XPathNodeIterator SelectDescendants(XPathNodeType type, bool matchSelf);
+        public virtual XPathNavigator SelectSingleNode(string xpath);
+        public virtual XPathNavigator SelectSingleNode(string xpath, IXmlNamespaceResolver resolver);
+        public virtual XPathNavigator SelectSingleNode(XPathExpression expression);
+        public virtual void SetTypedValue(object typedValue);
+        public virtual void SetValue(string value);
+        public override string ToString();
+        public override object ValueAs(Type returnType, IXmlNamespaceResolver nsResolver);
+        public virtual void WriteSubtree(XmlWriter writer);
+    }
+    public abstract class XPathNodeIterator : IEnumerable {
+        protected XPathNodeIterator();
+        public virtual int Count { get; }
+        public abstract XPathNavigator Current { get; }
+        public abstract int CurrentPosition { get; }
+        public abstract XPathNodeIterator Clone();
+        public virtual IEnumerator GetEnumerator();
+        public abstract bool MoveNext();
+    }
+    public enum XPathNodeType {
+        All = 9,
+        Attribute = 2,
+        Comment = 8,
+        Element = 1,
+        Namespace = 3,
+        ProcessingInstruction = 7,
+        Root = 0,
+        SignificantWhitespace = 5,
+        Text = 4,
+        Whitespace = 6,
+    }
+    public enum XPathResultType {
+        Any = 5,
+        Boolean = 2,
+        Error = 6,
+        Navigator = 1,
+        NodeSet = 3,
+        Number = 0,
+        String = 1,
+    }
+}
```

