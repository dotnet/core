import { XMLBuilder, ExpandObject } from "../interfaces";
import { BaseReader } from "./BaseReader";
/**
 * Parses XML nodes from objects and arrays.
 * ES6 maps and sets are also supoorted.
 */
export declare class ObjectReader extends BaseReader<ExpandObject> {
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param obj - object to parse
     */
    _parse(node: XMLBuilder, obj: ExpandObject): XMLBuilder;
}
