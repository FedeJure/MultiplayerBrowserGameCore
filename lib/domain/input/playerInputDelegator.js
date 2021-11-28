"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerInputDelegator = void 0;
var side_1 = require("../side");
var PlayerInputDelegator = /** @class */ (function () {
    function PlayerInputDelegator(player, input, connection, statesRepository, resolveMovement, inputRequestRepository) {
        this.lastInputSended = "";
        this.player = player;
        this.connection = connection;
        this.statesRepository = statesRepository;
        this.input = input;
        this.resolveMovement = resolveMovement;
        this.inputRequestRepository = inputRequestRepository;
    }
    PlayerInputDelegator.prototype.init = function () { };
    PlayerInputDelegator.prototype.stop = function () { };
    PlayerInputDelegator.prototype.update = function (time, delta) {
        var currentInput = this.input.toDto();
        this.currentInput = currentInput;
        var oldState = this.statesRepository.getPlayerState(this.player.info.id);
        if (__spreadArray([this.inputHasChange()], Object.values(currentInput)).some(function (a) { return a; }) ||
            oldState != this.savedState) {
            var newInputRequest = this.inputRequestRepository.getOrCreate(this.player.info.id) + 1;
            this.connection.emitInput(this.player.info.id, currentInput, newInputRequest);
            this.inputRequestRepository.set(this.player.info.id, newInputRequest);
        }
        if (oldState) {
            var newState = this.resolveMovement.execute(this.input, this.player.view, oldState, delta);
            this.player.view.setVelocity(newState.velocity.x, newState.velocity.y);
            this.player.view.setPosition(newState.position.x, newState.position.y);
            this.player.view.setScale((newState.side == side_1.Side.RIGHT ? 1 : -1) *
                Math.abs(this.player.view.scaleX), this.player.view.scaleY);
            this.statesRepository.setPlayerState(this.player.info.id, newState);
            this.savedState = newState;
        }
        this.lastInputSended = JSON.stringify(currentInput);
    };
    PlayerInputDelegator.prototype.inputHasChange = function () {
        return (!this.lastInputSended ||
            JSON.stringify(this.currentInput) != this.lastInputSended);
    };
    return PlayerInputDelegator;
}());
exports.PlayerInputDelegator = PlayerInputDelegator;
