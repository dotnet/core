import { FixedSizeSet } from "@oozcitak/util";
import { URLRecord } from "@oozcitak/url/lib/interfaces";
/**
 * Defines DOM features supported by algorithms.
 */
export declare type DOMFeatures = {
    /**
     * Enables or disables mutation observer algorithms.
     */
    mutationObservers: boolean;
    /**
     * Enables or disables custom element algorithms.
     */
    customElements: boolean;
    /**
     * Enables or disables slot algorithms.
     */
    slots: boolean;
    /**
     * Enables or disables various run steps defined in algorithms.
     */
    steps: boolean;
    [key: string]: boolean;
};
/**
 * Represents a window containing a DOM document.
 */
export interface Window extends EventTarget {
    /**
     * Returns the Event which is currently being handled.
     *
     * _Note:_ Note: This property can be fragile, in that there may be situations
     * in which the returned Event is not the expected value. In addition,
     * Window.event is not accurate for events dispatched within shadow trees.
     */
    readonly event?: Event;
    /**
     * Returns the associated Document.
     */
    readonly document: Document;
    _currentEvent?: Event;
    _signalSlots: Set<Slot>;
    _mutationObserverMicrotaskQueued: boolean;
    _mutationObservers: Set<MutationObserver>;
    _associatedDocument: Document;
    _iteratorList: FixedSizeSet<NodeIterator>;
}
/**
 * Represents a DOM event.
 */
export interface Event {
    NONE: number;
    CAPTURING_PHASE: number;
    AT_TARGET: number;
    BUBBLING_PHASE: number;
    /**
     * Returns the type of event.
     */
    readonly type: string;
    /**
     * Returns the object to which event is dispatched (its target).
     */
    readonly target: EventTarget | null;
    /**
     * Historical alias of target.
     */
    readonly srcElement: EventTarget | null;
    /**
     * Returns the object whose event listener's callback is currently
     * being invoked.
     */
    readonly currentTarget: EventTarget | null;
    /**
     * Returns the event's path (objects on which listeners will be
     * invoked). This does not include nodes in shadow trees if the
     * shadow root was created with its `mode` `"closed"`.
     */
    composedPath(): EventTarget[];
    /**
     * Returns the event's phase.
     */
    readonly eventPhase: EventPhase;
    /**
     * Prevents event from reaching any objects other than the current
     * object.
     */
    stopPropagation(): void;
    /**
     * Historical alias of `stopPropagation()`.
     */
    cancelBubble: boolean;
    /**
     * Prevents event from reaching any registered event listeners after
     * the current one finishes running.
     */
    stopImmediatePropagation(): void;
    /**
     * Returns `true` if the event goes through its target's ancestors in
     * reverse tree order, and `false` otherwise.
     */
    readonly bubbles: boolean;
    /**
     * A historical alias of `stopPropagation()`.
     */
    readonly cancelable: boolean;
    /**
     * Historical property.
     */
    returnValue: boolean;
    /**
     * Cancels the event (if it is cancelable).
     */
    preventDefault(): void;
    /**
     * Indicates whether the event was cancelled with `preventDefault()`.
     */
    readonly defaultPrevented: boolean;
    /**
     * Determines whether the event can bubble to the shadow DOM.
     */
    readonly composed: boolean;
    /**
     * Returns `true` if event was dispatched by the user agent, and
     * `false` otherwise.
     */
    readonly isTrusted: boolean;
    /**
     * Returns the the number of milliseconds measured relative to the
     * time origin.
     */
    readonly timeStamp: number;
    /**
     * Historical method to initializes the value of an event.
     *
     * @param type - the type of event.
     * @param bubbles - whether the event propagates in reverse.
     * @param cancelable - whether the event can be cancelled.
     */
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
    _target: PotentialEventTarget;
    _relatedTarget: PotentialEventTarget;
    _touchTargetList: PotentialEventTarget[];
    _path: EventPathItem[];
    _stopPropagationFlag: boolean;
    _stopImmediatePropagationFlag: boolean;
    _canceledFlag: boolean;
    _inPassiveListenerFlag: boolean;
    _composedFlag: boolean;
    _initializedFlag: boolean;
    _dispatchFlag: boolean;
    _isTrusted: boolean;
    _currentTarget: PotentialEventTarget;
    _eventPhase: EventPhase;
    _type: string;
    _bubbles: boolean;
    _cancelable: boolean;
    _timeStamp: number;
}
/**
 * Represents and event that carries custom data.
 */
export interface CustomEvent extends Event {
    /**
     * Gets custom event data.
     */
    readonly detail: any;
    /**
     * Initializes the value of an event.
     *
     * @param type - the type of event.
     * @param bubbles - whether the event propagates in reverse.
     * @param cancelable - whether the event can be cancelled.
     * @param detail - custom event data
     */
    initCustomEvent(type: string, bubbles?: boolean, cancelable?: boolean, detail?: any): void;
}
/**
 * Represents an object that is used to observe mutations to the node tree.
 */
export interface MutationObserver {
    /**
     * Observes a given target and reports any mutations based on options.
     *
     * @param target - the node to observe
     * @param options - mutation criteria to observe
     */
    observe(target: Node, options?: MutationObserverInit): void;
    /**
     * Stops observing mutations.
     */
    disconnect(): void;
    /**
     * Returns the list of mutations.
     */
    takeRecords(): MutationRecord[];
    _callback: MutationCallback;
    _nodeList: Node[];
    _recordQueue: MutationRecord[];
}
/**
 * Represents a mutation record.
 */
export interface MutationRecord {
    /**
     * Returns `"attributes"` if it was an attribute mutation,
     * `"characterData"` if it was a mutation to a CharacterData node,
     * and `"childList"` if it was a mutation to the tree of nodes.
     */
    readonly type: "attributes" | "characterData" | "childList";
    /**
     * Returns the node the mutation affected.
     */
    readonly target: Node;
    /**
     * Returns a list of added nodes.
     */
    readonly addedNodes: NodeList;
    /**
     * Returns a list of removed nodes.
     */
    readonly removedNodes: NodeList;
    /**
     * Returns the previous sibling of added or removed nodes.
     */
    readonly previousSibling: Node | null;
    /**
     * Returns the next sibling of added or removed nodes.
     */
    readonly nextSibling: Node | null;
    /**
     * Returns the local name of the changed attribute, and `null` otherwise.
     */
    readonly attributeName: string | null;
    /**
     * Returns the namespace of the changed attribute, and `null` otherwise.
     */
    readonly attributeNamespace: string | null;
    /**
     * Returns a value depending on `type`:
     * * For `"attributes"` the attribute value before the change,
     * * For `"characterData"` node `data` before the change,
     * * For `"childList"` `null`.
     */
    readonly oldValue: string | null;
}
/**
 * Represents an object that receive event notifications.
 */
export interface EventListener {
    /**
     * A callback function that is called when an event occurs.
     *
     * @param event - the event to handle.
     */
    handleEvent: (event: Event) => void;
}
/**
 * Represents an object that can receive events.
 */
