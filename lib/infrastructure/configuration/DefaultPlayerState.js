"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPlayerState = void 0;
var animations_1 = require("../../domain/animations/animations");
var side_1 = require("../../domain/side");
exports.DefaultPlayerState = {
    life: 100,
    jumpsAvailable: 2,
    inInertia: false,
    position: { x: 100, y: 0 },
    velocity: { x: 0, y: 0 },
    canMove: true,
    canJump: true,
    grounded: false,
    side: side_1.Side.RIGHT,
    inputNumber: 1,
    anim: animations_1.AnimationCode.IDLE
};
