import { Node, Document } from "@oozcitak/dom/lib/dom/interfaces";
/**
 * Represents a document with XML builder settings applied.
 */
export interface DocumentWithSettings extends Document {
    _xmlBuilderOptions: XMLBuilderOptions;
    _isFragment?: boolean;
}
/**
 * Defines the options used while creating an XML document.
 */
export interface XMLBuilderOptions {
    /**
     * A version number string, e.g. `"1.0"`
     */
    version: "1.0";
    /**
     * Encoding declaration, e.g. `"UTF-8"`
     */
    encoding: string | undefined;
    /**
     * Standalone document declaration: `true` or `false`
     */
    standalone: boolean | undefined;
    /**
     * Whether nodes with `null` values will be kept or ignored
     */
    keepNullNodes: boolean;
    /**
     * Whether attributes with `null` values will be kept or ignored
     */
    keepNullAttributes: boolean;
    /**
     * Whether converter strings will be ignored when converting JS
     * objects to nodes
     */
    ignoreConverters: boolean;
    /**
     * Whether whitespace-only text nodes are skipped or not.
     */
    skipWhitespaceOnlyText: boolean;
    /**
     * Defines string keys used while converting JS objects to nodes.
     */
    convert: ConvertOptions;
    /**
     * Defines default namespaces to apply to all elements and attributes.
     */
    defaultNamespace: {
        ele: undefined | null | string;
        att: undefined | null | string;
    };
    /**
     * Defines namespace aliases.
     */
    namespaceAlias: {
        /**
         * HTML namespace
         */
        html: "http://www.w3.org/1999/xhtml";
        /**
         * XML namespace
         */
        xml: "http://www.w3.org/XML/1998/namespace";
        /**
         * XMLNS namespace
         */
        xmlns: "http://www.w3.org/2000/xmlns/";
        /**
         * MathML namespace
         */
        mathml: "http://www.w3.org/1998/Math/MathML";
        /**
         * SVG namespace
         */
        svg: "http://www.w3.org/2000/svg";
        /**
         * XLink namespace
         */
        xlink: "http://www.w3.org/1999/xlink";
        /**
         * User supplied namespace alias
         */
        [key: string]: string | null;
    };
    /**
     * Defines a replacement for invalid characters in input strings.
     *
     * If `invalidCharReplacement` is a string, each invalid character in an input
     * string will be replaced with it; otherwise if `invalidCharReplacement`
     * is a function it will be passed each invalid character and should return
     * a replacement character.
     *
     * The arguments to the replacement function are:
     * - char - the invalid character to be replaced
     * - offset - the offset of the invalid character
     * - str - the input string
     */
    invalidCharReplacement: string | ((char: string, offset: number, str: string) => string) | undefined;
    /**
     * Defines custom parser functions.
     */
    parser: ParserOptions | undefined;
}
/**
 * Defines the options used while creating an XML document.
 */
export interface XMLBuilderCreateOptions extends RecursivePartial<XMLBuilderOptions> {
}
/**
 * Defines default values for builder options.
 */
export declare const DefaultBuilderOptions: XMLBuilderOptions;
/**
 * Contains keys of `XMLBuilderOptions`.
 */
export declare const XMLBuilderOptionKeys: Set<string>;
/**
 * Defines the identifier strings of the DocType node.
 */
export interface DTDOptions {
    /**
     * Name of the DTD. If name is omitted, it will be taken from the document
     * element node.
     */
    name?: string;
    /**
     * Public identifier of the DTD
     */
    pubID?: string;
    /**
     * System identifier of the DTD
     */
    sysID?: string;
}
/**
 * Defines string keys used while converting JS objects to nodes.
 */