export interface EventTarget {
    /**
     * Registers an event handler.
     *
     * @param type - event type to listen for.
     * @param callback - object to receive a notification when an event occurs.
     * @param options - object that specifies event characteristics.
     */
    addEventListener(type: string, callback: EventListener | null | ((event: Event) => void), options?: {
        passive: boolean;
        once: boolean;
        capture: boolean;
    } | boolean): void;
    /**
     * Removes an event listener.
     *
     * @param type - event type to listen for.
     * @param callback - object to receive a notification when an event occurs.
     * @param options - object that specifies event characteristics.
     */
    removeEventListener(type: string, callback: EventListener | null | ((event: Event) => void), options?: {
        capture: boolean;
    } | boolean): void;
    /**
     * Dispatches an event to this event target.
     *
     * @param event - the event to dispatch.
     */
    dispatchEvent(event: Event): boolean;
    _eventListenerList: EventListenerEntry[];
    _eventHandlerMap: {
        [key: string]: EventHandlerEntry;
    };
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */
    _getTheParent(event: Event): EventTarget | null;
    /**
     * Defines optional activation behavior for the given event.
     *
     * _Note:_ This exists because user agents perform certain actions for certain
     * EventTarget objects, e.g., the area element, in response to synthetic
     * MouseEvent events whose type attribute is click. Web compatibility
     * prevented it from being removed and it is now the enshrined way of
     * defining an activation of something.
     *
     * @param event - an event
     */
    _activationBehavior?(event: Event): void;
    /**
     * Defines optional legacy pre-activation behavior for the given event.
     *
     * _Note:_ These algorithms only exist for checkbox and radio input elements
     * and are not to be used for anything else.
     *
     * @param event - an event
     */
    _legacyPreActivationBehavior?(event: Event): void;
    /**
     * Defines optional legacy canceled activation behavior for the given event.
     *
     * _Note:_ These algorithms only exist for checkbox and radio input elements
     * and are not to be used for anything else.
     *
     * @param event - an event
     */
    _legacyCanceledActivationBehavior?(event: Event): void;
}
/**
 * Represents a controller that allows to abort DOM requests.
 */
export interface AbortController {
    /**
     * Returns the AbortSignal object associated with this object.
     */
    readonly signal: AbortSignal;
    /**
     * Sets the aborted flag and signals any observers that the associated
     * activity is to be aborted.
     */
    abort(): void;
    _signal: AbortSignal;
}
/**
 * Represents a signal object that communicates with a DOM request and abort
 * it through an AbortController.
 */
export interface AbortSignal extends EventTarget {
    /**
     * Returns `true` if the controller is to abort, and `false` otherwise.
     */
    readonly aborted: boolean;
    /**
     * Raises an event when the controller has aborted.
     */
    onabort: EventHandler;
    _abortedFlag: boolean;
    _abortAlgorithms: Set<(...args: any[]) => any>;
}
/**
 * Represents a generic XML node.
 */
export interface Node extends EventTarget {
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
    /**
     * Returns the type of node.
     */
    readonly nodeType: NodeType;
    /**
     * Returns a string appropriate for the type of node.
     */
    readonly nodeName: string;
    /**
     * Gets the absolute base URL of the node.
     */
    readonly baseURI: string;
    /**
     * Returns whether the node is rooted to a document node.
     */
    readonly isConnected: boolean;
    /**
     * Returns the parent document.
     */
    readonly ownerDocument: Document | null;
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
    readonly parentNode: Node | null;
    /**
     * Returns the parent element.
     */
    readonly parentElement: Element | null;
    /**
     * Determines whether a node has any children.
     */
    hasChildNodes(): boolean;
    /**
     * Returns a {@link NodeList} of child nodes.
     */
    readonly childNodes: NodeList;
    /**
     * Returns the first child node.
     */
    readonly firstChild: Node | null;
    /**
     * Returns the last child node.
     */
    readonly lastChild: Node | null;
    /**
     * Returns the previous sibling node.
     */
    readonly previousSibling: Node | null;
    /**
     * Returns the next sibling node.
     */
    readonly nextSibling: Node | null;
    /**
     * Gets or sets the data associated with a {@link CharacterData} node.
     * For other node types returns `null`.
     */
    nodeValue: string | null;
    /**
     * Returns the concatenation of data of all the {@link CharacterData}
     * node descendants in tree order. When set, replaces the text
     * contents of the node with the given value.
     */
    textContent: string | null;
    /**
     * Puts all {@link Text} nodes in the full depth of the sub-tree
     * underneath this node into a "normal" form where only markup
     * (e.g., tags, comments, processing instructions, CDATA sections,
     * and entity references) separates {@link Text} nodes, i.e., there
     * are no adjacent text nodes.
     */
    normalize(): void;
    /**
     * Returns a duplicate of this node, i.e., serves as a generic copy
     * constructor for nodes. The duplicate node has no parent
     * ({@link parentNode} returns `null`).
     *
     * @param deep - if `true`, recursively clone the subtree under the
     * specified node if `false`, clone only the node itself (and its
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
    compareDocumentPosition(node: Node): Position;
    /**
     * Returns `true` if given node is an inclusive descendant of this
     * node, and `false` otherwise (including when other node is `null`).
     *
     * @param node - the node to check
     */
    contains(node: Node | null): boolean;
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
    _nodeDocument: Document;
    _registeredObserverList: Array<RegisteredObserver | TransientRegisteredObserver>;
    /**
     * Used to keep track of parent-child relations in the tree. These are
     * non-standard properties.
     */
    _nodeType: NodeType;
    _parent: Node | null;
    _children: Set<Node>;
    _firstChild: Node | null;
    _lastChild: Node | null;
    _previousSibling: Node | null;
    _nextSibling: Node | null;
}
/**
 * Represents a generic text node.
 */
export interface CharacterData extends Node, NonDocumentTypeChildNode, ChildNode {
    /**
     * Gets or sets the text data of the node.
     */
    data: string;
    /**
     * Returns the number of code units in {@link data}.
     */
    readonly length: number;
    /**
     * Returns `count` number of characters from node data starting at
     * the given `offset`.
     *
     * @param offset - the offset at which retrieval starts
     * @param count - the number of characters to return
     */
    substringData(offset: number, count: number): string;
    /**
     * Appends the given string to text data of the node.
     *
     * @param data - the string of text to add to node data
     */
    appendData(data: string): void;
    /**
     * Inserts the given string into the text data of the node starting at
     * the given `offset`.
     *
     * @param offset - the offset at which insertion starts
     * @param data - the string of text to add to node data
     */
    insertData(offset: number, data: string): void;
    /**
     * Deletes `count` number of characters from node data starting at
     * the given `offset`.
     *
     * @param offset - the offset at which removal starts
     * @param count - the number of characters to delete
     */
    deleteData(offset: number, count: number): void;
    /**
     * Deletes `count` number of characters from node data starting at
     * the given `offset` and replaces it with the given `data`.
     *
     * @param offset - the offset at which removal starts
     * @param count - the number of characters to delete
     * @param data - the string of text to add to node data
     */
    replaceData(offset: number, count: number, data: string): void;
    _data: string;
}
/**
 * Represents a text node.
 */
