import { Element, Node } from "../dom/interfaces";
/**
 * Returns the first descendant node of the tree rooted at `node` in
 * depth-first pre-order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */
export declare function tree_getFirstDescendantNode(node: Node, self?: boolean, shadow?: boolean, filter?: ((childNode: Node) => boolean)): Node | null;
/**
 * Returns the next descendant node of the tree rooted at `node` in
 * depth-first pre-order.
 *
 * @param node - root node of the tree
 * @param currentNode - current descendant node
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */
export declare function tree_getNextDescendantNode(node: Node, currentNode: Node, self?: boolean, shadow?: boolean, filter?: ((childNode: Node) => boolean)): Node | null;
/**
 * Traverses through all descendant nodes of the tree rooted at
 * `node` in depth-first pre-order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */
export declare function tree_getDescendantNodes(node: Node, self?: boolean, shadow?: boolean, filter?: ((childNode: Node) => boolean)): Iterable<Node>;
/**
 * Traverses through all descendant element nodes of the tree rooted at
 * `node` in depth-first preorder.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */
export declare function tree_getDescendantElements(node: Node, self?: boolean, shadow?: boolean, filter?: ((childNode: Element) => boolean)): Iterable<Element>;
/**
 * Traverses through all sibling nodes of `node`.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */
export declare function tree_getSiblingNodes(node: Node, self?: boolean, filter?: ((childNode: Node) => boolean)): Iterable<Node>;
/**
 * Gets the first ancestor of `node` in reverse tree order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */
export declare function tree_getFirstAncestorNode(node: Node, self?: boolean, filter?: ((ancestorNode: Node) => boolean)): Node | null;
/**
 * Gets the first ancestor of `node` in reverse tree order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */
export declare function tree_getNextAncestorNode(node: Node, currentNode: Node, self?: boolean, filter?: ((ancestorNode: Node) => boolean)): Node | null;
/**
 * Traverses through all ancestor nodes `node` in reverse tree order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */
export declare function tree_getAncestorNodes(node: Node, self?: boolean, filter?: ((ancestorNode: Node) => boolean)): Iterable<Node>;
/**
 * Returns the common ancestor of the given nodes.
 *
 * @param nodeA - a node
 * @param nodeB - a node
 */
export declare function tree_getCommonAncestor(nodeA: Node, nodeB: Node): Node | null;
/**
 * Returns the node following `node` in depth-first preorder.
 *
 * @param root - root of the subtree
 * @param node - a node
 */
export declare function tree_getFollowingNode(root: Node, node: Node): Node | null;
/**
 * Returns the node preceding `node` in depth-first preorder.
 *
 * @param root - root of the subtree
 * @param node - a node
 */
export declare function tree_getPrecedingNode(root: Node, node: Node): Node | null;
/**
 * Determines if the node tree is constrained. A node tree is
 * constrained as follows, expressed as a relationship between the
 * type of node and its allowed children:
 *  - Document (In tree order)
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *    * Optionally one DocumentType node.
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *    * Optionally one Element node.
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *  - DocumentFragment, Element
 *    * Zero or more nodes each of which is Element, Text,
 *      ProcessingInstruction, or Comment.
 *  - DocumentType, Text, ProcessingInstruction, Comment
 *    * None.
 *
 * @param node - the root of the tree
 */
export declare function tree_isConstrained(node: Node): boolean;
/**
 * Returns the length of a node.
 *
 * @param node - a node to check
 */
export declare function tree_nodeLength(node: Node): number;
/**
 * Determines if a node is empty.
 *
 * @param node - a node to check
 */
export declare function tree_isEmpty(node: Node): boolean;
/**
 * Returns the root node of a tree. The root of an object is itself,
 * if its parent is `null`, or else it is the root of its parent.
 * The root of a tree is any object participating in that tree
 * whose parent is `null`.
 *
 * @param node - a node of the tree
 * @param shadow - `true` to return shadow-including root, otherwise
 * `false`
 */
export declare function tree_rootNode(node: Node, shadow?: boolean): Node;
/**
 * Determines whether `other` is a descendant of `node`. An object
 * A is called a descendant of an object B, if either A is a child
 * of B or A is a child of an object C that is a descendant of B.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 * @param shadow - if `true`, traversal includes the
 * node's and its descendant's shadow trees as well.
 */
export declare function tree_isDescendantOf(node: Node, other: Node, self?: boolean, shadow?: boolean): boolean;
/**
 * Determines whether `other` is an ancestor of `node`. An object A
 * is called an ancestor of an object B if and only if B is a
 * descendant of A.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 * @param shadow - if `true`, traversal includes the
 * node's and its descendant's shadow trees as well.
 */
export declare function tree_isAncestorOf(node: Node, other: Node, self?: boolean, shadow?: boolean): boolean;
/**
 * Determines whether `other` is a host-including ancestor of `node`. An
 * object A is a host-including inclusive ancestor of an object B, if either
 * A is an inclusive ancestor of B, or if B’s root has a non-null host and
 * A is a host-including inclusive ancestor of B’s root’s host.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 */
export declare function tree_isHostIncludingAncestorOf(node: Node, other: Node, self?: boolean): boolean;
/**
 * Determines whether `other` is a sibling of `node`. An object A is
 * called a sibling of an object B, if and only if B and A share
 * the same non-null parent.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 */
export declare function tree_isSiblingOf(node: Node, other: Node, self?: boolean): boolean;
/**
 * Determines whether `other` is preceding `node`. An object A is
 * preceding an object B if A and B are in the same tree and A comes
 * before B in tree order.
 *
 * @param node - a node
 * @param other - the node to check
 */
export declare function tree_isPreceding(node: Node, other: Node): boolean;
/**
 * Determines whether `other` is following `node`. An object A is
 * following an object B if A and B are in the same tree and A comes
 * after B in tree order.
 *
 * @param node - a node
 * @param other - the node to check
 */
export declare function tree_isFollowing(node: Node, other: Node): boolean;
/**
 * Determines whether `other` is the parent node of `node`.
 *
 * @param node - a node
 * @param other - the node to check
 */
export declare function tree_isParentOf(node: Node, other: Node): boolean;
/**
 * Determines whether `other` is a child node of `node`.
 *
 * @param node - a node
 * @param other - the node to check
 */
export declare function tree_isChildOf(node: Node, other: Node): boolean;
/**
 * Returns the previous sibling node of `node` or null if it has no
 * preceding sibling.
 *
 * @param node
 */
export declare function tree_previousSibling(node: Node): Node | null;
/**
 * Returns the next sibling node of `node` or null if it has no
 * following sibling.
 *
 * @param node
 */
export declare function tree_nextSibling(node: Node): Node | null;
/**
 * Returns the first child node of `node` or null if it has no
 * children.
 *
 * @param node
 */
export declare function tree_firstChild(node: Node): Node | null;
/**
 * Returns the last child node of `node` or null if it has no
 * children.
 *
 * @param node
 */
export declare function tree_lastChild(node: Node): Node | null;
/**
 * Returns the zero-based index of `node` when counted preorder in
 * the tree rooted at `root`. Returns `-1` if `node` is not in
 * the tree.
 *
 * @param node - the node to get the index of
 */
export declare function tree_treePosition(node: Node): number;
/**
 * Determines the index of `node`. The index of an object is its number of
 * preceding siblings, or 0 if it has none.
 *
 * @param node - a node
 * @param other - the node to check
 */
export declare function tree_index(node: Node): number;
/**
 * Retargets an object against another object.
 *
 * @param a - an object to retarget
 * @param b - an object to retarget against
 */
export declare function tree_retarget(a: any, b: any): any;
