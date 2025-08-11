import { ObjectWriterOptions, XMLSerializedAsObject, XMLSerializedAsObjectArray, XMLBuilderOptions } from "../interfaces";
import { Node } from "@oozcitak/dom/lib/dom/interfaces";
import { BaseWriter } from "./BaseWriter";
/**
 * Serializes XML nodes into objects and arrays.
 */
export declare class ObjectWriter extends BaseWriter<ObjectWriterOptions, XMLSerializedAsObject | XMLSerializedAsObjectArray> {
    private _currentList;
    private _currentIndex;
    private _listRegister;
    /**
     * Initializes a new instance of `ObjectWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    constructor(builderOptions: XMLBuilderOptions, writerOptions: ObjectWriterOptions);
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     */
    serialize(node: Node): XMLSerializedAsObject | XMLSerializedAsObjectArray;
    private _process;
    private _processSpecItem;
    /** @inheritdoc */
    beginElement(name: string): void;
    /** @inheritdoc */
    endElement(): void;
    /** @inheritdoc */
    attribute(name: string, value: string): void;
    /** @inheritdoc */
    comment(data: string): void;
    /** @inheritdoc */
    text(data: string): void;
    /** @inheritdoc */
    instruction(target: string, data: string): void;
    /** @inheritdoc */
    cdata(data: string): void;
    private _isAttrNode;
    private _isTextNode;
    private _isCommentNode;
    private _isInstructionNode;
    private _isCDATANode;
    private _isElementNode;
    /**
     * Returns an object key for an attribute or namespace declaration.
     */
    private _getAttrKey;
    /**
     * Returns an object key for the given node type.
     *
     * @param nodeType - node type to get a key for
     */
    private _getNodeKey;
}
