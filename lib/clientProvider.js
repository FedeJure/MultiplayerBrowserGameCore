"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientProvider = void 0;
var clientPresenterProvider_1 = require("./infrastructure/clientPresenterProvider");
var dependencyManager_1 = require("./infrastructure/dependencyManager");
var connectedPlayersRepository_1 = require("./infrastructure/repositories/connectedPlayersRepository");
var ClientProvider = /** @class */ (function () {
    function ClientProvider() {
    }
    ClientProvider.Init = function (serverConnection, localPlayerRepository) {
        ClientProvider._serverConnection = serverConnection;
        ClientProvider._localPlayerRepository = localPlayerRepository;
    };
    Object.defineProperty(ClientProvider, "presenterProvider", {
        get: function () { return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new clientPresenterProvider_1.ClientPresenterProvider(); }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientProvider, "serverConnection", {
        get: function () { return ClientProvider._serverConnection; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientProvider, "localPlayerRepository", {
        get: function () { return ClientProvider._localPlayerRepository; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientProvider, "connectedPlayers", {
        get: function () { return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new connectedPlayersRepository_1.ConnectedPlayersRepository(); }); },
        enumerable: false,
        configurable: true
    });
    return ClientProvider;
}());
exports.ClientProvider = ClientProvider;
