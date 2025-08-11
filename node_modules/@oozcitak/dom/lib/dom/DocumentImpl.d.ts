import { DOMImplementation, DocumentType, Element, Text, NodeFilter, NodeType, Node, HTMLCollection, DocumentFragment, NodeList, WhatToShow, Attr, ProcessingInstruction, Comment, CDATASection, NodeIterator, TreeWalker, FilterResult, Range, Event, EventTarget, Document } from "./interfaces";
import { NodeImpl } from "./NodeImpl";
/**
 * Represents a document node.
 */
export declare class DocumentImpl extends NodeImpl implements Document {
    _nodeType: NodeType;
    _children: Set<Node>;
    _encoding: {
        name: string;
        labels: string[];
    };
    _contentType: string;
    _URL: {
        scheme: string;
        username: string;
        password: string;
        host: null;
        port: null;
        path: string[];
        query: null;
        fragment: null;
        _cannotBeABaseURLFlag: boolean;
        _blobURLEntry: null;
    };
    _origin: null;
    _type: "xml" | "html";
    _mode: "no-quirks" | "quirks" | "limited-quirks";
    protected _implementation?: DOMImplementation;
    _documentElement: null;
    _hasNamespaces: boolean;
    _nodeDocumentOverwrite: Document | null;
    get _nodeDocument(): Document;
    set _nodeDocument(val: Document);
    /**
     * Initializes a new instance of `Document`.
     */
    constructor();
    /** @inheritdoc */
    get implementation(): DOMImplementation;
    /** @inheritdoc */
    get URL(): string;
    /** @inheritdoc */
    get documentURI(): string;
    /** @inheritdoc */
    get origin(): string;
    /** @inheritdoc */
    get compatMode(): string;
    /** @inheritdoc */
    get characterSet(): string;
    /** @inheritdoc */
    get charset(): string;
    /** @inheritdoc */
    get inputEncoding(): string;
    /** @inheritdoc */
    get contentType(): string;
    /** @inheritdoc */
    get doctype(): DocumentType | null;
    /** @inheritdoc */
    get documentElement(): Element | null;
    /** @inheritdoc */
    getElementsByTagName(qualifiedName: string): HTMLCollection;
    /** @inheritdoc */
    getElementsByTagNameNS(namespace: string | null, localName: string): HTMLCollection;
    /** @inheritdoc */
    getElementsByClassName(classNames: string): HTMLCollection;
    /** @inheritdoc */
    createElement(localName: string, options?: string | {
        is: string;
    }): Element;
    /** @inheritdoc */
    createElementNS(namespace: string | null, qualifiedName: string, options?: string | {
        is: string;
    }): Element;
    /** @inheritdoc */
    createDocumentFragment(): DocumentFragment;
    /** @inheritdoc */
    createTextNode(data: string): Text;
    /** @inheritdoc */
    createCDATASection(data: string): CDATASection;
    /** @inheritdoc */
    createComment(data: string): Comment;
    /** @inheritdoc */
    createProcessingInstruction(target: string, data: string): ProcessingInstruction;
    /** @inheritdoc */
    importNode(node: Node, deep?: boolean): Node;
    /** @inheritdoc */
    adoptNode(node: Node): Node;
    /** @inheritdoc */
    createAttribute(localName: string): Attr;
    /** @inheritdoc */
    createAttributeNS(namespace: string, qualifiedName: string): Attr;
    /** @inheritdoc */
    createEvent(eventInterface: string): Event;
    /** @inheritdoc */
    createRange(): Range;
    /** @inheritdoc */
    createNodeIterator(root: Node, whatToShow?: WhatToShow, filter?: NodeFilter | ((node: Node) => FilterResult) | null): NodeIterator;
    /** @inheritdoc */
    createTreeWalker(root: Node, whatToShow?: WhatToShow, filter?: NodeFilter | ((node: Node) => FilterResult) | null): TreeWalker;
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */
    _getTheParent(event: Event): EventTarget | null;
    getElementById(elementId: string): Element | null;
    get children(): HTMLCollection;
    get firstElementChild(): Element | null;
    get lastElementChild(): Element | null;
    get childElementCount(): number;
    prepend(...nodes: (Node | string)[]): void;
    append(...nodes: (Node | string)[]): void;
    querySelector(selectors: string): Element | null;
    querySelectorAll(selectors: string): NodeList;
}
