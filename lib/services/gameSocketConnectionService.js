"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSocketConnectionService = void 0;
var gameEvents_1 = require("../infrastructure/events/gameEvents");
var GameSocketConnectionService = /** @class */ (function () {
    function GameSocketConnectionService(socket) {
        socket.on(gameEvents_1.GameEvents.PLAYER_CONNECTED, this.processPlayerConnected);
    }
    GameSocketConnectionService.prototype.processPlayerConnected = function (data) {
        console.log(data);
    };
    return GameSocketConnectionService;
}());
exports.GameSocketConnectionService = GameSocketConnectionService;
