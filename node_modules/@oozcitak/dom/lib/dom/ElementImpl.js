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
var interfaces_1 = require("./interfaces");
var NodeImpl_1 = require("./NodeImpl");
var DOMException_1 = require("./DOMException");
var infra_1 = require("@oozcitak/infra");
var algorithm_1 = require("../algorithm");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents an element node.
 */
var ElementImpl = /** @class */ (function (_super) {
    __extends(ElementImpl, _super);
    /**
     * Initializes a new instance of `Element`.
     */
    function ElementImpl() {
        var _this = _super.call(this) || this;
        _this._children = new Set();
        _this._namespace = null;
        _this._namespacePrefix = null;
        _this._localName = "";
        _this._customElementState = "undefined";
        _this._customElementDefinition = null;
        _this._is = null;
        _this._shadowRoot = null;
        _this._attributeList = algorithm_1.create_namedNodeMap(_this);
        _this._attributeChangeSteps = [];
        _this._name = '';
        _this._assignedSlot = null;
        return _this;
    }
    Object.defineProperty(ElementImpl.prototype, "namespaceURI", {
        /** @inheritdoc */
        get: function () { return this._namespace; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "prefix", {
        /** @inheritdoc */
        get: function () { return this._namespacePrefix; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "localName", {
        /** @inheritdoc */
        get: function () { return this._localName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "tagName", {
        /** @inheritdoc */
        get: function () { return this._htmlUppercasedQualifiedName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "id", {
        /** @inheritdoc */
        get: function () {
            return algorithm_1.element_getAnAttributeValue(this, "id");
        },
        set: function (value) {
            algorithm_1.element_setAnAttributeValue(this, "id", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "className", {
        /** @inheritdoc */
        get: function () {
            return algorithm_1.element_getAnAttributeValue(this, "class");
        },
        set: function (value) {
            algorithm_1.element_setAnAttributeValue(this, "class", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "classList", {
        /** @inheritdoc */
        get: function () {
            var attr = algorithm_1.element_getAnAttributeByName("class", this);
            if (attr === null) {
                attr = algorithm_1.create_attr(this._nodeDocument, "class");
            }
            return algorithm_1.create_domTokenList(this, attr);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "slot", {
        /** @inheritdoc */
        get: function () {
            return algorithm_1.element_getAnAttributeValue(this, "slot");
        },
        set: function (value) {
            algorithm_1.element_setAnAttributeValue(this, "slot", value);
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    ElementImpl.prototype.hasAttributes = function () {
        return this._attributeList.length !== 0;
    };
    Object.defineProperty(ElementImpl.prototype, "attributes", {
        /** @inheritdoc */
        get: function () { return this._attributeList; },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    ElementImpl.prototype.getAttributeNames = function () {
        var e_1, _a;
        /**
         * The getAttributeNames() method, when invoked, must return the qualified
         * names of the attributes in context object’s attribute list, in order,
         * and a new list otherwise.
         */
        var names = [];
        try {
            for (var _b = __values(this._attributeList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var attr = _c.value;
                names.push(attr._qualifiedName);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return names;
    };
    /** @inheritdoc */
    ElementImpl.prototype.getAttribute = function (qualifiedName) {
        /**
         * 1. Let attr be the result of getting an attribute given qualifiedName
         * and the context object.
         * 2. If attr is null, return null.
         * 3. Return attr’s value.
         */
        var attr = algorithm_1.element_getAnAttributeByName(qualifiedName, this);
        return (attr ? attr._value : null);
    };
    /** @inheritdoc */
    ElementImpl.prototype.getAttributeNS = function (namespace, localName) {
        /**
         * 1. Let attr be the result of getting an attribute given namespace,
         * localName, and the context object.
         * 2. If attr is null, return null.
         * 3. Return attr’s value.
         */
        var attr = algorithm_1.element_getAnAttributeByNamespaceAndLocalName(namespace, localName, this);
        return (attr ? attr._value : null);
    };
    /** @inheritdoc */
    ElementImpl.prototype.setAttribute = function (qualifiedName, value) {
        /**
         * 1. If qualifiedName does not match the Name production in XML, then
         * throw an "InvalidCharacterError" DOMException.
         */
        if (!algorithm_1.xml_isName(qualifiedName))
            throw new DOMException_1.InvalidCharacterError();
        /**
         * 2. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * lowercase.
         */
        if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toLowerCase();
        }
        /**
         * 3. Let attribute be the first attribute in context object’s attribute
         * list whose qualified name is qualifiedName, and null otherwise.
         */
        var attribute = null;
        for (var i = 0; i < this._attributeList.length; i++) {
            var attr = this._attributeList[i];
            if (attr._qualifiedName === qualifiedName) {
                attribute = attr;
                break;
            }
        }
        /**
         * 4. If attribute is null, create an attribute whose local name is
         * qualifiedName, value is value, and node document is context object’s
         * node document, then append this attribute to context object, and
         * then return.
         */
        if (attribute === null) {
            attribute = algorithm_1.create_attr(this._nodeDocument, qualifiedName);
            attribute._value = value;
            algorithm_1.element_append(attribute, this);
            return;
        }
        /**
         * 5. Change attribute from context object to value.
         */
        algorithm_1.element_change(attribute, this, value);
    };
    /** @inheritdoc */
    ElementImpl.prototype.setAttributeNS = function (namespace, qualifiedName, value) {
        /**
         * 1. Let namespace, prefix, and localName be the result of passing
         * namespace and qualifiedName to validate and extract.
         * 2. Set an attribute value for the context object using localName, value,
         * and also prefix and namespace.
         */
        var _a = __read(algorithm_1.namespace_validateAndExtract(namespace, qualifiedName), 3), ns = _a[0], prefix = _a[1], localName = _a[2];
        algorithm_1.element_setAnAttributeValue(this, localName, value, prefix, ns);
    };
    /** @inheritdoc */
    ElementImpl.prototype.removeAttribute = function (qualifiedName) {
        /**
         * The removeAttribute(qualifiedName) method, when invoked, must remove an
         * attribute given qualifiedName and the context object, and then return
         * undefined.
         */
        algorithm_1.element_removeAnAttributeByName(qualifiedName, this);
    };
    /** @inheritdoc */
    ElementImpl.prototype.removeAttributeNS = function (namespace, localName) {
        /**
         * The removeAttributeNS(namespace, localName) method, when invoked, must
         * remove an attribute given namespace, localName, and context object, and
         * then return undefined.
         */
        algorithm_1.element_removeAnAttributeByNamespaceAndLocalName(namespace, localName, this);
    };
    /** @inheritdoc */
    ElementImpl.prototype.hasAttribute = function (qualifiedName) {
        /**
         * 1. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * lowercase.
         * 2. Return true if the context object has an attribute whose qualified
         * name is qualifiedName, and false otherwise.
         */
        if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toLowerCase();
        }
        for (var i = 0; i < this._attributeList.length; i++) {
            var attr = this._attributeList[i];
            if (attr._qualifiedName === qualifiedName) {
                return true;
            }
        }
        return false;
    };
    /** @inheritdoc */
    ElementImpl.prototype.toggleAttribute = function (qualifiedName, force) {
        /**
         * 1. If qualifiedName does not match the Name production in XML, then
         * throw an "InvalidCharacterError" DOMException.
         */
        if (!algorithm_1.xml_isName(qualifiedName))
            throw new DOMException_1.InvalidCharacterError();
        /**
         * 2. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * lowercase.
         */
        if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toLowerCase();
        }
        /**
         * 3. Let attribute be the first attribute in the context object’s attribute
         * list whose qualified name is qualifiedName, and null otherwise.
         */
        var attribute = null;
        for (var i = 0; i < this._attributeList.length; i++) {
            var attr = this._attributeList[i];
            if (attr._qualifiedName === qualifiedName) {
                attribute = attr;
                break;
            }
        }
        if (attribute === null) {
            /**
             * 4. If attribute is null, then:
             * 4.1. If force is not given or is true, create an attribute whose local
             * name is qualifiedName, value is the empty string, and node document is
             * the context object’s node document, then append this attribute to the
             * context object, and then return true.
             * 4.2. Return false.
             */
            if (force === undefined || force === true) {
                attribute = algorithm_1.create_attr(this._nodeDocument, qualifiedName);
                attribute._value = '';
                algorithm_1.element_append(attribute, this);
                return true;
            }
            return false;
        }
        else if (force === undefined || force === false) {
            /**
             * 5. Otherwise, if force is not given or is false, remove an attribute
             * given qualifiedName and the context object, and then return false.
             */
            algorithm_1.element_removeAnAttributeByName(qualifiedName, this);
            return false;
        }
        /**
         * 6. Return true.
         */
        return true;
    };
    /** @inheritdoc */
    ElementImpl.prototype.hasAttributeNS = function (namespace, localName) {
        /**
         * 1. If namespace is the empty string, set it to null.
         * 2. Return true if the context object has an attribute whose namespace is
         * namespace and local name is localName, and false otherwise.
         */
        var ns = namespace || null;
        for (var i = 0; i < this._attributeList.length; i++) {
            var attr = this._attributeList[i];
            if (attr._namespace === ns && attr._localName === localName) {
                return true;
            }
        }
        return false;
    };
    /** @inheritdoc */
    ElementImpl.prototype.getAttributeNode = function (qualifiedName) {
        /**
         * The getAttributeNode(qualifiedName) method, when invoked, must return the
         * result of getting an attribute given qualifiedName and context object.
         */
        return algorithm_1.element_getAnAttributeByName(qualifiedName, this);
    };
    /** @inheritdoc */
    ElementImpl.prototype.getAttributeNodeNS = function (namespace, localName) {
        /**
         * The getAttributeNodeNS(namespace, localName) method, when invoked, must
         * return the result of getting an attribute given namespace, localName, and
         * the context object.
         */
        return algorithm_1.element_getAnAttributeByNamespaceAndLocalName(namespace, localName, this);
    };
    /** @inheritdoc */
    ElementImpl.prototype.setAttributeNode = function (attr) {
        /**
         * The setAttributeNode(attr) and setAttributeNodeNS(attr) methods, when
         * invoked, must return the result of setting an attribute given attr and
         * the context object.
         */
        return algorithm_1.element_setAnAttribute(attr, this);
    };
    /** @inheritdoc */
    ElementImpl.prototype.setAttributeNodeNS = function (attr) {
        return algorithm_1.element_setAnAttribute(attr, this);
    };
    /** @inheritdoc */
    ElementImpl.prototype.removeAttributeNode = function (attr) {
        /**
         * 1. If context object’s attribute list does not contain attr, then throw
         * a "NotFoundError" DOMException.
         * 2. Remove attr from context object.
         * 3. Return attr.
         */
        var found = false;
        for (var i = 0; i < this._attributeList.length; i++) {
            var attribute = this._attributeList[i];
            if (attribute === attr) {
                found = true;
                break;
            }
        }
        if (!found)
            throw new DOMException_1.NotFoundError();
        algorithm_1.element_remove(attr, this);
        return attr;
    };
    /** @inheritdoc */
    ElementImpl.prototype.attachShadow = function (init) {
        /**
         * 1. If context object’s namespace is not the HTML namespace, then throw a
         * "NotSupportedError" DOMException.
         */
        if (this._namespace !== infra_1.namespace.HTML)
            throw new DOMException_1.NotSupportedError();
        /**
         * 2. If context object’s local name is not a valid custom element name,
         * "article", "aside", "blockquote", "body", "div", "footer", "h1", "h2",
         * "h3", "h4", "h5", "h6", "header", "main" "nav", "p", "section",
         * or "span", then throw a "NotSupportedError" DOMException.
         */
        if (!algorithm_1.customElement_isValidCustomElementName(this._localName) &&
            !algorithm_1.customElement_isValidShadowHostName(this._localName))
            throw new DOMException_1.NotSupportedError();
        /**
         * 3. If context object’s local name is a valid custom element name,
         * or context object’s is value is not null, then:
         * 3.1. Let definition be the result of looking up a custom element
         * definition given context object’s node document, its namespace, its
         * local name, and its is value.
         * 3.2. If definition is not null and definition’s disable shadow is true,
         *  then throw a "NotSupportedError" DOMException.
         */
        if (algorithm_1.customElement_isValidCustomElementName(this._localName) || this._is !== null) {
            var definition = algorithm_1.customElement_lookUpACustomElementDefinition(this._nodeDocument, this._namespace, this._localName, this._is);
            if (definition !== null && definition.disableShadow === true) {
                throw new DOMException_1.NotSupportedError();
            }
        }
        /**
         * 4. If context object is a shadow host, then throw an "NotSupportedError"
         * DOMException.
         */
        if (this._shadowRoot !== null)
            throw new DOMException_1.NotSupportedError();
        /**
         * 5. Let shadow be a new shadow root whose node document is context
         * object’s node document, host is context object, and mode is init’s mode.
         * 6. Set context object’s shadow root to shadow.
         * 7. Return shadow.
         */
        var shadow = algorithm_1.create_shadowRoot(this._nodeDocument, this);
        shadow._mode = init.mode;
        this._shadowRoot = shadow;
        return shadow;
    };
    Object.defineProperty(ElementImpl.prototype, "shadowRoot", {
        /** @inheritdoc */
        get: function () {
            /**
             * 1. Let shadow be context object’s shadow root.
             * 2. If shadow is null or its mode is "closed", then return null.
             * 3. Return shadow.
             */
            var shadow = this._shadowRoot;
            if (shadow === null || shadow.mode === "closed")
                return null;
            else
                return shadow;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    ElementImpl.prototype.closest = function (selectors) {
        /**
         * TODO: Selectors
         * 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
         * 2. If s is failure, throw a "SyntaxError" DOMException.
         * 3. Let elements be context object’s inclusive ancestors that are
         * elements, in reverse tree order.
         * 4. For each element in elements, if match a selector against an element,
         * using s, element, and :scope element context object, returns success,
         * return element. [SELECTORS4]
         * 5. Return null.
         */
        throw new DOMException_1.NotImplementedError();
    };
    /** @inheritdoc */
    ElementImpl.prototype.matches = function (selectors) {
        /**
         * TODO: Selectors
         * 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
         * 2. If s is failure, throw a "SyntaxError" DOMException.
         * 3. Return true if the result of match a selector against an element,
         * using s, element, and :scope element context object, returns success,
         * and false otherwise. [SELECTORS4]
         */
        throw new DOMException_1.NotImplementedError();
    };
    /** @inheritdoc */
    ElementImpl.prototype.webkitMatchesSelector = function (selectors) {
        return this.matches(selectors);
    };
    /** @inheritdoc */
    ElementImpl.prototype.getElementsByTagName = function (qualifiedName) {
        /**
         * The getElementsByTagName(qualifiedName) method, when invoked, must return
         * the list of elements with qualified name qualifiedName for context
         * object.
         */
        return algorithm_1.node_listOfElementsWithQualifiedName(qualifiedName, this);
    };
    /** @inheritdoc */
    ElementImpl.prototype.getElementsByTagNameNS = function (namespace, localName) {
        /**
         * The getElementsByTagNameNS(namespace, localName) method, when invoked,
         * must return the list of elements with namespace namespace and local name
         * localName for context object.
         */
        return algorithm_1.node_listOfElementsWithNamespace(namespace, localName, this);
    };
    /** @inheritdoc */
    ElementImpl.prototype.getElementsByClassName = function (classNames) {
        /**
         * The getElementsByClassName(classNames) method, when invoked, must return
         * the list of elements with class names classNames for context object.
         */
        return algorithm_1.node_listOfElementsWithClassNames(classNames, this);
    };
    /** @inheritdoc */
    ElementImpl.prototype.insertAdjacentElement = function (where, element) {
        /**
         * The insertAdjacentElement(where, element) method, when invoked, must
         * return the result of running insert adjacent, given context object,
         *  where, and element.
         */
        return algorithm_1.element_insertAdjacent(this, where, element);
    };
    /** @inheritdoc */
    ElementImpl.prototype.insertAdjacentText = function (where, data) {
        /**
         * 1. Let text be a new Text node whose data is data and node document is
         * context object’s node document.
         * 2. Run insert adjacent, given context object, where, and text.
         */
        var text = algorithm_1.create_text(this._nodeDocument, data);
        algorithm_1.element_insertAdjacent(this, where, text);
    };
    Object.defineProperty(ElementImpl.prototype, "_qualifiedName", {
        /**
         * Returns the qualified name.
         */
        get: function () {
            /**
             * An element’s qualified name is its local name if its namespace prefix is
             * null, and its namespace prefix, followed by ":", followed by its
             * local name, otherwise.
             */
            return (this._namespacePrefix ?
                this._namespacePrefix + ':' + this._localName :
                this._localName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "_htmlUppercasedQualifiedName", {
        /**
         * Returns the upper-cased qualified name for a html element.
         */
        get: function () {
            /**
             * 1. Let qualifiedName be context object’s qualified name.
             * 2. If the context object is in the HTML namespace and its node document
             * is an HTML document, then set qualifiedName to qualifiedName in ASCII
             * uppercase.
             * 3. Return qualifiedName.
             */
            var qualifiedName = this._qualifiedName;
            if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
                qualifiedName = qualifiedName.toUpperCase();
            }
            return qualifiedName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "children", {
        // MIXIN: ParentNode
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "firstElementChild", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "lastElementChild", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "childElementCount", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    /* istanbul ignore next */
    ElementImpl.prototype.prepend = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ParentNode not implemented.");
    };
    /* istanbul ignore next */
    ElementImpl.prototype.append = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ParentNode not implemented.");
    };
    /* istanbul ignore next */
    ElementImpl.prototype.querySelector = function (selectors) { throw new Error("Mixin: ParentNode not implemented."); };
    /* istanbul ignore next */
    ElementImpl.prototype.querySelectorAll = function (selectors) { throw new Error("Mixin: ParentNode not implemented."); };
    Object.defineProperty(ElementImpl.prototype, "previousElementSibling", {
        // MIXIN: NonDocumentTypeChildNode
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: NonDocumentTypeChildNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementImpl.prototype, "nextElementSibling", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: NonDocumentTypeChildNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    // MIXIN: ChildNode
    /* istanbul ignore next */
    ElementImpl.prototype.before = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ChildNode not implemented.");
    };
    /* istanbul ignore next */
    ElementImpl.prototype.after = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ChildNode not implemented.");
    };
    /* istanbul ignore next */
    ElementImpl.prototype.replaceWith = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ChildNode not implemented.");
    };
    /* istanbul ignore next */
    ElementImpl.prototype.remove = function () { throw new Error("Mixin: ChildNode not implemented."); };
    Object.defineProperty(ElementImpl.prototype, "assignedSlot", {
        // MIXIN: Slotable
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: Slotable not implemented."); },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new `Element`.
     *
     * @param document - owner document
     * @param localName - local name
     * @param namespace - namespace
     * @param prefix - namespace prefix
     */
    ElementImpl._create = function (document, localName, namespace, namespacePrefix) {
        if (namespace === void 0) { namespace = null; }
        if (namespacePrefix === void 0) { namespacePrefix = null; }
        var node = new ElementImpl();
        node._localName = localName;
        node._namespace = namespace;
        node._namespacePrefix = namespacePrefix;
        node._nodeDocument = document;
        return node;
    };
    return ElementImpl;
}(NodeImpl_1.NodeImpl));
exports.ElementImpl = ElementImpl;
/**
 * Initialize prototype properties
 */
WebIDLAlgorithm_1.idl_defineConst(ElementImpl.prototype, "_nodeType", interfaces_1.NodeType.Element);
//# sourceMappingURL=ElementImpl.js.map