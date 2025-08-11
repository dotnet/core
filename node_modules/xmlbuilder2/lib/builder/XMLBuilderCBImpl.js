"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("../interfaces");
var util_1 = require("@oozcitak/util");
var BuilderFunctions_1 = require("./BuilderFunctions");
var algorithm_1 = require("@oozcitak/dom/lib/algorithm");
var infra_1 = require("@oozcitak/infra");
var NamespacePrefixMap_1 = require("@oozcitak/dom/lib/serializer/NamespacePrefixMap");
var LocalNameSet_1 = require("@oozcitak/dom/lib/serializer/LocalNameSet");
var util_2 = require("@oozcitak/dom/lib/util");
var XMLCBWriter_1 = require("../writers/XMLCBWriter");
var JSONCBWriter_1 = require("../writers/JSONCBWriter");
var YAMLCBWriter_1 = require("../writers/YAMLCBWriter");
var events_1 = require("events");
/**
 * Represents a readable XML document stream.
 */
var XMLBuilderCBImpl = /** @class */ (function (_super) {
    __extends(XMLBuilderCBImpl, _super);
    /**
     * Initializes a new instance of `XMLStream`.
     *
     * @param options - stream writer options
     * @param fragment - whether to create fragment stream or a document stream
     *
     * @returns XML stream
     */
    function XMLBuilderCBImpl(options, fragment) {
        if (fragment === void 0) { fragment = false; }
        var _this = _super.call(this) || this;
        _this._hasDeclaration = false;
        _this._docTypeName = "";
        _this._hasDocumentElement = false;
        _this._currentElementSerialized = false;
        _this._openTags = [];
        _this._ended = false;
        _this._fragment = fragment;
        // provide default options
        _this._options = util_1.applyDefaults(options || {}, interfaces_1.DefaultXMLBuilderCBOptions);
        _this._builderOptions = {
            defaultNamespace: _this._options.defaultNamespace,
            namespaceAlias: _this._options.namespaceAlias
        };
        if (_this._options.format === "json") {
            _this._writer = new JSONCBWriter_1.JSONCBWriter(_this._options);
        }
        else if (_this._options.format === "yaml") {
            _this._writer = new YAMLCBWriter_1.YAMLCBWriter(_this._options);
        }
        else {
            _this._writer = new XMLCBWriter_1.XMLCBWriter(_this._options);
        }
        // automatically create listeners for callbacks passed via options
        if (_this._options.data !== undefined) {
            _this.on("data", _this._options.data);
        }
        if (_this._options.end !== undefined) {
            _this.on("end", _this._options.end);
        }
        if (_this._options.error !== undefined) {
            _this.on("error", _this._options.error);
        }
        _this._prefixMap = new NamespacePrefixMap_1.NamespacePrefixMap();
        _this._prefixMap.set("xml", infra_1.namespace.XML);
        _this._prefixIndex = { value: 1 };
        _this._push(_this._writer.frontMatter());
        return _this;
    }
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.ele = function (p1, p2, p3) {
        var e_1, _a;
        // parse if JS object or XML or JSON string
        if (util_1.isObject(p1) || (util_1.isString(p1) && (/^\s*</.test(p1) || /^\s*[\{\[]/.test(p1) || /^(\s*|(#.*)|(%.*))*---/.test(p1)))) {
            var frag = BuilderFunctions_1.fragment().set(this._options);
            try {
                frag.ele(p1);
            }
            catch (err) {
                this.emit("error", err);
                return this;
            }
            try {
                for (var _b = __values(frag.node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var node = _c.value;
                    this._fromNode(node);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return this;
        }
        this._serializeOpenTag(true);
        if (!this._fragment && this._hasDocumentElement && this._writer.level === 0) {
            this.emit("error", new Error("Document cannot have multiple document element nodes."));
            return this;
        }
        try {
            this._currentElement = BuilderFunctions_1.fragment(this._builderOptions).ele(p1, p2, p3);
        }
        catch (err) {
            this.emit("error", err);
            return this;
        }
        if (!this._fragment && !this._hasDocumentElement && this._docTypeName !== ""
            && this._currentElement.node._qualifiedName !== this._docTypeName) {
            this.emit("error", new Error("Document element name does not match DocType declaration name."));
            return this;
        }
        this._currentElementSerialized = false;
        if (!this._fragment) {
            this._hasDocumentElement = true;
        }
        return this;
    };
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.att = function (p1, p2, p3) {
        if (this._currentElement === undefined) {
            this.emit("error", new Error("Cannot insert an attribute node as child of a document node."));
            return this;
        }
        try {
            this._currentElement.att(p1, p2, p3);
        }
        catch (err) {
            this.emit("error", err);
            return this;
        }
        return this;
    };
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.com = function (content) {
        this._serializeOpenTag(true);
        var node;
        try {
            node = BuilderFunctions_1.fragment(this._builderOptions).com(content).first().node;
        }
        catch (err) {
            /* istanbul ignore next */
            this.emit("error", err);
            /* istanbul ignore next */
            return this;
        }
        if (this._options.wellFormed && (!algorithm_1.xml_isLegalChar(node.data) ||
            node.data.indexOf("--") !== -1 || node.data.endsWith("-"))) {
            this.emit("error", new Error("Comment data contains invalid characters (well-formed required)."));
            return this;
        }
        this._push(this._writer.comment(node.data));
        return this;
    };
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.txt = function (content) {
        if (!this._fragment && this._currentElement === undefined) {
            this.emit("error", new Error("Cannot insert a text node as child of a document node."));
            return this;
        }
        this._serializeOpenTag(true);
        var node;
        try {
            node = BuilderFunctions_1.fragment(this._builderOptions).txt(content).first().node;
        }
        catch (err) {
            /* istanbul ignore next */
            this.emit("error", err);
            /* istanbul ignore next */
            return this;
        }
        if (this._options.wellFormed && !algorithm_1.xml_isLegalChar(node.data)) {
            this.emit("error", new Error("Text data contains invalid characters (well-formed required)."));
            return this;
        }
        var markup = node.data.replace(/(?!&(lt|gt|amp|apos|quot);)&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        this._push(this._writer.text(markup));
        return this;
    };
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.ins = function (target, content) {
        if (content === void 0) { content = ''; }
        this._serializeOpenTag(true);
        var node;
        try {
            node = BuilderFunctions_1.fragment(this._builderOptions).ins(target, content).first().node;
        }
        catch (err) {
            /* istanbul ignore next */
            this.emit("error", err);
            /* istanbul ignore next */
            return this;
        }
        if (this._options.wellFormed && (node.target.indexOf(":") !== -1 || (/^xml$/i).test(node.target))) {
            this.emit("error", new Error("Processing instruction target contains invalid characters (well-formed required)."));
            return this;
        }
        if (this._options.wellFormed && !algorithm_1.xml_isLegalChar(node.data)) {
            this.emit("error", Error("Processing instruction data contains invalid characters (well-formed required)."));
            return this;
        }
        this._push(this._writer.instruction(node.target, node.data));
        return this;
    };
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.dat = function (content) {
        this._serializeOpenTag(true);
        var node;
        try {
            node = BuilderFunctions_1.fragment(this._builderOptions).dat(content).first().node;
        }
        catch (err) {
            this.emit("error", err);
            return this;
        }
        this._push(this._writer.cdata(node.data));
        return this;
    };
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.dec = function (options) {
        if (options === void 0) { options = { version: "1.0" }; }
        if (this._fragment) {
            this.emit("error", Error("Cannot insert an XML declaration into a document fragment."));
            return this;
        }
        if (this._hasDeclaration) {
            this.emit("error", Error("XML declaration is already inserted."));
            return this;
        }
        this._push(this._writer.declaration(options.version || "1.0", options.encoding, options.standalone));
        this._hasDeclaration = true;
        return this;
    };
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.dtd = function (options) {
        if (this._fragment) {
            this.emit("error", Error("Cannot insert a DocType declaration into a document fragment."));
            return this;
        }
        if (this._docTypeName !== "") {
            this.emit("error", new Error("DocType declaration is already inserted."));
            return this;
        }
        if (this._hasDocumentElement) {
            this.emit("error", new Error("Cannot insert DocType declaration after document element."));
            return this;
        }
        var node;
        try {
            node = BuilderFunctions_1.create().dtd(options).first().node;
        }
        catch (err) {
            this.emit("error", err);
            return this;
        }
        if (this._options.wellFormed && !algorithm_1.xml_isPubidChar(node.publicId)) {
            this.emit("error", new Error("DocType public identifier does not match PubidChar construct (well-formed required)."));
            return this;
        }
        if (this._options.wellFormed &&
            (!algorithm_1.xml_isLegalChar(node.systemId) ||
                (node.systemId.indexOf('"') !== -1 && node.systemId.indexOf("'") !== -1))) {
            this.emit("error", new Error("DocType system identifier contains invalid characters (well-formed required)."));
            return this;
        }
        this._docTypeName = options.name;
        this._push(this._writer.docType(options.name, node.publicId, node.systemId));
        return this;
    };
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.import = function (node) {
        var e_2, _a;
        var frag = BuilderFunctions_1.fragment().set(this._options);
        try {
            frag.import(node);
        }
        catch (err) {
            this.emit("error", err);
            return this;
        }
        try {
            for (var _b = __values(frag.node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var node_1 = _c.value;
                this._fromNode(node_1);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return this;
    };
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.up = function () {
        this._serializeOpenTag(false);
        this._serializeCloseTag();
        return this;
    };
    /** @inheritdoc */
    XMLBuilderCBImpl.prototype.end = function () {
        this._serializeOpenTag(false);
        while (this._openTags.length > 0) {
            this._serializeCloseTag();
        }
        this._push(null);
        return this;
    };
    /**
     * Serializes the opening tag of an element node.
     *
     * @param hasChildren - whether the element node has child nodes
     */
    XMLBuilderCBImpl.prototype._serializeOpenTag = function (hasChildren) {
        if (this._currentElementSerialized)
            return;
        if (this._currentElement === undefined)
            return;
        var node = this._currentElement.node;
        if (this._options.wellFormed && (node.localName.indexOf(":") !== -1 ||
            !algorithm_1.xml_isName(node.localName))) {
            this.emit("error", new Error("Node local name contains invalid characters (well-formed required)."));
            return;
        }
        var qualifiedName = "";
        var ignoreNamespaceDefinitionAttribute = false;
        var map = this._prefixMap.copy();
        var localPrefixesMap = {};
        var localDefaultNamespace = this._recordNamespaceInformation(node, map, localPrefixesMap);
        var inheritedNS = this._openTags.length === 0 ? null : this._openTags[this._openTags.length - 1][1];
        var ns = node.namespaceURI;
        if (ns === null)
            ns = inheritedNS;
        if (inheritedNS === ns) {
            if (localDefaultNamespace !== null) {
                ignoreNamespaceDefinitionAttribute = true;
            }
            if (ns === infra_1.namespace.XML) {
                qualifiedName = "xml:" + node.localName;
            }
            else {
                qualifiedName = node.localName;
            }
            this._writer.beginElement(qualifiedName);
            this._push(this._writer.openTagBegin(qualifiedName));
        }
        else {
            var prefix = node.prefix;
            var candidatePrefix = null;
            if (prefix !== null || ns !== localDefaultNamespace) {
                candidatePrefix = map.get(prefix, ns);
            }
            if (prefix === "xmlns") {
                if (this._options.wellFormed) {
                    this.emit("error", new Error("An element cannot have the 'xmlns' prefix (well-formed required)."));
                    return;
                }
                candidatePrefix = prefix;
            }
            if (candidatePrefix !== null) {
                qualifiedName = candidatePrefix + ':' + node.localName;
                if (localDefaultNamespace !== null && localDefaultNamespace !== infra_1.namespace.XML) {
                    inheritedNS = localDefaultNamespace || null;
                }
                this._writer.beginElement(qualifiedName);
                this._push(this._writer.openTagBegin(qualifiedName));
            }
            else if (prefix !== null) {
                if (prefix in localPrefixesMap) {
                    prefix = this._generatePrefix(ns, map, this._prefixIndex);
                }
                map.set(prefix, ns);
                qualifiedName += prefix + ':' + node.localName;
                this._writer.beginElement(qualifiedName);
                this._push(this._writer.openTagBegin(qualifiedName));
                this._push(this._writer.attribute("xmlns:" + prefix, this._serializeAttributeValue(ns, this._options.wellFormed)));
                if (localDefaultNamespace !== null) {
                    inheritedNS = localDefaultNamespace || null;
                }
            }
            else if (localDefaultNamespace === null ||
                (localDefaultNamespace !== null && localDefaultNamespace !== ns)) {
                ignoreNamespaceDefinitionAttribute = true;
                qualifiedName += node.localName;
                inheritedNS = ns;
                this._writer.beginElement(qualifiedName);
                this._push(this._writer.openTagBegin(qualifiedName));
                this._push(this._writer.attribute("xmlns", this._serializeAttributeValue(ns, this._options.wellFormed)));
            }
            else {
                qualifiedName += node.localName;
                inheritedNS = ns;
                this._writer.beginElement(qualifiedName);
                this._push(this._writer.openTagBegin(qualifiedName));
            }
        }
        this._serializeAttributes(node, map, this._prefixIndex, localPrefixesMap, ignoreNamespaceDefinitionAttribute, this._options.wellFormed);
        var isHTML = (ns === infra_1.namespace.HTML);
        if (isHTML && !hasChildren &&
            XMLBuilderCBImpl._VoidElementNames.has(node.localName)) {
            this._push(this._writer.openTagEnd(qualifiedName, true, true));
            this._writer.endElement(qualifiedName);
        }
        else if (!isHTML && !hasChildren) {
            this._push(this._writer.openTagEnd(qualifiedName, true, false));
            this._writer.endElement(qualifiedName);
        }
        else {
            this._push(this._writer.openTagEnd(qualifiedName, false, false));
        }
        this._currentElementSerialized = true;
        /**
         * Save qualified name, original inherited ns, original prefix map, and
         * hasChildren flag.
         */
        this._openTags.push([qualifiedName, inheritedNS, this._prefixMap, hasChildren]);
        /**
         * New values of inherited namespace and prefix map will be used while
         * serializing child nodes. They will be returned to their original values
         * when this node is closed using the _openTags array item we saved above.
         */
        if (this._isPrefixMapModified(this._prefixMap, map)) {
            this._prefixMap = map;
        }
        /**
         * Calls following this will either serialize child nodes or close this tag.
         */
        this._writer.level++;
    };
    /**
     * Serializes the closing tag of an element node.
     */
    XMLBuilderCBImpl.prototype._serializeCloseTag = function () {
        this._writer.level--;
        var lastEle = this._openTags.pop();
        /* istanbul ignore next */
        if (lastEle === undefined) {
            this.emit("error", new Error("Last element is undefined."));
            return;
        }
        var _a = __read(lastEle, 4), qualifiedName = _a[0], ns = _a[1], map = _a[2], hasChildren = _a[3];
        /**
         * Restore original values of inherited namespace and prefix map.
         */
        this._prefixMap = map;
        if (!hasChildren)
            return;
        this._push(this._writer.closeTag(qualifiedName));
        this._writer.endElement(qualifiedName);
    };
    /**
     * Pushes data to internal buffer.
     *
     * @param data - data
     */
    XMLBuilderCBImpl.prototype._push = function (data) {
        if (data === null) {
            this._ended = true;
            this.emit("end");
        }
        else if (this._ended) {
            this.emit("error", new Error("Cannot push to ended stream."));
        }
        else if (data.length !== 0) {
            this._writer.hasData = true;
            this.emit("data", data, this._writer.level);
        }
    };
    /**
     * Reads and serializes an XML tree.
     *
     * @param node - root node
     */
    XMLBuilderCBImpl.prototype._fromNode = function (node) {
        var e_3, _a, e_4, _b;
        if (util_2.Guard.isElementNode(node)) {
            var name = node.prefix ? node.prefix + ":" + node.localName : node.localName;
            if (node.namespaceURI !== null) {
                this.ele(node.namespaceURI, name);
            }
            else {
                this.ele(name);
            }
            try {
                for (var _c = __values(node.attributes), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var attr = _d.value;
                    var name_1 = attr.prefix ? attr.prefix + ":" + attr.localName : attr.localName;
                    if (attr.namespaceURI !== null) {
                        this.att(attr.namespaceURI, name_1, attr.value);
                    }
                    else {
                        this.att(name_1, attr.value);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var _e = __values(node.childNodes), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var child = _f.value;
                    this._fromNode(child);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_4) throw e_4.error; }
            }
            this.up();
        }
        else if (util_2.Guard.isExclusiveTextNode(node) && node.data) {
            this.txt(node.data);
        }
        else if (util_2.Guard.isCommentNode(node)) {
            this.com(node.data);
        }
        else if (util_2.Guard.isCDATASectionNode(node)) {
            this.dat(node.data);
        }
        else if (util_2.Guard.isProcessingInstructionNode(node)) {
            this.ins(node.target, node.data);
        }
    };
    /**
     * Produces an XML serialization of the attributes of an element node.
     *
     * @param node - node to serialize
     * @param map - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param localPrefixesMap - local prefixes map
     * @param ignoreNamespaceDefinitionAttribute - whether to ignore namespace
     * attributes
     * @param requireWellFormed - whether to check conformance
     */
    XMLBuilderCBImpl.prototype._serializeAttributes = function (node, map, prefixIndex, localPrefixesMap, ignoreNamespaceDefinitionAttribute, requireWellFormed) {
        var e_5, _a;
        var localNameSet = requireWellFormed ? new LocalNameSet_1.LocalNameSet() : undefined;
        try {
            for (var _b = __values(node.attributes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var attr = _c.value;
                // Optimize common case
                if (!requireWellFormed && !ignoreNamespaceDefinitionAttribute && attr.namespaceURI === null) {
                    this._push(this._writer.attribute(attr.localName, this._serializeAttributeValue(attr.value, this._options.wellFormed)));
                    continue;
                }
                if (requireWellFormed && localNameSet && localNameSet.has(attr.namespaceURI, attr.localName)) {
                    this.emit("error", new Error("Element contains duplicate attributes (well-formed required)."));
                    return;
                }
                if (requireWellFormed && localNameSet)
                    localNameSet.set(attr.namespaceURI, attr.localName);
                var attributeNamespace = attr.namespaceURI;
                var candidatePrefix = null;
                if (attributeNamespace !== null) {
                    candidatePrefix = map.get(attr.prefix, attributeNamespace);
                    if (attributeNamespace === infra_1.namespace.XMLNS) {
                        if (attr.value === infra_1.namespace.XML ||
                            (attr.prefix === null && ignoreNamespaceDefinitionAttribute) ||
                            (attr.prefix !== null && (!(attr.localName in localPrefixesMap) ||
                                localPrefixesMap[attr.localName] !== attr.value) &&
                                map.has(attr.localName, attr.value)))
                            continue;
                        if (requireWellFormed && attr.value === infra_1.namespace.XMLNS) {
                            this.emit("error", new Error("XMLNS namespace is reserved (well-formed required)."));
                            return;
                        }
                        if (requireWellFormed && attr.value === '') {
                            this.emit("error", new Error("Namespace prefix declarations cannot be used to undeclare a namespace (well-formed required)."));
                            return;
                        }
                        if (attr.prefix === 'xmlns')
                            candidatePrefix = 'xmlns';
                        /**
                         * _Note:_ The (candidatePrefix === null) check is not in the spec.
                         * We deviate from the spec here. Otherwise a prefix is generated for
                         * all attributes with namespaces.
                         */
                    }
                    else if (candidatePrefix === null) {
                        if (attr.prefix !== null &&
                            (!map.hasPrefix(attr.prefix) ||
                                map.has(attr.prefix, attributeNamespace))) {
                            /**
                             * Check if we can use the attribute's own prefix.
                             * We deviate from the spec here.
                             * TODO: This is not an efficient way of searching for prefixes.
                             * Follow developments to the spec.
                             */
                            candidatePrefix = attr.prefix;
                        }
                        else {
                            candidatePrefix = this._generatePrefix(attributeNamespace, map, prefixIndex);
                        }
                        this._push(this._writer.attribute("xmlns:" + candidatePrefix, this._serializeAttributeValue(attributeNamespace, this._options.wellFormed)));
                    }
                }
                if (requireWellFormed && (attr.localName.indexOf(":") !== -1 ||
                    !algorithm_1.xml_isName(attr.localName) ||
                    (attr.localName === "xmlns" && attributeNamespace === null))) {
                    this.emit("error", new Error("Attribute local name contains invalid characters (well-formed required)."));
                    return;
                }
                this._push(this._writer.attribute((candidatePrefix !== null ? candidatePrefix + ":" : "") + attr.localName, this._serializeAttributeValue(attr.value, this._options.wellFormed)));
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    /**
     * Produces an XML serialization of an attribute value.
     *
     * @param value - attribute value
     * @param requireWellFormed - whether to check conformance
     */
    XMLBuilderCBImpl.prototype._serializeAttributeValue = function (value, requireWellFormed) {
        if (requireWellFormed && value !== null && !algorithm_1.xml_isLegalChar(value)) {
            this.emit("error", new Error("Invalid characters in attribute value."));
            return "";
        }
        if (value === null)
            return "";
        return value.replace(/(?!&(lt|gt|amp|apos|quot);)&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };
    /**
     * Records namespace information for the given element and returns the
     * default namespace attribute value.
     *
     * @param node - element node to process
     * @param map - namespace prefix map
     * @param localPrefixesMap - local prefixes map
     */
    XMLBuilderCBImpl.prototype._recordNamespaceInformation = function (node, map, localPrefixesMap) {
        var e_6, _a;
        var defaultNamespaceAttrValue = null;
        try {
            for (var _b = __values(node.attributes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var attr = _c.value;
                var attributeNamespace = attr.namespaceURI;
                var attributePrefix = attr.prefix;
                if (attributeNamespace === infra_1.namespace.XMLNS) {
                    if (attributePrefix === null) {
                        defaultNamespaceAttrValue = attr.value;
                        continue;
                    }
                    else {
                        var prefixDefinition = attr.localName;
                        var namespaceDefinition = attr.value;
                        if (namespaceDefinition === infra_1.namespace.XML) {
                            continue;
                        }
                        if (namespaceDefinition === '') {
                            namespaceDefinition = null;
                        }
                        if (map.has(prefixDefinition, namespaceDefinition)) {
                            continue;
                        }
                        map.set(prefixDefinition, namespaceDefinition);
                        localPrefixesMap[prefixDefinition] = namespaceDefinition || '';
                    }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return defaultNamespaceAttrValue;
    };
    /**
     * Generates a new prefix for the given namespace.
     *
     * @param newNamespace - a namespace to generate prefix for
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     */
    XMLBuilderCBImpl.prototype._generatePrefix = function (newNamespace, prefixMap, prefixIndex) {
        var generatedPrefix = "ns" + prefixIndex.value;
        prefixIndex.value++;
        prefixMap.set(generatedPrefix, newNamespace);
        return generatedPrefix;
    };
    /**
     * Determines if the namespace prefix map was modified from its original.
     *
     * @param originalMap - original namespace prefix map
     * @param newMap - new namespace prefix map
     */
    XMLBuilderCBImpl.prototype._isPrefixMapModified = function (originalMap, newMap) {
        var items1 = originalMap._items;
        var items2 = newMap._items;
        var nullItems1 = originalMap._nullItems;
        var nullItems2 = newMap._nullItems;
        for (var key in items2) {
            var arr1 = items1[key];
            if (arr1 === undefined)
                return true;
            var arr2 = items2[key];
            if (arr1.length !== arr2.length)
                return true;
            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i])
                    return true;
            }
        }
        if (nullItems1.length !== nullItems2.length)
            return true;
        for (var i = 0; i < nullItems1.length; i++) {
            if (nullItems1[i] !== nullItems2[i])
                return true;
        }
        return false;
    };
    XMLBuilderCBImpl._VoidElementNames = new Set(['area', 'base', 'basefont',
        'bgsound', 'br', 'col', 'embed', 'frame', 'hr', 'img', 'input', 'keygen',
        'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr']);
    return XMLBuilderCBImpl;
}(events_1.EventEmitter));
exports.XMLBuilderCBImpl = XMLBuilderCBImpl;
//# sourceMappingURL=XMLBuilderCBImpl.js.map