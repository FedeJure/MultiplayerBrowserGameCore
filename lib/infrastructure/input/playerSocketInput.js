"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerSocketInput = void 0;
var rxjs_1 = require("rxjs");
var PlayerSocketInput = /** @class */ (function () {
    function PlayerSocketInput(playerId, connection, inputRequestRepository) {
        var _this = this;
        this._up = false;
        this._down = false;
        this._left = false;
        this._right = false;
        this._jump = false;
        connection
            .onInput()
            .pipe((0, rxjs_1.filter)(function (ev) { return ev.playerId === playerId; }))
            .subscribe(function (inputDto) {
            _this._up = inputDto.input.up;
            _this._down = inputDto.input.down;
            _this._left = inputDto.input.left;
            _this._right = inputDto.input.right;
            _this._jump = inputDto.input.jump;
            inputRequestRepository.set(playerId, inputDto.inputNumber);
        });
    }
    PlayerSocketInput.prototype.toDto = function () {
        throw new Error("Method not implemented.");
    };
    Object.defineProperty(PlayerSocketInput.prototype, "up", {
        get: function () {
            return this._up;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlayerSocketInput.prototype, "down", {
        get: function () {
            return this._down;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlayerSocketInput.prototype, "left", {
        get: function () {
            return this._left;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlayerSocketInput.prototype, "right", {
        get: function () {
            return this._right;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlayerSocketInput.prototype, "jump", {
        get: function () {
            return this._jump;
        },
        enumerable: false,
        configurable: true
    });
    return PlayerSocketInput;
}());
exports.PlayerSocketInput = PlayerSocketInput;
