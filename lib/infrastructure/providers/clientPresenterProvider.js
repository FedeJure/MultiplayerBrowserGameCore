"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPresenterProvider = void 0;
var clientProvider_1 = require("./clientProvider");
var clientPlayerPresenter_1 = require("../../presentation/clientPlayerPresenter");
var clientGamePresenter_1 = require("../../presentation/clientGamePresenter");
var actionProvider_1 = require("./actionProvider");
var playerCollisionDelegator_1 = require("../../domain/collisions/playerCollisionDelegator");
var playerMovementValidationDelegator_1 = require("../../domain/movement/playerMovementValidationDelegator");
var playerInputDelegator_1 = require("../../domain/input/playerInputDelegator");
var localPlayerRenderDelegator_1 = require("../../domain/player/localPlayerRenderDelegator");
var playerRemoteMovementDelegator_1 = require("../../domain/movement/playerRemoteMovementDelegator");
var playerAnimationDelegator_1 = require("../../domain/animations/playerAnimationDelegator");
var remotePlayerAnimationDelegator_1 = require("../../domain/animations/remotePlayerAnimationDelegator");
var ClientPresenterProvider = /** @class */ (function () {
    function ClientPresenterProvider() {
    }
    ClientPresenterProvider.prototype.forLocalPlayer = function (input, player) {
        new clientPlayerPresenter_1.ClientPlayerPresenter(clientProvider_1.ClientProvider.serverConnection, player, [
            new playerCollisionDelegator_1.PlayerCollisionDelegator(player, clientProvider_1.ClientProvider.collisionsDispatcher, clientProvider_1.ClientProvider.playerStateRepository),
            new playerMovementValidationDelegator_1.PlayerMovementValidationDelegator(player, clientProvider_1.ClientProvider.serverConnection, clientProvider_1.ClientProvider.playerStateRepository, clientProvider_1.ClientProvider.playerInputRequestRepository),
            new playerInputDelegator_1.PlayerInputDelegator(player, input, clientProvider_1.ClientProvider.serverConnection, clientProvider_1.ClientProvider.playerStateRepository, actionProvider_1.ActionProvider.ResolvePlayerMovementWithInputs, clientProvider_1.ClientProvider.playerInputRequestRepository),
            new localPlayerRenderDelegator_1.LocalPlayerRenderDelegator(player),
            new playerAnimationDelegator_1.PlayerAnimationDelegator(player, clientProvider_1.ClientProvider.playerStateRepository),
        ]);
    };
    ClientPresenterProvider.prototype.forPlayer = function (player) {
        new clientPlayerPresenter_1.ClientPlayerPresenter(clientProvider_1.ClientProvider.serverConnection, player, [
            // new PlayerMovementValidationDelegator(
            //   player,
            //   ClientProvider.serverConnection,
            //   ClientProvider.playerStateRepository,
            //   ClientProvider.playerInputRequestRepository
            // ),
            new remotePlayerAnimationDelegator_1.RemotePlayerAnimationDelegator(player, clientProvider_1.ClientProvider.playerStateRepository),
            new playerRemoteMovementDelegator_1.PlayerRemoteMovementDelegator(player, clientProvider_1.ClientProvider.serverConnection, clientProvider_1.ClientProvider.playerStateRepository)
        ]);
    };
    ClientPresenterProvider.prototype.forGameplay = function (scene) {
        new clientGamePresenter_1.ClientGamePresenter(clientProvider_1.ClientProvider.localPlayerRepository.playerId, clientProvider_1.ClientProvider.serverConnection, scene, actionProvider_1.ActionProvider.CreateClientPlayer, actionProvider_1.ActionProvider.CreateLocalClientPlayer, clientProvider_1.ClientProvider.connectedPlayers);
    };
    return ClientPresenterProvider;
}());
exports.ClientPresenterProvider = ClientPresenterProvider;
