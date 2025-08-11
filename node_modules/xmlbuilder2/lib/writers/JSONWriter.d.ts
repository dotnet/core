import { JSONWriterOptions, XMLBuilderOptions } from "../interfaces";
import { Node } from "@oozcitak/dom/lib/dom/interfaces";
import { BaseWriter } from "./BaseWriter";
/**
 * Serializes XML nodes into a JSON string.
 */
export declare class JSONWriter extends BaseWriter<JSONWriterOptions, string> {
    /**
     * Initializes a new instance of `JSONWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    constructor(builderOptions: XMLBuilderOptions, writerOptions: JSONWriterOptions);
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     * @param writerOptions - serialization options
     */
    serialize(node: Node): string;
    /**
     * Produces an XML serialization of the given object.
     *
     * @param obj - object to serialize
     * @param options - serialization options
     * @param level - depth of the XML tree
     */
    private _convertObject;
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     * @param level - current depth of the XML tree
     */
    private _beginLine;
    /**
     * Produces characters to be appended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     * @param level - current depth of the XML tree
     */
    private _endLine;
    /**
     * Produces a JSON key string delimited with double quotes.
     */
    private _key;
    /**
     * Produces a JSON value string delimited with double quotes.
     */
    private _val;
    /**
     * Determines if an object is a leaf node.
     *
     * @param obj
     */
    private _isLeafNode;
    /**
     * Counts the number of descendants of the given object.
     *
     * @param obj
     * @param count
     */
    private _descendantCount;
}
