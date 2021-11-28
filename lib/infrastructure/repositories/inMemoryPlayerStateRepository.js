"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPlayerStateRepository = void 0;
var InMemoryPlayerStateRepository = /** @class */ (function () {
    function InMemoryPlayerStateRepository() {
        this.store = {};
    }
    InMemoryPlayerStateRepository.prototype.getPlayerState = function (id) {
        return this.store[id];
    };
    InMemoryPlayerStateRepository.prototype.setPlayerState = function (id, state) {
        this.store[id] = state;
    };
    InMemoryPlayerStateRepository.prototype.getAll = function () {
        return this.store;
    };
    return InMemoryPlayerStateRepository;
}());
exports.InMemoryPlayerStateRepository = InMemoryPlayerStateRepository;
