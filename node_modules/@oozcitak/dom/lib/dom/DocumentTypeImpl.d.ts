import { Node, NodeType, DocumentType, Document } from "./interfaces";
import { NodeImpl } from "./NodeImpl";
/**
 * Represents an object providing methods which are not dependent on
 * any particular document
 */
export declare class DocumentTypeImpl extends NodeImpl implements DocumentType {
    _nodeType: NodeType;
    _name: string;
    _publicId: string;
    _systemId: string;
    /**
     * Initializes a new instance of `DocumentType`.
     *
     * @param name - name of the node
     * @param publicId - `PUBLIC` identifier
     * @param systemId - `SYSTEM` identifier
     */
    private constructor();
    /** @inheritdoc */
    get name(): string;
    /** @inheritdoc */
    get publicId(): string;
    /** @inheritdoc */
    get systemId(): string;
    before(...nodes: (Node | string)[]): void;
    after(...nodes: (Node | string)[]): void;
    replaceWith(...nodes: (Node | string)[]): void;
    remove(): void;
    /**
     * Creates a new `DocumentType`.
     *
     * @param document - owner document
     * @param name - name of the node
     * @param publicId - `PUBLIC` identifier
     * @param systemId - `SYSTEM` identifier
     */
    static _create(document: Document, name: string, publicId?: string, systemId?: string): DocumentTypeImpl;
}
