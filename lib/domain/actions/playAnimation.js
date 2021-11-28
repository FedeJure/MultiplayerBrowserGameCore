"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playAnim = void 0;
var createAnimationsForPlayer_1 = require("./createAnimationsForPlayer");
function playAnim(player, anim) {
    var _a;
    var key = (0, createAnimationsForPlayer_1.getAnimationForPlayer)(player, anim);
    if (((_a = player.view.anims.currentAnim) === null || _a === void 0 ? void 0 : _a.key) == key)
        return;
    player.view.play(key);
}
exports.playAnim = playAnim;
