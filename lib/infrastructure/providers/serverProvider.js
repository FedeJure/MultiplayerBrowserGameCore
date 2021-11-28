"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerProvider = void 0;
var collisionsDispatcher_1 = require("../../domain/collisions/collisionsDispatcher");
var dependencyManager_1 = require("../dependencyManager");
var connectedPlayersRepository_1 = require("../repositories/connectedPlayersRepository");
var connectionsRepository_1 = require("../repositories/connectionsRepository");
var inMemoryPlayerRepository_1 = require("../repositories/inMemoryPlayerRepository");
var inMemoryPlayerStateRepository_1 = require("../repositories/inMemoryPlayerStateRepository");
var playerInputRequestRepository_1 = require("../repositories/playerInputRequestRepository");
var serverPresenterProvider_1 = require("./serverPresenterProvider");
var ServerProvider = /** @class */ (function () {
    function ServerProvider() {
    }
    Object.defineProperty(ServerProvider, "connectionsRepository", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new connectionsRepository_1.ConnectionsRepository(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerProvider, "playerInfoRepository", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new inMemoryPlayerRepository_1.InMemoryPlayerRepository(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerProvider, "playerStateRepository", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new inMemoryPlayerStateRepository_1.InMemoryPlayerStateRepository(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerProvider, "presenterProvider", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new serverPresenterProvider_1.ServerPresenterProvider(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerProvider, "connectedPlayerRepository", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new connectedPlayersRepository_1.ConnectedPlayersRepository(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerProvider, "collisionsDispatcher", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new collisionsDispatcher_1.CollisionsDispatcher(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerProvider, "playerInputRequestRepository", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new playerInputRequestRepository_1.PlayerInputRequestRepository(); });
        },
        enumerable: false,
        configurable: true
    });
    return ServerProvider;
}());
exports.ServerProvider = ServerProvider;
