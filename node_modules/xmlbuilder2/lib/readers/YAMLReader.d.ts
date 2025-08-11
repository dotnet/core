import { XMLBuilder } from "../interfaces";
import { BaseReader } from "./BaseReader";
/**
 * Parses XML nodes from a YAML string.
 */
export declare class YAMLReader extends BaseReader<string> {
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param str - YAML string to parse
     */
    _parse(node: XMLBuilder, str: string): XMLBuilder;
}
