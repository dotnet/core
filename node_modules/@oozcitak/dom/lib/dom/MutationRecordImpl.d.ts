import { Node, NodeList, MutationRecord } from "./interfaces";
/**
 * Represents a mutation record.
 */
export declare class MutationRecordImpl implements MutationRecord {
    private _type;
    private _target;
    private _addedNodes;
    private _removedNodes;
    private _previousSibling;
    private _nextSibling;
    private _attributeName;
    private _attributeNamespace;
    private _oldValue;
    /**
     * Initializes a new instance of `MutationRecord`.
     *
     * @param type - type of mutation: `"attributes"` for an attribute
     * mutation, `"characterData"` for a mutation to a CharacterData node
     * and `"childList"` for a mutation to the tree of nodes.
     * @param target - node affected by the mutation.
     * @param addedNodes - list of added nodes.
     * @param removedNodes - list of removed nodes.
     * @param previousSibling - previous sibling of added or removed nodes.
     * @param nextSibling - next sibling of added or removed nodes.
     * @param attributeName - local name of the changed attribute,
     * and `null` otherwise.
     * @param attributeNamespace - namespace of the changed attribute,
     * and `null` otherwise.
     * @param oldValue - value before mutation: attribute value for an attribute
     * mutation, node `data` for a mutation to a CharacterData node and `null`
     * for a mutation to the tree of nodes.
     */
    private constructor();
    /** @inheritdoc */
    get type(): "attributes" | "characterData" | "childList";
    /** @inheritdoc */
    get target(): Node;
    /** @inheritdoc */
    get addedNodes(): NodeList;
    /** @inheritdoc */
    get removedNodes(): NodeList;
    /** @inheritdoc */
    get previousSibling(): Node | null;
    /** @inheritdoc */
    get nextSibling(): Node | null;
    /** @inheritdoc */
    get attributeName(): string | null;
    /** @inheritdoc */
    get attributeNamespace(): string | null;
    /** @inheritdoc */
    get oldValue(): string | null;
    /**
     * Creates a new `MutationRecord`.
     *
     * @param type - type of mutation: `"attributes"` for an attribute
     * mutation, `"characterData"` for a mutation to a CharacterData node
     * and `"childList"` for a mutation to the tree of nodes.
     * @param target - node affected by the mutation.
     * @param addedNodes - list of added nodes.
     * @param removedNodes - list of removed nodes.
     * @param previousSibling - previous sibling of added or removed nodes.
     * @param nextSibling - next sibling of added or removed nodes.
     * @param attributeName - local name of the changed attribute,
     * and `null` otherwise.
     * @param attributeNamespace - namespace of the changed attribute,
     * and `null` otherwise.
     * @param oldValue - value before mutation: attribute value for an attribute
     * mutation, node `data` for a mutation to a CharacterData node and `null`
     * for a mutation to the tree of nodes.
     */
    static _create(type: "attributes" | "characterData" | "childList", target: Node, addedNodes: NodeList, removedNodes: NodeList, previousSibling: Node | null, nextSibling: Node | null, attributeName: string | null, attributeNamespace: string | null, oldValue: string | null): MutationRecordImpl;
}
