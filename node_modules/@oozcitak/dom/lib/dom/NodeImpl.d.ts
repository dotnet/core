import { Node, NodeList, Element, Document, NodeType, Position, GetRootNodeOptions, RegisteredObserver, TransientRegisteredObserver, Event, EventTarget } from "./interfaces";
import { EventTargetImpl } from "./EventTargetImpl";
/**
 * Represents a generic XML node.
 */
export declare abstract class NodeImpl extends EventTargetImpl implements Node {
    static ELEMENT_NODE: number;
    static ATTRIBUTE_NODE: number;
    static TEXT_NODE: number;
    static CDATA_SECTION_NODE: number;
    static ENTITY_REFERENCE_NODE: number;
    static ENTITY_NODE: number;
    static PROCESSING_INSTRUCTION_NODE: number;
    static COMMENT_NODE: number;
    static DOCUMENT_NODE: number;
    static DOCUMENT_TYPE_NODE: number;
    static DOCUMENT_FRAGMENT_NODE: number;
    static NOTATION_NODE: number;
    static DOCUMENT_POSITION_DISCONNECTED: number;
    static DOCUMENT_POSITION_PRECEDING: number;
    static DOCUMENT_POSITION_FOLLOWING: number;
    static DOCUMENT_POSITION_CONTAINS: number;
    static DOCUMENT_POSITION_CONTAINED_BY: number;
    static DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
    ELEMENT_NODE: number;
    ATTRIBUTE_NODE: number;
    TEXT_NODE: number;
    CDATA_SECTION_NODE: number;
    ENTITY_REFERENCE_NODE: number;
    ENTITY_NODE: number;
    PROCESSING_INSTRUCTION_NODE: number;
    COMMENT_NODE: number;
    DOCUMENT_NODE: number;
    DOCUMENT_TYPE_NODE: number;
    DOCUMENT_FRAGMENT_NODE: number;
    NOTATION_NODE: number;
    DOCUMENT_POSITION_DISCONNECTED: number;
    DOCUMENT_POSITION_PRECEDING: number;
    DOCUMENT_POSITION_FOLLOWING: number;
    DOCUMENT_POSITION_CONTAINS: number;
    DOCUMENT_POSITION_CONTAINED_BY: number;
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
    private __childNodes?;
    get _childNodes(): NodeList;
    private _nodeDocumentOverride?;
    get _nodeDocument(): Document;
    set _nodeDocument(val: Document);
    private __registeredObserverList?;
    get _registeredObserverList(): (RegisteredObserver | TransientRegisteredObserver)[];
    abstract _nodeType: NodeType;
    _parent: Node | null;
    _children: Set<Node>;
    _firstChild: Node | null;
    _lastChild: Node | null;
    _previousSibling: Node | null;
    _nextSibling: Node | null;
    /**
     * Initializes a new instance of `Node`.
     */
    protected constructor();
    /** @inheritdoc */
    get nodeType(): NodeType;
    /**
     * Returns a string appropriate for the type of node.
     */
    get nodeName(): string;
    /**
     * Gets the absolute base URL of the node.
     */
    get baseURI(): string;
    /**
     * Returns whether the node is rooted to a document node.
     */
    get isConnected(): boolean;
    /**
     * Returns the parent document.
     */
    get ownerDocument(): Document | null;
    /**
     * Returns the root node.
     *
     * @param options - if options has `composed = true` this function
     * returns the node's shadow-including root, otherwise it returns
     * the node's root node.
     */
    getRootNode(options?: GetRootNodeOptions): Node;
    /**
     * Returns the parent node.
     */
    get parentNode(): Node | null;
    /**
     * Returns the parent element.
     */
    get parentElement(): Element | null;
    /**
     * Determines whether a node has any children.
     */
    hasChildNodes(): boolean;
    /**
     * Returns a {@link NodeList} of child nodes.
     */
    get childNodes(): NodeList;
    /**
     * Returns the first child node.
     */
    get firstChild(): Node | null;
    /**
     * Returns the last child node.
     */
    get lastChild(): Node | null;
    /**
     * Returns the previous sibling node.
     */
    get previousSibling(): Node | null;
    /**
     * Returns the next sibling node.
     */
    get nextSibling(): Node | null;
    /**
     * Gets or sets the data associated with a {@link CharacterData} node or the
     * value of an {@link @Attr} node. For other node types returns `null`.
     */
    get nodeValue(): string | null;
    set nodeValue(value: string | null);
    /**
     * Returns the concatenation of data of all the {@link Text}
     * node descendants in tree order. When set, replaces the text
     * contents of the node with the given value.
     */
    get textContent(): string | null;
    set textContent(value: string | null);
    /**
     * Puts all {@link Text} nodes in the full depth of the sub-tree
     * underneath this node into a "normal" form where only markup
     * (e.g., tags, comments, processing instructions, CDATA sections,
     * and entity references) separates {@link Text} nodes, i.e., there
     * are no adjacent Text nodes.
     */
    normalize(): void;
    /**
     * Returns a duplicate of this node, i.e., serves as a generic copy
     * constructor for nodes. The duplicate node has no parent
     * ({@link parentNode} returns `null`).
     *
     * @param deep - if `true`, recursively clone the subtree under the
     * specified node. If `false`, clone only the node itself (and its
     * attributes, if it is an {@link Element}).
     */
    cloneNode(deep?: boolean): Node;
    /**
     * Determines if the given node is equal to this one.
     *
     * @param node - the node to compare with
     */
    isEqualNode(node?: Node | null): boolean;
    /**
     * Determines if the given node is reference equal to this one.
     *
     * @param node - the node to compare with
     */
    isSameNode(node?: Node | null): boolean;
    /**
     * Returns a bitmask indicating the position of the given `node`
     * relative to this node.
     */
    compareDocumentPosition(other: Node): Position;
    /**
     * Returns `true` if given node is an inclusive descendant of this
     * node, and `false` otherwise (including when other node is `null`).
     *
     * @param other - the node to check
     */
    contains(other: Node | null): boolean;
    /**
     * Returns the prefix for a given namespace URI, if present, and
     * `null` if not.
     *
     * @param namespace - the namespace to search
     */
    lookupPrefix(namespace: string | null): string | null;
    /**
     * Returns the namespace URI for a given prefix if present, and `null`
     * if not.
     *
     * @param prefix - the prefix to search
     */
    lookupNamespaceURI(prefix: string | null): string | null;
    /**
     * Returns `true` if the namespace is the default namespace on this
     * node or `false` if not.
     *
     * @param namespace - the namespace to check
     */
    isDefaultNamespace(namespace: string | null): boolean;
    /**
     * Inserts the node `newChild` before the existing child node
     * `refChild`. If `refChild` is `null`, inserts `newChild` at the end
     * of the list of children.
     *
     * If `newChild` is a {@link DocumentFragment} object, all of its
     * children are inserted, in the same order, before `refChild`.
     *
     * If `newChild` is already in the tree, it is first removed.
     *
     * @param newChild - the node to insert
     * @param refChild - the node before which the new node must be
     *   inserted
     *
     * @returns the newly inserted child node
     */
    insertBefore(newChild: Node, refChild: Node | null): Node;
    /**
     * Adds the node `newChild` to the end of the list of children of this
     * node, and returns it. If `newChild` is already in the tree, it is
     * first removed.
     *
     * If `newChild` is a {@link DocumentFragment} object, the entire
     * contents of the document fragment are moved into the child list of
     * this node.
     *
     * @param newChild - the node to add
     *
     * @returns the newly inserted child node
     */
    appendChild(newChild: Node): Node;
    /**
     * Replaces the child node `oldChild` with `newChild` in the list of
     * children, and returns the `oldChild` node. If `newChild` is already
     * in the tree, it is first removed.
     *
     * @param newChild - the new node to put in the child list
     * @param oldChild - the node being replaced in the list
     *
     * @returns the removed child node
     */
    replaceChild(newChild: Node, oldChild: Node): Node;
    /**
    * Removes the child node indicated by `oldChild` from the list of
    * children, and returns it.
    *
    * @param oldChild - the node being removed from the list
    *
    * @returns the removed child node
    */
    removeChild(oldChild: Node): Node;
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */
    _getTheParent(event: Event): EventTarget | null;
}
