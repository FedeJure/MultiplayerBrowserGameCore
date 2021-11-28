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
var collisionTypes_1 = require("../../domain/collisions/collisionTypes");
var safeStringify = function (obj, indent) {
    if (indent === void 0) { indent = 2; }
    var cache = [];
    var retVal = JSON.stringify(obj, function (key, value) {
        return typeof value === "object" && value !== null
            ? cache.includes(value)
                ? undefined // Duplicate reference found, discard key
                : cache.push(value) && value // Store value in our collection
            : value;
    }, indent);
    cache = null;
    return retVal;
};
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene(collisionDispatcher) {
        var _this = _super.call(this, { key: "gameScene" }) || this;
        _this._onUpdate = new rxjs_1.Subject();
        _this._onCreate = new rxjs_1.Subject();
        _this.initPlatforms = function () {
            //TODO: refactorear esto para generar platform de archivo de configs
            var ground = new phaser_1.Physics.Matter.Sprite(_this.matter.world, 0, 500, "");
            ground.setScale(100, 1);
            ground.setStatic(true);
            ground.setFriction(0);
            ground.setCollisionCategory(collisionTypes_1.CollisionCategory.StaticEnvironment);
            ground.setCollidesWith([collisionTypes_1.CollisionCategory.Player]);
        };
        _this._collisionDispatcher = collisionDispatcher;
        return _this;
    }
    GameScene.prototype.create = function () {
        this.scene.launch("hud");
        this._lifeCycleObjects = this.add.group({ runChildUpdate: true });
        this.initPlatforms();
        var background = this.add.image(1250, 300, "background");
        background.scaleY = 2;
        background.scaleX = 2;
        this.initCollisions();
        this._onCreate.next();
    };
    GameScene.prototype.initCollisions = function () {
        var _this = this;
        this.matter.world.addListener("collisionstart", function (ev) {
            _this._collisionDispatcher.sendCollisionStart(ev);
        }, this);
        this.matter.world.addListener("collisionend", function (ev) {
            _this._collisionDispatcher.sendCollisionEnd(ev);
        }, this);
    };
    GameScene.prototype.update = function (time, delta) {
        this._onUpdate.next({ time: time, delta: delta });
    };
    GameScene.prototype.addToLifecycle = function (object) {
        var _a;
        (_a = this._lifeCycleObjects) === null || _a === void 0 ? void 0 : _a.add(object);
    };
    GameScene.prototype.removeFromLifecycle = function (object) {
        var _a;
        (_a = this._lifeCycleObjects) === null || _a === void 0 ? void 0 : _a.remove(object);
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