export interface ConvertOptions {
    /**
     * When prepended to a JS object key, converts its key-value pair
     * to an attribute. Defaults to `"@"`. Multiple attributes can also be grouped
     * under the attribute key. For example:
     * ```js
     * obj1 = { pilot: { '@callsign': 'Maverick', '@rank': 'Lieutenant' } }
     * obj2 = { pilot: { '@': { 'callsign': 'Maverick', 'rank': 'Lieutenant' } } }
     * ```
     * both become:
     * ```xml
     * <pilot callsign="Maverick" rank="Lieutenant"/>
     * ````
     */
    att: string;
    /**
     * When prepended to a JS object key, converts its value to a processing
     * instruction node. Defaults to `"?"`. Instruction target and value should
     * be separated with a single space character. For example:
     * ```js
     * obj = {
     *   '?': 'background classified ref="NAM#123456"',
     *   pilot: 'Pete Mitchell'
     * }
     * ```
     * becomes:
     * ```xml
     * <?background classified ref="NAM#123456"?>
     * <pilot>Pete Mitchell</pilot>
     * ````
     */
    ins: string;
    /**
     * When prepended to a JS object key, converts its value to a text node.
     * Defaults to `"#"`. For example:
     * ```js
     * obj = { monologue: {
     *   '#': 'Talk to me Goose!',
     * } }
     * ```
     * becomes:
     * ```xml
     * <monologue>Talk to me Goose!</monologue>
     * ````
     *
     * _Note:_ Since JS objects cannot contain duplicate keys, multiple text
     * nodes can be created by adding some unique text after each object
     * key. For example:
     * ```js
     * obj = { monologue: {
     *   '#1': 'Talk to me Goose!',
     *   '#2': 'Talk to me...'
     * } }
     * ```
     * becomes:
     * ```xml
     * <monologue>Talk to me Goose!Talk to me...</monologue>
     * ````
     *
     * _Note:_ `"#"` also allows mixed content. Example:
     * ```js
     * obj = { monologue: {
     *   '#1': 'Talk to me Goose!',
     *   'cut': 'dog tag shot',
     *   '#2': 'Talk to me...'
     * } }
     * ```
     * becomes:
     * ```xml
     * <monologue>
     *   Talk to me Goose!
     *   <cut>dog tag shot</cut>
     *   Talk to me...
     * </monologue>
     * ````
     */
    text: string;
    /**
     * When prepended to a JS object key, converts its value to a CDATA
     * node. Defaults to `"$"`. For example:
     * ```js
     * obj = {
     *   '$': '<a href="https://topgun.fandom.com/wiki/MiG-28"/>',
     *   aircraft: 'MiG-28'
     * }
     * ```
     * becomes:
     * ```xml
     * <![CDATA[<a href="https://topgun.fandom.com/wiki/MiG-28"/>]]>
     * <aircraft>MiG-28</aircraft>
     * ````
     */
    cdata: string;
    /**
     * When prepended to a JS object key, converts its value to a
     * comment node. Defaults to `"!"`. For example:
     * ```js
     * obj = {
     *   '!': 'Fictional; MiGs use odd numbers for fighters.',
     *   aircraft: 'MiG-28'
     * }
     * ```
     * becomes:
     * ```xml
     * <!--Fictional; MiGs use odd numbers for fighters.-->
     * <aircraft>MiG-28</aircraft>
     * ````
     */
    comment: string;
}
/**
 * Defines custom parser functions.
 */
export declare type ParserOptions = {
    /**
     * Main parser function which parses the given object and returns an `XMLBuilder`.
     *
     * @param node - node to recieve parsed content
     * @param obj - object to parse
     *
     * @returns the last top level element node created
     */
    parse?: (parent: XMLBuilder, obj: string | ExpandObject) => XMLBuilder;
    /**
     * Creates a DocType node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param name - node name
     * @param publicId - public identifier
     * @param systemId - system identifier
     *
     * @returns the parent document node
     */
    docType?: (parent: XMLBuilder, name: string, publicId: string, systemId: string) => XMLBuilder | undefined;
    /**
     * Creates a comment node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     *
     * @returns the parent element node
     */
    comment?: (parent: XMLBuilder, data: string) => XMLBuilder | undefined;
    /**
     * Creates a text node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     *
     * @returns the parent element node
     */
    text?: (parent: XMLBuilder, data: string) => XMLBuilder | undefined;
    /**
     * Creates a processing instruction node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param target - instruction target
     * @param data - node data
     *
     * @returns the parent element node
     */
    instruction?: (parent: XMLBuilder, target: string, data: string) => XMLBuilder | undefined;
    /**
     * Creates a CData section node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     *
     * @returns the parent element node
     */
    cdata?: (parent: XMLBuilder, data: string) => XMLBuilder | undefined;
    /**
     * Creates an element node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param namespace - element namespace
     * @param name - node name
     *
     * @returns the new element node
     */
    element?: (parent: XMLBuilder, namespace: string | null | undefined, name: string) => XMLBuilder | undefined;
    /**
     * Creates an attribute or namespace declaration.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param namespace - attribute namespace
     * @param name - attribute name
     * @param value - attribute value
     *
     * @returns the parent element node
     */
    attribute?: (parent: XMLBuilder, namespace: string | null | undefined, name: string, value: string) => XMLBuilder | undefined;
    /**
     * Sanitizes input strings.
     *
     * @param str - input string
     */
    sanitize?(str: string): string;
};
/**
 * Defines the options passed to the writer.
 */
