"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var algorithm_1 = require("../algorithm");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a DOM event.
 */
var EventImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `Event`.
     */
    function EventImpl(type, eventInit) {
        this._target = null;
        this._relatedTarget = null;
        this._touchTargetList = [];
        this._path = [];
        this._currentTarget = null;
        this._eventPhase = interfaces_1.EventPhase.None;
        this._stopPropagationFlag = false;
        this._stopImmediatePropagationFlag = false;
        this._canceledFlag = false;
        this._inPassiveListenerFlag = false;
        this._composedFlag = false;
        this._initializedFlag = false;
        this._dispatchFlag = false;
        this._isTrusted = false;
        this._bubbles = false;
        this._cancelable = false;
        /**
         * When a constructor of the Event interface, or of an interface that
         * inherits from the Event interface, is invoked, these steps must be run,
         * given the arguments type and eventInitDict:
         * 1. Let event be the result of running the inner event creation steps with
         * this interface, null, now, and eventInitDict.
         * 2. Initialize event’s type attribute to type.
         * 3. Return event.
         */
        this._type = type;
        if (eventInit) {
            this._bubbles = eventInit.bubbles || false;
            this._cancelable = eventInit.cancelable || false;
            this._composedFlag = eventInit.composed || false;
        }
        this._initializedFlag = true;
        this._timeStamp = new Date().getTime();
    }
    Object.defineProperty(EventImpl.prototype, "type", {
        /** @inheritdoc */
        get: function () { return this._type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventImpl.prototype, "target", {
        /** @inheritdoc */
        get: function () { return this._target; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventImpl.prototype, "srcElement", {
        /** @inheritdoc */
        get: function () { return this._target; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventImpl.prototype, "currentTarget", {
        /** @inheritdoc */
        get: function () { return this._currentTarget; },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    EventImpl.prototype.composedPath = function () {
        /**
         * 1. Let composedPath be an empty list.
         * 2. Let path be the context object’s path.
         * 3. If path is empty, then return composedPath.
         * 4. Let currentTarget be the context object’s currentTarget attribute
         * value.
         * 5. Append currentTarget to composedPath.
         * 6. Let currentTargetIndex be 0.
         * 7. Let currentTargetHiddenSubtreeLevel be 0.
         */
        var composedPath = [];
        var path = this._path;
        if (path.length === 0)
            return composedPath;
        var currentTarget = this._currentTarget;
        if (currentTarget === null) {
            throw new Error("Event currentTarget is null.");
        }
        composedPath.push(currentTarget);
        var currentTargetIndex = 0;
        var currentTargetHiddenSubtreeLevel = 0;
        /**
         * 8. Let index be path’s size − 1.
         * 9. While index is greater than or equal to 0:
         */
        var index = path.length - 1;
        while (index >= 0) {
            /**
             * 9.1. If path[index]'s root-of-closed-tree is true, then increase
             * currentTargetHiddenSubtreeLevel by 1.
             * 9.2. If path[index]'s invocation target is currentTarget, then set
             * currentTargetIndex to index and break.
             * 9.3. If path[index]'s slot-in-closed-tree is true, then decrease
             * currentTargetHiddenSubtreeLevel by 1.
             * 9.4. Decrease index by 1.
             */
            if (path[index].rootOfClosedTree) {
                currentTargetHiddenSubtreeLevel++;
            }
            if (path[index].invocationTarget === currentTarget) {
                currentTargetIndex = index;
                break;
            }
            if (path[index].slotInClosedTree) {
                currentTargetHiddenSubtreeLevel--;
            }
            index--;
        }
        /**
         * 10. Let currentHiddenLevel and maxHiddenLevel be
         * currentTargetHiddenSubtreeLevel.
         */
        var currentHiddenLevel = currentTargetHiddenSubtreeLevel;
        var maxHiddenLevel = currentTargetHiddenSubtreeLevel;
        /**
         * 11. Set index to currentTargetIndex − 1.
         * 12. While index is greater than or equal to 0:
         */
        index = currentTargetIndex - 1;
        while (index >= 0) {
            /**
             * 12.1. If path[index]'s root-of-closed-tree is true, then increase
             * currentHiddenLevel by 1.
             * 12.2. If currentHiddenLevel is less than or equal to maxHiddenLevel,
             * then prepend path[index]'s invocation target to composedPath.
             */
            if (path[index].rootOfClosedTree) {
                currentHiddenLevel++;
            }
            if (currentHiddenLevel <= maxHiddenLevel) {
                composedPath.unshift(path[index].invocationTarget);
            }
            /**
             * 12.3. If path[index]'s slot-in-closed-tree is true, then:
             */
            if (path[index].slotInClosedTree) {
                /**
                 * 12.3.1. Decrease currentHiddenLevel by 1.
                 * 12.3.2. If currentHiddenLevel is less than maxHiddenLevel, then set
                 * maxHiddenLevel to currentHiddenLevel.
                 */
                currentHiddenLevel--;
                if (currentHiddenLevel < maxHiddenLevel) {
                    maxHiddenLevel = currentHiddenLevel;
                }
            }
            /**
             * 12.4. Decrease index by 1.
             */
            index--;
        }
        /**
         * 13. Set currentHiddenLevel and maxHiddenLevel to
         * currentTargetHiddenSubtreeLevel.
         */
        currentHiddenLevel = currentTargetHiddenSubtreeLevel;
        maxHiddenLevel = currentTargetHiddenSubtreeLevel;
        /**
         * 14. Set index to currentTargetIndex + 1.
         * 15. While index is less than path’s size:
         */
        index = currentTargetIndex + 1;
        while (index < path.length) {
            /**
             * 15.1. If path[index]'s slot-in-closed-tree is true, then increase
             * currentHiddenLevel by 1.
             * 15.2. If currentHiddenLevel is less than or equal to maxHiddenLevel,
             * then append path[index]'s invocation target to composedPath.
             */
            if (path[index].slotInClosedTree) {
                currentHiddenLevel++;
            }
            if (currentHiddenLevel <= maxHiddenLevel) {
                composedPath.push(path[index].invocationTarget);
            }
            /**
             * 15.3. If path[index]'s root-of-closed-tree is true, then:
             */
            if (path[index].rootOfClosedTree) {
                /**
                 * 15.3.1. Decrease currentHiddenLevel by 1.
                 * 15.3.2. If currentHiddenLevel is less than maxHiddenLevel, then set
                 * maxHiddenLevel to currentHiddenLevel.
                 */
                currentHiddenLevel--;
                if (currentHiddenLevel < maxHiddenLevel) {
                    maxHiddenLevel = currentHiddenLevel;
                }
            }
            /**
             * 15.4. Increase index by 1.
             */
            index++;
        }
        /**
         * 16. Return composedPath.
         */
        return composedPath;
    };
    Object.defineProperty(EventImpl.prototype, "eventPhase", {
        /** @inheritdoc */
        get: function () { return this._eventPhase; },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    EventImpl.prototype.stopPropagation = function () { this._stopPropagationFlag = true; };
    Object.defineProperty(EventImpl.prototype, "cancelBubble", {
        /** @inheritdoc */
        get: function () { return this._stopPropagationFlag; },
        set: function (value) { if (value)
            this.stopPropagation(); },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    EventImpl.prototype.stopImmediatePropagation = function () {
        this._stopPropagationFlag = true;
        this._stopImmediatePropagationFlag = true;
    };
    Object.defineProperty(EventImpl.prototype, "bubbles", {
        /** @inheritdoc */
        get: function () { return this._bubbles; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventImpl.prototype, "cancelable", {
        /** @inheritdoc */
        get: function () { return this._cancelable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventImpl.prototype, "returnValue", {
        /** @inheritdoc */
        get: function () { return !this._canceledFlag; },
        set: function (value) {
            if (!value) {
                algorithm_1.event_setTheCanceledFlag(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    EventImpl.prototype.preventDefault = function () {
        algorithm_1.event_setTheCanceledFlag(this);
    };
    Object.defineProperty(EventImpl.prototype, "defaultPrevented", {
        /** @inheritdoc */
        get: function () { return this._canceledFlag; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventImpl.prototype, "composed", {
        /** @inheritdoc */
        get: function () { return this._composedFlag; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventImpl.prototype, "isTrusted", {
        /** @inheritdoc */
        get: function () { return this._isTrusted; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventImpl.prototype, "timeStamp", {
        /** @inheritdoc */
        get: function () { return this._timeStamp; },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    EventImpl.prototype.initEvent = function (type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        /**
         * 1. If the context object’s dispatch flag is set, then return.
         */
        if (this._dispatchFlag)
            return;
        /**
         * 2. Initialize the context object with type, bubbles, and cancelable.
         */
        algorithm_1.event_initialize(this, type, bubbles, cancelable);
    };
    EventImpl.NONE = 0;
    EventImpl.CAPTURING_PHASE = 1;
    EventImpl.AT_TARGET = 2;
    EventImpl.BUBBLING_PHASE = 3;
    return EventImpl;
}());
exports.EventImpl = EventImpl;
/**
 * Define constants on prototype.
 */
WebIDLAlgorithm_1.idl_defineConst(EventImpl.prototype, "NONE", 0);
WebIDLAlgorithm_1.idl_defineConst(EventImpl.prototype, "CAPTURING_PHASE", 1);
WebIDLAlgorithm_1.idl_defineConst(EventImpl.prototype, "AT_TARGET", 2);
WebIDLAlgorithm_1.idl_defineConst(EventImpl.prototype, "BUBBLING_PHASE", 3);
//# sourceMappingURL=EventImpl.js.map