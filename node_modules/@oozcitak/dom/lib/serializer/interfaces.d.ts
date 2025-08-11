import { Node } from "../dom/interfaces";
/**
 * Represents an XML serializer.
 *
 * Implements: https://www.w3.org/TR/DOM-Parsing/#serializing
 */
export interface XMLSerializer {
    /**
     * Produces an XML serialization of the given node.
     *
     * @param root - node to serialize
     * @param requireWellFormed - whether to check conformance
     */
    serializeToString(root: Node): string;
}
