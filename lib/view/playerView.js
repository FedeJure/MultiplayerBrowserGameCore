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
exports.PhaserPlayerView = void 0;
var phaser_1 = require("phaser");
var rxjs_1 = require("rxjs");
var collisionTypes_1 = require("../domain/collisions/collisionTypes");
var PhaserPlayerView = /** @class */ (function (_super) {
    __extends(PhaserPlayerView, _super);
    function PhaserPlayerView(scene, x, y, height, width) {
        var _this = _super.call(this, scene.matter.world, x, y, "") || this;
        //TODO: ver de crear interfaces en el dominio con todas las propiedades q se usen de Phaser, para aislar
        // el core de la dependencia del framework
        _this._onUpdate = new rxjs_1.Subject();
        _this._onPreUpdate = new rxjs_1.Subject();
        _this.height = height;
        _this.width = width;
        _this.setBounce(0);
        _this.initCollisions(_this);
        return _this;
    }
    PhaserPlayerView.prototype.initCollisions = function (view) {
        view.setCollisionCategory(collisionTypes_1.CollisionCategory.Player);
        view.setCollidesWith([collisionTypes_1.CollisionCategory.StaticEnvironment]);
    };
    PhaserPlayerView.prototype.destroy = function () {
        var _a;
        _super.prototype.destroy.call(this);
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.matter.world.remove(this);
    };
    PhaserPlayerView.prototype.preUpdate = function (time, delta) {
        _super.prototype.preUpdate.call(this, time, delta);
        this._onPreUpdate.next({ time: time, delta: delta });
    };
    PhaserPlayerView.prototype.update = function (time, delta) {
        _super.prototype.update.call(this, time, delta);
        this.setAngle(0); //Prevents to gameobject rotate due Matter physics. Cant find another solution at the moment
        this._onUpdate.next({ time: time, delta: delta });
    };
    Object.defineProperty(PhaserPlayerView.prototype, "onUpdate", {
        get: function () {
            return this._onUpdate;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PhaserPlayerView.prototype, "onPreUpdate", {
        get: function () {
            return this._onPreUpdate;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PhaserPlayerView.prototype, "matterBody", {
        get: function () { return this.body; },
        enumerable: false,
        configurable: true
    });
    return PhaserPlayerView;
}(phaser_1.Physics.Matter.Sprite));
exports.PhaserPlayerView = PhaserPlayerView;
