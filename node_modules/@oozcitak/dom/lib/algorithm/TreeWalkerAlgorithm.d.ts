import { TreeWalker, Node } from "../dom/interfaces";
/**
 * Returns the first or last child node, or `null` if there are none.
 *
 * @param walker - the `TreeWalker` instance
 * @param first - `true` to return the first child node, or `false` to
 * return the last child node.
 */
export declare function treeWalker_traverseChildren(walker: TreeWalker, first: boolean): Node | null;
/**
 * Returns the next or previous sibling node, or `null` if there are none.
 *
 * @param walker - the `TreeWalker` instance
 * @param next - `true` to return the next sibling node, or `false` to
 * return the previous sibling node.
 */
export declare function treeWalker_traverseSiblings(walker: TreeWalker, next: boolean): Node | null;