export interface Text extends CharacterData, Slotable {
    /**
     * Splits data at the given offset and returns the remainder as a text
     * node.
     *
     * @param offset - the offset at which to split nodes.
     */
    splitText(offset: number): Text;
    /**
     * Returns the combined data of all direct text node siblings.
     */
    readonly wholeText: string;
}
/**
 * Represents a collection of elements.
 */
export interface HTMLCollection extends Collection, Iterable<Element> {
    /**
     * Returns the number of elements in the collection.
     */
    readonly length: number;
    /**
     * Returns the element with index `index` from the collection.
     *
     * @param index - the zero-based index of the element to return
     */
    item(index: number): Element | null;
    /**
     * Returns the first element with ID or name `name` from the
     * collection.
     *
     * @param name - the name of the element to return
     */
    namedItem(name: string): Element | null;
    /**
     * Returns the element with index index from the collection. The
     * elements are sorted in tree order.
     */
    [index: number]: Element | undefined;
    [key: string]: any;
}
/**
 * Represents a document node.
 */
export interface Document extends Node, NonElementParentNode, DocumentOrShadowRoot, ParentNode {
    /**
     * Returns the {@link DOMImplementation} object that is associated
     * with the document.
     */
    readonly implementation: DOMImplementation;
    /**
     * Returns the document's URL.
     */
    readonly URL: string;
    /**
     * Gets or sets the document's URL.
     */
    readonly documentURI: string;
    /**
     * Returns the document's origin.
     */
    readonly origin: string;
    /**
     * Returns whether the document is rendered in Quirks mode or
     * Standards mode.
     */
    readonly compatMode: string;
    /**
     * Returns the character set.
     */
    readonly characterSet: string;
    /**
     * Gets or sets the character set.
     */
    readonly charset: string;
    /**
     * Returns the character set.
     */
    readonly inputEncoding: string;
    /**
     * Returns the MIME type of the document.
     */
    readonly contentType: string;
    /**
     * Returns the {@link DocType} or `null` if there is none.
     */
    readonly doctype: DocumentType | null;
    /**
     * Returns the document element or `null` if there is none.
     */
    readonly documentElement: Element | null;
    /**
     * Returns a {@link HTMLCollection} of all descendant elements
     * whose qualified name is `qualifiedName`.
     *
     * @param qualifiedName - the qualified name to match or `*` to match all
     * descendant elements.
     *
     * @returns an {@link HTMLCollection} of matching descendant
     * elements
     */
    getElementsByTagName(qualifiedName: string): HTMLCollection;
    /**
     * Returns a {@link HTMLCollection} of all descendant elements
     * whose namespace is `namespace` and local name is `localName`.
     *
     * @param namespace - the namespace to match or `*` to match any
     * namespace.
     * @param localName - the local name to match or `*` to match any
     * local name.
     *
     * @returns an {@link HTMLCollection} of matching descendant
     * elements
     */
    getElementsByTagNameNS(namespace: string | null, localName: string): HTMLCollection;
    /**
     * Returns a {@link HTMLCollection} of all descendant elements
     * whose classes are contained in the list of classes given in
     * `classNames`.
     *
     * @param classNames - a space-separated list of classes
     *
     * @returns an {@link HTMLCollection} of matching descendant
     * elements
     */
    getElementsByClassName(classNames: string): HTMLCollection;
    /**
     * Returns a new {@link Element} with the given `localName`.
     *
     * @param localName - local name
     * @param options - element options
     *
     * @returns the new {@link Element}
     */
    createElement(localName: string, options?: string | {
        is: string;
    }): Element;
    /**
     * Returns a new {@link Element} with the given `namespace` and
     * `qualifiedName`.
     *
     * @param namespace - namespace URL
     * @param qualifiedName - qualified name
     * @param options - element options
     *
     * @returns the new {@link Element}
     */
    createElementNS(namespace: string | null, qualifiedName: string, options?: string | {
        is: string;
    }): Element;
    /**
     * Returns a new {@link DocumentFragment}.
     *
     * @returns the new {@link DocumentFragment}
     */
    createDocumentFragment(): DocumentFragment;
    /**
     * Returns a new {@link Text} with the given `data`.
     *
     * @param data - text content
     *
     * @returns the new {@link Text}
     */
    createTextNode(data: string): Text;
    /**
     * Returns a new {@link CDATASection} with the given `data`.
     *
     * @param data - text content
     *
     * @returns the new {@link CDATASection}
     */
    createCDATASection(data: string): CDATASection;
    /**
     * Returns a new {@link Comment} with the given `data`.
     *
     * @param data - text content
     *
     * @returns the new {@link Comment}
     */
    createComment(data: string): Comment;
    /**
     * Returns a new {@link ProcessingInstruction} with the given `target`
     * and `data`.
     *
     * @param target - instruction target
     * @param data - text content
     *
     * @returns the new {@link ProcessingInstruction}
     */
    createProcessingInstruction(target: string, data: string): ProcessingInstruction;
    /**
     * Returns a copy of `node`.
     *
     * @param deep - true to include descendant nodes.
     *
     * @returns clone of node
     */
    importNode(node: Node, deep?: boolean): Node;
    /**
     * Moves `node` from another document into this document and returns
     * it.
     *
     * @param node - node to move.
     *
     * @returns the adopted node
     */
    adoptNode(node: Node): Node;
    /**
     * Returns a new {@link Attr} with the given `localName`.
     *
     * @param localName - local name
     *
     * @returns the new {@link Attr}
     */
    createAttribute(localName: string): Attr;
    /**
     * Returns a new {@link Attr} with the given `namespace` and
     * `qualifiedName`.
     *
     * @param namespace - namespace URL
     * @param qualifiedName - qualified name
     *
     * @returns the new {@link Attr}
     */
    createAttributeNS(namespace: string | null, qualifiedName: string): Attr;
    /**
     * Creates an event of the type specified.
     *
     * @param eventInterface - a string representing the type of event
     * to be created
     */
    createEvent(eventInterface: string): Event;
    /**
     * Creates a new Range object.
     */
    createRange(): Range;
    /**
     * Creates a new `NodeIterator` object.
     * @param root - the node to which the iterator is attached.
     * @param whatToShow - a filter on node type.
     * @param filter - a user defined filter.
     */
    createNodeIterator(root: Node, whatToShow?: WhatToShow, filter?: NodeFilter | ((node: Node) => FilterResult) | null): NodeIterator;
    /**
     * Creates a new `TreeWalker` object.
     * @param root - the node to which the iterator is attached.
     * @param whatToShow - a filter on node type.
     * @param filter - a user defined filter.
     */
    createTreeWalker(root: Node, whatToShow?: WhatToShow, filter?: NodeFilter | ((node: Node) => FilterResult) | null): TreeWalker;
    _encoding: {
        name: string;
        labels: string[];
    };
    _contentType: string;
    _URL: URLRecord;
    _origin: Origin;
    _type: "xml" | "html";
    _mode: "no-quirks" | "quirks" | "limited-quirks";
    _documentElement: Element | null;
    _hasNamespaces: boolean;
}
/**
 * Represents an XML document.
 */
