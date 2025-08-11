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
Object.defineProperty(exports, "__esModule", { value: true });
var EventAlgorithm_1 = require("./EventAlgorithm");
/**
 * Adds an algorithm to the given abort signal.
 *
 * @param algorithm - an algorithm
 * @param signal - abort signal
 */
function abort_add(algorithm, signal) {
    /**
     * 1. If signal’s aborted flag is set, then return.
     * 2. Append algorithm to signal’s abort algorithms.
     */
    if (signal._abortedFlag)
        return;
    signal._abortAlgorithms.add(algorithm);
}
exports.abort_add = abort_add;
/**
 * Removes an algorithm from the given abort signal.
 *
 * @param algorithm - an algorithm
 * @param signal - abort signal
 */
function abort_remove(algorithm, signal) {
    /**
     * To remove an algorithm algorithm from an AbortSignal signal, remove
     * algorithm from signal’s abort algorithms.
     */
    signal._abortAlgorithms.delete(algorithm);
}
exports.abort_remove = abort_remove;
/**
 * Signals abort on the given abort signal.
 *
 * @param signal - abort signal
 */
function abort_signalAbort(signal) {
    var e_1, _a;
    /**
     * 1. If signal’s aborted flag is set, then return.
     * 2. Set signal’s aborted flag.
     * 3. For each algorithm in signal’s abort algorithms: run algorithm.
     * 4. Empty signal’s abort algorithms.
     * 5. Fire an event named abort at signal.
     */
    if (signal._abortedFlag)
        return;
    signal._abortedFlag = true;
    try {
        for (var _b = __values(signal._abortAlgorithms), _c = _b.next(); !_c.done; _c = _b.next()) {
            var algorithm = _c.value;
            algorithm.call(signal);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    signal._abortAlgorithms.clear();
    EventAlgorithm_1.event_fireAnEvent("abort", signal);
}
exports.abort_signalAbort = abort_signalAbort;
//# sourceMappingURL=AbortAlgorithm.js.map