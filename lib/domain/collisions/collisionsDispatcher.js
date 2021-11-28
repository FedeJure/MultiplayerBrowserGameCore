"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionsDispatcher = void 0;
var rxjs_1 = require("rxjs");
var collisionTypes_1 = require("./collisionTypes");
var CollisionsDispatcher = /** @class */ (function () {
    function CollisionsDispatcher() {
        this.subscriptions = new Map();
    }
    CollisionsDispatcher.prototype.subscribeToCollision = function (id) {
        var subject = new rxjs_1.Subject();
        this.subscriptions.set(id, subject);
        return subject;
    };
    CollisionsDispatcher.prototype.sendCollisionStart = function (anEvent) {
        var _this = this;
        anEvent.pairs.forEach(function (pair) {
            _this.sendEventToBody(pair.bodyA, pair.bodyB, pair, collisionTypes_1.CollisionType.Start);
            _this.sendEventToBody(pair.bodyB, pair.bodyA, pair, collisionTypes_1.CollisionType.Start);
        });
    };
    CollisionsDispatcher.prototype.sendCollisionEnd = function (anEvent) {
        var _this = this;
        anEvent.pairs.forEach(function (pair) {
            _this.sendEventToBody(pair.bodyA, pair.bodyB, pair, collisionTypes_1.CollisionType.End);
            _this.sendEventToBody(pair.bodyB, pair.bodyA, pair, collisionTypes_1.CollisionType.End);
        });
    };
    CollisionsDispatcher.prototype.sendEventToBody = function (bodySource, bodyTarget, event, type) {
        var subject = this.subscriptions.get(bodySource.id.toString());
        if (subject)
            subject.next(createData(event, bodyTarget, type));
    };
    return CollisionsDispatcher;
}());
exports.CollisionsDispatcher = CollisionsDispatcher;
function createData(data, bodyTarget, type) {
    return {
        normal: data.collision.normal,
        tangent: data.collision.tangent,
        collidedCategory: bodyTarget.collisionFilter.category,
        type: type
    };
}
