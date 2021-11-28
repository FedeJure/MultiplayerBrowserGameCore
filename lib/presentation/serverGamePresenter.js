"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerGamePresenter = void 0;
var gameEvents_1 = require("../infrastructure/events/gameEvents");
var Logger_1 = require("../infrastructure/Logger");
var ServerGamePresenter = /** @class */ (function () {
    function ServerGamePresenter(gameScene, room, createPlayerFromId, connectionsRepository, connectedPlayers, playerStates) {
        var _this = this;
        this.gameScene = gameScene;
        this.room = room;
        this.createPlayer = createPlayerFromId;
        this.connectionsRepository = connectionsRepository;
        this.connectedPlayers = connectedPlayers;
        this.playerStates = playerStates;
        this.playerConnections = new Map();
        this.gameScene.onCreate.subscribe(function () {
            _this.listenEvents();
        });
    }
    ServerGamePresenter.prototype.listenEvents = function () {
        var _this = this;
        this.connectionsRepository
            .onNewConnection()
            .subscribe(function (connection) {
            connection.onPlayerConnection().subscribe(function (_a) {
                var playerId = _a.playerId;
                try {
                    var player = _this.createPlayer.execute(playerId, _this.gameScene, connection);
                    _this.connectedPlayers.savePlayer(playerId, player);
                    _this.playerConnections.set(connection.connectionId, playerId);
                    connection.sendInitialStateEvent(Array.from(_this.connectedPlayers
                        .getAll()).map(function (player) { return ({ id: player[0], state: player[1].state, info: player[1].info }); }));
                    _this.room.emit(gameEvents_1.GameEvents.NEW_PLAYER_CONNECTED.name, gameEvents_1.GameEvents.NEW_PLAYER_CONNECTED.getEvent({
                        id: player.info.id,
                        info: player.info,
                        state: player.state,
                    }));
                    (0, Logger_1.Log)(_this, "[Game addPlayer] player added to scene with id: ".concat(playerId));
                }
                catch (error) {
                    (0, Logger_1.Log)(_this, "[Game addPlayer] ERROR: ".concat(error));
                }
            });
        });
        this.connectionsRepository
            .onDisconnection()
            .subscribe(function (connection) {
            var playerId = _this.playerConnections.get(connection.connectionId);
            if (playerId) {
                _this.room.emit(gameEvents_1.GameEvents.PLAYER_DISCONNECTED.name, gameEvents_1.GameEvents.PLAYER_DISCONNECTED.getEvent(playerId));
                var player = _this.connectedPlayers.getPlayer(playerId);
                if (player) {
                    player.destroy();
                    _this.connectedPlayers.removePlayer(playerId);
                }
            }
            _this.playerConnections.delete(connection.connectionId);
        });
        this.gameScene.onUpdate.subscribe(function (_a) {
            var time = _a.time, delta = _a.delta;
            _this.room.emit(gameEvents_1.GameEvents.PLAYERS_STATES.name, gameEvents_1.GameEvents.PLAYERS_STATES.getEvent(_this.playerStates.getAll()));
        });
    };
    return ServerGamePresenter;
}());
exports.ServerGamePresenter = ServerGamePresenter;
