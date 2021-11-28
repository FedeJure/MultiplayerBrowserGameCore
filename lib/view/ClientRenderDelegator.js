"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRenderDelegator = void 0;
var PlayerRenderDelegator = /** @class */ (function () {
    function PlayerRenderDelegator() {
    }
    PlayerRenderDelegator.prototype.renderLocalPlayer = function (player) {
        player.scene.cameras.main.startFollow(player);
    };
    PlayerRenderDelegator.prototype.renderPlayer = function (player) {
        this.createAnimations(player);
        player.setTexture("player_anim");
        player.anims.play("idle");
        player.scene.add.existing(player);
    };
    PlayerRenderDelegator.prototype.createAnimations = function (player) {
        if (!player.scene.anims.exists("idle"))
            player.scene.anims.create({
                key: "idle",
                frames: player.scene.anims.generateFrameNumbers("player_anim", { start: 0, end: 2 }),
                frameRate: 5,
                repeat: -1
            });
    };
    return PlayerRenderDelegator;
}());
exports.PlayerRenderDelegator = PlayerRenderDelegator;
