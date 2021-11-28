"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRemoteMovementDelegator = void 0;
var disposer_1 = require("../disposer");
var side_1 = require("../side");
var PlayerRemoteMovementDelegator = /** @class */ (function () {
    function PlayerRemoteMovementDelegator(player, connection, playerStateRepository) {
        this.disposer = new disposer_1.Disposer();
        this.player = player;
        this.connection = connection;
        this.playerStateRepository = playerStateRepository;
    }
    PlayerRemoteMovementDelegator.prototype.init = function () {
        var _this = this;
        this.disposer.add(this.connection.onPlayersStates.subscribe(function (event) {
            var state = event.states[_this.player.info.id];
            if (state)
                _this.playerStateRepository.setPlayerState(_this.player.info.id, state);
        }));
    };
    PlayerRemoteMovementDelegator.prototype.stop = function () {
        this.disposer.dispose();
    };
    PlayerRemoteMovementDelegator.prototype.update = function (time, delta) {
        var state = this.playerStateRepository.getPlayerState(this.player.info.id);
        if (state) {
            var view = this.player.view;
            view.setScale((state.side == side_1.Side.RIGHT ? 1 : -1) *
                Math.abs(this.player.view.scaleX), this.player.view.scaleY);
            view.setPosition(state.position.x, state.position.y);
            view.setVelocity(state.velocity.x, state.velocity.y);
        }
    };
    return PlayerRemoteMovementDelegator;
}());
exports.PlayerRemoteMovementDelegator = PlayerRemoteMovementDelegator;