export interface XMLDocument extends Document {
}
/**
 * Represents a document fragment in the XML tree.
 */
export interface DocumentFragment extends Node, NonElementParentNode, ParentNode {
    _host: Element | null;
}
/**
 * Represents a shadow root.
 */
export interface ShadowRoot extends DocumentFragment, DocumentOrShadowRoot {
    /**
     * Gets the shadow root's mode.
     */
    readonly mode: ShadowRootMode;
    /**
     * Gets the shadow root's host.
     */
    readonly host: Element;
    _host: Element;
    _mode: ShadowRootMode;
}
/**
 * Represents an element node.
 */
export interface Element extends Node, ParentNode, NonDocumentTypeChildNode, ChildNode, Slotable {
    /**
     * Gets the namespace URI.
     */
    readonly namespaceURI: string | null;
    /**
     * Gets the namespace prefix.
     */
    readonly prefix: string | null;
    /**
     * Gets the local name.
     */
    readonly localName: string;
    /**
     * If namespace prefix is not `null`, returns the concatenation of
     * namespace prefix, `":"`, and local name. Otherwise it returns the
     * local name.
     */
    readonly tagName: string;
    /**
     * Gets or sets the identifier of this element.
     */
    id: string;
    /**
     * Gets or sets the class name of this element.
     */
    className: string;
    /**
     * Returns a {@link DOMTokenList} with tokens from the class
     * attribute.
     */
    readonly classList: DOMTokenList;
    /**
     * Gets or sets the slot attribute of this element.
     */
    slot: string;
    /**
     * Determines if the element node contains any attributes.
     */
    hasAttributes(): boolean;
    /**
     * Returns a {@link NamedNodeMap} of attributes.
     */
    readonly attributes: NamedNodeMap;
    /**
     * Returns the list of all attribute's qualified names.
     */
    getAttributeNames(): string[];
    /**
     * Returns the value of the attribute with the given `name`.
     *
     * @param qualifiedName - attribute name
     */
    getAttribute(qualifiedName: string): string | null;
    /**
     * Returns the value of the attribute with the given `namespace` and
     * `localName`.
     *
     * @param namespace - namespace to search for
     * @param localName - local name to search for
     */
    getAttributeNS(namespace: string | null, localName: string): string | null;
    /**
     * Sets the value of the attribute with the given `name`.
     *
     * @param qualifiedName - attribute name
     * @param value - attribute value to set
     */
    setAttribute(qualifiedName: string, value: string): void;
    /**
     * Sets the value of the attribute with the given `namespace` and
     * `qualifiedName`.
     *
     * @param namespace - namespace to search for
     * @param qualifiedName - qualified name to search for
     * @param value - attribute value to set
     */
    setAttributeNS(namespace: string | null, qualifiedName: string, value: string): void;
    /**
     * Removes the attribute with the given `name`.
     *
     * @param qualifiedName - attribute name
     */
    removeAttribute(qualifiedName: string): void;
    /**
     * Removes the attribute with the given `namespace` and  `localName`.
     *
     * @param namespace - namespace to search for
     * @param localName - local name to search for
     */
    removeAttributeNS(namespace: string | null, localName: string): void;
    /**
     * Determines whether the attribute with the given `name` exists.
     *
     * @param qualifiedName - attribute name
     */
    hasAttribute(qualifiedName: string): boolean;
    /**
     * Toggles a boolean attribute (removing it if it is present and adding it
     * if it is not present).
     *
     * @param qualifiedName - attribute name
     * @param force - whether the attribute should be added or removed,
     * no matter whether the attribute is present or not
     */
    toggleAttribute(qualifiedName: string, force?: boolean): boolean;
    /**
     * Determines whether the attribute with the given `namespace` and
     * `localName` exists.
     *
     * @param namespace - namespace to search for
     * @param localName - local name to search for
     */
    hasAttributeNS(namespace: string | null, localName: string): boolean;
    /**
     * Returns the attribute with the given `name`.
     *
     * @param qualifiedName - attribute name
     */
    getAttributeNode(qualifiedName: string): Attr | null;
    /**
     * Returns the attribute with the given `namespace` and
     * `localName`.
     *
     * @param namespace - namespace to search for
     * @param localName - local name to search for
     */
    getAttributeNodeNS(namespace: string | null, localName: string): Attr | null;
    /**
     * Sets the attribute given with `attr`.
     *
     * @param attr - attribute to set
     */
    setAttributeNode(attr: Attr): Attr | null;
    /**
     * Sets the attribute given with `attr`.
     *
     * @param attr - attribute to set
     */
    setAttributeNodeNS(attr: Attr): Attr | null;
    /**
     * Removes the given attribute.
     *
     * @param attr - attribute to remove
     */
    removeAttributeNode(attr: Attr): Attr;
    /**
     * Creates a shadow root for element and returns it.
     *
     * @param init - A ShadowRootInit dictionary.
     */
    attachShadow(init: {
        mode: ShadowRootMode;
    }): ShadowRoot;
    /**
     * Returns element's shadow root, if any, and if shadow root's mode
     * is `"open"`, and null otherwise.
     */
    readonly shadowRoot: ShadowRoot | null;
    /**
     * Returns the first (starting at element) inclusive ancestor that
     * matches selectors, and `null` otherwise.
     *
     * @param selectors
     */
    closest(selectors: string): Element | null;
    /**
     * Returns `true` if matching selectors against element's root yields
     * element, and `false` otherwise.
     *
     * @param selectors
     */
    matches(selectors: string): boolean;
    /**
     * Historical alias of `matches`.
     */
    webkitMatchesSelector(selectors: string): boolean;
    /**
     * Returns a {@link HTMLCollection} of all descendant elements
     * whose qualified name is `qualifiedName`.
     *
     * @param qualifiedName - the qualified name to match or `*` to match
     * all descendant elements.
     *
     * @returns an {@link HTMLCollection} of matching descendant
     * elements
     */
    getElementsByTagName(qualifiedName: string): HTMLCollection;
    /**
     * Returns a {@link HTMLCollection} of all descendant elements
     * whose namespace is `namespace` and local name is `localName`.
     *
     * @param namespace - the namespace to match or `*` to match any
     * namespace.
     * @param localName - the local name to match or `*` to match any
     * local name.
     *
     * @returns an {@link HTMLCollection} of matching descendant
     * elements
     */
    getElementsByTagNameNS(namespace: string | null, localName: string): HTMLCollection;
    /**
     * Returns a {@link HTMLCollection} of all descendant elements
     * whose classes are contained in the list of classes given in
     * `classNames`.
     *
     * @param classNames - a space-separated list of classes
     *
     * @returns an {@link HTMLCollection} of matching descendant
     * elements
     */
    getElementsByClassName(classNames: string): HTMLCollection;
    /**
     * Inserts a given element node at a given position relative to this
     * node.
     *
     * @param where - a string defining where to insert the element node.
     *   - `beforebegin` before this element itself.
     *   - `afterbegin` before the first child.
     *   - `beforeend` after the last child.
     *   - `afterend` after this element itself.
     * @param element - the element to insert
     *
     * @returns the inserted element
     */
    insertAdjacentElement(where: "beforebegin" | "afterbegin" | "beforeend" | "afterend", element: Element): Element | null;
    /**
     * Inserts a given text node at a given position relative to this
     * node.
     *
     * @param where - a string defining where to insert the element node.
     *   - `beforebegin` before this element itself.
     *   - `afterbegin` before the first child.
     *   - `beforeend` after the last child.
     *   - `afterend` after this element itself.
     * @param data - text node data
     *
     * @returns the inserted element
     */
    insertAdjacentText(where: "beforebegin" | "afterbegin" | "beforeend" | "afterend", data: string): void;
    _namespace: string | null;
    _namespacePrefix: string | null;
    _localName: string;
    _customElementState: "undefined" | "failed" | "uncustomized" | "custom";
    _customElementDefinition: CustomElementDefinition | null;
    _is: string | null;
    _shadowRoot: ShadowRoot | null;
    readonly _qualifiedName: string;
    readonly _htmlUppercasedQualifiedName: string;
    _attributeList: NamedNodeMap;
    _attributeChangeSteps: AttributeChangeStep[];
    _uniqueIdentifier?: string;
}
/**
 * Represents an object providing methods which are not dependent on
 * any particular document
 */
