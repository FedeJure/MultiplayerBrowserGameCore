"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerState = void 0;
var PlayerState = /** @class */ (function () {
    function PlayerState(savedX, savedY, life, jumpsAvailable) {
        this.life = life;
        this.jumpsAvailable = jumpsAvailable;
        this.inInertia = false;
        this.canMove = true;
        this.position = { x: savedX, y: savedY };
    }
    return PlayerState;
}());
exports.PlayerState = PlayerState;
