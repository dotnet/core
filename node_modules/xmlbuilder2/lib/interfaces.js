"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines default values for builder options.
 */
exports.DefaultBuilderOptions = {
    version: "1.0",
    encoding: undefined,
    standalone: undefined,
    keepNullNodes: false,
    keepNullAttributes: false,
    ignoreConverters: false,
    skipWhitespaceOnlyText: true,
    convert: {
        att: "@",
        ins: "?",
        text: "#",
        cdata: "$",
        comment: "!"
    },
    defaultNamespace: {
        ele: undefined,
        att: undefined
    },
    namespaceAlias: {
        html: "http://www.w3.org/1999/xhtml",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/",
        mathml: "http://www.w3.org/1998/Math/MathML",
        svg: "http://www.w3.org/2000/svg",
        xlink: "http://www.w3.org/1999/xlink"
    },
    invalidCharReplacement: undefined,
    parser: undefined
};
/**
 * Contains keys of `XMLBuilderOptions`.
 */
exports.XMLBuilderOptionKeys = new Set(Object.keys(exports.DefaultBuilderOptions));
/**
 * Defines default values for builder options.
 */
exports.DefaultXMLBuilderCBOptions = {
    format: "xml",
    wellFormed: false,
    prettyPrint: false,
    indent: "  ",
    newline: "\n",
    offset: 0,
    width: 0,
    allowEmptyTags: false,
    spaceBeforeSlash: false,
    keepNullNodes: false,
    keepNullAttributes: false,
    ignoreConverters: false,
    convert: {
        att: "@",
        ins: "?",
        text: "#",
        cdata: "$",
        comment: "!"
    },
    defaultNamespace: {
        ele: undefined,
        att: undefined
    },
    namespaceAlias: {
        html: "http://www.w3.org/1999/xhtml",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/",
        mathml: "http://www.w3.org/1998/Math/MathML",
        svg: "http://www.w3.org/2000/svg",
        xlink: "http://www.w3.org/1999/xlink"
    }
};
//# sourceMappingURL=interfaces.js.map