import { FilterResult, NodeIterator, Node, TreeWalker } from "../dom/interfaces";
/**
 * Applies the filter to the given node and returns the result.
 *
 * @param traverser - the `NodeIterator` or `TreeWalker` instance
 * @param node - the node to filter
 */
export declare function traversal_filter(traverser: NodeIterator | TreeWalker, node: Node): FilterResult;
