import { XMLBuilderOptions, XMLBuilder, AttributesObject, ExpandObject, WriterOptions, DTDOptions, PIObject, XMLWriterOptions, JSONWriterOptions, ObjectWriterOptions, MapWriterOptions, YAMLWriterOptions } from "../interfaces";
import { Document, Node } from "@oozcitak/dom/lib/dom/interfaces";
/**
 * Represents a wrapper that extends XML nodes to implement easy to use and
 * chainable document builder methods.
 */
export declare class XMLBuilderImpl implements XMLBuilder {
    private _domNode;
    /**
     * Initializes a new instance of `XMLBuilderNodeImpl`.
     *
     * @param domNode - the DOM node to wrap
     */
    constructor(domNode: Node);
    /** @inheritdoc */
    get node(): Node;
    /** @inheritdoc */
    get options(): XMLBuilderOptions;
    /** @inheritdoc */
    set(options: Partial<XMLBuilderOptions>): XMLBuilder;
    /** @inheritdoc */
    ele(p1: string | null | ExpandObject, p2?: AttributesObject | string, p3?: AttributesObject): XMLBuilder;
    /** @inheritdoc */
    remove(): XMLBuilder;
    /** @inheritdoc */
    att(p1: AttributesObject | string | null, p2?: string, p3?: string): XMLBuilder;
    /** @inheritdoc */
    removeAtt(p1: string | null | string[], p2?: string | string[]): XMLBuilder;
    /** @inheritdoc */
    txt(content: string): XMLBuilder;
    /** @inheritdoc */
    com(content: string): XMLBuilder;
    /** @inheritdoc */
    dat(content: string): XMLBuilder;
    /** @inheritdoc */
    ins(target: string | PIObject, content?: string): XMLBuilder;
    /** @inheritdoc */
    dec(options: {
        version?: "1.0";
        encoding?: string;
        standalone?: boolean;
    }): XMLBuilder;
    /** @inheritdoc */
    dtd(options?: DTDOptions): XMLBuilder;
    /** @inheritdoc */
    import(node: XMLBuilder): XMLBuilder;
    /** @inheritdoc */
    doc(): XMLBuilder;
    /** @inheritdoc */
    root(): XMLBuilder;
    /** @inheritdoc */
    up(): XMLBuilder;
    /** @inheritdoc */
    prev(): XMLBuilder;
    /** @inheritdoc */
    next(): XMLBuilder;
    /** @inheritdoc */
    first(): XMLBuilder;
    /** @inheritdoc */
    last(): XMLBuilder;
    /** @inheritdoc */
    each(callback: ((node: XMLBuilder, index: number, level: number) => void), self?: boolean, recursive?: boolean, thisArg?: any): XMLBuilder;
    /** @inheritdoc */
    map<T>(callback: ((node: XMLBuilder, index: number, level: number) => T), self?: boolean, recursive?: boolean, thisArg?: any): T[];
    /** @inheritdoc */
    reduce<T>(callback: ((value: T, node: XMLBuilder, index: number, level: number) => T), initialValue: T, self?: boolean, recursive?: boolean, thisArg?: any): T;
    /** @inheritdoc */
    find(predicate: ((node: XMLBuilder, index: number, level: number) => boolean), self?: boolean, recursive?: boolean, thisArg?: any): XMLBuilder | undefined;
    /** @inheritdoc */
    filter(predicate: ((node: XMLBuilder, index: number, level: number) => boolean), self?: boolean, recursive?: boolean, thisArg?: any): XMLBuilder[];
    /** @inheritdoc */
    every(predicate: ((node: XMLBuilder, index: number, level: number) => boolean), self?: boolean, recursive?: boolean, thisArg?: any): boolean;
    /** @inheritdoc */
    some(predicate: ((node: XMLBuilder, index: number, level: number) => boolean), self?: boolean, recursive?: boolean, thisArg?: any): boolean;
    /** @inheritdoc */
    toArray(self?: boolean, recursive?: boolean): XMLBuilder[];
    /** @inheritdoc */
    toString(writerOptions?: XMLWriterOptions | JSONWriterOptions | YAMLWriterOptions): string;
    /** @inheritdoc */
    toObject(writerOptions?: ObjectWriterOptions | MapWriterOptions): any;
    /** @inheritdoc */
    end(writerOptions?: WriterOptions): any;
    /**
     * Gets the next descendant of the given node of the tree rooted at `root`
     * in depth-first pre-order. Returns a three-tuple with
     * [descendant, descendant_index, descendant_level].
     *
     * @param root - root node of the tree
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     */
    private _getFirstDescendantNode;
    /**
     * Gets the next descendant of the given node of the tree rooted at `root`
     * in depth-first pre-order. Returns a three-tuple with
     * [descendant, descendant_index, descendant_level].
     *
     * @param root - root node of the tree
     * @param node - current node
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     * @param index - child node index
     * @param level - current depth of the XML tree
     */
    private _getNextDescendantNode;
    /**
     * Converts the node into its string or object representation.
     *
     * @param options - serialization options
     */
    private _serialize;
    /**
     * Extracts a namespace and name from the given string.
     *
     * @param namespace - namespace
     * @param name - a string containing both a name and namespace separated by an
     * `'@'` character
     * @param ele - `true` if this is an element namespace; otherwise `false`
     */
    private _extractNamespace;
    /**
     * Updates the element's namespace.
     *
     * @param ns - new namespace
     */
    private _updateNamespace;
    /**
     * Returns the document owning this node.
     */
    protected get _doc(): Document;
    /**
     * Returns debug information for this node.
     *
     * @param name - node name
     */
    protected _debugInfo(name?: string): string;
    /**
     * Gets or sets builder options.
     */
    protected get _options(): XMLBuilderOptions;
    protected set _options(value: XMLBuilderOptions);
}
