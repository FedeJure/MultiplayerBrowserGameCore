"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyManager = void 0;
var DependencyManager = /** @class */ (function () {
    function DependencyManager() {
    }
    DependencyManager.GetOrInstantiate = function (instantiator) {
        var key = arguments[0].toString();
        if (this._map.has(key))
            return this._map.get(key);
        var instance = instantiator();
        this._map.set(key, instance);
        return instance;
    };
    DependencyManager._map = new Map();
    return DependencyManager;
}());
exports.DependencyManager = DependencyManager;
