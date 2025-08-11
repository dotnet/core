import { Document, DOMImplementation, Window, XMLDocument, AbortController, AbortSignal, DocumentType, Element, DocumentFragment, ShadowRoot, Attr, Text, CDATASection, Comment, ProcessingInstruction, Node, HTMLCollection, NodeList, NamedNodeMap, BoundaryPoint, Range, NodeIterator, TreeWalker, NodeFilter, MutationRecord, DOMTokenList } from "../dom/interfaces";
/**
 * Creates a `DOMImplementation`.
 *
 * @param document - associated document
 */
export declare function create_domImplementation(document: Document): DOMImplementation;
/**
 * Creates a `Window` node.
 */
export declare function create_window(): Window;
/**
 * Creates an `XMLDocument` node.
 */
export declare function create_xmlDocument(): XMLDocument;
/**
 * Creates a `Document` node.
 */
export declare function create_document(): Document;
/**
 * Creates an `AbortController`.
 */
export declare function create_abortController(): AbortController;
/**
 * Creates an `AbortSignal`.
 */
export declare function create_abortSignal(): AbortSignal;
/**
 * Creates a `DocumentType` node.
 *
 * @param document - owner document
 * @param name - name of the node
 * @param publicId - `PUBLIC` identifier
 * @param systemId - `SYSTEM` identifier
 */
export declare function create_documentType(document: Document, name: string, publicId: string, systemId: string): DocumentType;
/**
 * Creates a new `Element` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
export declare function create_element(document: Document, localName: string, namespace: string | null, prefix: string | null): Element;
/**
 * Creates a new `HTMLElement` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
export declare function create_htmlElement(document: Document, localName: string, namespace: string | null, prefix: string | null): Element;
/**
 * Creates a new `HTMLUnknownElement` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
export declare function create_htmlUnknownElement(document: Document, localName: string, namespace: string | null, prefix: string | null): Element;
/**
 * Creates a new `DocumentFragment` node.
 *
 * @param document - owner document
 */
export declare function create_documentFragment(document: Document): DocumentFragment;
/**
 * Creates a new `ShadowRoot` node.
 *
 * @param document - owner document
 * @param host - shadow root's host element node
 */
export declare function create_shadowRoot(document: Document, host: Element): ShadowRoot;
/**
 * Creates a new `Attr` node.
 *
 * @param document - owner document
 * @param localName - local name
 */
export declare function create_attr(document: Document, localName: string): Attr;
/**
 * Creates a new `Text` node.
 *
 * @param document - owner document
 * @param data - node contents
 */
export declare function create_text(document: Document, data: string): Text;
/**
 * Creates a new `CDATASection` node.
 *
 * @param document - owner document
 * @param data - node contents
 */
export declare function create_cdataSection(document: Document, data: string): CDATASection;
/**
 * Creates a new `Comment` node.
 *
 * @param document - owner document
 * @param data - node contents
 */
export declare function create_comment(document: Document, data: string): Comment;
/**
 * Creates a new `ProcessingInstruction` node.
 *
 * @param document - owner document
 * @param target - instruction target
 * @param data - node contents
 */
export declare function create_processingInstruction(document: Document, target: string, data: string): ProcessingInstruction;
/**
 * Creates a new `HTMLCollection`.
 *
 * @param root - root node
 * @param filter - node filter
 */
export declare function create_htmlCollection(root: Node, filter?: ((element: Element) => any)): HTMLCollection;
/**
 * Creates a new live `NodeList`.
 *
 * @param root - root node
 */
export declare function create_nodeList(root: Node): NodeList;
/**
 * Creates a new static `NodeList`.
 *
 * @param root - root node
 * @param items - a list of items to initialize the list
 */
export declare function create_nodeListStatic(root: Node, items: Node[]): NodeList;
/**
 * Creates a new `NamedNodeMap`.
 *
 * @param element - parent element
 */
export declare function create_namedNodeMap(element: Element): NamedNodeMap;
/**
 * Creates a new `Range`.
 *
 * @param start - start point
 * @param end - end point
 */
export declare function create_range(start?: BoundaryPoint, end?: BoundaryPoint): Range;
/**
 * Creates a new `NodeIterator`.
 *
 * @param root - iterator's root node
 * @param reference - reference node
 * @param pointerBeforeReference - whether the iterator is before or after the
 * reference node
 */
export declare function create_nodeIterator(root: Node, reference: Node, pointerBeforeReference: boolean): NodeIterator;
/**
 * Creates a new `TreeWalker`.
 *
 * @param root - iterator's root node
 * @param current - current node
 */
export declare function create_treeWalker(root: Node, current: Node): TreeWalker;
/**
 * Creates a new `NodeFilter`.
 */
export declare function create_nodeFilter(): NodeFilter;
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
export declare function create_mutationRecord(type: "attributes" | "characterData" | "childList", target: Node, addedNodes: NodeList, removedNodes: NodeList, previousSibling: Node | null, nextSibling: Node | null, attributeName: string | null, attributeNamespace: string | null, oldValue: string | null): MutationRecord;
/**
 * Creates a new `DOMTokenList`.
 *
 * @param element - associated element
 * @param attribute - associated attribute
 */
export declare function create_domTokenList(element: Element, attribute: Attr): DOMTokenList;
