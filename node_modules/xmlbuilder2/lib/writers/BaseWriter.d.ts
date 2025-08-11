import { BaseWriterOptions, XMLBuilderOptions, XMLSerializedValue } from "../interfaces";
import { Node } from "@oozcitak/dom/lib/dom/interfaces";
/**
 * Pre-serializes XML nodes.
 */
export declare abstract class BaseWriter<T extends BaseWriterOptions, U extends XMLSerializedValue> {
    private static _VoidElementNames;
    protected _builderOptions: XMLBuilderOptions;
    protected _writerOptions: Required<T>;
    /**
     * Initializes a new instance of `BaseWriter`.
     *
     * @param builderOptions - XML builder options
     */
    constructor(builderOptions: XMLBuilderOptions);
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     */
    abstract serialize(node: Node): U;
    /**
     * Used by derived classes to serialize the XML declaration.
     *
     * @param version - a version number string
     * @param encoding - encoding declaration
     * @param standalone - standalone document declaration
     */
    declaration(version: "1.0", encoding?: string, standalone?: boolean): void;
    /**
     * Used by derived classes to serialize a DocType node.
     *
     * @param name - node name
     * @param publicId - public identifier
     * @param systemId - system identifier
     */
    docType(name: string, publicId: string, systemId: string): void;
    /**
     * Used by derived classes to serialize a comment node.
     *
     * @param data - node data
     */
    comment(data: string): void;
    /**
     * Used by derived classes to serialize a text node.
     *
     * @param data - node data
     */
    text(data: string): void;
    /**
     * Used by derived classes to serialize a processing instruction node.
     *
     * @param target - instruction target
     * @param data - node data
     */
    instruction(target: string, data: string): void;
    /**
     * Used by derived classes to serialize a CData section node.
     *
     * @param data - node data
     */
    cdata(data: string): void;
    /**
     * Used by derived classes to serialize the beginning of the opening tag of an
     * element node.
     *
     * @param name - node name
     */
    openTagBegin(name: string): void;
    /**
     * Used by derived classes to serialize the ending of the opening tag of an
     * element node.
     *
     * @param name - node name
     * @param selfClosing - whether the element node is self closing
     * @param voidElement - whether the element node is a HTML void element
     */
    openTagEnd(name: string, selfClosing: boolean, voidElement: boolean): void;
    /**
     * Used by derived classes to serialize the closing tag of an element node.
     *
     * @param name - node name
     */
    closeTag(name: string): void;
    /**
     * Used by derived classes to serialize attributes or namespace declarations.
     *
     * @param attributes - attribute array
     */
    attributes(attributes: [string | null, string | null, string, string][]): void;
    /**
     * Used by derived classes to serialize an attribute or namespace declaration.
     *
     * @param name - node name
     * @param value - node value
     */
    attribute(name: string, value: string): void;
    /**
     * Used by derived classes to perform any pre-processing steps before starting
     * serializing an element node.
     *
     * @param name - node name
     */
    beginElement(name: string): void;
    /**
     * Used by derived classes to perform any post-processing steps after
     * completing serializing an element node.
     *
     * @param name - node name
     */
    endElement(name: string): void;
    /**
     * Gets the current depth of the XML tree.
     */
    level: number;
    /**
     * Gets the current XML node.
     */
    currentNode: Node;
    /**
     * Produces an XML serialization of the given node. The pre-serializer inserts
     * namespace declarations where necessary and produces qualified names for
     * nodes and attributes.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    serializeNode(node: Node, requireWellFormed: boolean): void;
    /**
     * Produces an XML serialization of a node.
     *
     * @param node - node to serialize
     * @param namespace - context namespace
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeNodeNS;
    /**
     * Produces an XML serialization of a node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeNode;
    /**
     * Produces an XML serialization of an element node.
     *
     * @param node - node to serialize
     * @param namespace - context namespace
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeElementNS;
    /**
     * Produces an XML serialization of an element node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeElement;
    /**
     * Produces an XML serialization of a document node.
     *
     * @param node - node to serialize
     * @param namespace - context namespace
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeDocumentNS;
    /**
     * Produces an XML serialization of a document node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeDocument;
    /**
     * Produces an XML serialization of a comment node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeComment;
    /**
     * Produces an XML serialization of a text node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     * @param level - current depth of the XML tree
     */
    private _serializeText;
    /**
     * Produces an XML serialization of a document fragment node.
     *
     * @param node - node to serialize
     * @param namespace - context namespace
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeDocumentFragmentNS;
    /**
     * Produces an XML serialization of a document fragment node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeDocumentFragment;
    /**
     * Produces an XML serialization of a document type node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeDocumentType;
    /**
     * Produces an XML serialization of a processing instruction node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeProcessingInstruction;
    /**
     * Produces an XML serialization of a CDATA node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeCData;
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
    private _serializeAttributesNS;
    /**
    * Produces an XML serialization of the attributes of an element node.
    *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
    */
    private _serializeAttributes;
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
     * Produces an XML serialization of an attribute value.
     *
     * @param value - attribute value
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeAttributeValue;
}
