"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLocalClientPlayer = void 0;
var playerView_1 = require("../../view/playerView");
var playerConfiguration_1 = require("../player/playerConfiguration");
var player_1 = require("../player/player");
var CreateLocalClientPlayer = /** @class */ (function () {
    function CreateLocalClientPlayer(presenterProvider, connectedPlayersRepository, playerStateRepository) {
        this.presenterProvider = presenterProvider;
        this.connectedPlayersRepository = connectedPlayersRepository;
        this.playerStateRepository = playerStateRepository;
    }
    CreateLocalClientPlayer.prototype.execute = function (info, state, scene, input) {
        var view = new playerView_1.PhaserPlayerView(scene, state.position.x, state.position.y, playerConfiguration_1.DefaultConfiguration.height, playerConfiguration_1.DefaultConfiguration.width);
        console.log(info);
        var player = new player_1.Player(info, state, view);
        scene.addToLifecycle(view);
        this.presenterProvider.forLocalPlayer(input, player);
        this.connectedPlayersRepository.savePlayer(info.id, player);
        this.playerStateRepository.setPlayerState(info.id, player.state);
    };
    return CreateLocalClientPlayer;
}());
exports.CreateLocalClientPlayer = CreateLocalClientPlayer;
