"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemotePlayerAnimationDelegator = void 0;
var createAnimationsForPlayer_1 = require("../actions/createAnimationsForPlayer");
var playAnimation_1 = require("../actions/playAnimation");
var RemotePlayerAnimationDelegator = /** @class */ (function () {
    function RemotePlayerAnimationDelegator(player, statesRepository) {
        this.statesRepository = statesRepository;
        this.player = player;
    }
    RemotePlayerAnimationDelegator.prototype.init = function () {
        (0, createAnimationsForPlayer_1.setupPlayerAnimations)(this.player);
    };
    RemotePlayerAnimationDelegator.prototype.stop = function () { };
    RemotePlayerAnimationDelegator.prototype.update = function (time, delta) {
        var state = this.statesRepository.getPlayerState(this.player.info.id);
        if (state)
            (0, playAnimation_1.playAnim)(this.player, state.anim);
    };
    return RemotePlayerAnimationDelegator;
}());
exports.RemotePlayerAnimationDelegator = RemotePlayerAnimationDelegator;
