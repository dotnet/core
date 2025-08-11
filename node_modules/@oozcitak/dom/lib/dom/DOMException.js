"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents the base class of `Error` objects used by this module.
 */
var DOMException = /** @class */ (function (_super) {
    __extends(DOMException, _super);
    /**
     *
     * @param name - message name
     * @param message - error message
     */
    function DOMException(name, message) {
        if (message === void 0) { message = ""; }
        var _this = _super.call(this, message) || this;
        _this.name = name;
        return _this;
    }
    return DOMException;
}(Error));
exports.DOMException = DOMException;
var DOMStringSizeError = /** @class */ (function (_super) {
    __extends(DOMStringSizeError, _super);
    /**
    * @param message - error message
    */
    function DOMStringSizeError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "DOMStringSizeError", message) || this;
    }
    return DOMStringSizeError;
}(DOMException));
exports.DOMStringSizeError = DOMStringSizeError;
var WrongDocumentError = /** @class */ (function (_super) {
    __extends(WrongDocumentError, _super);
    /**
    * @param message - error message
    */
    function WrongDocumentError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "WrongDocumentError", "The object is in the wrong document. " + message) || this;
    }
    return WrongDocumentError;
}(DOMException));
exports.WrongDocumentError = WrongDocumentError;
var NoDataAllowedError = /** @class */ (function (_super) {
    __extends(NoDataAllowedError, _super);
    /**
    * @param message - error message
    */
    function NoDataAllowedError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "NoDataAllowedError", message) || this;
    }
    return NoDataAllowedError;
}(DOMException));
exports.NoDataAllowedError = NoDataAllowedError;
var NoModificationAllowedError = /** @class */ (function (_super) {
    __extends(NoModificationAllowedError, _super);
    /**
    * @param message - error message
    */
    function NoModificationAllowedError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "NoModificationAllowedError", "The object can not be modified. " + message) || this;
    }
    return NoModificationAllowedError;
}(DOMException));
exports.NoModificationAllowedError = NoModificationAllowedError;
var NotSupportedError = /** @class */ (function (_super) {
    __extends(NotSupportedError, _super);
    /**
    * @param message - error message
    */
    function NotSupportedError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "NotSupportedError", "The operation is not supported. " + message) || this;
    }
    return NotSupportedError;
}(DOMException));
exports.NotSupportedError = NotSupportedError;
var InUseAttributeError = /** @class */ (function (_super) {
    __extends(InUseAttributeError, _super);
    /**
    * @param message - error message
    */
    function InUseAttributeError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "InUseAttributeError", message) || this;
    }
    return InUseAttributeError;
}(DOMException));
exports.InUseAttributeError = InUseAttributeError;
var InvalidStateError = /** @class */ (function (_super) {
    __extends(InvalidStateError, _super);
    /**
    * @param message - error message
    */
    function InvalidStateError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "InvalidStateError", "The object is in an invalid state. " + message) || this;
    }
    return InvalidStateError;
}(DOMException));
exports.InvalidStateError = InvalidStateError;
var InvalidModificationError = /** @class */ (function (_super) {
    __extends(InvalidModificationError, _super);
    /**
    * @param message - error message
    */
    function InvalidModificationError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "InvalidModificationError", "The object can not be modified in this way. " + message) || this;
    }
    return InvalidModificationError;
}(DOMException));
exports.InvalidModificationError = InvalidModificationError;
var NamespaceError = /** @class */ (function (_super) {
    __extends(NamespaceError, _super);
    /**
    * @param message - error message
    */
    function NamespaceError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "NamespaceError", "The operation is not allowed by Namespaces in XML. [XMLNS] " + message) || this;
    }
    return NamespaceError;
}(DOMException));
exports.NamespaceError = NamespaceError;
var InvalidAccessError = /** @class */ (function (_super) {
    __extends(InvalidAccessError, _super);
    /**
    * @param message - error message
    */
    function InvalidAccessError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "InvalidAccessError", "The object does not support the operation or argument. " + message) || this;
    }
    return InvalidAccessError;
}(DOMException));
exports.InvalidAccessError = InvalidAccessError;
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    /**
    * @param message - error message
    */
    function ValidationError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "ValidationError", message) || this;
    }
    return ValidationError;
}(DOMException));
exports.ValidationError = ValidationError;
var TypeMismatchError = /** @class */ (function (_super) {
    __extends(TypeMismatchError, _super);
    /**
    * @param message - error message
    */
    function TypeMismatchError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "TypeMismatchError", message) || this;
    }
    return TypeMismatchError;
}(DOMException));
exports.TypeMismatchError = TypeMismatchError;
var SecurityError = /** @class */ (function (_super) {
    __extends(SecurityError, _super);
    /**
    * @param message - error message
    */
    function SecurityError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "SecurityError", "The operation is insecure. " + message) || this;
    }
    return SecurityError;
}(DOMException));
exports.SecurityError = SecurityError;
var NetworkError = /** @class */ (function (_super) {
    __extends(NetworkError, _super);
    /**
    * @param message - error message
    */
    function NetworkError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "NetworkError", "A network error occurred. " + message) || this;
    }
    return NetworkError;
}(DOMException));
exports.NetworkError = NetworkError;
var AbortError = /** @class */ (function (_super) {
    __extends(AbortError, _super);
    /**
    * @param message - error message
    */
    function AbortError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "AbortError", "The operation was aborted. " + message) || this;
    }
    return AbortError;
}(DOMException));
exports.AbortError = AbortError;
var URLMismatchError = /** @class */ (function (_super) {
    __extends(URLMismatchError, _super);
    /**
    * @param message - error message
    */
    function URLMismatchError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "URLMismatchError", "The given URL does not match another URL. " + message) || this;
    }
    return URLMismatchError;
}(DOMException));
exports.URLMismatchError = URLMismatchError;
var QuotaExceededError = /** @class */ (function (_super) {
    __extends(QuotaExceededError, _super);
    /**
    * @param message - error message
    */
    function QuotaExceededError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "QuotaExceededError", "The quota has been exceeded. " + message) || this;
    }
    return QuotaExceededError;
}(DOMException));
exports.QuotaExceededError = QuotaExceededError;
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    /**
    * @param message - error message
    */
    function TimeoutError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "TimeoutError", "The operation timed out. " + message) || this;
    }
    return TimeoutError;
}(DOMException));
exports.TimeoutError = TimeoutError;
var InvalidNodeTypeError = /** @class */ (function (_super) {
    __extends(InvalidNodeTypeError, _super);
    /**
    * @param message - error message
    */
    function InvalidNodeTypeError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "InvalidNodeTypeError", "The supplied node is incorrect or has an incorrect ancestor for this operation. " + message) || this;
    }
    return InvalidNodeTypeError;
}(DOMException));
exports.InvalidNodeTypeError = InvalidNodeTypeError;
var DataCloneError = /** @class */ (function (_super) {
    __extends(DataCloneError, _super);
    /**
    * @param message - error message
    */
    function DataCloneError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "DataCloneError", "The object can not be cloned. " + message) || this;
    }
    return DataCloneError;
}(DOMException));
exports.DataCloneError = DataCloneError;
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    /**
    * @param message - error message
    */
    function NotImplementedError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "NotImplementedError", "The DOM method is not implemented by this module. " + message) || this;
    }
    return NotImplementedError;
}(DOMException));
exports.NotImplementedError = NotImplementedError;
var HierarchyRequestError = /** @class */ (function (_super) {
    __extends(HierarchyRequestError, _super);
    /**
     * @param message - error message
     */
    function HierarchyRequestError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "HierarchyRequestError", "The operation would yield an incorrect node tree. " + message) || this;
    }
    return HierarchyRequestError;
}(DOMException));
exports.HierarchyRequestError = HierarchyRequestError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    /**
     * @param message - error message
     */
    function NotFoundError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "NotFoundError", "The object can not be found here. " + message) || this;
    }
    return NotFoundError;
}(DOMException));
exports.NotFoundError = NotFoundError;
var IndexSizeError = /** @class */ (function (_super) {
    __extends(IndexSizeError, _super);
    /**
     * @param message - error message
     */
    function IndexSizeError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "IndexSizeError", "The index is not in the allowed range. " + message) || this;
    }
    return IndexSizeError;
}(DOMException));
exports.IndexSizeError = IndexSizeError;
var SyntaxError = /** @class */ (function (_super) {
    __extends(SyntaxError, _super);
    /**
     * @param message - error message
     */
    function SyntaxError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "SyntaxError", "The string did not match the expected pattern. " + message) || this;
    }
    return SyntaxError;
}(DOMException));
exports.SyntaxError = SyntaxError;
var InvalidCharacterError = /** @class */ (function (_super) {
    __extends(InvalidCharacterError, _super);
    /**
     * @param message - error message
     */
    function InvalidCharacterError(message) {
        if (message === void 0) { message = ""; }
        return _super.call(this, "InvalidCharacterError", "The string contains invalid characters. " + message) || this;
    }
    return InvalidCharacterError;
}(DOMException));
exports.InvalidCharacterError = InvalidCharacterError;
//# sourceMappingURL=DOMException.js.map