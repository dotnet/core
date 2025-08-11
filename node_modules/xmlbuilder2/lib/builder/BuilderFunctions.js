"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("../interfaces");
var util_1 = require("@oozcitak/util");
var util_2 = require("@oozcitak/dom/lib/util");
var _1 = require(".");
var dom_1 = require("../builder/dom");
/** @inheritdoc */
function builder(p1, p2) {
    var options = formatBuilderOptions(isXMLBuilderCreateOptions(p1) ? p1 : interfaces_1.DefaultBuilderOptions);
    var nodes = util_2.Guard.isNode(p1) || util_1.isArray(p1) ? p1 : p2;
    if (nodes === undefined) {
        throw new Error("Invalid arguments.");
    }
    if (util_1.isArray(nodes)) {
        var builders = [];
        for (var i = 0; i < nodes.length; i++) {
            var builder_1 = new _1.XMLBuilderImpl(nodes[i]);
            builder_1.set(options);
            builders.push(builder_1);
        }
        return builders;
    }
    else {
        var builder_2 = new _1.XMLBuilderImpl(nodes);
        builder_2.set(options);
        return builder_2;
    }
}
exports.builder = builder;
/** @inheritdoc */
function create(p1, p2) {
    var options = formatBuilderOptions(p1 === undefined || isXMLBuilderCreateOptions(p1) ?
        p1 : interfaces_1.DefaultBuilderOptions);
    var contents = isXMLBuilderCreateOptions(p1) ? p2 : p1;
    var doc = dom_1.createDocument();
    setOptions(doc, options);
    var builder = new _1.XMLBuilderImpl(doc);
    if (contents !== undefined) {
        // parse contents
        builder.ele(contents);
    }
    return builder;
}
exports.create = create;
/** @inheritdoc */
function fragment(p1, p2) {
    var options = formatBuilderOptions(p1 === undefined || isXMLBuilderCreateOptions(p1) ?
        p1 : interfaces_1.DefaultBuilderOptions);
    var contents = isXMLBuilderCreateOptions(p1) ? p2 : p1;
    var doc = dom_1.createDocument();
    setOptions(doc, options, true);
    var builder = new _1.XMLBuilderImpl(doc.createDocumentFragment());
    if (contents !== undefined) {
        // parse contents
        builder.ele(contents);
    }
    return builder;
}
exports.fragment = fragment;
/** @inheritdoc */
function convert(p1, p2, p3) {
    var builderOptions;
    var contents;
    var convertOptions;
    if (isXMLBuilderCreateOptions(p1) && p2 !== undefined) {
        builderOptions = p1;
        contents = p2;
        convertOptions = p3;
    }
    else {
        builderOptions = interfaces_1.DefaultBuilderOptions;
        contents = p1;
        convertOptions = p2 || undefined;
    }
    return create(builderOptions, contents).end(convertOptions);
}
exports.convert = convert;
function isXMLBuilderCreateOptions(obj) {
    if (!util_1.isPlainObject(obj))
        return false;
    for (var key in obj) {
        /* istanbul ignore else */
        if (obj.hasOwnProperty(key)) {
            if (!interfaces_1.XMLBuilderOptionKeys.has(key))
                return false;
        }
    }
    return true;
}
function formatBuilderOptions(createOptions) {
    if (createOptions === void 0) { createOptions = {}; }
    var options = util_1.applyDefaults(createOptions, interfaces_1.DefaultBuilderOptions);
    if (options.convert.att.length === 0 ||
        options.convert.ins.length === 0 ||
        options.convert.text.length === 0 ||
        options.convert.cdata.length === 0 ||
        options.convert.comment.length === 0) {
        throw new Error("JS object converter strings cannot be zero length.");
    }
    return options;
}
function setOptions(doc, options, isFragment) {
    var docWithSettings = doc;
    docWithSettings._xmlBuilderOptions = options;
    docWithSettings._isFragment = isFragment;
}
//# sourceMappingURL=BuilderFunctions.js.map