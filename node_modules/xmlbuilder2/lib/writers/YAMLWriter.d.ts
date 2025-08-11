import { YAMLWriterOptions, XMLBuilderOptions } from "../interfaces";
import { Node } from "@oozcitak/dom/lib/dom/interfaces";
import { BaseWriter } from "./BaseWriter";
/**
 * Serializes XML nodes into a YAML string.
 */
export declare class YAMLWriter extends BaseWriter<YAMLWriterOptions, string> {
    /**
     * Initializes a new instance of `YAMLWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    constructor(builderOptions: XMLBuilderOptions, writerOptions: YAMLWriterOptions);
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
     * @param indentLeaf - indents leaf nodes
     */
    private _convertObject;
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     * @param level - current depth of the XML tree
     * @param isArray - whether this line is an array item
     */
    private _beginLine;
    /**
     * Produces characters to be appended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     */
    private _endLine;
    /**
     * Produces a YAML key string delimited with double quotes.
     */
    private _key;
    /**
     * Produces a YAML value string delimited with double quotes.
     */
    private _val;
}
