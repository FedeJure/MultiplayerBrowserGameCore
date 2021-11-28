"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disposer = void 0;
var Disposer = /** @class */ (function () {
    function Disposer() {
        this.subscriptions = [];
    }
    Disposer.prototype.dispose = function () {
        this.subscriptions.forEach(function (s) { return s.unsubscribe(); });
        this.subscriptions = [];
    };
    Disposer.prototype.add = function (subscription) {
        this.subscriptions.push(subscription);
    };
    return Disposer;
}());
exports.Disposer = Disposer;
