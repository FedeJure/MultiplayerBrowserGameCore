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
exports.ClientGameScene = void 0;
var GameScene_1 = require("./GameScene");
var GameSceneConfig = require("./GameSceneConfig.json");
var ClientGameScene = /** @class */ (function (_super) {
    __extends(ClientGameScene, _super);
    function ClientGameScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.create = function () {
            var background = _this.add.image(1250, 300, "background");
            background.height = 600;
            background.scaleY = 2;
            background.scaleX = 2;
        };
        return _this;
        // addPlayers(players: Array<Player>) {
        //     super.addPlayers(players)
        //     players.forEach((player : Player) => {
        //         console.log(player)
        //         const view : PlayerView | undefined = this.playerViewRepository.getPlayer(player.playerInfo.id)
        //         if (view != undefined){
        //             const sprite = new Phaser.Physics.Arcade.Sprite(this, 0, 0, "player")
        //             sprite.setOrigin(0.5, 0.5);
        //             sprite.scaleX = 1;
        //             sprite.scaleY = 1;
        //             view.add(sprite)
        //             this.add.existing(sprite)
        //             this.cameras.main.startFollow(view);
        //             this.cameras.main.zoom = 1.1;
        //         }
        //     })
        // }
    }
    ClientGameScene.prototype.preload = function () {
        var _this = this;
        GameSceneConfig.assets.spritesheets.forEach(function (image) {
            _this.load.spritesheet(image.name, image.path, image);
        });
        GameSceneConfig.assets.images.forEach(function (image) {
            _this.load.image(image.name, image.path);
        });
    };
    return ClientGameScene;
}(GameScene_1.GameScene));
exports.ClientGameScene = ClientGameScene;
