/// <reference types="node" />
import { XMLBuilderCB, AttributesObject, PIObject, DTDOptions, XMLBuilder, ExpandObject, XMLBuilderCBCreateOptions } from "../interfaces";
import { EventEmitter } from "events";
/**
 * Represents a readable XML document stream.
 */
export declare class XMLBuilderCBImpl extends EventEmitter implements XMLBuilderCB {
    private static _VoidElementNames;
    private _options;
    private _builderOptions;
    private _writer;
    private _fragment;
    private _hasDeclaration;
    private _docTypeName;
    private _hasDocumentElement;
    private _currentElement?;
    private _currentElementSerialized;
    private _openTags;
    private _prefixMap;
    private _prefixIndex;
    private _ended;
    /**
     * Initializes a new instance of `XMLStream`.
     *
     * @param options - stream writer options
     * @param fragment - whether to create fragment stream or a document stream
     *
     * @returns XML stream
     */
    constructor(options?: XMLBuilderCBCreateOptions, fragment?: boolean);
    /** @inheritdoc */
    ele(p1: string | null | ExpandObject, p2?: AttributesObject | string, p3?: AttributesObject): this;
    /** @inheritdoc */
    att(p1: AttributesObject | string | null, p2?: string, p3?: string): this;
    /** @inheritdoc */
    com(content: string): this;
    /** @inheritdoc */
    txt(content: string): this;
    /** @inheritdoc */
    ins(target: string | PIObject, content?: string): this;
    /** @inheritdoc */
    dat(content: string): this;
    /** @inheritdoc */
    dec(options?: {
        version?: "1.0";
        encoding?: string;
        standalone?: boolean;
    }): this;
    /** @inheritdoc */
    dtd(options: DTDOptions & {
        name: string;
    }): this;
    /** @inheritdoc */
    import(node: XMLBuilder): this;
    /** @inheritdoc */
    up(): this;
    /** @inheritdoc */
    end(): this;
    /**
     * Serializes the opening tag of an element node.
     *
     * @param hasChildren - whether the element node has child nodes
     */
    private _serializeOpenTag;
    /**
     * Serializes the closing tag of an element node.
     */
    private _serializeCloseTag;
    /**
     * Pushes data to internal buffer.
     *
     * @param data - data
     */
    private _push;
    /**
     * Reads and serializes an XML tree.
     *
     * @param node - root node
     */
    private _fromNode;
    /**
     * Produces an XML serialization of the attributes of an element node.
     *
     * @param node - node to serialize
     * @param map - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param localPrefixesMap - local prefixes map
     * @param ignoreNamespaceDefinitionAttribute - whether to ignore namespace
     * attributes
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeAttributes;
    /**
     * Produces an XML serialization of an attribute value.
     *
     * @param value - attribute value
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeAttributeValue;
    /**
     * Records namespace information for the given element and returns the
     * default namespace attribute value.
     *
     * @param node - element node to process
     * @param map - namespace prefix map
     * @param localPrefixesMap - local prefixes map
     */
    private _recordNamespaceInformation;
    /**
     * Generates a new prefix for the given namespace.
     *
     * @param newNamespace - a namespace to generate prefix for
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     */
    private _generatePrefix;
    /**
     * Determines if the namespace prefix map was modified from its original.
     *
     * @param originalMap - original namespace prefix map
     * @param newMap - new namespace prefix map
     */
    private _isPrefixMapModified;
}
