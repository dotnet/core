import { Node } from "../dom/interfaces";
/**
 * Queues a mutation observer microtask to the surrounding agent’s mutation
 * observers.
 */
export declare function observer_queueAMutationObserverMicrotask(): void;
/**
 * Notifies the surrounding agent’s mutation observers.
 */
export declare function observer_notifyMutationObservers(): void;
/**
 * Queues a mutation record of the given type for target.
 *
 * @param type - mutation record type
 * @param target - target node
 * @param name - name before mutation
 * @param namespace - namespace before mutation
 * @param oldValue - attribute value before mutation
 * @param addedNodes - a list od added nodes
 * @param removedNodes - a list of removed nodes
 * @param previousSibling - previous sibling of target before mutation
 * @param nextSibling - next sibling of target before mutation
 */
export declare function observer_queueMutationRecord(type: "attributes" | "characterData" | "childList", target: Node, name: string | null, namespace: string | null, oldValue: string | null, addedNodes: Node[], removedNodes: Node[], previousSibling: Node | null, nextSibling: Node | null): void;
/**
 * Queues a tree mutation record for target.
 *
 * @param target - target node
 * @param addedNodes - a list od added nodes
 * @param removedNodes - a list of removed nodes
 * @param previousSibling - previous sibling of target before mutation
 * @param nextSibling - next sibling of target before mutation
 */
export declare function observer_queueTreeMutationRecord(target: Node, addedNodes: Node[], removedNodes: Node[], previousSibling: Node | null, nextSibling: Node | null): void;
/**
 * Queues an attribute mutation record for target.
 *
 * @param target - target node
 * @param name - name before mutation
 * @param namespace - namespace before mutation
 * @param oldValue - attribute value before mutation
 */
export declare function observer_queueAttributeMutationRecord(target: Node, name: string | null, namespace: string | null, oldValue: string | null): void;
