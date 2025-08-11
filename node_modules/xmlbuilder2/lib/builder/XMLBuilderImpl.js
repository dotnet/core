"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("../interfaces");
var util_1 = require("@oozcitak/util");
var writers_1 = require("../writers");
var interfaces_2 = require("@oozcitak/dom/lib/dom/interfaces");
var util_2 = require("@oozcitak/dom/lib/util");
var algorithm_1 = require("@oozcitak/dom/lib/algorithm");
var dom_1 = require("./dom");
var infra_1 = require("@oozcitak/infra");
var readers_1 = require("../readers");
/**
 * Represents a wrapper that extends XML nodes to implement easy to use and
 * chainable document builder methods.
 */
var XMLBuilderImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `XMLBuilderNodeImpl`.
     *
     * @param domNode - the DOM node to wrap
     */
    function XMLBuilderImpl(domNode) {
        this._domNode = domNode;
    }
    Object.defineProperty(XMLBuilderImpl.prototype, "node", {
        /** @inheritdoc */
        get: function () { return this._domNode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLBuilderImpl.prototype, "options", {
        /** @inheritdoc */
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    XMLBuilderImpl.prototype.set = function (options) {
        this._options = util_1.applyDefaults(util_1.applyDefaults(this._options, options, true), // apply user settings
        interfaces_1.DefaultBuilderOptions); // provide defaults
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.ele = function (p1, p2, p3) {
        var _a, _b, _c;
        var namespace;
        var name;
        var attributes;
        if (util_1.isObject(p1)) {
            // ele(obj: ExpandObject)
            return new readers_1.ObjectReader(this._options).parse(this, p1);
        }
        else if (p1 !== null && /^\s*</.test(p1)) {
            // parse XML document string
            return new readers_1.XMLReader(this._options).parse(this, p1);
        }
        else if (p1 !== null && /^\s*[\{\[]/.test(p1)) {
            // parse JSON string
            return new readers_1.JSONReader(this._options).parse(this, p1);
        }
        else if (p1 !== null && /^(\s*|(#.*)|(%.*))*---/.test(p1)) {
            // parse YAML string
            return new readers_1.YAMLReader(this._options).parse(this, p1);
        }
        if ((p1 === null || util_1.isString(p1)) && util_1.isString(p2)) {
            // ele(namespace: string, name: string, attributes?: AttributesObject)
            _a = __read([p1, p2, p3], 3), namespace = _a[0], name = _a[1], attributes = _a[2];
        }
        else if (p1 !== null) {
            // ele(name: string, attributes?: AttributesObject)
            _b = __read([undefined, p1, util_1.isObject(p2) ? p2 : undefined], 3), namespace = _b[0], name = _b[1], attributes = _b[2];
        }
        else {
            throw new Error("Element name cannot be null. " + this._debugInfo());
        }
        if (attributes) {
            attributes = util_1.getValue(attributes);
        }
        _c = __read(this._extractNamespace(dom_1.sanitizeInput(namespace, this._options.invalidCharReplacement), dom_1.sanitizeInput(name, this._options.invalidCharReplacement), true), 2), namespace = _c[0], name = _c[1];
        // inherit namespace from parent
        if (namespace === undefined) {
            var _d = __read(algorithm_1.namespace_extractQName(name), 1), prefix = _d[0];
            namespace = this.node.lookupNamespaceURI(prefix);
        }
        // create a child element node
        var childNode = (namespace !== undefined && namespace !== null ?
            this._doc.createElementNS(namespace, name) :
            this._doc.createElement(name));
        this.node.appendChild(childNode);
        var builder = new XMLBuilderImpl(childNode);
        // update doctype node if the new node is the document element node
        var oldDocType = this._doc.doctype;
        if (childNode === this._doc.documentElement && oldDocType !== null) {
            var docType = this._doc.implementation.createDocumentType(this._doc.documentElement.tagName, oldDocType.publicId, oldDocType.systemId);
            this._doc.replaceChild(docType, oldDocType);
        }
        // create attributes
        if (attributes && !util_1.isEmpty(attributes)) {
            builder.att(attributes);
        }
        return builder;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.remove = function () {
        var parent = this.up();
        parent.node.removeChild(this.node);
        return parent;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.att = function (p1, p2, p3) {
        var _a, _b, _c;
        var _this = this;
        if (util_1.isMap(p1) || util_1.isObject(p1)) {
            // att(obj: AttributesObject)
            // expand if object
            util_1.forEachObject(p1, function (attName, attValue) { return _this.att(attName, attValue); }, this);
            return this;
        }
        // get primitive values
        if (p1 !== undefined && p1 !== null)
            p1 = util_1.getValue(p1 + "");
        if (p2 !== undefined && p2 !== null)
            p2 = util_1.getValue(p2 + "");
        if (p3 !== undefined && p3 !== null)
            p3 = util_1.getValue(p3 + "");
        var namespace;
        var name;
        var value;
        if ((p1 === null || util_1.isString(p1)) && util_1.isString(p2) && (p3 === null || util_1.isString(p3))) {
            // att(namespace: string, name: string, value: string)
            _a = __read([p1, p2, p3], 3), namespace = _a[0], name = _a[1], value = _a[2];
        }
        else if (util_1.isString(p1) && (p2 == null || util_1.isString(p2))) {
            // ele(name: string, value: string)
            _b = __read([undefined, p1, p2], 3), namespace = _b[0], name = _b[1], value = _b[2];
        }
        else {
            throw new Error("Attribute name and value not specified. " + this._debugInfo());
        }
        if (this._options.keepNullAttributes && (value == null)) {
            // keep null attributes
            value = "";
        }
        else if (value == null) {
            // skip null|undefined attributes
            return this;
        }
        if (!util_2.Guard.isElementNode(this.node)) {
            throw new Error("An attribute can only be assigned to an element node.");
        }
        var ele = this.node;
        _c = __read(this._extractNamespace(namespace, name, false), 2), namespace = _c[0], name = _c[1];
        name = dom_1.sanitizeInput(name, this._options.invalidCharReplacement);
        namespace = dom_1.sanitizeInput(namespace, this._options.invalidCharReplacement);
        value = dom_1.sanitizeInput(value, this._options.invalidCharReplacement);
        var _d = __read(algorithm_1.namespace_extractQName(name), 2), prefix = _d[0], localName = _d[1];
        var _e = __read(algorithm_1.namespace_extractQName(ele.prefix ? ele.prefix + ':' + ele.localName : ele.localName), 1), elePrefix = _e[0];
        // check if this is a namespace declaration attribute
        // assign a new element namespace if it wasn't previously assigned
        var eleNamespace = null;
        if (prefix === "xmlns") {
            namespace = infra_1.namespace.XMLNS;
            if (ele.namespaceURI === null && elePrefix === localName) {
                eleNamespace = value;
            }
        }
        else if (prefix === null && localName === "xmlns" && elePrefix === null) {
            namespace = infra_1.namespace.XMLNS;
            eleNamespace = value;
        }
        // re-create the element node if its namespace changed
        // we can't simply change the namespaceURI since its read-only
        if (eleNamespace !== null) {
            this._updateNamespace(eleNamespace);
            ele = this.node;
        }
        if (namespace !== undefined) {
            ele.setAttributeNS(namespace, name, value);
        }
        else {
            ele.setAttribute(name, value);
        }
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.removeAtt = function (p1, p2) {
        var _this = this;
        if (!util_2.Guard.isElementNode(this.node)) {
            throw new Error("An attribute can only be removed from an element node.");
        }
        // get primitive values
        p1 = util_1.getValue(p1);
        if (p2 !== undefined) {
            p2 = util_1.getValue(p2);
        }
        var namespace;
        var name;
        if (p1 !== null && p2 === undefined) {
            name = p1;
        }
        else if ((p1 === null || util_1.isString(p1)) && p2 !== undefined) {
            namespace = p1;
            name = p2;
        }
        else {
            throw new Error("Attribute namespace must be a string. " + this._debugInfo());
        }
        if (util_1.isArray(name) || util_1.isSet(name)) {
            // removeAtt(names: string[])
            // removeAtt(namespace: string, names: string[])
            util_1.forEachArray(name, function (attName) {
                return namespace === undefined ? _this.removeAtt(attName) : _this.removeAtt(namespace, attName);
            }, this);
        }
        else if (namespace !== undefined) {
            // removeAtt(namespace: string, name: string)
            name = dom_1.sanitizeInput(name, this._options.invalidCharReplacement);
            namespace = dom_1.sanitizeInput(namespace, this._options.invalidCharReplacement);
            this.node.removeAttributeNS(namespace, name);
        }
        else {
            // removeAtt(name: string)
            name = dom_1.sanitizeInput(name, this._options.invalidCharReplacement);
            this.node.removeAttribute(name);
        }
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.txt = function (content) {
        if (content === null || content === undefined) {
            if (this._options.keepNullNodes) {
                // keep null nodes
                content = "";
            }
            else {
                // skip null|undefined nodes
                return this;
            }
        }
        var child = this._doc.createTextNode(dom_1.sanitizeInput(content, this._options.invalidCharReplacement));
        this.node.appendChild(child);
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.com = function (content) {
        if (content === null || content === undefined) {
            if (this._options.keepNullNodes) {
                // keep null nodes
                content = "";
            }
            else {
                // skip null|undefined nodes
                return this;
            }
        }
        var child = this._doc.createComment(dom_1.sanitizeInput(content, this._options.invalidCharReplacement));
        this.node.appendChild(child);
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.dat = function (content) {
        if (content === null || content === undefined) {
            if (this._options.keepNullNodes) {
                // keep null nodes
                content = "";
            }
            else {
                // skip null|undefined nodes
                return this;
            }
        }
        var child = this._doc.createCDATASection(dom_1.sanitizeInput(content, this._options.invalidCharReplacement));
        this.node.appendChild(child);
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.ins = function (target, content) {
        var _this = this;
        if (content === void 0) { content = ''; }
        if (content === null || content === undefined) {
            if (this._options.keepNullNodes) {
                // keep null nodes
                content = "";
            }
            else {
                // skip null|undefined nodes
                return this;
            }
        }
        if (util_1.isArray(target) || util_1.isSet(target)) {
            util_1.forEachArray(target, function (item) {
                item += "";
                var insIndex = item.indexOf(' ');
                var insTarget = (insIndex === -1 ? item : item.substr(0, insIndex));
                var insValue = (insIndex === -1 ? '' : item.substr(insIndex + 1));
                _this.ins(insTarget, insValue);
            }, this);
        }
        else if (util_1.isMap(target) || util_1.isObject(target)) {
            util_1.forEachObject(target, function (insTarget, insValue) { return _this.ins(insTarget, insValue); }, this);
        }
        else {
            var child = this._doc.createProcessingInstruction(dom_1.sanitizeInput(target, this._options.invalidCharReplacement), dom_1.sanitizeInput(content, this._options.invalidCharReplacement));
            this.node.appendChild(child);
        }
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.dec = function (options) {
        this._options.version = options.version || "1.0";
        this._options.encoding = options.encoding;
        this._options.standalone = options.standalone;
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.dtd = function (options) {
        var name = dom_1.sanitizeInput((options && options.name) || (this._doc.documentElement ? this._doc.documentElement.tagName : "ROOT"), this._options.invalidCharReplacement);
        var pubID = dom_1.sanitizeInput((options && options.pubID) || "", this._options.invalidCharReplacement);
        var sysID = dom_1.sanitizeInput((options && options.sysID) || "", this._options.invalidCharReplacement);
        // name must match document element
        if (this._doc.documentElement !== null && name !== this._doc.documentElement.tagName) {
            throw new Error("DocType name does not match document element name.");
        }
        // create doctype node
        var docType = this._doc.implementation.createDocumentType(name, pubID, sysID);
        if (this._doc.doctype !== null) {
            // replace existing doctype
            this._doc.replaceChild(docType, this._doc.doctype);
        }
        else {
            // insert before document element node or append to end
            this._doc.insertBefore(docType, this._doc.documentElement);
        }
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.import = function (node) {
        var e_1, _a;
        var hostNode = this._domNode;
        var hostDoc = this._doc;
        var importedNode = node.node;
        if (util_2.Guard.isDocumentNode(importedNode)) {
            // import document node
            var elementNode = importedNode.documentElement;
            if (elementNode === null) {
                throw new Error("Imported document has no document element node. " + this._debugInfo());
            }
            var clone = hostDoc.importNode(elementNode, true);
            hostNode.appendChild(clone);
            var _b = __read(algorithm_1.namespace_extractQName(clone.prefix ? clone.prefix + ':' + clone.localName : clone.localName), 1), prefix = _b[0];
            var namespace = hostNode.lookupNamespaceURI(prefix);
            new XMLBuilderImpl(clone)._updateNamespace(namespace);
        }
        else if (util_2.Guard.isDocumentFragmentNode(importedNode)) {
            try {
                // import child nodes
                for (var _c = __values(importedNode.childNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var childNode = _d.value;
                    var clone = hostDoc.importNode(childNode, true);
                    hostNode.appendChild(clone);
                    if (util_2.Guard.isElementNode(clone)) {
                        var _e = __read(algorithm_1.namespace_extractQName(clone.prefix ? clone.prefix + ':' + clone.localName : clone.localName), 1), prefix = _e[0];
                        var namespace = hostNode.lookupNamespaceURI(prefix);
                        new XMLBuilderImpl(clone)._updateNamespace(namespace);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            // import node
            var clone = hostDoc.importNode(importedNode, true);
            hostNode.appendChild(clone);
            if (util_2.Guard.isElementNode(clone)) {
                var _f = __read(algorithm_1.namespace_extractQName(clone.prefix ? clone.prefix + ':' + clone.localName : clone.localName), 1), prefix = _f[0];
                var namespace = hostNode.lookupNamespaceURI(prefix);
                new XMLBuilderImpl(clone)._updateNamespace(namespace);
            }
        }
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.doc = function () {
        if (this._doc._isFragment) {
            var node = this.node;
            while (node && node.nodeType !== interfaces_2.NodeType.DocumentFragment) {
                node = node.parentNode;
            }
            /* istanbul ignore next */
            if (node === null) {
                throw new Error("Node has no parent node while searching for document fragment ancestor. " + this._debugInfo());
            }
            return new XMLBuilderImpl(node);
        }
        else {
            return new XMLBuilderImpl(this._doc);
        }
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.root = function () {
        var ele = this._doc.documentElement;
        if (!ele) {
            throw new Error("Document root element is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(ele);
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.up = function () {
        var parent = this._domNode.parentNode;
        if (!parent) {
            throw new Error("Parent node is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(parent);
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.prev = function () {
        var node = this._domNode.previousSibling;
        if (!node) {
            throw new Error("Previous sibling node is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(node);
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.next = function () {
        var node = this._domNode.nextSibling;
        if (!node) {
            throw new Error("Next sibling node is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(node);
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.first = function () {
        var node = this._domNode.firstChild;
        if (!node) {
            throw new Error("First child node is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(node);
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.last = function () {
        var node = this._domNode.lastChild;
        if (!node) {
            throw new Error("Last child node is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(node);
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.each = function (callback, self, recursive, thisArg) {
        if (self === void 0) { self = false; }
        if (recursive === void 0) { recursive = false; }
        var result = this._getFirstDescendantNode(this._domNode, self, recursive);
        while (result[0]) {
            var nextResult = this._getNextDescendantNode(this._domNode, result[0], recursive, result[1], result[2]);
            callback.call(thisArg, new XMLBuilderImpl(result[0]), result[1], result[2]);
            result = nextResult;
        }
        return this;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.map = function (callback, self, recursive, thisArg) {
        if (self === void 0) { self = false; }
        if (recursive === void 0) { recursive = false; }
        var result = [];
        this.each(function (node, index, level) {
            return result.push(callback.call(thisArg, node, index, level));
        }, self, recursive);
        return result;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.reduce = function (callback, initialValue, self, recursive, thisArg) {
        if (self === void 0) { self = false; }
        if (recursive === void 0) { recursive = false; }
        var value = initialValue;
        this.each(function (node, index, level) {
            return value = callback.call(thisArg, value, node, index, level);
        }, self, recursive);
        return value;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.find = function (predicate, self, recursive, thisArg) {
        if (self === void 0) { self = false; }
        if (recursive === void 0) { recursive = false; }
        var result = this._getFirstDescendantNode(this._domNode, self, recursive);
        while (result[0]) {
            var builder = new XMLBuilderImpl(result[0]);
            if (predicate.call(thisArg, builder, result[1], result[2])) {
                return builder;
            }
            result = this._getNextDescendantNode(this._domNode, result[0], recursive, result[1], result[2]);
        }
        return undefined;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.filter = function (predicate, self, recursive, thisArg) {
        if (self === void 0) { self = false; }
        if (recursive === void 0) { recursive = false; }
        var result = [];
        this.each(function (node, index, level) {
            if (predicate.call(thisArg, node, index, level)) {
                result.push(node);
            }
        }, self, recursive);
        return result;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.every = function (predicate, self, recursive, thisArg) {
        if (self === void 0) { self = false; }
        if (recursive === void 0) { recursive = false; }
        var result = this._getFirstDescendantNode(this._domNode, self, recursive);
        while (result[0]) {
            var builder = new XMLBuilderImpl(result[0]);
            if (!predicate.call(thisArg, builder, result[1], result[2])) {
                return false;
            }
            result = this._getNextDescendantNode(this._domNode, result[0], recursive, result[1], result[2]);
        }
        return true;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.some = function (predicate, self, recursive, thisArg) {
        if (self === void 0) { self = false; }
        if (recursive === void 0) { recursive = false; }
        var result = this._getFirstDescendantNode(this._domNode, self, recursive);
        while (result[0]) {
            var builder = new XMLBuilderImpl(result[0]);
            if (predicate.call(thisArg, builder, result[1], result[2])) {
                return true;
            }
            result = this._getNextDescendantNode(this._domNode, result[0], recursive, result[1], result[2]);
        }
        return false;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.toArray = function (self, recursive) {
        if (self === void 0) { self = false; }
        if (recursive === void 0) { recursive = false; }
        var result = [];
        this.each(function (node) { return result.push(node); }, self, recursive);
        return result;
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.toString = function (writerOptions) {
        writerOptions = writerOptions || {};
        if (writerOptions.format === undefined) {
            writerOptions.format = "xml";
        }
        return this._serialize(writerOptions);
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.toObject = function (writerOptions) {
        writerOptions = writerOptions || {};
        if (writerOptions.format === undefined) {
            writerOptions.format = "object";
        }
        return this._serialize(writerOptions);
    };
    /** @inheritdoc */
    XMLBuilderImpl.prototype.end = function (writerOptions) {
        writerOptions = writerOptions || {};
        if (writerOptions.format === undefined) {
            writerOptions.format = "xml";
        }
        return this.doc()._serialize(writerOptions);
    };
    /**
     * Gets the next descendant of the given node of the tree rooted at `root`
     * in depth-first pre-order. Returns a three-tuple with
     * [descendant, descendant_index, descendant_level].
     *
     * @param root - root node of the tree
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     */
    XMLBuilderImpl.prototype._getFirstDescendantNode = function (root, self, recursive) {
        if (self)
            return [this._domNode, 0, 0];
        else if (recursive)
            return this._getNextDescendantNode(root, root, recursive, 0, 0);
        else
            return [this._domNode.firstChild, 0, 1];
    };
    /**
     * Gets the next descendant of the given node of the tree rooted at `root`
     * in depth-first pre-order. Returns a three-tuple with
     * [descendant, descendant_index, descendant_level].
     *
     * @param root - root node of the tree
     * @param node - current node
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     * @param index - child node index
     * @param level - current depth of the XML tree
     */
    XMLBuilderImpl.prototype._getNextDescendantNode = function (root, node, recursive, index, level) {
        if (recursive) {
            // traverse child nodes
            if (node.firstChild)
                return [node.firstChild, 0, level + 1];
            if (node === root)
                return [null, -1, -1];
            // traverse siblings
            if (node.nextSibling)
                return [node.nextSibling, index + 1, level];
            // traverse parent's next sibling
            var parent = node.parentNode;
            while (parent && parent !== root) {
                if (parent.nextSibling)
                    return [parent.nextSibling, algorithm_1.tree_index(parent.nextSibling), level - 1];
                parent = parent.parentNode;
                level--;
            }
        }
        else {
            if (root === node)
                return [node.firstChild, 0, level + 1];
            else
                return [node.nextSibling, index + 1, level];
        }
        return [null, -1, -1];
    };
    /**
     * Converts the node into its string or object representation.
     *
     * @param options - serialization options
     */
    XMLBuilderImpl.prototype._serialize = function (writerOptions) {
        if (writerOptions.format === "xml") {
            var writer = new writers_1.XMLWriter(this._options, writerOptions);
            return writer.serialize(this.node);
        }
        else if (writerOptions.format === "map") {
            var writer = new writers_1.MapWriter(this._options, writerOptions);
            return writer.serialize(this.node);
        }
        else if (writerOptions.format === "object") {
            var writer = new writers_1.ObjectWriter(this._options, writerOptions);
            return writer.serialize(this.node);
        }
        else if (writerOptions.format === "json") {
            var writer = new writers_1.JSONWriter(this._options, writerOptions);
            return writer.serialize(this.node);
        }
        else if (writerOptions.format === "yaml") {
            var writer = new writers_1.YAMLWriter(this._options, writerOptions);
            return writer.serialize(this.node);
        }
        else {
            throw new Error("Invalid writer format: " + writerOptions.format + ". " + this._debugInfo());
        }
    };
    /**
     * Extracts a namespace and name from the given string.
     *
     * @param namespace - namespace
     * @param name - a string containing both a name and namespace separated by an
     * `'@'` character
     * @param ele - `true` if this is an element namespace; otherwise `false`
     */
    XMLBuilderImpl.prototype._extractNamespace = function (namespace, name, ele) {
        // extract from name
        var atIndex = name.indexOf("@");
        if (atIndex > 0) {
            if (namespace === undefined)
                namespace = name.slice(atIndex + 1);
            name = name.slice(0, atIndex);
        }
        if (namespace === undefined) {
            // look-up default namespace
            namespace = (ele ? this._options.defaultNamespace.ele : this._options.defaultNamespace.att);
        }
        else if (namespace !== null && namespace[0] === "@") {
            // look-up namespace aliases
            var alias = namespace.slice(1);
            namespace = this._options.namespaceAlias[alias];
            if (namespace === undefined) {
                throw new Error("Namespace alias `" + alias + "` is not defined. " + this._debugInfo());
            }
        }
        return [namespace, name];
    };
    /**
     * Updates the element's namespace.
     *
     * @param ns - new namespace
     */
    XMLBuilderImpl.prototype._updateNamespace = function (ns) {
        var e_2, _a, e_3, _b;
        var ele = this._domNode;
        if (util_2.Guard.isElementNode(ele) && ns !== null && ele.namespaceURI !== ns) {
            var _c = __read(algorithm_1.namespace_extractQName(ele.prefix ? ele.prefix + ':' + ele.localName : ele.localName), 2), elePrefix = _c[0], eleLocalName = _c[1];
            // re-create the element node if its namespace changed
            // we can't simply change the namespaceURI since its read-only
            var newEle = algorithm_1.create_element(this._doc, eleLocalName, ns, elePrefix);
            try {
                for (var _d = __values(ele.attributes), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var attr = _e.value;
                    var attrQName = attr.prefix ? attr.prefix + ':' + attr.localName : attr.localName;
                    var _f = __read(algorithm_1.namespace_extractQName(attrQName), 1), attrPrefix = _f[0];
                    var newAttrNS = attr.namespaceURI;
                    if (newAttrNS === null && attrPrefix !== null) {
                        newAttrNS = ele.lookupNamespaceURI(attrPrefix);
                    }
                    if (newAttrNS === null) {
                        newEle.setAttribute(attrQName, attr.value);
                    }
                    else {
                        newEle.setAttributeNS(newAttrNS, attrQName, attr.value);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // replace the new node in parent node
            var parent = ele.parentNode;
            /* istanbul ignore next */
            if (parent === null) {
                throw new Error("Parent node is null." + this._debugInfo());
            }
            parent.replaceChild(newEle, ele);
            this._domNode = newEle;
            try {
                // check child nodes
                for (var _g = __values(ele.childNodes), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var childNode = _h.value;
                    var newChildNode = childNode.cloneNode(true);
                    newEle.appendChild(newChildNode);
                    if (util_2.Guard.isElementNode(newChildNode)) {
                        var _j = __read(algorithm_1.namespace_extractQName(newChildNode.prefix ? newChildNode.prefix + ':' + newChildNode.localName : newChildNode.localName), 1), newChildNodePrefix = _j[0];
                        var newChildNodeNS = newEle.lookupNamespaceURI(newChildNodePrefix);
                        new XMLBuilderImpl(newChildNode)._updateNamespace(newChildNodeNS);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    };
    Object.defineProperty(XMLBuilderImpl.prototype, "_doc", {
        /**
         * Returns the document owning this node.
         */
        get: function () {
            var node = this.node;
            if (util_2.Guard.isDocumentNode(node)) {
                return node;
            }
            else {
                var docNode = node.ownerDocument;
                /* istanbul ignore next */
                if (!docNode)
                    throw new Error("Owner document is null. " + this._debugInfo());
                return docNode;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns debug information for this node.
     *
     * @param name - node name
     */
    XMLBuilderImpl.prototype._debugInfo = function (name) {
        var node = this.node;
        var parentNode = node.parentNode;
        name = name || node.nodeName;
        var parentName = parentNode ? parentNode.nodeName : '';
        if (!parentName) {
            return "node: <" + name + ">";
        }
        else {
            return "node: <" + name + ">, parent: <" + parentName + ">";
        }
    };
    Object.defineProperty(XMLBuilderImpl.prototype, "_options", {
        /**
         * Gets or sets builder options.
         */
        get: function () {
            var doc = this._doc;
            /* istanbul ignore next */
            if (doc._xmlBuilderOptions === undefined) {
                throw new Error("Builder options is not set.");
            }
            return doc._xmlBuilderOptions;
        },
        set: function (value) {
            var doc = this._doc;
            doc._xmlBuilderOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    return XMLBuilderImpl;
}());
exports.XMLBuilderImpl = XMLBuilderImpl;
//# sourceMappingURL=XMLBuilderImpl.js.map