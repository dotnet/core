import { Node, NodeIterator } from "../dom/interfaces";
import { FixedSizeSet } from "@oozcitak/util";
/**
 * Returns the next or previous node in the subtree, or `null` if
 * there are none.
 *
 * @param iterator - the `NodeIterator` instance
 * @param forward- `true` to return the next node, or `false` to
 * return the previous node.
 */
export declare function nodeIterator_traverse(iterator: NodeIterator, forward: boolean): Node | null;
/**
 * Gets the global iterator list.
 */
export declare function nodeIterator_iteratorList(): FixedSizeSet<NodeIterator>;
