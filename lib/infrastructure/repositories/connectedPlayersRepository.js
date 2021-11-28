"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedPlayersRepository = void 0;
var ConnectedPlayersRepository = /** @class */ (function () {
    function ConnectedPlayersRepository() {
        this.players = new Map();
    }
    ConnectedPlayersRepository.prototype.savePlayer = function (playerId, player) {
        this.players.set(playerId, player);
    };
    ConnectedPlayersRepository.prototype.removePlayer = function (playerId) {
        this.players.delete(playerId);
    };
    ConnectedPlayersRepository.prototype.getPlayer = function (playerId) {
        return this.players.get(playerId);
    };
    ConnectedPlayersRepository.prototype.getAll = function () {
        return this.players;
    };
    return ConnectedPlayersRepository;
}());
exports.ConnectedPlayersRepository = ConnectedPlayersRepository;
