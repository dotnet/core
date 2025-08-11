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
var DOMImpl_1 = require("./DOMImpl");
var interfaces_1 = require("./interfaces");
var DOMException_1 = require("./DOMException");
var NodeImpl_1 = require("./NodeImpl");
var util_1 = require("../util");
var util_2 = require("@oozcitak/util");
var infra_1 = require("@oozcitak/infra");
var URLAlgorithm_1 = require("@oozcitak/url/lib/URLAlgorithm");
var algorithm_1 = require("../algorithm");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a document node.
 */
var DocumentImpl = /** @class */ (function (_super) {
    __extends(DocumentImpl, _super);
    /**
     * Initializes a new instance of `Document`.
     */
    function DocumentImpl() {
        var _this = _super.call(this) || this;
        _this._children = new Set();
        _this._encoding = {
            name: "UTF-8",
            labels: ["unicode-1-1-utf-8", "utf-8", "utf8"]
        };
        _this._contentType = 'application/xml';
        _this._URL = {
            scheme: "about",
            username: "",
            password: "",
            host: null,
            port: null,
            path: ["blank"],
            query: null,
            fragment: null,
            _cannotBeABaseURLFlag: true,
            _blobURLEntry: null
        };
        _this._origin = null;
        _this._type = "xml";
        _this._mode = "no-quirks";
        _this._documentElement = null;
        _this._hasNamespaces = false;
        _this._nodeDocumentOverwrite = null;
        return _this;
    }
    Object.defineProperty(DocumentImpl.prototype, "_nodeDocument", {
        get: function () { return this._nodeDocumentOverwrite || this; },
        set: function (val) { this._nodeDocumentOverwrite = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "implementation", {
        /** @inheritdoc */
        get: function () {
            /**
             * The implementation attribute’s getter must return the DOMImplementation
             * object that is associated with the document.
             */
            return this._implementation || (this._implementation = algorithm_1.create_domImplementation(this));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "URL", {
        /** @inheritdoc */
        get: function () {
            /**
             * The URL attribute’s getter and documentURI attribute’s getter must return
             * the URL, serialized.
             * See: https://url.spec.whatwg.org/#concept-url-serializer
             */
            return URLAlgorithm_1.urlSerializer(this._URL);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "documentURI", {
        /** @inheritdoc */
        get: function () { return this.URL; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "origin", {
        /** @inheritdoc */
        get: function () {
            return "null";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "compatMode", {
        /** @inheritdoc */
        get: function () {
            /**
             * The compatMode attribute’s getter must return "BackCompat" if context
             * object’s mode is "quirks", and "CSS1Compat" otherwise.
             */
            return this._mode === "quirks" ? "BackCompat" : "CSS1Compat";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "characterSet", {
        /** @inheritdoc */
        get: function () {
            /**
             * The characterSet attribute’s getter, charset attribute’s getter, and
             * inputEncoding attribute’s getter, must return context object’s
             * encoding’s name.
             */
            return this._encoding.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "charset", {
        /** @inheritdoc */
        get: function () { return this._encoding.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "inputEncoding", {
        /** @inheritdoc */
        get: function () { return this._encoding.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "contentType", {
        /** @inheritdoc */
        get: function () {
            /**
             * The contentType attribute’s getter must return the content type.
             */
            return this._contentType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "doctype", {
        /** @inheritdoc */
        get: function () {
            var e_1, _a;
            try {
                /**
                 * The doctype attribute’s getter must return the child of the document
                 * that is a doctype, and null otherwise.
                 */
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (util_1.Guard.isDocumentTypeNode(child))
                        return child;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "documentElement", {
        /** @inheritdoc */
        get: function () {
            /**
             * The documentElement attribute’s getter must return the document element.
             */
            return this._documentElement;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    DocumentImpl.prototype.getElementsByTagName = function (qualifiedName) {
        /**
         * The getElementsByTagName(qualifiedName) method, when invoked, must return
         * the list of elements with qualified name qualifiedName for the context object.
         */
        return algorithm_1.node_listOfElementsWithQualifiedName(qualifiedName, this);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.getElementsByTagNameNS = function (namespace, localName) {
        /**
         * The getElementsByTagNameNS(namespace, localName) method, when invoked,
         * must return the list of elements with namespace namespace and local name
         * localName for the context object.
         */
        return algorithm_1.node_listOfElementsWithNamespace(namespace, localName, this);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.getElementsByClassName = function (classNames) {
        /**
         * The getElementsByClassName(classNames) method, when invoked, must return
         * the list of elements with class names classNames for the context object.
         */
        return algorithm_1.node_listOfElementsWithClassNames(classNames, this);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createElement = function (localName, options) {
        /**
         * 1. If localName does not match the Name production, then throw an
         * "InvalidCharacterError" DOMException.
         * 2. If the context object is an HTML document, then set localName to
         * localName in ASCII lowercase.
         * 3. Let is be null.
         * 4. If options is a dictionary and options’s is is present, then set is
         * to it.
         * 5. Let namespace be the HTML namespace, if the context object is an
         * HTML document or context object’s content type is
         * "application/xhtml+xml", and null otherwise.
         * 6. Return the result of creating an element given the context object,
         * localName, namespace, null, is, and with the synchronous custom elements
         * flag set.
         */
        if (!algorithm_1.xml_isName(localName))
            throw new DOMException_1.InvalidCharacterError();
        if (this._type === "html")
            localName = localName.toLowerCase();
        var is = null;
        if (options !== undefined) {
            if (util_2.isString(options)) {
                is = options;
            }
            else {
                is = options.is;
            }
        }
        var namespace = (this._type === "html" || this._contentType === "application/xhtml+xml") ?
            infra_1.namespace.HTML : null;
        return algorithm_1.element_createAnElement(this, localName, namespace, null, is, true);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createElementNS = function (namespace, qualifiedName, options) {
        /**
         * The createElementNS(namespace, qualifiedName, options) method, when
         * invoked, must return the result of running the internal createElementNS
         * steps, given context object, namespace, qualifiedName, and options.
         */
        return algorithm_1.document_internalCreateElementNS(this, namespace, qualifiedName, options);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createDocumentFragment = function () {
        /**
         * The createDocumentFragment() method, when invoked, must return a new
         * DocumentFragment node with its node document set to the context object.
         */
        return algorithm_1.create_documentFragment(this);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createTextNode = function (data) {
        /**
         * The createTextNode(data) method, when invoked, must return a new Text
         * node with its data set to data and node document set to the context object.
         */
        return algorithm_1.create_text(this, data);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createCDATASection = function (data) {
        /**
         * 1. If context object is an HTML document, then throw a
         * "NotSupportedError" DOMException.
         * 2. If data contains the string "]]>", then throw an
         * "InvalidCharacterError" DOMException.
         * 3. Return a new CDATASection node with its data set to data and node
         * document set to the context object.
         */
        if (this._type === "html")
            throw new DOMException_1.NotSupportedError();
        if (data.indexOf(']]>') !== -1)
            throw new DOMException_1.InvalidCharacterError();
        return algorithm_1.create_cdataSection(this, data);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createComment = function (data) {
        /**
         * The createComment(data) method, when invoked, must return a new Comment
         * node with its data set to data and node document set to the context object.
         */
        return algorithm_1.create_comment(this, data);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createProcessingInstruction = function (target, data) {
        /**
         * 1. If target does not match the Name production, then throw an
         * "InvalidCharacterError" DOMException.
         * 2. If data contains the string "?>", then throw an
         * "InvalidCharacterError" DOMException.
         * 3. Return a new ProcessingInstruction node, with target set to target,
         * data set to data, and node document set to the context object.
         */
        if (!algorithm_1.xml_isName(target))
            throw new DOMException_1.InvalidCharacterError();
        if (data.indexOf("?>") !== -1)
            throw new DOMException_1.InvalidCharacterError();
        return algorithm_1.create_processingInstruction(this, target, data);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.importNode = function (node, deep) {
        if (deep === void 0) { deep = false; }
        /**
         * 1. If node is a document or shadow root, then throw a "NotSupportedError" DOMException.
         */
        if (util_1.Guard.isDocumentNode(node) || util_1.Guard.isShadowRoot(node))
            throw new DOMException_1.NotSupportedError();
        /**
         * 2. Return a clone of node, with context object and the clone children flag set if deep is true.
         */
        return algorithm_1.node_clone(node, this, deep);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.adoptNode = function (node) {
        /**
         * 1. If node is a document, then throw a "NotSupportedError" DOMException.
         */
        if (util_1.Guard.isDocumentNode(node))
            throw new DOMException_1.NotSupportedError();
        /**
         * 2. If node is a shadow root, then throw a "HierarchyRequestError" DOMException.
         */
        if (util_1.Guard.isShadowRoot(node))
            throw new DOMException_1.HierarchyRequestError();
        /**
         * 3. Adopt node into the context object.
         * 4. Return node.
         */
        algorithm_1.document_adopt(node, this);
        return node;
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createAttribute = function (localName) {
        /**
         * 1. If localName does not match the Name production in XML, then throw
         * an "InvalidCharacterError" DOMException.
         * 2. If the context object is an HTML document, then set localName to
         * localName in ASCII lowercase.
         * 3. Return a new attribute whose local name is localName and node document
         * is context object.
         */
        if (!algorithm_1.xml_isName(localName))
            throw new DOMException_1.InvalidCharacterError();
        if (this._type === "html") {
            localName = localName.toLowerCase();
        }
        var attr = algorithm_1.create_attr(this, localName);
        return attr;
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createAttributeNS = function (namespace, qualifiedName) {
        /**
         * 1. Let namespace, prefix, and localName be the result of passing
         * namespace and qualifiedName to validate and extract.
         * 2. Return a new attribute whose namespace is namespace, namespace prefix
         * is prefix, local name is localName, and node document is context object.
         */
        var _a = __read(algorithm_1.namespace_validateAndExtract(namespace, qualifiedName), 3), ns = _a[0], prefix = _a[1], localName = _a[2];
        var attr = algorithm_1.create_attr(this, localName);
        attr._namespace = ns;
        attr._namespacePrefix = prefix;
        return attr;
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createEvent = function (eventInterface) {
        return algorithm_1.event_createLegacyEvent(eventInterface);
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createRange = function () {
        /**
         * The createRange() method, when invoked, must return a new live range
         * with (context object, 0) as its start and end.
         */
        var range = algorithm_1.create_range();
        range._start = [this, 0];
        range._end = [this, 0];
        return range;
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createNodeIterator = function (root, whatToShow, filter) {
        if (whatToShow === void 0) { whatToShow = interfaces_1.WhatToShow.All; }
        if (filter === void 0) { filter = null; }
        /**
         * 1. Let iterator be a new NodeIterator object.
         * 2. Set iterator’s root and iterator’s reference to root.
         * 3. Set iterator’s pointer before reference to true.
         * 4. Set iterator’s whatToShow to whatToShow.
         * 5. Set iterator’s filter to filter.
         * 6. Return iterator.
         */
        var iterator = algorithm_1.create_nodeIterator(root, root, true);
        iterator._whatToShow = whatToShow;
        iterator._iteratorCollection = algorithm_1.create_nodeList(root);
        if (util_2.isFunction(filter)) {
            iterator._filter = algorithm_1.create_nodeFilter();
            iterator._filter.acceptNode = filter;
        }
        else {
            iterator._filter = filter;
        }
        return iterator;
    };
    /** @inheritdoc */
    DocumentImpl.prototype.createTreeWalker = function (root, whatToShow, filter) {
        if (whatToShow === void 0) { whatToShow = interfaces_1.WhatToShow.All; }
        if (filter === void 0) { filter = null; }
        /**
         * 1. Let walker be a new TreeWalker object.
         * 2. Set walker’s root and walker’s current to root.
         * 3. Set walker’s whatToShow to whatToShow.
         * 4. Set walker’s filter to filter.
         * 5. Return walker.
         */
        var walker = algorithm_1.create_treeWalker(root, root);
        walker._whatToShow = whatToShow;
        if (util_2.isFunction(filter)) {
            walker._filter = algorithm_1.create_nodeFilter();
            walker._filter.acceptNode = filter;
        }
        else {
            walker._filter = filter;
        }
        return walker;
    };
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */
    DocumentImpl.prototype._getTheParent = function (event) {
        /**
         * TODO: Implement realms
         * A document’s get the parent algorithm, given an event, returns null if
         * event’s type attribute value is "load" or document does not have a
         * browsing context, and the document’s relevant global object otherwise.
         */
        if (event._type === "load") {
            return null;
        }
        else {
            return DOMImpl_1.dom.window;
        }
    };
    // MIXIN: NonElementParentNode
    /* istanbul ignore next */
    DocumentImpl.prototype.getElementById = function (elementId) { throw new Error("Mixin: NonElementParentNode not implemented."); };
    Object.defineProperty(DocumentImpl.prototype, "children", {
        // MIXIN: DocumentOrShadowRoot
        // No elements
        // MIXIN: ParentNode
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "firstElementChild", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "lastElementChild", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentImpl.prototype, "childElementCount", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    /* istanbul ignore next */
    DocumentImpl.prototype.prepend = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ParentNode not implemented.");
    };
    /* istanbul ignore next */
    DocumentImpl.prototype.append = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ParentNode not implemented.");
    };
    /* istanbul ignore next */
    DocumentImpl.prototype.querySelector = function (selectors) { throw new Error("Mixin: ParentNode not implemented."); };
    /* istanbul ignore next */
    DocumentImpl.prototype.querySelectorAll = function (selectors) { throw new Error("Mixin: ParentNode not implemented."); };
    return DocumentImpl;
}(NodeImpl_1.NodeImpl));
exports.DocumentImpl = DocumentImpl;
/**
 * Initialize prototype properties
 */
WebIDLAlgorithm_1.idl_defineConst(DocumentImpl.prototype, "_nodeType", interfaces_1.NodeType.Document);
//# sourceMappingURL=DocumentImpl.js.map