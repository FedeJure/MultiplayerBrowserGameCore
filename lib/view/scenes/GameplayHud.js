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
exports.GameplayHud = void 0;
var phaser_1 = require("phaser");
var GameplayHud = /** @class */ (function (_super) {
    __extends(GameplayHud, _super);
    function GameplayHud(connection) {
        var _this = _super.call(this, { key: "hud" }) || this;
        _this.connection = connection;
        return _this;
    }
    GameplayHud.prototype.create = function () {
        var _this = this;
        this.pingText = new Phaser.GameObjects.Text(this, 10, 10, this.getPingText(0), { font: "12px Arial", color: "#000000" });
        this.fpsText = new Phaser.GameObjects.Text(this, 70, 10, this.getFpsText(), { font: "12px Arial", color: "#000000" });
        this.add.existing(this.pingText);
        this.add.existing(this.fpsText);
        this.connection.onPing.subscribe(function (ping) {
            var _a;
            (_a = _this.pingText) === null || _a === void 0 ? void 0 : _a.setText(_this.getPingText(ping));
        });
    };
    GameplayHud.prototype.update = function () {
        var _a;
        (_a = this.fpsText) === null || _a === void 0 ? void 0 : _a.setText(this.getFpsText());
    };
    GameplayHud.prototype.getPingText = function (ping) {
        return "ms: ".concat(ping);
    };
    GameplayHud.prototype.getFpsText = function () {
        return "fps: ".concat(Math.floor(this.game.loop.actualFps));
    };
    return GameplayHud;
}(phaser_1.Scene));
exports.GameplayHud = GameplayHud;
