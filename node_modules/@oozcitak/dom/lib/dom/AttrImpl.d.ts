import { Element, NodeType, Attr, Document } from "./interfaces";
import { NodeImpl } from "./NodeImpl";
/**
 * Represents an attribute of an element node.
 */
export declare class AttrImpl extends NodeImpl implements Attr {
    _nodeType: NodeType;
    _localName: string;
    _namespace: string | null;
    _namespacePrefix: string | null;
    _element: Element | null;
    _value: string;
    /**
     * Initializes a new instance of `Attr`.
     *
     * @param localName - local name
     */
    private constructor();
    /** @inheritdoc */
    specified: boolean;
    /** @inheritdoc */
    get ownerElement(): Element | null;
    /** @inheritdoc */
    get namespaceURI(): string | null;
    /** @inheritdoc */
    get prefix(): string | null;
    /** @inheritdoc */
    get localName(): string;
    /** @inheritdoc */
    get name(): string;
    /** @inheritdoc */
    get value(): string;
    set value(value: string);
    /**
     * Returns the qualified name.
     */
    get _qualifiedName(): string;
    /**
     * Creates an `Attr`.
     *
     * @param document - owner document
     * @param localName - local name
     */
    static _create(document: Document, localName: string): AttrImpl;
}