export interface DocumentType extends Node, ChildNode {
    /**
     * Returns the name of the node.
     */
    readonly name: string;
    /**
     * Returns the `PUBLIC` identifier of the node.
     */
    readonly publicId: string;
    /**
     * Returns the `SYSTEM` identifier of the node.
     */
    readonly systemId: string;
    _name: string;
    _publicId: string;
    _systemId: string;
}
/**
 * Represents a mixin that extends non-element parent nodes. This mixin
 * is implemented by {@link Document} and {@link DocumentFragment}.
 */
export interface NonElementParentNode {
    /**
     * Returns an {@link Element}  who has an id attribute `elementId`.
     *
     * @param id - the value of the `id` attribute to match
     */
    getElementById(id: string): Element | null;
}
/**
 * Represents a mixin for an interface to be used to share APIs between
 * documents and shadow roots. This mixin is implemented by
 * {@link Document} and {@link ShadowRoot}.
 */
export interface DocumentOrShadowRoot {
}
/**
 * Represents a mixin that extends parent nodes that can have children.
 * This mixin is implemented by {@link Element}, {@link Document} and
 * {@link DocumentFragment}.
 */
export interface ParentNode {
    /**
     * Returns the child elements.
     */
    readonly children: HTMLCollection;
    /**
     * Returns the first child that is an element, and `null` otherwise.
     */
    readonly firstElementChild: Element | null;
    /**
     * Returns the last child that is an element, and `null` otherwise.
     */
    readonly lastElementChild: Element | null;
    /**
     * Returns the number of children that are elements.
     */
    readonly childElementCount: number;
    /**
     * Prepends the list of nodes or strings before the first child node.
     * Strings are converted into {@link Text} nodes.
     *
     * @param nodes - the array of nodes or strings
     */
    prepend(...nodes: (Node | string)[]): void;
    /**
     * Appends the list of nodes or strings after the last child node.
     * Strings are converted into {@link Text} nodes.
     *
     * @param nodes - the array of nodes or strings
     */
    append(...nodes: (Node | string)[]): void;
    /**
     * Returns the first element that is a descendant of node that
     * matches selectors.
     *
     * @param selectors - a selectors string
     */
    querySelector(selectors: string): Element | null;
    /**
     * Returns all element descendants of node that match selectors.
     *
     * @param selectors - a selectors string
     */
    querySelectorAll(selectors: string): NodeList;
}
/**
 * Represents a mixin that extends child nodes that can have siblings
 * including doctypes. This mixin is implemented by {@link Element},
 * {@link CharacterData} and {@link DocumentType}.
 */
export interface ChildNode {
    /**
     * Inserts nodes just before this node, while replacing strings in
     * nodes with equivalent text nodes.
     */
    before(...nodes: (Node | string)[]): void;
    /**
     * Inserts nodes just after this node, while replacing strings in
     * nodes with equivalent text nodes.
     */
    after(...nodes: (Node | string)[]): void;
    /**
     * Replaces nodes with this node, while replacing strings in
     * nodes with equivalent text nodes.
     */
    replaceWith(...nodes: (Node | string)[]): void;
    /**
     * Removes this node form its tree.
     */
    remove(): void;
}
/**
 * Represents a slot element of a shadow tree.
 */
export interface Slot extends Element {
    _name: string;
    _assignedNodes: Slotable[];
}
/**
 * Represents a mixin that allows nodes to become the contents of
 * a <slot> element. This mixin is implemented by {@link Element} and
 * {@link Text}.
 */
export interface Slotable {
    /**
     * Returns the <slot> element which this node is inserted in.
     */
    readonly assignedSlot: HTMLSlotElement | null;
    _name: string;
    _assignedSlot: Slot | null;
}
/**
 * Represents an attribute of an element node.
 */
export interface Attr extends Node {
    /**
     * Gets the namespace URI.
     */
    readonly namespaceURI: string | null;
    /**
     * Gets the namespace prefix.
     */
    readonly prefix: string | null;
    /**
     * Gets the local name.
     */
    readonly localName: string;
    /**
     * If namespace prefix is not `null`, returns the concatenation of
     * namespace prefix, `":"`, and local name. Otherwise it returns the
     * local name.
     */
    readonly name: string;
    /**
     * Gets or sets the attribute value.
     */
    value: string;
    /**
     * Gets the owner element node.
     */
    readonly ownerElement: Element | null;
    /**
     * Useless always returns true
     */
    readonly specified: boolean;
    _namespace: string | null;
    _namespacePrefix: string | null;
    _localName: string;
    _value: string;
    _element: Element | null;
    readonly _qualifiedName: string;
}
/**
 * Represents a CDATA node.
 */
export interface CDATASection extends Text {
}
/**
 * Represents a comment node.
 */
export interface Comment extends CharacterData {
}
/**
 * Represents an object providing methods which are not dependent on
 * any particular document
 */
export interface DOMImplementation {
    createDocumentType(qualifiedName: string, publicId: string, systemId: string): DocumentType;
    /**
     * Creates and returns an {@link XMLDocument}.
     *
     * @param namespace - the namespace of the document element
     * @param qualifiedName - the qualified name of the document element
     * @param doctype - a {@link DocType} to assign to this document
     */
    createDocument(namespace: string | null, qualifiedName: string, doctype?: DocumentType | null): XMLDocument;
    /**
     * Creates and returns a HTML document.
     *
     * @param title - document title
     */
    createHTMLDocument(title?: string): Document;
    /**
     * Obsolete, always returns true.
     */
    hasFeature(): boolean;
    _ID: string;
    _associatedDocument: Document;
}
/**
 * Represents a token set.
 */
