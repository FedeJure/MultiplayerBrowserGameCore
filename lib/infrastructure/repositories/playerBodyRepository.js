"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerBodyRepository = void 0;
var PlayerBodyRepository = /** @class */ (function () {
    function PlayerBodyRepository() {
        this.playerBody = new Map();
        this.bodyPlayer = new Map();
    }
    PlayerBodyRepository.prototype.getPlayerIdFromBodyId = function (bodyId) {
        return this.bodyPlayer.get(bodyId);
    };
    PlayerBodyRepository.prototype.getBodyIdFromPlayerId = function (playerId) {
        return this.playerBody.get(playerId);
    };
    return PlayerBodyRepository;
}());
exports.PlayerBodyRepository = PlayerBodyRepository;
