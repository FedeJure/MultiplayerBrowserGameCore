"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitClientGame = exports.InitGame = void 0;
var serverGamePresenter_1 = require("./presentation/serverGamePresenter");
var socketIoEvents_1 = require("./infrastructure/events/socketIoEvents");
var serverProvider_1 = require("./infrastructure/providers/serverProvider");
var clientProvider_1 = require("./infrastructure/providers/clientProvider");
var GameScene_1 = require("./view/scenes/GameScene");
var socketClientConnection_1 = require("./infrastructure/socketClientConnection");
var DefaultGameConfigs_1 = require("./infrastructure/configuration/DefaultGameConfigs");
var LoadScene_1 = require("./view/scenes/LoadScene");
var socketServerConnection_1 = require("./infrastructure/socketServerConnection");
var socketRoomConnection_1 = require("./infrastructure/socketRoomConnection");
var Logger_1 = require("./infrastructure/Logger");
var GameplayHud_1 = require("./view/scenes/GameplayHud");
var localPlayerRepository_1 = require("./infrastructure/repositories/localPlayerRepository");
var actionProvider_1 = require("./infrastructure/providers/actionProvider");
var DefaultPlayerState_1 = require("./infrastructure/configuration/DefaultPlayerState");
var InitGame = function (socket) {
    var scene = new GameScene_1.GameScene(serverProvider_1.ServerProvider.collisionsDispatcher);
    var config = __assign(__assign({}, DefaultGameConfigs_1.ServerConfig), { scene: scene });
    var _ = new Phaser.Game(config);
    for (var i = 1; i <= 200; i++) {
        serverProvider_1.ServerProvider.playerInfoRepository.addPlayer(i.toString(), {
            id: i.toString(),
            name: "Test Player " + i,
        });
        serverProvider_1.ServerProvider.playerStateRepository.setPlayerState(i.toString(), DefaultPlayerState_1.DefaultPlayerState);
    }
    var room = new socketRoomConnection_1.SocketRoomConnection(socket, "main");
    var game = new serverGamePresenter_1.ServerGamePresenter(scene, room, actionProvider_1.ActionProvider.CreatePlayerFromId, serverProvider_1.ServerProvider.connectionsRepository, serverProvider_1.ServerProvider.connectedPlayerRepository, serverProvider_1.ServerProvider.playerStateRepository);
    socket.on(socketIoEvents_1.SocketIOEvents.CONNECTION, function (clientSocket) {
        var emitFn = clientSocket.emit;
        clientSocket.emit = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            setTimeout(function () {
                return emitFn.apply(clientSocket, args);
            }, 500);
            return true;
        };
        var connection = new socketClientConnection_1.SocketClientConnection(clientSocket);
        room.join(connection);
        serverProvider_1.ServerProvider.connectionsRepository.addConnection(connection);
        Logger_1.Log("InitServerGame", "[Event: " + socketIoEvents_1.SocketIOEvents.CONNECTION + "] :: with connection id: " + clientSocket.id);
        clientSocket.on(socketIoEvents_1.SocketIOEvents.DISCONNECT, function () {
            serverProvider_1.ServerProvider.connectionsRepository.removeConnection(connection.connectionId);
            Logger_1.Log("InitServerGame", "[Event: " + socketIoEvents_1.SocketIOEvents.DISCONNECT + "] :: with connection id: " + clientSocket.id);
        });
    });
};
exports.InitGame = InitGame;
var InitClientGame = function (socket, localPlayerId) {
    var connectionWithServer = new socketServerConnection_1.SocketServerConnection(socket);
    clientProvider_1.ClientProvider.Init(connectionWithServer, new localPlayerRepository_1.LocalPlayerRepository(localPlayerId));
    var scene = new GameScene_1.GameScene(clientProvider_1.ClientProvider.collisionsDispatcher);
    var config = __assign(__assign({}, DefaultGameConfigs_1.ClientConfig), { scene: [new LoadScene_1.LoadScene(), scene, new GameplayHud_1.GameplayHud(connectionWithServer)] });
    new Phaser.Game(config);
    clientProvider_1.ClientProvider.presenterProvider.forGameplay(scene);
};
exports.InitClientGame = InitClientGame;
