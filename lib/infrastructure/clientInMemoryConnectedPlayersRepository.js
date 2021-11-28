"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientInMemoryConnectedPlayersRepository = void 0;
var rxjs_1 = require("rxjs");
var ClientInMemoryConnectedPlayersRepository = /** @class */ (function () {
    function ClientInMemoryConnectedPlayersRepository() {
        this.players = new Map();
        this._onStateChange = new rxjs_1.Subject();
    }
    ClientInMemoryConnectedPlayersRepository.prototype.onStateChange = function (playerId) {
        return this._onStateChange.pipe(rxjs_1.filter(function (s) { return s.id === playerId; }));
    };
    ClientInMemoryConnectedPlayersRepository.prototype.saveState = function (playerId, state) {
        this.players.set(playerId, state);
        this._onStateChange.next(state);
    };
    ClientInMemoryConnectedPlayersRepository.prototype.getState = function (playerId) {
        return this.players.get(playerId);
    };
    return ClientInMemoryConnectedPlayersRepository;
}());
exports.ClientInMemoryConnectedPlayersRepository = ClientInMemoryConnectedPlayersRepository;
