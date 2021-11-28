"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadScene = void 0;
var LoadScene = /** @class */ (function (_super) {
    __extends(LoadScene, _super);
    function LoadScene() {
        return _super.call(this, { key: "loadScene" }) || this;
    }
    LoadScene.prototype.preload = function () {
        var _this = this;
        this.load.spritesheet("player_anim", "./assets/player_anims.png", {
            frameWidth: 50,
            frameHeight: 37
        });
        // this.load.image("player", "./assets/player.png");
        this.load.image("background", "./assets/background.png");
        this.load.image("ground", "./assets/simple_platform.png");
        this.load.on('complete', function () { return _this.scene.start("gameScene"); });
    };
    return LoadScene;
}(Phaser.Scene));
exports.LoadScene = LoadScene;