export declare type BaseWriterOptions = {
    /**
     * Output format. Defaults to `"xml"`.
     * - `"xml"` - Serializes the document as a string in XML format.
     * - `"map"` - Serializes the document as an object using `Map`s and
     * `Array`s.
     * - `"object"` - Serializes the document as an object using `Object`s and
     * `Array`s.
     * - `"json"` - Serializes the document as a JSON string.
     * - `"yaml"` - Serilizes the document as a YAML string
     */
    format?: "xml" | "map" | "object" | "json" | "yaml";
    /**
     * Ensures that the document adheres to the syntax rules specified by the
     * XML specification. If this flag is set and the document is not well-formed
     * errors will be thrown. Defaults to `false`.
     */
    wellFormed?: boolean;
};
/**
 * Defines the options passed to the map writer.
 */
export declare type MapWriterOptions = BaseWriterOptions & {
    /** @inheritdoc */
    format?: "map";
    /**
     * Groups consecutive nodes of same type under a single object. Defaults to
     * `false`.
     */
    group?: boolean;
    /**
     * Outputs child nodes as an array, even if the parent node has zero or one
     * child nodes.
     */
    verbose?: boolean;
};
/**
 * Defines the options passed to the object writer.
 */
export declare type ObjectWriterOptions = BaseWriterOptions & {
    /** @inheritdoc */
    format?: "object";
    /**
     * Groups consecutive nodes of same type under a single object. Defaults to
     * `false`.
     */
    group?: boolean;
    /**
     * Outputs child nodes as an array, even if the parent node has zero or one
     * child nodes.
     */
    verbose?: boolean;
};
/**
 * Defines the options passed to the XML writer.
 */
export declare type XMLWriterOptions = BaseWriterOptions & {
    /** @inheritdoc */
    format?: "xml";
    /**
     * Suppresses the XML declaration from the output. Defaults to `false`.
     */
    headless?: boolean;
    /**
     * Pretty-prints the XML tree. Defaults to `false`.
     */
    prettyPrint?: boolean;
    /**
     * Determines the indentation string for pretty printing. Defaults to two
     * space characters.
     */
    indent?: string;
    /**
     * Determines the newline string for pretty printing. Defaults to `"\n"`.
     */
    newline?: string;
    /**
     * Defines a fixed number of indentations to add to every line. Defaults to
     * `0`.
     */
    offset?: number;
    /**
     * Wraps attributes to the next line if the column width exceeds the given
     * value. Defaults to `0` which disables attribute wrapping.
     */
    width?: number;
    /**
     * Produces closing tags for empty element nodes. Defaults to `false`. With
     * this option set to `true`, closing tags will be produced for element nodes
     * without child nodes, e.g.
     * ```xml
     * <node></node>
     * ```
     * Otherwise, empty element nodes will be self-closed, e.g.
     * ```xml
     * <node/>
     * ```
     */
    allowEmptyTags?: boolean;
    /**
     * Indents contents of text-only element nodes. Defaults to `false` which
     * keeps a text node on the same line with its containing element node, e.g.
     * ```xml
     * <node>some text</node>
     * ```
     * Otherwise, it will be printed on a new line. e.g.
     * ```xml
     * <node>
     *   some text
     * </node>
     * ```
     * _Note:_ Element nodes with mixed content are always indented regardless
     * of this setting.
     */
    indentTextOnlyNodes?: boolean;
    /**
     * Inserts a space character before the slash character of self-closing tags.
     * Defaults to `false`. With this options set to `true`, a space character
     * will be inserted before the slash character of self-closing tags, e.g.
     * ```xml
     * <node />
     * ```
     */
    spaceBeforeSlash?: boolean;
};
/**
 * Defines the options passed to the JSON writer.
 */
export declare type JSONWriterOptions = BaseWriterOptions & {
    /** @inheritdoc */
    format?: "json";
    /**
     * Pretty-prints the XML tree. Defaults to `false`.
     */
    prettyPrint?: boolean;
    /**
     * Determines the indentation string for pretty printing. Defaults to two
     * space characters.
     */
    indent?: string;
    /**
     * Determines the newline string for pretty printing. Defaults to `"\n"`.
     */
    newline?: string;
    /**
     * Defines a fixed number of indentations to add to every line. Defaults to
     * `0`.
     */
    offset?: number;
    /**
     * Groups consecutive nodes of same type under a single object. Defaults to
     * `false`.
     */
    group?: boolean;
    /**
     * Outputs child nodes as an array, even if the parent node has zero or one
     * child nodes.
     */
    verbose?: boolean;
};
/**
 * Defines the options passed to the YAML writer.
 */
