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
exports.GameScene = void 0;
var rxjs_1 = require("rxjs");
var phaser_1 = require("phaser");
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, { key: "gameScene" }) || this;
        _this._onUpdate = new rxjs_1.Subject();
        _this._onCreate = new rxjs_1.Subject();
        _this.initPlatforms = function () {
            //TODO: refactorear esto para generar platform de archivo de configs
            var platformCount = 7;
            var platformY = 500;
            var lastPlatformX = -200;
            for (var i = 0; i < platformCount; i++) {
                // this.platformsGroup?.create(lastPlatformX, platformY, "ground");
                var ground = new phaser_1.Physics.Matter.Image(_this.matter.world, lastPlatformX, platformY, "ground");
                ground.setBounce(0);
                ground.setStatic(true);
                ground.setOrigin(0.5, 0.5);
                ground.setScale(100, 1);
                _this.matter.world.add(ground);
                lastPlatformX += 200 * 0.5;
            }
            // this.platformsGroup?.addMultiple([
            //   new GameObjects.Rectangle(
            //     this,
            //     -700,
            //     platformY,
            //     10,
            //     1000,
            //     0,
            //     100
            //   ),
            //   new GameObjects.Rectangle(this, 2000, platformY, 10, 1000, 0, 10)
            // ]);
        };
        return _this;
    }
    GameScene.prototype.create = function () {
        this.initPlatforms();
        var background = this.add.image(1250, 300, "background");
        background.scaleY = 2;
        background.scaleX = 2;
        this._onCreate.next();
    };
    GameScene.prototype.update = function (time, delta) {
        this._onUpdate.next({ time: time, delta: delta });
    };
    Object.defineProperty(GameScene.prototype, "onUpdate", {
        get: function () {
            return this._onUpdate;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameScene.prototype, "onCreate", {
        get: function () {
            return this._onCreate;
        },
        enumerable: false,
        configurable: true
    });
    return GameScene;
}(phaser_1.Scene));
exports.GameScene = GameScene;
