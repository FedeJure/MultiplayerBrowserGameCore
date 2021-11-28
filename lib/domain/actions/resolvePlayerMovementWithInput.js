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
exports.ResolvePlayerMovementWithInputs = void 0;
var playerConfiguration_1 = require("../player/playerConfiguration");
var side_1 = require("../side");
var ResolvePlayerMovementWithInputs = /** @class */ (function () {
    function ResolvePlayerMovementWithInputs() {
    }
    ResolvePlayerMovementWithInputs.prototype.execute = function (input, view, state, deltaTime) {
        var newVelX = view.body.velocity.x;
        var newVelY = view.body.velocity.y;
        var velocity = 1;
        var maxRunVelocity = 5;
        var availableJumps = state.grounded
            ? playerConfiguration_1.DefaultConfiguration.initialJumps
            : state.jumpsAvailable;
        var canJump = state.canJump;
        var jumping = false;
        if (canJump && availableJumps > 0 && input.jump) {
            newVelY = -5;
            availableJumps--;
            canJump = false;
            jumping = true;
        }
        if (!canJump && availableJumps > 0 && !input.jump)
            canJump = true;
        if ((state.grounded && (input.left || input.right)) || jumping) {
            newVelX += +input.right * velocity * deltaTime;
            newVelX -= +input.left * velocity * deltaTime;
            newVelX =
                Math.sign(newVelX) * Math.min(maxRunVelocity, Math.abs(newVelX));
        }
        if (state.grounded && !input.left && !input.right) {
            newVelX = 0;
        }
        var side = newVelX === 0 ? state.side : newVelX > 0 ? side_1.Side.RIGHT : side_1.Side.LEFT;
        return __assign(__assign({}, state), { velocity: {
                x: Number(newVelX.toPrecision(2)),
                y: Number(newVelY.toPrecision(2)),
            }, jumpsAvailable: availableJumps, position: view.body.position, canJump: canJump, side: side });
    };
    ResolvePlayerMovementWithInputs.prototype.processJump = function () { };
    return ResolvePlayerMovementWithInputs;
}());
exports.ResolvePlayerMovementWithInputs = ResolvePlayerMovementWithInputs;
