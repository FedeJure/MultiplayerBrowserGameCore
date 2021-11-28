"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMovementValidationDelegator = void 0;
var phaser_1 = require("phaser");
var disposer_1 = require("../disposer");
var PlayerMovementValidationDelegator = /** @class */ (function () {
    function PlayerMovementValidationDelegator(player, connection, stateRepository, inputRepository) {
        this.disposer = new disposer_1.Disposer();
        this.lastInputValidated = 0;
        this.player = player;
        this.connection = connection;
        this.stateRepository = stateRepository;
        this.inputRepository = inputRepository;
    }
    PlayerMovementValidationDelegator.prototype.update = function (time, delta) { };
    PlayerMovementValidationDelegator.prototype.init = function () {
        var _this = this;
        this.disposer.add(this.connection.onPlayersStates.subscribe(function (event) {
            var state = event.states[_this.player.info.id];
            if (state &&
                _this.inputRepository.getOrCreate(_this.player.info.id) ==
                    state.inputNumber &&
                state.inputNumber >= _this.lastInputValidated) {
                _this.lastInputValidated = state.inputNumber;
                var localState = _this.stateRepository.getPlayerState(_this.player.info.id);
                if (localState)
                    _this.validatePosition(localState, state);
            }
        }));
    };
    PlayerMovementValidationDelegator.prototype.validatePosition = function (state, remoteState) {
        var distance = phaser_1.Math.Distance.BetweenPoints(remoteState.position, state.position);
        this.player.view.scene.tweens.add({
            targets: this.player.view,
            x: remoteState.position.x,
            y: remoteState.position.y,
            duration: distance,
        });
    };
    PlayerMovementValidationDelegator.prototype.stop = function () { };
    return PlayerMovementValidationDelegator;
}());
exports.PlayerMovementValidationDelegator = PlayerMovementValidationDelegator;
