"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerKeyBoardInput = void 0;
var phaser_1 = require("phaser");
var PlayerKeyBoardInput = /** @class */ (function () {
    function PlayerKeyBoardInput(phaserInput) {
        this.input = phaserInput.addKeys({
            up: phaser_1.Input.Keyboard.KeyCodes.W,
            down: phaser_1.Input.Keyboard.KeyCodes.S,
            left: phaser_1.Input.Keyboard.KeyCodes.A,
            right: phaser_1.Input.Keyboard.KeyCodes.D,
            jump: phaser_1.Input.Keyboard.KeyCodes.SPACE,
        });
    }
    PlayerKeyBoardInput.prototype.toDto = function () {
        return {
            up: this.up,
            down: this.down,
            left: this.left,
            right: this.right,
            jump: this.jump,
        };
    };
    Object.defineProperty(PlayerKeyBoardInput.prototype, "up", {
        get: function () {
            return this.input.up.isDown;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlayerKeyBoardInput.prototype, "down", {
        get: function () {
            return this.input.down.isDown;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlayerKeyBoardInput.prototype, "left", {
        get: function () {
            return this.input.left.isDown;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlayerKeyBoardInput.prototype, "right", {
        get: function () {
            return this.input.right.isDown;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlayerKeyBoardInput.prototype, "jump", {
        get: function () {
            return this.input.jump.isDown;
        },
        enumerable: false,
        configurable: true
    });
    return PlayerKeyBoardInput;
}());
exports.PlayerKeyBoardInput = PlayerKeyBoardInput;
