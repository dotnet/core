import { XMLBuilderOptions, ExpandObject, XMLBuilder } from "../interfaces";
/**
 * Parses XML nodes.
 */
export declare abstract class BaseReader<U extends string | ExpandObject> {
    protected _builderOptions: XMLBuilderOptions;
    private static _entityTable;
    /**
     * Initializes a new instance of `BaseReader`.
     *
     * @param builderOptions - XML builder options
     */
    constructor(builderOptions: XMLBuilderOptions);
    abstract _parse(node: XMLBuilder, obj: U): XMLBuilder;
    _docType(parent: XMLBuilder, name: string, publicId: string, systemId: string): XMLBuilder | undefined;
    _comment(parent: XMLBuilder, data: string): XMLBuilder | undefined;
    _text(parent: XMLBuilder, data: string): XMLBuilder | undefined;
    _instruction(parent: XMLBuilder, target: string, data: string): XMLBuilder | undefined;
    _cdata(parent: XMLBuilder, data: string): XMLBuilder | undefined;
    _element(parent: XMLBuilder, namespace: string | null | undefined, name: string): XMLBuilder | undefined;
    _attribute(parent: XMLBuilder, namespace: string | null | undefined, name: string, value: string): XMLBuilder | undefined;
    _sanitize(str: string): string;
    /**
     * Decodes serialized text.
     *
     * @param text - text value to serialize
     */
    _decodeText(text: string): string;
    /**
     * Decodes serialized attribute value.
     *
     * @param text - attribute value to serialize
     */
    _decodeAttributeValue(text: string): string;
    /**
     * Main parser function which parses the given object and returns an XMLBuilder.
     *
     * @param node - node to recieve parsed content
     * @param obj - object to parse
     */
    parse(node: XMLBuilder, obj: U): XMLBuilder;
    /**
     * Creates a DocType node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param name - node name
     * @param publicId - public identifier
     * @param systemId - system identifier
     */
    docType(parent: XMLBuilder, name: string, publicId: string, systemId: string): XMLBuilder | undefined;
    /**
     * Creates a comment node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     */
    comment(parent: XMLBuilder, data: string): XMLBuilder | undefined;
    /**
     * Creates a text node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     */
    text(parent: XMLBuilder, data: string): XMLBuilder | undefined;
    /**
     * Creates a processing instruction node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param target - instruction target
     * @param data - node data
     */
    instruction(parent: XMLBuilder, target: string, data: string): XMLBuilder | undefined;
    /**
     * Creates a CData section node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     */
    cdata(parent: XMLBuilder, data: string): XMLBuilder | undefined;
    /**
     * Creates an element node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param namespace - node namespace
     * @param name - node name
     */
    element(parent: XMLBuilder, namespace: string | null | undefined, name: string): XMLBuilder | undefined;
    /**
     * Creates an attribute or namespace declaration.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param namespace - node namespace
     * @param name - node name
     * @param value - node value
     */
    attribute(parent: XMLBuilder, namespace: string | null | undefined, name: string, value: string): XMLBuilder | undefined;
    /**
     * Sanitizes input strings.
     *
     * @param str - input string
     */
    sanitize(str: string): string;
}
