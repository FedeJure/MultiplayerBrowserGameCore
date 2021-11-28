"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlayerFromId = void 0;
var player_1 = require("../../domain/player/player");
var playerView_1 = require("../../view/playerView");
var playerConfiguration_1 = require("../player/playerConfiguration");
var playerSocketInput_1 = require("../../infrastructure/input/playerSocketInput");
var serverProvider_1 = require("../../infrastructure/providers/serverProvider");
var DefaultPlayerState_1 = require("../../infrastructure/configuration/DefaultPlayerState");
var CreatePlayerFromId = /** @class */ (function () {
    function CreatePlayerFromId(infoRepository, stateRepository, presenterProvider, connectedPlayersRepository) {
        this.infoRepository = infoRepository;
        this.stateRepository = stateRepository;
        this.presenterProvider = presenterProvider;
        this.connectedPlayersRepository = connectedPlayersRepository;
    }
    CreatePlayerFromId.prototype.execute = function (playerId, scene, connection) {
        var playerInfo = this.infoRepository.getPlayer(playerId);
        if (playerInfo === undefined)
            throw new Error("Player with ID: ".concat(playerId, " not found"));
        var playerState = this.stateRepository.getPlayerState(playerId) || DefaultPlayerState_1.DefaultPlayerState;
        var view = new playerView_1.PhaserPlayerView(scene, playerState.position.x, playerState.position.y, playerConfiguration_1.DefaultConfiguration.height, playerConfiguration_1.DefaultConfiguration.width);
        scene.addToLifecycle(view);
        var player = new player_1.Player(playerInfo, playerState, view);
        this.presenterProvider.forPlayer(player, new playerSocketInput_1.PlayerSocketInput(playerId, connection, serverProvider_1.ServerProvider.playerInputRequestRepository));
        this.connectedPlayersRepository.savePlayer(playerId, player);
        return player;
    };
    return CreatePlayerFromId;
}());
exports.CreatePlayerFromId = CreatePlayerFromId;
