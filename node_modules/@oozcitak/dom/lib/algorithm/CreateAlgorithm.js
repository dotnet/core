"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOMImplementationImpl_1 = require("../dom/DOMImplementationImpl");
var WindowImpl_1 = require("../dom/WindowImpl");
var XMLDocumentImpl_1 = require("../dom/XMLDocumentImpl");
var DocumentImpl_1 = require("../dom/DocumentImpl");
var AbortControllerImpl_1 = require("../dom/AbortControllerImpl");
var AbortSignalImpl_1 = require("../dom/AbortSignalImpl");
var DocumentTypeImpl_1 = require("../dom/DocumentTypeImpl");
var ElementImpl_1 = require("../dom/ElementImpl");
var DocumentFragmentImpl_1 = require("../dom/DocumentFragmentImpl");
var ShadowRootImpl_1 = require("../dom/ShadowRootImpl");
var AttrImpl_1 = require("../dom/AttrImpl");
var TextImpl_1 = require("../dom/TextImpl");
var CDATASectionImpl_1 = require("../dom/CDATASectionImpl");
var CommentImpl_1 = require("../dom/CommentImpl");
var ProcessingInstructionImpl_1 = require("../dom/ProcessingInstructionImpl");
var HTMLCollectionImpl_1 = require("../dom/HTMLCollectionImpl");
var NodeListImpl_1 = require("../dom/NodeListImpl");
var NodeListStaticImpl_1 = require("../dom/NodeListStaticImpl");
var NamedNodeMapImpl_1 = require("../dom/NamedNodeMapImpl");
var RangeImpl_1 = require("../dom/RangeImpl");
var NodeIteratorImpl_1 = require("../dom/NodeIteratorImpl");
var TreeWalkerImpl_1 = require("../dom/TreeWalkerImpl");
var NodeFilterImpl_1 = require("../dom/NodeFilterImpl");
var MutationRecordImpl_1 = require("../dom/MutationRecordImpl");
var DOMTokenListImpl_1 = require("../dom/DOMTokenListImpl");
/**
 * Creates a `DOMImplementation`.
 *
 * @param document - associated document
 */
function create_domImplementation(document) {
    return DOMImplementationImpl_1.DOMImplementationImpl._create(document);
}
exports.create_domImplementation = create_domImplementation;
/**
 * Creates a `Window` node.
 */
function create_window() {
    return WindowImpl_1.WindowImpl._create();
}
exports.create_window = create_window;
/**
 * Creates an `XMLDocument` node.
 */
function create_xmlDocument() {
    return new XMLDocumentImpl_1.XMLDocumentImpl();
}
exports.create_xmlDocument = create_xmlDocument;
/**
 * Creates a `Document` node.
 */
function create_document() {
    return new DocumentImpl_1.DocumentImpl();
}
exports.create_document = create_document;
/**
 * Creates an `AbortController`.
 */
function create_abortController() {
    return new AbortControllerImpl_1.AbortControllerImpl();
}
exports.create_abortController = create_abortController;
/**
 * Creates an `AbortSignal`.
 */
function create_abortSignal() {
    return AbortSignalImpl_1.AbortSignalImpl._create();
}
exports.create_abortSignal = create_abortSignal;
/**
 * Creates a `DocumentType` node.
 *
 * @param document - owner document
 * @param name - name of the node
 * @param publicId - `PUBLIC` identifier
 * @param systemId - `SYSTEM` identifier
 */
function create_documentType(document, name, publicId, systemId) {
    return DocumentTypeImpl_1.DocumentTypeImpl._create(document, name, publicId, systemId);
}
exports.create_documentType = create_documentType;
/**
 * Creates a new `Element` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
function create_element(document, localName, namespace, prefix) {
    return ElementImpl_1.ElementImpl._create(document, localName, namespace, prefix);
}
exports.create_element = create_element;
/**
 * Creates a new `HTMLElement` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
function create_htmlElement(document, localName, namespace, prefix) {
    // TODO: Implement in HTML DOM
    return ElementImpl_1.ElementImpl._create(document, localName, namespace, prefix);
}
exports.create_htmlElement = create_htmlElement;
/**
 * Creates a new `HTMLUnknownElement` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
function create_htmlUnknownElement(document, localName, namespace, prefix) {
    // TODO: Implement in HTML DOM
    return ElementImpl_1.ElementImpl._create(document, localName, namespace, prefix);
}
exports.create_htmlUnknownElement = create_htmlUnknownElement;
/**
 * Creates a new `DocumentFragment` node.
 *
 * @param document - owner document
 */
function create_documentFragment(document) {
    return DocumentFragmentImpl_1.DocumentFragmentImpl._create(document);
}
exports.create_documentFragment = create_documentFragment;
/**
 * Creates a new `ShadowRoot` node.
 *
 * @param document - owner document
 * @param host - shadow root's host element node
 */
function create_shadowRoot(document, host) {
    return ShadowRootImpl_1.ShadowRootImpl._create(document, host);
}
exports.create_shadowRoot = create_shadowRoot;
/**
 * Creates a new `Attr` node.
 *
 * @param document - owner document
 * @param localName - local name
 */