export interface DOMTokenList extends Iterable<string> {
    /**
     * Returns the number of tokens.
     */
    readonly length: number;
    /**
     * Returns the token at the given index.
     *
     * @param index - the index to of the token
     */
    item(index: number): string | null;
    /**
     * Returns true if the set contains the given token.
     *
     * @param tokens - the token to check
     */
    contains(token: string): boolean;
    /**
     * Adds the given tokens to the set.
     *
     * @param tokens - the list of tokens to add
     */
    add(...tokens: string[]): void;
    /**
     * Removes the given tokens from the set.
     *
     * @param tokens - the list of tokens to remove
     */
    remove(...tokens: string[]): void;
    /**
     * Removes a given token from the set and returns `false` if it exists,
     * otherwise adds the token and returns `true`.
     *
     * @param token - the token to toggle
     * @param force - if `false` the token will only be removed but not
     * added again otherwise if `true` the token will only be added but
     * not removed again.
     *
     * @returns `false` if the token is not in the list after the call,
     * or `true` if the token is in the list after the call.
     */
    toggle(token: string, force?: boolean | undefined): boolean;
    /**
     * Replaces the given token with a new token.
     *
     * @param token - the token to replace
     * @param newToken - the new token
     *
     * @returns `true` if `token` was replaced with `newToken`,
     * and `false` otherwise.
     */
    replace(token: string, newToken: string): boolean;
    /**
     * Determines if a given token is in the associated attribute's
     * supported tokens
     *
     * @param token - the token to check
     */
    supports(token: string): boolean;
    /**
     * Gets the value of the token list as a string, or sets the token
     * list to the given value.
     */
    value: string;
    _tokenSet: Set<string>;
    _element: Element;
    _attribute: Attr;
}
/**
 * Represents a collection of attributes.
 */
export interface NamedNodeMap {
    /**
     * Returns the number of attribute in the collection.
     */
    readonly length: number;
    /**
     * Returns the attribute with index `index` from the collection.
     *
     * @param index - the zero-based index of the attribute to return
     */
    item(index: number): Attr | null;
    /**
     * Returns the attribute with the given `qualifiedName`.
     *
     * @param qualifiedName - qualified name to search for
     */
    getNamedItem(qualifiedName: string): Attr | null;
    /**
     * Returns the attribute with the given `namespace` and
     * `qualifiedName`.
     *
     * @param namespace - namespace to search for
     * @param localName - local name to search for
     */
    getNamedItemNS(namespace: string | null, localName: string): Attr | null;
    /**
     * Sets the attribute given with `attr`.
     *
     * @param attr - attribute to set
     */
    setNamedItem(attr: Attr): Attr | null;
    /**
     * Sets the attribute given with `attr`.
     *
     * @param attr - attribute to set
     */
    setNamedItemNS(attr: Attr): Attr | null;
    /**
     * Removes the attribute with the given `qualifiedName`.
     *
     * @param qualifiedName - qualified name to search for
     */
    removeNamedItem(qualifiedName: string): Attr;
    /**
     * Removes the attribute with the given `namespace` and
     * `qualifiedName`.
     *
     * @param namespace - namespace to search for
     * @param localName - local name to search for
     */
    removeNamedItemNS(namespace: string | null, localName: string): Attr;
    /**
     * Returns the attribute with index `index` from the collection. Returns
     * `undefined` is index is out of bounds.
     */
    [index: number]: Attr;
    /**
     * Iterates over all attribute in the collection.
     */
    [Symbol.iterator](): IterableIterator<Attr>;
    _element: Element;
    _asArray(): Array<Attr>;
}
/**
 * Represents a node filter.
 */
export interface NodeFilter {
    FILTER_ACCEPT: number;
    FILTER_REJECT: number;
    FILTER_SKIP: number;
    SHOW_ALL: number;
    SHOW_ELEMENT: number;
    SHOW_ATTRIBUTE: number;
    SHOW_TEXT: number;
    SHOW_CDATA_SECTION: number;
    SHOW_ENTITY_REFERENCE: number;
    SHOW_ENTITY: number;
    SHOW_PROCESSING_INSTRUCTION: number;
    SHOW_COMMENT: number;
    SHOW_DOCUMENT: number;
    SHOW_DOCUMENT_TYPE: number;
    SHOW_DOCUMENT_FRAGMENT: number;
    SHOW_NOTATION: number;
    /**
     * Callback function.
     */
    acceptNode(node: Node): FilterResult;
}
/**
 * Represents a collection of nodes.
 */
export interface Collection {
    _live: boolean;
    _root: Node;
    _filter: ((element: Element) => any) | null;
}
/**
 * Represents an ordered list of nodes.
 */
export interface NodeList extends Collection, Iterable<Node> {
    /**
     * Returns the number of nodes in the list.
     */
    readonly length: number;
    /**
     * Returns an iterator for node indices.
     */
    keys(): Iterable<number>;
    /**
     * Returns an iterator for nodes.
     */
    values(): Iterable<Node>;
    /**
     * Returns an iterator for indices and nodes.
     */
    entries(): Iterable<[number, Node]>;
    /**
     * Returns the node with index `index` from the collection.
     *
     * @param index - the zero-based index of the node to return
     */
    item(index: number): Node | null;
    /**
     * Returns the node at the given index from the collection. Returns `undefined`
     * if the index is out-of-bounds.
     */
    [index: number]: Node | undefined;
    /**
     * Returns an iterator for the node list.
     */
    [Symbol.iterator](): Iterator<Node>;
    /**
     * Calls the callback function for each node in the list. The callback
     * receives arguments as follows:
     *   - the current node
     *   - index of the current node
     *   - the node list object
     *
     * @param callback - function to execute for each node
     * @param thisArg - value to use as `this` when executing callback
     */
    forEach(callback: (node: Node, index: number, list: NodeList) => any, thisArg?: any): void;
    /**
     * Used to keep track of child node count. This is a non-standard property.
     */
    _length: number;
}
/**
 * Represents a mixin that extends child nodes that can have siblings
 * other than doctypes. This mixin is implemented by {@link Element} and
 * {@link CharacterData}.
 */
export interface NonDocumentTypeChildNode {
    /**
     * Returns the previous sibling that is an element node.
     */
    readonly previousElementSibling: Element | null;
    /**
     * Returns the next sibling that is an element node.
     */
    readonly nextElementSibling: Element | null;
}
/**
 * Represents a processing instruction node.
 */
export interface ProcessingInstruction extends CharacterData {
    /**
     * Gets the target of the node.
     */
    readonly target: string;
    _target: string;
}
/**
 * Represents an object which can be used to traverse through the nodes
 * of a subtree.
 */
