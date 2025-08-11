import { DocumentType, Document, XMLDocument, DOMImplementation } from "./interfaces";
/**
 * Represents an object providing methods which are not dependent on
 * any particular document.
 */
export declare class DOMImplementationImpl implements DOMImplementation {
    _ID: string;
    _associatedDocument: Document;
    /**
     * Initializes a new instance of `DOMImplementation`.
     *
     * @param document - the associated document
     */
    constructor(document?: Document);
    /** @inheritdoc */
    createDocumentType(qualifiedName: string, publicId: string, systemId: string): DocumentType;
    /** @inheritdoc */
    createDocument(namespace: string | null, qualifiedName: string, doctype?: DocumentType | null): XMLDocument;
    /** @inheritdoc */
    createHTMLDocument(title?: string): Document;
    /** @inheritdoc */
    hasFeature(): boolean;
    /**
     * Creates a new `DOMImplementation`.
     *
     * @param document - owner document
     */
    static _create(document: Document): DOMImplementationImpl;
}
