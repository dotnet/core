"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents the state of the URL parser.
 */
var ParserState;
(function (ParserState) {
    ParserState[ParserState["SchemeStart"] = 0] = "SchemeStart";
    ParserState[ParserState["Scheme"] = 1] = "Scheme";
    ParserState[ParserState["NoScheme"] = 2] = "NoScheme";
    ParserState[ParserState["SpecialRelativeOrAuthority"] = 3] = "SpecialRelativeOrAuthority";
    ParserState[ParserState["PathOrAuthority"] = 4] = "PathOrAuthority";
    ParserState[ParserState["Relative"] = 5] = "Relative";
    ParserState[ParserState["RelativeSlash"] = 6] = "RelativeSlash";
    ParserState[ParserState["SpecialAuthoritySlashes"] = 7] = "SpecialAuthoritySlashes";
    ParserState[ParserState["SpecialAuthorityIgnoreSlashes"] = 8] = "SpecialAuthorityIgnoreSlashes";
    ParserState[ParserState["Authority"] = 9] = "Authority";
    ParserState[ParserState["Host"] = 10] = "Host";
    ParserState[ParserState["Hostname"] = 11] = "Hostname";
    ParserState[ParserState["Port"] = 12] = "Port";
    ParserState[ParserState["File"] = 13] = "File";
    ParserState[ParserState["FileSlash"] = 14] = "FileSlash";
    ParserState[ParserState["FileHost"] = 15] = "FileHost";
    ParserState[ParserState["PathStart"] = 16] = "PathStart";
    ParserState[ParserState["Path"] = 17] = "Path";
    ParserState[ParserState["CannotBeABaseURLPath"] = 18] = "CannotBeABaseURLPath";
    ParserState[ParserState["Query"] = 19] = "Query";
    ParserState[ParserState["Fragment"] = 20] = "Fragment";
})(ParserState = exports.ParserState || (exports.ParserState = {}));
exports.OpaqueOrigin = ["", "", null, null];
//# sourceMappingURL=interfaces.js.map