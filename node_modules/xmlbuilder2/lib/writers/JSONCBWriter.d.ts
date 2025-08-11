import { XMLBuilderCBOptions, JSONCBWriterOptions } from "../interfaces";
import { BaseCBWriter } from "./BaseCBWriter";
/**
 * Serializes XML nodes.
 */
export declare class JSONCBWriter extends BaseCBWriter<JSONCBWriterOptions> {
    private _hasChildren;
    private _additionalLevel;
    /**
     * Initializes a new instance of `JSONCBWriter`.
     *
     * @param builderOptions - XML builder options
     */
    constructor(builderOptions: XMLBuilderCBOptions);
    /** @inheritdoc */
    frontMatter(): string;
    /** @inheritdoc */
    declaration(version: "1.0", encoding?: string, standalone?: boolean): string;
    /** @inheritdoc */
    docType(name: string, publicId: string, systemId: string): string;
    /** @inheritdoc */
    comment(data: string): string;
    /** @inheritdoc */
    text(data: string): string;
    /** @inheritdoc */
    instruction(target: string, data: string): string;
    /** @inheritdoc */
    cdata(data: string): string;
    /** @inheritdoc */
    attribute(name: string, value: string): string;
    /** @inheritdoc */
    openTagBegin(name: string): string;
    /** @inheritdoc */
    openTagEnd(name: string, selfClosing: boolean, voidElement: boolean): string;
    /** @inheritdoc */
    closeTag(name: string): string;
    /** @inheritdoc */
    beginElement(name: string): void;
    /** @inheritdoc */
    endElement(name: string): void;
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     */
    private _beginLine;
    /**
     * Produces an indentation string.
     *
     * @param level - depth of the tree
     */
    private _indent;
    /**
     * Produces a comma before a child node if it has previous siblings.
     */
    private _comma;
    /**
     * Produces a separator string.
     */
    private _sep;
    /**
     * Produces a JSON key string delimited with double quotes.
     */
    private _key;
    /**
     * Produces a JSON value string delimited with double quotes.
     */
    private _val;
}