export declare type YAMLWriterOptions = BaseWriterOptions & {
    /** @inheritdoc */
    format?: "yaml";
    /**
     * Determines the indentation string. Defaults to two space characters.
     */
    indent?: string;
    /**
     * Determines the newline string. Defaults to `"\n"`.
     */
    newline?: string;
    /**
     * Defines a fixed number of indentations to add to every line. Defaults to
     * `0`.
     */
    offset?: number;
    /**
     * Groups consecutive nodes of same type under a single object. Defaults to
     * `false`.
     */
    group?: boolean;
    /**
     * Outputs child nodes as an array, even if the parent node has only one
     * child node.
     */
    verbose?: boolean;
};
/**
 * Defines the options passed to the writer.
 */
export declare type WriterOptions = XMLWriterOptions | ObjectWriterOptions | JSONWriterOptions | MapWriterOptions | YAMLWriterOptions;
/**
 * Defines recursive types that can represent objects, arrays and maps of
 * serialized nodes.
 */
export declare type XMLSerializedValue = string | XMLSerializedAsObject | XMLSerializedAsObjectArray | XMLSerializedAsMap | XMLSerializedAsMapArray;
export declare type XMLSerializedAsObject = {
    [key: string]: string | XMLSerializedAsObject | XMLSerializedAsObjectArray;
};
export declare type XMLSerializedAsObjectArray = Array<string | XMLSerializedAsObject>;
export declare type XMLSerializedAsMap = Map<string, string | XMLSerializedAsMap | XMLSerializedAsMapArray>;
export declare type XMLSerializedAsMapArray = Array<string | XMLSerializedAsMap>;
/**
 * Represents the type of a variable that can be expanded by the `ele` function
 * into nodes.
 */
export declare type ExpandObject = {
    [key: string]: any;
} | Map<string, any> | any[] | Set<any> | ((...args: any) => any);
/**
 * Represents the type of a variable that is a JS object defining
 * attributes.
 */
export declare type AttributesObject = Map<string, any> | {
    /**
     * Attribute key/value pairs
     */
    [key: string]: any;
};
/**
 * Represents the type of a variable that is a JS object defining
 * processing instructions.
 */
export declare type PIObject = Map<string, string> | string[] | {
    /**
     * Processing instruction target/data pairs
     */
    [key: string]: string;
};
/**
 * Represents a wrapper around XML nodes to implement easy to use and
 * chainable document builder methods.
 */
