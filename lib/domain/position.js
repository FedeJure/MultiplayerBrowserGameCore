"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    Position.prototype.toString = function () {
        return "[" + this.x + "," + this.y + "]";
    };
    Position.fromString = function (stringifyPosition) {
        try {
            var data = JSON.parse(stringifyPosition);
            return new Position(data[0], data[1]);
        }
        catch (error) {
            throw new Error("[Position] :: Error constructing position, the string must be of type '[1,2]' ");
        }
    };
    return Position;
}());
exports.Position = Position;
