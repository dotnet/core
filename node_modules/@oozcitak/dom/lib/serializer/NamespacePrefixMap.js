"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A namespace prefix map is a map that associates namespaceURI and namespace
 * prefix lists, where namespaceURI values are the map's unique keys (which can
 * include the null value representing no namespace), and ordered lists of
 * associated prefix values are the map's key values. The namespace prefix map
 * will be populated by previously seen namespaceURIs and all their previously
 * encountered prefix associations for a given node and its ancestors.
 *
 * _Note:_ The last seen prefix for a given namespaceURI is at the end of its
 * respective list. The list is searched to find potentially matching prefixes,
 * and if no matches are found for the given namespaceURI, then the last prefix
 * in the list is used. See copy a namespace prefix map and retrieve a preferred
 * prefix string for additional details.
 *
 * See: https://w3c.github.io/DOM-Parsing/#the-namespace-prefix-map
 */
var NamespacePrefixMap = /** @class */ (function () {
    function NamespacePrefixMap() {
        this._items = {};
        this._nullItems = [];
    }
    /**
     * Creates a copy of the map.
     */
    NamespacePrefixMap.prototype.copy = function () {
        /**
         * To copy a namespace prefix map map means to copy the map's keys into a
         * new empty namespace prefix map, and to copy each of the values in the
         * namespace prefix list associated with each keys' value into a new list
         * which should be associated with the respective key in the new map.
         */
        var mapCopy = new NamespacePrefixMap();
        for (var key in this._items) {
            mapCopy._items[key] = this._items[key].slice(0);
        }
        mapCopy._nullItems = this._nullItems.slice(0);
        return mapCopy;
    };
    /**
     * Retrieves a preferred prefix string from the namespace prefix map.
     *
     * @param preferredPrefix - preferred prefix string
     * @param ns - namespace
     */
    NamespacePrefixMap.prototype.get = function (preferredPrefix, ns) {
        /**
         * 1. Let candidates list be the result of retrieving a list from map where
         * there exists a key in map that matches the value of ns or if there is no
         * such key, then stop running these steps, and return the null value.
         */
        var candidatesList = ns === null ? this._nullItems : (this._items[ns] || null);
        if (candidatesList === null) {
            return null;
        }
        /**
         * 2. Otherwise, for each prefix value prefix in candidates list, iterating
         * from beginning to end:
         *
         * _Note:_ There will always be at least one prefix value in the list.
         */
        var prefix = null;
        for (var i = 0; i < candidatesList.length; i++) {
            prefix = candidatesList[i];
            /**
             * 2.1. If prefix matches preferred prefix, then stop running these steps
             * and return prefix.
             */
            if (prefix === preferredPrefix) {
                return prefix;
            }
        }
        /**
        * 2.2. If prefix is the last item in the candidates list, then stop
        * running these steps and return prefix.
        */
        return prefix;
    };
    /**
     * Checks if a prefix string is found in the namespace prefix map associated
     * with the given namespace.
     *
     * @param prefix - prefix string
     * @param ns - namespace
     */
    NamespacePrefixMap.prototype.has = function (prefix, ns) {
        /**
         * 1. Let candidates list be the result of retrieving a list from map where
         * there exists a key in map that matches the value of ns or if there is
         * no such key, then stop running these steps, and return false.
         */
        var candidatesList = ns === null ? this._nullItems : (this._items[ns] || null);
        if (candidatesList === null) {
            return false;
        }
        /**
         * 2. If the value of prefix occurs at least once in candidates list,
         * return true, otherwise return false.
         */
        return (candidatesList.indexOf(prefix) !== -1);
    };
    /**
     * Checks if a prefix string is found in the namespace prefix map.
     *
     * @param prefix - prefix string
     */
    NamespacePrefixMap.prototype.hasPrefix = function (prefix) {
        if (this._nullItems.indexOf(prefix) !== -1)
            return true;
        for (var key in this._items) {
            if (this._items[key].indexOf(prefix) !== -1)
                return true;
        }
        return false;
    };
    /**
     * Adds a prefix string associated with a namespace to the prefix map.
     *
     * @param prefix - prefix string
     * @param ns - namespace
     */
    NamespacePrefixMap.prototype.set = function (prefix, ns) {
        /**
         * 1. Let candidates list be the result of retrieving a list from map where
         * there exists a key in map that matches the value of ns or if there is
         * no such key, then let candidates list be null.
         */
        var candidatesList = ns === null ? this._nullItems : (this._items[ns] || null);
        /**
         * 2. If candidates list is null, then create a new list with prefix as the
         * only item in the list, and associate that list with a new key ns in map.
         * 3. Otherwise, append prefix to the end of candidates list.
         *
         * _Note:_ The steps in retrieve a preferred prefix string use the list to
         * track the most recently used (MRU) prefix associated with a given
         * namespace, which will be the prefix at the end of the list. This list
         * may contain duplicates of the same prefix value seen earlier
         * (and that's OK).
         */
        if (ns !== null && candidatesList === null) {
            this._items[ns] = [prefix];
        }
        else {
            candidatesList.push(prefix);
        }
    };
    return NamespacePrefixMap;
}());
exports.NamespacePrefixMap = NamespacePrefixMap;
//# sourceMappingURL=NamespacePrefixMap.js.map