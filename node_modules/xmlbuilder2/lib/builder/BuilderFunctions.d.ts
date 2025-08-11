import { XMLBuilderCreateOptions, ExpandObject, XMLBuilder, XMLWriterOptions, JSONWriterOptions, ObjectWriterOptions, XMLSerializedAsObject, XMLSerializedAsObjectArray, MapWriterOptions, XMLSerializedAsMap, XMLSerializedAsMapArray, YAMLWriterOptions } from '../interfaces';
import { Node } from '@oozcitak/dom/lib/dom/interfaces';
/**
 * Wraps a DOM node for use with XML builder with default options.
 *
 * @param node - DOM node
 *
 * @returns an XML builder
 */
export declare function builder(node: Node): XMLBuilder;
/**
 * Wraps an array of DOM nodes for use with XML builder with default options.
 *
 * @param nodes - an array of DOM nodes
 *
 * @returns an array of XML builders
 */
export declare function builder(nodes: Node[]): XMLBuilder[];
/**
 * Wraps a DOM node for use with XML builder with the given options.
 *
 * @param options - builder options
 * @param node - DOM node
 *
 * @returns an XML builder
 */
export declare function builder(options: XMLBuilderCreateOptions, node: Node): XMLBuilder;
/**
 * Wraps an array of DOM nodes for use with XML builder with the given options.
 *
 * @param options - builder options
 * @param nodes - an array of DOM nodes
 *
 * @returns an array of XML builders
 */
export declare function builder(options: XMLBuilderCreateOptions, nodes: Node[]): XMLBuilder[];
/**
 * Creates an XML document without any child nodes.
 *
 * @returns document node
 */
export declare function create(): XMLBuilder;
/**
 * Creates an XML document without any child nodes with the given options.
 *
 * @param options - builder options
 *
 * @returns document node
 */
export declare function create(options: XMLBuilderCreateOptions): XMLBuilder;
/**
 * Creates an XML document by parsing the given `contents`.
 *
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 *
 * @returns document node
 */
export declare function create(contents: string | ExpandObject): XMLBuilder;
/**
 * Creates an XML document.
 *
 * @param options - builder options
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 *
 * @returns document node
 */
export declare function create(options: XMLBuilderCreateOptions, contents: string | ExpandObject): XMLBuilder;
/**
 * Creates a new document fragment without any child nodes.
 *
 * @returns document fragment node
 */
export declare function fragment(): XMLBuilder;
/**
 * Creates a new document fragment with the given options.
 *
 * @param options - builder options
 *
 * @returns document fragment node
 */
export declare function fragment(options: XMLBuilderCreateOptions): XMLBuilder;
/**
 * Creates a new document fragment by parsing the given `contents`.
 *
 * @param contents - a string containing an XML fragment in either XML or JSON
 * format or a JS object representing nodes to insert
 *
 * @returns document fragment node
 */
export declare function fragment(contents: string | ExpandObject): XMLBuilder;
/**
 * Creates a new document fragment.
 *
 * @param options - builder options
 * @param contents - a string containing an XML fragment in either XML or JSON
 * format or a JS object representing nodes to insert
 *
 * @returns document fragment node
 */
export declare function fragment(options: XMLBuilderCreateOptions, contents: string | ExpandObject): XMLBuilder;
/**
 * Parses an XML document with the default options and converts it to an XML
 * document string with the default writer options.
 *
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 *
 * @returns document node
 */
export declare function convert(contents: string | ExpandObject): string;
/**
 * Parses an XML document with the given options and converts it to an XML
 * document string with the default writer options.
 *
 * @param builderOptions - builder options
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 *
 * @returns document node
 */
export declare function convert(builderOptions: XMLBuilderCreateOptions, contents: string | ExpandObject): string;
/**
 * Parses an XML document with the default options and converts it an XML
 * document string.
 *
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 * @param convertOptions - convert options
 *
 * @returns document node
 */
export declare function convert(contents: string | ExpandObject, convertOptions: XMLWriterOptions): string;
/**
 * Parses an XML document with the default options and converts it a JSON string.
 *
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 * @param convertOptions - convert options
 *
 * @returns document node
 */
export declare function convert(contents: string | ExpandObject, convertOptions: JSONWriterOptions): string;
/**
 * Parses an XML document with the default options and converts it a YAML string.
 *
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 * @param convertOptions - convert options
 *
 * @returns document node
 */
export declare function convert(contents: string | ExpandObject, convertOptions: YAMLWriterOptions): string;
/**
 * Parses an XML document with the default options and converts it to its object
 * representation.
 *
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 * @param convertOptions - convert options
 *
 * @returns document node
 */
export declare function convert(contents: string | ExpandObject, convertOptions: ObjectWriterOptions): XMLSerializedAsObject | XMLSerializedAsObjectArray;
/**
 * Parses an XML document with the default options and converts it to its object
 * representation using ES6 maps.
 *
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 * @param convertOptions - convert options
 *
 * @returns document node
 */
export declare function convert(contents: string | ExpandObject, convertOptions: MapWriterOptions): XMLSerializedAsMap | XMLSerializedAsMapArray;
/**
 * Parses an XML document with the given options and converts it to an XML
 * document string.
 *
 * @param builderOptions - builder options
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 * @param convertOptions - convert options
 *
 * @returns document node
 */
export declare function convert(builderOptions: XMLBuilderCreateOptions, contents: string | ExpandObject, convertOptions: XMLWriterOptions): string;
/**
 * Parses an XML document with the given options and converts it to a JSON
 * string.
 *
 * @param builderOptions - builder options
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 * @param convertOptions - convert options
 *
 * @returns document node
 */
export declare function convert(builderOptions: XMLBuilderCreateOptions, contents: string | ExpandObject, convertOptions: JSONWriterOptions): string;
/**
 * Parses an XML document with the given options and converts it to a YAML
 * string.
 *
 * @param builderOptions - builder options
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 * @param convertOptions - convert options
 *
 * @returns document node
 */
export declare function convert(builderOptions: XMLBuilderCreateOptions, contents: string | ExpandObject, convertOptions: YAMLWriterOptions): string;
/**
 * Parses an XML document with the given options and converts it to its object
 * representation.
 *
 * @param builderOptions - builder options
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 * @param convertOptions - convert options
 *
 * @returns document node
 */
export declare function convert(builderOptions: XMLBuilderCreateOptions, contents: string | ExpandObject, convertOptions: ObjectWriterOptions): XMLSerializedAsObject | XMLSerializedAsObjectArray;
/**
 * Parses an XML document with the given options and converts it to its object
 * representation using ES6 maps.
 *
 * @param builderOptions - builder options
 * @param contents - a string containing an XML document in either XML or JSON
 * format or a JS object representing nodes to insert
 * @param convertOptions - convert options
 *
 * @returns document node
 */
export declare function convert(builderOptions: XMLBuilderCreateOptions, contents: string | ExpandObject, convertOptions: MapWriterOptions): XMLSerializedAsMap | XMLSerializedAsMapArray;
