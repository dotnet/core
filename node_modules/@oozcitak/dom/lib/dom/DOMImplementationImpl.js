"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOMImpl_1 = require("./DOMImpl");
var infra_1 = require("@oozcitak/infra");
var algorithm_1 = require("../algorithm");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents an object providing methods which are not dependent on
 * any particular document.
 */
var DOMImplementationImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `DOMImplementation`.
     *
     * @param document - the associated document
     */
    function DOMImplementationImpl(document) {
        this._associatedDocument = document || DOMImpl_1.dom.window.document;
    }
    /** @inheritdoc */
    DOMImplementationImpl.prototype.createDocumentType = function (qualifiedName, publicId, systemId) {
        /**
         * 1. Validate qualifiedName.
         * 2. Return a new doctype, with qualifiedName as its name, publicId as its
         * public ID, and systemId as its system ID, and with its node document set
         * to the associated document of the context object.
         */
        algorithm_1.namespace_validate(qualifiedName);
        return algorithm_1.create_documentType(this._associatedDocument, qualifiedName, publicId, systemId);
    };
    /** @inheritdoc */
    DOMImplementationImpl.prototype.createDocument = function (namespace, qualifiedName, doctype) {
        if (doctype === void 0) { doctype = null; }
        /**
         * 1. Let document be a new XMLDocument.
         */
        var document = algorithm_1.create_xmlDocument();
        /**
         * 2. Let element be null.
         * 3. If qualifiedName is not the empty string, then set element to
         * the result of running the internal createElementNS steps, given document,
         * namespace, qualifiedName, and an empty dictionary.
         */
        var element = null;
        if (qualifiedName) {
            element = algorithm_1.document_internalCreateElementNS(document, namespace, qualifiedName);
        }
        /**
         * 4. If doctype is non-null, append doctype to document.
         * 5. If element is non-null, append element to document.
         */
        if (doctype)
            document.appendChild(doctype);
        if (element)
            document.appendChild(element);
        /**
         * 6. document’s origin is context object’s associated document’s origin.
         */
        document._origin = this._associatedDocument._origin;
        /**
         * 7. document’s content type is determined by namespace:
         * - HTML namespace
         * application/xhtml+xml
         * - SVG namespace
         * image/svg+xml
         * - Any other namespace
         * application/xml
         */
        if (namespace === infra_1.namespace.HTML)
            document._contentType = "application/xhtml+xml";
        else if (namespace === infra_1.namespace.SVG)
            document._contentType = "image/svg+xml";
        else
            document._contentType = "application/xml";
        /**
         * 8. Return document.
         */
        return document;
    };
    /** @inheritdoc */
    DOMImplementationImpl.prototype.createHTMLDocument = function (title) {
        /**
         * 1. Let doc be a new document that is an HTML document.
         * 2. Set doc’s content type to "text/html".
         */
        var doc = algorithm_1.create_document();
        doc._type = "html";
        doc._contentType = "text/html";
        /**
         * 3. Append a new doctype, with "html" as its name and with its node
         * document set to doc, to doc.
         */
        doc.appendChild(algorithm_1.create_documentType(doc, "html", "", ""));
        /**
         * 4. Append the result of creating an element given doc, html, and the
         * HTML namespace, to doc.
         */
        var htmlElement = algorithm_1.element_createAnElement(doc, "html", infra_1.namespace.HTML);
        doc.appendChild(htmlElement);
        /**
         * 5. Append the result of creating an element given doc, head, and the
         * HTML namespace, to the html element created earlier.
         */
        var headElement = algorithm_1.element_createAnElement(doc, "head", infra_1.namespace.HTML);
        htmlElement.appendChild(headElement);
        /**
         * 6. If title is given:
         * 6.1. Append the result of creating an element given doc, title, and
         * the HTML namespace, to the head element created earlier.
         * 6.2. Append a new Text node, with its data set to title (which could
         * be the empty string) and its node document set to doc, to the title
         * element created earlier.
         */
        if (title !== undefined) {
            var titleElement = algorithm_1.element_createAnElement(doc, "title", infra_1.namespace.HTML);
            headElement.appendChild(titleElement);
            var textElement = algorithm_1.create_text(doc, title);
            titleElement.appendChild(textElement);
        }
        /**
         * 7. Append the result of creating an element given doc, body, and the
         * HTML namespace, to the html element created earlier.
         */
        var bodyElement = algorithm_1.element_createAnElement(doc, "body", infra_1.namespace.HTML);
        htmlElement.appendChild(bodyElement);
        /**
         * 8. doc’s origin is context object’s associated document’s origin.
         */
        doc._origin = this._associatedDocument._origin;
        /**
         * 9. Return doc.
         */
        return doc;
    };
    /** @inheritdoc */
    DOMImplementationImpl.prototype.hasFeature = function () { return true; };
    /**
     * Creates a new `DOMImplementation`.
     *
     * @param document - owner document
     */
    DOMImplementationImpl._create = function (document) {
        return new DOMImplementationImpl(document);
    };
    return DOMImplementationImpl;
}());
exports.DOMImplementationImpl = DOMImplementationImpl;
WebIDLAlgorithm_1.idl_defineConst(DOMImplementationImpl.prototype, "_ID", "@oozcitak/dom");
//# sourceMappingURL=DOMImplementationImpl.js.map