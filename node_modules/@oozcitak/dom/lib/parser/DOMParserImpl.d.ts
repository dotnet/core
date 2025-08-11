import { DOMParser, MimeType } from "./interfaces";
import { Document } from "../dom/interfaces";
/**
 * Represents a parser for XML and HTML content.
 *
 * See: https://w3c.github.io/DOM-Parsing/#the-domparser-interface
 */
export declare class DOMParserImpl implements DOMParser {
    /** @inheritdoc */
    parseFromString(source: string, mimeType: MimeType): Document;
}
