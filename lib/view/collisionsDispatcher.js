"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        var copy = copyCollisionEvent(anEvent);
        anEvent.pairs.forEach(function (pair) {
            _this.sendEventToBody(pair.bodyA, copy);
            _this.sendEventToBody(pair.bodyB, copy);
        });
    };
    CollisionsDispatcher.prototype.sendEventToBody = function (body, event) {
        var subject = this.subscriptions.get(body.id);
        if (subject)
            subject.next(event);
    };
    return CollisionsDispatcher;
}());
exports.CollisionsDispatcher = CollisionsDispatcher;
function copyCollisionEvent(anEvent) {
    return __assign(__assign({}, anEvent), { pairs: anEvent.pairs.map(function (p) { return (__assign(__assign({}, p), { tangent: __assign({}, p.collision.tangent), normal: __assign({}, p.collision.normal) })); }) });
}
