"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var algorithm_1 = require("../algorithm");
var XMLParserImpl_1 = require("./XMLParserImpl");
/**
 * Represents a parser for XML and HTML content.
 *
 * See: https://w3c.github.io/DOM-Parsing/#the-domparser-interface
 */
var DOMParserImpl = /** @class */ (function () {
    function DOMParserImpl() {
    }
    /** @inheritdoc */
    DOMParserImpl.prototype.parseFromString = function (source, mimeType) {
        if (mimeType === "text/html")
            throw new Error('HTML parser not implemented.');
        try {
            var parser = new XMLParserImpl_1.XMLParserImpl();
            var doc = parser.parse(source);
            doc._contentType = mimeType;
            return doc;
        }
        catch (e) {
            var errorNS = "http://www.mozilla.org/newlayout/xml/parsererror.xml";
            var doc = algorithm_1.create_xmlDocument();
            var root = doc.createElementNS(errorNS, "parsererror");
            var ele = doc.createElementNS(errorNS, "error");
            ele.setAttribute("message", e.message);
            root.appendChild(ele);
            doc.appendChild(root);
            return doc;
        }
    };
    return DOMParserImpl;
}());
exports.DOMParserImpl = DOMParserImpl;
//# sourceMappingURL=DOMParserImpl.js.map