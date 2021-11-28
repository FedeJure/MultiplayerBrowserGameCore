"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerProvider = void 0;
var dependencyManager_1 = require("./infrastructure/dependencyManager");
var connectedPlayersRepository_1 = require("./infrastructure/repositories/connectedPlayersRepository");
var connectionsRepository_1 = require("./infrastructure/repositories/connectionsRepository");
var inMemoryPlayerRepository_1 = require("./infrastructure/repositories/inMemoryPlayerRepository");
var inMemoryPlayerStateRepository_1 = require("./infrastructure/repositories/inMemoryPlayerStateRepository");
var serverPresenterProvider_1 = require("./infrastructure/serverPresenterProvider");
var ServerProvider = /** @class */ (function () {
    function ServerProvider() {
    }
    Object.defineProperty(ServerProvider, "connectionsRepository", {
        get: function () { return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new connectionsRepository_1.ConnectionsRepository(); }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerProvider, "playerInfoRepository", {
        get: function () { return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new inMemoryPlayerRepository_1.InMemoryPlayerRepository(); }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerProvider, "playerStateRepository", {
        get: function () { return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new inMemoryPlayerStateRepository_1.InMemoryPlayerStateRepository(); }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerProvider, "presenterProvider", {
        get: function () { return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new serverPresenterProvider_1.ServerPresenterProvider(); }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerProvider, "connectedPlayerRepository", {
        get: function () { return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new connectedPlayersRepository_1.ConnectedPlayersRepository(); }); },
        enumerable: false,
        configurable: true
    });
    return ServerProvider;
}());
exports.ServerProvider = ServerProvider;
