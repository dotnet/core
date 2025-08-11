"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines the position of a boundary point relative to another.
 */
var BoundaryPosition;
(function (BoundaryPosition) {
    BoundaryPosition[BoundaryPosition["Before"] = 0] = "Before";
    BoundaryPosition[BoundaryPosition["Equal"] = 1] = "Equal";
    BoundaryPosition[BoundaryPosition["After"] = 2] = "After";
})(BoundaryPosition = exports.BoundaryPosition || (exports.BoundaryPosition = {}));
/**
 * Defines the event phase.
 */
var EventPhase;
(function (EventPhase) {
    EventPhase[EventPhase["None"] = 0] = "None";
    EventPhase[EventPhase["Capturing"] = 1] = "Capturing";
    EventPhase[EventPhase["AtTarget"] = 2] = "AtTarget";
    EventPhase[EventPhase["Bubbling"] = 3] = "Bubbling";
})(EventPhase = exports.EventPhase || (exports.EventPhase = {}));
/**
 * Defines the type of a node object.
 */
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Element"] = 1] = "Element";
    NodeType[NodeType["Attribute"] = 2] = "Attribute";
    NodeType[NodeType["Text"] = 3] = "Text";
    NodeType[NodeType["CData"] = 4] = "CData";
    NodeType[NodeType["EntityReference"] = 5] = "EntityReference";
    NodeType[NodeType["Entity"] = 6] = "Entity";
    NodeType[NodeType["ProcessingInstruction"] = 7] = "ProcessingInstruction";
    NodeType[NodeType["Comment"] = 8] = "Comment";
    NodeType[NodeType["Document"] = 9] = "Document";
    NodeType[NodeType["DocumentType"] = 10] = "DocumentType";
    NodeType[NodeType["DocumentFragment"] = 11] = "DocumentFragment";
    NodeType[NodeType["Notation"] = 12] = "Notation"; // historical
})(NodeType = exports.NodeType || (exports.NodeType = {}));
/**
 * Defines the position of a node in the document relative to another
 * node.
 */
var Position;
(function (Position) {
    Position[Position["Disconnected"] = 1] = "Disconnected";
    Position[Position["Preceding"] = 2] = "Preceding";
    Position[Position["Following"] = 4] = "Following";
    Position[Position["Contains"] = 8] = "Contains";
    Position[Position["ContainedBy"] = 16] = "ContainedBy";
    Position[Position["ImplementationSpecific"] = 32] = "ImplementationSpecific";
})(Position = exports.Position || (exports.Position = {}));
/**
 * Defines the return value of a filter callback.
 */
var FilterResult;
(function (FilterResult) {
    FilterResult[FilterResult["Accept"] = 1] = "Accept";
    FilterResult[FilterResult["Reject"] = 2] = "Reject";
    FilterResult[FilterResult["Skip"] = 3] = "Skip";
})(FilterResult = exports.FilterResult || (exports.FilterResult = {}));
/**
 * Defines what to show in node filter.
 */
var WhatToShow;
(function (WhatToShow) {
    WhatToShow[WhatToShow["All"] = 4294967295] = "All";
    WhatToShow[WhatToShow["Element"] = 1] = "Element";
    WhatToShow[WhatToShow["Attribute"] = 2] = "Attribute";
    WhatToShow[WhatToShow["Text"] = 4] = "Text";
    WhatToShow[WhatToShow["CDataSection"] = 8] = "CDataSection";
    WhatToShow[WhatToShow["EntityReference"] = 16] = "EntityReference";
    WhatToShow[WhatToShow["Entity"] = 32] = "Entity";
    WhatToShow[WhatToShow["ProcessingInstruction"] = 64] = "ProcessingInstruction";
    WhatToShow[WhatToShow["Comment"] = 128] = "Comment";
    WhatToShow[WhatToShow["Document"] = 256] = "Document";
    WhatToShow[WhatToShow["DocumentType"] = 512] = "DocumentType";
    WhatToShow[WhatToShow["DocumentFragment"] = 1024] = "DocumentFragment";
    WhatToShow[WhatToShow["Notation"] = 2048] = "Notation";
})(WhatToShow = exports.WhatToShow || (exports.WhatToShow = {}));
/**
 * Defines how boundary points are compared.
 */
var HowToCompare;
(function (HowToCompare) {
    HowToCompare[HowToCompare["StartToStart"] = 0] = "StartToStart";
    HowToCompare[HowToCompare["StartToEnd"] = 1] = "StartToEnd";
    HowToCompare[HowToCompare["EndToEnd"] = 2] = "EndToEnd";
    HowToCompare[HowToCompare["EndToStart"] = 3] = "EndToStart";
})(HowToCompare = exports.HowToCompare || (exports.HowToCompare = {}));
//# sourceMappingURL=interfaces.js.map