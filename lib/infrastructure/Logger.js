"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
function Log(classType) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var d = new Date();
    var name = classType.constructor ? classType.constructor.name : classType;
    console.log.apply(console, __spreadArray([d.toUTCString() + " -- [" + name + "] ::"], args));
}
exports.Log = Log;
