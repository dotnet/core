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
var XMLStringLexer_1 = require("./XMLStringLexer");
var interfaces_1 = require("./interfaces");
var infra_1 = require("@oozcitak/infra");
var algorithm_1 = require("../algorithm");
var LocalNameSet_1 = require("../serializer/LocalNameSet");
/**
 * Represents a parser for XML content.
 *
 * See: https://html.spec.whatwg.org/#xml-parser
 */
var XMLParserImpl = /** @class */ (function () {
    function XMLParserImpl() {
    }
    /**
     * Parses XML content.
     *
     * @param source - a string containing XML content
     */
    XMLParserImpl.prototype.parse = function (source) {
        var e_1, _a, e_2, _b;
        var lexer = new XMLStringLexer_1.XMLStringLexer(source, { skipWhitespaceOnlyText: true });
        var doc = algorithm_1.create_document();
        var context = doc;
        var token = lexer.nextToken();
        while (token.type !== interfaces_1.TokenType.EOF) {
            switch (token.type) {
                case interfaces_1.TokenType.Declaration:
                    var declaration = token;
                    if (declaration.version !== "1.0") {
                        throw new Error("Invalid xml version: " + declaration.version);
                    }
                    break;
                case interfaces_1.TokenType.DocType:
                    var doctype = token;
                    if (!algorithm_1.xml_isPubidChar(doctype.pubId)) {
                        throw new Error("DocType public identifier does not match PubidChar construct.");
                    }
                    if (!algorithm_1.xml_isLegalChar(doctype.sysId) ||
                        (doctype.sysId.indexOf('"') !== -1 && doctype.sysId.indexOf("'") !== -1)) {
                        throw new Error("DocType system identifier contains invalid characters.");
                    }
                    context.appendChild(doc.implementation.createDocumentType(doctype.name, doctype.pubId, doctype.sysId));
                    break;
                case interfaces_1.TokenType.CDATA:
                    var cdata = token;
                    if (!algorithm_1.xml_isLegalChar(cdata.data) ||
                        cdata.data.indexOf("]]>") !== -1) {
                        throw new Error("CDATA contains invalid characters.");
                    }
                    context.appendChild(doc.createCDATASection(cdata.data));
                    break;
                case interfaces_1.TokenType.Comment:
                    var comment = token;
                    if (!algorithm_1.xml_isLegalChar(comment.data) ||
                        comment.data.indexOf("--") !== -1 || comment.data.endsWith("-")) {
                        throw new Error("Comment data contains invalid characters.");
                    }
                    context.appendChild(doc.createComment(comment.data));
                    break;
                case interfaces_1.TokenType.PI:
                    var pi = token;
                    if (pi.target.indexOf(":") !== -1 || (/^xml$/i).test(pi.target)) {
                        throw new Error("Processing instruction target contains invalid characters.");
                    }
                    if (!algorithm_1.xml_isLegalChar(pi.data) || pi.data.indexOf("?>") !== -1) {
                        throw new Error("Processing instruction data contains invalid characters.");
                    }
                    context.appendChild(doc.createProcessingInstruction(pi.target, pi.data));
                    break;
                case interfaces_1.TokenType.Text:
                    var text = token;
                    if (!algorithm_1.xml_isLegalChar(text.data)) {
                        throw new Error("Text data contains invalid characters.");
                    }
                    context.appendChild(doc.createTextNode(this._decodeText(text.data)));
                    break;
                case interfaces_1.TokenType.Element:
                    var element = token;
                    // inherit namespace from parent
                    var _c = __read(algorithm_1.namespace_extractQName(element.name), 2), prefix = _c[0], localName = _c[1];
                    if (localName.indexOf(":") !== -1 || !algorithm_1.xml_isName(localName)) {
                        throw new Error("Node local name contains invalid characters.");
                    }
                    if (prefix === "xmlns") {
                        throw new Error("An element cannot have the 'xmlns' prefix.");
                    }
                    var namespace = context.lookupNamespaceURI(prefix);
                    // override namespace if there is a namespace declaration
                    // attribute
                    // also lookup namespace declaration attributes
                    var nsDeclarations = {};
                    try {
                        for (var _d = (e_1 = void 0, __values(element.attributes)), _e = _d.next(); !_e.done; _e = _d.next()) {
                            var _f = __read(_e.value, 2), attName = _f[0], attValue = _f[1];
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
                        doc.createElementNS(namespace, element.name) :
                        doc.createElement(element.name));
                    context.appendChild(elementNode);
                    // assign attributes
                    var localNameSet = new LocalNameSet_1.LocalNameSet();
                    try {
                        for (var _h = (e_2 = void 0, __values(element.attributes)), _j = _h.next(); !_j.done; _j = _h.next()) {
                            var _k = __read(_j.value, 2), attName = _k[0], attValue = _k[1];
                            var _l = __read(algorithm_1.namespace_extractQName(attName), 2), attPrefix = _l[0], attLocalName = _l[1];
                            var attNamespace = null;
                            if (attPrefix === "xmlns" || (attPrefix === null && attLocalName === "xmlns")) {
                                // namespace declaration attribute
                                attNamespace = infra_1.namespace.XMLNS;
                            }
                            else {
                                attNamespace = elementNode.lookupNamespaceURI(attPrefix);
                                if (attNamespace !== null && elementNode.isDefaultNamespace(attNamespace)) {
                                    attNamespace = null;
                                }
                                else if (attNamespace === null && attPrefix !== null) {
                                    attNamespace = nsDeclarations[attPrefix] || null;
                                }
                            }
                            if (localNameSet.has(attNamespace, attLocalName)) {
                                throw new Error("Element contains duplicate attributes.");
                            }
                            localNameSet.set(attNamespace, attLocalName);
                            if (attNamespace === infra_1.namespace.XMLNS) {
                                if (attValue === infra_1.namespace.XMLNS) {
                                    throw new Error("XMLNS namespace is reserved.");
                                }
                            }
                            if (attLocalName.indexOf(":") !== -1 || !algorithm_1.xml_isName(attLocalName)) {
                                throw new Error("Attribute local name contains invalid characters.");
                            }
                            if (attPrefix === "xmlns" && attValue === "") {
                                throw new Error("Empty XML namespace is not allowed.");
                            }
                            if (attNamespace !== null)
                                elementNode.setAttributeNS(attNamespace, attName, this._decodeAttributeValue(attValue));
                            else
                                elementNode.setAttribute(attName, this._decodeAttributeValue(attValue));
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
                    var closingTag = token;
                    if (closingTag.name !== context.nodeName) {
                        throw new Error('Closing tag name does not match opening tag name.');
                    }
                    /* istanbul ignore else */
                    if (context._parent) {
                        context = context._parent;
                    }
                    break;
            }
            token = lexer.nextToken();
        }
        return doc;
    };
    /**
     * Decodes serialized text.
     *
     * @param text - text value to serialize
     */
    XMLParserImpl.prototype._decodeText = function (text) {
        return text == null ? text : text.replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    };
    /**
     * Decodes serialized attribute value.
     *
     * @param text - attribute value to serialize
     */
    XMLParserImpl.prototype._decodeAttributeValue = function (text) {
        return text == null ? text : text.replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    };
    return XMLParserImpl;
}());
exports.XMLParserImpl = XMLParserImpl;
//# sourceMappingURL=XMLParserImpl.js.map