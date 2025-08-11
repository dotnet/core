import { Node } from "../dom/interfaces";
import { XMLSerializer } from "./interfaces";
/**
 * Represents an XML serializer.
 *
 * Implements: https://www.w3.org/TR/DOM-Parsing/#serializing
 */
export declare class XMLSerializerImpl implements XMLSerializer {
    private static _VoidElementNames;
    /** @inheritdoc */
    serializeToString(root: Node): string;
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _xmlSerialization;
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
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeDocument;
    /**
     * Produces an XML serialization of a document fragment node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeDocumentFragment;
    /**
     * Produces an XML serialization of the attributes of an element node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    private _serializeAttributes;
}
