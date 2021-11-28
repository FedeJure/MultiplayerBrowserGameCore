"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidePlayerData = void 0;
var player_1 = require("../../domain/player");
var playerState_1 = require("../../domain/playerState");
var playerView_1 = require("../../view/playerView");
var playerConfiguration_1 = require("../playerConfiguration");
function ProvidePlayerData(playerId, playerInfoRepository, playerStateRepository, scene, render) {
    var playerInfo = playerInfoRepository.getPlayer(playerId);
    if (playerInfo === undefined)
        throw new Error("Player with ID: " + playerId + " not found");
    var playerState = playerStateRepository.getPlayerState(playerId);
    if (playerState === undefined) {
        playerState = new playerState_1.PlayerState(playerConfiguration_1.DefaultConfiguration.initialX, playerConfiguration_1.DefaultConfiguration.initialY, playerConfiguration_1.DefaultConfiguration.initialLife, playerConfiguration_1.DefaultConfiguration.initialJumps);
    }
    var view = new playerView_1.PlayerView(scene, playerState.position.x, playerState.position.y, render);
    return new player_1.Player(playerConfiguration_1.DefaultConfiguration, playerInfo, playerState, view);
}
exports.ProvidePlayerData = ProvidePlayerData;
