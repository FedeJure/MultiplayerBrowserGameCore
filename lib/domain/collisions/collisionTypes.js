"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionType = exports.CollisionCategory = void 0;
var CollisionCategory;
(function (CollisionCategory) {
    CollisionCategory[CollisionCategory["Player"] = 2] = "Player";
    CollisionCategory[CollisionCategory["StaticEnvironment"] = 4] = "StaticEnvironment";
})(CollisionCategory = exports.CollisionCategory || (exports.CollisionCategory = {}));
var CollisionType;
(function (CollisionType) {
    CollisionType[CollisionType["Start"] = 0] = "Start";
    CollisionType[CollisionType["End"] = 1] = "End";
    CollisionType[CollisionType["During"] = 2] = "During";
})(CollisionType = exports.CollisionType || (exports.CollisionType = {}));
