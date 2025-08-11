import { Node, FilterResult, NodeFilter } from "./interfaces";
/**
 * Represents a node filter.
 */
export declare class NodeFilterImpl implements NodeFilter {
    static FILTER_ACCEPT: number;
    static FILTER_REJECT: number;
    static FILTER_SKIP: number;
    static SHOW_ALL: number;
    static SHOW_ELEMENT: number;
    static SHOW_ATTRIBUTE: number;
    static SHOW_TEXT: number;
    static SHOW_CDATA_SECTION: number;
    static SHOW_ENTITY_REFERENCE: number;
    static SHOW_ENTITY: number;
    static SHOW_PROCESSING_INSTRUCTION: number;
    static SHOW_COMMENT: number;
    static SHOW_DOCUMENT: number;
    static SHOW_DOCUMENT_TYPE: number;
    static SHOW_DOCUMENT_FRAGMENT: number;
    static SHOW_NOTATION: number;
    FILTER_ACCEPT: number;
    FILTER_REJECT: number;
    FILTER_SKIP: number;
    SHOW_ALL: number;
    SHOW_ELEMENT: number;
    SHOW_ATTRIBUTE: number;
    SHOW_TEXT: number;
    SHOW_CDATA_SECTION: number;
    SHOW_ENTITY_REFERENCE: number;
    SHOW_ENTITY: number;
    SHOW_PROCESSING_INSTRUCTION: number;
    SHOW_COMMENT: number;
    SHOW_DOCUMENT: number;
    SHOW_DOCUMENT_TYPE: number;
    SHOW_DOCUMENT_FRAGMENT: number;
    SHOW_NOTATION: number;
    /**
     * Initializes a new instance of `NodeFilter`.
     */
    private constructor();
    /**
     * Callback function.
     */
    acceptNode(node: Node): FilterResult;
    /**
     * Creates a new `NodeFilter`.
     */
    static _create(): NodeFilter;
}
