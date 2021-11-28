"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player(config, playerInfo, playerState, playerView) {
        this.config = config;
        this.info = playerInfo;
        this.state = playerState;
        this.view = playerView;
    }
    Player.prototype.destroy = function () {
        this.view.destroy();
    };
    return Player;
}());
exports.Player = Player;
