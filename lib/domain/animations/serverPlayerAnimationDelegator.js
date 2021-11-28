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
exports.ServerPlayerAnimationDelegator = void 0;
var animations_1 = require("./animations");
var ServerPlayerAnimationDelegator = /** @class */ (function () {
    function ServerPlayerAnimationDelegator(player, statesRepository) {
        this.statesRepository = statesRepository;
        this.player = player;
    }
    ServerPlayerAnimationDelegator.prototype.init = function () { };
    ServerPlayerAnimationDelegator.prototype.stop = function () { };
    ServerPlayerAnimationDelegator.prototype.update = function (time, delta) {
        var state = this.statesRepository.getPlayerState(this.player.info.id);
        if (state) {
            var currentAnim = this.getAnimation(state);
            if (currentAnim) {
                this.statesRepository.setPlayerState(this.player.info.id, __assign(__assign({}, state), { anim: currentAnim }));
            }
        }
    };
    ServerPlayerAnimationDelegator.prototype.getAnimation = function (state) {
        var absVelx = Math.abs(state.velocity.x);
        var absVely = Math.abs(state.velocity.y);
        var velY = state.velocity.y;
        // if (state.grounded && absVely === 0 && absVelx === 0) return AnimationCode.IDLE;
        if (!state.grounded && velY > 2)
            return animations_1.AnimationCode.FALLING;
        if (state.grounded && absVelx > 1 && absVely < 2)
            return animations_1.AnimationCode.RUNNING;
        if (!state.grounded && absVelx < 1 && velY < 2)
            return animations_1.AnimationCode.IDLE_JUMP;
        if (!state.grounded && absVelx >= 1 && velY < 2)
            return animations_1.AnimationCode.RUNNING_JUMP;
        return animations_1.AnimationCode.IDLE;
    };
    return ServerPlayerAnimationDelegator;
}());
exports.ServerPlayerAnimationDelegator = ServerPlayerAnimationDelegator;
