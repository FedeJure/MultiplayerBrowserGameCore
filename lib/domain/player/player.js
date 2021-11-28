"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player(playerInfo, playerState, playerView) {
        this.info = playerInfo;
        this._state = playerState;
        this.view = playerView;
    }
    Object.defineProperty(Player.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    Player.prototype.destroy = function () {
        this.view.destroy();
    };
    return Player;
}());
exports.Player = Player;
