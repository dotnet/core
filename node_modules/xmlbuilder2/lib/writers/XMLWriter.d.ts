import { XMLWriterOptions, XMLBuilderOptions } from "../interfaces";
import { Node } from "@oozcitak/dom/lib/dom/interfaces";
import { BaseWriter } from "./BaseWriter";
/**
 * Serializes XML nodes into strings.
 */
export declare class XMLWriter extends BaseWriter<XMLWriterOptions, string> {
    private _refs;
    private _indentation;
    private _lengthToLastNewline;
    /**
     * Initializes a new instance of `XMLWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    constructor(builderOptions: XMLBuilderOptions, writerOptions: XMLWriterOptions);
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     */
    serialize(node: Node): string;
    /** @inheritdoc */
    declaration(version: "1.0", encoding?: string, standalone?: boolean): void;
    /** @inheritdoc */
    docType(name: string, publicId: string, systemId: string): void;
    /** @inheritdoc */
    openTagBegin(name: string): void;
    /** @inheritdoc */
    openTagEnd(name: string, selfClosing: boolean, voidElement: boolean): void;
    /** @inheritdoc */
    closeTag(name: string): void;
    /** @inheritdoc */
    attribute(name: string, value: string): void;
    /** @inheritdoc */
    text(data: string): void;
    /** @inheritdoc */
    cdata(data: string): void;
    /** @inheritdoc */
    comment(data: string): void;
    /** @inheritdoc */
    instruction(target: string, data: string): void;
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     */
    private _beginLine;
    /**
     * Produces characters to be appended to a line of string in pretty-print
     * mode.
     */
    private _endLine;
    /**
     * Produces an indentation string.
     *
     * @param level - depth of the tree
     */
    private _indent;
}
