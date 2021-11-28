"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionEventType = void 0;
var CollisionEventType;
(function (CollisionEventType) {
    CollisionEventType[CollisionEventType["StartCollision"] = 1] = "StartCollision";
    CollisionEventType[CollisionEventType["ActiveCollision"] = 2] = "ActiveCollision";
    CollisionEventType[CollisionEventType["EndCollision"] = 3] = "EndCollision";
})(CollisionEventType = exports.CollisionEventType || (exports.CollisionEventType = {}));
