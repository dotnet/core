import { Slotable, Slot, Element, Node } from "../dom/interfaces";
/**
 * Signals a slot change to the given slot.
 *
 * @param slot - a slot
 */
export declare function shadowTree_signalASlotChange(slot: Slot): void;
/**
 * Determines whether a the shadow tree of the given element node is
 * connected to a document node.
 *
 * @param element - an element node of the shadow tree
 */
export declare function shadowTree_isConnected(element: Element): boolean;
/**
 * Determines whether a slotable is assigned.
 *
 * @param slotable - a slotable
 */
export declare function shadowTree_isAssigned(slotable: Slotable): boolean;
/**
 * Finds a slot for the given slotable.
 *
 * @param slotable - a slotable
 * @param openFlag - `true` to search open shadow tree's only
 */
export declare function shadowTree_findASlot(slotable: Slotable, openFlag?: boolean): Slot | null;
/**
 * Finds slotables for the given slot.
 *
 * @param slot - a slot
 */
export declare function shadowTree_findSlotables(slot: Slot): Slotable[];
/**
 * Finds slotables for the given slot.
 *
 * @param slot - a slot
 */
export declare function shadowTree_findFlattenedSlotables(slot: Slot): Slotable[];
/**
 * Assigns slotables to the given slot.
 *
 * @param slot - a slot
 */
export declare function shadowTree_assignSlotables(slot: Slot): void;
/**
 * Assigns slotables to all nodes of a tree.
 *
 * @param root - root node
 */
export declare function shadowTree_assignSlotablesForATree(root: Node): void;
/**
 * Assigns a slot to a slotables.
 *
 * @param slotable - a slotable
 */
export declare function shadowTree_assignASlot(slotable: Slotable): void;
