"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionProvider = void 0;
var dependencyManager_1 = require("../dependencyManager");
var provideClientPlayer_1 = require("../../domain/actions/provideClientPlayer");
var clientProvider_1 = require("./clientProvider");
var provideLocalClientPlayer_1 = require("../../domain/actions/provideLocalClientPlayer");
var providePlayerFromId_1 = require("../../domain/actions/providePlayerFromId");
var serverProvider_1 = require("./serverProvider");
var resolvePlayerMovementWithInput_1 = require("../../domain/actions/resolvePlayerMovementWithInput");
var ActionProvider = /** @class */ (function () {
    function ActionProvider() {
    }
    Object.defineProperty(ActionProvider, "CreateClientPlayer", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () {
                return new provideClientPlayer_1.CreateClientPlayerAction(clientProvider_1.ClientProvider.presenterProvider, clientProvider_1.ClientProvider.connectedPlayers, clientProvider_1.ClientProvider.playerStateRepository);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ActionProvider, "CreateLocalClientPlayer", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () {
                return new provideLocalClientPlayer_1.CreateLocalClientPlayer(clientProvider_1.ClientProvider.presenterProvider, clientProvider_1.ClientProvider.connectedPlayers, clientProvider_1.ClientProvider.playerStateRepository);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ActionProvider, "CreatePlayerFromId", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () {
                return new providePlayerFromId_1.CreatePlayerFromId(serverProvider_1.ServerProvider.playerInfoRepository, serverProvider_1.ServerProvider.playerStateRepository, serverProvider_1.ServerProvider.presenterProvider, serverProvider_1.ServerProvider.connectedPlayerRepository);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ActionProvider, "ResolvePlayerMovementWithInputs", {
        get: function () {
            return dependencyManager_1.DependencyManager.GetOrInstantiate(function () { return new resolvePlayerMovementWithInput_1.ResolvePlayerMovementWithInputs(); });
        },
        enumerable: false,
        configurable: true
    });
    return ActionProvider;
}());
exports.ActionProvider = ActionProvider;
