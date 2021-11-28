"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPlayerRenderDelegator = void 0;
var LocalPlayerRenderDelegator = /** @class */ (function () {
    function LocalPlayerRenderDelegator(player) {
        this.player = player;
    }
    LocalPlayerRenderDelegator.prototype.init = function () {
        this.player.view.scene.cameras.main.startFollow(this.player.view);
        this.player.view.scene.cameras.main.setZoom(2, 2);
    };
    LocalPlayerRenderDelegator.prototype.stop = function () {
    };
    LocalPlayerRenderDelegator.prototype.update = function (time, delta) {
    };
    return LocalPlayerRenderDelegator;
}());
exports.LocalPlayerRenderDelegator = LocalPlayerRenderDelegator;
