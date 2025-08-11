import { Node, Element, NodeType, HTMLCollection, NodeList, DocumentFragment, Document } from "./interfaces";
import { NodeImpl } from "./NodeImpl";
/**
 * Represents a document fragment in the XML tree.
 */
export declare class DocumentFragmentImpl extends NodeImpl implements DocumentFragment {
    _nodeType: NodeType;
    _children: Set<Node>;
    _host: Element | null;
    /**
     * Initializes a new instance of `DocumentFragment`.
     *
     * @param host - shadow root's host element
     */
    constructor(host?: Element | null);
    getElementById(elementId: string): Element | null;
    get children(): HTMLCollection;
    get firstElementChild(): Element | null;
    get lastElementChild(): Element | null;
    get childElementCount(): number;
    prepend(...nodes: (Node | string)[]): void;
    append(...nodes: (Node | string)[]): void;
    querySelector(selectors: string): Element | null;
    querySelectorAll(selectors: string): NodeList;
    /**
     * Creates a new `DocumentFragment`.
     *
     * @param document - owner document
     * @param host - shadow root's host element
     */
    static _create(document: Document, host?: Element | null): DocumentFragmentImpl;
}
