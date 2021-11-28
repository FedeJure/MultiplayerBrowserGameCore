"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerViewRepository = void 0;
var PlayerViewRepository = /** @class */ (function () {
    function PlayerViewRepository() {
        this.playerDictionary = new Map();
    }
    PlayerViewRepository.prototype.addPlayer = function (player, id) {
        this.playerDictionary.set(id.toString(), player);
    };
    PlayerViewRepository.prototype.getPlayer = function (id) {
        return this.playerDictionary.get(id.toString());
    };
    PlayerViewRepository.prototype.removePlayer = function (id) {
        this.playerDictionary.delete(id.toString());
    };
    return PlayerViewRepository;
}());
exports.PlayerViewRepository = PlayerViewRepository;
