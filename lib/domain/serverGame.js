"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerGame = void 0;
var gameEvents_1 = require("../infrastructure/events/gameEvents");
var providePlayerFromId_1 = require("../domain/actions/providePlayerFromId");
var ServerRenderDelegator_1 = require("../view/ServerRenderDelegator");
var providePlayerStateDto_1 = require("./actions/providePlayerStateDto");
var ServerGame = /** @class */ (function () {
    function ServerGame(gameScene, coreProvider) {
        this.provider = coreProvider;
        this.gameScene = gameScene;
        this.render = new ServerRenderDelegator_1.ServerRenderDelegator();
        this.connectedPlayers = new Map();
        //Mock player added 
        this.listenEvents();
    }
    ServerGame.prototype.listenEvents = function () {
        var _this = this;
        this.provider.connectionsRepository.onNewConnection()
            .subscribe(function (connection) {
            connection.onPlayerConnection()
                .subscribe(function (_a) {
                var playerId = _a.playerId;
                try {
                    var player = providePlayerFromId_1.ProvidePlayerFromId(parseInt(playerId, 10), _this.provider.playerInfoRepository, _this.provider.playerStateRepository, _this.gameScene, _this.render);
                    var state_1 = providePlayerStateDto_1.ProvidePlayerStateDto(player);
                    _this.gameScene.addPlayers([player]);
                    connection.sendInitialStateEvent(Array.from(_this.connectedPlayers.values()).map(function (c) { return c.stateDto; }));
                    _this.connectedPlayers.forEach(function (p) { return p.con.sendNewPlayerConnected(state_1); });
                    _this.connectedPlayers.set(player.info.id.toString(), { con: connection, player: player, stateDto: state_1 });
                    console.log("[Game addPlayer] player added to scene with id: " + playerId);
                }
                catch (error) {
                    console.log("[Game addPlayer] ERROR: " + error);
                }
            });
        });
        this.provider.connectionsRepository.onDisconnection()
            .subscribe(function (connection) {
        });
        this.gameScene.onUpdate.subscribe(function (_a) {
            var time = _a.time, delta = _a.delta;
            var data = Array.from(_this.connectedPlayers.values()).map(function (p) { return ({ id: p.player.info.id, position: p.player.view.body.position }); });
            var event = gameEvents_1.GameEvents.PLAYERS_POSITIONS.getEvent(data);
            _this.connectedPlayers.forEach(function (p) {
                p.con.socket.emit(gameEvents_1.GameEvents.PLAYERS_POSITIONS.name, event);
            });
        });
    };
    ServerGame.prototype.addPlayer = function (playerId, connection) {
    };
    return ServerGame;
}());
exports.ServerGame = ServerGame;
