import { TextImpl } from "./TextImpl";
import { NodeType, CDATASection, Document } from "./interfaces";
/**
 * Represents a CDATA node.
 */
export declare class CDATASectionImpl extends TextImpl implements CDATASection {
    _nodeType: NodeType;
    /**
     * Initializes a new instance of `CDATASection`.
     *
     * @param data - node contents
     */
    private constructor();
    /**
     * Creates a new `CDATASection`.
     *
     * @param document - owner document
     * @param data - node contents
     */
    static _create(document: Document, data?: string): CDATASectionImpl;
}
