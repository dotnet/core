"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@oozcitak/util");
var interfaces_1 = require("./interfaces");
var infra_1 = require("@oozcitak/infra");
var url_1 = require("url");
var _validationErrorCallback;
/**
 * Default ports for a special URL scheme.
 */
var _defaultPorts = {
    "ftp": 21,
    "file": null,
    "http": 80,
    "https": 443,
    "ws": 80,
    "wss": 443
};
/**
 * The C0 control percent-encode set are the C0 controls and all code points
 * greater than U+007E (~).
 */
var _c0ControlPercentEncodeSet = /[\0-\x1F\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
/**
 * The fragment percent-encode set is the C0 control percent-encode set and
 * U+0020 SPACE, U+0022 ("), U+003C (<), U+003E (>), and U+0060 (`).
 */
var _fragmentPercentEncodeSet = /[ "<>`]|[\0-\x1F\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
/**
 * The path percent-encode set is the fragment percent-encode set and
 * U+0023 (#), U+003F (?), U+007B ({), and U+007D (}).
 */
var _pathPercentEncodeSet = /[ "<>`#?{}]|[\0-\x1F\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
/**
 * The userinfo percent-encode set is the path percent-encode set and
 * U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+0040 (@), U+005B ([),
 * U+005C (\), U+005D (]), U+005E (^), and U+007C (|).
 */
var _userInfoPercentEncodeSet = /[ "<>`#?{}/:;=@\[\]\\\^\|]|[\0-\x1F\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
/**
 * The URL code points are ASCII alphanumeric, U+0021 (!), U+0024 ($),
 * U+0026 (&), U+0027 ('), U+0028 LEFT PARENTHESIS, U+0029 RIGHT PARENTHESIS,
 * U+002A (*), U+002B (+), U+002C (,), U+002D (-), U+002E (.), U+002F (/),
 * U+003A (:), U+003B (;), U+003D (=), U+003F (?), U+0040 (@), U+005F (_),
 * U+007E (~), and code points in the range U+00A0 to U+10FFFD, inclusive,
 * excluding surrogates and noncharacters.
 */
var _urlCodePoints = /[0-9A-Za-z!\$&-\/:;=\?@_~\xA0-\uD7FF\uE000-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uD83E\uD840-\uD87E\uD880-\uD8BE\uD8C0-\uD8FE\uD900-\uD93E\uD940-\uD97E\uD980-\uD9BE\uD9C0-\uD9FE\uDA00-\uDA3E\uDA40-\uDA7E\uDA80-\uDABE\uDAC0-\uDAFE\uDB00-\uDB3E\uDB40-\uDB7E\uDB80-\uDBBE\uDBC0-\uDBFE][\uDC00-\uDFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDC00-\uDFFD]/;
/**
 * A forbidden host code point is U+0000 NULL, U+0009 TAB, U+000A LF,
 * U+000D CR, U+0020 SPACE, U+0023 (#), U+0025 (%), U+002F (/), U+003A (:),
 * U+003F (?), U+0040 (@), U+005B ([), U+005C (\), or U+005D (]).
 */
var _forbiddenHostCodePoint = /[\0\t\f\r #%/:?@\[\\\]]/;
/**
 * Sets the callback function for validation errors.
 *
 * @param validationErrorCallback - a callback function to be called when a
 * validation error occurs
 */
function setValidationErrorCallback(validationErrorCallback) {
    _validationErrorCallback = validationErrorCallback;
}
exports.setValidationErrorCallback = setValidationErrorCallback;
/**
 * Generates a validation error.
 *
 * @param message - error message
 */
function validationError(message) {
    if (_validationErrorCallback !== undefined) {
        _validationErrorCallback.call(null, "Validation Error: " + message);
    }
}
/**
 * Creates a new URL.
 */
function newURL() {
    return {
        scheme: '',
        username: '',
        password: '',
        host: null,
        port: null,
        path: [],
        query: null,
        fragment: null,
        _cannotBeABaseURLFlag: false,
        _blobURLEntry: null
    };
}
exports.newURL = newURL;
/**
 * Determines if the scheme is a special scheme.
 *
 * @param scheme - a scheme
 */
function isSpecialScheme(scheme) {
    return (scheme in _defaultPorts);
}
exports.isSpecialScheme = isSpecialScheme;
/**
 * Determines if the URL has a special scheme.
 *
 * @param url - an URL
 */
function isSpecial(url) {
    return isSpecialScheme(url.scheme);
}
exports.isSpecial = isSpecial;
/**
 * Returns the default port for a special scheme.
 *
 * @param scheme - a scheme
 */
function defaultPort(scheme) {
    return _defaultPorts[scheme] || null;
}
exports.defaultPort = defaultPort;
/**
 * Determines if the URL has credentials.
 *
 * @param url - an URL
 */
function includesCredentials(url) {
    return url.username !== '' || url.password !== '';
}
exports.includesCredentials = includesCredentials;
/**
 * Determines if an URL cannot have credentials.
 *
 * @param url - an URL
 */
function cannotHaveAUsernamePasswordPort(url) {
    /**
     * A URL cannot have a username/password/port if its host is null or the
     * empty string, its cannot-be-a-base-URL flag is set, or its scheme is
     * "file".
     */
    return (url.host === null || url.host === "" || url._cannotBeABaseURLFlag ||
        url.scheme === "file");
}
exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;
/**
 * Serializes an URL into a string.
 *
 * @param url - an URL
 */
function urlSerializer(url, excludeFragmentFlag) {
    var e_1, _a;
    if (excludeFragmentFlag === void 0) { excludeFragmentFlag = false; }
    /**
     * 1. Let output be url’s scheme and U+003A (:) concatenated.
     */
    var output = url.scheme + ':';
    /**
     * 2. If url’s host is non-null:
     */
    if (url.host !== null) {
        /**
         * 2.1. Append "//" to output.
         */
        output += '//';
        /**
         * 2.2. If url includes credentials, then:
         */
        if (includesCredentials(url)) {
            /**
             * 2.2.1. Append url’s username to output.
             * 2.2.2. If url’s password is not the empty string, then append U+003A (:),
             * followed by url’s password, to output.
             * 2.2.3. Append U+0040 (@) to output.
             */
            output += url.username;
            if (url.password !== '') {
                output += ':' + url.password;
            }
            output += '@';
        }
        /**
         * 2.3. Append url’s host, serialized, to output.
         * 2.4. If url’s port is non-null, append U+003A (:) followed by url’s port,
         * serialized, to output.
         */
        output += hostSerializer(url.host);
        if (url.port !== null) {
            output += ':' + url.port;
        }
    }
    else if (url.host === null && url.scheme === "file") {
        /**
         * 3. Otherwise, if url’s host is null and url’s scheme is "file", append "//" to output.
         */
        output += '//';
    }
    /**
     * 4. If url’s cannot-be-a-base-URL flag is set, append url’s path[0] to
     * output.
     * 5. Otherwise, then for each string in url’s path, append U+002F (/)
     * followed by the string to output.
     */
    if (url._cannotBeABaseURLFlag) {
        output += url.path[0];
    }
    else {
        try {
            for (var _b = __values(url.path), _c = _b.next(); !_c.done; _c = _b.next()) {
                var str = _c.value;
                output += '/' + str;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    /**
     * 6. If url’s query is non-null, append U+003F (?), followed by url’s
     * query, to output.
     * 7. If the exclude fragment flag is unset and url’s fragment is non-null,
     * append U+0023 (#), followed by url’s fragment, to output.
     * 8. Return output.
     */
    if (url.query !== null) {
        output += '?' + url.query;
    }
    if (!excludeFragmentFlag && url.fragment !== null) {
        output += '#' + url.fragment;
    }
    return output;
}
exports.urlSerializer = urlSerializer;
/**
 * Serializes a host into a string.
 *
 * @param host - a host
 */
function hostSerializer(host) {
    /**
     * 1. If host is an IPv4 address, return the result of running the IPv4
     * serializer on host.
     * 2. Otherwise, if host is an IPv6 address, return U+005B ([), followed
     * by the result of running the IPv6 serializer on host, followed by
     * U+005D (]).
     * 3. Otherwise, host is a domain, opaque host, or empty host, return host.
     */
    if (util_1.isNumber(host)) {
        return iPv4Serializer(host);
    }
    else if (util_1.isArray(host)) {
        return '[' + iPv6Serializer(host) + ']';
    }
    else {
        return host;
    }
}
exports.hostSerializer = hostSerializer;
/**
 * Serializes an IPv4 address into a string.
 *
 * @param address  - an IPv4 address
 */
function iPv4Serializer(address) {
    /**
     * 1. Let output be the empty string.
     * 2. Let n be the value of address.
     * 3. For each i in the range 1 to 4, inclusive:
     * 3.1. Prepend n % 256, serialized, to output.
     * 3.2. If i is not 4, then prepend U+002E (.) to output.
     * 3.3. Set n to floor(n / 256).
     * 4. Return output.
     */
    var output = "";
    var n = address;
    for (var i = 1; i <= 4; i++) {
        output = (n % 256).toString() + output;
        if (i !== 4) {
            output = '.' + output;
        }
        n = Math.floor(n / 256);
    }
    return output;
}
exports.iPv4Serializer = iPv4Serializer;
/**
 * Serializes an IPv6 address into a string.
 *
 * @param address  - an IPv6 address represented as a list of eight numbers
 */
function iPv6Serializer(address) {
    /**
     * 1. Let output be the empty string.
     * 2. Let compress be an index to the first IPv6 piece in the first longest
     * sequences of address’s IPv6 pieces that are 0.
     * In 0:f:0:0:f:f:0:0 it would point to the second 0.
     * 3. If there is no sequence of address’s IPv6 pieces that are 0 that is
     * longer than 1, then set compress to null.
     */
    var output = "";
    var compress = null;
    var lastIndex = -1;
    var count = 0;
    var lastCount = 0;
    for (var i = 0; i < 8; i++) {
        if (address[i] !== 0)
            continue;
        count = 1;
        for (var j = i + 1; j < 8; j++) {
            if (address[j] !== 0)
                break;
            count++;
            continue;
        }
        if (count > lastCount) {
            lastCount = count;
            lastIndex = i;
        }
    }
    if (lastCount > 1)
        compress = lastIndex;
    /**
     * 4. Let ignore0 be false.
     * 5. For each pieceIndex in the range 0 to 7, inclusive:
     */
    var ignore0 = false;
    for (var pieceIndex = 0; pieceIndex < 8; pieceIndex++) {
        /**
         * 5.1. If ignore0 is true and address[pieceIndex] is 0, then continue.
         * 5.2. Otherwise, if ignore0 is true, set ignore0 to false.
         * 5.3. If compress is pieceIndex, then:
         */
        if (ignore0 && address[pieceIndex] === 0)
            continue;
        if (ignore0)
            ignore0 = false;
        if (compress === pieceIndex) {
            /**
             * 5.3.1. Let separator be "::" if pieceIndex is 0, and U+003A (:) otherwise.
             * 5.3.2. Append separator to output.
             * 5.3.3. Set ignore0 to true and continue.
             */
            output += (pieceIndex === 0 ? '::' : ':');
            ignore0 = true;
            continue;
        }
        /**
         * 5.4. Append address[pieceIndex], represented as the shortest possible
         * lowercase hexadecimal number, to output.
         * 5.5. If pieceIndex is not 7, then append U+003A (:) to output.
         */
        output += address[pieceIndex].toString(16);
        if (pieceIndex !== 7)
            output += ':';
    }
    /**
     * 6. Return output.
     */
    return output;
}
exports.iPv6Serializer = iPv6Serializer;
/**
 * Parses an URL string.
 *
 * @param input - input string
 * @param baseURL - base URL
 * @param encodingOverride - encoding override
 */
function urlParser(input, baseURL, encodingOverride) {
    /**
     * 1. Let url be the result of running the basic URL parser on input with
     * base, and encoding override as provided.
     * 2. If url is failure, return failure.
     * 3. If url’s scheme is not "blob", return url.
     * 4. Set url’s blob URL entry to the result of resolving the blob URL url,
     * if that did not return failure, and null otherwise.
     * 5. Return url.
     */
    var url = basicURLParser(input, baseURL, encodingOverride);
    if (url === null)
        return null;
    if (url.scheme !== "blob")
        return url;
    var entry = resolveABlobURL(url);
    if (entry !== null) {
        url._blobURLEntry = entry;
    }
    else {
        url._blobURLEntry = null;
    }
    return url;
}
exports.urlParser = urlParser;
/**
 * Parses an URL string.
 *
 * @param input - input string
 * @param baseURL - base URL
 * @param encodingOverride - encoding override
 */
function basicURLParser(input, baseURL, encodingOverride, url, stateOverride) {
    var e_2, _a, e_3, _b;
    /**
     * 1. If url is not given:
     * 1.1. Set url to a new URL.
     * 1.2. If input contains any leading or trailing C0 control or space,
     * validation error.
     * 1.3. Remove any leading and trailing C0 control or space from input.
     */
    if (url === undefined) {
        url = newURL();
        // leading
        var leadingControlOrSpace = /^[\u0000-\u001F\u0020]+/;
        var trailingControlOrSpace = /[\u0000-\u001F\u0020]+$/;
        if (leadingControlOrSpace.test(input) || trailingControlOrSpace.test(input)) {
            validationError("Input string contains leading or trailing control characters or space.");
        }
        input = input.replace(leadingControlOrSpace, '');
        input = input.replace(trailingControlOrSpace, '');
    }
    /**
     * 2. If input contains any ASCII tab or newline, validation error.
     * 3. Remove all ASCII tab or newline from input.
     */
    var tabOrNewline = /[\u0009\u000A\u000D]/g;
    if (tabOrNewline.test(input)) {
        validationError("Input string contains tab or newline characters.");
    }
    input = input.replace(tabOrNewline, '');
    /**
     * 4. Let state be state override if given, or scheme start state otherwise.
     * 5. If base is not given, set it to null.
     * 6. Let encoding be UTF-8.
     * 7. If encoding override is given, set encoding to the result of getting
     * an output encoding from encoding override.
     */
    var state = (stateOverride === undefined ? interfaces_1.ParserState.SchemeStart : stateOverride);
    if (baseURL === undefined)
        baseURL = null;
    var encoding = (encodingOverride === undefined ||
        encodingOverride === "replacement" || encodingOverride === "UTF-16BE" ||
        encodingOverride === "UTF-16LE" ? "UTF-8" : encodingOverride);
    /**
     * 8. Let buffer be the empty string.
     * 9. Let the @ flag, [] flag, and passwordTokenSeenFlag be unset.
     * 10. Let pointer be a pointer to first code point in input.
     */
    var buffer = "";
    var atFlag = false;
    var arrayFlag = false;
    var passwordTokenSeenFlag = false;
    var EOF = "";
    var walker = new util_1.StringWalker(input);
    /**
     * 11. Keep running the following state machine by switching on state. If
     * after a run pointer points to the EOF code point, go to the next step.
     * Otherwise, increase pointer by one and continue with the state machine.
     */
    while (true) {
        switch (state) {
            case interfaces_1.ParserState.SchemeStart:
                /**
                 * 1. If c is an ASCII alpha, append c, lowercased, to buffer, and set
                 * state to scheme state.
                 * 2. Otherwise, if state override is not given, set state to no scheme
                 * state, and decrease pointer by one.
                 * 3. Otherwise, validation error, return failure.
                 */
                if (infra_1.codePoint.ASCIIAlpha.test(walker.c())) {
                    buffer += walker.c().toLowerCase();
                    state = interfaces_1.ParserState.Scheme;
                }
                else if (stateOverride === undefined) {
                    state = interfaces_1.ParserState.NoScheme;
                    walker.pointer--;
                }
                else {
                    validationError("Invalid scheme start character.");
                    return null;
                }
                break;
            case interfaces_1.ParserState.Scheme:
                /**
                 * 1. If c is an ASCII alphanumeric, U+002B (+), U+002D (-), or U+002E
                 * (.), append c, lowercased, to buffer.
                 */
                if (infra_1.codePoint.ASCIIAlphanumeric.test(walker.c()) ||
                    walker.c() === '+' || walker.c() === '-' || walker.c() === '.') {
                    buffer += walker.c().toLowerCase();
                }
                else if (walker.c() === ':') {
                    /**
                     * 2. Otherwise, if c is U+003A (:), then:
                     * 2.1. If state override is given, then:
                     * 2.1.1. If url’s scheme is a special scheme and buffer is not a
                     * special scheme, then return.
                     * 2.1.2. If url’s scheme is not a special scheme and buffer is a
                     * special scheme, then return.
                     * 2.1.3. If url includes credentials or has a non-null port, and
                     * buffer is "file", then return.
                     * 2.1.4. If url’s scheme is "file" and its host is an empty host or
                     * null, then return.
                     */
                    if (stateOverride !== undefined) {
                        if (isSpecialScheme(url.scheme) && !isSpecialScheme(buffer))
                            return url;
                        if (!isSpecialScheme(url.scheme) && isSpecialScheme(buffer))
                            return url;
                        if ((includesCredentials(url) || url.port !== null) && buffer === "file")
                            return url;
                        if (url.scheme === "file" && (url.host === "" || url.host === null))
                            return url;
                    }
                    /**
                     * 2.2. Set url’s scheme to buffer.
                     */
                    url.scheme = buffer;
                    /**
                     * 2.3. If state override is given, then:
                     * 2.3.1. If url’s port is url’s scheme’s default port, then set
                     * url’s port to null.
                     * 2.3.2. Return.
                     */
                    if (stateOverride !== undefined) {
                        if (url.port === defaultPort(url.scheme)) {
                            url.port = null;
                        }
                        return url;
                    }
                    /**
                     * 2.4. Set buffer to the empty string.
                     */
                    buffer = "";
                    if (url.scheme === "file") {
                        /**
                         * 2.5. If url’s scheme is "file", then:
                         * 2.5.1. If remaining does not start with "//", validation error.
                         * 2.5.2. Set state to file state.
                         */
                        if (!walker.remaining().startsWith("//")) {
                            validationError("Invalid file URL scheme, '//' expected.");
                        }
                        state = interfaces_1.ParserState.File;
                    }
                    else if (isSpecial(url) && baseURL !== null && baseURL.scheme === url.scheme) {
                        /**
                         * 2.6. Otherwise, if url is special, base is non-null, and base’s
                         * scheme is equal to url’s scheme, set state to special relative
                         * or authority state.
                         */
                        state = interfaces_1.ParserState.SpecialRelativeOrAuthority;
                    }
                    else if (isSpecial(url)) {
                        /**
                         * 2.7. Otherwise, if url is special, set state to special
                         * authority slashes state.
                         */
                        state = interfaces_1.ParserState.SpecialAuthoritySlashes;
                    }
                    else if (walker.remaining().startsWith("/")) {
                        /**
                         * 2.8. Otherwise, if remaining starts with an U+002F (/), set state
                         * to path or authority state and increase pointer by one.
                         */
                        state = interfaces_1.ParserState.PathOrAuthority;
                        walker.pointer++;
                    }
                    else {
                        /**
                         * 2.9. Otherwise, set url’s cannot-be-a-base-URL flag, append an
                         * empty string to url’s path, and set state to
                         * cannot-be-a-base-URL path state.
                         */
                        url._cannotBeABaseURLFlag = true;
                        url.path.push("");
                        state = interfaces_1.ParserState.CannotBeABaseURLPath;
                    }
                }
                else if (stateOverride === undefined) {
                    /**
                     * 3. Otherwise, if state override is not given, set buffer to the
                     * empty string, state to no scheme state, and start over (from the
                     * first code point in input).
                     */
                    buffer = "";
                    state = interfaces_1.ParserState.NoScheme;
                    walker.pointer = 0;
                    continue;
                }
                else {
                    /**
                     * 4. Otherwise, validation error, return failure.
                     */
                    validationError("Invalid input string.");
                    return null;
                }
                break;
            case interfaces_1.ParserState.NoScheme:
                /**
                 * 1. If base is null, or base’s cannot-be-a-base-URL flag is set
                 * and c is not U+0023 (#), validation error, return failure.
                 * 2. Otherwise, if base’s cannot-be-a-base-URL flag is set and
                 * c is U+0023 (#), set url’s scheme to base’s scheme, url’s path to
                 * a copy of base’s path, url’s query to base’s query, url’s
                 * fragment to the empty string, set url’s cannot-be-a-base-URL
                 * flag, and set state to fragment state.
                 * 3. Otherwise, if base’s scheme is not "file", set state to
                 * relative state and decrease pointer by one.
                 * 4. Otherwise, set state to file state and decrease pointer by one.
                 */
                if (baseURL === null || (baseURL._cannotBeABaseURLFlag && walker.c() !== '#')) {
                    validationError("Invalid input string.");
                    return null;
                }
                else if (baseURL._cannotBeABaseURLFlag && walker.c() === '#') {
                    url.scheme = baseURL.scheme;
                    url.path = infra_1.list.clone(baseURL.path);
                    url.query = baseURL.query;
                    url.fragment = "";
                    url._cannotBeABaseURLFlag = true;
                    state = interfaces_1.ParserState.Fragment;
                }
                else if (baseURL.scheme !== "file") {
                    state = interfaces_1.ParserState.Relative;
                    walker.pointer--;
                }
                else {
                    state = interfaces_1.ParserState.File;
                    walker.pointer--;
                }
                break;
            case interfaces_1.ParserState.SpecialRelativeOrAuthority:
                /**
                 * If c is U+002F (/) and remaining starts with U+002F (/), then set
                 * state to special authority ignore slashes state and increase
                 * pointer by one.
                 * Otherwise, validation error, set state to relative state and
                 * decrease pointer by one.
                 */
                if (walker.c() === '/' && walker.remaining().startsWith('/')) {
                    state = interfaces_1.ParserState.SpecialAuthorityIgnoreSlashes;
                    walker.pointer++;
                }
                else {
                    validationError("Invalid input string.");
                    state = interfaces_1.ParserState.Relative;
                    walker.pointer--;
                }
                break;
            case interfaces_1.ParserState.PathOrAuthority:
                /**
                 * If c is U+002F (/), then set state to authority state.
                 * Otherwise, set state to path state, and decrease pointer by one.
                 */
                if (walker.c() === '/') {
                    state = interfaces_1.ParserState.Authority;
                }
                else {
                    state = interfaces_1.ParserState.Path;
                    walker.pointer--;
                }
                break;
            case interfaces_1.ParserState.Relative:
                /**
                 * Set url’s scheme to base’s scheme, and then, switching on c:
                 */
                if (baseURL === null) {
                    throw new Error("Invalid parser state. Base URL is null.");
                }
                url.scheme = baseURL.scheme;
                switch (walker.c()) {
                    case EOF: // EOF
                        /**
                         * Set url’s username to base’s username, url’s password to base’s
                         * password, url’s host to base’s host, url’s port to base’s port,
                         * url’s path to a copy of base’s path, and url’s query to base’s
                         * query.
                         */
                        url.username = baseURL.username;
                        url.password = baseURL.password;
                        url.host = baseURL.host;
                        url.port = baseURL.port;
                        url.path = infra_1.list.clone(baseURL.path);
                        url.query = baseURL.query;
                        break;
                    case '/':
                        /**
                         * Set state to relative slash state.
                         */
                        state = interfaces_1.ParserState.RelativeSlash;
                        break;
                    case '?':
                        /**
                         * Set url’s username to base’s username, url’s password to base’s
                         * password, url’s host to base’s host, url’s port to base’s port,
                         * url’s path to a copy of base’s path, url’s query to the empty
                         * string, and state to query state.
                         */
                        url.username = baseURL.username;
                        url.password = baseURL.password;
                        url.host = baseURL.host;
                        url.port = baseURL.port;
                        url.path = infra_1.list.clone(baseURL.path);
                        url.query = "";
                        state = interfaces_1.ParserState.Query;
                        break;
                    case '#':
                        /**
                         * Set url’s username to base’s username, url’s password to base’s
                         * password, url’s host to base’s host, url’s port to base’s port,
                         * url’s path to a copy of base’s path, url’s query to base’s
                         * query, url’s fragment to the empty string, and state to
                         * fragment state.
                         */
                        url.username = baseURL.username;
                        url.password = baseURL.password;
                        url.host = baseURL.host;
                        url.port = baseURL.port;
                        url.path = infra_1.list.clone(baseURL.path);
                        url.query = baseURL.query;
                        url.fragment = "";
                        state = interfaces_1.ParserState.Fragment;
                        break;
                    default:
                        /**
                         * If url is special and c is U+005C (\), validation error,
                         * set state to relative slash state.
                         * Otherwise, run these steps:
                         * 1. Set url’s username to base’s username, url’s password to
                         * base’s password, url’s host to base’s host, url’s port to
                         * base’s port, url’s path to a copy of base’s path, and then
                         * remove url’s path’s last item, if any.
                         * 2. Set state to path state, and decrease pointer by one.
                         */
                        if (isSpecial(url) && walker.c() === '\\') {
                            validationError("Invalid input string.");
                            state = interfaces_1.ParserState.RelativeSlash;
                        }
                        else {
                            url.username = baseURL.username;
                            url.password = baseURL.password;
                            url.host = baseURL.host;
                            url.port = baseURL.port;
                            url.path = infra_1.list.clone(baseURL.path);
                            if (url.path.length !== 0)
                                url.path.splice(url.path.length - 1, 1);
                            state = interfaces_1.ParserState.Path;
                            walker.pointer--;
                        }
                        break;
                }
                break;
            case interfaces_1.ParserState.RelativeSlash:
                /**
                 * 1. If url is special and c is U+002F (/) or U+005C (\), then:
                 * 1.1. If c is U+005C (\), validation error.
                 * 1.2. Set state to special authority ignore slashes state.
                 * 2. Otherwise, if c is U+002F (/), then set state to authority state.
                 * 3. Otherwise, set url’s username to base’s username, url’s password
                 * to base’s password, url’s host to base’s host, url’s port to base’s
                 * port, state to path state, and then, decrease pointer by one.
                 */
                if (isSpecial(url) && (walker.c() === '/' || walker.c() === '\\')) {
                    if (walker.c() === '\\') {
                        validationError("Invalid input string.");
                    }
                    state = interfaces_1.ParserState.SpecialAuthorityIgnoreSlashes;
                }
                else if (walker.c() === '/') {
                    state = interfaces_1.ParserState.Authority;
                }
                else {
                    if (baseURL === null) {
                        throw new Error("Invalid parser state. Base URL is null.");
                    }
                    url.username = baseURL.username;
                    url.password = baseURL.password;
                    url.host = baseURL.host;
                    url.port = baseURL.port;
                    state = interfaces_1.ParserState.Path;
                    walker.pointer--;
                }
                break;
            case interfaces_1.ParserState.SpecialAuthoritySlashes:
                /**
                 * If c is U+002F (/) and remaining starts with U+002F (/), then set
                 * state to special authority ignore slashes state and increase
                 * pointer by one.
                 * Otherwise, validation error, set state to special authority ignore
                 * slashes state, and decrease pointer by one.
                 */
                if (walker.c() === '/' && walker.remaining().startsWith('/')) {
                    state = interfaces_1.ParserState.SpecialAuthorityIgnoreSlashes;
                    walker.pointer++;
                }
                else {
                    validationError("Expected '//'.");
                    state = interfaces_1.ParserState.SpecialAuthorityIgnoreSlashes;
                    walker.pointer--;
                }
                break;
            case interfaces_1.ParserState.SpecialAuthorityIgnoreSlashes:
                /**
                 * If c is neither U+002F (/) nor U+005C (\), then set state to
                 * authority state and decrease pointer by one.
                 * Otherwise, validation error.
                 */
                if (walker.c() !== '/' && walker.c() !== '\\') {
                    state = interfaces_1.ParserState.Authority;
                    walker.pointer--;
                }
                else {
                    validationError("Unexpected '/' or '\\'.");
                }
                break;
            case interfaces_1.ParserState.Authority:
                /**
                 * 1. If c is U+0040 (@), then:
                 */
                if (walker.c() === '@') {
                    /**
                     * 1.1. Validation error.
                     * 1.2. If the @ flag is set, prepend "%40" to buffer.
                     * 1.3. Set the @ flag.
                     * 1.4. For each codePoint in buffer:
                     */
                    validationError("Unexpected '@'.");
                    if (atFlag)
                        buffer = '%40' + buffer;
                    atFlag = true;
                    try {
                        for (var buffer_1 = (e_2 = void 0, __values(buffer)), buffer_1_1 = buffer_1.next(); !buffer_1_1.done; buffer_1_1 = buffer_1.next()) {
                            var codePoint = buffer_1_1.value;
                            /**
                             * 1.4.1. If codePoint is U+003A (:) and passwordTokenSeenFlag is
                             * unset, then set passwordTokenSeenFlag and continue.
                             * 1.4.2. Let encodedCodePoints be the result of running UTF-8
                             * percent encode codePoint using the userinfo percent-encode set.
                             * 1.4.3. If passwordTokenSeenFlag is set, then append
                             * encodedCodePoints to url’s password.
                             * 1.4.4. Otherwise, append encodedCodePoints to url’s username.
                             */
                            if (codePoint === ':' && !passwordTokenSeenFlag) {
                                passwordTokenSeenFlag = true;
                                continue;
                            }
                            var encodedCodePoints = utf8PercentEncode(codePoint, _userInfoPercentEncodeSet);
                            if (passwordTokenSeenFlag) {
                                url.password += encodedCodePoints;
                            }
                            else {
                                url.username += encodedCodePoints;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (buffer_1_1 && !buffer_1_1.done && (_a = buffer_1.return)) _a.call(buffer_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    /**
                     * 1.5. Set buffer to the empty string.
                     */
                    buffer = "";
                }
                else if (walker.c() === EOF || walker.c() === '/' || walker.c() === '?' || walker.c() === '#' ||
                    (isSpecial(url) && walker.c() === '\\')) {
                    /**
                     * 2. Otherwise, if one of the following is true
                     * - c is the EOF code point, U+002F (/), U+003F (?), or U+0023 (#)
                     * - url is special and c is U+005C (\)
                     * then:
                     * 2.1. If @ flag is set and buffer is the empty string, validation
                     * error, return failure.
                     * 2.2. Decrease pointer by the number of code points in buffer plus
                     * one, set buffer to the empty string, and set state to host state.
                     */
                    if (atFlag && buffer === "") {
                        validationError("Invalid input string.");
                        return null;
                    }
                    walker.pointer -= (buffer.length + 1);
                    buffer = "";
                    state = interfaces_1.ParserState.Host;
                }
                else {
                    /**
                     * 3. Otherwise, append c to buffer.
                     */
                    buffer += walker.c();
                }
                break;
            case interfaces_1.ParserState.Host:
            case interfaces_1.ParserState.Hostname:
                if (stateOverride !== undefined && url.scheme === "file") {
                    /**
                     * 1. If state override is given and url’s scheme is "file", then
                     * decrease pointer by one and set state to file host state.
                     */
                    walker.pointer--;
                    state = interfaces_1.ParserState.FileHost;
                }
                else if (walker.c() === ':' && !arrayFlag) {
                    /**
                     * 2. Otherwise, if c is U+003A (:) and the [] flag is unset, then:
                     * 2.1. If buffer is the empty string, validation error, return
                     * failure.
                     * 2.2. Let host be the result of host parsing buffer with url is
                     * not special.
                     * 2.3. If host is failure, then return failure.
                     * 2.4. Set url’s host to host, buffer to the empty string, and
                     * state to port state.
                     * 2.5. If state override is given and state override is hostname
                     * state, then return.
                     */
                    if (buffer === "") {
                        validationError("Invalid input string.");
                        return null;
                    }
                    var host = hostParser(buffer, !isSpecial(url));
                    if (host === null)
                        return null;
                    url.host = host;
                    buffer = "";
                    state = interfaces_1.ParserState.Port;
                    if (stateOverride === interfaces_1.ParserState.Hostname)
                        return url;
                }
                else if (walker.c() === EOF || walker.c() === '/' || walker.c() === '?' || walker.c() === '#' ||
                    (isSpecial(url) && walker.c() === '\\')) {
                    /**
                     * 3. Otherwise, if one of the following is true
                     * - c is the EOF code point, U+002F (/), U+003F (?), or U+0023 (#)
                     * - url is special and c is U+005C (\)
                     * then decrease pointer by one, and then:
                     * 3.1. If url is special and buffer is the empty string, validation
                     * error, return failure.
                     * 3.2. Otherwise, if state override is given, buffer is the empty
                     * string, and either url includes credentials or url’s port is
                     * non-null, validation error, return.
                     * 3.3. Let host be the result of host parsing buffer with url is
                     * not special.
                     * 3.4. If host is failure, then return failure.
                     * 3.5. Set url’s host to host, buffer to the empty string, and
                     * state to path start state.
                     * 3.6. If state override is given, then return.
                     */
                    walker.pointer--;
                    if (isSpecial(url) && buffer === "") {
                        validationError("Invalid input string.");
                        return null;
                    }
                    else if (stateOverride !== undefined && buffer === "" &&
                        (includesCredentials(url) || url.port !== null)) {
                        validationError("Invalid input string.");
                        return url;
                    }
                    var host = hostParser(buffer, !isSpecial(url));
                    if (host === null)
                        return null;
                    url.host = host;
                    buffer = "";
                    state = interfaces_1.ParserState.PathStart;
                    if (stateOverride !== undefined)
                        return url;
                }
                else {
                    /**
                     * 4. Otherwise:
                     * 4.1. If c is U+005B ([), then set the [] flag.
                     * 4.2. If c is U+005D (]), then unset the [] flag.
                     * 4.3. Append c to buffer.
                     */
                    if (walker.c() === '[')
                        arrayFlag = true;
                    if (walker.c() === ']')
                        arrayFlag = false;
                    buffer += walker.c();
                }
                break;
            case interfaces_1.ParserState.Port:
                if (infra_1.codePoint.ASCIIDigit.test(walker.c())) {
                    /**
                     * 1. If c is an ASCII digit, append c to buffer.
                     */
                    buffer += walker.c();
                }
                else if (walker.c() === EOF || walker.c() === '/' || walker.c() === '?' || walker.c() === '#' ||
                    (isSpecial(url) && walker.c() === '\\') || stateOverride) {
                    /**
                     * 2. Otherwise, if one of the following is true
                     * - c is the EOF code point, U+002F (/), U+003F (?), or U+0023 (#)
                     * - url is special and c is U+005C (\)
                     * - state override is given
                     * then:
                     */
                    if (buffer !== "") {
                        /**
                         * 2.1. If buffer is not the empty string, then:
                         * 2.1.1. Let port be the mathematical integer value that is
                         * represented by buffer in radix-10 using ASCII digits for digits
                         * with values 0 through 9.
                         * 2.1.2. If port is greater than 2**16 − 1, validation error,
                         * return failure.
                         * 2.1.3. Set url’s port to null, if port is url’s scheme’s default
                         * port, and to port otherwise.
                         * 2.1.4. Set buffer to the empty string.
                         */
                        if (buffer !== "") {
                            var port = parseInt(buffer, 10);
                            if (port > Math.pow(2, 16) - 1) {
                                validationError("Invalid port number.");
                                return null;
                            }
                            url.port = (port === defaultPort(url.scheme) ? null : port);
                            buffer = "";
                        }
                    }
                    /**
                     * 2.2. If state override is given, then return.
                     * 2.3. Set state to path start state, and decrease pointer by one.
                     */
                    if (stateOverride !== undefined) {
                        return url;
                    }
                    state = interfaces_1.ParserState.PathStart;
                    walker.pointer--;
                }
                else {
                    /**
                     * 3. Otherwise, validation error, return failure.
                     */
                    validationError("Invalid input string.");
                    return null;
                }
                break;
            case interfaces_1.ParserState.File:
                /**
                 * 1. Set url’s scheme to "file".
                 */
                url.scheme = "file";
                if (walker.c() === '/' || walker.c() === '\\') {
                    /**
                     * 2. If c is U+002F (/) or U+005C (\), then:
                     * 2.1. If c is U+005C (\), validation error.
                     * 2.2. Set state to file slash state.
                     */
                    if (walker.c() === '\\') {
                        validationError("Invalid input string.");
                    }
                    state = interfaces_1.ParserState.FileSlash;
                }
                else if (baseURL !== null && baseURL.scheme === "file") {
                    /**
                     * 3. Otherwise, if base is non-null and base’s scheme is "file",
                     * switch on c:
                     */
                    switch (walker.c()) {
                        case EOF:
                            /**
                             * Set url’s host to base’s host, url’s path to a copy of base’s
                             * path, and url’s query to base’s query.
                             */
                            url.host = baseURL.host;
                            url.path = infra_1.list.clone(baseURL.path);
                            url.query = baseURL.query;
                            break;
                        case '?':
                            /**
                             * Set url’s host to base’s host, url’s path to a copy of base’s
                             * path, url’s query to the empty string, and state to query
                             * state.
                             */
                            url.host = baseURL.host;
                            url.path = infra_1.list.clone(baseURL.path);
                            url.query = "";
                            state = interfaces_1.ParserState.Query;
                            break;
                        case '#':
                            /**
                             * Set url’s host to base’s host, url’s path to a copy of base’s
                             * path, url’s query to base’s query, url’s fragment to the
                             * empty string, and state to fragment state.
                             */
                            url.host = baseURL.host;
                            url.path = infra_1.list.clone(baseURL.path);
                            url.query = baseURL.query;
                            url.fragment = "";
                            state = interfaces_1.ParserState.Fragment;
                            break;
                        default:
                            /**
                             * 1. If the substring from pointer in input does not start
                             * with a Windows drive letter, then set url’s host to base’s
                             * host, url’s path to a copy of base’s path, and then shorten
                             * url’s path.
                             * _Note:_ is a (platform-independent) Windows drive letter
                             * quirk.
                             * 2. Otherwise, validation error.
                             * 3. Set state to path state, and decrease pointer by one.
                             */
                            if (!startsWithAWindowsDriveLetter(walker.substring())) {
                                url.host = baseURL.host;
                                url.path = infra_1.list.clone(baseURL.path);
                                shorten(url);
                            }
                            else {
                                validationError("Unexpected windows drive letter in input string.");
                            }
                            state = interfaces_1.ParserState.Path;
                            walker.pointer--;
                            break;
                    }
                }
                else {
                    /**
                     * 4. Otherwise, set state to path state, and decrease pointer by
                     * one.
                     */
                    state = interfaces_1.ParserState.Path;
                    walker.pointer--;
                }
                break;
            case interfaces_1.ParserState.FileSlash:
                if (walker.c() === '/' || walker.c() === '\\') {
                    /**
                     * 1. If c is U+002F (/) or U+005C (\), then:
                     * 1.1. If c is U+005C (\), validation error.
                     * 1.2. Set state to file host state.
                     */
                    if (walker.c() === '\\') {
                        validationError("Invalid input string.");
                    }
                    state = interfaces_1.ParserState.FileHost;
                }
                else {
                    /**
                     * 2. Otherwise:
                     * 2.1. If base is non-null, base’s scheme is "file", and the
                     * substring from pointer in input does not start with a Windows
                     * drive letter, then:
                     * 2.1.1. If base’s path[0] is a normalized Windows drive letter,
                     * then append base’s path[0] to url’s path.
                     * _Note:_ is a (platform-independent) Windows drive letter
                     * quirk. Both url’s and base’s host are null under these conditions
                     * and therefore not copied.
                     * 2.1.2. Otherwise, set url’s host to base’s host.
                     * 2.2. Set state to path state, and decrease pointer by one.
                     */
                    if (baseURL !== null && baseURL.scheme === "file" &&
                        !startsWithAWindowsDriveLetter(walker.substring())) {
                        if (isNormalizedWindowsDriveLetter(baseURL.path[0])) {
                            url.path.push(baseURL.path[0]);
                        }
                        else {
                            url.host = baseURL.host;
                        }
                    }
                    state = interfaces_1.ParserState.Path;
                    walker.pointer--;
                }
                break;
            case interfaces_1.ParserState.FileHost:
                if (walker.c() === EOF || walker.c() === '/' || walker.c() === '\\' ||
                    walker.c() === '?' || walker.c() === '#') {
                    /**
                     * 1. If c is the EOF code point, U+002F (/), U+005C (\), U+003F (?),
                     * or U+0023 (#), then decrease pointer by one and then:
                     */
                    walker.pointer--;
                    if (stateOverride === undefined && isWindowsDriveLetter(buffer)) {
                        /**
                         * 1.1. If state override is not given and buffer is a Windows drive
                         * letter, validation error, set state to path state.
                         * _Note:_ is a (platform-independent) Windows drive letter
                         * quirk. buffer is not reset here and instead used in the path state.
                         */
                        validationError("Unexpected windows drive letter in input string.");
                        state = interfaces_1.ParserState.Path;
                    }
                    else if (buffer === "") {
                        /**
                         * 1.2. Otherwise, if buffer is the empty string, then:
                         * 1.2.1. Set url’s host to the empty string.
                         * 1.2.2. If state override is given, then return.
                         * 1.2.3. Set state to path start state.
                         */
                        url.host = "";
                        if (stateOverride !== undefined)
                            return url;
                        state = interfaces_1.ParserState.PathStart;
                    }
                    else {
                        /**
                         * 1.3. Otherwise, run these steps:
                         * 1.3.1. Let host be the result of host parsing buffer with url
                         * is not special.
                         * 1.3.2. If host is failure, then return failure.
                         * 1.3.3. If host is "localhost", then set host to the empty
                         * string.
                         * 1.3.4. Set url’s host to host.
                         * 1.3.5. If state override is given, then return.
                         * 1.3.6. Set buffer to the empty string and state to path start
                         * state.
                         */
                        var host = hostParser(buffer, !isSpecial(url));
                        if (host === null)
                            return null;
                        if (host === "localhost")
                            host = "";
                        url.host = host;
                        if (stateOverride !== undefined)
                            return url;
                        buffer = "";
                        state = interfaces_1.ParserState.PathStart;
                    }
                }
                else {
                    /**
                     * 2. Otherwise, append c to buffer.
                     */
                    buffer += walker.c();
                }
                break;
            case interfaces_1.ParserState.PathStart:
                if (isSpecial(url)) {
                    /**
                     * 1. If url is special, then:
                     * 1.1. If c is U+005C (\), validation error.
                     * 1.2. Set state to path state.
                     * 1.3. If c is neither U+002F (/) nor U+005C (\), then decrease
                     * pointer by one.
                     */
                    if (walker.c() === '\\') {
                        validationError("Invalid input string.");
                    }
                    state = interfaces_1.ParserState.Path;
                    if (walker.c() !== '/' && walker.c() !== '\\')
                        walker.pointer--;
                }
                else if (stateOverride === undefined && walker.c() === '?') {
                    /**
                     * 2. Otherwise, if state override is not given and c is U+003F (?),
                     * set url’s query to the empty string and state to query state.
                     */
                    url.query = "";
                    state = interfaces_1.ParserState.Query;
                }
                else if (stateOverride === undefined && walker.c() === '#') {
                    /**
                     * 3. Otherwise, if state override is not given and c is U+0023 (#),
                     * set url’s fragment to the empty string and state to fragment
                     * state.
                     */
                    url.fragment = "";
                    state = interfaces_1.ParserState.Fragment;
                }
                else if (walker.c() !== EOF) {
                    /**
                     * 4. Otherwise, if c is not the EOF code point:
                     * 4.1. Set state to path state.
                     * 4.2. If c is not U+002F (/), then decrease pointer by one.
                     */
                    state = interfaces_1.ParserState.Path;
                    if (walker.c() !== '/')
                        walker.pointer--;
                }
                break;
            case interfaces_1.ParserState.Path:
                if ((walker.c() === EOF || walker.c() === '/') ||
                    (isSpecial(url) && walker.c() === '\\') ||
                    (stateOverride === undefined && (walker.c() === '?' || walker.c() === '#'))) {
                    /**
                     * 1. If one of the following is true
                     * - c is the EOF code point or U+002F (/)
                     * - url is special and c is U+005C (\)
                     * - state override is not given and c is U+003F (?) or U+0023 (#)
                     * then:
                     */
                    if (isSpecial(url) && walker.c() === '\\') {
                        /**
                         * 1.1 If url is special and c is U+005C (\), validation error.
                         */
                        validationError("Invalid input string.");
                    }
                    if (isDoubleDotPathSegment(buffer)) {
                        /**
                         * 1.2. If buffer is a double-dot path segment, shorten url’s path,
                         * and then if neither c is U+002F (/), nor url is special and c is
                         * U+005C (\), append the empty string to url’s path.
                         */
                        shorten(url);
                        if (walker.c() !== '/' && !(isSpecial(url) && walker.c() === '\\')) {
                            url.path.push("");
                        }
                    }
                    else if (isSingleDotPathSegment(buffer) && walker.c() !== '/' &&
                        !(isSpecial(url) && walker.c() === '\\')) {
                        /**
                         * 1.3. Otherwise, if buffer is a single-dot path segment and if
                         * neither c is U+002F (/), nor url is special and c is U+005C (\),
                         * append the empty string to url’s path.
                         */
                        url.path.push("");
                    }
                    else if (!isSingleDotPathSegment(buffer)) {
                        /**
                         * 1.4. Otherwise, if buffer is not a single-dot path segment, then:
                         */
                        if (url.scheme === "file" && url.path.length === 0 &&
                            isWindowsDriveLetter(buffer)) {
                            /**
                             * 1.4.1. If url’s scheme is "file", url’s path is empty, and
                             * buffer is a Windows drive letter, then:
                             * 1.4.1.1. If url’s host is neither the empty string nor null,
                             * validation error, set url’s host to the empty string.
                             * 1.4.1.2. Replace the second code point in buffer with U+003A (:).
                             * _Note:_ is a (platform-independent) Windows drive letter quirk.
                             */
                            if (url.host !== null && url.host !== "") {
                                validationError("Invalid input string.");
                                url.host = "";
                            }
                            var bufferCodePoints = Array.from(buffer);
                            buffer = bufferCodePoints.slice(0, 1) + ':' + bufferCodePoints.slice(2);
                        }
                        /**
                         * 1.4.2. Append buffer to url’s path.
                         */
                        url.path.push(buffer);
                    }
                    /**
                     * 1.5. Set buffer to the empty string.
                     */
                    buffer = "";
                    /**
                     * 1.6. If url’s scheme is "file" and c is the EOF code point,
                     * U+003F (?), or U+0023 (#), then while url’s path’s size is
                     * greater than 1 and url’s path[0] is the empty string, validation
                     * error, remove the first item from url’s path.
                     */
                    if (url.scheme === "file" && (walker.c() === EOF || walker.c() === '?' || walker.c() === '#')) {
                        while (url.path.length > 1 && url.path[0] === "") {
                            validationError("Invalid input string.");
                            url.path.splice(0, 1);
                        }
                    }
                    /**
                     * 1.7. If c is U+003F (?), then set url’s query to the empty string
                     * and state to query state.
                     * 1.8. If c is U+0023 (#), then set url’s fragment to the empty
                     * string and state to fragment state.
                     */
                    if (walker.c() === '?') {
                        url.query = "";
                        state = interfaces_1.ParserState.Query;
                    }
                    if (walker.c() === '#') {
                        url.fragment = "";
                        state = interfaces_1.ParserState.Fragment;
                    }
                }
                else {
                    /**
                     * 2. Otherwise, run these steps:
                     * 2.1. If c is not a URL code point and not U+0025 (%), validation
                     * error.
                     * 2.2. If c is U+0025 (%) and remaining does not start with two
                     * ASCII hex digits, validation error.
                     * 2.3. UTF-8 percent encode c using the path percent-encode set,
                     * and append the result to buffer.
                     */
                    if (!_urlCodePoints.test(walker.c()) && walker.c() !== '%') {
                        validationError("Character is not a URL code point or a percent encoded character.");
                    }
                    if (walker.c() === '%' && !/^[0-9a-fA-F][0-9a-fA-F]/.test(walker.remaining())) {
                        validationError("Percent encoded character must be followed by two hex digits.");
                    }
                    buffer += utf8PercentEncode(walker.c(), _pathPercentEncodeSet);
                }
                break;
            case interfaces_1.ParserState.CannotBeABaseURLPath:
                /**
                 * 1. If c is U+003F (?), then set url’s query to the empty string and
                 * state to query state.
                 * 2. Otherwise, if c is U+0023 (#), then set url’s fragment to the
                 * empty string and state to fragment state.
                 * 3. Otherwise:
                 * 3.1. If c is not the EOF code point, not a URL code point, and not
                 * U+0025 (%), validation error.
                 * 3.2. If c is U+0025 (%) and remaining does not start with two ASCII
                 * hex digits, validation error.
                 * 3.3. If c is not the EOF code point, UTF-8 percent encode c using
                 * the C0 control percent-encode set, and append the result to url’s
                 * path[0].
                 */
                if (walker.c() === '?') {
                    url.query = "";
                    state = interfaces_1.ParserState.Query;
                }
                else if (walker.c() === '#') {
                    url.fragment = "";
                    state = interfaces_1.ParserState.Fragment;
                }
                else {
                    if (walker.c() !== EOF && !_urlCodePoints.test(walker.c()) && walker.c() !== '%') {
                        validationError("Character is not a URL code point or a percent encoded character.");
                    }
                    if (walker.c() === '%' && !/^[0-9a-fA-F][0-9a-fA-F]/.test(walker.remaining())) {
                        validationError("Percent encoded character must be followed by two hex digits.");
                    }
                    if (walker.c() !== EOF) {
                        url.path[0] += utf8PercentEncode(walker.c(), _c0ControlPercentEncodeSet);
                    }
                }
                break;
            case interfaces_1.ParserState.Query:
                /**
                 * 1. If encoding is not UTF-8 and one of the following is true
                 * - url is not special
                 * - url’s scheme is "ws" or "wss"
                 * then set encoding to UTF-8.
                 */
                if (encoding !== "UTF-8" && (!isSpecial(url) ||
                    url.scheme === "ws" || url.scheme === "wss")) {
                    encoding = "UTF-8";
                }
                if (stateOverride === undefined && walker.c() === '#') {
                    /**
                     * 2. If state override is not given and c is U+0023 (#), then set
                     * url’s fragment to the empty string and state to fragment state.
                     */
                    url.fragment = "";
                    state = interfaces_1.ParserState.Fragment;
                }
                else if (walker.c() !== EOF) {
                    /**
                     * 3. Otherwise, if c is not the EOF code point:
                     * 3.1. If c is not a URL code point and not U+0025 (%), validation
                     * error.
                     */
                    if (!_urlCodePoints.test(walker.c()) && walker.c() !== '%') {
                        validationError("Character is not a URL code point or a percent encoded character.");
                    }
                    /**
                     * 3.2. If c is U+0025 (%) and remaining does not start with two
                     * ASCII hex digits, validation error.
                     */
                    if (walker.c() === '%' && !/^[0-9a-fA-F][0-9a-fA-F]/.test(walker.remaining())) {
                        validationError("Percent encoded character must be followed by two hex digits.");
                    }
                    /**
                     * 3.3. Let bytes be the result of encoding c using encoding.
                     */
                    if (encoding.toUpperCase() !== "UTF-8") {
                        throw new Error("Only UTF-8 encoding is supported.");
                    }
                    var bytes = util_1.utf8Encode(walker.c());
                    /**
                     * 3.4. If bytes starts with `&#` and ends with 0x3B (;), then:
                     */
                    if (bytes.length >= 3 && bytes[0] === 38 && bytes[1] === 35 &&
                        bytes[bytes.length - 1] === 59) {
                        /**
                         * 3.4.1. Replace `&#` at the start of bytes with `%26%23`.
                         * 3.4.2. Replace 0x3B (;) at the end of bytes with `%3B`.
                         * 3.4.4. Append bytes, isomorphic decoded, to url’s query.
                         * _Note:_ can happen when encoding code points using a
                         * non-UTF-8 encoding.
                         */
                        bytes = bytes.subarray(2, bytes.length - 1);
                        url.query += "%26%23" + infra_1.byteSequence.isomorphicDecode(bytes) + "%3B";
                    }
                    else {
                        try {
                            /**
                             * 3.5. Otherwise, for each byte in bytes:
                             * 3.5.1. If one of the following is true
                             * - byte is less than 0x21 (!)
                             * - byte is greater than 0x7E (~)
                             * - byte is 0x22 ("), 0x23 (#), 0x3C (<), or 0x3E (>)
                             * - byte is 0x27 (') and url is special
                             * then append byte, percent encoded, to url’s query.
                             * 3.5.2. Otherwise, append a code point whose value is byte to
                             * url’s query.
                             */
                            for (var bytes_1 = (e_3 = void 0, __values(bytes)), bytes_1_1 = bytes_1.next(); !bytes_1_1.done; bytes_1_1 = bytes_1.next()) {
                                var byte = bytes_1_1.value;
                                if (byte < 0x21 || byte > 0x7E || byte === 0x22 ||
                                    byte === 0x23 || byte === 0x3C || byte === 0x3E ||
                                    (byte === 0x27 && isSpecial(url))) {
                                    url.query += percentEncode(byte);
                                }
                                else {
                                    url.query += String.fromCharCode(byte);
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (bytes_1_1 && !bytes_1_1.done && (_b = bytes_1.return)) _b.call(bytes_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
                break;
            case interfaces_1.ParserState.Fragment:
                /**
                 * Switching on c:
                 * - The EOF code point
                 * Do nothing.
                 * - U+0000 NULL
                 * Validation error.
                 * - Otherwise
                 * 1. If c is not a URL code point and not U+0025 (%), validation
                 * error.
                 * 2. If c is U+0025 (%) and remaining does not start with two ASCII
                 * hex digits, validation error.
                 * 3. UTF-8 percent encode c using the fragment percent-encode set and
                 * append the result to url’s fragment.
                 */
                if (walker.c() === EOF) {
                    //
                }
                else if (walker.c() === "\u0000") {
                    validationError("NULL character in input string.");
                }
                else {
                    if (!_urlCodePoints.test(walker.c()) && walker.c() !== '%') {
                        validationError("Unexpected character in fragment string.");
                    }
                    if (walker.c() === '%' && !/^[A-Za-z0-9][A-Za-z0-9]/.test(walker.remaining())) {
                        validationError("Unexpected character in fragment string.");
                    }
                    url.fragment += utf8PercentEncode(walker.c(), _fragmentPercentEncodeSet);
                }
                break;
        }
        if (walker.eof)
            break;
        else
            walker.pointer++;
    }
    /**
     * 12. Return url.
     */
    return url;
}
exports.basicURLParser = basicURLParser;
/**
 * Sets a URL's username.
 *
 * @param url - a URL
 * @param username - username string
 */
function setTheUsername(url, username) {
    var e_4, _a;
    /**
     * 1. Set url’s username to the empty string.
     * 2. For each code point in username, UTF-8 percent encode it using the
     * userinfo percent-encode set, and append the result to url’s username.
     */
    var result = "";
    try {
        for (var username_1 = __values(username), username_1_1 = username_1.next(); !username_1_1.done; username_1_1 = username_1.next()) {
            var codePoint = username_1_1.value;
            result += utf8PercentEncode(codePoint, _userInfoPercentEncodeSet);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (username_1_1 && !username_1_1.done && (_a = username_1.return)) _a.call(username_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    url.username = result;
}
exports.setTheUsername = setTheUsername;
/**
 * Sets a URL's password.
 *
 * @param url - a URL
 * @param username - password string
 */
function setThePassword(url, password) {
    var e_5, _a;
    /**
     * 1. Set url’s password to the empty string.
     * 2. For each code point in password, UTF-8 percent encode it using the
     * userinfo percent-encode set, and append the result to url’s password.
     */
    var result = "";
    try {
        for (var password_1 = __values(password), password_1_1 = password_1.next(); !password_1_1.done; password_1_1 = password_1.next()) {
            var codePoint = password_1_1.value;
            result += utf8PercentEncode(codePoint, _userInfoPercentEncodeSet);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (password_1_1 && !password_1_1.done && (_a = password_1.return)) _a.call(password_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    url.password = result;
}
exports.setThePassword = setThePassword;
/**
 * Determines if the string represents a single dot path.
 *
 * @param str - a string
 */
function isSingleDotPathSegment(str) {
    return str === '.' || str.toLowerCase() === "%2e";
}
exports.isSingleDotPathSegment = isSingleDotPathSegment;
/**
 * Determines if the string represents a double dot path.
 *
 * @param str - a string
 */
function isDoubleDotPathSegment(str) {
    var lowerStr = str.toLowerCase();
    return lowerStr === ".." || lowerStr === ".%2e" ||
        lowerStr === "%2e." || lowerStr === "%2e%2e";
}
exports.isDoubleDotPathSegment = isDoubleDotPathSegment;
/**
 * Shorten's URL's path.
 *
 * @param url - an URL
 */
function shorten(url) {
    /**
     * 1. Let path be url’s path.
     * 2. If path is empty, then return.
     * 3. If url’s scheme is "file", path’s size is 1, and path[0] is a
     * normalized Windows drive letter, then return.
     * 4. Remove path’s last item.
     */
    var path = url.path;
    if (path.length === 0)
        return;
    if (url.scheme === "file" && path.length === 1 &&
        isNormalizedWindowsDriveLetter(path[0]))
        return;
    url.path.splice(url.path.length - 1, 1);
}
exports.shorten = shorten;
/**
 * Determines if a string is a normalized Windows drive letter.
 *
 * @param str - a string
 */
function isNormalizedWindowsDriveLetter(str) {
    /**
     * A normalized Windows drive letter is a Windows drive letter of which the
     * second code point is U+003A (:).
     */
    return str.length >= 2 && infra_1.codePoint.ASCIIAlpha.test(str[0]) &&
        str[1] === ':';
}
exports.isNormalizedWindowsDriveLetter = isNormalizedWindowsDriveLetter;
/**
 * Determines if a string is a Windows drive letter.
 *
 * @param str - a string
 */
function isWindowsDriveLetter(str) {
    /**
     * A Windows drive letter is two code points, of which the first is an ASCII
     * alpha and the second is either U+003A (:) or U+007C (|).
     */
    return str.length >= 2 && infra_1.codePoint.ASCIIAlpha.test(str[0]) &&
        (str[1] === ':' || str[1] === '|');
}
exports.isWindowsDriveLetter = isWindowsDriveLetter;
/**
 * Determines if a string starts with a Windows drive letter.
 *
 * @param str - a string
 */
function startsWithAWindowsDriveLetter(str) {
    /**
     * A string starts with a Windows drive letter if all of the following are
     * true:
     * - its length is greater than or equal to 2
     * - its first two code points are a Windows drive letter
     * - its length is 2 or its third code point is U+002F (/), U+005C (\),
     * U+003F (?), or U+0023 (#).
     */
    return str.length >= 2 && isWindowsDriveLetter(str) &&
        (str.length === 2 || (str[2] === '/' || str[2] === '\\' ||
            str[2] === '?' || str[2] === '#'));
}
exports.startsWithAWindowsDriveLetter = startsWithAWindowsDriveLetter;
/**
 * Parses a host string.
 *
 * @param input - input string
 * @param isNotSpecial - `true` if the source URL is not special; otherwise
 * `false`.
 */
function hostParser(input, isNotSpecial) {
    if (isNotSpecial === void 0) { isNotSpecial = false; }
    /**
     * 1. If isNotSpecial is not given, then set isNotSpecial to false.
     * 2. If input starts with U+005B ([), then:
     * 2.1. If input does not end with U+005D (]), validation error, return
     * failure.
     * 2.2. Return the result of IPv6 parsing input with its leading U+005B ([)
     * and trailing U+005D (]) removed.
     */
    if (input.startsWith('[')) {
        if (!input.endsWith(']')) {
            validationError("Expected ']' after '['.");
            return null;
        }
        return iPv6Parser(input.substring(1, input.length - 1));
    }
    /**
     * 3. If isNotSpecial is true, then return the result of opaque-host parsing
     * input.
     */
    if (isNotSpecial) {
        return opaqueHostParser(input);
    }
    /**
     * 4. Let domain be the result of running UTF-8 decode without BOM on the
     * string percent decoding of input.
     * _Note:_ Alternatively UTF-8 decode without BOM or fail can be used,
     * coupled with an early return for failure, as domain to ASCII fails
     * on U+FFFD REPLACEMENT CHARACTER.
     */
    var domain = util_1.utf8Decode(stringPercentDecode(input));
    /**
     * 5. Let asciiDomain be the result of running domain to ASCII on domain.
     * 6. If asciiDomain is failure, validation error, return failure.
     * 7. If asciiDomain contains a forbidden host code point, validation error,
     * return failure.
     */
    var asciiDomain = domainToASCII(domain);
    if (asciiDomain === null) {
        validationError("Invalid domain.");
        return null;
    }
    if (_forbiddenHostCodePoint.test(asciiDomain)) {
        validationError("Invalid domain.");
        return null;
    }
    /**
     * 8. Let ipv4Host be the result of IPv4 parsing asciiDomain.
     * 9. If ipv4Host is an IPv4 address or failure, return ipv4Host.
     * 10. Return asciiDomain.
     */
    var ipv4Host = iPv4Parser(asciiDomain);
    if (ipv4Host === null || util_1.isNumber(ipv4Host))
        return ipv4Host;
    return asciiDomain;
}
exports.hostParser = hostParser;
/**
 * Parses a string containing an IP v4 address.
 *
 * @param input - input string
 * @param isNotSpecial - `true` if the source URL is not special; otherwise
 * `false`.
 */
function iPv4NumberParser(input, validationErrorFlag) {
    if (validationErrorFlag === void 0) { validationErrorFlag = { value: false }; }
    /**
     * 1. Let R be 10.
     */
    var R = 10;
    if (input.startsWith("0x") || input.startsWith("0X")) {
        /**
         * 2. If input contains at least two code points and the first two code
         * points are either "0x" or "0X", then:
         * 2.1. Set validationErrorFlag.
         * 2.2. Remove the first two code points from input.
         * 2.3. Set R to 16.
         */
        validationErrorFlag.value = true;
        input = input.substr(2);
        R = 16;
    }
    else if (input.length >= 2 && input[0] === '0') {
        /**
         * 3. Otherwise, if input contains at least two code points and the first
         * code point is U+0030 (0), then:
         * 3.1. Set validationErrorFlag.
         * 3.2. Remove the first code point from input.
         * 3.3. Set R to 8.
         */
        validationErrorFlag.value = true;
        input = input.substr(1);
        R = 8;
    }
    /**
     * 4. If input is the empty string, then return zero.
     * 5. If input contains a code point that is not a radix-R digit, then
     * return failure.
     */
    if (input === "")
        return 0;
    var radixRDigits = (R === 10 ? /^[0-9]+$/ : (R === 16 ? /^[0-9A-Fa-f]+$/ : /^[0-7]+$/));
    if (!radixRDigits.test(input))
        return null;
    /**
     * 6. Return the mathematical integer value that is represented by input in
     * radix-R notation, using ASCII hex digits for digits with values
     * 0 through 15.
     */
    return parseInt(input, R);
}
exports.iPv4NumberParser = iPv4NumberParser;
/**
 * Parses a string containing an IP v4 address.
 *
 * @param input - input string
 */
function iPv4Parser(input) {
    var e_6, _a, e_7, _b;
    /**
     * 1. Let validationErrorFlag be unset.
     * 2. Let parts be input split on U+002E (.).
     */
    var validationErrorFlag = { value: false };
    var parts = input.split('.');
    /**
     * 3. If the last item in parts is the empty string, then:
     * 3.1. Set validationErrorFlag.
     * 3.2. If parts has more than one item, then remove the last item from
     * parts.
     */
    if (parts[parts.length - 1] === "") {
        validationErrorFlag.value = true;
        if (parts.length > 1)
            parts.pop();
    }
    /**
     * 4. If parts has more than four items, return input.
     */
    if (parts.length > 4)
        return input;
    /**
     * 5. Let numbers be the empty list.
     * 6. For each part in parts:
     * 6.1. If part is the empty string, return input.
     * 6.2. Let n be the result of parsing part using validationErrorFlag.
     * 6.3. If n is failure, return input.
     * 6.4. Append n to numbers.
     */
    var numbers = [];
    try {
        for (var parts_1 = __values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
            var part = parts_1_1.value;
            if (part === "")
                return input;
            var n = iPv4NumberParser(part, validationErrorFlag);
            if (n === null)
                return input;
            numbers.push(n);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (parts_1_1 && !parts_1_1.done && (_a = parts_1.return)) _a.call(parts_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    /**
     * 7. If validationErrorFlag is set, validation error.
     * 8. If any item in numbers is greater than 255, validation error.
     * 9. If any but the last item in numbers is greater than 255, return
     * failure.
     * 10. If the last item in numbers is greater than or equal to
     * 256**(5 − the number of items in numbers), validation error, return failure.
     */
    if (validationErrorFlag.value)
        validationError("Invalid IP v4 address.");
    for (var i = 0; i < numbers.length; i++) {
        var item = numbers[i];
        if (item > 255) {
            validationError("Invalid IP v4 address.");
            if (i < numbers.length - 1)
                return null;
        }
    }
    if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
        validationError("Invalid IP v4 address.");
        return null;
    }
    /**
     * 11. Let ipv4 be the last item in numbers.
     * 12. Remove the last item from numbers.
     */
    var ipv4 = numbers[numbers.length - 1];
    numbers.pop();
    /**
     * 13. Let counter be zero.
     * 14. For each n in numbers:
     * 14.2. Increment ipv4 by n × 256**(3 − counter).
     * 14.2. Increment counter by 1.
     */
    var counter = 0;
    try {
        for (var numbers_1 = __values(numbers), numbers_1_1 = numbers_1.next(); !numbers_1_1.done; numbers_1_1 = numbers_1.next()) {
            var n = numbers_1_1.value;
            ipv4 += n * Math.pow(256, 3 - counter);
            counter++;
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (numbers_1_1 && !numbers_1_1.done && (_b = numbers_1.return)) _b.call(numbers_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    /**
     * 15. Return ipv4.
     */
    return ipv4;
}
exports.iPv4Parser = iPv4Parser;
/**
 * Parses a string containing an IP v6 address.
 *
 * @param input - input string
 */
function iPv6Parser(input) {
    var _a;
    /**
     * 1. Let address be a new IPv6 address whose IPv6 pieces are all 0.
     * 2. Let pieceIndex be 0.
     * 3. Let compress be null.
     * 4. Let pointer be a pointer into input, initially 0 (pointing to the
     * first code point).
     */
    var EOF = "";
    var address = [0, 0, 0, 0, 0, 0, 0, 0];
    var pieceIndex = 0;
    var compress = null;
    var walker = new util_1.StringWalker(input);
    /**
     * 5. If c is U+003A (:), then:
     * 5.1. If remaining does not start with U+003A (:), validation error,
     * return failure.
     * 5.2. Increase pointer by 2.
     * 5.3. Increase pieceIndex by 1 and then set compress to pieceIndex.
     */
    if (walker.c() === ':') {
        if (!walker.remaining().startsWith(':')) {
            validationError("Invalid IP v6 address.");
            return null;
        }
        walker.pointer += 2;
        pieceIndex += 1;
        compress = pieceIndex;
    }
    /**
     * 6. While c is not the EOF code point:
     */
    while (walker.c() !== EOF) {
        /**
         * 6.1. If pieceIndex is 8, validation error, return failure.
         */
        if (pieceIndex === 8) {
            validationError("Invalid IP v6 address.");
            return null;
        }
        /**
         * 6.2. If c is U+003A (:), then:
         * 6.2.1. If compress is non-null, validation error, return failure.
         * 6.2.2. Increase pointer and pieceIndex by 1, set compress to pieceIndex,
         * and then continue.
         */
        if (walker.c() === ':') {
            if (compress !== null) {
                validationError("Invalid IP v6 address.");
                return null;
            }
            walker.pointer++;
            pieceIndex++;
            compress = pieceIndex;
            continue;
        }
        /**
         * 6.3. Let value and length be 0.
         * 6.4. While length is less than 4 and c is an ASCII hex digit, set value
         * to value × 0x10 + c interpreted as hexadecimal number, and increase
         * pointer and length by 1.
         */
        var value = 0;
        var length = 0;
        while (length < 4 && infra_1.codePoint.ASCIIHexDigit.test(walker.c())) {
            value = value * 0x10 + parseInt(walker.c(), 16);
            walker.pointer++;
            length++;
        }
        /**
         * 6.5. If c is U+002E (.), then:
         */
        if (walker.c() === '.') {
            /**
             * 6.5.1. If length is 0, validation error, return failure.
             * 6.5.2. Decrease pointer by length.
             * 6.5.3. If pieceIndex is greater than 6, validation error, return
             * failure.
             * 6.5.4. Let numbersSeen be 0.
             */
            if (length === 0) {
                validationError("Invalid IP v6 address.");
                return null;
            }
            walker.pointer -= length;
            if (pieceIndex > 6) {
                validationError("Invalid IP v6 address.");
                return null;
            }
            var numbersSeen = 0;
            /**
             * 6.5.5. While c is not the EOF code point:
             */
            while (walker.c() !== EOF) {
                /**
                 * 6.5.5.1. Let ipv4Piece be null.
                 */
                var ipv4Piece = null;
                /**
                 * 6.5.5.2. If numbersSeen is greater than 0, then:
                 * 6.5.5.2.1. If c is a U+002E (.) and numbersSeen is less than 4, then
                 * increase pointer by 1.
                 * 6.5.5.2.1. Otherwise, validation error, return failure.
                 */
                if (numbersSeen > 0) {
                    if (walker.c() === '.' && numbersSeen < 4) {
                        walker.pointer++;
                    }
                    else {
                        validationError("Invalid IP v6 address.");
                        return null;
                    }
                }
                /**
                 * 6.5.5.3. If c is not an ASCII digit, validation error, return
                 * failure.
                 */
                if (!infra_1.codePoint.ASCIIDigit.test(walker.c())) {
                    validationError("Invalid IP v6 address.");
                    return null;
                }
                /**
                 * 6.5.5.4. While c is an ASCII digit:
                 */
                while (infra_1.codePoint.ASCIIDigit.test(walker.c())) {
                    /**
                     * 6.5.5.4.1. Let number be c interpreted as decimal number.
                     */
                    var number = parseInt(walker.c(), 10);
                    /**
                     * 6.5.5.4.2. If ipv4Piece is null, then set ipv4Piece to number.
                     * Otherwise, if ipv4Piece is 0, validation error, return failure.
                     * Otherwise, set ipv4Piece to ipv4Piece × 10 + number.
                     */
                    if (ipv4Piece === null) {
                        ipv4Piece = number;
                    }
                    else if (ipv4Piece === 0) {
                        validationError("Invalid IP v6 address.");
                        return null;
                    }
                    else {
                        ipv4Piece = ipv4Piece * 10 + number;
                    }
                    /**
                     * 6.5.5.4.3. If ipv4Piece is greater than 255, validation error, return failure.
                     * 6.5.5.4.4. Increase pointer by 1.
                     */
                    if (ipv4Piece > 255) {
                        validationError("Invalid IP v6 address.");
                        return null;
                    }
                    walker.pointer++;
                }
                /**
                 * 6.5.5.5. Set address[pieceIndex] to address[pieceIndex] × 0x100 + ipv4Piece.
                 * 6.5.5.6. Increase numbersSeen by 1.
                 * 6.5.5.7. If numbersSeen is 2 or 4, then increase pieceIndex by 1.
                 */
                if (ipv4Piece === null) {
                    validationError("Invalid IP v6 address.");
                    return null;
                }
                address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;
                numbersSeen++;
                if (numbersSeen === 2 || numbersSeen === 4)
                    pieceIndex++;
            }
            /**
             * 6.5.6. If numbersSeen is not 4, validation error, return failure.
             */
            if (numbersSeen !== 4) {
                validationError("Invalid IP v6 address.");
                return null;
            }
            /**
             * 6.5.7. Break.
             */
            break;
        }
        else if (walker.c() === ':') {
            /**
             * 6.6. Otherwise, if c is U+003A (:):
             * 6.6.1. Increase pointer by 1.
             * 6.6.2. If c is the EOF code point, validation error, return failure.
             */
            walker.pointer++;
            if (walker.c() === EOF) {
                validationError("Invalid IP v6 address.");
                return null;
            }
        }
        else if (walker.c() !== EOF) {
            /**
             * 6.7. Otherwise, if c is not the EOF code point, validation error,
             * return failure.
             */
            validationError("Invalid IP v6 address.");
            return null;
        }
        /**
         * 6.8. Set address[pieceIndex] to value.
         * 6.9. Increase pieceIndex by 1.
         */
        address[pieceIndex] = value;
        pieceIndex++;
    }
    /**
     * 7. If compress is non-null, then:
     * 7.1. Let swaps be pieceIndex − compress.
     * 7.2. Set pieceIndex to 7.
     * 7.3. While pieceIndex is not 0 and swaps is greater than 0, swap
     * address[pieceIndex] with address[compress + swaps − 1], and then decrease
     * both pieceIndex and swaps by 1.
     */
    if (compress !== null) {
        var swaps = pieceIndex - compress;
        pieceIndex = 7;
        while (pieceIndex !== 0 && swaps > 0) {
            _a = __read([address[compress + swaps - 1], address[pieceIndex]], 2), address[pieceIndex] = _a[0], address[compress + swaps - 1] = _a[1];
            pieceIndex--;
            swaps--;
        }
    }
    else if (compress === null && pieceIndex !== 8) {
        /**
         * 8. Otherwise, if compress is null and pieceIndex is not 8,
         * validation error, return failure.
         */
        validationError("Invalid IP v6 address.");
        return null;
    }
    /**
     * 9. Return address.
     */
    return address;
}
exports.iPv6Parser = iPv6Parser;
/**
 * Parses an opaque host string.
 *
 * @param input - a string
 */
function opaqueHostParser(input) {
    var e_8, _a;
    /**
     * 1. If input contains a forbidden host code point excluding U+0025 (%),
     * validation error, return failure.
     * 2. Let output be the empty string.
     * 3. For each code point in input, UTF-8 percent encode it using the C0
     * control percent-encode set, and append the result to output.
     * 4. Return output.
     */
    var forbiddenChars = /[\x00\t\f\r #/:?@\[\\\]]/;
    if (forbiddenChars.test(input)) {
        validationError("Invalid host string.");
        return null;
    }
    var output = "";
    try {
        for (var input_1 = __values(input), input_1_1 = input_1.next(); !input_1_1.done; input_1_1 = input_1.next()) {
            var codePoint = input_1_1.value;
            output += utf8PercentEncode(codePoint, _c0ControlPercentEncodeSet);
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (input_1_1 && !input_1_1.done && (_a = input_1.return)) _a.call(input_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return output;
}
exports.opaqueHostParser = opaqueHostParser;
/**
 * Resolves a Blob URL from the user agent's Blob URL store.
 * function is not implemented.
 * See: https://w3c.github.io/FileAPI/#blob-url-resolve
 *
 * @param url - an url
 */
function resolveABlobURL(url) {
    return null;
}
exports.resolveABlobURL = resolveABlobURL;
/**
 * Percent encodes a byte.
 *
 * @param value - a byte
 */
function percentEncode(value) {
    /**
     * To percent encode a byte into a percent-encoded byte, return a string
     * consisting of U+0025 (%), followed by two ASCII upper hex digits
     * representing byte.
     */
    return '%' + ('00' + value.toString(16).toUpperCase()).slice(-2);
}
exports.percentEncode = percentEncode;
/**
 * Percent decodes a byte sequence input.
 *
 * @param input - a byte sequence
 */
function percentDecode(input) {
    var isHexDigit = function (byte) {
        return (byte >= 0x30 && byte <= 0x39) || (byte >= 0x41 && byte <= 0x46) ||
            (byte >= 0x61 && byte <= 0x66);
    };
    /**
     * 1. Let output be an empty byte sequence.
     * 2. For each byte byte in input:
     */
    var output = new Uint8Array(input.length);
    var n = 0;
    for (var i = 0; i < input.length; i++) {
        var byte = input[i];
        /**
         * 2.1. If byte is not 0x25 (%), then append byte to output.
         * 2.2. Otherwise, if byte is 0x25 (%) and the next two bytes after byte
         * in input are not in the ranges 0x30 (0) to 0x39 (9), 0x41 (A)
         * to 0x46 (F), and 0x61 (a) to 0x66 (f), all inclusive, append byte
         * to output.
         * 2.3. Otherwise:
         * 2.3.1. Let bytePoint be the two bytes after byte in input, decoded,
         * and then interpreted as hexadecimal number.
         * 2.3.2. Append a byte whose value is bytePoint to output.
         * 2.3.3. Skip the next two bytes in input.
         */
        if (byte !== 0x25) {
            output[n] = byte;
            n++;
        }
        else if (byte === 0x25 && i >= input.length - 2) {
            output[n] = byte;
            n++;
        }
        else if (byte === 0x25 && (!isHexDigit(input[i + 1]) || !isHexDigit(input[i + 2]))) {
            output[n] = byte;
            n++;
        }
        else {
            var bytePoint = parseInt(util_1.utf8Decode(Uint8Array.of(input[i + 1], input[i + 2])), 16);
            output[n] = bytePoint;
            n++;
            i += 2;
        }
    }
    return output.subarray(0, n);
}
exports.percentDecode = percentDecode;
/**
 * String percent decodes a string.
 *
 * @param input - a string
 */
function stringPercentDecode(input) {
    /**
     * 1. Let bytes be the UTF-8 encoding of input.
     * 2. Return the percent decoding of bytes.
     */
    return percentDecode(util_1.utf8Encode(input));
}
exports.stringPercentDecode = stringPercentDecode;
/**
 * UTF-8 percent encodes a code point, using a percent encode set.
 *
 * @param codePoint - a code point
 * @param percentEncodeSet - a percent encode set
 */
function utf8PercentEncode(codePoint, percentEncodeSet) {
    var e_9, _a;
    /**
     * 1. If codePoint is not in percentEncodeSet, then return codePoint.
     * 2. Let bytes be the result of running UTF-8 encode on codePoint.
     * 3. Percent encode each byte in bytes, and then return the results
     * concatenated, in the same order.
     */
    if (!percentEncodeSet.test(codePoint))
        return codePoint;
    var bytes = util_1.utf8Encode(codePoint);
    var result = "";
    try {
        for (var bytes_2 = __values(bytes), bytes_2_1 = bytes_2.next(); !bytes_2_1.done; bytes_2_1 = bytes_2.next()) {
            var byte = bytes_2_1.value;
            result += percentEncode(byte);
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (bytes_2_1 && !bytes_2_1.done && (_a = bytes_2.return)) _a.call(bytes_2);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return result;
}
exports.utf8PercentEncode = utf8PercentEncode;
/**
 * Determines if two hosts are considered equal.
 *
 * @param hostA - a host
 * @param hostB - a host
 */
function hostEquals(hostA, hostB) {
    return hostA === hostB;
}
exports.hostEquals = hostEquals;
/**
 * Determines if two URLs are considered equal.
 *
 * @param urlA - a URL
 * @param urlB - a URL
 * @param excludeFragmentsFlag - whether to ignore fragments while comparing
 */
function urlEquals(urlA, urlB, excludeFragmentsFlag) {
    if (excludeFragmentsFlag === void 0) { excludeFragmentsFlag = false; }
    /**
     * 1. Let serializedA be the result of serializing A, with the exclude
     * fragment flag set if the exclude fragments flag is set.
     * 2. Let serializedB be the result of serializing B, with the exclude
     * fragment flag set if the exclude fragments flag is set.
     * 3. Return true if serializedA is serializedB, and false otherwise.
     */
    return urlSerializer(urlA, excludeFragmentsFlag) ===
        urlSerializer(urlB, excludeFragmentsFlag);
}
exports.urlEquals = urlEquals;
/**
 * Parses an `application/x-www-form-urlencoded` string.
 *
 * @param input - a string
 */
function urlEncodedStringParser(input) {
    /**
     * The application/x-www-form-urlencoded string parser takes a string input,
     * UTF-8 encodes it, and then returns the result of
     * application/x-www-form-urlencoded parsing it.
     */
    return urlEncodedParser(util_1.utf8Encode(input));
}
exports.urlEncodedStringParser = urlEncodedStringParser;
/**
 * Parses `application/x-www-form-urlencoded` bytes.
 *
 * @param input - a byte sequence
 */
function urlEncodedParser(input) {
    var e_10, _a, e_11, _b;
    /**
     * 1. Let sequences be the result of splitting input on 0x26 (&).
     */
    var sequences = [];
    var currentSequence = [];
    try {
        for (var input_2 = __values(input), input_2_1 = input_2.next(); !input_2_1.done; input_2_1 = input_2.next()) {
            var byte = input_2_1.value;
            if (byte === 0x26) {
                sequences.push(Uint8Array.from(currentSequence));
                currentSequence = [];
            }
            else {
                currentSequence.push(byte);
            }
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (input_2_1 && !input_2_1.done && (_a = input_2.return)) _a.call(input_2);
        }
        finally { if (e_10) throw e_10.error; }
    }
    if (currentSequence.length !== 0) {
        sequences.push(Uint8Array.from(currentSequence));
    }
    /**
     * 2. Let output be an initially empty list of name-value tuples where both name and value hold a string.
     */
    var output = [];
    try {
        /**
         * 3. For each byte sequence bytes in sequences:
         */
        for (var sequences_1 = __values(sequences), sequences_1_1 = sequences_1.next(); !sequences_1_1.done; sequences_1_1 = sequences_1.next()) {
            var bytes = sequences_1_1.value;
            /**
             * 3.1. If bytes is the empty byte sequence, then continue.
             */
            if (bytes.length === 0)
                continue;
            /**
             * 3.2. If bytes contains a 0x3D (=), then let name be the bytes from the
             * start of bytes up to but excluding its first 0x3D (=), and let value be
             * the bytes, if any, after the first 0x3D (=) up to the end of bytes.
             * If 0x3D (=) is the first byte, then name will be the empty byte
             * sequence. If it is the last, then value will be the empty byte sequence.
             * 3.3. Otherwise, let name have the value of bytes and let value be the
             * empty byte sequence.
             */
            var index = bytes.indexOf(0x3D);
            var name = (index !== -1 ? bytes.slice(0, index) : bytes);
            var value = (index !== -1 ? bytes.slice(index + 1) : new Uint8Array());
            /**
             * 3.4. Replace any 0x2B (+) in name and value with 0x20 (SP).
             */
            for (var i = 0; i < name.length; i++)
                if (name[i] === 0x2B)
                    name[i] = 0x20;
            for (var i = 0; i < value.length; i++)
                if (value[i] === 0x2B)
                    value[i] = 0x20;
            /**
             * 3.5. Let nameString and valueString be the result of running UTF-8
             * decode without BOM on the percent decoding of name and value,
             * respectively.
             */
            var nameString = util_1.utf8Decode(name);
            var valueString = util_1.utf8Decode(value);
            /**
             * 3.6. Append (nameString, valueString) to output.
             */
            output.push([nameString, valueString]);
        }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (sequences_1_1 && !sequences_1_1.done && (_b = sequences_1.return)) _b.call(sequences_1);
        }
        finally { if (e_11) throw e_11.error; }
    }
    /**
     * 4. Return output.
     */
    return output;
}
exports.urlEncodedParser = urlEncodedParser;
/**
 * Serializes `application/x-www-form-urlencoded` bytes.
 *
 * @param input - a byte sequence
 */
function urlEncodedByteSerializer(input) {
    var e_12, _a;
    /**
     * 1. Let output be the empty string.
     * 2. For each byte in input, depending on byte:
     * 0x20 (SP)
     * Append U+002B (+) to output.
     *
     * 0x2A (*)
     * 0x2D (-)
     * 0x2E (.)
     * 0x30 (0) to 0x39 (9)
     * 0x41 (A) to 0x5A (Z)
     * 0x5F (_)
     * 0x61 (a) to 0x7A (z)
     * Append a code point whose value is byte to output.
     *
     * Otherwise
     * Append byte, percent encoded, to output.
     * 3. Return output.
     */
    var output = "";
    try {
        for (var input_3 = __values(input), input_3_1 = input_3.next(); !input_3_1.done; input_3_1 = input_3.next()) {
            var byte = input_3_1.value;
            if (byte === 0x20) {
                output += '+';
            }
            else if (byte === 0x2A || byte === 0x2D || byte === 0x2E ||
                (byte >= 0x30 && byte <= 0x39) || (byte >= 0x41 && byte <= 0x5A) ||
                byte === 0x5F || (byte >= 0x61 && byte <= 0x7A)) {
                output += String.fromCodePoint(byte);
            }
            else {
                output += percentEncode(byte);
            }
        }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (input_3_1 && !input_3_1.done && (_a = input_3.return)) _a.call(input_3);
        }
        finally { if (e_12) throw e_12.error; }
    }
    return output;
}
exports.urlEncodedByteSerializer = urlEncodedByteSerializer;
/**
 * Serializes `application/x-www-form-urlencoded` tuples.
 *
 * @param input - input tuple of name/value pairs
 * @param encodingOverride: encoding override
 */
function urlEncodedSerializer(tuples, encodingOverride) {
    var e_13, _a;
    /**
     * 1. Let encoding be UTF-8.
     * 2. If encoding override is given, set encoding to the result of getting
     * an output encoding from encoding override.
     */
    var encoding = (encodingOverride === undefined ||
        encodingOverride === "replacement" || encodingOverride === "UTF-16BE" ||
        encodingOverride === "UTF-16LE" ? "UTF-8" : encodingOverride);
    if (encoding.toUpperCase() !== "UTF-8") {
        throw new Error("Only UTF-8 encoding is supported.");
    }
    /**
     * 3. Let output be the empty string.
     */
    var output = "";
    try {
        /**
         * 4. For each tuple in tuples:
         */
        for (var tuples_1 = __values(tuples), tuples_1_1 = tuples_1.next(); !tuples_1_1.done; tuples_1_1 = tuples_1.next()) {
            var tuple = tuples_1_1.value;
            /**
             * 4.1. Let name be the result of serializing the result of encoding
             * tuple’s name, using encoding.
             */
            var name = urlEncodedByteSerializer(util_1.utf8Encode(tuple[0]));
            /**
             * 4.2. Let value be tuple’s value.
             */
            var value = tuple[1];
            /**
             * TODO:
             * 4.3. If value is a file, then set value to value’s filename.
             */
            /**
             * 4.4. Set value to the result of serializing the result of encoding
             * value, using encoding.
             */
            value = urlEncodedByteSerializer(util_1.utf8Encode(value));
            /**
             * 4.5. If tuple is not the first pair in tuples, then append U+0026 (&)
             * to output.
             */
            if (output !== "")
                output += '&';
            /**
             * 4.6. Append name, followed by U+003D (=), followed by value, to output.
             */
            output += name + '=' + value;
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (tuples_1_1 && !tuples_1_1.done && (_a = tuples_1.return)) _a.call(tuples_1);
        }
        finally { if (e_13) throw e_13.error; }
    }
    /**
     * 5. Return output.
     */
    return output;
}
exports.urlEncodedSerializer = urlEncodedSerializer;
/**
 * Returns a URL's origin.
 *
 * @param url - a URL
 */
function origin(url) {
    /**
     * A URL’s origin is the origin returned by running these steps, switching
     * on URL’s scheme:
     * "blob"
     * 1. If URL’s blob URL entry is non-null, then return URL’s blob URL
     * entry’s environment’s origin.
     * 2. Let url be the result of parsing URL’s path[0].
     * 3. Return a new opaque origin, if url is failure, and url’s origin
     * otherwise.
     * "ftp"
     * "http"
     * "https"
     * "ws"
     * "wss"
     * Return a tuple consisting of URL’s scheme, URL’s host, URL’s port, and
     * null.
     * "file"
     * Unfortunate as it is, is left as an exercise to the reader. When in
     * doubt, return a new opaque origin.
     * Otherwise
     * Return a new opaque origin.
     */
    switch (url.scheme) {
        case "blob":
            if (url._blobURLEntry !== null) {
                // TODO: return URL’s blob URL entry’s environment’s origin.
            }
            var parsedURL = basicURLParser(url.path[0]);
            if (parsedURL === null)
                return interfaces_1.OpaqueOrigin;
            else
                return origin(parsedURL);
        case "ftp":
        case "http":
        case "https":
        case "ws":
        case "wss":
            return [url.scheme, url.host === null ? "" : url.host, url.port, null];
        case "file":
            return interfaces_1.OpaqueOrigin;
        default:
            return interfaces_1.OpaqueOrigin;
    }
}
exports.origin = origin;
/**
 * Converts a domain string to ASCII.
 *
 * @param domain - a domain string
 */
function domainToASCII(domain, beStrict) {
    if (beStrict === void 0) { beStrict = false; }
    /**
     * 1. If beStrict is not given, set it to false.
     * 2. Let result be the result of running Unicode ToASCII with domain_name
     * set to domain, UseSTD3ASCIIRules set to beStrict, CheckHyphens set to
     * false, CheckBidi set to true, CheckJoiners set to true,
     * Transitional_Processing set to false, and VerifyDnsLength set to beStrict.
     * 3. If result is a failure value, validation error, return failure.
     * 4. Return result.
     */
    // Use node.js function
    var result = url_1.domainToASCII(domain);
    if (result === "") {
        validationError("Invalid domain name.");
        return null;
    }
    return result;
}
exports.domainToASCII = domainToASCII;
/**
 * Converts a domain string to Unicode.
 *
 * @param domain - a domain string
 */
function domainToUnicode(domain, beStrict) {
    if (beStrict === void 0) { beStrict = false; }
    /**
     * 1. Let result be the result of running Unicode ToUnicode with domain_name
     * set to domain, CheckHyphens set to false, CheckBidi set to true,
     * CheckJoiners set to true, UseSTD3ASCIIRules set to false, and
     * Transitional_Processing set to false.
     * 2. Signify validation errors for any returned errors, and then,
     * return result.
     */
    // Use node.js function
    var result = url_1.domainToUnicode(domain);
    if (result === "") {
        validationError("Invalid domain name.");
    }
    return result;
}
exports.domainToUnicode = domainToUnicode;
/**
 * Serializes an origin.
 * function is from the HTML spec:
 * https://html.spec.whatwg.org/#ascii-serialisation-of-an-origin
 *
 * @param origin - an origin
 */
function asciiSerializationOfAnOrigin(origin) {
    /**
     * 1. If origin is an opaque origin, then return "null".
     * 2. Otherwise, let result be origin's scheme.
     * 3. Append "://" to result.
     * 4. Append origin's host, serialized, to result.
     * 5. If origin's port is non-null, append a U+003A COLON character (:),
     * and origin's port, serialized, to result.
     * 6. Return result.
     */
    if (origin[0] === "" && origin[1] === "" && origin[2] === null && origin[3] === null) {
        return "null";
    }
    var result = origin[0] + "://" + hostSerializer(origin[1]);
    if (origin[2] !== null)
        result += ":" + origin[2].toString();
    return result;
}
exports.asciiSerializationOfAnOrigin = asciiSerializationOfAnOrigin;
//# sourceMappingURL=URLAlgorithm.js.map