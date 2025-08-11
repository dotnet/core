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
var XMLStringLexer_1 = require("@oozcitak/dom/lib/parser/XMLStringLexer");
var interfaces_1 = require("@oozcitak/dom/lib/parser/interfaces");
var interfaces_2 = require("@oozcitak/dom/lib/dom/interfaces");
var infra_1 = require("@oozcitak/infra");
var algorithm_1 = require("@oozcitak/dom/lib/algorithm");
var BaseReader_1 = require("./BaseReader");
/**
 * Parses XML nodes from an XML document string.
 */
var XMLReader = /** @class */ (function (_super) {
    __extends(XMLReader, _super);
    function XMLReader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param str - XML document string to parse
     */
    XMLReader.prototype._parse = function (node, str) {
        var e_1, _a, e_2, _b;
        var lexer = new XMLStringLexer_1.XMLStringLexer(str, { skipWhitespaceOnlyText: this._builderOptions.skipWhitespaceOnlyText });
        var lastChild = node;
        var context = node;
        var token = lexer.nextToken();
        while (token.type !== interfaces_1.TokenType.EOF) {
            switch (token.type) {
                case interfaces_1.TokenType.Declaration:
                    var declaration = token;
                    var version = this.sanitize(declaration.version);
                    if (version !== "1.0") {
                        throw new Error("Invalid xml version: " + version);
                    }
                    var builderOptions = {
                        version: version
                    };
                    if (declaration.encoding) {
                        builderOptions.encoding = this.sanitize(declaration.encoding);
                    }
                    if (declaration.standalone) {
                        builderOptions.standalone = (this.sanitize(declaration.standalone) === "yes");
                    }
                    context.set(builderOptions);
                    break;
                case interfaces_1.TokenType.DocType:
                    var doctype = token;
                    context = this.docType(context, this.sanitize(doctype.name), this.sanitize(doctype.pubId), this.sanitize(doctype.sysId)) || context;
                    break;
                case interfaces_1.TokenType.CDATA:
                    var cdata = token;
                    context = this.cdata(context, this.sanitize(cdata.data)) || context;
                    break;
                case interfaces_1.TokenType.Comment:
                    var comment = token;
                    context = this.comment(context, this.sanitize(comment.data)) || context;
                    break;
                case interfaces_1.TokenType.PI:
                    var pi = token;
                    context = this.instruction(context, this.sanitize(pi.target), this.sanitize(pi.data)) || context;
                    break;
                case interfaces_1.TokenType.Text:
                    if (context.node.nodeType === interfaces_2.NodeType.Document)
                        break;
                    var text = token;
                    context = this.text(context, this._decodeText(this.sanitize(text.data))) || context;
                    break;
                case interfaces_1.TokenType.Element:
                    var element = token;
                    var elementName = this.sanitize(element.name);
                    // inherit namespace from parent
                    var _c = __read(algorithm_1.namespace_extractQName(elementName), 1), prefix = _c[0];
                    var namespace = context.node.lookupNamespaceURI(prefix);
                    // override namespace if there is a namespace declaration
                    // attribute
                    // also lookup namespace declaration attributes
                    var nsDeclarations = {};
                    try {
                        for (var _d = (e_1 = void 0, __values(element.attributes)), _e = _d.next(); !_e.done; _e = _d.next()) {
                            var _f = __read(_e.value, 2), attName = _f[0], attValue = _f[1];
                            attName = this.sanitize(attName);
                            attValue = this.sanitize(attValue);
                            if (attName === "xmlns") {
                                namespace = attValue;
                            }
                            else {
                                var _g = __read(algorithm_1.namespace_extractQName(attName), 2), attPrefix = _g[0], attLocalName = _g[1];
                                if (attPrefix === "xmlns") {
                                    if (attLocalName === prefix) {
                                        namespace = attValue;
                                    }
                                    nsDeclarations[attLocalName] = attValue;
                                }
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    // create the DOM element node
                    var elementNode = (namespace !== null ?
                        this.element(context, namespace, elementName) :
                        this.element(context, undefined, elementName));
                    if (elementNode === undefined)
                        break;
                    if (context.node === node.node)
                        lastChild = elementNode;
                    try {
                        // assign attributes
                        for (var _h = (e_2 = void 0, __values(element.attributes)), _j = _h.next(); !_j.done; _j = _h.next()) {
                            var _k = __read(_j.value, 2), attName = _k[0], attValue = _k[1];
                            attName = this.sanitize(attName);
                            attValue = this.sanitize(attValue);
                            var _l = __read(algorithm_1.namespace_extractQName(attName), 2), attPrefix = _l[0], attLocalName = _l[1];
                            var attNamespace = null;
                            if (attPrefix === "xmlns" || (attPrefix === null && attLocalName === "xmlns")) {
                                // namespace declaration attribute
                                attNamespace = infra_1.namespace.XMLNS;
                            }
                            else {
                                attNamespace = elementNode.node.lookupNamespaceURI(attPrefix);
                                if (attNamespace !== null && elementNode.node.isDefaultNamespace(attNamespace)) {
                                    attNamespace = null;
                                }
                                else if (attNamespace === null && attPrefix !== null) {
                                    attNamespace = nsDeclarations[attPrefix] || null;
                                }
                            }
                            if (attNamespace !== null)
                                this.attribute(elementNode, attNamespace, attName, this._decodeAttributeValue(attValue));
                            else
                                this.attribute(elementNode, undefined, attName, this._decodeAttributeValue(attValue));
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    if (!element.selfClosing) {
                        context = elementNode;
                    }
                    break;
                case interfaces_1.TokenType.ClosingTag:
                    /* istanbul ignore else */
                    if (context.node.parentNode) {
                        context = context.up();
                    }
                    break;
            }
            token = lexer.nextToken();
        }
        return lastChild;
    };
    return XMLReader;
}(BaseReader_1.BaseReader));
exports.XMLReader = XMLReader;
//# sourceMappingURL=XMLReader.js.map