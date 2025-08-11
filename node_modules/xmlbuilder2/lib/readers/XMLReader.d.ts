import { XMLBuilder } from "../interfaces";
import { BaseReader } from "./BaseReader";
/**
 * Parses XML nodes from an XML document string.
 */
export declare class XMLReader extends BaseReader<string> {
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param str - XML document string to parse
     */
    _parse(node: XMLBuilder, str: string): XMLBuilder;
}