export interface XMLBuilder {
    /**
     * Returns the underlying DOM node.
     */
    readonly node: Node;
    /**
     * Gets the options used while creating an XML document.
     */
    readonly options: XMLBuilderOptions;
    /**
     * Sets builder options.
     *
     * @param - builder options
     *
     * @returns current element node
     */
    set(builderOptions: Partial<XMLBuilderOptions>): XMLBuilder;
    /**
     * Creates a new element node and appends it to the list of child nodes.
     *
     * @param namespace - element namespace
     * @param name - element name
     * @param attributes - a JS object with element attributes
     *
     * @returns the new element node
     */
    ele(namespace: string | null, name: string, attributes?: AttributesObject): XMLBuilder;
    /**
     * Creates a new element node and appends it to the list of child nodes.
     *
     * @param name - element name
     * @param attributes - a JS object with element attributes
     *
     * @returns the new element node
     */
    ele(name: string, attributes?: AttributesObject): XMLBuilder;
    /**
     * Creates new element nodes from the given JS object and appends it to the
     * list of child nodes.
     *
     * @param obj - a JS object representing nodes to insert
     *
     * @returns the last top level element node created
     */
    ele(obj: ExpandObject): XMLBuilder;
    /**
   * Creates new element nodes from the given XML document string appends it to the
   * list of child nodes.
   *
   * @param content - an XML document string representing nodes to insert
   *
   * @returns the last top level element node created
   */
    ele(content: string): XMLBuilder;
    /**
     * Removes this node from the XML document.
     *
     * @returns parent element node
     */
    remove(): XMLBuilder;
    /**
     * Creates or updates an element attribute.
     *
     * @param namespace - namespace of the attribute
     * @param name - attribute name
     * @param value - attribute value
     *
     * @returns current element node
     */
    att(namespace: string | null, name: string, value: string): XMLBuilder;
    /**
     * Creates or updates an element attribute.
     *
     * @param name - attribute name
     * @param value - attribute value
     *
     * @returns current element node
     */
    att(name: string, value: string): XMLBuilder;
    /**
     * Creates or updates an element attribute.
     *
     * @param obj - a JS object containing element attributes and values
     *
     * @returns current element node
     */
    att(obj: AttributesObject): XMLBuilder;
    /**
     * Removes an attribute.
     *
     * @param name - attribute name
     *
     * @returns current element node
     */
    removeAtt(name: string): XMLBuilder;
    /**
     * Removes a list of attributes.
     *
     * @param names - an array with attribute names
     *
     * @returns current element node
     */
    removeAtt(names: string[]): XMLBuilder;
    /**
     * Removes an attribute.
     *
     * @param namespace - namespace of the attribute to remove
     * @param name - attribute name
     *
     * @returns current element node
     */
    removeAtt(namespace: string | null, name: string): XMLBuilder;
    /**
     * Removes a list of attributes.
     *
     * @param namespace - namespace of the attributes to remove
     * @param names - an array with attribute names
     *
     * @returns current element node
     */
    removeAtt(namespace: string | null, names: string[]): XMLBuilder;
    /**
     * Creates a new text node and appends it to the list of child nodes.
     *
     * @param content - node content
     *
     * @returns current element node
     */
    txt(content: string): XMLBuilder;
    /**
     * Creates a new comment node and appends it to the list of child nodes.
     *
     * @param content - node content
     *
     * @returns current element node
     */
    com(content: string): XMLBuilder;
    /**
     * Creates a new CDATA node and appends it to the list of child nodes.
     *
     * @param content - node content
     *
     * @returns current element node
     */
    dat(content: string): XMLBuilder;
    /**
     * Creates a new processing instruction node and appends it to the list of
     * child nodes.
     *
     * @param target - instruction target
     * @param content - node content
     *
     * @returns current element node
     */
    ins(target: string, content?: string): XMLBuilder;
    /**
     * Creates new processing instruction nodes by expanding the given object and
     * appends them to the list of child nodes.
     *
     * @param contents - a JS object containing processing instruction targets
     * and values or an array of strings
     *
     * @returns current element node
     */
    ins(target: PIObject): XMLBuilder;
    /**
     * Updates XML declaration.
     *
     * @param options - declaration options
     *
     * @returns current element node
     */
    dec(options: {
        version?: "1.0";
        encoding?: string;
        standalone?: boolean;
    }): XMLBuilder;
    /**
     * Creates a new DocType node and inserts it into the document. If the
     * document already contains a DocType node it will be replaced by the new
     * node. Otherwise it will be inserted before the document element node.
     *
     * @param options - DocType identifiers
     *
     * @returns current element node
     */
    dtd(options?: DTDOptions): XMLBuilder;
    /**
     * Imports a node as a child node of this node. The nodes' descendants and
     * attributes will also be imported.
     *
     * @param node - the node to import
     *
     * _Note:_ The node will be cloned before being imported and this clone will
     * be inserted into the document; not the original node.
     *
     * _Note:_ If the imported node is a document, its document element node will
     * be imported. If the imported node is a document fragment its child nodes
     * will be imported.
     *
     * @returns current element node
     */
    import(node: XMLBuilder): XMLBuilder;
    /**
     * Returns the document node.
     */
    doc(): XMLBuilder;
    /**
     * Returns the root element node.
     */
    root(): XMLBuilder;
    /**
     * Returns the parent node.
     */
    up(): XMLBuilder;
    /**
     * Returns the previous sibling node.
     */
    prev(): XMLBuilder;
    /**
     * Returns the next sibling node.
     */
    next(): XMLBuilder;
    /**
     * Returns the first child node.
     */
    first(): XMLBuilder;
    /**
     * Returns the last child node.
     */
    last(): XMLBuilder;
    /**
     * Traverses through the child nodes of a node. `callback` is called with three
     * arguments: `(node, index, level)`.
     *
     * @param callback - a callback function to apply to each child node
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     * @param thisArg - value to use as this when executing callback
     */
    each(callback: ((node: XMLBuilder, index: number, level: number) => void), self?: boolean, recursive?: boolean, thisArg?: any): XMLBuilder;
    /**
     * Produces an array of values by transforming each child node with the given
     * callback function. `callback` is called with three arguments:
     * `(node, index, level)`.
     *
     * @param callback - a callback function to apply to each child node
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     * @param thisArg - value to use as this when executing callback
     */
    map<T>(callback: ((node: XMLBuilder, index: number, level: number) => T), self?: boolean, recursive?: boolean, thisArg?: any): T[];
    /**
     * Reduces child nodes into a single value by applying the given callback
     * function. `callback` is called with four arguments:
     * `(value, node, index, level)`.
     *
     * @param callback - a callback function to apply to each child node
     * @param initialValue - initial value of the iteration
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     * @param thisArg - value to use as this when executing callback
     */
    reduce<T>(callback: ((value: T, node: XMLBuilder, index: number, level: number) => T), initialValue: T, self?: boolean, recursive?: boolean, thisArg?: any): T;
    /**
     * Returns the first child node satisfying the given predicate. `predicate` is
     * called with three arguments: `(node, index, level)`.
     *
     * @param predicate - a callback function to apply to each child node
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     * @param thisArg - value to use as this when executing predicate
     */
    find(predicate: ((node: XMLBuilder, index: number, level: number) => boolean), self?: boolean, recursive?: boolean, thisArg?: any): XMLBuilder | undefined;
    /**
     * Produces an array of child nodes which pass the given predicate test.
     * `predicate` is called with three arguments: `(node, index, level)`.
     *
     * @param predicate - a callback function to apply to each child node
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     * @param thisArg - value to use as this when executing predicate
     */
    filter(predicate: ((node: XMLBuilder, index: number, level: number) => boolean), self?: boolean, recursive?: boolean, thisArg?: any): XMLBuilder[];
    /**
     * Returns `true` if all child nodes pass the given predicate test.
     * `predicate` is called with three arguments: `(node, index, level)`.
     *
     * @param predicate - a callback function to apply to each child node
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     * @param thisArg - value to use as this when executing predicate
     */
    every(predicate: ((node: XMLBuilder, index: number, level: number) => boolean), self?: boolean, recursive?: boolean, thisArg?: any): boolean;
    /**
     * Returns `true` if any of the child nodes pass the given predicate test.
     * `predicate` is called with three arguments: `(node, index, level)`.
     *
     * @param predicate - a callback function to apply to each child node
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     * @param thisArg - value to use as this when executing predicate
     */
    some(predicate: ((node: XMLBuilder, index: number, level: number) => boolean), self?: boolean, recursive?: boolean, thisArg?: any): boolean;
    /**
     * Produces an array of child nodes.
     *
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     */
    toArray(self?: boolean, recursive?: boolean): XMLBuilder[];
    /**
     * Converts the node into an XML string.
     *
     * @param options - serialization options
     */
    toString(writerOptions?: XMLWriterOptions): string;
    /**
     * Converts the node into a JSON string.
     *
     * @param options - serialization options
     */
    toString(writerOptions: JSONWriterOptions): string;
    /**
   * Converts the node into a YAML string.
   *
   * @param options - serialization options
   */
    toString(writerOptions: YAMLWriterOptions): string;
    /**
     * Converts the node into its object representation.
     *
     * @param options - serialization options
     */
    toObject(writerOptions?: ObjectWriterOptions): XMLSerializedAsObject | XMLSerializedAsObjectArray;
    /**
   * Converts the node into its object representation using ES6 maps.
   *
   * @param options - serialization options
   */
    toObject(writerOptions: MapWriterOptions): XMLSerializedAsMap | XMLSerializedAsMapArray;
    /**
     * Converts the entire XML document into an XML document string with the
     * default writer options.
     */
    end(): string;
    /**
     * Converts the entire XML document into an XML document string.
     *
     * @param options - serialization options
     */
    end(writerOptions: XMLWriterOptions): string;
    /**
     * Converts the entire XML document into a JSON string.
     *
     * @param options - serialization options
     */
    end(writerOptions: JSONWriterOptions): string;
    /**
     * Converts the entire XML document into a YAML string.
     *
     * @param options - serialization options
     */
    end(writerOptions: YAMLWriterOptions): string;
    /**
     * Converts the entire XML document into its object representation.
     *
     * @param options - serialization options
     */
    end(writerOptions: ObjectWriterOptions): XMLSerializedAsObject | XMLSerializedAsObjectArray;
    /**
     * Converts the entire XML document into its object representation using ES6 maps.
     *
     * @param options - serialization options
     */
    end(writerOptions: MapWriterOptions): XMLSerializedAsMap | XMLSerializedAsMapArray;
}
/**
 * Builds and serializes an XML document in chunks.
 */
