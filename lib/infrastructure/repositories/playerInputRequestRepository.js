"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerInputRequestRepository = void 0;
var PlayerInputRequestRepository = /** @class */ (function () {
    function PlayerInputRequestRepository() {
        this.store = new Map();
    }
    PlayerInputRequestRepository.prototype.set = function (playerId, request) {
        this.store.set(playerId, request);
    };
    PlayerInputRequestRepository.prototype.remove = function (playerId) {
        this.store.delete(playerId);
    };
    PlayerInputRequestRepository.prototype.getOrCreate = function (playerId) {
        var requestNumber = this.store.get(playerId);
        if (!requestNumber) {
            requestNumber = 0;
            this.store.set(playerId, requestNumber);
        }
        return requestNumber;
    };
    return PlayerInputRequestRepository;
}());
exports.PlayerInputRequestRepository = PlayerInputRequestRepository;
