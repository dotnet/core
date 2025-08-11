import { Document } from "../dom/interfaces";
/**
 * Represents a parser for XML content.
 *
 * See: https://html.spec.whatwg.org/#xml-parser
 */
export declare class XMLParserImpl {
    /**
     * Parses XML content.
     *
     * @param source - a string containing XML content
     */
    parse(source: string): Document;
    /**
     * Decodes serialized text.
     *
     * @param text - text value to serialize
     */
    private _decodeText;
    /**
     * Decodes serialized attribute value.
     *
     * @param text - attribute value to serialize
     */
    private _decodeAttributeValue;
}
