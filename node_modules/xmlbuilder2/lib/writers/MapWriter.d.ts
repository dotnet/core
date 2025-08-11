import { MapWriterOptions, XMLSerializedAsMap, XMLSerializedAsMapArray, XMLBuilderOptions } from "../interfaces";
import { Node } from "@oozcitak/dom/lib/dom/interfaces";
import { BaseWriter } from "./BaseWriter";
/**
 * Serializes XML nodes into ES6 maps and arrays.
 */
export declare class MapWriter extends BaseWriter<MapWriterOptions, XMLSerializedAsMap | XMLSerializedAsMapArray> {
    /**
     * Initializes a new instance of `MapWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    constructor(builderOptions: XMLBuilderOptions, writerOptions: MapWriterOptions);
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     */
    serialize(node: Node): XMLSerializedAsMap | XMLSerializedAsMapArray;
    /**
     * Recursively converts a JS object into an ES5 map.
     *
     * @param obj - a JS object
     */
    _convertObject(obj: any): any;
}