export interface XMLBuilderCB {
    /**
     * Adds a listener for the data event which is emitted when a chunk of data
     * is produced.
     *
     * @param event - event name
     * @param listener - an event listener callback
     */
    on(event: "data", listener: (chunk: string, level: number) => void): this;
    /**
     * Adds a listener for the end event which is emitted when the XML document is
     * completed.
     *
     * @param event - event name
     * @param listener - an event listener callback
     */
    on(event: "end", listener: () => void): this;
    /**
     * Adds a listener for the error event which is emitted when an error occurs.
     *
     * @param event - event name
     * @param listener - an event listener callback
     */
    on(event: "error", listener: (err: Error) => void): this;
    /**
     * Removes a listener for the data event which is emitted when a chunk of data
     * is produced.
     *
     * @param event - event name
     * @param listener - an event listener callback
     */
    off(event: "data", listener: (chunk: string, level: number) => void): this;
    /**
     * Removes a listener for the end event which is emitted when the XML document
     * is completed.
     *
     * @param event - event name
     * @param listener - an event listener callback
     */
    off(event: "end", listener: () => void): this;
    /**
     * Removes a listener for the error event which is emitted when an error
     * occurs.
     *
     * @param event - event name
     * @param listener - an event listener callback
     */
    off(event: "error", listener: (err: Error) => void): this;
    /**
     * Creates a new element node and appends it to the list of child nodes.
     *
     * @param namespace - element namespace
     * @param name - element name
     * @param attributes - a JS object with element attributes
     *
     * @returns the builder
     */
    ele(namespace: string | null, name: string, attributes?: AttributesObject): this;
    /**
     * Creates a new element node and appends it to the list of child nodes.
     *
     * @param name - element name
     * @param attributes - a JS object with element attributes
     *
     * @returns callback builder
     */
    ele(name: string, attributes?: AttributesObject): this;
    /**
     * Creates new element nodes from the given JS object and appends it to the
     * list of child nodes.
     *
     * @param obj - a JS object representing nodes to insert
     *
     * @returns the last top level element node created
     */
    ele(obj: ExpandObject): this;
    /**
     * Creates or updates an element attribute.
     *
     * @param namespace - namespace of the attribute
     * @param name - attribute name
     * @param value - attribute value
     *
     * @returns callback builder
     */
    att(namespace: string | null, name: string, value: string): this;
    /**
     * Creates or updates an element attribute.
     *
     * @param name - attribute name
     * @param value - attribute value
     *
     * @returns callback builder
     */
    att(name: string, value: string): this;
    /**
     * Creates or updates an element attribute.
     *
     * @param obj - a JS object containing element attributes and values
     *
     * @returns callback builder
     */
    att(obj: AttributesObject): this;
    /**
     * Creates a new text node and appends it to the list of child nodes.
     *
     * @param content - node content
     *
     * @returns callback builder
     */
    txt(content: string): this;
    /**
     * Creates a new comment node and appends it to the list of child nodes.
     *
     * @param content - node content
     *
     * @returns callback builder
     */
    com(content: string): this;
    /**
     * Creates a new CDATA node and appends it to the list of child nodes.
     *
     * @param content - node content
     *
     * @returns callback builder
     */
    dat(content: string): this;
    /**
     * Creates a new processing instruction node and appends it to the list of
     * child nodes.
     *
     * @param target - instruction target
     * @param content - node content
     *
     * @returns callback builder
     */
    ins(target: string, content?: string): this;
    /**
     * Creates new processing instruction nodes by expanding the given object and
     * appends them to the list of child nodes.
     *
     * @param contents - a JS object containing processing instruction targets
     * and values or an array of strings
     *
     * @returns callback builder
     */
    ins(target: PIObject): this;
    /**
     * Creates the XML declaration.
     *
     * @param options - declaration options
     *
     * @returns callback builder
     */
    dec(options?: {
        version?: "1.0";
        encoding?: string;
        standalone?: boolean;
    }): this;
    /**
     * Creates a new DocType node and inserts it into the document.
     *
     * @param options - DocType identifiers
     *
     * @returns callback builder
     */
    dtd(options: DTDOptions & {
        name: string;
    }): this;
    /**
     * Imports a node as a child node of this node. The nodes' descendants and
     * attributes will also be imported.
     *
     * @param node - the node to import
     *
     * _Note:_ The node will be cloned before being imported and this clone will
     * be inserted into the document; not the original node.
     *
     * _Note:_ If the imported node is a document, its document element node will
     * be imported. If the imported node is a document fragment its child nodes
     * will be imported.
     *
     * @returns callback builder
     */
    import(node: XMLBuilder): this;
    /**
     * Closes the current element node.
     *
     * @returns callback builder
     */
    up(): this;
    /**
     * Completes serializing the XML document.
     *
     * @returns callback builder
     */
    end(): this;
}
/**
 * Defines the options passed to the callback builder.
 */
