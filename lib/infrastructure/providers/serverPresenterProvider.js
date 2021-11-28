"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPresenterProvider = void 0;
var serverPlayerAnimationDelegator_1 = require("../../domain/animations/serverPlayerAnimationDelegator");
var playerCollisionDelegator_1 = require("../../domain/collisions/playerCollisionDelegator");
var serverPlayerPresenter_1 = require("../../presentation/serverPlayerPresenter");
var actionProvider_1 = require("./actionProvider");
var serverProvider_1 = require("./serverProvider");
var ServerPresenterProvider = /** @class */ (function () {
    function ServerPresenterProvider() {
    }
    ServerPresenterProvider.prototype.forPlayer = function (player, input) {
        new serverPlayerPresenter_1.ServerPlayerPresenter(player, input, actionProvider_1.ActionProvider.ResolvePlayerMovementWithInputs, serverProvider_1.ServerProvider.playerStateRepository, [
            new playerCollisionDelegator_1.PlayerCollisionDelegator(player, serverProvider_1.ServerProvider.collisionsDispatcher, serverProvider_1.ServerProvider.playerStateRepository),
            new serverPlayerAnimationDelegator_1.ServerPlayerAnimationDelegator(player, serverProvider_1.ServerProvider.playerStateRepository),
        ], serverProvider_1.ServerProvider.playerInputRequestRepository);
    };
    return ServerPresenterProvider;
}());
exports.ServerPresenterProvider = ServerPresenterProvider;
