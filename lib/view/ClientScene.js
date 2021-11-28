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
exports.ClientScene = void 0;
var GameScene_1 = require("./GameScene");
var ClientScene = /** @class */ (function (_super) {
    __extends(ClientScene, _super);
    function ClientScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClientScene.prototype.preload = function () {
        this.load.spritesheet("player", "assets/player_anims.png", {
            frameWidth: 50,
            frameHeight: 37
        });
        this.load.image("background", "./assets/background.png");
        this.load.image("ground", "./assets/simple_platform.png");
    };
    ClientScene.prototype.create = function () {
        _super.prototype.create.call(this);
        var background = this.add.image(1250, 300, "background");
        background.scaleY = 2;
        background.scaleX = 2;
    };
    ClientScene.prototype.addPlayers = function (players) {
        _super.prototype.addPlayers.call(this, players);
        console.log(players);
    };
    return ClientScene;
}(GameScene_1.GameScene));
exports.ClientScene = ClientScene;