export declare type XMLBuilderCBOptions = CBWriterOptions & {
    /**
     * A callback function which is called when a chunk of XML is serialized.
     */
    data: ((chunk: string, level: number) => void);
    /**
     * A callback function which is called when XML serialization is completed.
     */
    end: (() => void);
    /**
     * A callback function which is called when an error occurs.
     */
    error: ((err: Error) => void);
    /**
     * Whether nodes with `null` values will be kept or ignored
     */
    keepNullNodes: boolean;
    /**
     * Whether attributes with `null` values will be kept or ignored
     */
    keepNullAttributes: boolean;
    /**
     * Whether converter strings will be ignored when converting JS
     * objects to nodes
     */
    ignoreConverters: boolean;
    /**
     * Defines string keys used while converting JS objects to nodes.
     */
    convert: ConvertOptions;
    /**
     * Defines default namespaces to apply to all elements and attributes.
     */
    defaultNamespace: {
        ele?: null | string;
        att?: null | string;
    };
    /**
     * Defines namespace aliases.
     */
    namespaceAlias: {
        [key: string]: string | null;
    };
    /**
   * Replacement for invalid characters in input strings.
   * If `invalidCharReplacement` is a string, each invalid character in an input
   * string will be replaced with it; otherwise if `invalidCharReplacement`
   * is a function it will be passed each invalid character and should return
   * a replacement character.
   */
    invalidCharReplacement: string | ((substring: string, ...args: any[]) => string) | undefined;
};
/**
 * Defines the base options passed to the callback builder's serializer.
 */
