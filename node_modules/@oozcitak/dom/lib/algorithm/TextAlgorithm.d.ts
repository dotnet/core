import { Node, Text } from "../dom/interfaces";
/**
 * Returns node with its adjacent text and cdata node siblings.
 *
 * @param node - a node
 * @param self - whether to include node itself
 */
export declare function text_contiguousTextNodes(node: Text, self?: boolean): Iterable<Text>;
/**
 * Returns node with its adjacent text node siblings.
 *
 * @param node - a node
 * @param self - whether to include node itself
 */
export declare function text_contiguousExclusiveTextNodes(node: Text, self?: boolean): Iterable<Text>;
/**
 * Returns the concatenation of the data of all the Text node descendants of
 * node, in tree order.
 *
 * @param node - a node
 */
export declare function text_descendantTextContent(node: Node): string;
/**
 * Splits data at the given offset and returns the remainder as a text
 * node.
 *
 * @param node - a text node
 * @param offset - the offset at which to split the nodes.
 */
export declare function text_split(node: Text, offset: number): Text;