export interface Traverser {
    /**
     * Gets the root node of the subtree.
     */
    readonly root: Node;
    /**
     * Gets the node types to match.
     */
    readonly whatToShow: WhatToShow;
    /**
     * Gets the filter used to selected the nodes.
     */
    readonly filter: NodeFilter | null;
    _activeFlag: boolean;
    _root: Node;
    _whatToShow: WhatToShow;
    _filter: NodeFilter | null;
}
/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
export interface NodeIterator extends Traverser {
    /**
     * Gets the node current node of the.
     */
    readonly referenceNode: Node;
    /**
     * Gets a flag that indicates whether the iterator is anchored before
     * or after  the reference node. If is `true`, the iterator is anchored
     * before the node, otherwise it is anchored after the node.
     */
    readonly pointerBeforeReferenceNode: boolean;
    /**
     * Returns the next node in the subtree, or `null` if there are none.
     */
    nextNode(): Node | null;
    /**
     * Returns the previous node in the subtree, or `null` if there
     * are none.
     */
    previousNode(): Node | null;
    /**
     * Removes a range object from its owner document.
     *
     * _Note:_ According to the specification, this method is a no-op.
     * However, since JavaScript lacks weak references, there is no reliable
     * method of detecting out-of-scope variables. So, it is recommended to
     * manually `detach` range objects after using them.
     */
    detach(): void;
    _iteratorCollection: Collection;
    _reference: Node;
    _pointerBeforeReference: boolean;
}
/**
 * Represents the nodes of a subtree and a position within them.
 */
export interface TreeWalker extends Traverser {
    /**
     * Gets or sets the node to which the iterator is pointing at.
     */
    currentNode: Node;
    /**
     * Moves the iterator to the first parent node of current node, and
     * returns it. Returns `null` if no such node exists.
     */
    parentNode(): Node | null;
    /**
     * Moves the iterator to the first child node of current node, and
     * returns it. Returns `null` if no such node exists.
     */
    firstChild(): Node | null;
    /**
     * Moves the iterator to the last child node of current node, and
     * returns it. Returns `null` if no such node exists.
     */
    lastChild(): Node | null;
    /**
     * Moves the iterator to the next sibling of current node, and
     * returns it. Returns `null` if no such node exists.
     */
    nextSibling(): Node | null;
    /**
     * Moves the iterator to the previous sibling of current node, and
     * returns it. Returns `null` if no such node exists.
     */
    previousSibling(): Node | null;
    /**
     * Returns the next node in the subtree, or `null` if there are none.
     */
    nextNode(): Node | null;
    /**
     * Returns the previous node in the subtree, or `null` if there
     * are none.
     */
    previousNode(): Node | null;
    _current: Node;
}
/**
 * Represents an abstract range with a start and end boundary point.
 */
export interface AbstractRange {
    /**
     * Returns the start node of the range.
     */
    readonly startContainer: Node;
    /**
     * Returns the start offset of the range.
     */
    readonly startOffset: number;
    /**
     * Returns the end node of the range.
     */
    readonly endContainer: Node;
    /**
     * Returns the end offest of the range.
     */
    readonly endOffset: number;
    /**
     * Returns `true` if the range starts and ends at the same point.
     */
    readonly collapsed: boolean;
    _start: BoundaryPoint;
    _end: BoundaryPoint;
    readonly _startNode: Node;
    readonly _startOffset: number;
    readonly _endNode: Node;
    readonly _endOffset: number;
    readonly _collapsed: boolean;
}
/**
 * Represents a static range.
 */
export interface StaticRange extends AbstractRange {
}
/**
 * Represents a live range.
 */
export interface Range extends AbstractRange {
    START_TO_START: number;
    START_TO_END: number;
    END_TO_END: number;
    END_TO_START: number;
    /**
     * Returns the node, furthest away from the document, that is an
     * ancestor of both range's start node and end node.
     */
    readonly commonAncestorContainer: Node;
    /**
     * Sets the start of the range to the given boundary point.
     *
     * @param node - node of the boundary point
     * @param offset - offset of the boundary point along node's content
     */
    setStart(node: Node, offset: number): void;
    /**
     * Sets the end of the range to the given boundary point.
     *
     * @param node - node of the boundary point
     * @param offset - offset of the boundary point along node's content
     */
    setEnd(node: Node, offset: number): void;
    /**
     * Sets the start of the range to just before the given node.
     *
     * @param node - node of the boundary point
     */
    setStartBefore(node: Node): void;
    /**
     * Sets the start of the range to just after the given node.
     *
     * @param node - node of the boundary point
     */
    setStartAfter(node: Node): void;
    /**
     * Sets the end of the range to just before the given node.
     *
     * @param node - node of the boundary point
     */
    setEndBefore(node: Node): void;
    /**
     * Sets the end of the range to just after the given node.
     *
     * @param node - node of the boundary point
     */
    setEndAfter(node: Node): void;
    /**
     * Collapses the range.
     *
     * @param toStart - `true` to collapse to start node, otherwise
     * `false` to collapse to the end node.
     */
    collapse(toStart?: boolean): void;
    /**
     * Sets the range to contain the given node.
     *
     * @param node - the range to select
     */
    selectNode(node: Node): void;
    /**
     * Sets the range to contain the given node's contens.
     *
     * @param node - the range to select
     */
    selectNodeContents(node: Node): void;
    /**
     * Compares the boundary points of this range with another one.
     *
     * @param how - comparison method:
     * * `EndToEnd` - compares the end boundary-point of `sourceRange` to the end
     * boundary-point of this range.
     * * `EndToStart` - compares the end boundary-point of `sourceRange` to the
     * start boundary-point of this range.
     * * `StartToEnd` - compares the start boundary-point of `sourceRange` to the
     * end boundary-point of this range.
     * * `StartToStart` - compares the start boundary-point of `sourceRange` to
     * the start boundary-point of this range.
     * @param sourceRange - the range to compare to
     *
     * @returns a number depending on boundaries of ranges relative to each other:
     * * `-1` if the corresponding boundary point of this is range comes before
     * that of `sourceRange`
     * * `1` if the corresponding boundary point of this is range comes after
     * that of `sourceRange`
     * * `0` if corresponding boundary points of both ranges are equal
     */
    compareBoundaryPoints(how: HowToCompare, sourceRange: Range): number;
    /**
     * Removes the contents of the range from the tree.
     */
    deleteContents(): void;
    /**
     * Moves the contents of the range to a document fragment.
     */
    extractContents(): DocumentFragment;
    /**
     * Copies the contents of the range to a document fragment.
     */
    cloneContents(): DocumentFragment;
    /**
     * Inserts a node at the start boundary point.
     *
     * @param node - the node to insert
     */
    insertNode(node: Node): void;
    /**
     * Moves content of the Range into a new node, placing the new node
     * at the start of the range.
     *
     * @param newParent - a node to receive range's content
     */
    surroundContents(newParent: Node): void;
    /**
     * Creates a new range with identical boundary points.
     */
    cloneRange(): Range;
    /**
     * Unused method. Kept for compatibility.
     */
    detach(): void;
    /**
     * Determines whether the range contains the given boundary point.
     *
     * @param node - the node of the boundary point
     * @param offset - the offset of the boundary point
     */
    isPointInRange(node: Node, offset: number): boolean;
    /**
     * Returns `-1`, `0`, or `1` depending on whether `node` is
     * before, the same as, or after the range.
     *
     * @param node - the node to compare
     * @param offset - an offset within node
     */
    comparePoint(node: Node, offset: number): number;
    /**
     * Determines whether the given node intersects the range.
     *
     * @param node - the node to check
     */
    intersectsNode(node: Node): boolean;
}
/**
* Represents a html element node.
*/
export interface HTMLElement extends Element {
}
/**
 * Represents a `<slot>` element.
 */