export declare type BaseCBWriterOptions = {
    /**
     * Output format. Defaults to `"xml"`.
     * - `"xml"` - Serializes the document as a string in XML format.
     * - `"json"` - Serializes the document as a JSON string.
     * - `"yaml"` - Serializes the document as a YAML string.
     */
    format?: "xml" | "json" | "yaml";
    /**
     * Ensures that the document adheres to the syntax rules specified by the
     * XML specification. If this flag is set and the document is not well-formed
     * errors will be thrown. Defaults to `false`.
     */
    wellFormed: boolean;
};
/**
 * Defines the options passed to the callback builder's XML writer.
 */
export declare type XMLCBWriterOptions = BaseCBWriterOptions & {
    /** @inheritdoc */
    format?: "xml";
    /**
     * Pretty-prints the XML tree. Defaults to `false`.
     */
    prettyPrint: boolean;
    /**
     * Determines the indentation string for pretty printing. Defaults to two
     * space characters.
     */
    indent: string;
    /**
     * Determines the newline string for pretty printing. Defaults to `"\n"`.
     */
    newline: string;
    /**
     * Defines a fixed number of indentations to add to every line. Defaults to
     * `0`.
     */
    offset: number;
    /**
     * Wraps attributes to the next line if the column width exceeds the given
     * value. Defaults to `0` which disables attribute wrapping.
     */
    width: number;
    /**
     * Produces closing tags for empty element nodes. Defaults to `false`. With
     * this option set to `true`, closing tags will be produced for element nodes
     * without child nodes, e.g.
     * ```xml
     * <node></node>
     * ```
     * Otherwise, empty element nodes will be self-closed, e.g.
     * ```xml
     * <node/>
     * ```
     */
    allowEmptyTags: boolean;
    /**
     * Inserts a space character before the slash character of self-closing tags.
     * Defaults to `false`. With this options set to `true`, a space character
     * will be inserted before the slash character of self-closing tags, e.g.
     * ```xml
     * <node />
     * ```
     */
    spaceBeforeSlash: boolean;
};
/**
 * Defines the options passed to the callback builder's JSON writer.
 */
export declare type JSONCBWriterOptions = BaseCBWriterOptions & {
    /** @inheritdoc */
    format?: "json";
    /**
     * Pretty-prints the XML tree. Defaults to `false`.
     */
    prettyPrint: boolean;
    /**
     * Determines the indentation string for pretty printing. Defaults to two
     * space characters.
     */
    indent: string;
    /**
     * Determines the newline string for pretty printing. Defaults to `"\n"`.
     */
    newline: string;
    /**
     * Defines a fixed number of indentations to add to every line. Defaults to
     * `0`.
     */
    offset: number;
};
/**
 * Defines the options passed to the the callback builder's YAML writer.
 */
export declare type YAMLCBWriterOptions = BaseCBWriterOptions & {
    /** @inheritdoc */
    format?: "yaml";
    /**
     * Determines the indentation string. Defaults to two space characters.
     */
    indent: string;
    /**
     * Determines the newline string. Defaults to `"\n"`.
     */
    newline: string;
    /**
     * Defines a fixed number of indentations to add to every line. Defaults to
     * `0`.
     */
    offset: number;
};
/**
 * Defines the options passed to the callback builder's writer.
 */
export declare type CBWriterOptions = XMLCBWriterOptions | JSONCBWriterOptions | YAMLCBWriterOptions;
/**
 * Defines the options passed to the callback builder.
 */
export declare type XMLBuilderCBCreateOptions = RecursivePartial<XMLBuilderCBOptions>;
/**
 * Defines default values for builder options.
 */
export declare const DefaultXMLBuilderCBOptions: Partial<XMLBuilderCBOptions>;
declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
export {};
