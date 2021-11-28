"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPlayerAnimations = exports.getAnimationForPlayer = void 0;
var animations_1 = require("../animations/animations");
function getAnimationForPlayer(player, anim) {
    return player.info.id + "-" + anim;
}
exports.getAnimationForPlayer = getAnimationForPlayer;
function createAnim(player, startFrame, endFrame, key, loop, duration) {
    if (loop === void 0) { loop = true; }
    if (duration === void 0) { duration = 1; }
    player.view.scene.anims.create({
        key: getAnimationForPlayer(player, key),
        frames: player.view.scene.anims.generateFrameNumbers("player_anim", {
            start: startFrame,
            end: endFrame,
        }),
        duration: duration,
        repeat: loop ? -1 : 0,
    });
}
function setupPlayerAnimations(player) {
    player.view.setTexture("player_anim");
    createAnim(player, 0, 2, animations_1.AnimationCode.IDLE, true, 1000);
    createAnim(player, 8, 13, animations_1.AnimationCode.RUNNING, true, 800);
    createAnim(player, 15, 23, animations_1.AnimationCode.IDLE_JUMP, false, 500);
    createAnim(player, 15, 23, animations_1.AnimationCode.RUNNING_JUMP, false, 500);
    createAnim(player, 22, 23, animations_1.AnimationCode.FALLING, true, 200);
}
exports.setupPlayerAnimations = setupPlayerAnimations;
