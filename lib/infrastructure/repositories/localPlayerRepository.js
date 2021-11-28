"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPlayerRepository = void 0;
var LocalPlayerRepository = /** @class */ (function () {
    function LocalPlayerRepository(playerId) {
        this._playerId = playerId;
    }
    Object.defineProperty(LocalPlayerRepository.prototype, "playerId", {
        get: function () {
            return this._playerId;
        },
        enumerable: false,
        configurable: true
    });
    return LocalPlayerRepository;
}());
exports.LocalPlayerRepository = LocalPlayerRepository;
