import { XMLBuilderCBOptions, BaseCBWriterOptions } from "../interfaces";
/**
 * Pre-serializes XML nodes.
 */
export declare abstract class BaseCBWriter<T extends BaseCBWriterOptions> {
    protected _builderOptions: XMLBuilderCBOptions;
    protected _writerOptions: T;
    /**
     * Gets the current depth of the XML tree.
     */
    level: number;
    /**
     * Determines whether any data has been written.
     */
    hasData?: boolean;
    /**
     * Initializes a new instance of `BaseCBWriter`.
     *
     * @param builderOptions - XML builder options
     */
    constructor(builderOptions: XMLBuilderCBOptions);
    /**
     * Used by derived classes to serialize a front matter.
     */
    abstract frontMatter(): string;
    /**
     * Used by derived classes to serialize the XML declaration.
     *
     * @param version - XML version
     * @param encoding - character encoding
     * @param standalone - standalone document declaration
     */
    abstract declaration(version: "1.0", encoding?: string, standalone?: boolean): string;
    /**
     * Used by derived classes to serialize a DocType node.
     *
     * @param name - node name
     * @param publicId - public identifier
     * @param systemId - system identifier
     */
    abstract docType(name: string, publicId: string, systemId: string): string;
    /**
     * Used by derived classes to serialize a comment node.
     *
     * @param data - node data
     */
    abstract comment(data: string): string;
    /**
     * Used by derived classes to serialize a text node.
     *
     * @param data - node data
     */
    abstract text(data: string): string;
    /**
     * Used by derived classes to serialize a processing instruction node.
     *
     * @param target - instruction target
     * @param data - node data
     */
    abstract instruction(target: string, data: string): string;
    /**
     * Used by derived classes to serialize a CData section node.
     *
     * @param data - node data
     */
    abstract cdata(data: string): string;
    /**
     * Used by derived classes to serialize the beginning of the opening tag of an
     * element node.
     *
     * @param name - node name
     */
    abstract openTagBegin(name: string): string;
    /**
     * Used by derived classes to serialize the ending of the opening tag of an
     * element node.
     *
     * @param name - node name
     * @param selfClosing - whether the element node is self closing
     * @param voidElement - whether the element node is a HTML void element
     */
    abstract openTagEnd(name: string, selfClosing: boolean, voidElement: boolean): string;
    /**
     * Used by derived classes to serialize the closing tag of an element node.
     *
     * @param name - node name
     */
    abstract closeTag(name: string): string;
    /**
     * Used by derived classes to serialize an attribute or namespace declaration.
     *
     * @param name - node name
     * @param value - node value
     */
    abstract attribute(name: string, value: string): string;
    /**
     * Used by derived classes to perform any pre-processing steps before starting
     * serializing an element node.
     *
     * @param name - node name
     */
    abstract beginElement(name: string): void;
    /**
     * Used by derived classes to perform any post-processing steps after
     * completing serializing an element node.
     *
     * @param name - node name
     */
    abstract endElement(name: string): void;
}
