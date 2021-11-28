"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClientPlayerAction = void 0;
var playerView_1 = require("../../view/playerView");
var playerConfiguration_1 = require("../player/playerConfiguration");
var player_1 = require("../player/player");
var CreateClientPlayerAction = /** @class */ (function () {
    function CreateClientPlayerAction(presenterProvider, connectedPlayersRepository, playerStateRepository) {
        this.presenterProvider = presenterProvider;
        this.connectedPlayersRepository = connectedPlayersRepository;
        this.playerStateRepository = playerStateRepository;
    }
    CreateClientPlayerAction.prototype.execute = function (info, state, scene) {
        var view = new playerView_1.PhaserPlayerView(scene, state.position.x, state.position.y, playerConfiguration_1.DefaultConfiguration.height, playerConfiguration_1.DefaultConfiguration.width);
        var player = new player_1.Player(info, state, view);
        this.presenterProvider.forPlayer(player);
        this.connectedPlayersRepository.savePlayer(info.id, player);
        this.playerStateRepository.setPlayerState(info.id, player.state);
        scene.addToLifecycle(view);
    };
    return CreateClientPlayerAction;
}());
exports.CreateClientPlayerAction = CreateClientPlayerAction;
