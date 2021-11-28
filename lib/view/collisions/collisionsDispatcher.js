"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionsDispatcher = void 0;
var rxjs_1 = require("rxjs");
var CollisionsDispatcher = /** @class */ (function () {
    function CollisionsDispatcher() {
        this.subscriptions = new Map();
    }
    CollisionsDispatcher.prototype.subscribeToStartCollision = function (bodyId) {
        var subject = new rxjs_1.Subject();
        this.subscriptions.set(bodyId, subject);
        return subject;
    };
    CollisionsDispatcher.prototype.sendCollisionStart = function (anEvent) {
        var _this = this;
        anEvent.pairs.forEach(function (pair) {
            _this.sendEventToBody(pair.bodyA, pair.bodyB, pair);
            _this.sendEventToBody(pair.bodyB, pair.bodyA, pair);
        });
    };
    CollisionsDispatcher.prototype.sendEventToBody = function (bodySource, bodyTarget, event) {
        var subject = this.subscriptions.get(bodySource.id);
        if (subject)
            subject.next(createData(event, bodyTarget));
    };
    return CollisionsDispatcher;
}());
exports.CollisionsDispatcher = CollisionsDispatcher;
function createData(data, bodyTarget) {
    return {
        normal: data.collision.normal,
        tangent: data.collision.tangent,
        collidedCategory: bodyTarget.collisionFilter.category,
    };
}
