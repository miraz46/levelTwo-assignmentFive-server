"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["RIDER"] = "RIDER";
    Role["DRIVER"] = "DRIVER";
})(Role || (exports.Role = Role = {}));
var BlockedStatus;
(function (BlockedStatus) {
    BlockedStatus["BLOCKED"] = "BLOCKED";
    BlockedStatus["UNBLOCKED"] = "UNBLOCKED";
})(BlockedStatus || (exports.BlockedStatus = BlockedStatus = {}));