export interface HTMLSlotElement extends HTMLElement {
}
/**
 * Defines the position of a boundary point relative to another.
 */
export declare enum BoundaryPosition {
    Before = 0,
    Equal = 1,
    After = 2
}
/**
 * Defines the event phase.
 */
export declare enum EventPhase {
    None = 0,
    Capturing = 1,
    AtTarget = 2,
    Bubbling = 3
}
/**
 * Defines the type of a node object.
 */
export declare enum NodeType {
    Element = 1,
    Attribute = 2,
    Text = 3,
    CData = 4,
    EntityReference = 5,
    Entity = 6,
    ProcessingInstruction = 7,
    Comment = 8,
    Document = 9,
    DocumentType = 10,
    DocumentFragment = 11,
    Notation = 12
}
/**
 * Defines the position of a node in the document relative to another
 * node.
 */
export declare enum Position {
    Disconnected = 1,
    Preceding = 2,
    Following = 4,
    Contains = 8,
    ContainedBy = 16,
    ImplementationSpecific = 32
}
/**
 * Defines the return value of a filter callback.
 */
export declare enum FilterResult {
    Accept = 1,
    Reject = 2,
    Skip = 3
}
/**
 * Defines what to show in node filter.
 */
export declare enum WhatToShow {
    All = 4294967295,
    Element = 1,
    Attribute = 2,
    Text = 4,
    CDataSection = 8,
    EntityReference = 16,
    Entity = 32,
    ProcessingInstruction = 64,
    Comment = 128,
    Document = 256,
    DocumentType = 512,
    DocumentFragment = 1024,
    Notation = 2048
}
/**
 * Defines how boundary points are compared.
 */
export declare enum HowToCompare {
    StartToStart = 0,
    StartToEnd = 1,
    EndToEnd = 2,
    EndToStart = 3
}
/**
 * Represents settings for the getRootNode() function.
 */
export interface GetRootNodeOptions {
    composed?: boolean;
}
/**
 * Represents event initialization options.
 */
export interface EventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
}
/**
 * Represents custom event initialization options.
 */
export interface CustomEventInit extends EventInit {
    detail?: any;
}
/**
 * Defines event listener options.
 */
export interface EventListenerOptions {
    capture?: boolean;
}
/**
 * Defines options for the `addEventListener` function.
 */
export interface AddEventListenerOptions extends EventListenerOptions {
    passive?: boolean;
    once?: boolean;
}
/**
 * Defines the criteria for the mutations to observe.
 */
export interface MutationObserverInit {
    childList?: boolean;
    attributes?: boolean;
    characterData?: boolean;
    subtree?: boolean;
    attributeOldValue?: boolean;
    characterDataOldValue?: boolean;
    attributeFilter?: string[];
}
/**
 * Defines an entry in the event listeners list.
 */
export declare type EventListenerEntry = {
    type: string;
    callback: EventListener;
    capture: boolean;
    passive: boolean;
    once: boolean;
    removed: boolean;
};
/**
 * Defines a non-null event handler.
 */
export declare type EventHandlerNonNull = ((event: Event) => any);
/**
 * Defines an event handler.
 */
export declare type EventHandler = EventHandlerNonNull | null;
/**
 * Defines a struct containing an event handler.
 */
export declare type EventHandlerEntry = {
    value: EventHandler;
    listener: EventListenerEntry | null;
};
/**
 * Defines static range constructor parameters.
 */
export declare type StaticRangeInit = {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
};
/**
 * Defines a boundary point which is a tuple consisting of a node and an offset
 * into the node's contents.
 */
export declare type BoundaryPoint = [Node, number];
/**
 * Defines a callback function which is invoked after nodes registered with the
 * observe() method, are mutated.
 *
 * @param mutations - a list of `MutationRecord` objects
 * @param observer - the constructed `MutationObserver` object
 */
export declare type MutationCallback = (mutations: MutationRecord[], observer: MutationObserver) => void;
/**
 * Represents a registered observer associated with a node.
 */
export declare type RegisteredObserver = {
    observer: MutationObserver;
    options: MutationObserverInit;
};
/**
 * Represents a transient registered observer associated with a node.
 * Transient registered observers are used to track mutations within a given
 * node's descendants after node has been removed so they do not get lost when
 * subtree is set to true on node's parent.
 */
export declare type TransientRegisteredObserver = RegisteredObserver & {
    source: RegisteredObserver;
};
/**
 * Defines the mode of a shadow root.
 */
export declare type ShadowRootMode = 'open' | 'closed';
/**
 * Represents a potential event target.
 */
export declare type PotentialEventTarget = EventTarget | null;
/**
 * Represents an object on the event path.
 */
export declare type EventPathItem = {
    invocationTarget: EventTarget;
    invocationTargetInShadowTree: boolean;
    shadowAdjustedTarget: PotentialEventTarget;
    relatedTarget: PotentialEventTarget;
    touchTargetList: PotentialEventTarget[];
    rootOfClosedTree: boolean;
    slotInClosedTree: boolean;
};
/**
 * Represents a document origin.
 * `null` represents an opaque origin.
 */
export declare type Origin = null | [string, // scheme
// scheme
string | number | number[], // host
// host
null | number, // port
// port
null | string];
/**
 * Represents a `<slot>` element.
 */
export interface HTMLSlotElement {
    name: string;
    assignedNodes(options?: any): Node[];
    assignedElements(options?: any): Element[];
}
/**
 * Represents a `UIEvent`.
 */
export interface UIEvent extends Event {
    readonly view?: Window;
    readonly detail: number;
}
/**
 * Represents a `MouseEvent`.
 */
export interface MouseEvent extends UIEvent {
    readonly screenX: number;
    readonly screenY: number;
    readonly clientX: number;
    readonly clientY: number;
    readonly ctrlKey: boolean;
    readonly shiftKey: boolean;
    readonly altKey: boolean;
    readonly metaKey: boolean;
    readonly button: number;
    readonly buttons: number;
    readonly relatedTarget?: EventTarget;
    getModifierState(keyArg: string): boolean;
}
/**
 * Represents a custom element definition.
 */
export declare type CustomElementDefinition = {
    name: string;
    localName: string;
    constructor: (new (...args: any[]) => Element);
    observedAttributes: string[];
    lifecycleCallbacks: {
        "connectedCallback": ((args: any[]) => any) | null;
        "disconnectedCallback": ((args: any[]) => any) | null;
        "adoptedCallback": ((args: any) => any[]) | null;
        "attributeChangedCallback": ((args: any[]) => any) | null;
        "formAssociatedCallback": ((args: any[]) => any) | null;
        "formDisabledCallback": ((args: any[]) => any) | null;
        "formResetCallback": ((args: any[]) => any) | null;
        "formStateRestoreCallback": ((args: any[]) => any) | null;
    };
    constructionStack: (Element | boolean)[];
    formAssociated: boolean;
    disableInternals: boolean;
    disableShadow: boolean;
};
/**
 * Defines an attribute change step.
 */
export declare type AttributeChangeStep = ((element: Element, localName: string, oldValue: string | null, value: string | null, namespace: string | null) => any);
