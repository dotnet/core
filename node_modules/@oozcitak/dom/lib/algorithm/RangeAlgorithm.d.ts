import { Node, AbstractRange, DocumentFragment, Range } from "../dom/interfaces";
/**
 * Determines if the node's start boundary point is at its end boundary
 * point.
 *
 * @param range - a range
 */
export declare function range_collapsed(range: AbstractRange): boolean;
/**
 * Gets the root node of a range.
 *
 * @param range - a range
 */
export declare function range_root(range: AbstractRange): Node;
/**
 * Determines if a node is fully contained in a range.
 *
 * @param node - a node
 * @param range - a range
 */
export declare function range_isContained(node: Node, range: AbstractRange): boolean;
/**
 * Determines if a node is partially contained in a range.
 *
 * @param node - a node
 * @param range - a range
 */
export declare function range_isPartiallyContained(node: Node, range: AbstractRange): boolean;
/**
 * Sets the start boundary point of a range.
 *
 * @param range - a range
 * @param node - a node
 * @param offset - an offset into node
 */
export declare function range_setTheStart(range: AbstractRange, node: Node, offset: number): void;
/**
 * Sets the end boundary point of a range.
 *
 * @param range - a range
 * @param node - a node
 * @param offset - an offset into node
 */
export declare function range_setTheEnd(range: AbstractRange, node: Node, offset: number): void;
/**
 * Selects a node.
 *
 * @param range - a range
 * @param node - a node
 */
export declare function range_select(node: Node, range: AbstractRange): void;
/**
 * EXtracts the contents of range as a document fragment.
 *
 * @param range - a range
 */
export declare function range_extract(range: AbstractRange): DocumentFragment;
/**
 * Clones the contents of range as a document fragment.
 *
 * @param range - a range
 */
export declare function range_cloneTheContents(range: AbstractRange): DocumentFragment;
/**
 * Inserts a node into a range at the start boundary point.
 *
 * @param node - node to insert
 * @param range - a range
 */
export declare function range_insert(node: Node, range: AbstractRange): void;
/**
 * Traverses through all contained nodes of a range.
 *
 * @param range - a range
 */
export declare function range_getContainedNodes(range: Range): Iterable<Node>;
/**
 * Traverses through all partially contained nodes of a range.
 *
 * @param range - a range
 */
export declare function range_getPartiallyContainedNodes(range: Range): Iterable<Node>;