function create_attr(document, localName) {
    return AttrImpl_1.AttrImpl._create(document, localName);
}
exports.create_attr = create_attr;
/**
 * Creates a new `Text` node.
 *
 * @param document - owner document
 * @param data - node contents
 */
function create_text(document, data) {
    return TextImpl_1.TextImpl._create(document, data);
}
exports.create_text = create_text;
/**
 * Creates a new `CDATASection` node.
 *
 * @param document - owner document
 * @param data - node contents
 */
function create_cdataSection(document, data) {
    return CDATASectionImpl_1.CDATASectionImpl._create(document, data);
}
exports.create_cdataSection = create_cdataSection;
/**
 * Creates a new `Comment` node.
 *
 * @param document - owner document
 * @param data - node contents
 */
function create_comment(document, data) {
    return CommentImpl_1.CommentImpl._create(document, data);
}
exports.create_comment = create_comment;
/**
 * Creates a new `ProcessingInstruction` node.
 *
 * @param document - owner document
 * @param target - instruction target
 * @param data - node contents
 */
function create_processingInstruction(document, target, data) {
    return ProcessingInstructionImpl_1.ProcessingInstructionImpl._create(document, target, data);
}
exports.create_processingInstruction = create_processingInstruction;
/**
 * Creates a new `HTMLCollection`.
 *
 * @param root - root node
 * @param filter - node filter
 */
function create_htmlCollection(root, filter) {
    if (filter === void 0) { filter = (function () { return true; }); }
    return HTMLCollectionImpl_1.HTMLCollectionImpl._create(root, filter);
}
exports.create_htmlCollection = create_htmlCollection;
/**
 * Creates a new live `NodeList`.
 *
 * @param root - root node
 */
function create_nodeList(root) {
    return NodeListImpl_1.NodeListImpl._create(root);
}
exports.create_nodeList = create_nodeList;
/**
 * Creates a new static `NodeList`.
 *
 * @param root - root node
 * @param items - a list of items to initialize the list
 */
function create_nodeListStatic(root, items) {
    return NodeListStaticImpl_1.NodeListStaticImpl._create(root, items);
}
exports.create_nodeListStatic = create_nodeListStatic;
/**
 * Creates a new `NamedNodeMap`.
 *
 * @param element - parent element
 */
function create_namedNodeMap(element) {
    return NamedNodeMapImpl_1.NamedNodeMapImpl._create(element);
}
exports.create_namedNodeMap = create_namedNodeMap;
/**
 * Creates a new `Range`.
 *
 * @param start - start point
 * @param end - end point
 */
function create_range(start, end) {
    return RangeImpl_1.RangeImpl._create(start, end);
}
exports.create_range = create_range;
/**
 * Creates a new `NodeIterator`.
 *
 * @param root - iterator's root node
 * @param reference - reference node
 * @param pointerBeforeReference - whether the iterator is before or after the
 * reference node
 */
function create_nodeIterator(root, reference, pointerBeforeReference) {
    return NodeIteratorImpl_1.NodeIteratorImpl._create(root, reference, pointerBeforeReference);
}
exports.create_nodeIterator = create_nodeIterator;
/**
 * Creates a new `TreeWalker`.
 *
 * @param root - iterator's root node
 * @param current - current node
 */
function create_treeWalker(root, current) {
    return TreeWalkerImpl_1.TreeWalkerImpl._create(root, current);
}
exports.create_treeWalker = create_treeWalker;
/**
 * Creates a new `NodeFilter`.
 */
function create_nodeFilter() {
    return NodeFilterImpl_1.NodeFilterImpl._create();
}
exports.create_nodeFilter = create_nodeFilter;
/**
 * Creates a new `MutationRecord`.
 *
 * @param type - type of mutation: `"attributes"` for an attribute
 * mutation, `"characterData"` for a mutation to a CharacterData node
 * and `"childList"` for a mutation to the tree of nodes.
 * @param target - node affected by the mutation.
 * @param addedNodes - list of added nodes.
 * @param removedNodes - list of removed nodes.
 * @param previousSibling - previous sibling of added or removed nodes.
 * @param nextSibling - next sibling of added or removed nodes.
 * @param attributeName - local name of the changed attribute,
 * and `null` otherwise.
 * @param attributeNamespace - namespace of the changed attribute,
 * and `null` otherwise.
 * @param oldValue - value before mutation: attribute value for an attribute
 * mutation, node `data` for a mutation to a CharacterData node and `null`
 * for a mutation to the tree of nodes.
 */
function create_mutationRecord(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue) {
    return MutationRecordImpl_1.MutationRecordImpl._create(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue);
}
exports.create_mutationRecord = create_mutationRecord;
/**
 * Creates a new `DOMTokenList`.
 *
 * @param element - associated element
 * @param attribute - associated attribute
 */
function create_domTokenList(element, attribute) {
    return DOMTokenListImpl_1.DOMTokenListImpl._create(element, attribute);
}
exports.create_domTokenList = create_domTokenList;
//# sourceMappingURL=CreateAlgorithm.js.map